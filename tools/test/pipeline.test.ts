import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";
import Ajv from "ajv/dist/2020";
import { V2Contract } from "../src/compat";
import {
  ruralMigrations,
  classifyRuralMigrationCandidates,
  MANIFEST_ENTITY_TYPES,
  validateManifest,
} from "../src/pipeline";
import { assertUniquePublicIds, idFor } from "../src/project";
import { coordinateSchema } from "../src/schema";
import { officialName } from "../src/source";
import { normalizeMigrationName, normalizePersianText } from "../src/text";
import { CanonicalEntity, CanonicalModel, Datasets } from "../src/types";
import { buildCanonicalModel } from "../src/model";
import { parseOfficialWorkbook } from "../src/source";
import { loadUrbanZoneContract } from "../src/urban-zones";

const root = resolve(__dirname, "../..");
const ExplorerCore = require(join(root, "docs", "assets", "explorer-core.js"));
const emptyDatasets = (): Datasets => ({
  provinces: [],
  counties: [],
  districts: [],
  rurals: [],
  cities: [],
  "cities-filtered": [],
  "urban-zones": [],
  villages: [],
  all: [],
});
const rural = (name: string): CanonicalEntity => ({
  type: "rural",
  key: "rural:00:01:02:0001",
  parentKey: "district:00:01:02",
  coderec: "5",
  name,
  codes: { province: "00", county: "01", district: "02", rural: "0001" },
});
const migrationContract = (
  rurals: V2Contract["datasets"]["rurals"],
): V2Contract => ({
  note: "synthetic test fixture",
  sourceCommit: "not-used-by-tests",
  datasets: { provinces: [], counties: [], districts: [], cities: [], rurals },
});
function migrationInput(name = "current rural") {
  const entity = rural(name);
  const model: CanonicalModel = {
    entities: [entity],
    byKey: new Map([[entity.key, entity]]),
    sourceRows: [],
    sourceCounts: {} as CanonicalModel["sourceCounts"],
  };
  const data = emptyDatasets();
  data.rurals.push({
    id: idFor(entity),
    name,
    slug: "current-rural",
    province_id: 100,
    county_id: 1000001,
    district_id: 100000100,
  });
  return { entity, model, data };
}

test("Persian compatibility normalization handles Arabic forms, whitespace, and ZWNJ", () => {
  assert.equal(normalizePersianText(" ي ك "), "ی ک");
  assert.equal(
    normalizeMigrationName("شريف آباد"),
    normalizeMigrationName("شریف‌آباد"),
  );
  assert.equal(
    normalizeMigrationName("  بندرامام  خمینی "),
    normalizeMigrationName("بندرامام‌خمینی"),
  );
  assert.equal(officialName(" خدا آفرین ", 1), "خدا آفرین");
  assert.throws(() => officialName("   ", 99), /Missing official name/);
});

test("rural candidate matching distinguishes exact, normalized, ambiguous, and missing matches", () => {
  const old = {
    id: 10000010001,
    name: "شریف آباد",
    slug: "old",
    province_id: 100,
    county_id: 1000001,
  };
  const exact = {
    legacy_id: old.id,
    id: 100000100020001,
    name: old.name,
    province_id: old.province_id,
    county_id: old.county_id,
  };
  assert.deepEqual(classifyRuralMigrationCandidates(old, [exact]), {
    entity: "rural",
    old_id: old.id,
    new_id: exact.id,
    status: "matched",
    match_basis: "legacy-id-parent-and-name",
    candidate_new_ids: [exact.id],
  });
  const normalized = { ...exact, id: 100000100020002, name: "شريف‌آباد" };
  assert.equal(
    classifyRuralMigrationCandidates(old, [normalized]).match_basis,
    "legacy-id-province-county-normalized-name",
  );
  assert.equal(
    classifyRuralMigrationCandidates(old, [
      normalized,
      { ...normalized, id: 100000100020003 },
    ]).status,
    "ambiguous",
  );
  assert.deepEqual(
    classifyRuralMigrationCandidates(old, [{ ...exact, county_id: 1000002 }]),
    {
      entity: "rural",
      old_id: old.id,
      new_id: null,
      status: "not_found",
      match_basis: "no-current-legacy-id-province-county-normalized-name-match",
      candidate_new_ids: [],
    },
  );
});

