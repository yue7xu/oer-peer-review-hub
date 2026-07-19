import React from "react";

const CSS = `
.oer-timeline { display: flex; flex-direction: column; }
.oer-tl-item { position: relative; display: grid; grid-template-columns: 18px 1fr; column-gap: 16px; }
.oer-tl-rail { position: relative; display: flex; justify-content: center; }
.oer-tl-line { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: var(--border-strong); transform: translateX(-50%); }
.oer-tl-item:first-child .oer-tl-line { top: 8px; }
.oer-tl-item:last-child .oer-tl-line { bottom: auto; height: 8px; }
.oer-tl-dot {
  position: relative; z-index: 1; width: 12px; height: 12px; margin-top: 4px;
  border-radius: var(--radius-full); box-sizing: border-box; border: 2px solid var(--surface-subtle);
}
.oer-tl-dot--info    { background: var(--feedback-info-icon); }
.oer-tl-dot--warning { background: var(--feedback-warning-icon); }
.oer-tl-dot--success { background: var(--feedback-success-icon); }
.oer-tl-dot--error   { background: var(--feedback-error-icon); }
.oer-tl-dot--muted   { background: var(--color-stone-strong); }
.oer-tl-card {
  background: var(--surface-default); border-radius: var(--radius-md); padding: 14px 16px 16px;
  margin-bottom: 16px; min-width: 0;
}
.oer-tl-item:last-child .oer-tl-card { margin-bottom: 0; }
.oer-tl-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
.oer-tl-title { font-family: var(--font-label); font-weight: var(--weight-semibold); font-size: 14px; color: var(--text-default); }
.oer-tl-date { font-family: var(--font-mono); font-size: 12px; color: var(--text-subtle); }
.oer-tl-desc { font-size: 13px; line-height: 1.5; color: var(--text-muted); margin: 0; }

@media (max-width: 640px) {
  .oer-tl-item { grid-template-columns: 14px 1fr; column-gap: 10px; }
  .oer-tl-head { flex-direction: column; align-items: flex-start; gap: 2px; }
  .oer-tl-card { padding: 12px; }
}
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
 * ReviewTimeline — a single-column vertical timeline: one filled dot per
 * event on a solid connecting rail, each paired with a card holding a
 * title, date, and description. Purely CSS-transition-free and static (no
 * scroll-triggered animation) — the rail/cards are always fully rendered.
 * Each item: { title, date, description, tone }, where `tone` is either one
 * of the peer-review status keys above or a bare tone name.
 */
export function ReviewTimeline({ items = [], className = "", ...rest }) {
  useStyles();
  return (
    <div className={`oer-timeline ${className}`.trim()} {...rest}>
      {items.map((it, i) => {
        const tone = TONE[it.tone] || "muted";
        return (
          <div className="oer-tl-item" key={i}>
            <div className="oer-tl-rail">
              <span className="oer-tl-line" aria-hidden="true" />
              <span className={`oer-tl-dot oer-tl-dot--${tone}`} aria-hidden="true" />
            </div>
            <div className="oer-tl-card">
              <div className="oer-tl-head">
                <span className="oer-tl-title">{it.title}</span>
                {it.date && <span className="oer-tl-date">{it.date}</span>}
              </div>
              {it.description && <p className="oer-tl-desc">{it.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
