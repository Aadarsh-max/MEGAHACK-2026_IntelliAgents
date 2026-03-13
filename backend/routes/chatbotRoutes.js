import express from "express";
import { askHealthAssistant } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/ask", authMiddleware, askHealthAssistant);

export default router;
