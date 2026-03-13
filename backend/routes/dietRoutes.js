import express from "express";
import {
  generateDietPlan,
  getUserDietPlans,
} from "../controllers/dietController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/generate", authMiddleware, generateDietPlan);
router.get("/", authMiddleware, getUserDietPlans);

export default router;