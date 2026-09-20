import { CanonicalEntity, CanonicalModel, Datasets, PublicRecord } from "./types";
import { generateSlug } from "./text";
import { V2Contract, legacyIdFor, v2RecordFor } from "./compat";

const tel: Record<string, string> = { "آذربایجان شرقی": "041", "آذربایجان غربی": "044", اردبیل: "045", اصفهان: "031", البرز: "026", ایلام: "084", بوشهر: "077", تهران: "021", "چهارمحال و بختیاری": "038", "خراسان جنوبی": "056", "خراسان رضوی": "051", "خراسان شمالی": "058", خوزستان: "061", زنجان: "024", سمنان: "023", "سیستان و بلوچستان": "054", فارس: "071", قزوین: "028", قم: "025", کردستان: "087", کرمان: "034", کرمانشاه: "083", "کهگیلویه و بویراحمد": "074", گلستان: "017", لرستان: "066", گیلان: "013", مازندران: "011", مرکزی: "086", هرمزگان: "076", همدان: "081", یزد: "035" };
function numeric(value: string): number { const id = Number(value); if (!Number.isSafeInteger(id)) throw new Error(`Unsafe numeric identifier ${value}`); return id; }
const provinceId = (e: CanonicalEntity) => numeric(String(100 + Number(e.codes.province)));
const countyId = (e: CanonicalEntity) => numeric(`${provinceId(e)}000${Number(e.codes.county)}`);
const districtId = (e: CanonicalEntity) => numeric(`${countyId(e)}00${Number(e.codes.district)}`);
/** V3 rural IDs retain fixed-width district and rural segments to avoid V2's cross-district collision. */
const ruralId = (e: CanonicalEntity) => numeric(`${countyId(e)}00${Number(e.codes.district).toString().padStart(2, "0")}${Number(e.codes.rural).toString().padStart(4, "0")}`);
const cityId = (e: CanonicalEntity) => numeric(`${countyId(e)}00${Number(e.codes.rural)}`);
/** Historical public IDs for continuing cities whose 1404 parent changed. */
export const historicalCityIdOverrides: Readonly<Record<string, number>> = { "city:03:29:01:2144": 10300010002144, "city:29:12:01:2345": 12900011002345 };
export function idFor(e: CanonicalEntity): string | number { switch (e.type) { case "province": return provinceId(e); case "county": return countyId(e); case "district": return districtId(e); case "rural": return ruralId(e); case "city": return cityId(e); case "village": return `village:${e.codes.province}:${e.codes.county}:${e.codes.district}:${e.codes.rural}:${e.codes.village}:${e.coderec}`; } }
function base(e: CanonicalEntity, contract: V2Contract): PublicRecord {
  const overrideId = e.type === "city" ? historicalCityIdOverrides[e.key] : undefined;
  const historical = overrideId === undefined ? v2RecordFor(contract, e) : contract.datasets.cities.find((record) => record.id === overrideId);
  if (overrideId !== undefined && !historical) throw new Error(`Missing historical city compatibility record ${overrideId} for ${e.key}`);
  // Names remain from the current official workbook. Only compatibility-facing slug/ID use V2.
  return { id: e.type === "village" || e.type === "rural" ? idFor(e) : historical?.id ?? legacyIdFor(e), name: e.name, slug: historical?.slug ?? generateSlug(e.name) };
}
const ancestors = (e: CanonicalEntity): PublicRecord => ({ province_id: provinceId(e), county_id: countyId(e), district_id: districtId(e) });
export function assertUniquePublicIds(data: Datasets): void { for (const [name, records] of Object.entries(data)) { const ids = records.map((r) => String(r.id)); if (new Set(ids).size !== ids.length) throw new Error(`Duplicate public IDs in ${name}`); } }
export function projectDatasets(model: CanonicalModel, contract: V2Contract, urbanZoneKeys: ReadonlySet<string>): Datasets {
  const data: Datasets = { provinces: [], counties: [], districts: [], rurals: [], cities: [], "cities-filtered": [], "urban-zones": [], villages: [], all: [] };
  const classifiedUrbanZones = new Set<string>();
  for (const entity of model.entities) { let record: PublicRecord; switch (entity.type) {
    case "province": record = { ...base(entity, contract), tel_prefix: tel[entity.name] ?? "---" }; data.provinces.push(record); break;
    case "county": record = { ...base(entity, contract), province_id: provinceId(entity) }; data.counties.push(record); break;
    case "district": record = { ...base(entity, contract), province_id: provinceId(entity), county_id: countyId(entity) }; data.districts.push(record); break;
    case "rural": record = { ...base(entity, contract), ...ancestors(entity) }; data.rurals.push(record); break;
    case "city": record = { ...base(entity, contract), ...ancestors(entity) }; data.cities.push(record); if (urbanZoneKeys.has(entity.key)) { data["urban-zones"].push(record); classifiedUrbanZones.add(entity.key); } else data["cities-filtered"].push(record); break;
    case "village": record = { ...base(entity, contract), ...ancestors(entity), rural_id: ruralId(entity), coderec: entity.coderec, village_code: entity.codes.village!, mapped_rural_code: entity.codes.mappedRural ?? null }; data.villages.push(record); break;
  } data.all.push(allRecord(record, entity.type)); }
  if (classifiedUrbanZones.size !== urbanZoneKeys.size) throw new Error("Urban-zone classification contains an unprojected city");
  for (const name of Object.keys(data) as (keyof Datasets)[]) data[name].sort((a, b) => String(a.id).localeCompare(String(b.id), "en", { numeric: true }));
  assertUniquePublicIds(data); return data;
}

/** Stable all-format union: nullable fields are explicit null in JSON and blank means null in tabular formats. */
export const ALL_COLUMNS = ["id", "type", "name", "slug", "tel_prefix", "province_id", "county_id", "district_id", "rural_id", "coderec", "village_code", "mapped_rural_code"] as const;
function allRecord(record: PublicRecord, type: string): PublicRecord {
  const union = Object.fromEntries(ALL_COLUMNS.map((field) => [field, null])) as PublicRecord;
  return { ...union, ...record, type };
}
export const publicIds = { provinceId, countyId, districtId, ruralId, cityId };
