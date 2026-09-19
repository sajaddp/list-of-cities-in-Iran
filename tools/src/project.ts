import { CanonicalEntity, CanonicalModel, Datasets, PublicRecord } from "./types";
import { generateSlug } from "./text";

const tel: Record<string, string> = { "آذربایجان شرقی": "041", "آذربایجان غربی": "044", اردبیل: "045", اصفهان: "031", البرز: "026", ایلام: "084", بوشهر: "077", تهران: "021", "چهارمحال و بختیاری": "038", "خراسان جنوبی": "056", "خراسان رضوی": "051", "خراسان شمالی": "058", خوزستان: "061", زنجان: "024", سمنان: "023", "سیستان و بلوچستان": "054", فارس: "071", قزوین: "028", قم: "025", کردستان: "087", کرمان: "034", کرمانشاه: "083", "کهگیلویه و بویراحمد": "074", گلستان: "017", لرستان: "066", گیلان: "013", مازندران: "011", مرکزی: "086", هرمزگان: "076", همدان: "081", یزد: "035" };
function numeric(value: string): number { const id = Number(value); if (!Number.isSafeInteger(id)) throw new Error(`Unsafe numeric identifier ${value}`); return id; }
const provinceId = (e: CanonicalEntity) => numeric(String(100 + Number(e.codes.province)));
const countyId = (e: CanonicalEntity) => numeric(`${provinceId(e)}000${e.codes.county}`);
const districtId = (e: CanonicalEntity) => numeric(`${countyId(e)}00${e.codes.district}`);
const ruralId = (e: CanonicalEntity) => numeric(`${countyId(e)}00${e.codes.district}${e.codes.rural}`);
const cityId = (e: CanonicalEntity) => numeric(`${countyId(e)}00${e.codes.rural}`);
export function idFor(e: CanonicalEntity): string | number { switch (e.type) { case "province": return provinceId(e); case "county": return countyId(e); case "district": return districtId(e); case "rural": return ruralId(e); case "city": return cityId(e); case "village": return `village:${e.codes.province}:${e.codes.county}:${e.codes.district}:${e.codes.rural}:${e.codes.village}:${e.coderec}`; } }
const base = (e: CanonicalEntity): PublicRecord => ({ id: idFor(e), name: e.name, slug: generateSlug(e.name) });
const ancestors = (e: CanonicalEntity): PublicRecord => ({ province_id: provinceId(e), county_id: countyId(e), district_id: districtId(e) });
export function assertUniquePublicIds(data: Datasets): void { for (const [name, records] of Object.entries(data)) { const ids = records.map((r) => String(r.id)); if (new Set(ids).size !== ids.length) throw new Error(`Duplicate public IDs in ${name}`); } }
export function projectDatasets(model: CanonicalModel): Datasets {
  const data: Datasets = { provinces: [], counties: [], districts: [], rurals: [], cities: [], "cities-filtered": [], villages: [], all: [] };
  for (const entity of model.entities) { let record: PublicRecord; switch (entity.type) {
    case "province": record = { ...base(entity), tel_prefix: tel[entity.name] ?? "---" }; data.provinces.push(record); break;
    case "county": record = { ...base(entity), province_id: provinceId(entity) }; data.counties.push(record); break;
    case "district": record = { ...base(entity), province_id: provinceId(entity), county_id: countyId(entity) }; data.districts.push(record); break;
    case "rural": record = { ...base(entity), ...ancestors(entity) }; data.rurals.push(record); break;
    case "city": record = { ...base(entity), ...ancestors(entity) }; data.cities.push(record); break;
    case "village": record = { ...base(entity), ...ancestors(entity), rural_id: ruralId(entity), coderec: entity.coderec, village_code: entity.codes.village!, mapped_rural_code: entity.codes.mappedRural ?? null }; data.villages.push(record); break;
  } data.all.push({ ...record, type: entity.type }); }
  data["cities-filtered"] = data.cities.filter((city) => !String(city.slug).includes("-") && !String(city.slug).includes("_"));
  for (const name of Object.keys(data) as (keyof Datasets)[]) data[name].sort((a, b) => String(a.id).localeCompare(String(b.id), "en", { numeric: true }));
  assertUniquePublicIds(data); return data;
}
export const ruralLegacyId = (e: CanonicalEntity) => numeric(`${countyId(e)}00${e.codes.rural}`);
