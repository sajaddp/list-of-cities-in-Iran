import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import Ajv from "ajv/dist/2020";
import {
  CoordinateDatasetName,
  CoordinateDatasets,
  CoordinateRecord,
  Datasets,
  PublicRecord,
} from "./types";
import { coordinateSchema } from "./schema";

export const COORDINATE_DATASET_COLUMNS: Record<
  CoordinateDatasetName,
  readonly string[]
> = {
  "province-capitals": [
    "province_id",
    "province_name",
    "center_name",
    "latitude",
    "longitude",
    "source_id",
    "source_feature_id",
    "source_name",
  ],
  "county-centers": [
    "county_id",
    "county_name",
    "province_id",
    "center_name",
    "latitude",
    "longitude",
    "source_id",
    "source_feature_id",
    "source_name",
  ],
};
export const COORDINATE_DATASET_NAMES: CoordinateDatasetName[] = [
  "province-capitals",
  "county-centers",
];
const SOURCE_HEADERS = [
  "id",
  "provider",
  "source_url",
  "accessed_on",
  "license",
  "status",
  "notes",
] as const;
const IDENTITY_HEADERS = [
  "entity_type",
  "entity_id",
  "center_name",
  "identity_source_id",
  "identity_record_id",
  "identity_basis",
] as const;
const GEONAMES_HEADERS = [
  "geonameid",
  "name",
  "asciiname",
  "alternatenames",
  "latitude",
  "longitude",
  "feature_class",
  "feature_code",
  "country_code",
  "cc2",
  "admin1_code",
  "admin2_code",
  "admin3_code",
  "admin4_code",
  "population",
  "elevation",
  "dem",
  "timezone",
  "modification_date",
] as const;
export interface CoordinateSource {
  id: string;
  provider: string;
  source_url: string;
  accessed_on: string;
  license: string;
  status: "official" | "derived" | "non-official";
  notes: string;
  evidence?: { metadata: string; extraction: string };
}
export interface CoordinateSourceRegistry {
  sources: CoordinateSource[];
  identity_sources: Array<{
    id: string;
    provider: string;
    source_url: string;
    accessed_on: string;
    license: string;
    notes: string;
  }>;
}
type CsvRow = Record<string, string>;
export interface CoordinateEvidence {
  features: Map<string, CsvRow>;
  identities: CsvRow[];
  verifiedIdentities: Map<string, CsvRow>;
  sourceMetadata: Map<string, Record<string, unknown>>;
}
const sha256 = (value: string | Buffer) =>
  crypto.createHash("sha256").update(value).digest("hex");
