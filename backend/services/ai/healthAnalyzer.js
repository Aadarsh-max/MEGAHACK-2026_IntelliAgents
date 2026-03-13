import groq from "../../config/groqClient.js";

const healthAnalyzer = async (parameters) => {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a health analysis assistant. Analyze blood test parameters, identify abnormal values, and explain them in simple language.",
      },
      {
        role: "user",
        content: `Blood report parameters: ${JSON.stringify(parameters)}`,
      },
    ],
  });

  return completion.choices[0].message.content;
};
export default healthAnalyzer;