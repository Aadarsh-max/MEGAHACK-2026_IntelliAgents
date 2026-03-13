import MedicalReport from "../models/MedicalReport.js";

export const uploadReport = async (req, res) => {
  try {
    const report = await MedicalReport.create({
      user: req.user.id,
      reportFile: req.file.path,
    });

    res.status(201).json(report);
  } catch (error) {
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
    const report = await MedicalReport.findById(req.params.id);

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
