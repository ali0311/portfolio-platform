import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/overview", async (_req, res, next) => {
  try {
    const [totalVisitors, uniqueSessions, resumeDownloads, contactMessages] =
      await Promise.all([
        prisma.visitor.count(),
        prisma.visitor.findMany({ distinct: ["sessionId"], select: { sessionId: true } }),
        prisma.resumeDownload.count(),
        prisma.contactMessage.count(),
      ]);

    res.json({
      totalVisitors,
      uniqueVisitors: uniqueSessions.length,
      resumeDownloads,
      contactMessages,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/visitor-trend", async (_req, res, next) => {
  try {
    const days = 7;
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - (days - 1));

    const visitors = await prisma.visitor.findMany({
      where: { createdAt: { gte: start } },
      select: { sessionId: true, createdAt: true },
    });

    const buckets = new Map();
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      buckets.set(d.toISOString().slice(0, 10), { visitors: 0, sessions: new Set() });
    }

    for (const v of visitors) {
      const key = v.createdAt.toISOString().slice(0, 10);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.visitors += 1;
        bucket.sessions.add(v.sessionId);
      }
    }

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    for (const [key, b] of buckets) {
      const d = new Date(key);
      result.push({
        day: dayLabels[d.getUTCDay()],
        visitors: b.visitors,
        unique: b.sessions.size,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/top-sections", async (_req, res, next) => {
  try {
    const grouped = await prisma.pageEvent.groupBy({
      by: ["sectionName"],
      _count: { sectionName: true },
      orderBy: { _count: { sectionName: "desc" } },
      take: 10,
    });
    res.json(
      grouped
        .filter((g) => g.sectionName)
        .map((g) => ({ section: g.sectionName, count: g._count.sectionName }))
    );
  } catch (err) {
    next(err);
  }
});

router.get("/devices", async (_req, res, next) => {
  try {
    const [devices, browsers] = await Promise.all([
      prisma.visitor.groupBy({
        by: ["deviceType"],
        _count: { deviceType: true },
      }),
      prisma.visitor.groupBy({
        by: ["browser"],
        _count: { browser: true },
      }),
    ]);

    res.json({
      devices: devices.map((d) => ({
        device: d.deviceType || "unknown",
        count: d._count.deviceType,
      })),
      browsers: browsers.map((b) => ({
        browser: b.browser || "unknown",
        count: b._count.browser,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/countries", async (_req, res, next) => {
  try {
    const grouped = await prisma.visitor.groupBy({
      by: ["country"],
      where: { country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 15,
    });
    res.json(
      grouped.map((g) => ({ country: g.country, count: g._count.country }))
    );
  } catch (err) {
    next(err);
  }
});

router.get("/recent-visitors", async (_req, res, next) => {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
    });
    res.json(visitors);
  } catch (err) {
    next(err);
  }
});

router.get("/contact-messages", async (_req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

export default router;
