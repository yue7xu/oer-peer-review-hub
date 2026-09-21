import React, { useState } from "react";
import { StatusBadge } from "../feedback/StatusBadge.jsx";
import { Badge } from "../feedback/Badge.jsx";
import { RatingsTable } from "./RatingsTable.jsx";
import { tallyRatings } from "../../data/resources.js";

const CSS = `
.oer-reviewer { background: var(--surface-default); border-radius: var(--radius-lg); padding: 18px 20px; }
.oer-reviewer__head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  width: 100%; background: none; border: none; padding: 0; text-align: left;
}
.oer-reviewer__head--toggle { cursor: pointer; border: none; background: none; padding: 0; font: inherit; color: inherit; text-align: left; }
.oer-reviewer__who { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; min-width: 0; }
.oer-reviewer__chevron { display: inline-flex; flex: none; color: var(--text-subtle); transition: transform 150ms ease; }
.oer-reviewer__chevron--open { transform: rotate(90deg); }
.oer-reviewer__name { font-family: var(--font-label); font-weight: var(--weight-semibold); font-size: 15px; color: var(--text-default); }
.oer-reviewer__aff { font-size: 14px; color: var(--text-muted); }
.oer-reviewer__summary { margin-top: 10px; font-size: 14px; color: var(--text-muted); }
.oer-reviewer__body { margin-top: 6px; }
@media (max-width: 639px) {
  .oer-reviewer { padding: 14px 14px; }
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "reviewercard");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

const RATING_LABEL = { exceed: "Exceed", exemplify: "Exemplifies", "does not meet": "Does not meet" };

function tallySummary(criteria) {
  const counts = tallyRatings(criteria);
  if (!counts) return null;
  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([key, n]) => `${n} ${RATING_LABEL[key]}`)
    .join(" · ");
}

/**
 * ReviewerCard — one reviewer's contribution to a rubric review. When the
 * reviewer has per-criterion ratings, the card is a disclosure: expanded
 * shows the full RatingsTable, collapsed shows a one-line tally. A reviewer
 * with no criteria on file (the honest state for every real catalog entry
 * today — see resources.js) renders as a static, non-collapsible row.
 */
export function ReviewerCard({ reviewer, defaultExpanded = true, className = "", ...rest }) {
  useStyles();
  const [open, setOpen] = useState(defaultExpanded);
  const hasCriteria = Array.isArray(reviewer.criteria) && reviewer.criteria.length > 0;

  const head = (
    <div className="oer-reviewer__head">
      <div className="oer-reviewer__who">
        {hasCriteria && (
          <span className={`oer-reviewer__chevron${open ? " oer-reviewer__chevron--open" : ""}`} aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
        <span className="oer-reviewer__name">
          {reviewer.firstName} {reviewer.lastName}
        </span>
        {reviewer.anonymous ? (
          <Badge variant="secondary">Anonymous</Badge>
        ) : (
          reviewer.affiliation && <span className="oer-reviewer__aff">{reviewer.affiliation}</span>
        )}
      </div>
      {reviewer.status && (
        <StatusBadge status={reviewer.status}>
          {reviewer.status === "peer_reviewed" ? "Peer Reviewed" : undefined}
        </StatusBadge>
      )}
    </div>
  );

  return (
    <div className={`oer-reviewer ${className}`.trim()} {...rest}>
      {hasCriteria ? (
        <button type="button" className="oer-reviewer__head--toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open} style={{ width: "100%" }}>
          {head}
        </button>
      ) : (
        head
      )}
      {hasCriteria && (open ? (
        <div className="oer-reviewer__body">
          <RatingsTable criteria={reviewer.criteria} />
        </div>
      ) : (
        <div className="oer-reviewer__summary">{tallySummary(reviewer.criteria)}</div>
      ))}
    </div>
  );
}
