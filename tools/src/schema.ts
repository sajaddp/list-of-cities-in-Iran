import Ajv from "ajv/dist/2020";
import { DatasetName, Datasets } from "./types";
const integer = { type: "integer" }; const string = { type: "string" };
const common = { type: "object", required: ["id", "name", "slug"], properties: { id: { anyOf: [integer, string] }, name: string, slug: string } };
const ancestry = { province_id: integer, county_id: integer, district_id: integer };
const local = (required: string[], properties: Record<string, unknown>) => ({ type: "array", items: { ...common, required: ["id", "name", "slug", ...required], properties: { ...common.properties, ...properties }, additionalProperties: false } });
export const schema = { $schema: "https://json-schema.org/draft/2020-12/schema", title: "list-of-cities-in-iran V3 Phase 1 datasets", $defs: {
  provinces: local(["tel_prefix"], { tel_prefix: string }), counties: local(["province_id"], { province_id: integer }), districts: local(["province_id", "county_id"], { province_id: integer, county_id: integer }),
  rurals: local(["province_id", "county_id", "district_id"], ancestry), cities: local(["province_id", "county_id", "district_id"], ancestry), "cities-filtered": local(["province_id", "county_id", "district_id"], ancestry),
  villages: local(["province_id", "county_id", "district_id", "rural_id", "coderec", "village_code", "mapped_rural_code"], { ...ancestry, rural_id: integer, coderec: { enum: ["6", "8"] }, village_code: string, mapped_rural_code: { anyOf: [string, { type: "null" }] } }),
  all: { type: "array", items: { type: "object", required: ["id", "name", "slug", "type"], properties: { id: { anyOf: [integer, string] }, name: string, slug: string, type: { enum: ["province", "county", "district", "rural", "city", "village"] } }, additionalProperties: true } },
} };
export function validateDatasets(datasets: Datasets): void { const ajv = new Ajv({ allErrors: true, strict: false }); for (const [name, records] of Object.entries(datasets) as [DatasetName, Datasets[DatasetName]][]) { const validate = ajv.compile({ ...schema, $ref: `#/$defs/${name}` }); if (!validate(records)) throw new Error(`Schema validation failed for ${name}: ${ajv.errorsText(validate.errors)}`); } }
