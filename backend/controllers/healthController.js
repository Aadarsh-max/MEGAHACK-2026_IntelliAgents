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

    // abnormal parameters
    const abnormalParameters = latestReport.parameters.filter(
      (p) => p.status === "low" || p.status === "high",
    );

    // -------------------------
    // PARAMETER COMPARISON DATA
    // -------------------------

    const comparisonData = latestReport.parameters.map((p) => {
      let normalValue = null;

      if (p.normalRange) {
        const range = p.normalRange.split("-").map(Number);
        if (range.length === 2) {
          normalValue = (range[0] + range[1]) / 2;
        }
      }

      let percentage = 0;

      if (normalValue && p.value) {
        percentage = Math.round((p.value / normalValue) * 100);
      }

      return {
        name: p.name,
        userValue: p.value,
        normalValue: normalValue || "-",
        percentage,
      };
    });

    // -------------------------
    // TREND DATA (FROM HISTORY)
    // -------------------------

    const trendData = [];

    const parameterNames = [
      ...new Set(latestReport.parameters.map((p) => p.name)),
    ];

    parameterNames.forEach((name) => {
      const values = reports
        .slice(0, 3) // last 3 reports
        .map((report) => {
          const param = report.parameters.find((p) => p.name === name);

          if (!param) return null;

          return {
            month: new Date(report.reportDate).toLocaleString("default", {
              month: "short",
            }),
            value: param.value,
          };
        })
        .filter(Boolean);

      if (values.length) {
        trendData.push({
          name,
          values,
        });
      }
    });

    // -------------------------

    res.json({
      healthScore: latestReport.healthScore,
      abnormalParameters,
      risks: latestReport.risks,
      aiSummary: latestReport.aiSummary,
      comparisonData,
      trendData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHealthHistory = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ user: req.user.id }).sort({
      reportDate: -1,
    });

    const history = reports.map((report) => ({
      _id: report._id,
      reportDate: report.reportDate,
      parameters: report.parameters,
      healthScore: report.healthScore,
      processed: report.processed,
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
      { new: true, upsert: true },
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
