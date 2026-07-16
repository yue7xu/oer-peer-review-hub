import React from "react";

const CSS = `
.oer-ratings { display: flex; flex-direction: column; }
.oer-ratings__row { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: baseline; padding: 16px 0; border-top: 1px solid var(--border-default); }
.oer-ratings__row:first-child { border-top: none; }
.oer-ratings__label { font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 15px; color: var(--text-default); margin: 0 0 4px; }
.oer-ratings__desc { font-size: 14px; line-height: 1.55; color: var(--text-muted); margin: 0 0 8px; }
.oer-ratings__comment { font-size: 14px; line-height: 1.55; color: var(--text-default); }
.oer-rating-pill {
  display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-label);
  font-size: 12.5px; font-weight: var(--weight-semibold); line-height: 1; white-space: nowrap;
  padding: 5px 11px 5px 9px; border-radius: var(--radius-full);
}
.oer-rating-pill__dot { width: 8px; height: 8px; border-radius: var(--radius-full); flex: none; }
.oer-rating-pill--exceed { background: var(--feedback-success-background); color: var(--feedback-success-text); }
.oer-rating-pill--exceed .oer-rating-pill__dot { background: var(--feedback-success-icon); }
.oer-rating-pill--exemplify { background: var(--feedback-info-background); color: var(--feedback-info-text); }
.oer-rating-pill--exemplify .oer-rating-pill__dot { background: var(--feedback-info-icon); }
.oer-rating-pill--does-not-meet { background: var(--feedback-error-background); color: var(--feedback-error-text); }
.oer-rating-pill--does-not-meet .oer-rating-pill__dot { background: var(--feedback-error-icon); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "ratingstable");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

const RATING_LABEL = {
  exceed: "Exceeds",
  exemplify: "Exemplifies",
  "does not meet": "Does not meet",
};

function RatingPill({ rating }) {
  const tone = rating === "exceed" ? "exceed" : rating === "exemplify" ? "exemplify" : "does-not-meet";
  return (
    <span className={`oer-rating-pill oer-rating-pill--${tone}`}>
      <span className="oer-rating-pill__dot" />
      {RATING_LABEL[rating] || rating}
    </span>
  );
}

/**
 * RatingsTable — per-criterion ratings for one rubric review. Each item:
 * { label, standardDescription, rating, comment }. `rating` is one of
 * "exceed" | "exemplify" | "does not meet".
 */
export function RatingsTable({ criteria = [], className = "", ...rest }) {
  useStyles();
  if (!criteria.length) return null;
  return (
    <div className={`oer-ratings ${className}`.trim()} {...rest}>
      {criteria.map((c) => (
        <div className="oer-ratings__row" key={c.label}>
          <div>
            <div className="oer-ratings__label">{c.label}</div>
            {c.standardDescription && <p className="oer-ratings__desc">{c.standardDescription}</p>}
            {c.comment && <p className="oer-ratings__comment">{c.comment}</p>}
          </div>
          <RatingPill rating={c.rating} />
        </div>
      ))}
    </div>
  );
}
