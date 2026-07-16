import React from "react";

const CSS = `
.oer-btn {
  --_bg: var(--brand-primary);
  --_bgh: var(--brand-primary-hover);
  --_bga: var(--interactive-active);
  --_fg: var(--text-inverse);
  --_bd: var(--color-legacy-border);
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-label); font-weight: var(--weight-semibold);
  border: 1px solid var(--_bd); background: var(--_bg); color: var(--_fg);
  border-radius: var(--radius-full); cursor: pointer; text-decoration: none;
  white-space: nowrap; transition: background 150ms var(--ease-out), border-color 150ms var(--ease-out), color 150ms var(--ease-out);
}
.oer-btn:hover { background: var(--_bgh); border-color: var(--_bgh); }
.oer-btn:active { background: var(--_bga); border-color: var(--_bga); }
.oer-btn:focus-visible { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
.oer-btn[disabled], .oer-btn[aria-disabled="true"] {
  background: var(--surface-disabled); border-color: var(--border-disabled);
  color: var(--text-disabled); cursor: not-allowed; pointer-events: none;
}
.oer-btn--sm { font-size: 13px; line-height: 1; padding: 7px 12px; }
.oer-btn--md { font-size: 14px; line-height: 1; padding: 10px 16px; }
.oer-btn--lg { font-size: 16px; line-height: 1; padding: 13px 20px; }
.oer-btn--secondary {
  --_bg: var(--surface-default); --_bgh: var(--surface-subtle); --_bga: var(--color-stone);
  --_fg: var(--text-default); --_bd: var(--border-strong);
}
.oer-btn--secondary:hover { border-color: var(--border-strong); }
.oer-btn--secondary:active { border-color: var(--border-strong); }
.oer-btn--ghost {
  --_bg: transparent; --_bgh: var(--brand-primary-subtle); --_bga: var(--brand-primary-subtle);
  --_fg: var(--text-brand); --_bd: transparent;
}
.oer-btn--ghost:hover { border-color: transparent; }
.oer-btn--ghost:active { border-color: transparent; }
.oer-btn__icon { display: inline-flex; flex: none; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "button");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Primary action button. Renders a <button> or, when `href` is set, an <a>.
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  iconRight = null,
  href = null,
  children,
  className = "",
  ...rest
}) {
  useStyles();
  const cls = ["oer-btn", `oer-btn--${variant}`, `oer-btn--${size}`, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {icon && <span className="oer-btn__icon">{icon}</span>}
      {children}
      {iconRight && <span className="oer-btn__icon">{iconRight}</span>}
    </>
  );
  if (href && !disabled) {
    return (
      <a className={cls} href={href} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} disabled={disabled} {...rest}>
      {content}
    </button>
  );
}
