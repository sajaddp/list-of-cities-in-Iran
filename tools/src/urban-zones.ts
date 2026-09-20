import * as fs from "node:fs";
import * as path from "node:path";
import { CanonicalModel } from "./types";

const sourcePath = "classification/urban-zones.json";

/** Loads the authoritative semantic classification; generated datasets never define membership. */
export function loadUrbanZoneKeys(repoRoot: string, model: CanonicalModel): ReadonlySet<string> {
  const value = JSON.parse(fs.readFileSync(path.join(repoRoot, sourcePath), "utf8")) as { description?: unknown; keys?: unknown };
  if (!value || typeof value.description !== "string" || !Array.isArray(value.keys) || !value.keys.every((key) => typeof key === "string")) throw new Error("Invalid urban-zone classification source");
  const keys = new Set(value.keys);
  if (keys.size !== value.keys.length) throw new Error("Duplicate urban-zone classification key");
  const cities = new Set(model.entities.filter((entity) => entity.type === "city").map((entity) => entity.key));
  for (const key of keys) if (!cities.has(key)) throw new Error(`Urban-zone classification key is not a current city: ${key}`);
  return keys;
}

export const URBAN_ZONE_CLASSIFICATION_SOURCE = sourcePath;
