import React from "react";
import { injectStyles } from "../../lib/injectStyles.js";

const CSS = `
.oer-chip {
  display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-label);
  font-size: 13px; font-weight: var(--weight-medium); line-height: 1;
  padding: 7px 12px; border-radius: var(--radius-full); cursor: pointer;
  background: var(--surface-default); color: var(--text-muted);
  border: 1px solid var(--border-default);
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}
.oer-chip:hover { border-color: var(--border-strong); color: var(--text-default); }
.oer-chip:focus-visible { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
.oer-chip--selected {
  background: var(--brand-primary-subtle); border-color: var(--brand-primary);
  color: var(--text-brand);
}
.oer-chip--selected:hover { color: var(--text-brand-hover); }
.oer-chip__remove { display: inline-flex; margin-right: -2px; opacity: 0.75; }
.oer-chip__remove:hover { opacity: 1; }
.oer-chip__count { color: var(--text-subtle); font-weight: var(--weight-regular); }
.oer-chip--selected .oer-chip__count { color: var(--text-brand); }
`;

function useStyles() {
  injectStyles("filterchip", CSS);
}

/**
 * Filter chip — a toggleable pill for browse facets. When `onRemove` is set it
 * shows an × and acts as an active/removable filter token. Also doubles as a
 * tab trigger (pass `role="tab"` + `aria-selected` via rest props, e.g.
 * RoleTabs.jsx) — forwards its ref so callers can drive roving focus.
 */
export const FilterChip = React.forwardRef(function FilterChip(
  {
    label,
    selected = false,
    count = null,
    onRemove = null,
    onClick,
    className = "",
    role,
    ...rest
  },
  ref,
) {
  useStyles();
  const cls = ["oer-chip", selected && "oer-chip--selected", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      ref={ref}
      type="button"
      role={role}
      className={cls}
      aria-pressed={role ? undefined : selected}
      onClick={onClick}
      {...rest}
    >
      {label}
      {count != null && <span className="oer-chip__count">{count}</span>}
      {onRemove && (
        <span
          className="oer-chip__remove"
          role="img"
          aria-label="Remove filter"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </button>
  );
});
