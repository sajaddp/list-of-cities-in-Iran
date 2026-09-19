export const SOURCE_HEADERS = [
  "کد استان", "نام استان", "کد شهرستان", "نام شهرستان", "کد بخش", "نام بخش",
  "کد دهستان", "نام دهستان", "کد آبادی", "Coderec", "نام", "کد ابادی بلوکه",
] as const;

export type Coderec = "1" | "2" | "3" | "4" | "5" | "6" | "8";
export type EntityType = "province" | "county" | "district" | "rural" | "city" | "village";
export interface SourceRow {
  provinceCode: string; provinceName: string; countyCode: string | null; countyName: string | null;
  districtCode: string | null; districtName: string | null; ruralCode: string | null; ruralName: string | null;
  villageCode: string | null; coderec: Coderec; name: string; mappedRuralCode: string | null; rowNumber: number;
}
export interface CanonicalEntity {
  type: EntityType; key: string; parentKey: string | null; coderec: Coderec; name: string;
  codes: { province: string; county?: string; district?: string; rural?: string; village?: string; mappedRural?: string };
}
export interface CanonicalModel {
  entities: CanonicalEntity[]; byKey: Map<string, CanonicalEntity>; sourceRows: SourceRow[]; sourceCounts: Record<Coderec, number>;
}
export type DatasetName = "provinces" | "counties" | "districts" | "rurals" | "cities" | "cities-filtered" | "villages" | "all";
export type PublicRecord = Record<string, string | number | null>;
export type Datasets = Record<DatasetName, PublicRecord[]>;
export interface SourceInspection {
  worksheet: string; headers: readonly string[]; totalRows: number; coderecCounts: Record<Coderec, number>;
  nullableColumns: Record<string, number>; samplesByCoderec: Record<Coderec, SourceRow>;
}
