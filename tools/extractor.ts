import fs from "fs";
import * as pdfjsLib from "pdfjs-dist";
import { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";
import { normalizePersianText } from "./utils";

const pdfPath = "../offical/list.pdf";

async function extractDataFromPDF(pdfPath: string) {
  const pdfDoc = await pdfjsLib.getDocument(pdfPath).promise;
  let extractedData = [];
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    await page.streamTextContent();
    const textContent: TextContent = await page.getTextContent();

    const items: TextItem[] = textContent.items
      .filter((item): item is TextItem => "str" in item)
      .filter((item) => !item.hasEOL)
      .filter((item) => !item.str.includes("Page"));
    interface Row {
      row: string;
      type: string;
      name: string;
      province: string;
      county: string;
      district: string;
      rural: string;
      hierarchicalCode: string;
      nationalId: string;
    }
    let rows: Row[] = [];
    let row: Row = {
      row: "",
      type: "",
      name: "",
      province: "",
      county: "",
      district: "",
      rural: "",
      hierarchicalCode: "",
      nationalId: "",
    };
    let lastLineY = 0;
    let column = 0;
    for (let i = 0; i < items.length; i++) {
      items[i].str = normalizePersianText(items[i].str);
      if (items[i].transform[5] !== lastLineY) {
        if (row["type"] !== "") {
          rows.push(row);
          column = 0;
          row = {
            row: "",
            type: "",
            name: "",
            province: "",
            county: "",
            district: "",
            rural: "",
            hierarchicalCode: "",
            nationalId: "",
          };
        }
        lastLineY = items[i].transform[5];
        row.row = items[i].str;
        column++;
        continue;
      }
      if (column < 7 && items[i].dir === "rtl") {
        if (column === 1) row.type = items[i].str;
        if (column === 2) row.name = items[i].str;
        if (column === 3) row.province = items[i].str;
        if (column === 4) row.county = items[i].str;
        if (column === 5) row.district = items[i].str;
        if (column === 6) row.rural = items[i].str;
        column++;
        continue;
      }

      if (items[i].dir === "ltr" && column < 7) {
        while (column < 7) {
          if (column === 3) row.province = "";
          if (column === 4) row.county = "";
          if (column === 5) row.district = "";
          if (column === 6) row.rural = "";
          column++;
        }
        row.hierarchicalCode = items[i].str;
        column = 8;
        continue;
      }

      if (column === 7) {
        row.hierarchicalCode = items[i].str;
        column++;
        continue;
      }

      if (column === 8) {
        row.nationalId = items[i].str;
        column++;
        continue;
      }

      if (i === items.length - 1) {
        rows.push(row);
      }
    }

    extractedData.push(...rows.filter((row) => row.row !== "ردیف"));
  }

  return extractedData;
}

extractDataFromPDF(pdfPath).then((data) => {
  fs.writeFileSync(
    "../offical/list.json",
    JSON.stringify(data, null, 2),
    "utf-8",
  );
  console.log("Done.");
});
