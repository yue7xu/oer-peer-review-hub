import React from "react";
import { useRevealOnScroll } from "../../lib/motion.js";

const CSS = `
.oer-stepgrid__list {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  list-style: none; margin: 0; padding: 0;
}
.oer-stepgrid__item {
  background: var(--surface-subtle); border-radius: var(--radius-lg); padding: 28px;
  opacity: 0; transform: translateY(12px);
  transition: opacity var(--dur-long) var(--ease-out), transform var(--dur-long) var(--ease-out), box-shadow 150ms var(--ease-out);
  transition-delay: calc(var(--stagger-index, 0) * var(--dur-stagger-step));
}
.oer-stepgrid__item:hover { box-shadow: var(--shadow-subtle); }
.oer-stepgrid--in .oer-stepgrid__item { opacity: 1; transform: none; }
.oer-stepgrid__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.oer-stepgrid__icon {
  width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--surface-default);
  display: flex; align-items: center; justify-content: center; color: var(--text-default); flex: none;
}
.oer-stepgrid__num { font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-semibold); color: var(--text-subtle); }
.oer-stepgrid__title { font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 20px; line-height: 1.4; color: var(--text-default); margin: 0 0 8px; }
.oer-stepgrid__desc { font-size: 15px; line-height: 1.6; color: var(--text-muted); margin: 0; }

@media (max-width: 767px) {
  .oer-stepgrid__list { grid-template-columns: 1fr; row-gap: 32px; }
}
@media (prefers-reduced-motion: reduce) {
  .oer-stepgrid__item { transition: none; transition-delay: 0s; }
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "stepgrid");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Three-step teaser grid — semantic <ol> so assistive tech announces step
 * order even though the visual is a grid, per SECTION_LIBRARY.md's "Three-
 * Step Workflow" contract. Group-level stagger reveal (90ms/item), not a
 * per-item scroll trigger.
 */
export function StepGrid({ steps, className = "" }) {
  useStyles();
  const [ref, isIn] = useRevealOnScroll();
  return (
    <ol
      ref={ref}
      className={`oer-stepgrid__list${isIn ? " oer-stepgrid--in" : ""} ${className}`.trim()}
    >
      {steps.map((step, i) => (
        <li key={step.number} className="oer-stepgrid__item" style={{ "--stagger-index": i }}>
          <div className="oer-stepgrid__head">
            <div className="oer-stepgrid__icon">{step.icon}</div>
            <span className="oer-stepgrid__num">{step.number}</span>
          </div>
          <h3 className="oer-stepgrid__title">{step.title}</h3>
          <p className="oer-stepgrid__desc">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