test("rural overrides reject unknown, invalid, duplicate, and conflicting mappings", () => {
  const { entity, model, data } = migrationInput();
  const oldId = 1000001001;
  const otherOldId = 1000001002;
  const contract = migrationContract([
    {
      id: oldId,
      name: "old rural",
      slug: "old",
      province_id: 100,
      county_id: 1000001,
    },
    {
      id: otherOldId,
      name: "other old rural",
      slug: "other",
      province_id: 100,
      county_id: 1000001,
    },
  ]);
  const valid = {
    old_id: oldId,
    current_key: entity.key,
    reason: "administrative_reorganization" as const,
  };
  assert.equal(
    ruralMigrations(model, data, contract, [valid])[0].match_basis,
    "compatibility_override",
  );
  assert.throws(
    () => ruralMigrations(model, data, contract, [{ ...valid, old_id: 999 }]),
    /unknown V2 rural ID/,
  );
  assert.throws(
    () =>
      ruralMigrations(model, data, contract, [
        { ...valid, current_key: "rural:99:99:99:9999" },
      ]),
    /current_key must resolve/,
  );
  assert.throws(
    () => ruralMigrations(model, data, contract, [valid, valid]),
    /Duplicate rural migration override old_id/,
  );
  assert.throws(
    () =>
      ruralMigrations(model, data, contract, [
        valid,
        { ...valid, old_id: otherOldId },
      ]),
    /Duplicate rural migration override target/,
  );
  const matching = migrationContract([
    {
      id: oldId,
      name: "current rural",
      slug: "old",
      province_id: 100,
      county_id: 1000001,
    },
  ]);
  assert.throws(
    () => ruralMigrations(model, data, matching, [valid]),
    /conflicts with automatic matched match/,
  );
});

test("public IDs fail closed for unsafe numbers and duplicate records", () => {
  assert.throws(
    () =>
      idFor({
        type: "province",
        key: "province:x",
        parentKey: null,
        coderec: "1",
        name: "x",
        codes: { province: "9007199254740992" },
      }),
    /Unsafe numeric identifier/,
  );
  const data = emptyDatasets();
  data.all.push({ id: 1 }, { id: 1 });
  assert.throws(() => assertUniquePublicIds(data), /Duplicate public IDs/);
});

test("manifest validator accepts the contract and rejects invalid entity types", () => {
  const manifest = {
    entityTypeContract: MANIFEST_ENTITY_TYPES,
    generatedDatasets: Object.entries(MANIFEST_ENTITY_TYPES).map(
      ([name, entityType]) => ({ name, entityType, ...(name === "cities" ? { sourceFaithful: true, officialCoderec: "5" } : {}), ...(name === "urban-zones" ? { parentReference: { field: "city_id", dataset: "cities-filtered" } } : {}), ...(name === "all" ? { sourceFaithful: true, coderec5Type: "city" } : {}) }),
    ),
    enrichmentDatasets: [
      {
        enrichment: true,
        officialAdministrativeSource: false,
        sourceIds: ["coordinate-source"],
      },
      {
        enrichment: true,
        officialAdministrativeSource: false,
        sourceIds: ["coordinate-source"],
      },
    ],
    enrichmentSources: [{ id: "coordinate-source" }],
    llmContexts: [
      { scope: "provinces" },
      { scope: "counties" },
      { scope: "cities-filtered" },
      { scope: "cities" },
      { scope: "urban-zones" },
    ],
  };
  assert.equal(validateManifest(manifest), true);
  assert.equal(
    validateManifest({
      ...manifest,
      generatedDatasets: [{ name: "counties", entityType: "countie" }],
    }),
    false,
  );
});

