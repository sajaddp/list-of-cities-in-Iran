import * as pdfjsLib from 'pdfjs-dist';
import { TextContent, TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';

const pdfPath = '../offical/list.pdf';

async function extractTextFromPDF(pdfPath: string) {
  const pdf = await pdfjsLib.getDocument(pdfPath).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent: TextContent = await page.getTextContent();
    text += textContent.items.map((item: TextItem | TextMarkedContent) => {
      if ((item as TextItem).str !== undefined) {
        return (item as TextItem).str;
      }
      console.log(JSON.stringify(item, null, 2));
      process.exit(1);
      return '';
    }).join(' ') + '\n';
  }

  return text;
}

extractTextFromPDF(pdfPath).then(text => console.log(text));
