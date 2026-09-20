import * as fs from "node:fs";
import * as path from "node:path";
import { CoordinateDatasets, DatasetName, Datasets, EntityType, PublicRecord } from "./types";

export type ExplorerEntityType = EntityType | "urban-zone";

export interface ExplorerRecord {
  [key: string]: unknown;
  type: ExplorerEntityType;
  id: string | number;
  name: string;
  slug: string;
  center?: {
    label: string;
    name: string;
    latitude: number;
    longitude: number;
    provenance: string;
    source_id: string;
    provenance_status: string;
  };
}

export interface ExplorerMeta {
  datasetVersion: string;
  schemaVersion: string;
  sourceYear: number;
  repository: { url: string; manifest: string; schema: string; provenance: string };
  counts: Record<string, number>;
  coordinates: { provinceCapitals: number; countyCenters: number; provenance: string };
  searchResources: { core: { path: string; rows: number; types: ExplorerEntityType[] }; villages: { path: string; rows: number; types: ExplorerEntityType[]; lazy: true } };
}

const dataNames: Array<[DatasetName, ExplorerEntityType]> = [
  ["provinces", "province"], ["counties", "county"], ["districts", "district"],
  ["rurals", "rural"], ["cities-filtered", "city"], ["urban-zones", "urban-zone"], ["villages", "village"],
];
const coreTypes: ExplorerEntityType[] = ["province", "county", "district", "rural", "city", "urban-zone"];
const clone = (record: PublicRecord): PublicRecord => JSON.parse(JSON.stringify(record)) as PublicRecord;

export function explorerRecords(datasets: Datasets, coordinates: CoordinateDatasets, manifest: Record<string, any>): { core: ExplorerRecord[]; villages: ExplorerRecord[] } {
  const provinceCenters = new Map(coordinates["province-capitals"].map((record) => [Number(record.province_id), record]));
  const countyCenters = new Map(coordinates["county-centers"].map((record) => [Number(record.county_id), record]));
  const provenanceStatus = new Map((manifest.enrichmentSources as Array<{ id: string; status: string }>).map((source) => [source.id, source.status]));
  const records = Object.fromEntries(dataNames.map(([name, type]) => [name, datasets[name].map((record) => {
    const explorer: ExplorerRecord = { ...clone(record), type } as ExplorerRecord;
    const center = type === "province" ? provinceCenters.get(Number(record.id)) : type === "county" ? countyCenters.get(Number(record.id)) : undefined;
    if (center) explorer.center = {
      label: type === "province" ? "مرکز استان / Province capital" : "مرکز اداری شهرستان / County administrative center",
      name: String(center.center_name), latitude: Number(center.latitude), longitude: Number(center.longitude),
      provenance: String(center.source_name), source_id: String(center.source_id), provenance_status: provenanceStatus.get(String(center.source_id)) ?? "unknown",
    };
    return explorer;
  })])) as Record<string, ExplorerRecord[]>;
  return { core: coreTypes.flatMap((type) => records[dataNames.find(([, entityType]) => entityType === type)![0]]), villages: records.villages };
}

export function explorerMeta(manifest: Record<string, any>, records: { core: ExplorerRecord[]; villages: ExplorerRecord[] }): ExplorerMeta {
  const repository = "https://github.com/sajaddp/list-of-cities-in-Iran";
  const generated = manifest.generatedDatasets as Array<{ name: string; rowCount: number }>;
  const countFor = (name: string) => generated.find((item) => item.name === name)?.rowCount;
  if (!manifest.datasetVersion || !manifest.schemaVersion || !Number.isInteger(manifest.officialSourceYear) || dataNames.some(([name]) => countFor(name) === undefined)) throw new Error("Manifest cannot produce explorer metadata");
  return {
    datasetVersion: manifest.datasetVersion, schemaVersion: manifest.schemaVersion, sourceYear: manifest.officialSourceYear,
    repository: { url: repository, manifest: `${repository}/blob/main/dist/manifest.json`, schema: `${repository}/blob/main/dist/schema.json`, provenance: `${repository}/blob/main/enrichment/coordinates/sources.json` },
    counts: Object.fromEntries(generated.map((item) => [item.name, item.rowCount])),
    coordinates: { provinceCapitals: manifest.enrichmentDatasets.find((item: { name: string }) => item.name === "province-capitals")?.rowCount, countyCenters: manifest.enrichmentDatasets.find((item: { name: string }) => item.name === "county-centers")?.rowCount, provenance: `${repository}/blob/main/enrichment/coordinates/sources.json` },
    searchResources: { core: { path: "data/search-core.json", rows: records.core.length, types: coreTypes }, villages: { path: "data/search-villages.json", rows: records.villages.length, types: ["village"], lazy: true } },
  };
}

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

export function writeExplorerData(repoRoot: string, datasets: Datasets, coordinates: CoordinateDatasets, manifest: Record<string, any>, outputRoot = path.join(repoRoot, "docs", "data")): ExplorerMeta {
  const records = explorerRecords(datasets, coordinates, manifest);
  const meta = explorerMeta(manifest, records);
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.writeFileSync(path.join(outputRoot, "explorer-meta.json"), json(meta), "utf8");
  fs.writeFileSync(path.join(outputRoot, "search-core.json"), json(records.core), "utf8");
  fs.writeFileSync(path.join(outputRoot, "search-villages.json"), json(records.villages), "utf8");
  return meta;
}

