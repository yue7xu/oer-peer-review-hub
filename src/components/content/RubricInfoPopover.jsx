import React, { useState } from "react";

const CSS = `
.oer-ripop { position: relative; display: inline-flex; }
.oer-ripop__trigger {
  display: inline-flex; flex: none; color: var(--text-subtle); background: none; border: none;
  padding: 0; cursor: help; vertical-align: middle;
}
.oer-ripop__trigger:hover, .oer-ripop__trigger:focus-visible { color: var(--text-muted); }
.oer-ripop__card {
  position: absolute; z-index: 20; top: calc(100% + 8px); left: 0; width: 260px;
  background: var(--surface-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-subtle);
  padding: 18px 20px; box-sizing: border-box;
}
.oer-ripop__title { font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 16px; color: var(--text-default); margin: 0 0 6px; }
.oer-ripop__desc { font-size: 13px; line-height: 1.55; color: var(--text-muted); margin: 0 0 10px; }
.oer-ripop__link { font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-medium); color: var(--text-brand); text-decoration: underline; }
.oer-ripop__link:hover { color: var(--text-brand-hover); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "rubricinfopopover");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * RubricInfoPopover — an "i" glyph that reveals a rich card (title,
 * description, "View full rubric" link) on hover or keyboard focus, instead
 * of a plain native tooltip. Used where a rubric name needs more than a
 * one-line explanation, e.g. Browse's Rubric filter.
 */
export function RubricInfoPopover({ title, description, href = "#", className = "", ...rest }) {
  useStyles();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={`oer-ripop ${className}`.trim()}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...rest}
    >
      <button
        type="button"
        className="oer-ripop__trigger"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        aria-label={`About ${title}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 6.4V10.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="7" cy="4.3" r="0.9" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="oer-ripop__card" role="tooltip">
          <p className="oer-ripop__title">{title}</p>
          <p className="oer-ripop__desc">{description}</p>
          <a className="oer-ripop__link" href={href}>
            View full rubric →
          </a>
        </div>
      )}
    </span>
  );
}
