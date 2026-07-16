import React from "react";

const CSS = `
.oer-field { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-label); }
.oer-field__label { font-size: 13px; font-weight: var(--weight-medium); color: var(--text-default); }
.oer-field__label .oer-req { color: var(--feedback-error-text); margin-left: 2px; }
.oer-input {
  font-family: var(--font-body); font-size: 14px; color: var(--text-default);
  background: var(--surface-default); border: 1px solid var(--border-default);
  border-radius: var(--radius-sm); padding: 9px 12px; width: 100%; box-sizing: border-box;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.oer-input::placeholder { color: var(--text-subtle); }
.oer-input:hover { border-color: var(--border-strong); }
.oer-input:focus { outline: none; border-color: var(--interactive-default); box-shadow: 0 0 0 3px var(--interactive-focus); }
.oer-input:disabled { background: var(--surface-disabled); color: var(--text-disabled); cursor: not-allowed; }
.oer-input--error { border-color: var(--feedback-error-icon); }
.oer-input--error:focus { box-shadow: 0 0 0 3px var(--feedback-error-background); }
.oer-field__hint { font-size: 12px; color: var(--text-subtle); }
.oer-field__hint--error { color: var(--feedback-error-text); }
.oer-input__wrap { position: relative; display: flex; align-items: center; }
.oer-input__lead { position: absolute; left: 12px; display: inline-flex; color: var(--text-subtle); pointer-events: none; }
.oer-input__wrap--lead .oer-input { padding-left: 38px; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "input");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Text input with optional label, leading icon, hint / error message.
 */
export function Input({
  label = null,
  hint = null,
  error = null,
  required = false,
  leadingIcon = null,
  id,
  className = "",
  ...rest
}) {
  useStyles();
  const inputCls = ["oer-input", error && "oer-input--error", className]
    .filter(Boolean)
    .join(" ");
  const wrapCls = ["oer-input__wrap", leadingIcon && "oer-input__wrap--lead"]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="oer-field">
      {label && (
        <label className="oer-field__label" htmlFor={id}>
          {label}
          {required && <span className="oer-req">*</span>}
        </label>
      )}
      <div className={wrapCls}>
        {leadingIcon && <span className="oer-input__lead">{leadingIcon}</span>}
        <input id={id} className={inputCls} aria-invalid={!!error} {...rest} />
      </div>
      {(error || hint) && (
        <span className={`oer-field__hint${error ? " oer-field__hint--error" : ""}`}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
