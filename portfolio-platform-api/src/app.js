import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import analyticsRoutes from "./routes/analytics.js";
import contactRoutes from "./routes/contact.js";
import dashboardRoutes from "./routes/dashboard.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(pinoHttp({ logger }));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN?.split(",") ?? "http://localhost:5173",
      credentials: true,
    })
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
