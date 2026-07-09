import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const HASH_POLL_INTERVAL_MS = 40;
const HASH_POLL_TIMEOUT_MS = 800;

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const started = performance.now();
      let cancelled = false;

      const tryScroll = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ block: "start", behavior: "auto" });
          return;
        }
        if (performance.now() - started < HASH_POLL_TIMEOUT_MS) {
          setTimeout(tryScroll, HASH_POLL_INTERVAL_MS);
        }
      };

      tryScroll();
      return () => {
        cancelled = true;
      };
    }

    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }, [pathname, hash]);

  return null;
}
