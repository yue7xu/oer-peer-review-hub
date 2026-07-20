// Shared motion helpers — promotes the `prefersReducedMotion()` +
// IntersectionObserver-reveal pattern duplicated across ProcessSpine.jsx and
// ReviewConsoleDemo.jsx into one place, per MOTION_SYSTEM.md's own note that
// a third/fourth duplication isn't worth it once the landing page needs it
// again for §3/§4/§7/§8.
import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Fires once when the element scrolls into view, matching ProcessSpine's
 * trigger geometry (threshold 0.2, rootMargin "0px 0px -12% 0px"). Returns a
 * ref to attach and a boolean that flips true on first entry (or
 * immediately, under reduced motion / no IntersectionObserver support).
 */
export function useRevealOnScroll() {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setIsIn(true);
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, isIn];
}
