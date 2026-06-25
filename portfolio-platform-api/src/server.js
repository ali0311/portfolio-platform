import "dotenv/config";
import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

const server = app.listen(PORT, () => {
  logger.info(`API listening on http://localhost:${PORT}`);
});

const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