test("city datasets form the published real-city and urban-zone partition", () => {
  const cities = JSON.parse(readFileSync(join(root, "dist", "json", "cities.json"), "utf8"));
  const realCities = JSON.parse(readFileSync(join(root, "dist", "json", "cities-filtered.json"), "utf8"));
  const urbanZones = JSON.parse(readFileSync(join(root, "dist", "json", "urban-zones.json"), "utf8"));
  assert.equal(cities.length, 1672);
  assert.equal(realCities.length, 1481);
  assert.equal(urbanZones.length, 191);
  const cityIds = new Set(cities.map((record: { id: number }) => record.id));
  const realCityIds = new Set(realCities.map((record: { id: number }) => record.id));
  const urbanZoneIds = new Set(urbanZones.map((record: { id: number }) => record.id));
  assert.equal([...realCityIds].filter((id) => urbanZoneIds.has(id)).length, 0);
  assert.equal(new Set([...realCityIds, ...urbanZoneIds]).size, cityIds.size);
  assert.deepEqual(new Set([...realCityIds, ...urbanZoneIds]), cityIds);
  assert.ok(realCities.some((record: { name: string }) => record.name === "قورچی باشی"));
  const realCitiesById = new Map<number, { id: number; province_id: number; county_id: number; district_id: number }>(realCities.map((record: { id: number; province_id: number; county_id: number; district_id: number }): [number, { id: number; province_id: number; county_id: number; district_id: number }] => [record.id, record]));
  assert.equal(urbanZones.filter((record: { city_id: number }) => Number.isInteger(record.city_id) && realCitiesById.has(record.city_id)).length, 191);
  assert.equal(urbanZones.filter((record: { id: number; city_id: number; province_id: number; county_id: number; district_id: number }) => { const parent = realCitiesById.get(record.city_id)!; return record.id === record.city_id || record.province_id !== parent.province_id || record.county_id !== parent.county_id || record.district_id !== parent.district_id; }).length, 0);
  const all = JSON.parse(readFileSync(join(root, "dist", "json", "all.json"), "utf8"));
  const allById = new Map<number, { id: number; type: string }>(all.map((record: { id: number; type: string }): [number, { id: number; type: string }] => [record.id, record]));
  assert.equal(urbanZones.filter((record: { id: number }) => allById.get(record.id)?.type === "city").length, 191);
  assert.equal(all.filter((record: { type: string }) => record.type === "urban-zone").length, 0);
  assert.equal(all.filter((record: object) => Object.prototype.hasOwnProperty.call(record, "city_id")).length, 0);
});

test("Urban Zone registry matches deterministic official-source evidence", () => {
  const model = buildCanonicalModel(parseOfficialWorkbook(join(root, "offical", "list.xlsx")).rows);
  const contract = loadUrbanZoneContract(root, model);
  assert.deepEqual(contract.evidence, { expectedUrbanZones: 191, actualUrbanZones: 191, derivedCandidates: 191, resolved: 191, unresolved: 0, ambiguous: 0, committedParentMismatches: 0 });
});

