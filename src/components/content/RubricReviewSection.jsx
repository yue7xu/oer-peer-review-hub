import React from "react";
import { StatusBadge } from "../feedback/StatusBadge.jsx";
import { RatingsTable } from "./RatingsTable.jsx";
import { ReviewTimeline } from "./ReviewTimeline.jsx";
import { OutboundLink } from "./OutboundLink.jsx";

const CSS = `
.oer-rubricsection { display: flex; flex-direction: column; gap: 24px; padding: 32px; background: var(--surface-subtle); border-radius: var(--radius-lg); scroll-margin-top: 24px; }
.oer-rubricsection__head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.oer-rubricsection__title { font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 24px; color: var(--text-default); margin: 0; }
.oer-rubricsection__reviewers { display: flex; flex-wrap: wrap; gap: 12px; }
.oer-rubricsection__reviewer { background: var(--surface-default); border-radius: var(--radius-lg); padding: 14px 18px; }
.oer-rubricsection__reviewer-name { font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 15px; color: var(--text-default); }
.oer-rubricsection__reviewer-aff { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
.oer-rubricsection__block { display: flex; flex-direction: column; gap: 10px; scroll-margin-top: 24px; }
.oer-rubricsection__subhead { font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 18px; color: var(--text-default); margin: 0; }
.oer-rubricsection__date { font-family: var(--font-mono); font-size: 13px; color: var(--text-subtle); }
.oer-rubricsection__text { font-size: 15px; line-height: 1.6; color: var(--text-default); margin: 0; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "rubricreviewsection");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * RubricReviewSection — Layer 3 of the Single OER page: one full rubric's
 * review content. Renders whatever fields are present on `rubricReview` and
 * skips the rest — only `rubric` / `rubricId` / `status` are guaranteed.
 * Sub-block ids (`review-{rubricId}[-report|-timeline|-review|-response|-revision]`)
 * are only emitted when the corresponding content exists, matching
 * RubricSidebarNav's sub-link generation exactly.
 */
export function RubricReviewSection({ rubricReview }) {
  useStyles();
  const rr = rubricReview;

  return (
    <section className="oer-rubricsection" id={`review-${rr.rubricId}`}>
      <div className="oer-rubricsection__head">
        <h2 className="oer-rubricsection__title">{rr.rubric}</h2>
        <StatusBadge status={rr.status} />
      </div>

      {rr.reviewers && rr.reviewers.length > 0 && (
        <div className="oer-rubricsection__reviewers">
          {rr.reviewers.map((rev) => (
            <div className="oer-rubricsection__reviewer" key={`${rev.firstName}-${rev.lastName}`}>
              <div className="oer-rubricsection__reviewer-name">
                {rev.firstName} {rev.lastName}
              </div>
              {rev.affiliation && <div className="oer-rubricsection__reviewer-aff">{rev.affiliation}</div>}
            </div>
          ))}
        </div>
      )}

      {rr.criteria && rr.criteria.length > 0 && (
        <div className="oer-rubricsection__block" id={`review-${rr.rubricId}-review`}>
          <RatingsTable criteria={rr.criteria} />
        </div>
      )}

      {rr.reviewReportUrl && (
        <div className="oer-rubricsection__block" id={`review-${rr.rubricId}-report`}>
          <h3 className="oer-rubricsection__subhead">Review report</h3>
          <div>
            <OutboundLink href={rr.reviewReportUrl} variant="button">
              View full review report
            </OutboundLink>
          </div>
        </div>
      )}

      {rr.timeline && rr.timeline.length > 0 && (
        <div className="oer-rubricsection__block" id={`review-${rr.rubricId}-timeline`}>
          <h3 className="oer-rubricsection__subhead">Timeline</h3>
          <ReviewTimeline items={rr.timeline} />
        </div>
      )}

      {rr.authorResponse && (
        <div className="oer-rubricsection__block" id={`review-${rr.rubricId}-response`}>
          <h3 className="oer-rubricsection__subhead">Author response</h3>
          <div className="oer-rubricsection__date">{rr.authorResponse.date}</div>
          <p className="oer-rubricsection__text">{rr.authorResponse.text}</p>
        </div>
      )}

      {rr.authorRevision && (
        <div className="oer-rubricsection__block" id={`review-${rr.rubricId}-revision`}>
          <h3 className="oer-rubricsection__subhead">Author revision</h3>
          <div className="oer-rubricsection__date">
            {rr.authorRevision.versionLabel} · {rr.authorRevision.date}
          </div>
          <p className="oer-rubricsection__text">{rr.authorRevision.summary}</p>
        </div>
      )}
    </section>
  );
}
