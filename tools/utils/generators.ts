import * as fs from "fs";
import * as path from "path";
import xlsx from "xlsx";
import { createObjectCsvWriter } from "csv-writer";
import { ProcessedDataInterface } from ".";

export function generateSlug(item: string): string {
  return item
    .replace(/[\u200C\u200B]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[-]+/g, "-")
    .replace(/[^\w\-آ-ی\u0600-\u06FF]+/g, "");
}

function getJsonFilePath(directory: string): string {
  return path.join(__dirname, `../../output/${directory}`);
}

export function generateJsonFiles(processedData: ProcessedDataInterface) {
  fs.mkdirSync(getJsonFilePath("json"), { recursive: true });

  const outputs = [
    { name: "provinces", data: processedData.provinces },
    { name: "counties", data: processedData.counties },
    { name: "cities", data: processedData.cities },
    { name: "rurals", data: processedData.rurals },
    { name: "all", data: processedData.all },
  ];

  outputs.forEach(({ name, data }) => {
    const outputPath = getJsonFilePath(`json/${name}.json`);
    fs.writeFileSync(
      outputPath,
      JSON.stringify(Object.values(data), null, 2),
      "utf-8",
    );
  });
}

export async function generateCsvFiles(processedData: ProcessedDataInterface) {
  fs.mkdirSync(getJsonFilePath("csv"), { recursive: true });

  const outputs = [
    { name: "provinces", data: processedData.provinces },
    { name: "counties", data: processedData.counties },
    { name: "cities", data: processedData.cities },
    { name: "rurals", data: processedData.rurals },
    { name: "all", data: processedData.all },
  ];

  outputs.forEach(async ({ name, data }) => {
    const header = data[Number(Object.keys(data)[0])];

    const csvWriter = createObjectCsvWriter({
      path: getJsonFilePath(`csv/${name}.csv`),
      header: Object.keys(header).map((key) => ({ id: key, title: key })),
    });
    await csvWriter.writeRecords(Object.values(data));
  });
}

export async function generateXlsxFiles(processedData: ProcessedDataInterface) {
  fs.mkdirSync(getJsonFilePath("xlsx"), { recursive: true });

  const outputs = [
    { name: "provinces", data: processedData.provinces },
    { name: "counties", data: processedData.counties },
    { name: "cities", data: processedData.cities },
    { name: "rurals", data: processedData.rurals },
    { name: "all", data: processedData.all },
  ];

  outputs.forEach(async ({ name, data }) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(Object.values(data));
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, getJsonFilePath(`xlsx/${name}.xlsx`));
  });
}
