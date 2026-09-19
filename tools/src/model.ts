import { CanonicalEntity, CanonicalModel, Coderec, EntityType, SourceRow } from "./types";
import { normalizePersianText } from "./text";

const types: Record<Coderec, EntityType> = { "1": "province", "2": "county", "3": "district", "4": "rural", "5": "city", "6": "village", "8": "village" };
function need(row: SourceRow, key: "countyCode" | "districtCode" | "ruralCode" | "villageCode"): string { const value = row[key]; if (!value) throw new Error(`Missing ${key} at source row ${row.rowNumber}`); return value; }
export function canonicalKey(type: EntityType, row: SourceRow): string {
  switch (type) {
    case "province": return `province:${row.provinceCode}`;
    case "county": return `county:${row.provinceCode}:${need(row, "countyCode")}`;
    case "district": return `district:${row.provinceCode}:${need(row, "countyCode")}:${need(row, "districtCode")}`;
    case "rural": return `rural:${row.provinceCode}:${need(row, "countyCode")}:${need(row, "districtCode")}:${need(row, "ruralCode")}`;
    case "city": return `city:${row.provinceCode}:${need(row, "countyCode")}:${need(row, "districtCode")}:${need(row, "ruralCode")}`;
    case "village": return `village:${row.provinceCode}:${need(row, "countyCode")}:${need(row, "districtCode")}:${need(row, "ruralCode")}:${need(row, "villageCode")}:${row.coderec}`;
  }
}
function parentKey(type: EntityType, row: SourceRow): string | null {
  switch (type) {
    case "province": return null;
    case "county": return `province:${row.provinceCode}`;
    case "district": return `county:${row.provinceCode}:${need(row, "countyCode")}`;
    case "rural": case "city": return `district:${row.provinceCode}:${need(row, "countyCode")}:${need(row, "districtCode")}`;
    case "village": return `rural:${row.provinceCode}:${need(row, "countyCode")}:${need(row, "districtCode")}:${need(row, "ruralCode")}`;
  }
}
export function buildCanonicalModel(rows: SourceRow[]): CanonicalModel {
  const byKey = new Map<string, CanonicalEntity>(); const sourceCounts = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "8": 0 } as Record<Coderec, number>;
  for (const row of rows) {
    sourceCounts[row.coderec] += 1; const type = types[row.coderec]; const key = canonicalKey(type, row);
    if (byKey.has(key)) throw new Error(`Duplicate canonical key ${key} at source row ${row.rowNumber}`);
    byKey.set(key, { type, key, parentKey: parentKey(type, row), coderec: row.coderec, name: normalizePersianText(row.name), codes: { province: row.provinceCode, county: row.countyCode ?? undefined, district: row.districtCode ?? undefined, rural: row.ruralCode ?? undefined, village: row.villageCode ?? undefined, mappedRural: row.mappedRuralCode ?? undefined } });
  }
  const entities = [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key, "en"));
  for (const entity of entities) if (entity.parentKey && !byKey.has(entity.parentKey)) throw new Error(`Missing parent ${entity.parentKey} for ${entity.key}`);
  return { entities, byKey, sourceRows: rows, sourceCounts };
}
export function assertAcyclic(model: CanonicalModel): void {
  for (const entity of model.entities) { const seen = new Set<string>(); let current: CanonicalEntity | undefined = entity; while (current?.parentKey) { if (seen.has(current.key)) throw new Error(`Hierarchy cycle at ${entity.key}`); seen.add(current.key); current = model.byKey.get(current.parentKey); } }
}
