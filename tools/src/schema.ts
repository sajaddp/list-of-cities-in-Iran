import Ajv from "ajv/dist/2020";
import { DatasetName, Datasets } from "./types";

const integer = { type: "integer" }; const string = { type: "string", minLength: 1 }; const nullableString = { anyOf: [string, { type: "null" }] }; const nullableInteger = { anyOf: [integer, { type: "null" }] };
const base = { type: "object", required: ["id", "name", "slug"], properties: { id: integer, name: string, slug: string }, additionalProperties: false };
const ancestry = { province_id: integer, county_id: integer, district_id: integer };
const local = (required: string[], properties: Record<string, unknown>) => ({ type: "array", items: { ...base, required: [...base.required, ...required], properties: { ...base.properties, ...properties } } });
const allFields = {
  id: { anyOf: [integer, { type: "string", pattern: "^village:" }] }, type: { enum: ["province", "county", "district", "rural", "city", "village"] }, name: string, slug: string,
  tel_prefix: nullableString, province_id: nullableInteger, county_id: nullableInteger, district_id: nullableInteger, rural_id: nullableInteger,
  coderec: { anyOf: [{ enum: ["6", "8"] }, { type: "null" }] }, village_code: nullableString, mapped_rural_code: nullableString,
};
const allRequired = Object.keys(allFields);
const allVariant = (type: string, fields: Record<string, unknown>) => ({ type: "object", required: allRequired, properties: allFields, additionalProperties: false, allOf: [{ properties: { type: { const: type }, ...fields } }] });
const nil = { type: "null" };
const all = { type: "array", items: { oneOf: [
  allVariant("province", { id: integer, tel_prefix: string, province_id: nil, county_id: nil, district_id: nil, rural_id: nil, coderec: nil, village_code: nil, mapped_rural_code: nil }),
  allVariant("county", { id: integer, tel_prefix: nil, province_id: integer, county_id: nil, district_id: nil, rural_id: nil, coderec: nil, village_code: nil, mapped_rural_code: nil }),
  allVariant("district", { id: integer, tel_prefix: nil, province_id: integer, county_id: integer, district_id: nil, rural_id: nil, coderec: nil, village_code: nil, mapped_rural_code: nil }),
  allVariant("rural", { id: integer, tel_prefix: nil, province_id: integer, county_id: integer, district_id: integer, rural_id: nil, coderec: nil, village_code: nil, mapped_rural_code: nil }),
  allVariant("city", { id: integer, tel_prefix: nil, province_id: integer, county_id: integer, district_id: integer, rural_id: nil, coderec: nil, village_code: nil, mapped_rural_code: nil }),
  allVariant("village", { id: { type: "string", pattern: "^village:" }, tel_prefix: nil, province_id: integer, county_id: integer, district_id: integer, rural_id: integer, coderec: { enum: ["6", "8"] }, village_code: string }),
] } };
export const schema = { $schema: "https://json-schema.org/draft/2020-12/schema", title: "list-of-cities-in-iran V3 Phase 1 datasets", $defs: {
  provinces: local(["tel_prefix"], { id: integer, tel_prefix: string }),
  counties: local(["province_id"], { id: integer, province_id: integer }),
  districts: local(["province_id", "county_id"], { id: integer, province_id: integer, county_id: integer }),
  rurals: local(["province_id", "county_id", "district_id"], { id: integer, ...ancestry }),
  cities: local(["province_id", "county_id", "district_id"], { id: integer, ...ancestry }),
  "cities-filtered": local(["province_id", "county_id", "district_id"], { id: integer, ...ancestry }),
  villages: local(["province_id", "county_id", "district_id", "rural_id", "coderec", "village_code", "mapped_rural_code"], { id: { type: "string", pattern: "^village:" }, ...ancestry, rural_id: integer, coderec: { enum: ["6", "8"] }, village_code: string, mapped_rural_code: nullableString }),
  all,
} };
const coordinateNumber = { type: "number" };
const coordinateString = { type: "string", minLength: 1 };
const coordinate = (required: string[], properties: Record<string, unknown>) => ({ type: "array", items: { type: "object", required, properties, additionalProperties: false } });
export const coordinateSchema = { $schema: "https://json-schema.org/draft/2020-12/schema", title: "list-of-cities-in-iran V3 coordinate enrichment datasets", $defs: {
  "province-capitals": coordinate(["province_id", "province_name", "center_name", "latitude", "longitude", "source_id"], { province_id: integer, province_name: coordinateString, center_name: coordinateString, latitude: coordinateNumber, longitude: coordinateNumber, source_id: coordinateString }),
  "county-centers": coordinate(["county_id", "county_name", "province_id", "center_name", "latitude", "longitude", "source_id"], { county_id: integer, county_name: coordinateString, province_id: integer, center_name: coordinateString, latitude: coordinateNumber, longitude: coordinateNumber, source_id: coordinateString }),
} };
export const combinedSchema = { $schema: schema.$schema, title: "list-of-cities-in-iran V3 datasets", $defs: { ...schema.$defs, ...coordinateSchema.$defs } };
export interface SchemaResult { passed: boolean; errors: string[]; }
export function schemaResult(datasets: Datasets): SchemaResult { const ajv = new Ajv({ allErrors: true, strict: false }); const errors: string[] = []; for (const [name, records] of Object.entries(datasets) as [DatasetName, Datasets[DatasetName]][]) { const validate = ajv.compile({ ...schema, $ref: `#/$defs/${name}` }); if (!validate(records)) errors.push(`${name}: ${ajv.errorsText(validate.errors)}`); } return { passed: errors.length === 0, errors }; }
export function validateDatasets(datasets: Datasets): void { const result = schemaResult(datasets); if (!result.passed) throw new Error(`Schema validation failed: ${result.errors.join("; ")}`); }
