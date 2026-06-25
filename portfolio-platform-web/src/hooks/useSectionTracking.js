import { useEffect } from "react";
import { trackSectionView } from "../utils/analytics";

const VIEWED_KEY = "portfolio_sections_viewed";

function loadSeenForSession(sessionId) {
  try {
    const raw = sessionStorage.getItem(VIEWED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (parsed.sessionId !== sessionId) return new Set();
    return new Set(parsed.sections || []);
  } catch {
    return new Set();
  }
}

function persistSeen(sessionId, seen) {
  try {
    sessionStorage.setItem(
      VIEWED_KEY,
      JSON.stringify({ sessionId, sections: Array.from(seen) })
    );
  } catch {
    // ignore
  }
}

export function useSectionTracking(sectionMap, { sessionId, threshold = 0.4 } = {}) {
  useEffect(() => {
    if (!sessionId || !sectionMap || Object.keys(sectionMap).length === 0) return;

    const seen = loadSeenForSession(sessionId);

    const elements = Object.entries(sectionMap)
      .map(([id, label]) => ({ id, label, el: document.getElementById(id) }))
      .filter((x) => x.el);

    if (elements.length === 0) return;

    const elById = new Map(elements.map((x) => [x.el, x]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const match = elById.get(entry.target);
          if (!match) continue;
          if (seen.has(match.label)) continue;
          seen.add(match.label);
          persistSeen(sessionId, seen);
          trackSectionView(match.label);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    elements.forEach((x) => observer.observe(x.el));

    return () => observer.disconnect();
  }, [sectionMap, sessionId, threshold]);
}
