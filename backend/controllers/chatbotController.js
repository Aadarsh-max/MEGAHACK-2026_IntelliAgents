import groq from "../config/groqClient.js";
import MedicalReport from "../models/MedicalReport.js";

export const askHealthAssistant = async (req, res) => {
  try {
    const { question, reportId } = req.body;
    let reportData = "";
    if (reportId) {
      const report = await MedicalReport.findById(reportId);
      if (report) {
        reportData = JSON.stringify(report.parameters);
      }
    }
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful medical health assistant. Explain health reports in simple language. Do not provide medical diagnosis.",
        },
        {
          role: "user",
          content: `Report Data: ${reportData}\n\nUser Question: ${question}`,
        },
      ],
    });
    const answer = completion.choices[0].message.content;
    res.json({
      answer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
