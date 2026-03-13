import groq from "../../config/groqClient.js";

const riskPredictor = async (parameters) => {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a preventive healthcare assistant. Based on blood test parameters, predict possible health risks and classify them as low, medium, or high risk.",
      },
      {
        role: "user",
        content: `Blood report parameters: ${JSON.stringify(parameters)}`,
      },
    ],
  });

  return completion.choices[0].message.content;
};

export default riskPredictor;
