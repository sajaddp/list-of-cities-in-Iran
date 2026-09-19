import * as XLSX from "xlsx";
import { Coderec, SOURCE_HEADERS, SourceInspection, SourceRow } from "./types";
import { normalizePersianText } from "./text";

const CODES: Coderec[] = ["1", "2", "3", "4", "5", "6", "8"];
const required: Record<Coderec, (keyof SourceRow)[]> = {
  "1": ["provinceCode"], "2": ["provinceCode", "countyCode"], "3": ["provinceCode", "countyCode", "districtCode"],
  "4": ["provinceCode", "countyCode", "districtCode", "ruralCode"], "5": ["provinceCode", "countyCode", "districtCode", "ruralCode"],
  "6": ["provinceCode", "countyCode", "districtCode", "ruralCode", "villageCode"],
  "8": ["provinceCode", "countyCode", "districtCode", "ruralCode", "villageCode", "mappedRuralCode"],
};
const nullable = (value: unknown): string | null => value === null || value === undefined || value === "" ? null : String(value);
export function officialName(value: unknown, rowNumber: number): string {
  const name = normalizePersianText(String(value ?? ""));
  if (!name) throw new Error(`Missing official name at source row ${rowNumber}`);
  return name;
}

function mapRow(raw: Record<string, unknown>, rowNumber: number): SourceRow {
  const code = nullable(raw.Coderec);
  if (!CODES.includes(code as Coderec)) throw new Error(`Unsupported CODEREC ${String(code)} at source row ${rowNumber}`);
  const row: SourceRow = { provinceCode: String(raw["کد استان"] ?? ""), provinceName: normalizePersianText(String(raw["نام استان"] ?? "")), countyCode: nullable(raw["کد شهرستان"]), countyName: nullable(raw["نام شهرستان"]), districtCode: nullable(raw["کد بخش"]), districtName: nullable(raw["نام بخش"]), ruralCode: nullable(raw["کد دهستان"]), ruralName: nullable(raw["نام دهستان"]), villageCode: nullable(raw["کد آبادی"]), coderec: code as Coderec, name: officialName(raw["نام"], rowNumber), mappedRuralCode: nullable(raw["کد ابادی بلوکه"]), rowNumber };
  for (const field of required[row.coderec]) if (!row[field]) throw new Error(`Missing ${field} for CODEREC ${row.coderec} at source row ${rowNumber}`);
  if (!row.provinceName) throw new Error(`Missing official province name at source row ${rowNumber}`);
  for (const value of [row.provinceCode, row.countyCode, row.districtCode, row.ruralCode, row.villageCode, row.mappedRuralCode]) if (value !== null && !/^\d+$/.test(value)) throw new Error(`Non-numeric official code ${value} at source row ${rowNumber}`);
  return row;
}

export function parseOfficialWorkbook(filePath: string): { rows: SourceRow[]; inspection: SourceInspection } {
  const book = XLSX.readFile(filePath, { cellText: true, cellDates: false });
  if (book.SheetNames.length !== 1) throw new Error(`Expected one worksheet, found ${book.SheetNames.length}`);
  const sheet = book.Sheets[book.SheetNames[0]];
  const headers = (XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: false })[0] ?? []).map(String);
  if (JSON.stringify(headers) !== JSON.stringify(SOURCE_HEADERS)) throw new Error(`Unexpected worksheet columns: ${JSON.stringify(headers)}`);
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null, raw: false });
  const rows = rawRows.map((raw, index) => mapRow(raw, index + 2));
  const coderecCounts = Object.fromEntries(CODES.map((code) => [code, 0])) as Record<Coderec, number>;
  const samplesByCoderec = {} as Record<Coderec, SourceRow>;
  const nullableColumns = Object.fromEntries(headers.map((header) => [header, 0])) as Record<string, number>;
  for (let index = 0; index < rows.length; index += 1) { const row = rows[index]; coderecCounts[row.coderec] += 1; if (!samplesByCoderec[row.coderec]) samplesByCoderec[row.coderec] = row; for (const header of headers) if (rawRows[index][header] === null || rawRows[index][header] === "") nullableColumns[header] += 1; }
  return { rows, inspection: { worksheet: book.SheetNames[0], headers, totalRows: rows.length, coderecCounts, nullableColumns, samplesByCoderec } };
}
