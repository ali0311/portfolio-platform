import { api } from "./api";

const VISITOR_KEY = "portfolio_visitor_id";
const COUNTRY_KEY = "portfolio_visitor_country";
const COUNTRY_LOOKUP_URL = "https://ipapi.co/country_name/";
const COUNTRY_LOOKUP_TIMEOUT_MS = 1500;

function generateVisitorId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId() {
  try {
    const id = localStorage.getItem(VISITOR_KEY);
    if (id) return id;
  } catch {
    // localStorage blocked — fall through and mint a fresh id per call
  }
  const id = generateVisitorId();
  try {
    localStorage.setItem(VISITOR_KEY, id);
  } catch {
    // ignore
  }
  return id;
}

async function fetchCountryFromIpapi() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), COUNTRY_LOOKUP_TIMEOUT_MS);
  try {
    const res = await fetch(COUNTRY_LOOKUP_URL, { signal: controller.signal });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    if (!text || text.length > 60 || /error/i.test(text)) return null;
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export async function getCountry() {
  try {
    const cached = localStorage.getItem(COUNTRY_KEY);
    if (cached) return cached;
  } catch {
    // localStorage blocked — fall through and try the network
  }
  try {
    const country = await fetchCountryFromIpapi();
    if (country) {
      try {
        localStorage.setItem(COUNTRY_KEY, country);
      } catch {
        // ignore
      }
      return country;
    }
  } catch {
    // network failure — best-effort, return null
  }
  return null;
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
    const country = await getCountry();
    await api.post("/api/analytics/visitor", {
      sessionId: getVisitorId(),
      page: page || window.location.pathname || "/",
      deviceType: detectDevice(),
      browser: detectBrowser(),
      country: country || undefined,
      referrer: document.referrer || undefined,
    });
  } catch {
    // analytics is best-effort — never break the user experience
  }
}

export async function trackSectionView(sectionName) {
  try {
    await api.post("/api/analytics/event", {
      sessionId: getVisitorId(),
      eventType: "section_view",
      sectionName,
    });
  } catch {
    // best-effort
  }
}
