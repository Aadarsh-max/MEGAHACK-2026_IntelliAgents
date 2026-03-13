import MedicalReport from "../models/MedicalReport.js";
import mongoose from "mongoose";

import parseReport from "../services/ai/reportParser.js";
import analyzeHealth from "../services/ai/healthAnalyzer.js";
import predictRisks from "../services/ai/riskPredictor.js";

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No report file uploaded" });
    }

    // Step 1: Create initial report document
    const report = await MedicalReport.create({
      user: req.user.id,
      reportFile: req.file.path,
    });

    console.log("Report uploaded:", req.file.path);

    // Step 2: Extract parameters using AI
    const parameters = await parseReport(req.file.path);

    console.log("EXTRACTED PARAMETERS:", parameters);

    if (!parameters || parameters.length === 0) {
      console.warn("No parameters detected from report.");
    }

    // Step 3: Analyze health
    let healthAnalysis = {
      healthScore: 0,
      summary: "Health analysis not available",
    };

    if (parameters.length > 0) {
      healthAnalysis = await analyzeHealth(parameters);
    }

    console.log("HEALTH ANALYSIS:", healthAnalysis);

    // Step 4: Predict risks
    let risks = [];

    if (parameters.length > 0) {
      risks = await predictRisks(parameters);
    }

    console.log("PREDICTED RISKS:", risks);

    // Step 5: Save processed data
    report.parameters = parameters || [];
    report.healthScore = healthAnalysis.healthScore || 0;
    report.aiSummary = healthAnalysis.summary || "";
    report.risks = risks || [];
    report.processed = true;

    await report.save();

    console.log("Report saved with AI analysis");

    res.status(201).json(report);
  } catch (error) {
    console.error("Upload report error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const report = await MedicalReport.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.deleteOne();

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