function parseDelimited(file: string, delimiter: string): CsvRow[] {
  const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
  const headers = lines.shift()?.split(delimiter);
  if (!headers) throw new Error(`Missing header: ${file}`);
  return lines.map((line, index) => {
    const cells = line.split(delimiter);
    if (cells.length !== headers.length)
      throw new Error(`Malformed row ${index + 2}: ${file}`);
    return Object.fromEntries(
      headers.map((header, cell) => [header, cells[cell]]),
    );
  });
}
function assertHeaders(
  rows: CsvRow[],
  headers: readonly string[],
  file: string,
): void {
  if (
    !rows.length ||
    JSON.stringify(Object.keys(rows[0])) !== JSON.stringify(headers)
  )
    throw new Error(`Unexpected columns: ${file}`);
}
function sourceRecords(
  file: string,
  name: CoordinateDatasetName,
): CoordinateRecord[] {
  const expected = COORDINATE_DATASET_COLUMNS[name],
    rows = parseDelimited(file, ",");
  assertHeaders(rows, expected, file);
  return rows.map((row) =>
    Object.fromEntries(
      expected.map((column) => [
        column,
        ["latitude", "longitude", "province_id", "county_id"].includes(column)
          ? Number(row[column])
          : row[column],
      ]),
    ),
  );
}
function loadEvidence(
  repoRoot: string,
  registry: CoordinateSourceRegistry,
): CoordinateEvidence {
  const features = new Map<string, CsvRow>(),
    sourceMetadata = new Map<string, Record<string, unknown>>();
  for (const source of registry.sources) {
    if (!source.evidence) continue;
    const metadataFile = path.join(repoRoot, source.evidence.metadata),
      extractionFile = path.join(repoRoot, source.evidence.extraction),
      metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8")) as Record<
        string,
        unknown
      >;
    if (
      metadata.provider !== source.provider ||
      metadata.accessed_on !== source.accessed_on ||
      metadata.status !== "derived/non-official" ||
      metadata.local_extraction_sha256 !==
        sha256(fs.readFileSync(extractionFile))
    )
      throw new Error(`Coordinate evidence metadata is invalid: ${source.id}`);
    const rows = parseDelimited(extractionFile, "\t");
    assertHeaders(rows, GEONAMES_HEADERS, extractionFile);
    for (const row of rows) {
      if (features.has(row.geonameid))
        throw new Error(
          `Duplicate GeoNames feature ID in extraction: ${row.geonameid}`,
        );
      features.set(row.geonameid, row);
    }
    sourceMetadata.set(source.id, metadata);
  }
  const evidenceRoot = path.join(
      repoRoot,
      "enrichment",
      "coordinates",
      "evidence",
    ),
    identities = parseDelimited(
      path.join(evidenceRoot, "center-identities.csv"),
      ",",
    ),
    verified = parseDelimited(
      path.join(evidenceRoot, "verified-center-identities.csv"),
      ",",
    );
  assertHeaders(identities, IDENTITY_HEADERS, "center-identities.csv");
  assertHeaders(
    verified,
    [...IDENTITY_HEADERS, "verification_note"],
    "verified-center-identities.csv",
  );
  const verifiedIdentities = new Map(
    verified.map((row) => [`${row.entity_type}:${row.entity_id}`, row]),
  );
  if (verifiedIdentities.size !== verified.length)
    throw new Error("Duplicate verified center identity record");
  return { features, identities, verifiedIdentities, sourceMetadata };
}
export function loadCoordinateSources(repoRoot: string): {
  datasets: CoordinateDatasets;
  registry: CoordinateSourceRegistry;
  evidence: CoordinateEvidence;
} {
  const root = path.join(repoRoot, "enrichment", "coordinates"),
    registry = JSON.parse(
      fs.readFileSync(path.join(root, "sources.json"), "utf8"),
    ) as CoordinateSourceRegistry;
  if (
    !Array.isArray(registry.sources) ||
    !Array.isArray(registry.identity_sources) ||
    !registry.sources.every((source) =>
      SOURCE_HEADERS.every((key) => typeof source[key] === "string"),
    ) ||
    !registry.identity_sources.every((source) =>
      SOURCE_HEADERS.filter((key) => key !== "status").every(
        (key) => typeof source[key] === "string",
      ),
    )
  )
    throw new Error("Invalid coordinate source registry");
  const evidence = loadEvidence(repoRoot, registry);
  (registry as CoordinateSourceRegistry & { evidence?: CoordinateEvidence }).evidence = evidence;
  return {
    datasets: {
      "province-capitals": sourceRecords(
        path.join(root, "province-capitals.csv"),
        "province-capitals",
      ),
      "county-centers": sourceRecords(
        path.join(root, "county-centers.csv"),
        "county-centers",
      ),
    },
    registry,
    evidence,
  };
}
const identityKey = (record: CoordinateRecord, name: CoordinateDatasetName) =>
  `${name === "province-capitals" ? "province" : "county"}:${record[name === "province-capitals" ? "province_id" : "county_id"]}`;
