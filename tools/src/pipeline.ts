import * as fs from "node:fs";
import * as path from "node:path";
import { assertAcyclic, buildCanonicalModel } from "./model";
import { loadV2Contract, legacyIdFor, V2Contract, V2Dataset } from "./compat";
import { sha256, validateJsonOutputs, verifyFormatParity, writeDatasets, writeSchema } from "./output";
import { idFor, projectDatasets } from "./project";
import { schemaResult } from "./schema";
import { parseOfficialWorkbook } from "./source";
import { DatasetName, Datasets, PublicRecord } from "./types";
import { duplicatePublicIds, exactSubset, measureModel, unsafeIdentifiers } from "./validation";
import { normalizePersianText } from "./text";

const names: DatasetName[] = ["provinces", "counties", "districts", "rurals", "cities", "cities-filtered", "villages", "all"];
export const MANIFEST_ENTITY_TYPES: Record<DatasetName, string> = { provinces: "province", counties: "county", districts: "district", rurals: "rural", cities: "city", "cities-filtered": "city", villages: "village", all: "mixed" };
export interface BuildResult { sourceSha256: string; sourceRows: number; coderecCounts: Record<string, number>; rowCounts: Record<DatasetName, number>; }
interface Computed { result: BuildResult; datasets: Datasets; inspection: ReturnType<typeof parseOfficialWorkbook>["inspection"]; model: ReturnType<typeof buildCanonicalModel>; contract: V2Contract; }
function computed(repoRoot: string): Computed {
  const parsed = parseOfficialWorkbook(path.join(repoRoot, "offical", "list.xlsx")); const model = buildCanonicalModel(parsed.rows); assertAcyclic(model);
  const contract = loadV2Contract(repoRoot); const datasets = projectDatasets(model, contract);
  const result = { sourceSha256: sha256(fs.readFileSync(path.join(repoRoot, "offical", "list.xlsx"))), sourceRows: parsed.rows.length, coderecCounts: parsed.inspection.coderecCounts, rowCounts: Object.fromEntries(names.map((name) => [name, datasets[name].length])) as Record<DatasetName, number> };
  return { result, datasets, inspection: parsed.inspection, model, contract };
}
interface Migration { entity: "rural"; old_id: number; new_id: number | null; status: "matched" | "ambiguous" | "not_found"; match_basis: string; candidate_new_ids: number[]; }
function ruralMigrations(model: Computed["model"], data: Datasets, contract: V2Contract): Migration[] {
  const ruralById = new Map(data.rurals.map((record) => [String(record.id), record]));
  const candidates = model.entities.filter((entity) => entity.type === "rural").map((entity) => ({ entity, record: ruralById.get(String(idFor(entity)))! }));
  return contract.datasets.rurals.map((old) => {
    const matches = candidates.filter(({ entity, record }) => legacyIdFor(entity) === old.id && record.province_id === old.province_id && record.county_id === old.county_id && normalizePersianText(String(record.name)) === normalizePersianText(old.name));
    const candidate_new_ids = matches.map(({ record }) => Number(record.id)).sort((a, b) => a - b);
    if (candidate_new_ids.length === 1) return { entity: "rural", old_id: old.id, new_id: candidate_new_ids[0], status: "matched", match_basis: "legacy-id-parent-and-name", candidate_new_ids };
    if (candidate_new_ids.length > 1) return { entity: "rural", old_id: old.id, new_id: null, status: "ambiguous", match_basis: "legacy-id-parent-and-name", candidate_new_ids };
    return { entity: "rural", old_id: old.id, new_id: null, status: "not_found", match_basis: "no-current-exact-parent-and-name-match", candidate_new_ids: [] };
  });
}
function migrationMetrics(migrations: Migration[], contract: V2Contract, data: Datasets) {
  const old = new Set(contract.datasets.rurals.map((record) => record.id)); const next = new Set(data.rurals.map((record) => Number(record.id)));
  const invalidOldIds = migrations.filter((record) => !old.has(record.old_id)).length;
  const invalidNewIds = migrations.filter((record) => record.new_id !== null && !next.has(record.new_id)).length + migrations.flatMap((record) => record.candidate_new_ids).filter((id) => !next.has(id)).length;
  return { actualV2RuralRows: old.size, migrationRecords: migrations.length, matched: migrations.filter((record) => record.status === "matched").length, ambiguous: migrations.filter((record) => record.status === "ambiguous").length, not_found: migrations.filter((record) => record.status === "not_found").length, invalidOldIds, invalidNewIds, complete: new Set(migrations.map((record) => record.old_id)).size === old.size && migrations.every((record) => old.has(record.old_id)) };
}
function migrationCsv(migrations: Migration[]): string { const rows = migrations.map((record) => `${record.entity},${record.old_id},${record.new_id ?? ""},${record.status},${record.match_basis},${record.candidate_new_ids.join("|")}`); return `entity,old_id,new_id,status,match_basis,candidate_new_ids\n${rows.join("\n")}\n`; }
function writeMigration(repoRoot: string, migrations: Migration[]): void { fs.writeFileSync(path.join(repoRoot, "migration", "v2-to-v3.csv"), migrationCsv(migrations), "utf8"); }
function compatibility(data: Datasets, contract: V2Contract) {
  const pairs: [V2Dataset, DatasetName][] = [["provinces", "provinces"], ["counties", "counties"], ["districts", "districts"], ["cities", "cities"]];
  return Object.fromEntries(pairs.map(([historicalName, currentName]) => { const historical = contract.datasets[historicalName]; const byId = new Map(historical.map((record) => [record.id, record])); const matches = data[currentName].filter((record) => byId.has(Number(record.id))); return [historicalName, { historicalEntities: historical.length, historicalEntitiesMatched: matches.length, idsPreserved: matches.filter((record) => byId.get(Number(record.id))!.id === record.id).length, slugsPreserved: matches.filter((record) => byId.get(Number(record.id))!.slug === record.slug).length, intentionalOrUnavoidableDifferences: historical.length - matches.length }]; }));
}
function manifest(result: BuildResult) { return { datasetVersion: "3.0.0-phase1", schemaVersion: "3.0.0-phase1", officialSourceYear: 1404, source: { filename: "offical/list.xlsx", sha256: result.sourceSha256 }, entityTypeContract: MANIFEST_ENTITY_TYPES, generatedDatasets: names.map((name) => ({ name, entityType: MANIFEST_ENTITY_TYPES[name], derived: name === "cities-filtered", rowCount: result.rowCounts[name], paths: { json: `dist/json/${name}.json`, csv: `dist/csv/${name}.csv`, xlsx: `dist/xlsx/${name}.xlsx` }, ...(name === "cities-filtered" ? { filterRule: "exclude cities whose current-name filter slug includes '-' or '_'" } : {}) })), generator: { name: "list-of-cities-in-iran-tools", version: "3.0.0-phase1", deterministic: true } }; }
export function validateManifest(value: unknown): boolean { if (!value || typeof value !== "object") return false; const candidate = value as { entityTypeContract?: unknown; generatedDatasets?: unknown }; if (JSON.stringify(candidate.entityTypeContract) !== JSON.stringify(MANIFEST_ENTITY_TYPES) || !Array.isArray(candidate.generatedDatasets) || candidate.generatedDatasets.length !== names.length) return false; return candidate.generatedDatasets.every((dataset) => { if (!dataset || typeof dataset !== "object") return false; const item = dataset as { name?: DatasetName; entityType?: string }; return Boolean(item.name && item.entityType === MANIFEST_ENTITY_TYPES[item.name]); }); }
function report(computedResult: Computed, migrations: Migration[], parity: ReturnType<typeof verifyFormatParity>) {
  const { result, inspection, model, datasets, contract } = computedResult; const modelMetrics = measureModel(model); const schema = schemaResult(datasets); const migration = migrationMetrics(migrations, contract, datasets);
  return { version: "3.0.0-phase1", source: { year: 1404, filename: "offical/list.xlsx", sha256: result.sourceSha256, worksheet: inspection.worksheet, totalRows: inspection.totalRows, coderecCounts: inspection.coderecCounts, nullableColumns: inspection.nullableColumns, samplesByCoderec: inspection.samplesByCoderec }, validation: {
    supportedRows: result.sourceRows, unhandledRows: inspection.totalRows - result.sourceRows, ...modelMetrics, orphans: modelMetrics.missingParents, duplicatePublicIds: duplicatePublicIds(datasets), unsafeNumericIdentifiers: unsafeIdentifiers(model), jsonSchema: schema, formatParity: parity, rowCounts: result.rowCounts,
    citiesFiltered: { derived: true, rule: "exclude cities whose current-name filter slug includes '-' or '_'", subset: exactSubset(datasets["cities-filtered"], datasets.cities) }, villages: { sourceCoderecs: ["6", "8"], accountedRows: inspection.coderecCounts["6"] + inspection.coderecCounts["8"] },
    manifest: { passed: validateManifest(manifest(result)), entityTypes: MANIFEST_ENTITY_TYPES }, v2Compatibility: compatibility(datasets, contract), migration,
    idStrategy: { legacyPublicIds: "V2 formulas parse source segments numerically; canonical keys retain padded source strings", rural: "V3 fixed-width district+rural suffix prevents V2 cross-district collisions", villages: "namespaced, delimiter-separated source-code IDs" }, allContract: { fields: ["id", "type", "name", "slug", "tel_prefix", "province_id", "county_id", "district_id", "rural_id", "coderec", "village_code", "mapped_rural_code"], nullableTabularCellsDecodeAs: "null" },
  } };
}
export function buildPipeline(repoRoot: string, distRoot = path.join(repoRoot, "dist")): BuildResult { const value = computed(repoRoot); fs.mkdirSync(distRoot, { recursive: true }); writeDatasets(distRoot, value.datasets); writeSchema(distRoot); const migrations = ruralMigrations(value.model, value.datasets, value.contract); writeMigration(repoRoot, migrations); const parity = verifyFormatParity(distRoot); if (!parity.passed) throw new Error(`Format parity failed: ${parity.errors.join("; ")}`); validateJsonOutputs(distRoot); fs.writeFileSync(path.join(distRoot, "verification.json"), `${JSON.stringify(report(value, migrations, parity), null, 2)}\n`, "utf8"); fs.writeFileSync(path.join(distRoot, "manifest.json"), `${JSON.stringify(manifest(value.result), null, 2)}\n`, "utf8"); return value.result; }
export function verifyPipeline(repoRoot: string): BuildResult { const distRoot = path.join(repoRoot, "dist"); const value = computed(repoRoot); validateJsonOutputs(distRoot); const parity = verifyFormatParity(distRoot); if (!parity.passed) throw new Error(`Format parity failed: ${parity.errors.join("; ")}`); for (const name of names) { const actual = JSON.parse(fs.readFileSync(path.join(distRoot, "json", `${name}.json`), "utf8")); if (JSON.stringify(actual) !== JSON.stringify(value.datasets[name])) throw new Error(`Generated JSON is stale for ${name}`); }
  const migrations = ruralMigrations(value.model, value.datasets, value.contract); const metrics = migrationMetrics(migrations, value.contract, value.datasets); if (!metrics.complete || metrics.invalidOldIds || metrics.invalidNewIds || fs.readFileSync(path.join(repoRoot, "migration", "v2-to-v3.csv"), "utf8") !== migrationCsv(migrations)) throw new Error("Migration contract is invalid or stale"); const actualManifest = JSON.parse(fs.readFileSync(path.join(distRoot, "manifest.json"), "utf8")); if (!validateManifest(actualManifest) || JSON.stringify(actualManifest) !== JSON.stringify(manifest(value.result))) throw new Error("Manifest is stale or invalid"); const actualReport = JSON.parse(fs.readFileSync(path.join(distRoot, "verification.json"), "utf8")); if (JSON.stringify(actualReport) !== JSON.stringify(report(value, migrations, parity))) throw new Error("Verification report is stale"); return value.result; }
