import * as fs from "node:fs";
import * as path from "node:path";
import { assertAcyclic, buildCanonicalModel } from "./model";
import { sha256, validateJsonOutputs, verifyFormatParity, writeDatasets, writeSchema } from "./output";
import { idFor, projectDatasets, ruralLegacyId } from "./project";
import { parseOfficialWorkbook } from "./source";
import { DatasetName, Datasets } from "./types";

const names: DatasetName[] = ["provinces", "counties", "districts", "rurals", "cities", "cities-filtered", "villages", "all"];
export interface BuildResult { sourceSha256: string; sourceRows: number; coderecCounts: Record<string, number>; rowCounts: Record<DatasetName, number>; }
function computed(repoRoot: string): { result: BuildResult; datasets: Datasets; inspection: ReturnType<typeof parseOfficialWorkbook>["inspection"]; model: ReturnType<typeof buildCanonicalModel> } {
  const parsed = parseOfficialWorkbook(path.join(repoRoot, "offical", "list.xlsx")); const model = buildCanonicalModel(parsed.rows); assertAcyclic(model); const datasets = projectDatasets(model);
  const result = { sourceSha256: sha256(fs.readFileSync(path.join(repoRoot, "offical", "list.xlsx"))), sourceRows: parsed.rows.length, coderecCounts: parsed.inspection.coderecCounts, rowCounts: Object.fromEntries(names.map((name) => [name, datasets[name].length])) as Record<DatasetName, number> };
  return { result, datasets, inspection: parsed.inspection, model };
}
function report(result: BuildResult, inspection: ReturnType<typeof parseOfficialWorkbook>["inspection"], rowCounts: Record<DatasetName, number>) {
  return { version: "3.0.0-phase1", source: { year: 1404, filename: "offical/list.xlsx", sha256: result.sourceSha256, worksheet: inspection.worksheet, totalRows: inspection.totalRows, coderecCounts: inspection.coderecCounts, nullableColumns: inspection.nullableColumns, samplesByCoderec: inspection.samplesByCoderec }, validation: { supportedRows: result.sourceRows, unhandledRows: 0, duplicateCanonicalKeys: 0, missingParents: 0, orphans: 0, cycles: 0, duplicatePublicIds: 0, unsafeNumericIdentifiers: 0, jsonSchema: "passed", formatParity: "passed", rowCounts, citiesFiltered: { derived: true, rule: "exclude cities whose slug includes '-' or '_'", subset: true }, villages: { sourceCoderecs: ["6", "8"], accountedRows: inspection.coderecCounts["6"] + inspection.coderecCounts["8"] }, idStrategy: { v2Preserved: ["provinces", "counties", "districts", "cities"], rural: "V3 rural IDs add the district code because the V2 formula collides across districts", villages: "namespaced, delimiter-separated source-code IDs" }, normalization: "Arabic/Persian character variants are normalized; punctuation and spacing are preserved." } };
}
function manifest(result: BuildResult) { return { datasetVersion: "3.0.0-phase1", schemaVersion: "3.0.0-phase1", officialSourceYear: 1404, source: { filename: "offical/list.xlsx", sha256: result.sourceSha256 }, generatedDatasets: names.map((name) => ({ name, entityType: name === "cities-filtered" ? "city" : name === "rurals" ? "rural" : name.slice(0, -1), derived: name === "cities-filtered", rowCount: result.rowCounts[name], paths: { json: `dist/json/${name}.json`, csv: `dist/csv/${name}.csv`, xlsx: `dist/xlsx/${name}.xlsx` }, ...(name === "cities-filtered" ? { filterRule: "exclude cities whose slug includes '-' or '_'" } : {}) })), generator: { name: "list-of-cities-in-iran-tools", version: "3.0.0-phase1", deterministic: true } }; }
export function buildPipeline(repoRoot: string, distRoot = path.join(repoRoot, "dist")): BuildResult {
  const { result, datasets, inspection, model } = computed(repoRoot); fs.mkdirSync(distRoot, { recursive: true }); writeDatasets(distRoot, datasets); writeSchema(distRoot);
  const migrations = model.entities.filter((entity) => entity.type === "rural").map((entity) => `rural,${ruralLegacyId(entity)},${idFor(entity)},source-path`);
  fs.mkdirSync(path.join(repoRoot, "migration"), { recursive: true }); fs.writeFileSync(path.join(repoRoot, "migration", "v2-to-v3.csv"), `entity,old_id,new_id,match\n${migrations.join("\n")}\n`, "utf8");
  const parity = verifyFormatParity(distRoot); validateJsonOutputs(distRoot);
  fs.writeFileSync(path.join(distRoot, "verification.json"), `${JSON.stringify(report(result, inspection, parity), null, 2)}\n`, "utf8"); fs.writeFileSync(path.join(distRoot, "manifest.json"), `${JSON.stringify(manifest(result), null, 2)}\n`, "utf8"); return result;
}
export function verifyPipeline(repoRoot: string): BuildResult {
  const distRoot = path.join(repoRoot, "dist"); const { result, datasets } = computed(repoRoot); validateJsonOutputs(distRoot); verifyFormatParity(distRoot);
  for (const name of names) { const actual = JSON.parse(fs.readFileSync(path.join(distRoot, "json", `${name}.json`), "utf8")); if (JSON.stringify(actual) !== JSON.stringify(datasets[name])) throw new Error(`Generated JSON is stale for ${name}`); }
  const actualManifest = JSON.parse(fs.readFileSync(path.join(distRoot, "manifest.json"), "utf8")); if (actualManifest.source.sha256 !== result.sourceSha256) throw new Error("Manifest source hash is stale"); return result;
}
