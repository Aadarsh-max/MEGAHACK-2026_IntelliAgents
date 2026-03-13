import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const pdfParser = async (filePath) => {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjs.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const strings = content.items.map((item) => item.str);

      text += strings.join(" ") + "\n";
    }

    console.log("PDF TEXT EXTRACTED:", text.slice(0, 500));

    return text;
  } catch (error) {
    console.error("PDF parsing failed:", error);
    return "";
  }
};

export default pdfParser;