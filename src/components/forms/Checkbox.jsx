import React from "react";

const CSS = `
.oer-check { display: inline-flex; align-items: flex-start; gap: 10px; font-family: var(--font-body); cursor: pointer; }
.oer-check--split { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 10px; }
.oer-check--disabled { cursor: not-allowed; }
.oer-check__main { display: inline-flex; align-items: center; gap: 10px; min-width: 0; }
.oer-check__count--right { flex: none; font-family: var(--font-label); font-size: 13px; color: var(--text-subtle); }
.oer-check__box {
  flex: none; width: 18px; height: 18px; margin-top: 1px; box-sizing: border-box;
  border: 1px solid var(--border-strong); border-radius: var(--radius-sm);
  background: var(--surface-default); display: inline-flex; align-items: center; justify-content: center;
  transition: background 150ms ease, border-color 150ms ease;
}
.oer-check__native { position: absolute; opacity: 0; width: 1px; height: 1px; }
.oer-check__native:focus-visible + .oer-check__box { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
.oer-check__native:checked + .oer-check__box { background: var(--interactive-default); border-color: var(--interactive-default); }
.oer-check__native:checked + .oer-check__box .oer-check__mark { opacity: 1; }
.oer-check__native:disabled + .oer-check__box { background: var(--surface-disabled); border-color: var(--border-disabled); }
.oer-check__mark { opacity: 0; }
.oer-check__label { font-size: 14px; line-height: 1.4; color: var(--text-default); }
.oer-check--disabled .oer-check__label { color: var(--text-disabled); }
.oer-check__count { color: var(--text-subtle); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "checkbox");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Checkbox — used both standalone and as a filter-facet option (with count).
 * `countPosition="inline"` (default) renders "Label (count)"; `"right"`
 * right-aligns a bare count against the far edge of the row, per Figma's
 * Discipline/Rubric/Material-type facet treatment.
 */
export function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  count = null,
  countPosition = "inline",
  id,
  ...rest
}) {
  useStyles();
  const split = count != null && countPosition === "right";
  return (
    <label className={`oer-check${disabled ? " oer-check--disabled" : ""}${split ? " oer-check--split" : ""}`} htmlFor={id}>
      <span className="oer-check__main">
        <input
          id={id}
          type="checkbox"
          className="oer-check__native"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
        <span className="oer-check__box">
          <svg className="oer-check__mark" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="var(--text-inverse)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {label != null && (
          <span className="oer-check__label">
            {label}
            {count != null && countPosition === "inline" && <span className="oer-check__count"> ({count})</span>}
          </span>
        )}
      </span>
      {split && <span className="oer-check__count--right">{count}</span>}
    </label>
  );
}
