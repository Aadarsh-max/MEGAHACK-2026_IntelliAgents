import express from "express";
import {
  getHealthInsights,
  getHealthHistory,
  updateHealthProfile,
  getHealthProfile,
} from "../controllers/healthController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/insights", authMiddleware, getHealthInsights);
router.get("/history", authMiddleware, getHealthHistory);

router.get("/profile", authMiddleware, getHealthProfile);
router.put("/profile", authMiddleware, updateHealthProfile);

export default router;