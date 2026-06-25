import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackVisitor } from "../utils/analytics";

const SKIP_PREFIXES = ["/dashboard", "/login"];

export function useVisitorTracking() {
  const { pathname } = useLocation();
  const lastTrackedRef = useRef(null);

  useEffect(() => {
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return;
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;
    trackVisitor(pathname);
  }, [pathname]);
}
