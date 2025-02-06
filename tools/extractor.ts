import fs from "fs";
import * as pdfjsLib from "pdfjs-dist";
import {
  TextContent,
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";

const pdfPath = "../offical/list.pdf";

async function extractDataFromPDF(pdfPath: string) {
  const pdfDoc = await pdfjsLib.getDocument(pdfPath).promise;
  let extractedData = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent: TextContent = await page.getTextContent();
    const items = textContent.items.map(
      (item: TextItem | TextMarkedContent) => {
        if ("str" in item) {
          return item.str;
        }
        return "";
      },
    );

    let rows = [];
    let row = [];
    for (let i = 0; i < items.length; i++) {
      row.push(items[i]);
      if ((i + 1) % 9 === 0) {
        rows.push(row);
        row = [];
      }
    }
    extractedData.push(...rows);
  }

  return extractedData;
}

extractDataFromPDF(pdfPath).then((data) => {
  fs.writeFileSync("./output.json", JSON.stringify(data, null, 2), "utf-8");
  console.log("✅ داده‌ها استخراج و در فایل `output.json` ذخیره شدند.");
});
