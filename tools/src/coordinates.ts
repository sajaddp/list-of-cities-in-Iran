import * as fs from "node:fs";
import * as path from "node:path";
import Ajv from "ajv/dist/2020";
import { CoordinateDatasetName, CoordinateDatasets, CoordinateRecord, Datasets, PublicRecord } from "./types";
import { coordinateSchema } from "./schema";

export const COORDINATE_DATASET_COLUMNS: Record<CoordinateDatasetName, readonly string[]> = {
  "province-capitals": ["province_id", "province_name", "center_name", "latitude", "longitude", "source_id"],
  "county-centers": ["county_id", "county_name", "province_id", "center_name", "latitude", "longitude", "source_id"],
};
export const COORDINATE_DATASET_NAMES: CoordinateDatasetName[] = ["province-capitals", "county-centers"];
const SOURCE_HEADERS = ["id", "provider", "source_url", "accessed_on", "license", "status", "notes"] as const;

export interface CoordinateSource { id: string; provider: string; source_url: string; accessed_on: string; license: string; status: "official" | "derived" | "non-official"; notes: string; }
export interface CoordinateSourceRegistry { sources: CoordinateSource[]; identity_sources: Array<{ id: string; provider: string; source_url: string; accessed_on: string; license: string; notes: string }>; }

function parseCsv(file: string): Record<string, string>[] {
  const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
  const headers = lines.shift()?.split(",");
  if (!headers) throw new Error(`Missing coordinate CSV header: ${file}`);
  return lines.map((line, index) => {
    const cells = line.split(",");
    if (cells.length !== headers.length) throw new Error(`Malformed coordinate CSV row ${index + 2}: ${file}`);
    return Object.fromEntries(headers.map((header, cell) => [header, cells[cell]]));
  });
}

function sourceRecords(file: string, name: CoordinateDatasetName): CoordinateRecord[] {
  const expected = COORDINATE_DATASET_COLUMNS[name];
  const rows = parseCsv(file);
  if (!rows.length) throw new Error(`Coordinate source is empty: ${file}`);
  const columns = Object.keys(rows[0]);
  if (JSON.stringify(columns) !== JSON.stringify(expected)) throw new Error(`Unexpected coordinate source columns: ${file}`);
  return rows.map((row) => Object.fromEntries(expected.map((column) => {
    const value = row[column];
    return [column, column === "latitude" || column === "longitude" || column === "province_id" || column === "county_id" ? Number(value) : value];
  })));
}

export function loadCoordinateSources(repoRoot: string): { datasets: CoordinateDatasets; registry: CoordinateSourceRegistry } {
  const root = path.join(repoRoot, "enrichment", "coordinates");
  const registry = JSON.parse(fs.readFileSync(path.join(root, "sources.json"), "utf8")) as CoordinateSourceRegistry;
  if (!Array.isArray(registry.sources) || !Array.isArray(registry.identity_sources) || !registry.sources.every((source) => SOURCE_HEADERS.every((key) => typeof source[key] === "string"))) throw new Error("Invalid coordinate source registry");
  return { datasets: {
    "province-capitals": sourceRecords(path.join(root, "province-capitals.csv"), "province-capitals"),
    "county-centers": sourceRecords(path.join(root, "county-centers.csv"), "county-centers"),
  }, registry };
}

export function validateCoordinateDatasets(datasets: CoordinateDatasets, administrative: Datasets, registry: CoordinateSourceRegistry): void {
  const ajv = new Ajv({ allErrors: true, strict: false });
  for (const name of COORDINATE_DATASET_NAMES) {
    const validate = ajv.compile({ ...coordinateSchema, $ref: `#/$defs/${name}` });
    if (!validate(datasets[name])) throw new Error(`Coordinate schema validation failed for ${name}: ${ajv.errorsText(validate.errors)}`);
    const expected = COORDINATE_DATASET_COLUMNS[name];
    const ids = new Set<string>();
    for (const record of datasets[name]) {
      if (JSON.stringify(Object.keys(record)) !== JSON.stringify(expected)) throw new Error(`Coordinate columns are invalid for ${name}`);
      const id = String(record[name === "province-capitals" ? "province_id" : "county_id"]);
      if (ids.has(id)) throw new Error(`Duplicate coordinate entity ID in ${name}: ${id}`); ids.add(id);
      const latitude = Number(record.latitude), longitude = Number(record.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude === 0 || longitude === 0 || latitude < 24 || latitude > 40.5 || longitude < 44 || longitude > 64.5) throw new Error(`Coordinate outside Iran sanity bounds in ${name}: ${id}`);
      if (!registry.sources.some((source) => source.id === record.source_id)) throw new Error(`Unknown coordinate source_id in ${name}: ${record.source_id}`);
    }
  }
  const provinces = new Map(administrative.provinces.map((record) => [Number(record.id), record]));
  const counties = new Map(administrative.counties.map((record) => [Number(record.id), record]));
  const cities = administrative.cities;
  if (datasets["province-capitals"].length !== provinces.size || datasets["county-centers"].length !== counties.size) throw new Error("Coordinate coverage does not equal canonical entity coverage");
  for (const record of datasets["province-capitals"]) {
    const province = provinces.get(Number(record.province_id));
    if (!province || province.name !== record.province_name) throw new Error(`Province coordinate identity mismatch: ${record.province_id}`);
    if (!cities.some((city) => city.province_id === record.province_id && city.name === record.center_name)) throw new Error(`Province capital is not a canonical city: ${record.province_id}`);
  }
  for (const record of datasets["county-centers"]) {
    const county = counties.get(Number(record.county_id));
    if (!county || county.name !== record.county_name || county.province_id !== record.province_id) throw new Error(`County coordinate identity mismatch: ${record.county_id}`);
    if (!cities.some((city) => city.county_id === record.county_id && city.name === record.center_name)) throw new Error(`County center is not a canonical city: ${record.county_id}`);
  }
}

export function coordinateMetrics(datasets: CoordinateDatasets, administrative: Datasets, registry: CoordinateSourceRegistry) {
  const sources = new Set(registry.sources.map((source) => source.id));
  const metrics = (name: CoordinateDatasetName, id: string) => ({
    expected: name === "province-capitals" ? administrative.provinces.length : administrative.counties.length,
    matched: datasets[name].length,
    missing: (name === "province-capitals" ? administrative.provinces : administrative.counties).filter((record) => !datasets[name].some((coordinate) => coordinate[id] === record.id)).map((record) => record.id),
    duplicates: datasets[name].length - new Set(datasets[name].map((record) => record[id])).size,
    invalidCoordinates: datasets[name].filter((record) => !Number.isFinite(Number(record.latitude)) || !Number.isFinite(Number(record.longitude)) || Number(record.latitude) === 0 || Number(record.longitude) === 0).length,
    missingProvenance: datasets[name].filter((record) => !sources.has(String(record.source_id))).length,
  });
  return { provinceCapitals: metrics("province-capitals", "province_id"), countyCenters: metrics("county-centers", "county_id") };
}

export const coordinateAsPublicRecords = (datasets: CoordinateDatasets): Record<CoordinateDatasetName, PublicRecord[]> => datasets as Record<CoordinateDatasetName, PublicRecord[]>;
