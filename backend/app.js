import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use(errorMiddleware);

export default app;