test("Explorer projects the published city partition without city aliases", () => {
  const cities = JSON.parse(readFileSync(join(root, "dist", "json", "cities.json"), "utf8"));
  const realCities = JSON.parse(readFileSync(join(root, "dist", "json", "cities-filtered.json"), "utf8"));
  const urbanZones = JSON.parse(readFileSync(join(root, "dist", "json", "urban-zones.json"), "utf8"));
  const core = JSON.parse(readFileSync(join(root, "docs", "data", "search-core.json"), "utf8"));
  const explorerCities = core.filter((record: { type: string }) => record.type === "city");
  const explorerUrbanZones = core.filter((record: { type: string }) => record.type === "urban-zone");
  assert.equal(explorerCities.length, 1481);
  assert.equal(explorerUrbanZones.length, 191);
  const cityIds = new Set(cities.map((record: { id: number }) => record.id));
  const realCityIds = new Set(realCities.map((record: { id: number }) => record.id));
  const urbanZoneIds = new Set(urbanZones.map((record: { id: number }) => record.id));
  const explorerCityIds = new Set(explorerCities.map((record: { id: number }) => record.id));
  const explorerUrbanZoneIds = new Set(explorerUrbanZones.map((record: { id: number }) => record.id));
  assert.deepEqual(explorerCityIds, realCityIds);
  assert.deepEqual(explorerUrbanZoneIds, urbanZoneIds);
  assert.equal([...explorerCityIds].filter((id) => explorerUrbanZoneIds.has(id)).length, 0);
  assert.deepEqual(new Set([...explorerCityIds, ...explorerUrbanZoneIds]), cityIds);
  const arakOne = explorerUrbanZones.find((record: { name: string }) => record.name === "اراک 1");
  assert.equal(arakOne?.type, "urban-zone");
  assert.deepEqual(ExplorerCore.searchRecords(core, "اراک 1", "city"), []);
  assert.equal(ExplorerCore.searchRecords(core, "اراک 1", "urban-zone")[0]?.type, "urban-zone");
  assert.equal(ExplorerCore.publicRecord(arakOne).type, "urban-zone");
  const index = ExplorerCore.indexRecords(core);
  assert.equal(arakOne?.city_id, core.find((record: { type: string; name: string }) => record.type === "city" && record.name === "اراک")?.id);
  assert.deepEqual(ExplorerCore.breadcrumb(arakOne, index).map((record: { type: string }) => record.type), ["province", "county", "district", "city", "urban-zone"]);
  assert.equal(ExplorerCore.publicRecord(arakOne).city_id, arakOne?.city_id);
  const context = ExplorerCore.formatAiContext(arakOne, index, { sourceYear: 1404, datasetVersion: "3.1.2" });
  assert.match(context, /selected_entity: urban-zone/);
  assert.match(context, /urban zone = ناحیه شهری; not a real city/);
  assert.match(context, /city_id identifies the parent real city/);
  assert.match(context, /"name":"اراک"/);
});

test("LLM city contexts state the real-city and urban-zone partition", () => {
  const cities = readFileSync(join(root, "dist", "llm", "cities.txt"), "utf8");
  const realCities = readFileSync(join(root, "dist", "llm", "cities-filtered.txt"), "utf8");
  const urbanZones = readFileSync(join(root, "dist", "llm", "urban-zones.txt"), "utf8");
  assert.match(cities, /cities = complete CODEREC=5 projection; contains 1481 real cities and 191 urban zones/);
  assert.match(cities, /Use cities-filtered for real cities only; use urban-zones for urban zones only/);
  assert.match(realCities, /cities-filtered = real cities only; excludes urban zones/);
  assert.match(urbanZones, /urban zone = ناحیه شهری; not a real city/);
  assert.match(urbanZones, /city_id identifies the parent real city in cities-filtered/);
});

test("coordinate schema rejects out-of-range, mistyped, and extra fields", () => {
  const validate = new Ajv({ allErrors: true, strict: false }).compile({
    ...coordinateSchema,
    $ref: "#/$defs/province-capitals",
  });
  const valid = [
    {
      province_id: 100,
      province_name: "مرکزی",
      center_name: "اراک",
      latitude: 34.1,
      longitude: 49.7,
      source_id: "source",
      source_feature_id: "feature",
      source_name: "GeoNames",
    },
  ];
  assert.equal(validate(valid), true);
  for (const [field, value] of [
    ["latitude", 90.0001],
    ["longitude", 180.0001],
    ["latitude", "34.1"],
    ["province_id", "100"],
  ] as const) {
    const altered = structuredClone(valid);
    altered[0][field] = value;
    assert.equal(validate(altered), false);
  }
  assert.equal(validate([{ ...valid[0], unexpected: true }]), false);
});

