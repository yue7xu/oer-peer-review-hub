import React from "react";

const CSS = `
.oer-select-field { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-label); }
.oer-select-field__label { font-size: 13px; font-weight: var(--weight-medium); color: var(--text-default); }
.oer-select__wrap { position: relative; display: flex; align-items: center; }
.oer-select {
  appearance: none; -webkit-appearance: none; font-family: var(--font-body); font-size: 14px;
  color: var(--text-default); background: var(--surface-default);
  border: 1px solid var(--border-default); border-radius: var(--radius-sm);
  padding: 9px 36px 9px 12px; width: 100%; box-sizing: border-box; cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.oer-select:hover { border-color: var(--border-strong); }
.oer-select:focus { outline: none; border-color: var(--interactive-default); box-shadow: 0 0 0 3px var(--interactive-focus); }
.oer-select:disabled { background: var(--surface-disabled); color: var(--text-disabled); cursor: not-allowed; }
.oer-select__chevron { position: absolute; right: 12px; pointer-events: none; color: var(--text-muted); display: inline-flex; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "select");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Native select styled to the system — used for sort order and single-choice filters.
 */
export function Select({
  label = null,
  options = [],
  id,
  className = "",
  children,
  ...rest
}) {
  useStyles();
  return (
    <div className="oer-select-field">
      {label && (
        <label className="oer-select-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="oer-select__wrap">
        <select id={id} className={`oer-select ${className}`.trim()} {...rest}>
          {children ||
            options.map((o) => {
              const value = typeof o === "object" ? o.value : o;
              const text = typeof o === "object" ? o.label : o;
              return (
                <option key={value} value={value}>
                  {text}
                </option>
              );
            })}
        </select>
        <span className="oer-select__chevron">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
