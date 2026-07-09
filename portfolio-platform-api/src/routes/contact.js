import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactSchema = z.object({
  linkedinUrl: z.string().trim().min(1).max(300),
  message: z.string().trim().min(1).max(5000),
});

router.post("/", contactLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const created = await prisma.contactMessage.create({ data: req.body });
    res.status(201).json({ id: created.id, ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