export interface ExplorerVerification { coreRows: number; villageRows: number; duplicateSearchIds: number; invalidEntityReferences: number; invalidParentReferences: number; }

export interface ExplorerShellVerification { fontPath: string; fontFormat: "woff2"; variableWeightRange: "100 900"; externalFontDependencies: 0; }

export function verifyExplorerShell(repoRoot: string): ExplorerShellVerification {
  const pagePath = path.join(repoRoot, "docs", "index.html");
  const stylesheetPath = path.join(repoRoot, "docs", "assets", "styles.css");
  const fontPath = path.join(repoRoot, "docs", "assets", "fonts", "Estedad[wght].woff2");
  const licensePath = path.join(repoRoot, "docs", "assets", "fonts", "OFL.txt");
  const page = fs.readFileSync(pagePath, "utf8");
  const stylesheet = fs.readFileSync(stylesheetPath, "utf8");
  const font = fs.readFileSync(fontPath);
  if (!fs.existsSync(licensePath)) throw new Error("Explorer Estedad license notice is missing");
  if (font.subarray(0, 4).toString("ascii") !== "wOF2") throw new Error("Explorer Estedad asset is not a WOFF2 file");
  if (!stylesheet.includes('@font-face { font-family:"Estedad"; src:url("./fonts/Estedad%5Bwght%5D.woff2") format("woff2"); font-style:normal; font-weight:100 900; font-display:swap; }')) throw new Error("Explorer Estedad @font-face contract is missing or invalid");
  if (!stylesheet.includes('font-family:"Estedad", sans-serif')) throw new Error("Explorer Estedad is not the primary UI font");
  if (!stylesheet.includes("input,button,select,textarea { font:inherit; }")) throw new Error("Explorer form controls do not inherit the UI font");
  if (/(?:@import\s+(?:url\()?\s*["']?https?:\/\/|src\s*:\s*url\(\s*["']?https?:\/\/)/i.test(stylesheet)) throw new Error("Explorer CSS has an external font dependency");
  if (/<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']https?:\/\/)/i.test(page)) throw new Error("Explorer HTML has an external stylesheet dependency");
  return { fontPath: "docs/assets/fonts/Estedad[wght].woff2", fontFormat: "woff2", variableWeightRange: "100 900", externalFontDependencies: 0 };
}

export function verifyExplorerData(repoRoot: string, datasets: Datasets, coordinates: CoordinateDatasets, manifest: Record<string, any>, outputRoot = path.join(repoRoot, "docs", "data")): ExplorerVerification {
  verifyExplorerShell(repoRoot);
  const expected = explorerRecords(datasets, coordinates, manifest);
  const expectedMeta = explorerMeta(manifest, expected);
  const actualCore = JSON.parse(fs.readFileSync(path.join(outputRoot, "search-core.json"), "utf8")) as ExplorerRecord[];
  const actualVillages = JSON.parse(fs.readFileSync(path.join(outputRoot, "search-villages.json"), "utf8")) as ExplorerRecord[];
  const actualMeta = JSON.parse(fs.readFileSync(path.join(outputRoot, "explorer-meta.json"), "utf8")) as ExplorerMeta;
  if (JSON.stringify(actualCore) !== JSON.stringify(expected.core) || JSON.stringify(actualVillages) !== JSON.stringify(expected.villages) || JSON.stringify(actualMeta) !== JSON.stringify(expectedMeta)) throw new Error("Explorer Pages data is stale or invalid");
  const all = [...actualCore, ...actualVillages];
  const duplicates = all.length - new Set(all.map((record) => `${record.type}:${record.id}`)).size;
  const byType = new Map(dataNames.map(([name, type]) => [type, new Map(datasets[name].map((record) => [String(record.id), record]))]));
  const parentType: Partial<Record<ExplorerEntityType, Array<[string, ExplorerEntityType]>>> = {
    county: [["province_id", "province"]], district: [["province_id", "province"], ["county_id", "county"]],
    rural: [["province_id", "province"], ["county_id", "county"], ["district_id", "district"]],
    city: [["province_id", "province"], ["county_id", "county"], ["district_id", "district"]],
    "urban-zone": [["province_id", "province"], ["county_id", "county"], ["district_id", "district"]],
    village: [["province_id", "province"], ["county_id", "county"], ["district_id", "district"], ["rural_id", "rural"]],
  };
  let invalidEntityReferences = 0, invalidParentReferences = 0;
  for (const record of all) {
    const exact = byType.get(record.type)?.get(String(record.id));
    if (!exact || JSON.stringify({ ...record, type: undefined, center: undefined }) !== JSON.stringify({ ...exact, type: undefined, center: undefined })) invalidEntityReferences += 1;
    for (const [field, type] of parentType[record.type] ?? []) if (!byType.get(type)?.has(String(record[field]))) invalidParentReferences += 1;
  }
  if (duplicates || invalidEntityReferences || invalidParentReferences) throw new Error(`Explorer data integrity failed: duplicates=${duplicates}, entityReferences=${invalidEntityReferences}, parentReferences=${invalidParentReferences}`);
  return { coreRows: actualCore.length, villageRows: actualVillages.length, duplicateSearchIds: duplicates, invalidEntityReferences, invalidParentReferences };
}
