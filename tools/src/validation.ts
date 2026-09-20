import { CanonicalModel, Datasets, PublicRecord } from "./types";
import { idFor } from "./project";

export interface ModelMeasurements { duplicateCanonicalKeys: number; missingParents: number; cycles: number; }
export function measureModel(model: CanonicalModel): ModelMeasurements {
  let missingParents = 0;
  let cycles = 0;
  for (const entity of model.entities) {
    if (entity.parentKey && !model.byKey.has(entity.parentKey)) missingParents += 1;
    const seen = new Set<string>(); let current = entity;
    while (current.parentKey) {
      if (seen.has(current.key)) { cycles += 1; break; }
      seen.add(current.key);
      const parent = model.byKey.get(current.parentKey);
      if (!parent) break;
      current = parent;
    }
  }
  return { duplicateCanonicalKeys: model.sourceRows.length - model.entities.length, missingParents, cycles };
}
export function duplicatePublicIds(data: Datasets): number {
  let duplicates = 0;
  for (const records of Object.values(data)) duplicates += records.length - new Set(records.map((record) => String(record.id))).size;
  return duplicates;
}
export function unsafeIdentifiers(model: CanonicalModel): number {
  let unsafe = 0;
  for (const entity of model.entities) { try { const id = idFor(entity); if (typeof id === "number" && !Number.isSafeInteger(id)) unsafe += 1; } catch { unsafe += 1; } }
  return unsafe;
}
export function exactSubset(subset: PublicRecord[], superset: PublicRecord[]): boolean {
  const ids = new Set(superset.map((record) => String(record.id)));
  return subset.every((record) => ids.has(String(record.id)));
}
