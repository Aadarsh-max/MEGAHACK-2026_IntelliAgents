import groq from "../../config/groqClient.js";

const dietPlanner = async (parameters) => {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a nutrition expert. Based on blood test parameters, suggest healthy foods, foods to avoid, and a simple daily meal plan.",
      },
      {
        role: "user",
        content: `Blood report parameters: ${JSON.stringify(parameters)}`,
      },
    ],
  });

  return completion.choices[0].message.content;
};

export default dietPlanner;