import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const visitorSchema = z.object({
  sessionId: z.string().min(1),
  page: z.string().min(1),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  country: z.string().optional(),
  referrer: z.string().optional(),
});

router.post("/visitor", validate(visitorSchema), async (req, res, next) => {
  try {
    const { sessionId, page, deviceType, browser, country, referrer } = req.body;
    await prisma.visitor.create({
      data: {
        sessionId,
        visitedPage: page,
        deviceType,
        browser,
        country,
        referrer,
      },
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

const resumeSchema = z.object({
  sessionId: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  sourcePage: z.string().optional(),
});

router.post("/resume-download", validate(resumeSchema), async (req, res, next) => {
  try {
    await prisma.resumeDownload.create({ data: req.body });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

const eventSchema = z.object({
  sessionId: z.string().optional(),
  eventType: z.string().min(1),
  sectionName: z.string().optional(),
});

router.post("/event", validate(eventSchema), async (req, res, next) => {
  try {
    await prisma.pageEvent.create({ data: req.body });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
