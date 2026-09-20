import { DatasetName, PublicRecord } from "./types";
import { DATASET_COLUMNS } from "./output";

export const LLM_CONTEXT_VERSION = 1;
export const LLM_SCOPES: DatasetName[] = ["provinces", "counties", "cities", "cities-filtered", "urban-zones"];

const sharedSemantics = [
  "county = شهرستان; an administrative division.",
  "city = شهر; an urban settlement.",
  "county and city are different entity types.",
  "same name does not mean the same entity.",
];

const entityFor = (scope: DatasetName): string => scope === "provinces" ? "province" : scope === "counties" ? "county" : scope === "urban-zones" ? "urban-zone" : "city";

function tsvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  if (/[\t\r\n]/.test(text)) throw new Error("LLM context values must not contain tabs or newlines");
  return text;
}

/** Pure, deterministic formatter intended for both build output and future UI copy actions. */
export function formatLlmContext(scope: DatasetName, records: PublicRecord[], sourceYear: number): string {
  if (!LLM_SCOPES.includes(scope)) throw new Error(`Unsupported LLM context scope: ${scope}`);
  const columns = DATASET_COLUMNS[scope];
  const semantics = scope === "provinces"
    ? ["province = استان; a first-level administrative division.", ...sharedSemantics]
    : scope === "urban-zones"
      ? ["urban zone = ناحیه شهری; not a real city.", ...sharedSemantics]
      : sharedSemantics;
  const lines = [
    "# list-of-cities-in-Iran LLM Context",
    `schema: ${LLM_CONTEXT_VERSION}`,
    `source_year: ${sourceYear}`,
    `scope: ${scope}`,
    `entity: ${entityFor(scope)}`,
    `rows: ${records.length}`,
    "encoding: UTF-8",
    "representation: TSV; literal tabs and newlines are forbidden in values; final newline is LF.",
    "",
    "semantics:",
    ...semantics.map((item) => `- ${item}`),
    "",
    "columns:",
    columns.join("\t"),
    "",
    "data:",
    ...records.map((record) => columns.map((column) => tsvCell(record[column] as string | number | null)).join("\t")),
  ];
  return `${lines.join("\n")}\n`;
}

export interface LlmContextCheck {
  scope: DatasetName;
  rows: number;
  columns: string[];
  bytes: number;
  semanticHeaderValid: boolean;
}

export function inspectLlmContext(scope: DatasetName, text: string): LlmContextCheck {
  const lines = text.split("\n");
  const index = lines.indexOf("data:");
  const columnsIndex = lines.indexOf("columns:");
  if (index < 0 || columnsIndex < 0 || columnsIndex + 1 >= lines.length) throw new Error(`Invalid LLM context structure for ${scope}`);
  const columns = lines[columnsIndex + 1].split("\t");
  const data = lines.slice(index + 1, -1);
  const declaredRows = Number(lines.find((line) => line.startsWith("rows: "))?.slice(6));
  if (!Number.isInteger(declaredRows) || declaredRows !== data.length) throw new Error(`Invalid LLM row count for ${scope}`);
  for (const row of data) if (row.split("\t").length !== columns.length) throw new Error(`Malformed TSV row for ${scope}`);
  const semanticHeaderValid = text.includes("county = شهرستان") && text.includes("city = شهر") && text.includes("county and city are different entity types") && text.includes("same name does not mean the same entity");
  if (!semanticHeaderValid) throw new Error(`Missing city/county semantics for ${scope}`);
  return { scope, rows: data.length, columns, bytes: Buffer.byteLength(text), semanticHeaderValid };
}
