import express from "express";
import {
  uploadReport,
  getUserReports,
  getReportById,
  deleteReport,
} from "../controllers/reportController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";
const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  uploadMiddleware.single("report"),
  uploadReport,
);
router.get("/", authMiddleware, getUserReports);
router.get("/:id", authMiddleware, getReportById);
router.delete("/:id", authMiddleware, deleteReport);

export default router;
