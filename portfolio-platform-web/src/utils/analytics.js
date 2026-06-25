import { api } from "./api";

const SESSION_KEY = "portfolio_session_id";
const SESSION_TTL_MS = 30 * 60 * 1000;

function generateSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getSessionId() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const { id, ts } = JSON.parse(raw);
      if (id && ts && Date.now() - ts < SESSION_TTL_MS) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ id, ts: Date.now() }));
        return id;
      }
    }
  } catch {
    // localStorage blocked or corrupt — fall through
  }
  const id = generateSessionId();
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id, ts: Date.now() }));
  } catch {
    // ignore — still return the id for this call
  }
  return id;
}

export function detectDevice() {
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|Nexus 7|Nexus 10|SM-T/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

export function detectBrowser() {
  const ua = navigator.userAgent || "";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Safari\//i.test(ua) && /Version\//i.test(ua)) return "Safari";
  return "Other";
}

export async function trackVisitor(page) {
  try {
    await api.post("/api/analytics/visitor", {
      sessionId: getSessionId(),
      page: page || window.location.pathname || "/",
      deviceType: detectDevice(),
      browser: detectBrowser(),
      referrer: document.referrer || undefined,
    });
  } catch {
    // analytics is best-effort — never break the user experience
  }
}

export async function trackSectionView(sectionName) {
  try {
    await api.post("/api/analytics/event", {
      sessionId: getSessionId(),
      eventType: "section_view",
      sectionName,
    });
  } catch {
    // best-effort
  }
}
