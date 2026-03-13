import groq from "../../config/groqClient.js";
import pdfParser from "../report/pdfParser.js";

export default async function parseReport(filePath) {
  try {
    /* ---------- STEP 1: Extract PDF text ---------- */

    const reportText = await pdfParser(filePath);

    if (!reportText || reportText.trim().length === 0) {
      console.error("PDF text extraction failed.");
      return [];
    }

    /* ---------- STEP 2: Clean & reduce tokens ---------- */

    // remove extra spaces
    const cleanedText = reportText.replace(/\s+/g, " ");

    // keep only useful medical lines
    const keywords =
      /(hemoglobin|rbc|wbc|platelet|cholesterol|vitamin|glucose|triglyceride|neutrophil|lymphocyte|hematocrit|mcv|mch|mchc|rdw)/i;

    const filteredLines = cleanedText
      .split(/(?=[A-Z])/)
      .filter((line) => keywords.test(line))
      .join("\n");

    // hard token limit protection
    const MAX_TEXT_LENGTH = 3500;
    const shortenedText = filteredLines.slice(0, MAX_TEXT_LENGTH);

    console.log("TEXT SENT TO AI LENGTH:", shortenedText.length);

    /* ---------- STEP 3: AI Extraction ---------- */

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a medical report analyzer.

Extract blood test parameters from the report text.

Return ONLY valid JSON in this format:

[
  {
    "name": "Hemoglobin",
    "value": 13.8,
    "unit": "g/dL",
    "normalRange": "13.5 - 17.5",
    "status": "normal"
  }
]

Rules:
- Only JSON
- No explanation
- No markdown
- status must be: low, normal, high
- If value outside normal range mark low/high
`,
        },
        {
          role: "user",
          content: `Extract blood test parameters from this report:

${shortenedText}`,
        },
      ],
    });

    const response = completion.choices[0].message.content;

    console.log("AI RAW RESPONSE:", response);

    /* ---------- STEP 4: JSON parsing ---------- */

    let parameters = [];

    try {
      parameters = JSON.parse(response);
    } catch (err) {
      console.error("AI returned invalid JSON:", response);
      return [];
    }

    /* ---------- STEP 5: Clean output ---------- */

    const cleanedParameters = parameters
      .filter((p) => p.name && p.value !== undefined)
      .map((p) => ({
        name: String(p.name).trim(),
        value: Number(p.value),
        unit: p.unit || "",
        normalRange: p.normalRange || "",
        status: ["low", "normal", "high"].includes(p.status)
          ? p.status
          : "normal",
      }));

    console.log("FINAL PARAMETERS:", cleanedParameters);

    return cleanedParameters;
  } catch (error) {
    console.error("Report parsing failed:", error);
    return [];
  }
}