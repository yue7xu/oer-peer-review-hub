import React from "react";

const CSS = `
.oer-badge {
  display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-label);
  font-size: 12px; font-weight: var(--weight-medium); line-height: 1;
  padding: 5px 11px; border-radius: var(--radius-full); white-space: nowrap;
}
.oer-badge--neutral   { background: var(--surface-default); color: var(--text-muted); border: 1px solid var(--border-default); }
.oer-badge--brand     { background: var(--surface-subtle); color: var(--text-default); }
.oer-badge--secondary { background: var(--surface-subtle); color: var(--text-muted); }
.oer-badge--solid     { background: var(--brand-primary); color: var(--text-inverse); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "badge");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Small label/tag — discipline, licence, version, format. Pill-shaped, per
 * the system's "tags: 9999px radius" spec — the same shape family as buttons.
 */
export function Badge({ variant = "neutral", children, className = "", ...rest }) {
  useStyles();
  return (
    <span className={`oer-badge oer-badge--${variant} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