test("Explorer ranking, filtering, breadcrumbs, public copies, and AI context remain distinct", () => {
  const province = {
    type: "province",
    id: 100,
    name: "کرمان",
    slug: "kerman",
    tel_prefix: "034",
  };
  const county = {
    type: "county",
    id: 1000001,
    name: "رفسنجان",
    slug: "rafsanjan",
    province_id: 100,
  };
  const district = {
    type: "district",
    id: 100000100,
    name: "مرکزی",
    slug: "markazi",
    province_id: 100,
    county_id: 1000001,
  };
  const city = {
    type: "city",
    id: 10000010001,
    name: "رفسنجان",
    slug: "rafsanjan-city",
    province_id: 100,
    county_id: 1000001,
    district_id: 100000100,
  };
  const village = {
    type: "village",
    id: "village:00:01:01:0001:000001:6",
    name: "شريف‌آباد",
    slug: "sharif-abad",
    province_id: 100,
    county_id: 1000001,
    district_id: 100000100,
    rural_id: 100000100010001,
    coderec: "6",
    village_code: "000001",
    mapped_rural_code: null,
  };
  const ranked = ExplorerCore.searchRecords(
    [
      { type: "city", id: 1, name: "اراک", slug: "a" },
      { type: "city", id: 2, name: "اراکستان", slug: "b" },
      { type: "city", id: 3, name: "نواراک", slug: "c" },
    ],
    "اراک",
    "all",
  );
  assert.deepEqual(
    ranked.map((record: { id: number }) => record.id),
    [1, 2, 3],
  );
  assert.equal(
    ExplorerCore.normalizeSearch("شريف‌آباد"),
    ExplorerCore.normalizeSearch("شریف آباد"),
  );
  assert.deepEqual(
    ExplorerCore.searchRecords([county, city], "رفسنجان", "all").map(
      (record: { type: string }) => record.type,
    ),
    ["county", "city"],
  );
  assert.deepEqual(
    ExplorerCore.searchRecords([county, city], "رفسنجان", "city").map(
      (record: { type: string }) => record.type,
    ),
    ["city"],
  );
  const index = ExplorerCore.indexRecords([
    province,
    county,
    district,
    city,
    village,
  ]);
  assert.deepEqual(
    ExplorerCore.breadcrumb(city, index).map(
      (record: { type: string }) => record.type,
    ),
    ["province", "county", "district", "city"],
  );
  assert.deepEqual(ExplorerCore.publicRecord(village), {
    id: village.id,
    name: village.name,
    slug: village.slug,
    province_id: 100,
    county_id: 1000001,
    district_id: 100000100,
    rural_id: 100000100010001,
    coderec: "6",
    village_code: "000001",
    mapped_rural_code: null,
  });
  const context = ExplorerCore.formatAiContext(city, index, {
    sourceYear: 1404,
    datasetVersion: "3.0.0",
  });
  assert.match(context, /project: list-of-cities-in-Iran/);
  assert.match(context, /repository: https:\/\/github\.com\/sajaddp\/list-of-cities-in-Iran/);
  assert.match(context, /maintainer: Sajad Dehshiri/);
  assert.match(context, /selected_entity: city/);
  assert.match(context, /county and city are different entity types/);
});

test("Explorer filter and Escape transitions reset only incompatible state", () => {
  const county = { type: "county", id: 1, name: "رفسنجان" };
  const city = { type: "city", id: 2, name: "رفسنجان" };
  assert.deepEqual(
    ExplorerCore.changeFilterState(
      { filter: "county", selected: county, activeIndex: 0 },
      "city",
    ),
    { filter: "city", selected: null, activeIndex: -1 },
  );
  assert.equal(
    ExplorerCore.changeFilterState(
      { filter: "county", selected: county, activeIndex: 0 },
      "all",
    ).selected,
    county,
  );
  assert.deepEqual(
    ExplorerCore.clearSearchState({
      query: "رفسنجان",
      selected: city,
      activeIndex: 1,
    }),
    { query: "", selected: null, activeIndex: -1 },
  );
  assert.equal(ExplorerCore.moveActiveResult(-1, "ArrowDown", 2), 0);
  assert.equal(ExplorerCore.moveActiveResult(0, "ArrowUp", 2), 0);
  assert.equal(ExplorerCore.moveActiveResult(0, "ArrowDown", 2), 1);
  assert.equal(
    ExplorerCore.canUseSelected(city, { filter: "county", selected: city }),
    false,
  );
});

