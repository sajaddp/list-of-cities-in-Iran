import * as fs from "node:fs";
import * as path from "node:path";
import { CanonicalEntity, CanonicalModel } from "./types";
import { normalizeMigrationName, normalizePersianText } from "./text";

const sourcePath = "classification/urban-zones.json";
export const URBAN_ZONE_COUNT = 191;

export interface UrbanZoneEntry { city_key: string; parent_city_key: string; }
export interface UrbanZoneEvidence { expectedUrbanZones: number; actualUrbanZones: number; derivedCandidates: number; resolved: number; unresolved: number; ambiguous: number; committedParentMismatches: number; }
export interface UrbanZoneContract {
  entries: readonly UrbanZoneEntry[];
  keys: ReadonlySet<string>;
  parentByCityKey: ReadonlyMap<string, string>;
  evidence: UrbanZoneEvidence;
  provenance: { official_administrative_source: string; coderec_semantics_reference: string; official_coderec_5_semantics: string; classification: string; method: string };
}

const sameAncestry = (left: CanonicalEntity, right: CanonicalEntity) => left.codes.province === right.codes.province && left.codes.county === right.codes.county && left.codes.district === right.codes.district;
const zoneBaseName = (name: string): string | null => {
  const normalized = normalizePersianText(name);
  return /\s+\d+$/.test(normalized) ? normalized.replace(/\s+\d+$/, "") : null;
};

/** Derives the project semantic split directly from all current CODEREC=5 source entities. */
export function deriveUrbanZoneEvidence(model: CanonicalModel): { candidates: Map<string, CanonicalEntity>; parents: Map<string, CanonicalEntity[]> } {
  const cities = model.entities.filter((entity) => entity.type === "city");
  const candidates = new Map(cities.filter((city) => zoneBaseName(city.name) !== null).map((city) => [city.key, city]));
  const parents = new Map([...candidates.values()].map((candidate) => {
    const base = zoneBaseName(candidate.name)!;
    return [candidate.key, cities.filter((city) => !candidates.has(city.key) && sameAncestry(city, candidate) && normalizeMigrationName(city.name) === normalizeMigrationName(base))];
  }));
  return { candidates, parents };
}

/** Loads and independently verifies the authoritative public Urban Zone semantic contract. */
export function loadUrbanZoneContract(repoRoot: string, model: CanonicalModel): UrbanZoneContract {
  const value = JSON.parse(fs.readFileSync(path.join(repoRoot, sourcePath), "utf8")) as { description?: unknown; provenance?: Partial<UrbanZoneContract["provenance"]>; urban_zones?: unknown };
  const provenance = value.provenance;
  if (!value || typeof value.description !== "string" || !provenance || typeof provenance.official_administrative_source !== "string" || typeof provenance.coderec_semantics_reference !== "string" || typeof provenance.official_coderec_5_semantics !== "string" || typeof provenance.classification !== "string" || typeof provenance.method !== "string" || !Array.isArray(value.urban_zones) || !value.urban_zones.every((entry) => entry && typeof entry === "object" && typeof (entry as UrbanZoneEntry).city_key === "string" && typeof (entry as UrbanZoneEntry).parent_city_key === "string")) throw new Error("Invalid urban-zone classification source");
  const checkedProvenance = { official_administrative_source: provenance.official_administrative_source, coderec_semantics_reference: provenance.coderec_semantics_reference, official_coderec_5_semantics: provenance.official_coderec_5_semantics, classification: provenance.classification, method: provenance.method };
  const entries = value.urban_zones as UrbanZoneEntry[];
  const keys = new Set(entries.map((entry) => entry.city_key));
  if (entries.length !== URBAN_ZONE_COUNT) throw new Error(`Urban-zone classification must contain exactly ${URBAN_ZONE_COUNT} entries`);
  if (keys.size !== entries.length) throw new Error("Duplicate urban-zone classification key");
  const parents = new Map(entries.map((entry) => [entry.city_key, entry.parent_city_key]));
  const cities = new Map(model.entities.filter((entity) => entity.type === "city").map((entity) => [entity.key, entity]));
  const derived = deriveUrbanZoneEvidence(model);
  const expected = new Set(derived.candidates.keys());
  const unresolved = [...derived.parents.values()].filter((matches) => matches.length === 0).length;
  const ambiguous = [...derived.parents.values()].filter((matches) => matches.length > 1).length;
  const committedParentMismatches = entries.filter((entry) => {
    const matches = derived.parents.get(entry.city_key);
    return !matches || matches.length !== 1 || matches[0].key !== entry.parent_city_key;
  }).length;
  if (expected.size !== URBAN_ZONE_COUNT || keys.size !== expected.size || [...keys].some((key) => !expected.has(key)) || [...expected].some((key) => !keys.has(key))) throw new Error("Urban-zone classification does not equal the complete independently derived candidate set");
  if (unresolved || ambiguous || committedParentMismatches) throw new Error(`Urban-zone evidence failed: unresolved=${unresolved}, ambiguous=${ambiguous}, parentMismatches=${committedParentMismatches}`);
  for (const entry of entries) {
    const city = cities.get(entry.city_key); const parent = cities.get(entry.parent_city_key);
    if (!city) throw new Error(`Urban-zone classification key is not a current city: ${entry.city_key}`);
    if (!parent) throw new Error(`Urban-zone parent is not a current city: ${entry.parent_city_key}`);
    if (keys.has(parent.key)) throw new Error(`Urban-zone parent is also an urban zone: ${parent.key}`);
    if (city.key === parent.key) throw new Error(`Urban-zone parent cannot be self: ${city.key}`);
    if (!sameAncestry(city, parent)) throw new Error(`Urban-zone parent ancestry mismatch: ${city.key}`);
  }
  return { entries, keys, parentByCityKey: parents, evidence: { expectedUrbanZones: URBAN_ZONE_COUNT, actualUrbanZones: entries.length, derivedCandidates: expected.size, resolved: expected.size - unresolved - ambiguous, unresolved, ambiguous, committedParentMismatches }, provenance: checkedProvenance };
}

export const URBAN_ZONE_CLASSIFICATION_SOURCE = sourcePath;
