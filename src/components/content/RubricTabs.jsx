import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FilterChip } from "../forms/FilterChip.jsx";
import { prefersReducedMotion } from "../../lib/motion.js";
import { injectStyles } from "../../lib/injectStyles.js";

/** Same disclosure timing as RoleTabs.jsx / RubricMethod.jsx. */
const CONTENT_OUT_MS = 160;
const CONTENT_IN_DELAY = 200;

const CSS = `
.oer-rubrictabs__list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.oer-rubrictabs__shell { overflow: hidden; transition: height var(--dur-panel) var(--ease-out); }
.oer-rubrictabs__panel { opacity: 0; transition: opacity var(--dur-med) var(--ease-out); }
.oer-rubrictabs__panel.is-visible { opacity: 1; }
.oer-rubrictabs__body { font-size: 16px; line-height: 1.7; color: var(--text-muted); margin: 0; }

@media (prefers-reduced-motion: reduce) {
  .oer-rubrictabs__shell, .oer-rubrictabs__panel { transition: none; }
}
`;

function useStyles() {
  injectStyles("rubrictabs", CSS);
}

/**
 * Rubric tab/panel — shows exactly one rubric's summary at a time (chip
 * tablist + single content panel), rather than stacking all six. Home-page
 * only; reuses the same fade/height swap timing as RoleTabs.jsx but without
 * a benefits list or per-panel CTA, since a rubric panel is a single summary
 * paragraph, not a role pitch. `items`: [{ id, label, summary }].
 */
export function RubricTabs({ items }) {
  useStyles();
  const [activeId, setActiveId] = useState(items[0].id);
  const [visibleId, setVisibleId] = useState(items[0].id);
  const [contentShown, setContentShown] = useState(true);
  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const timers = useRef([]);
  const tabRefs = useRef({});

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => clearTimers, []);

  const measure = () => (panelRef.current ? Math.ceil(panelRef.current.getBoundingClientRect().height) : 0);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    shell.style.height = `${measure()}px`;
  }, [visibleId, contentShown]);

  const selectItem = (id) => {
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
    const count = items.length;
    let nextIndex = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % count;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + count) % count;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = count - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    const nextItem = items[nextIndex];
    tabRefs.current[nextItem.id]?.focus();
    selectItem(nextItem.id);
  };

  const panel = items.find((r) => r.id === visibleId);

  return (
    <div>
      <div className="oer-rubrictabs__list" role="tablist" aria-label="Choose a rubric">
        {items.map((item, i) => {
          const selected = activeId === item.id;
          return (
            <FilterChip
              key={item.id}
              label={item.label}
              selected={selected}
              onClick={() => selectItem(item.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              role="tab"
              aria-selected={selected}
              aria-controls={`oer-rubrictabs-panel-${item.id}`}
              id={`oer-rubrictabs-tab-${item.id}`}
              tabIndex={selected ? 0 : -1}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
            />
          );
        })}
      </div>
      <div ref={shellRef} className="oer-rubrictabs__shell">
        <div
          ref={panelRef}
          id={`oer-rubrictabs-panel-${visibleId}`}
          className={`oer-rubrictabs__panel${contentShown ? " is-visible" : ""}`}
          role="tabpanel"
          aria-labelledby={`oer-rubrictabs-tab-${visibleId}`}
        >
          {panel && <p className="oer-rubrictabs__body">{panel.summary}</p>}
        </div>
      </div>
    </div>
  );
}