test("README keeps its structural and generated-data contract", () => {
  const readme = readFileSync(join(root, "README.md"), "utf8");
  const manifest = JSON.parse(
    readFileSync(join(root, "dist", "manifest.json"), "utf8"),
  );
  const [persian, english, extra] = readme.split(
    "\n## List of Cities and Provinces in Iran\n",
  );
  assert.equal(readme.split("\n")[0], "# لیست شهرها و استان‌های ایران");
  assert.equal(
    extra,
    undefined,
    "Persian and English sections must remain separate",
  );
  assert.equal(
    readme
      .split("\n")
      .filter((line) => line.trim())
      .at(-1),
    "Made with ❤ by [Sajad Dehshiri](https://sajaddehshiri.ir)",
  );
  const persianYear = String(manifest.officialSourceYear).replace(
    /\d/g,
    (digit: string) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)],
  );
  assert.ok(persian.includes(`**${persianYear}**`));
  assert.ok(
    english.includes(
      `Current official source year: **${manifest.officialSourceYear}**`,
    ),
  );
  for (const dataset of manifest.generatedDatasets) {
    assert.ok(
      persian.includes(`| \`${dataset.name}\` | ${dataset.rowCount} |`),
    );
    assert.ok(
      english.includes(`| \`${dataset.name}\` | ${dataset.rowCount} |`),
    );
    for (const file of Object.values(dataset.paths) as string[])
      assert.ok(existsSync(join(root, file)), `Missing ${file}`);
  }
  for (const file of [
    "dist/manifest.json",
    "dist/schema.json",
    "docs/llms.txt",
  ])
    assert.ok(readme.includes(file));
});

test("Pages shell keeps local assets, lazy villages, safe rendering, and repository downloads", () => {
  const page = readFileSync(join(root, "docs", "index.html"), "utf8");
  const app = readFileSync(join(root, "docs", "assets", "app.js"), "utf8");
  for (const file of [
    "docs/assets/styles.css",
    "docs/assets/explorer-core.js",
    "docs/assets/app.js",
    "docs/assets/fonts/Estedad[wght].woff2",
    "docs/data/explorer-meta.json",
    "docs/data/search-core.json",
    "docs/data/search-villages.json",
  ])
    assert.ok(existsSync(join(root, file)), `Missing ${file}`);
  assert.ok(!page.match(/https?:\/\/[^\"']*(?:font|fonts)/i));
  assert.ok(
    app.indexOf('fetch("data/search-villages.json")') >
      app.indexOf("async function loadVillages"),
  );
  assert.ok(!app.includes("innerHTML") && !app.includes("eval("));
  const downloads = [
    ...page.matchAll(
      /https:\/\/raw\.githubusercontent\.com\/sajaddp\/list-of-cities-in-Iran\/main\/(dist\/(?:json|csv|xlsx)\/[a-z-]+\.(?:json|csv|xlsx))/g,
    ),
  ]
    .map((match) => match[1])
    .sort();
  const manifest = JSON.parse(
    readFileSync(join(root, "dist", "manifest.json"), "utf8"),
  );
  const expected = manifest.generatedDatasets
    .flatMap((dataset: { paths: Record<string, string> }) =>
      Object.values(dataset.paths),
    )
    .sort();
  assert.deepEqual(downloads, expected);
  const aiDownloads = [
    ...page.matchAll(
      /https:\/\/raw\.githubusercontent\.com\/sajaddp\/list-of-cities-in-Iran\/main\/(dist\/llm\/[a-z-]+\.txt)/g,
    ),
  ]
    .map((match) => match[1])
    .sort();
  assert.deepEqual(aiDownloads, [
    "dist/llm/provinces.txt",
    "dist/llm/counties.txt",
    "dist/llm/cities.txt",
    "dist/llm/cities-filtered.txt",
    "dist/llm/urban-zones.txt",
  ].sort());
});
