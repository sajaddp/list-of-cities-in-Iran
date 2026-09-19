import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { loadV2Contract } from "../src/compat";
import { buildCanonicalModel } from "../src/model";
import { DATASET_COLUMNS, sha256, verifyFormatParity } from "../src/output";
import { buildPipeline, MANIFEST_ENTITY_TYPES, validateManifest, verifyPipeline } from "../src/pipeline";
import { assertUniquePublicIds, idFor, projectDatasets } from "../src/project";
import { validateDatasets } from "../src/schema";
import { officialName, parseOfficialWorkbook } from "../src/source";
import { normalizePersianText } from "../src/text";
import { Datasets, SourceRow } from "../src/types";

const root = resolve(__dirname, "../..");
const row = (coderec: SourceRow["coderec"], extra: Partial<SourceRow> = {}): SourceRow => ({ provinceCode: "00", provinceName: "مرکزی", countyCode: "01", countyName: "اراک", districtCode: "02", districtName: "مرکزی", ruralCode: "0001", ruralName: "امان آباد", villageCode: "000266", coderec, name: "نام", mappedRuralCode: coderec === "8" ? "3238" : null, rowNumber: 1, ...extra });
const load = (directory: string, name: keyof Datasets) => JSON.parse(readFileSync(join(directory, "json", `${name}.json`), "utf8"));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
function files(directory: string): string[] { return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(join(directory, entry.name)).map((file) => join(entry.name, file)) : [entry.name]); }
function hashes(directory: string): Record<string, string> { return Object.fromEntries(files(directory).sort().map((file) => [file, sha256(readFileSync(join(directory, file)))])); }

