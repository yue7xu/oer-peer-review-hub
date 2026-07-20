import React from "react";
import { useRevealOnScroll } from "../../lib/motion.js";
import { injectStyles } from "../../lib/injectStyles.js";

const CSS = `
.oer-reveal { opacity: 0; transform: translateY(12px); transition: opacity var(--dur-long) var(--ease-out), transform var(--dur-long) var(--ease-out); }
.oer-reveal--in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .oer-reveal { transition: none; } }
`;

function useStyles() {
  injectStyles("reveal", CSS);
}

/**
 * Fade-up-on-scroll wrapper — the single "the page is alive" entrance used
 * across Home/Community/About section bodies, per docs/design/MOTION_SYSTEM.md
 * § Entrance animation. Renders once at final state under reduced motion.
 */
export function Reveal({ children, as: Tag = "div", className = "", ...rest }) {
  useStyles();
  const [ref, isIn] = useRevealOnScroll();
  return (
    <Tag ref={ref} className={`oer-reveal${isIn ? " oer-reveal--in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
