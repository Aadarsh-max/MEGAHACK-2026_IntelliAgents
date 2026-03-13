import MedicalReport from "../models/MedicalReport.js";
import HealthProfile from "../models/HealthProfile.js";

export const getHealthInsights = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ user: req.user.id }).sort({
      reportDate: -1,
    });
    if (!reports.length) {
      return res.status(404).json({ message: "No medical reports found" });
    }
    const latestReport = reports[0];
    const abnormalParameters = latestReport.parameters.filter(
      (p) => p.status === "low" || p.status === "high"
    );
    res.json({
      healthScore: latestReport.healthScore,
      abnormalParameters,
      risks: latestReport.risks,
      aiSummary: latestReport.aiSummary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHealthHistory = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ user: req.user.id }).sort({
      reportDate: 1,
    });
    const history = reports.map((report) => ({
      reportDate: report.reportDate,
      parameters: report.parameters,
      healthScore: report.healthScore,
    }));
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateHealthProfile = async (req, res) => {
  try {
    const profile = await HealthProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHealthProfile = async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user.id });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};