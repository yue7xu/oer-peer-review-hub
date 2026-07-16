import React from "react";

const CSS = `
.oer-outbound {
  display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-label);
  font-weight: var(--weight-semibold); text-decoration: none; cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}
/* Outline-Pill treatment — the system reserves color for product visuals only,
   so "leaving the platform" reads through shape (pill, hairline border) and
   the ↗ glyph + "opens in a new tab" copy, not through a brand accent. */
.oer-outbound--button {
  font-size: 14px; line-height: 1; padding: 10px 16px; border-radius: var(--radius-full);
  background: var(--surface-default); color: var(--text-default);
  border: 1px solid var(--border-strong);
}
.oer-outbound--button:hover { background: var(--surface-subtle); border-color: var(--border-strong); }
.oer-outbound--button:focus-visible { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
/* Inline text (Ghost) treatment */
.oer-outbound--inline {
  font-size: 14px; color: var(--text-default);
  border-bottom: 1px solid transparent; border-radius: 0;
}
.oer-outbound--inline:hover { color: var(--text-muted); border-bottom-color: currentColor; }
.oer-outbound--inline:focus-visible { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
.oer-outbound__arrow { display: inline-flex; flex: none; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "outbound");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * OutboundLink — the "view original resource" affordance. Outline-pill or
 * ghost-underline + trailing ↗ glyph, opens in a new tab. Distinctiveness
 * comes from shape and icon, not color — the system reserves its two accent
 * colors for product-visual decoration, never interactive UI.
 */
export function OutboundLink({
  href,
  variant = "button",
  children = "View original resource",
  className = "",
  ...rest
}) {
  useStyles();
  return (
    <a
      className={`oer-outbound oer-outbound--${variant} ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
      <span className="oer-outbound__arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        (opens in a new tab)
      </span>
    </a>
  );
}
