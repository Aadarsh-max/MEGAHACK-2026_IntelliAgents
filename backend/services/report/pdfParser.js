import fs from "fs";
import pdfParse from "pdf-parse";

const pdfParser = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    return data.text;
  } catch (error) {
    throw new Error("PDF parsing failed");
  }
};

export default pdfParser;