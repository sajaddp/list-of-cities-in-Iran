import * as fs from "node:fs";
import * as path from "node:path";
import { CanonicalEntity, EntityType } from "./types";

/**
 * This fixture is a snapshot of V2's public output contract, not geographic
 * source data. Geographic names and hierarchy continue to come exclusively
 * from offical/list.xlsx and CODEREC semantics from offical/coderec.md.
 */
export interface V2Record { id: number; name: string; slug: string; province_id?: number; county_id?: number; tel_prefix?: string; }
export type V2Dataset = "provinces" | "counties" | "districts" | "cities" | "rurals";
export interface V2Contract { note: string; sourceCommit: string; datasets: Record<V2Dataset, V2Record[]>; }
export type RuralMigrationOverrideReason = "administrative_reorganization" | "official_name_change";
export interface RuralMigrationOverride { old_id: number; current_key: string; reason: RuralMigrationOverrideReason; }
const datasetFor: Record<Exclude<EntityType, "village">, V2Dataset> = { province: "provinces", county: "counties", district: "districts", city: "cities", rural: "rurals" };

export function loadV2Contract(repoRoot: string): V2Contract {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, "compat", "v2-public-contract.json"), "utf8")) as V2Contract;
}
export function loadV2RuralMigrationOverrides(repoRoot: string): RuralMigrationOverride[] {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, "compat", "v2-rural-migration-overrides.json"), "utf8")) as RuralMigrationOverride[];
}
export function legacyIdFor(entity: CanonicalEntity): number {
  const province = 100 + Number(entity.codes.province);
  const county = Number(`${province}000${Number(entity.codes.county)}`);
  switch (entity.type) {
    case "province": return province;
    case "county": return county;
    case "district": return Number(`${county}00${Number(entity.codes.district)}`);
    case "city": case "rural": return Number(`${county}00${Number(entity.codes.rural)}`);
    case "village": throw new Error("V2 did not publish village IDs");
  }
}
export function v2RecordFor(contract: V2Contract, entity: CanonicalEntity): V2Record | undefined {
  if (entity.type === "village") return undefined;
  const dataset = datasetFor[entity.type];
  const id = legacyIdFor(entity);
  return contract.datasets[dataset].find((record) => record.id === id);
}
