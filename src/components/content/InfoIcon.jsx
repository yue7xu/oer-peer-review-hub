import React from "react";

const CSS = `
.oer-info { display: inline-flex; flex: none; color: var(--text-subtle); cursor: help; vertical-align: middle; }
.oer-info:hover { color: var(--text-muted); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "infoicon");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * InfoIcon — small "i"-in-circle glyph with a native tooltip, used to attach
 * a rubric's description wherever its name appears (filters, tables).
 */
export function InfoIcon({ title, className = "", ...rest }) {
  useStyles();
  return (
    <span className={`oer-info ${className}`.trim()} title={title} {...rest}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 6.4V10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="7" cy="4.3" r="0.9" fill="currentColor" />
      </svg>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {title}
      </span>
    </span>
  );
}
