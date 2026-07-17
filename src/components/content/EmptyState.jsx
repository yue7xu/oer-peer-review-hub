import React from "react";

const CSS = `
.oer-empty {
  box-sizing: border-box; padding: 48px 24px; text-align: center;
  background: var(--surface-default); border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}
.oer-empty__title {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 18px;
  color: var(--text-default); margin: 0 0 6px;
}
.oer-empty__message { font-size: 14px; line-height: 1.6; color: var(--text-muted); margin: 0; }
.oer-empty__action { margin-top: 20px; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "emptystate");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * EmptyState — bordered "nothing to show" panel with a title, a message, and
 * an optional action (e.g. a "Clear filters" button), per Figma's zero-results
 * treatment for Browse.
 */
export function EmptyState({ title, message, action = null, className = "", ...rest }) {
  useStyles();
  return (
    <div className={`oer-empty ${className}`.trim()} {...rest}>
      <p className="oer-empty__title">{title}</p>
      {message && <p className="oer-empty__message">{message}</p>}
      {action && <div className="oer-empty__action">{action}</div>}
    </div>
  );
}
