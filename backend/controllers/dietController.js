import groq from "../config/groqClient.js";
import DietPlan from "../models/DietPlan.js";
import MedicalReport from "../models/MedicalReport.js";

export const generateDietPlan = async (req, res) => {
  try {
    const { reportId } = req.body;
    const report = await MedicalReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Medical report not found" });
    }
    const parameters = report.parameters;
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a nutrition expert. Generate a healthy diet plan based on blood test parameters. Provide recommended foods, foods to avoid, and a simple daily meal plan.",
        },
        {
          role: "user",
          content: `Blood Report Parameters: ${JSON.stringify(parameters)}`,
        },
      ],
    });
    const aiResponse = completion.choices[0].message.content;
    const dietPlan = await DietPlan.create({
      user: req.user.id,
      report: reportId,
      notes: aiResponse,
      generatedByAI: true,
    });
    res.json({
      dietPlan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserDietPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
