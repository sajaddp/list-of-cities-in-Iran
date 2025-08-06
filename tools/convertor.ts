import * as xlsx from "xlsx";
import * as path from "path";
import * as fs from "fs";

async function convertXlsxToCsv() {
  console.log("Converting XLSX to CSV...");

  const filePath = path.join(__dirname, "../offical/list.xlsx");
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const csv = xlsx.utils.sheet_to_csv(worksheet);
  const outputFilePath = path.join(__dirname, "../offical/list.csv");
  fs.writeFileSync(outputFilePath, csv);

  console.log("CSV file created successfully:", outputFilePath);
}

const main = async () => {
  await convertXlsxToCsv();
};

main();
