import React from "react";
import { StatusBadge, SHORT_STATUS_LABEL } from "../feedback/StatusBadge.jsx";
import { InfoIcon } from "./InfoIcon.jsx";
import { RUBRIC_DESCRIPTIONS, tallyRatings } from "../../data/resources.js";

const CSS = `
.oer-coverage { width: 100%; border-collapse: collapse; }
.oer-coverage th {
  text-align: left; font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 12px;
  text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-subtle);
  padding: 0 16px 10px 0; border-bottom: 1px solid var(--border-strong);
}
.oer-coverage td { padding: 14px 16px 14px 0; border-bottom: 1px solid var(--border-default); vertical-align: middle; }
.oer-coverage tr:last-child td { border-bottom: none; }
.oer-coverage__rubric-cell { display: flex; align-items: center; gap: 6px; }
.oer-coverage__rubric { font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 15px; color: var(--text-default); text-decoration: none; }
a.oer-coverage__rubric:hover { color: var(--text-brand-hover); }
.oer-coverage__date { font-family: var(--font-mono); font-size: 13px; color: var(--text-subtle); }
.oer-coverage__tally { font-family: var(--font-mono); font-size: 13px; color: var(--text-muted); }

/* Four columns don't fit a phone: each row becomes a stacked block with the
   column header repeated above its value (via data-label) instead of scrolling
   the table sideways. */
@media (max-width: 639px) {
  .oer-coverage, .oer-coverage tbody, .oer-coverage tr, .oer-coverage td { display: block; }
  .oer-coverage thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .oer-coverage tr { padding: 14px 0; border-bottom: 1px solid var(--border-default); }
  .oer-coverage tr:last-child { border-bottom: none; }
  .oer-coverage td { padding: 6px 0; border-bottom: none; }
  .oer-coverage td::before {
    content: attr(data-label); display: block; margin-bottom: 3px;
    font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-subtle);
  }
  .oer-coverage td:first-child::before { display: none; }
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "reviewcoveragetable");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

// "Exceed / Exemplifies / Does not meet" tally, from the first (primary)
// reviewer's per-criterion ratings — only real when that reviewer carries
// them (currently just EXAMPLE_RESOURCE). Real catalog entries honestly
// show "—" rather than a fabricated count.
function tallyFor(rubricReview) {
  const counts = tallyRatings(rubricReview.reviewers && rubricReview.reviewers[0] && rubricReview.reviewers[0].criteria);
  if (!counts) return null;
  return `${counts.exceed} / ${counts.exemplify} / ${counts["does not meet"]}`;
}

/**
 * ReviewCoverageTable — Layer 2 of the Single OER page. One row per rubric
 * this OER was reviewed against; each row links down to that rubric's
 * section (#review-{rubricId}).
 */
export function ReviewCoverageTable({ rubricReviews = [], className = "", ...rest }) {
  useStyles();
  if (!rubricReviews.length) return null;
  return (
    <table className={`oer-coverage ${className}`.trim()} {...rest}>
      <thead>
        <tr>
          <th>Rubric</th>
          <th>Exceed / Exemplifies / Does not meet</th>
          <th>Status</th>
          <th>Last Reviewed by</th>
        </tr>
      </thead>
      <tbody>
        {rubricReviews.map((rr) => {
          const reviewer = rr.reviewers && rr.reviewers[0];
          return (
            <tr key={rr.rubricId}>
              <td>
                <div className="oer-coverage__rubric-cell">
                  <a className="oer-coverage__rubric" href={`#review-${rr.rubricId}`}>
                    {rr.rubric}
                  </a>
                  {RUBRIC_DESCRIPTIONS[rr.rubric] && <InfoIcon title={RUBRIC_DESCRIPTIONS[rr.rubric]} />}
                </div>
              </td>
              <td className="oer-coverage__tally" data-label="Exceed / Exemplifies / Does not meet">{tallyFor(rr) || "—"}</td>
              <td data-label="Status">
                <StatusBadge status={rr.status}>{SHORT_STATUS_LABEL[rr.status] || rr.status}</StatusBadge>
              </td>
              <td className="oer-coverage__date" data-label="Last Reviewed by">{reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
