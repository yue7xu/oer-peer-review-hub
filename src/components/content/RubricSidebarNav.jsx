import React from "react";

const CSS = `
.oer-rubricnav { display: flex; flex-direction: column; gap: 20px; background: var(--surface-subtle); border-radius: var(--radius-lg); padding: 24px; }
.oer-rubricnav__title { font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-medium); text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-subtle); margin: 0 0 16px; }
.oer-rubricnav__group { display: flex; flex-direction: column; gap: 8px; }
.oer-rubricnav__group + .oer-rubricnav__group { border-top: 1px solid var(--border-default); padding-top: 16px; }
.oer-rubricnav__group-label { font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 14px; color: var(--text-default); }
.oer-rubricnav__link { display: block; font-family: var(--font-body); font-size: 14px; color: var(--text-muted); text-decoration: none; padding: 2px 0 2px 14px; border-left: 2px solid var(--border-default); }
.oer-rubricnav__link:hover { color: var(--text-default); border-left-color: var(--border-strong); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "rubricsidebarnav");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

// Sub-links for one rubric group — Figma's three fixed stage labels
// (Timeline / Review / Overall Author Revision). Must check the exact same
// fields RubricReviewSection uses to decide what to render, so the nav never
// links to a section that doesn't exist.
function subLinksFor(rr) {
  const links = [];
  if (rr.timeline && rr.timeline.length > 0) links.push({ label: "Timeline", href: `#review-${rr.rubricId}-timeline` });
  if (rr.reviewers && rr.reviewers.length > 0) links.push({ label: "Review", href: `#review-${rr.rubricId}-review` });
  if (rr.authorResponse || rr.authorRevision) {
    links.push({
      label: "Overall Author Revision",
      href: rr.authorRevision ? `#review-${rr.rubricId}-revision` : `#review-${rr.rubricId}-response`,
    });
  }
  return links;
}

/**
 * RubricSidebarNav — grouped in-page navigation, one group per rubric
 * reviewed. Styled after CourseSource's "Article Menu" pattern: grouped
 * headings, nested anchor sub-links, click jumps within the same page.
 */
export function RubricSidebarNav({ rubricReviews = [], className = "", ...rest }) {
  useStyles();
  if (!rubricReviews.length) return null;
  return (
    <nav className={`oer-rubricnav ${className}`.trim()} aria-label="Review coverage navigation" {...rest}>
      <div className="oer-rubricnav__title">Review coverage</div>
      {rubricReviews.map((rr) => (
        <div className="oer-rubricnav__group" key={rr.rubricId}>
          <div className="oer-rubricnav__group-label">{rr.rubric}</div>
          {subLinksFor(rr).map((link) => (
            <a className="oer-rubricnav__link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}
