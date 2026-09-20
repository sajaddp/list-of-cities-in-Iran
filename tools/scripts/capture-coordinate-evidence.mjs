#!/usr/bin/env node
// One-time, offline-after-capture curator for the committed GeoNames extraction.
// Usage: node scripts/capture-coordinate-evidence.mjs /absolute/path/to/IR.zip
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const repo = resolve(import.meta.dirname, "../..");
const archive = process.argv[2];
if (!archive) throw new Error("Usage: capture-coordinate-evidence.mjs /path/to/IR.zip");
const headers = ["geonameid", "name", "asciiname", "alternatenames", "latitude", "longitude", "feature_class", "feature_code", "country_code", "cc2", "admin1_code", "admin2_code", "admin3_code", "admin4_code", "population", "elevation", "dem", "timezone", "modification_date"];
const raw = execFileSync("unzip", ["-p", archive, "IR.txt"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const upstream = raw.trim().split("\n").map((line) => Object.fromEntries(headers.map((key, index) => [key, line.split("\t")[index] ?? ""])));
const fallback = new Map([
  ["1180006", "128847"], ["1220001", "292983"], ["1220006", "130276"], ["1260001", "139903"], ["10200010", "120695"], ["10300028", "125686"], ["10400018", "117944"], ["10500013", "128252"], ["10600027", "126082"], ["10700033", "128321"], ["10800023", "142902"], ["10900044", "7082152"], ["11000012", "418418"], ["11000013", "122869"], ["11000024", "124101"], ["11100024", "1160907"], ["11300010", "119160"], ["11400012", "120678"], ["11600011", "8298952"], ["11900010", "117799"], ["12200010", "127992"], ["12400010", "117048"], ["12700012", "123295"], ["12900011", "113659"],
]);
const byId = new Map(upstream.map((row) => [row.geonameid, row]));
function readCsv(name) { const [head, ...lines] = readFileSync(join(repo, "enrichment", "coordinates", `${name}.csv`), "utf8").trim().split("\n"); const columns = head.split(","); return { columns, rows: lines.map((line) => Object.fromEntries(columns.map((column, index) => [column, line.split(",")[index]]))) }; }
function select(row, entityId) {
  const matches = upstream.filter((source) => Number(source.latitude) === Number(row.latitude) && Number(source.longitude) === Number(row.longitude));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) return matches.sort((left, right) => Number(right.feature_code.startsWith("PPLA")) - Number(left.feature_code.startsWith("PPLA")))[0];
  const source = byId.get(fallback.get(entityId));
  if (!source) throw new Error(`No immutable GeoNames match for ${entityId}`);
  return source;
}
const selected = [];
for (const name of ["province-capitals", "county-centers"]) {
  const input = readCsv(name); const entityColumn = name === "province-capitals" ? "province_id" : "county_id";
  const output = input.rows.map((row) => { const source = select(row, row[entityColumn]); row.latitude = source.latitude; row.longitude = source.longitude; row.source_feature_id = source.geonameid; row.source_name = source.name; selected.push(source); return row; });
  const columns = name === "province-capitals" ? ["province_id", "province_name", "center_name", "latitude", "longitude", "source_id", "source_feature_id", "source_name"] : ["county_id", "county_name", "province_id", "center_name", "latitude", "longitude", "source_id", "source_feature_id", "source_name"];
  writeFileSync(join(repo, "enrichment", "coordinates", `${name}.csv`), `${columns.join(",")}\n${output.map((row) => columns.map((column) => row[column]).join(",")).join("\n")}\n`);
}
const evidenceRoot = join(repo, "enrichment", "coordinates", "evidence"); mkdirSync(evidenceRoot, { recursive: true });
const unique = [...new Map(selected.map((row) => [row.geonameid, row])).values()].sort((left, right) => Number(left.geonameid) - Number(right.geonameid));
const extraction = `${headers.join("\t")}\n${unique.map((row) => headers.map((header) => row[header]).join("\t")).join("\n")}\n`;
const extractionFile = "geonames-iran-2026-09-19.tsv";
writeFileSync(join(evidenceRoot, extractionFile), extraction);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const metadata = { provider: "GeoNames", upstream_url: "https://download.geonames.org/export/dump/IR.zip", accessed_on: "2026-09-19", upstream_dataset: basename(archive), upstream_sha256: hash(readFileSync(archive)), local_extraction: `evidence/${extractionFile}`, local_extraction_sha256: hash(extraction), extraction_method: "tools/scripts/capture-coordinate-evidence.mjs@1", license: "CC BY 4.0; attribution to GeoNames is required", status: "derived/non-official", records: unique.length };
writeFileSync(join(evidenceRoot, "geonames-iran-2026-09-19.metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);

const identityColumns = ["entity_type", "entity_id", "center_name", "identity_source_id", "identity_record_id", "identity_basis"];
const identityRows = [];
const overrides = [];
for (const name of ["province-capitals", "county-centers"]) {
  const { rows } = readCsv(name); const entityType = name === "province-capitals" ? "province" : "county"; const entityColumn = `${entityType}_id`;
  for (const row of rows) {
    const source = byId.get(row.source_feature_id); const administrativeFeature = !fallback.has(row[entityColumn]) && (entityType === "province" ? source.feature_code === "PPLA" : ["PPLA", "PPLA2"].includes(source.feature_code));
    const identity = { entity_type: entityType, entity_id: row[entityColumn], center_name: row.center_name, identity_source_id: administrativeFeature ? "geonames-iran-2026-09-19" : "coordinate-center-verification-2026-09-19", identity_record_id: administrativeFeature ? source.geonameid : `${entityType}:${row[entityColumn]}`, identity_basis: administrativeFeature ? "geonames_admin_feature" : "verified_override" };
    identityRows.push(identity); if (!administrativeFeature) overrides.push({ ...identity, verification_note: "Human-reviewed administrative-center crosswalk retained as immutable local evidence; GeoNames supplies the coordinate only." });
  }
}
writeFileSync(join(evidenceRoot, "center-identities.csv"), `${identityColumns.join(",")}\n${identityRows.map((row) => identityColumns.map((column) => row[column]).join(",")).join("\n")}\n`);
const overrideColumns = [...identityColumns, "verification_note"];
writeFileSync(join(evidenceRoot, "verified-center-identities.csv"), `${overrideColumns.join(",")}\n${overrides.map((row) => overrideColumns.map((column) => row[column]).join(",")).join("\n")}\n`);
