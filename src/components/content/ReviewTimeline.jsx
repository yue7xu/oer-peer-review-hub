import React from "react";

const CSS = `
.oer-timeline { font-family: var(--font-body); display: flex; flex-direction: column; gap: 14px; }
.oer-tl-item { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.oer-tl-dot { flex: none; width: 10px; height: 10px; border-radius: var(--radius-full); }
.oer-tl-dot--info    { background: var(--feedback-info-icon); }
.oer-tl-dot--warning { background: var(--feedback-warning-icon); }
.oer-tl-dot--success { background: var(--feedback-success-icon); }
.oer-tl-dot--error   { background: var(--feedback-error-icon); }
.oer-tl-dot--muted   { background: var(--color-stone-strong); }
.oer-tl-text { font-family: var(--font-label); font-weight: var(--weight-semibold); font-size: 14px; color: var(--text-default); }
.oer-tl-date { font-family: var(--font-mono); font-size: 13px; color: var(--text-subtle); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "timeline");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

const TONE = {
  // Block D PRD internal keys (see StatusBadge.jsx)
  submitted: "muted",
  under_review: "muted",
  unreviewed: "muted",
  peer_reviewed: "info",
  peer_reviewed_responded: "warning",
  peer_reviewed_revised: "success",
  // Legacy aliases
  "not-revised": "info",
  responded: "warning",
  revised: "success",
  info: "info",
  warning: "warning",
  success: "success",
  error: "error",
  muted: "muted",
};

/**
 * ReviewTimeline — a compact, single-line-per-event history of a rubric
 * review (request → review activity → author response → revision publish).
 * Each item: { text, date, tone }, where `tone` is either one of the
 * peer-review status keys above or a bare tone name ("success" | "warning" |
 * "info" | "error" | "muted").
 */
export function ReviewTimeline({ items = [], className = "", ...rest }) {
  useStyles();
  return (
    <div className={`oer-timeline ${className}`.trim()} {...rest}>
      {items.map((it, i) => {
        const tone = TONE[it.tone] || "muted";
        return (
          <div className="oer-tl-item" key={i}>
            <span className={`oer-tl-dot oer-tl-dot--${tone}`} aria-hidden="true" />
            <span className="oer-tl-text">{it.text}</span>
            {it.date && <span className="oer-tl-date">{it.date}</span>}
          </div>
        );
      })}
    </div>
  );
}
