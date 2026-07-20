import React from "react";
import { StatusBadge } from "../feedback/StatusBadge.jsx";
import { ReviewerCard } from "./ReviewerCard.jsx";
import { ReviewTimeline } from "./ReviewTimeline.jsx";

const CSS = `
.oer-rubricsection { display: flex; flex-direction: column; gap: 24px; padding: 32px; background: var(--surface-subtle); border-radius: var(--radius-lg); scroll-margin-top: 24px; }
.oer-rubricsection__head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.oer-rubricsection__title { font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 24px; color: var(--text-default); margin: 0; }
.oer-rubricsection__reviewerlist { display: flex; flex-direction: column; gap: 12px; }
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
 * Sub-block ids (`review-{rubricId}[-timeline|-review|-response|-revision]`)
 * are only emitted when the corresponding content exists, matching
 * RubricSidebarNav's sub-link generation exactly. Only the very first
 * reviewer of the very first rubric section on the page opens expanded by
 * default (`isFirstSection`, set by ResourceDetail.jsx) — every other
 * reviewer, across every rubric, starts collapsed.
 */
export function RubricReviewSection({ rubricReview, isFirstSection = false }) {
  useStyles();
  const rr = rubricReview;

  return (
    <section className="oer-rubricsection" id={`review-${rr.rubricId}`}>
      <div className="oer-rubricsection__head">
        <h2 className="oer-rubricsection__title">{rr.rubric}</h2>
        <StatusBadge status={rr.status} />
      </div>

      {rr.timeline && rr.timeline.length > 0 && (
        <div className="oer-rubricsection__block" id={`review-${rr.rubricId}-timeline`}>
          <ReviewTimeline items={rr.timeline} />
        </div>
      )}

      {rr.reviewers && rr.reviewers.length > 0 && (
        <div className="oer-rubricsection__reviewerlist" id={`review-${rr.rubricId}-review`}>
          {rr.reviewers.map((rev, i) => (
            <ReviewerCard key={`${rev.firstName}-${rev.lastName}`} reviewer={rev} defaultExpanded={isFirstSection && i === 0} />
          ))}
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
          <h3 className="oer-rubricsection__subhead">Overall Author Revision</h3>
          <div className="oer-rubricsection__date">
            {rr.authorRevision.versionLabel} · {rr.authorRevision.date}
          </div>
          <p className="oer-rubricsection__text">{rr.authorRevision.summary}</p>
        </div>
      )}
    </section>
  );
}
