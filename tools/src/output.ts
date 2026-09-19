import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import * as XLSX from "xlsx";
import { DatasetName, Datasets, PublicRecord } from "./types";
import { schema, validateDatasets } from "./schema";
import { ALL_COLUMNS } from "./project";
const names: DatasetName[] = ["provinces", "counties", "districts", "rurals", "cities", "cities-filtered", "villages", "all"];
const nl = "\n";
export const sha256 = (data: Buffer | string) => crypto.createHash("sha256").update(data).digest("hex");
export const DATASET_COLUMNS: Record<DatasetName, readonly string[]> = {
  provinces: ["id", "name", "slug", "tel_prefix"], counties: ["id", "name", "slug", "province_id"], districts: ["id", "name", "slug", "province_id", "county_id"],
  rurals: ["id", "name", "slug", "province_id", "county_id", "district_id"], cities: ["id", "name", "slug", "province_id", "county_id", "district_id"], "cities-filtered": ["id", "name", "slug", "province_id", "county_id", "district_id"],
  villages: ["id", "name", "slug", "province_id", "county_id", "district_id", "rural_id", "coderec", "village_code", "mapped_rural_code"], all: ALL_COLUMNS,
};
const csvCell = (value: string | number | null) => { const text = value === null ? "" : String(value); return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; };
const csv = (name: DatasetName, records: PublicRecord[]) => { const headers = DATASET_COLUMNS[name]; return [headers.join(","), ...records.map((r) => headers.map((h) => csvCell(r[h] as string | number | null)).join(","))].join(nl) + nl; };
function parseCsv(content: string): Record<string, string>[] { const rows: string[][] = [[]]; let value = "", quoted = false; for (let i = 0; i < content.length; i += 1) { const char = content[i]; if (quoted) { if (char === '"' && content[i + 1] === '"') { value += '"'; i += 1; } else if (char === '"') quoted = false; else value += char; } else if (char === '"') quoted = true; else if (char === ",") { rows.at(-1)!.push(value); value = ""; } else if (char === "\n") { rows.at(-1)!.push(value); value = ""; if (i !== content.length - 1) rows.push([]); } else if (char !== "\r") value += char; } const [headers, ...data] = rows; return data.filter((row) => row.length > 1 || row[0] !== "").map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))); }
function assertColumns(name: DatasetName, columns: string[]): void { const expected = DATASET_COLUMNS[name]; if (JSON.stringify(columns) !== JSON.stringify(expected)) throw new Error(`Format columns failed for ${name}: expected ${expected.join(",")}, got ${columns.join(",")}`); }
function decodeLike(name: DatasetName, actual: Record<string, unknown>, expected: PublicRecord): PublicRecord {
  assertColumns(name, Object.keys(actual)); const result: PublicRecord = {};
  for (const field of DATASET_COLUMNS[name]) { const raw = actual[field]; const target = expected[field];
    if (target === null) { if (raw !== "" && raw !== null && raw !== undefined) throw new Error(`Non-null tabular value for nullable ${name}.${field}`); result[field] = null; }
    else if (typeof target === "number") { const value = typeof raw === "number" ? raw : Number(raw); if (!Number.isInteger(value)) throw new Error(`Invalid numeric tabular value for ${name}.${field}`); result[field] = value; }
    else { if (raw === null || raw === undefined || raw === "") throw new Error(`Missing required tabular value for ${name}.${field}`); result[field] = String(raw); }
  }
  return result;
}
function writeXlsx(file: string, name: DatasetName, records: PublicRecord[]): void { const book = XLSX.utils.book_new(); const sheet = XLSX.utils.json_to_sheet(records, { header: [...DATASET_COLUMNS[name]] }); XLSX.utils.book_append_sheet(book, sheet, "Sheet1"); fs.writeFileSync(file, XLSX.write(book, { type: "buffer", bookType: "xlsx", compression: false })); }
export function writeDatasets(root: string, datasets: Datasets): void { validateDatasets(datasets); for (const d of ["json", "csv", "xlsx"]) fs.mkdirSync(path.join(root, d), { recursive: true }); for (const name of names) { const rows = datasets[name]; for (const row of rows) assertColumns(name, Object.keys(row)); fs.writeFileSync(path.join(root, "json", `${name}.json`), `${JSON.stringify(rows, null, 2)}${nl}`, "utf8"); fs.writeFileSync(path.join(root, "csv", `${name}.csv`), csv(name, rows), "utf8"); writeXlsx(path.join(root, "xlsx", `${name}.xlsx`), name, rows); } }
export interface ParityResult { passed: boolean; rowCounts: Record<DatasetName, number>; errors: string[]; }
export function verifyFormatParity(root: string): ParityResult { const rowCounts = {} as Record<DatasetName, number>; const errors: string[] = []; for (const name of names) try { const json = JSON.parse(fs.readFileSync(path.join(root, "json", `${name}.json`), "utf8")) as PublicRecord[]; const csvRows = parseCsv(fs.readFileSync(path.join(root, "csv", `${name}.csv`), "utf8")); const book = XLSX.readFile(path.join(root, "xlsx", `${name}.xlsx`), { cellText: true }); const sheet = book.Sheets[book.SheetNames[0]]; const xlsxRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: true }); if (json.length !== csvRows.length || json.length !== xlsxRows.length) throw new Error(`row-count parity failed`); for (let i = 0; i < json.length; i += 1) { if (JSON.stringify(decodeLike(name, csvRows[i], json[i])) !== JSON.stringify(json[i])) throw new Error(`CSV mismatch at record ${i}`); if (JSON.stringify(decodeLike(name, xlsxRows[i], json[i])) !== JSON.stringify(json[i])) throw new Error(`XLSX mismatch at record ${i}`); } rowCounts[name] = json.length; } catch (error) { errors.push(`${name}: ${(error as Error).message}`); }
  return { passed: errors.length === 0, rowCounts, errors };
}
export const writeSchema = (root: string) => fs.writeFileSync(path.join(root, "schema.json"), `${JSON.stringify(schema, null, 2)}${nl}`, "utf8");
export function validateJsonOutputs(root: string): void { const datasets = Object.fromEntries(names.map((name) => [name, JSON.parse(fs.readFileSync(path.join(root, "json", `${name}.json`), "utf8"))])) as Datasets; validateDatasets(datasets); }
