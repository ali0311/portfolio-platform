import { ZodError } from "zod";
import { logger } from "../lib/logger.js";

export function notFound(req, res) {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.flatten(),
    });
  }

  const status = err.status || 500;
  if (status >= 500) {
    logger.error({ err, path: req.originalUrl }, "Unhandled error");
  }

  res.status(status).json({
    error: err.expose ? err.message : status >= 500 ? "Internal server error" : err.message,
  });
}

export class HttpError extends Error {
  constructor(status, message, { expose = true } = {}) {
    super(message);
    this.status = status;
    this.expose = expose;
  }
}
