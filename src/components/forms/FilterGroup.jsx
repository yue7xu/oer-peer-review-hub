import React, { useMemo, useState } from "react";
import { Input } from "./Input.jsx";

const CSS = `
.oer-fgroup__head {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  width: 100%; background: none; border: none; padding: 0; cursor: pointer;
  font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-medium);
  color: var(--text-default); text-align: left;
}
.oer-fgroup__chevron { display: inline-flex; flex: none; color: var(--text-subtle); transition: transform 150ms ease; }
.oer-fgroup__chevron--open { transform: rotate(180deg); }
.oer-fgroup__body { display: flex; flex-direction: column; gap: 9px; margin-top: 12px; }
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
 * FilterGroup — a collapsible Browse sidebar facet group. Optionally
 * searchable (filters `options` by label) and truncates long option lists
 * behind a "Show N more" toggle, per Figma's Discipline group treatment.
 */
export function FilterGroup({
  label,
  options,
  renderOption,
  searchable = false,
  maxVisible = 5,
  defaultOpen = true,
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

  return (
    <div>
      <button type="button" className="oer-fgroup__head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {label}
        <span className={`oer-fgroup__chevron${open ? " oer-fgroup__chevron--open" : ""}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
          {visible.map(renderOption)}
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
