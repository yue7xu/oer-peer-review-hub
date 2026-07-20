import React, { useLayoutEffect, useRef, useState } from "react";
import { FilterChip } from "../forms/FilterChip.jsx";
import { Button } from "../forms/Button.jsx";
import { prefersReducedMotion } from "../../lib/motion.js";

/** Same disclosure timing as RubricMethod.jsx — reused verbatim per
 * SECTION_LIBRARY.md's "Role-Based Tabs" contract. */
const CONTENT_OUT_MS = 160;
const CONTENT_IN_DELAY = 200;

const CSS = `
.oer-roletabs__list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.oer-roletabs__shell { overflow: hidden; transition: height var(--dur-panel) var(--ease-out); }
.oer-roletabs__panel { opacity: 0; transition: opacity var(--dur-med) var(--ease-out); }
.oer-roletabs__panel.is-visible { opacity: 1; }
.oer-roletabs__body { font-size: 16px; line-height: 1.7; color: var(--text-muted); margin: 0 0 16px; }
.oer-roletabs__list-items { margin: 0 0 24px; padding-left: 20px; color: var(--text-muted); font-size: 16px; line-height: 1.7; }
.oer-roletabs__list-items li { margin-bottom: 6px; }

@media (prefers-reduced-motion: reduce) {
  .oer-roletabs__shell, .oer-roletabs__panel { transition: none; }
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "roletabs");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Generalized role-based tab/panel — Author/Reviewer/Institution on Home,
 * extendable to any 2-4 role set. Reuses RubricMethod's exact fade/height
 * swap sequence, and adds ARIA APG roving-focus arrow-key navigation between
 * tabs, which RubricMethod's own chip row is missing (flagged as a real gap
 * to close, not carry forward, in docs/design/SECTION_LIBRARY.md).
 */
export function RoleTabs({ roles, panels }) {
  useStyles();
  const [activeId, setActiveId] = useState(roles[0].id);
  const [visibleId, setVisibleId] = useState(roles[0].id);
  const [contentShown, setContentShown] = useState(true);
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const timers = useRef([]);
  const heightRef = useRef(0);
  const tabRefs = useRef({});

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const measure = () => (panelRef.current ? Math.ceil(panelRef.current.getBoundingClientRect().height) : 0);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const to = measure();
    shell.style.height = `${to}px`;
    heightRef.current = to;
  }, [visibleId, contentShown]);

  const selectRole = (id) => {
    if (id === activeId) return;
    clearTimers();
    setActiveId(id);
    if (prefersReducedMotion()) {
      setVisibleId(id);
      setContentShown(true);
      return;
    }
    setContentShown(false);
    schedule(() => {
      setVisibleId(id);
      schedule(() => setContentShown(true), CONTENT_IN_DELAY - CONTENT_OUT_MS > 0 ? CONTENT_IN_DELAY - CONTENT_OUT_MS : 40);
    }, CONTENT_OUT_MS);
  };

  const onTabKeyDown = (e, index) => {
    const count = roles.length;
    let nextIndex = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % count;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + count) % count;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = count - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    const nextRole = roles[nextIndex];
    tabRefs.current[nextRole.id]?.focus();
    selectRole(nextRole.id);
  };

  const panel = panels[visibleId];

  return (
    <div>
      <div className="oer-roletabs__list" role="tablist" aria-label="View the Hub by role">
        {roles.map((role, i) => {
          const selected = activeId === role.id;
          return (
            <FilterChip
              key={role.id}
              label={role.label}
              selected={selected}
              onClick={() => selectRole(role.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              role="tab"
              aria-selected={selected}
              aria-controls={`oer-roletabs-panel-${role.id}`}
              id={`oer-roletabs-tab-${role.id}`}
              tabIndex={selected ? 0 : -1}
              ref={(el) => {
                tabRefs.current[role.id] = el;
              }}
            />
          );
        })}
      </div>
      <div ref={shellRef} className="oer-roletabs__shell">
        <div
          ref={panelRef}
          id={`oer-roletabs-panel-${visibleId}`}
          className={`oer-roletabs__panel${contentShown ? " is-visible" : ""}`}
          role="tabpanel"
          aria-labelledby={`oer-roletabs-tab-${visibleId}`}
        >
          {panel && (
            <>
              <p className="oer-roletabs__body">{panel.body}</p>
              <ul className="oer-roletabs__list-items">
                {panel.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Button variant="primary" size="md" href={panel.cta.href}>
                {panel.cta.label}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
