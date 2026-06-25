import { verifyAuthToken } from "../lib/jwt.js";
import { HttpError } from "./errorHandler.js";

export function requireAuth(req, _res, next) {
  const token = req.cookies?.token;
  if (!token) return next(new HttpError(401, "Not authenticated"));

  try {
    const decoded = verifyAuthToken(token);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired session"));
  }
}
