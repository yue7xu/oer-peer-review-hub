import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FilterChip } from "../forms/FilterChip.jsx";
import { RUBRIC_PANELS } from "./rubricPanels.js";

/** Soft Apple-like disclosure timing */
const OPEN_MS = 480;
const CONTENT_IN_DELAY = 200; // content starts partway through height open
const CONTENT_OUT_MS = 160;
const SWAP_GAP_MS = 40; // brief pause between out and in on chip swap

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Rubric method block: expandable chip disclosures + single-point diagram.
 * Chip order L→R on the diagram: Exceeds | EXEMPLIFIED | Needs Improvement.
 */
export function RubricMethod() {
  const [improveOn, setImproveOn] = useState(true);
  const [exceedOn, setExceedOn] = useState(true);

  const [activeId, setActiveId] = useState(null);
  const [visibleId, setVisibleId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [contentShown, setContentShown] = useState(false);

  const shellRef = useRef(null);
  const panelRef = useRef(null);
  const timers = useRef([]);
  const heightFromRef = useRef(0);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const measurePanel = () => {
    const panel = panelRef.current;
    if (!panel) return 0;
    return Math.ceil(panel.getBoundingClientRect().height);
  };

  const setShellHeight = (px, animate) => {
    const shell = shellRef.current;
    if (!shell) return;
    if (!animate || prefersReducedMotion()) {
      shell.style.transition = "none";
      shell.style.height = typeof px === "number" ? `${px}px` : px;
      // force reflow then restore transition for later
      void shell.offsetHeight;
      shell.style.transition = "";
      return;
    }
    shell.style.height = typeof px === "number" ? `${px}px` : px;
  };

  // After content/DOM changes while open, sync measured height (open + swap)
  useLayoutEffect(() => {
    if (!expanded || !visibleId) return undefined;
    const shell = shellRef.current;
    if (!shell) return undefined;

    const reduce = prefersReducedMotion();
    const to = measurePanel();
    const from = heightFromRef.current;

    if (reduce) {
      setShellHeight(to, false);
      heightFromRef.current = to;
      return undefined;
    }

    // Opening from 0, or swapping to a different height
    if (from !== to) {
      // Ensure we start from the previous pixel height before transitioning
      shell.style.transition = "none";
      shell.style.height = `${from}px`;
      void shell.offsetHeight;
      shell.style.transition = "";
      shell.style.height = `${to}px`;
      heightFromRef.current = to;
    }

    return undefined;
  }, [expanded, visibleId, contentShown]);

  const handleChip = (id) => {
    clearTimers();
    const reduce = prefersReducedMotion();
    const shell = shellRef.current;

    if (activeId === id) {
      // Collapse: content out, then height closed
      setActiveId(null);
      if (reduce) {
        setContentShown(false);
        setExpanded(false);
        setVisibleId(null);
        setShellHeight(0, false);
        heightFromRef.current = 0;
        return;
      }
      setContentShown(false);
      schedule(() => {
        const h = measurePanel() || heightFromRef.current;
        heightFromRef.current = h;
        if (shell) {
          shell.style.height = `${h}px`;
          void shell.offsetHeight;
        }
        setExpanded(false);
        setShellHeight(0, true);
        heightFromRef.current = 0;
        schedule(() => setVisibleId(null), OPEN_MS);
      }, CONTENT_OUT_MS);
      return;
    }

    if (activeId != null && expanded) {
      // Swap: fade out → swap content → height eases → fade in
      setActiveId(id);
      if (reduce) {
        setVisibleId(id);
        setContentShown(true);
        return;
      }
      heightFromRef.current = measurePanel() || heightFromRef.current;
      setContentShown(false);
      schedule(() => {
        setVisibleId(id);
        // height syncs in useLayoutEffect; then reveal content
        schedule(() => setContentShown(true), SWAP_GAP_MS);
      }, CONTENT_OUT_MS);
      return;
    }

    // Open: height eases open via useLayoutEffect; content enters mid-way
    setActiveId(id);
    setVisibleId(id);
    setContentShown(false);
    heightFromRef.current = 0;
    setShellHeight(0, false);
    setExpanded(true);
    if (reduce) {
      setContentShown(true);
      return;
    }
    schedule(() => setContentShown(true), CONTENT_IN_DELAY);
  };

  const panel = RUBRIC_PANELS.find((r) => r.id === visibleId);

  return (
    <section id="rubrics">
      <div className="hiw-sec-eye">The rubric method</div>
      <h2 className="hiw-sec-h">Single-point rubrics, built for comments.</h2>
      <p className="hiw-method-lede">
        All six rubrics share one design. Each criterion describes a single target — what meeting
        the standard looks like — and reviewers respond with specific written comments instead of a
        number. A criterion isn&apos;t forced into one verdict: the same one can be marked as
        exceeding in some ways and needing work in others, at the same time.
      </p>

      <div className="hiw-rubset" role="tablist" aria-label="Open4PeerReview rubrics">
        {RUBRIC_PANELS.map((rubric) => {
          const selected = activeId === rubric.id;
          return (
            <FilterChip
              key={rubric.id}
              label={rubric.label}
              selected={selected}
              onClick={() => handleChip(rubric.id)}
              aria-expanded={selected}
              aria-controls="hiw-rubric-panel"
              id={`hiw-rubric-tab-${rubric.id}`}
            />
          );
        })}
      </div>

      <div
        ref={shellRef}
        className={`hiw-rubpanel-shell${expanded ? " is-open" : ""}`}
        aria-hidden={!expanded}
      >
        <div
          id="hiw-rubric-panel"
          ref={panelRef}
          className={`hiw-rubpanel${contentShown ? " is-visible" : ""}`}
          role="tabpanel"
          aria-labelledby={visibleId ? `hiw-rubric-tab-${visibleId}` : undefined}
        >
          {panel ? (
            <>
              <p className="hiw-rubpanel__summary hiw-rubpanel__beat hiw-rubpanel__beat--1">
                {panel.summary}
              </p>
              <div className="hiw-rubpanel__covers-block hiw-rubpanel__beat hiw-rubpanel__beat--2">
                <div className="hiw-rubpanel__covers-label">What it covers</div>
                <ul className="hiw-rubpanel__covers">
                  {panel.covers.map((item) => (
                    <li key={item.title}>
                      <span className="hiw-rubpanel__cover-title">{item.title}</span>
                      <span className="hiw-rubpanel__cover-gloss"> — {item.gloss}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="hiw-rubpanel__note hiw-rubpanel__beat hiw-rubpanel__beat--3">
                {panel.note}
              </p>
            </>
          ) : null}
        </div>
      </div>

      <div className="hiw-spr" id="spr">
        <div className={`hiw-spr-side hiw-spr-side--exceed${exceedOn ? " on" : ""}`}>
          <button
            type="button"
            className="hiw-spr-tag"
            aria-pressed={exceedOn}
            onClick={() => setExceedOn((v) => !v)}
          >
            <span className="hiw-spr-tag__dot" aria-hidden="true" />
            Exceeds
          </button>
          <p className="hiw-spr-com">
            A written comment on where the resource goes beyond the standard.
          </p>
        </div>

        <div className="hiw-spr-target">
          <div className="hiw-spr-tlabel">Exemplified</div>
          <p className="hiw-spr-ttext">
            Each criterion names one clear standard — a single description of what the resource is
            expected to meet.
          </p>
        </div>

        <div className={`hiw-spr-side hiw-spr-side--improve${improveOn ? " on" : ""}`}>
          <button
            type="button"
            className="hiw-spr-tag"
            aria-pressed={improveOn}
            onClick={() => setImproveOn((v) => !v)}
          >
            <span className="hiw-spr-tag__dot" aria-hidden="true" />
            Needs Improvement
          </button>
          <p className="hiw-spr-com">
            A written comment on where the resource falls short of the standard.
          </p>
        </div>
      </div>
      <p className="hiw-spr-caption">
        Both sides can be marked on one criterion at once — feedback isn&apos;t reduced to a single
        verdict. Try turning each rating on or off.
      </p>
    </section>
  );
}
