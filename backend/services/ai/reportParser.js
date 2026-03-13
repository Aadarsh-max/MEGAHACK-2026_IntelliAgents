import groq from "../../config/groqClient.js";

const reportParser = async (reportText) => {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Extract health parameters from a medical report text and return them in JSON format with fields: name, value, unit, normalRange.",
      },
      {
        role: "user",
        content: reportText,
      },
    ],
  });

  return completion.choices[0].message.content;
};

export default reportParser;
