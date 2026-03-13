import groq from "../../config/groqClient.js";

export default function analyzeHealth(parameters) {
  if (!parameters || parameters.length === 0) {
    return {
      healthScore: 0,
      summary: "No parameters detected from the report."
    };
  }

  let score = 100;

  parameters.forEach((p) => {
    if (p.status === "high" || p.status === "low") {
      score -= 10;
    }
  });

  if (score < 0) score = 0;

  return {
    healthScore: score,
    summary: `Your health score is ${score}/100 based on the analyzed parameters.`
  };
}