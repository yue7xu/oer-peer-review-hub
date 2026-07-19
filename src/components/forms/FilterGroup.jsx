import React, { useMemo, useState } from "react";
import { Input } from "./Input.jsx";

const CSS = `
.oer-fgroup {
  border: 1px solid var(--border-default); border-radius: var(--radius-lg);
  background: var(--surface-default); padding: 18px 20px; box-sizing: border-box;
  transition: background 150ms ease, border-color 150ms ease;
}
.oer-fgroup--active { border-color: var(--border-strong); background: var(--surface-subtle); }
.oer-fgroup__head {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  width: 100%; background: none; border: none; padding: 0; cursor: pointer;
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 17px;
  color: var(--text-default); text-align: left;
}
.oer-fgroup__head-right { display: inline-flex; align-items: center; gap: 8px; flex: none; }
.oer-fgroup__summary { font-family: var(--font-label); font-size: 14px; font-weight: var(--weight-regular); color: var(--text-subtle); }
.oer-fgroup__summary--active { color: var(--text-default); font-weight: var(--weight-medium); }
.oer-fgroup__chevron { display: inline-flex; flex: none; color: var(--text-subtle); transition: transform 150ms ease; }
.oer-fgroup__chevron--open { transform: rotate(180deg); }
.oer-fgroup__body { display: flex; flex-direction: column; gap: 9px; margin-top: 16px; }
.oer-fgroup__more {
  font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-medium);
  color: var(--text-brand); background: none; border: none; padding: 0; margin-top: 2px;
  cursor: pointer; text-align: left; width: fit-content;
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "filtergroup");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * FilterGroup — a Browse sidebar facet group rendered as a bordered,
 * collapsible pill-card (per Figma's filter-sidebar treatment). Collapsed by
 * default; the header shows "Any" or "{n} selected" and gains an emphasized
 * border/fill while open or while it has an active selection. Optionally
 * searchable (filters + highlights `options` by label) and truncates long
 * option lists behind a "Show N more" toggle.
 */
export function FilterGroup({
  label,
  options,
  renderOption,
  searchable = false,
  maxVisible = 5,
  defaultOpen = false,
  selectedCount = 0,
}) {
  useStyles();
  const [open, setOpen] = useState(defaultOpen);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search, searchable]);

  const visible = expanded ? filtered : filtered.slice(0, maxVisible);
  const remaining = filtered.length - visible.length;
  const active = open || selectedCount > 0;

  return (
    <div className={`oer-fgroup${active ? " oer-fgroup--active" : ""}`}>
      <button type="button" className="oer-fgroup__head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {label}
        <span className="oer-fgroup__head-right">
          {!open && (
            <span className={`oer-fgroup__summary${selectedCount > 0 ? " oer-fgroup__summary--active" : ""}`}>
              {selectedCount > 0 ? `${selectedCount} selected` : "Any"}
            </span>
          )}
          <span className={`oer-fgroup__chevron${open ? " oer-fgroup__chevron--open" : ""}`} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
      {open && (
        <div className="oer-fgroup__body">
          {searchable && (
            <Input
              placeholder={`Search ${label.toLowerCase()}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={`Search ${label}`}
            />
          )}
          {visible.map((opt) => renderOption(opt, search))}
          {remaining > 0 && (
            <button type="button" className="oer-fgroup__more" onClick={() => setExpanded(true)}>
              Show {remaining} more ⌄
            </button>
          )}
          {expanded && filtered.length > maxVisible && (
            <button type="button" className="oer-fgroup__more" onClick={() => setExpanded(false)}>
              Show less ⌃
            </button>
          )}
        </div>
      )}
    </div>
  );
}
