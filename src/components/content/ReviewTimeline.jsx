import React from "react";

const CSS = `
.oer-timeline { font-family: var(--font-body); display: flex; flex-direction: column; }
.oer-tl-item { position: relative; display: grid; grid-template-columns: 22px 1fr; column-gap: 14px; }
.oer-tl-rail { position: relative; display: flex; justify-content: center; }
.oer-tl-line { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--border-default); }
.oer-tl-item:first-child .oer-tl-line { top: 11px; }
.oer-tl-item:last-child .oer-tl-line { bottom: auto; height: 11px; }
.oer-tl-dot {
  position: relative; z-index: 1; width: 14px; height: 14px; margin-top: 4px;
  border-radius: var(--radius-full); box-sizing: border-box;
  border: 3px solid var(--surface-default);
}
.oer-tl-dot--info    { background: var(--feedback-info-icon); }
.oer-tl-dot--warning { background: var(--feedback-warning-icon); }
.oer-tl-dot--success { background: var(--feedback-success-icon); }
.oer-tl-dot--muted   { background: var(--color-stone-strong); }
.oer-tl-body { padding-bottom: 22px; min-width: 0; }
.oer-tl-item:last-child .oer-tl-body { padding-bottom: 0; }
.oer-tl-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.oer-tl-ver { font-family: var(--font-label); font-weight: var(--weight-semibold); font-size: 14px; color: var(--text-default); }
.oer-tl-date { font-family: var(--font-mono); font-size: 12px; color: var(--text-subtle); }
.oer-tl-title { font-family: var(--font-label); font-weight: var(--weight-semibold); font-size: 14px; color: var(--text-default); margin: 6px 0 2px; }
.oer-tl-note { font-size: 14px; line-height: 1.5; color: var(--text-muted); }
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
  muted: "muted",
};

/**
 * ReviewTimeline — the peer-review history across a resource's versions.
 * Each item: { version, date, status, title, note }.
 */
export function ReviewTimeline({ items = [], className = "", ...rest }) {
  useStyles();
  return (
    <div className={`oer-timeline ${className}`.trim()} {...rest}>
      {items.map((it, i) => {
        const tone = TONE[it.status] || "muted";
        return (
          <div className="oer-tl-item" key={i}>
            <div className="oer-tl-rail">
              <span className="oer-tl-line" />
              <span className={`oer-tl-dot oer-tl-dot--${tone}`} />
            </div>
            <div className="oer-tl-body">
              <div className="oer-tl-head">
                <span className="oer-tl-ver">{it.version}</span>
                {it.date && <span className="oer-tl-date">{it.date}</span>}
              </div>
              {it.title && <div className="oer-tl-title">{it.title}</div>}
              {it.note && <div className="oer-tl-note">{it.note}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
