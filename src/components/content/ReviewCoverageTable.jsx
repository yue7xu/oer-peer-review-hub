import React from "react";
import { StatusBadge } from "../feedback/StatusBadge.jsx";

const CSS = `
.oer-coverage { width: 100%; border-collapse: collapse; }
.oer-coverage th {
  text-align: left; font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 12px;
  text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-subtle);
  padding: 0 16px 10px 0; border-bottom: 1px solid var(--border-strong);
}
.oer-coverage td { padding: 14px 16px 14px 0; border-bottom: 1px solid var(--border-default); vertical-align: middle; }
.oer-coverage tr:last-child td { border-bottom: none; }
.oer-coverage__rubric { font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 15px; color: var(--text-default); text-decoration: none; }
a.oer-coverage__rubric:hover { color: var(--text-brand-hover); }
.oer-coverage__date { font-family: var(--font-mono); font-size: 13px; color: var(--text-subtle); }
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

function reviewedDateFor(rubricReview) {
  const timeline = rubricReview.timeline;
  if (!Array.isArray(timeline) || !timeline.length) return null;
  const reviewed = [...timeline].reverse().find((t) => t.status === "peer_reviewed");
  return reviewed ? reviewed.date : null;
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
          <th>Status</th>
          <th>Reviewed date</th>
        </tr>
      </thead>
      <tbody>
        {rubricReviews.map((rr) => (
          <tr key={rr.rubricId}>
            <td>
              <a className="oer-coverage__rubric" href={`#review-${rr.rubricId}`}>
                {rr.rubric}
              </a>
            </td>
            <td>
              <StatusBadge status={rr.status} />
            </td>
            <td className="oer-coverage__date">{reviewedDateFor(rr) || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
