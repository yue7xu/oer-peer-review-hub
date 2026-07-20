import React from "react";
import { InstitutionCard } from "./InstitutionCard.jsx";
import { useRevealOnScroll } from "../../lib/motion.js";

const CSS = `
.oer-instgrid {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 20px;
}
.oer-instgrid li {
  opacity: 0; transform: translateY(12px);
  transition: opacity var(--dur-long) var(--ease-out), transform var(--dur-long) var(--ease-out);
  transition-delay: calc(var(--stagger-index, 0) * var(--dur-stagger-step));
}
.oer-instgrid--in li { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .oer-instgrid li { transition: none; transition-delay: 0s; } }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "institutionsgrid");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Institution logo grid — real `partners.js` data via `InstitutionCard`,
 * group-stagger reveal capped at 6 items' worth of delay (longer lists
 * animate the remainder alongside the 6th), per docs/design/MOTION_SYSTEM.md
 * § Stagger behavior. `minmax(160px, 1fr)` (not 200px) so the grid doesn't
 * overflow below ~400px viewport width, per docs/design/RESPONSIVE_BEHAVIOR.md
 * § Grid behavior.
 */
export function InstitutionsGrid({ partners }) {
  useStyles();
  const [ref, isIn] = useRevealOnScroll();
  return (
    <ul ref={ref} className={`oer-instgrid${isIn ? " oer-instgrid--in" : ""}`}>
      {partners.map((p, i) => (
        <li key={p.name} style={{ "--stagger-index": Math.min(i, 5) }}>
          <InstitutionCard name={p.name} logo={p.logo} alt={p.alt} />
        </li>
      ))}
    </ul>
  );
}