export function validateCoordinateDatasets(
  datasets: CoordinateDatasets,
  administrative: Datasets,
  registry: CoordinateSourceRegistry,
  evidence = (registry as CoordinateSourceRegistry & { evidence?: CoordinateEvidence }).evidence,
): void {
  if (!evidence) throw new Error("Coordinate evidence is required");
  const ajv = new Ajv({ allErrors: true, strict: false }),
    sources = new Map(registry.sources.map((source) => [source.id, source])),
    identitySources = new Set(
      [...registry.sources, ...registry.identity_sources].map(
        (source) => source.id,
      ),
    ),
    identities = new Map<string, CsvRow>();
  for (const identity of evidence.identities) {
    const key = `${identity.entity_type}:${identity.entity_id}`;
    if (identities.has(key))
      throw new Error(`Duplicate center identity mapping: ${key}`);
    identities.set(key, identity);
  }
  for (const name of COORDINATE_DATASET_NAMES) {
    const validate = ajv.compile({
      ...coordinateSchema,
      $ref: `#/$defs/${name}`,
    });
    if (!validate(datasets[name]))
      throw new Error(
        `Coordinate schema validation failed for ${name}: ${ajv.errorsText(validate.errors)}`,
      );
    const expected = COORDINATE_DATASET_COLUMNS[name],
      ids = new Set<string>();
    for (const record of datasets[name]) {
      if (JSON.stringify(Object.keys(record)) !== JSON.stringify(expected))
        throw new Error(`Coordinate columns are invalid for ${name}`);
      const id = String(
        record[name === "province-capitals" ? "province_id" : "county_id"],
      );
      if (ids.has(id))
        throw new Error(`Duplicate coordinate entity ID in ${name}: ${id}`);
      ids.add(id);
      const latitude = Number(record.latitude),
        longitude = Number(record.longitude);
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude === 0 ||
        longitude === 0 ||
        latitude < 24 ||
        latitude > 40.5 ||
        longitude < 44 ||
        longitude > 64.5
      )
        throw new Error(
          `Coordinate outside Iran sanity bounds in ${name}: ${id}`,
        );
      if (!sources.has(String(record.source_id)))
        throw new Error(
          `Unknown coordinate source_id in ${name}: ${record.source_id}`,
        );
      const feature = evidence.features.get(String(record.source_feature_id));
      if (!feature)
        throw new Error(
          `Unknown coordinate source_feature_id in ${name}: ${record.source_feature_id}`,
        );
      if (
        feature.name !== record.source_name ||
        Number(feature.latitude) !== latitude ||
        Number(feature.longitude) !== longitude ||
        feature.country_code !== "IR" ||
        !feature.admin1_code
      )
        throw new Error(`Coordinate snapshot mismatch in ${name}: ${id}`);
      const key = identityKey(record, name),
        identity = identities.get(key);
      if (!identity)
        throw new Error(`Missing center identity evidence: ${key}`);
      if (
        identity.center_name !== record.center_name ||
        !identitySources.has(identity.identity_source_id) ||
        !identity.identity_record_id
      )
        throw new Error(`Invalid center identity evidence: ${key}`);
      if (
        identity.identity_basis === "geonames_admin_feature" &&
        identity.identity_record_id !== record.source_feature_id
      )
        throw new Error(`GeoNames identity record mismatch: ${key}`);
      if (
        identity.identity_basis === "verified_override" &&
        !evidence.verifiedIdentities.has(key)
      )
        throw new Error(`Missing verified center identity record: ${key}`);
      if (
        !["geonames_admin_feature", "verified_override"].includes(
          identity.identity_basis,
        )
      )
        throw new Error(
          `Unknown center identity basis: ${identity.identity_basis}`,
        );
    }
  }
  const provinces = new Map(
      administrative.provinces.map((record) => [Number(record.id), record]),
    ),
    counties = new Map(
      administrative.counties.map((record) => [Number(record.id), record]),
    ),
    cities = administrative.cities;
  if (
    datasets["province-capitals"].length !== provinces.size ||
    datasets["county-centers"].length !== counties.size
  )
    throw new Error(
      "Coordinate coverage does not equal canonical entity coverage",
    );
  for (const record of datasets["province-capitals"]) {
    const province = provinces.get(Number(record.province_id));
    if (!province || province.name !== record.province_name)
      throw new Error(
        `Province coordinate identity mismatch: ${record.province_id}`,
      );
    if (
      !cities.some(
        (city) =>
          city.province_id === record.province_id &&
          city.name === record.center_name,
      )
    )
      throw new Error(
        `Province capital is not a canonical city: ${record.province_id}`,
      );
  }
  for (const record of datasets["county-centers"]) {
    const county = counties.get(Number(record.county_id));
    if (
      !county ||
      county.name !== record.county_name ||
      county.province_id !== record.province_id
    )
      throw new Error(
        `County coordinate identity mismatch: ${record.county_id}`,
      );
    if (
      !cities.some(
        (city) =>
          city.county_id === record.county_id &&
          city.name === record.center_name,
      )
    )
      throw new Error(
        `County center is not a canonical city: ${record.county_id}`,
      );
  }
  if (
    identities.size !==
    datasets["province-capitals"].length + datasets["county-centers"].length
  )
    throw new Error("Center identity evidence has orphaned or missing targets");
}
export function coordinateMetrics(
  datasets: CoordinateDatasets,
  administrative: Datasets,
  registry: CoordinateSourceRegistry,
  evidence: CoordinateEvidence,
) {
  const sources = new Set(registry.sources.map((source) => source.id)),
    all = COORDINATE_DATASET_NAMES.flatMap((name) => datasets[name]),
    identities = new Map(
      evidence.identities.map((identity) => [
        `${identity.entity_type}:${identity.entity_id}`,
        identity,
      ]),
    );
  const metrics = (name: CoordinateDatasetName, id: string) => ({
    expected:
      name === "province-capitals"
        ? administrative.provinces.length
        : administrative.counties.length,
    matched: datasets[name].length,
    missing: (name === "province-capitals"
      ? administrative.provinces
      : administrative.counties
    )
      .filter(
        (record) =>
          !datasets[name].some((coordinate) => coordinate[id] === record.id),
      )
      .map((record) => record.id),
    duplicates:
      datasets[name].length -
      new Set(datasets[name].map((record) => record[id])).size,
    invalidCoordinates: datasets[name].filter(
      (record) =>
        !Number.isFinite(Number(record.latitude)) ||
        !Number.isFinite(Number(record.longitude)) ||
        Number(record.latitude) === 0 ||
        Number(record.longitude) === 0,
    ).length,
    missingProvenance: datasets[name].filter(
      (record) => !sources.has(String(record.source_id)),
    ).length,
  });
  const invalidSourceFeatureIds = all.filter(
      (record) => !evidence.features.has(String(record.source_feature_id)),
    ).length,
    coordinateSnapshotMatches = all.filter((record) => {
      const source = evidence.features.get(String(record.source_feature_id));
      return (
        source?.name === record.source_name &&
        Number(source?.latitude) === record.latitude &&
        Number(source?.longitude) === record.longitude
      );
    }).length,
    identityEvidenceResolved = all.filter((record) =>
      identities.has(
        record.county_id
          ? `county:${record.county_id}`
          : `province:${record.province_id}`,
      ),
    ).length;
  return {
    provinceCapitals: metrics("province-capitals", "province_id"),
    countyCenters: metrics("county-centers", "county_id"),
    coordinateRows: all.length,
    sourceFeatureIdsResolved: all.length - invalidSourceFeatureIds,
    coordinateSnapshotMatches,
    identityEvidenceRows: evidence.identities.length,
    identityEvidenceResolved,
    missingIdentityEvidence: all.length - identityEvidenceResolved,
    duplicateIdentityMappings: evidence.identities.length - identities.size,
    invalidSourceFeatureIds,
  };
}
export const coordinateAsPublicRecords = (
  datasets: CoordinateDatasets,
): Record<CoordinateDatasetName, PublicRecord[]> =>
  datasets as Record<CoordinateDatasetName, PublicRecord[]>;
