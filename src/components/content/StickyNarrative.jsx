import React, { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../lib/motion.js";

const CSS = `
.oer-sticky { display: grid; grid-template-columns: 240px 1fr; gap: 56px; }
.oer-sticky__rail { position: sticky; top: 88px; align-self: start; }
.oer-sticky__rail-list { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; list-style: none; }
.oer-sticky__rail-link {
  display: block; padding: 10px 14px; border-radius: var(--radius-full); font-family: var(--font-label);
  font-size: 14px; font-weight: var(--weight-medium); color: var(--text-muted);
  transition: background var(--dur-cross) var(--ease-out), color var(--dur-cross) var(--ease-out);
}
.oer-sticky__rail-link:hover { color: var(--text-default); }
.oer-sticky__rail-link--active { background: var(--brand-primary-subtle); color: var(--text-brand); }

.oer-sticky__content { display: flex; flex-direction: column; gap: 64px; min-width: 0; }
.oer-sticky__block { min-width: 0; }
.oer-sticky__block-title { font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 24px; color: var(--text-default); margin: 0 0 12px; }
.oer-sticky__block-summary { font-size: 16px; line-height: 1.7; color: var(--text-muted); margin: 0 0 16px; }
.oer-sticky__block-label { font-family: var(--font-label); font-size: 12px; font-weight: var(--weight-semibold); text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-subtle); margin: 0 0 10px; }
.oer-sticky__block-covers { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.oer-sticky__cover-title { font-family: var(--font-label); font-weight: var(--weight-semibold); font-size: 14px; color: var(--text-default); }
.oer-sticky__cover-gloss { font-size: 14px; color: var(--text-muted); }

@media (max-width: 899px) {
  .oer-sticky { display: block; }
  .oer-sticky__rail { display: none; }
  .oer-sticky__content { gap: 48px; }
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "stickynarrative");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * Sticky left rail + scrolling right content — the six O4PR rubrics as
 * parallel, equal-weight facets (not a sequence). Below 900px the rail is
 * simply hidden via CSS; each block already carries its own heading, so the
 * stacked layout is content-equivalent with nothing removed, per
 * docs/design/RESPONSIVE_BEHAVIOR.md § Sticky-layout fallback.
 */
export function StickyNarrative({ items }) {
  useStyles();
  const [activeId, setActiveId] = useState(items[0]?.id);
  const blockRefs = useRef({});

  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;
    if (typeof window !== "undefined" && window.innerWidth < 900) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-rubric-id");
            if (id) setActiveId(id);
          }
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" },
    );
    Object.values(blockRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <div className="oer-sticky">
      <div className="oer-sticky__rail">
        <ul className="oer-sticky__rail-list">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#rubric-${item.id}`}
                className={`oer-sticky__rail-link${activeId === item.id ? " oer-sticky__rail-link--active" : ""}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="oer-sticky__content">
        {items.map((item) => (
          <div
            key={item.id}
            id={`rubric-${item.id}`}
            data-rubric-id={item.id}
            ref={(el) => {
              blockRefs.current[item.id] = el;
            }}
            className="oer-sticky__block"
          >
            <h3 className="oer-sticky__block-title">{item.label}</h3>
            <p className="oer-sticky__block-summary">{item.summary}</p>
            {item.covers?.length > 0 && (
              <>
                <div className="oer-sticky__block-label">What it covers</div>
                <ul className="oer-sticky__block-covers">
                  {item.covers.map((c) => (
                    <li key={c.title}>
                      <span className="oer-sticky__cover-title">{c.title}</span>
                      <span className="oer-sticky__cover-gloss"> — {c.gloss}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
