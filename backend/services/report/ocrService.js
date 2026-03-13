import Tesseract from "tesseract.js";

const ocrService = async (filePath) => {
  try {
    const { data } = await Tesseract.recognize(filePath, "eng", {
      logger: () => {},
    });

    return data.text;
  } catch (error) {
    throw new Error("OCR processing failed");
  }
};

export default ocrService;