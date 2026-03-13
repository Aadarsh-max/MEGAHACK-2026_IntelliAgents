import groq from "../../config/groqClient.js";

const healthChatbot = async ({ question, reportData }) => {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful health assistant. Answer questions about medical reports in simple language. Do not give medical diagnosis.",
      },
      {
        role: "user",
        content: `Report Data: ${JSON.stringify(reportData)}\n\nQuestion: ${question}`,
      },
    ],
  });

  return completion.choices[0].message.content;
};

export default healthChatbot;