test("source parsing rejects whitespace-only official names", () => { assert.equal(officialName(" خدا آفرین ", 1), "خدا آفرین"); assert.throws(() => officialName("   ", 99), /Missing official name/); });
test("manifest uses exact declared entity types", () => { const manifest = { entityTypeContract: MANIFEST_ENTITY_TYPES, generatedDatasets: Object.entries(MANIFEST_ENTITY_TYPES).map(([name, entityType]) => ({ name, entityType })) }; assert.ok(validateManifest(manifest)); for (const invalid of ["countie", "citie", "al"]) { const broken = clone(manifest); broken.generatedDatasets[1].entityType = invalid; assert.equal(validateManifest(broken), false); } });
test("canonical keys preserve padded codes while V3 rural IDs remain collision-safe", () => {
  const rows = [row("1", { countyCode: null, districtCode: null, ruralCode: null, villageCode: null }), row("2", { districtCode: null, ruralCode: null, villageCode: null }), row("3", { ruralCode: null, villageCode: null }), row("4", { villageCode: null }), row("5", { ruralCode: "1101", villageCode: null }), row("6"), row("8", { villageCode: "000267" })];
  const model = buildCanonicalModel(rows); const data = projectDatasets(model, loadV2Contract(root)); assert.ok(model.byKey.has("rural:00:01:02:0001")); assert.equal(data.rurals[0].id, 100000100020001); assert.equal(data.villages[0].id, "village:00:01:02:0001:000266:6");
});
test("source accounting, compatibility fixture, and public compatibility are real", () => {
  const parsed = parseOfficialWorkbook(join(root, "offical/list.xlsx")); assert.deepEqual(parsed.inspection.coderecCounts, { "1": 31, "2": 484, "3": 1193, "4": 2777, "5": 1672, "6": 95389, "8": 3928 }); assert.equal(parsed.inspection.totalRows, 105474);
  const contract = loadV2Contract(root); assert.deepEqual(Object.fromEntries(Object.entries(contract.datasets).map(([name, records]) => [name, records.length])), { provinces: 31, counties: 482, districts: 1184, cities: 1659, rurals: 1524 });
});
test("build has strict schemas, exact parity, V2 IDs/slugs, migration truth, and tel prefixes", () => {
  const directory = mkdtempSync(join(tmpdir(), "iran-cities-v3-"));
  try {
    const result = buildPipeline(root, directory); assert.equal(result.rowCounts.villages, 99317); assert.equal(result.rowCounts.all, 105474); assert.equal(result.rowCounts["cities-filtered"], 1185); assert.ok(verifyFormatParity(directory).passed); verifyPipeline(root);
    const contract = loadV2Contract(root); const current = { provinces: load(directory, "provinces"), counties: load(directory, "counties"), districts: load(directory, "districts"), cities: load(directory, "cities"), rurals: load(directory, "rurals") };
    for (const [name, legacy] of Object.entries(contract.datasets)) { const byId = new Map((current as Record<string, { id: number; slug: string }[]>)[name].map((record) => [record.id, record])); for (const old of legacy) { const next = byId.get(old.id); if (next) { assert.equal(next.id, old.id); assert.equal(next.slug, old.slug); } } }
    for (const [dataset, id, currentName, expected] of [["counties", 10300026, "خدا آفرین", "خداآفرین"], ["counties", 12300012, "رباط‌کریم", "رباط-کریم"], ["cities", 1030003001621, "تبریز 1", "تبریز1"]] as const) { const old = contract.datasets[dataset].find((record) => record.id === id); assert.ok(old, `missing historical example ${id}`); const next = (current as Record<string, { id: number; name: string; slug: string }[]>)[dataset].find((record) => record.id === id); assert.equal(next?.name, currentName); assert.equal(next?.slug, expected); }
    assert.equal(current.provinces.length, 31); for (const province of current.provinces) { const old = contract.datasets.provinces.find((record) => record.id === province.id); assert.ok(province.tel_prefix && province.tel_prefix !== "---"); assert.equal(province.tel_prefix, old?.tel_prefix); }
    const migration = readFileSync(join(root, "migration", "v2-to-v3.csv"), "utf8").trim().split("\n"); assert.equal(migration.length - 1, 1524); const oldIds = new Set(contract.datasets.rurals.map((record) => String(record.id))); const newIds = new Set((current.rurals as { id: number }[]).map((record) => String(record.id))); const seen = new Set<string>(); for (const line of migration.slice(1)) { const [entity, oldId, newId, status, , candidates] = line.split(","); assert.equal(entity, "rural"); assert.ok(oldIds.has(oldId)); assert.ok(!seen.has(oldId)); seen.add(oldId); assert.ok(["matched", "ambiguous", "not_found"].includes(status)); if (status === "matched") assert.ok(newIds.has(newId)); for (const id of candidates.split("|").filter(Boolean)) assert.ok(newIds.has(id)); } assert.equal(seen.size, oldIds.size);
    const all = load(directory, "all"); assert.ok(all.every((record: Record<string, unknown>) => JSON.stringify(Object.keys(record)) === JSON.stringify(DATASET_COLUMNS.all)));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
test("schemas reject invalid IDs, ancestry, fields, village CODEREC, and tel prefixes", () => {
  const directory = mkdtempSync(join(tmpdir(), "iran-schema-v3-")); try { buildPipeline(root, directory); const datasets = Object.fromEntries(["provinces", "counties", "districts", "rurals", "cities", "cities-filtered", "villages", "all"].map((name) => [name, load(directory, name as keyof Datasets)])) as Datasets;
    const numeric = clone(datasets); numeric.counties[0].id = "not-a-number"; assert.throws(() => validateDatasets(numeric), /Schema validation/);
    const ancestry = clone(datasets); delete ancestry.rurals[0].district_id; assert.throws(() => validateDatasets(ancestry), /Schema validation/);
    const wrong = clone(datasets); (wrong.all[0] as Record<string, unknown>).county_id = 1; assert.throws(() => validateDatasets(wrong), /Schema validation/);
    const extra = clone(datasets); (extra.all[0] as Record<string, unknown>).unknown = "no"; assert.throws(() => validateDatasets(extra), /Schema validation/);
    const coderec = clone(datasets); coderec.villages[0].coderec = "5"; assert.throws(() => validateDatasets(coderec), /Schema validation/);
    const tel = clone(datasets); delete tel.provinces[0].tel_prefix; assert.throws(() => validateDatasets(tel), /Schema validation/);
  } finally { rmSync(directory, { recursive: true, force: true }); } });
test("public-ID safety and collision checks fail loudly", () => { assert.throws(() => idFor({ type: "province", key: "province:x", parentKey: null, coderec: "1", name: "x", codes: { province: "9007199254740992" } }), /Unsafe numeric identifier/); assert.throws(() => assertUniquePublicIds({ provinces: [{ id: 1 }], counties: [], districts: [], rurals: [], cities: [], "cities-filtered": [], villages: [], all: [{ id: 1 }, { id: 1 }] }), /Duplicate public IDs/); });
test("every generated artifact is deterministic across independent clean builds", () => { const first = mkdtempSync(join(tmpdir(), "iran-first-")); const second = mkdtempSync(join(tmpdir(), "iran-second-")); try { buildPipeline(root, first); const firstHashes = hashes(first); const firstMigration = sha256(readFileSync(join(root, "migration", "v2-to-v3.csv"))); buildPipeline(root, second); assert.deepEqual(hashes(second), firstHashes); assert.equal(sha256(readFileSync(join(root, "migration", "v2-to-v3.csv"))), firstMigration); } finally { rmSync(first, { recursive: true, force: true }); rmSync(second, { recursive: true, force: true }); } });
