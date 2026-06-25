import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signAuthToken } from "../lib/jwt.js";
import { logger } from "../lib/logger.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { HttpError } from "../middleware/errorHandler.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Try again in 10 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 12 * 60 * 60 * 1000,
  path: "/",
});

router.post("/login", loginLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      logger.warn({ email }, "Login failed: user not found");
      throw new HttpError(401, "Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      logger.warn({ email }, "Login failed: bad password");
      throw new HttpError(401, "Invalid credentials");
    }

    const token = signAuthToken({ userId: user.id, role: user.role });
    res.cookie("token", token, cookieOptions());
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true },
    });
    if (!user) throw new HttpError(401, "Session user no longer exists");
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
