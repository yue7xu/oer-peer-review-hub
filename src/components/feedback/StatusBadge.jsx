import React from "react";

const CSS = `
/* Tab-Pill treatment: white/eggshell pill + hairline border, ink text, and a
   small colored dot carrying the status — mirrors the source system's own
   "Tab Pill" component (white fill, active state marked by a colored dot). */
.oer-status {
  display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-label);
  font-size: 13px; font-weight: var(--weight-semibold); line-height: 1;
  padding: 5px 11px 5px 9px; border-radius: var(--radius-full); white-space: nowrap;
  background: var(--surface-default); color: var(--text-default);
  border: 1px solid var(--border-default);
}
.oer-status__dot { width: 8px; height: 8px; border-radius: var(--radius-full); flex: none; }
.oer-status--info    .oer-status__dot { background: var(--feedback-info-icon); }
.oer-status--warning .oer-status__dot { background: var(--feedback-warning-icon); }
.oer-status--success .oer-status__dot { background: var(--feedback-success-icon); }
.oer-status--error   .oer-status__dot { background: var(--feedback-error-icon); }
.oer-status--muted   .oer-status__dot { background: var(--color-stone-strong); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "statusbadge");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

// Peer-review lifecycle states, aligned to the Block D PRD's Status Inventory
// (Section 3.1: Submitted → Under Review → Peer Reviewed · {Not Revised,
// Responded, Revised}). Internal keys match the PRD's "Internal Key" column;
// labels match its "Public-Facing Label" column verbatim.
const REVIEW = {
  // Catalog entries that have not entered the review pipeline at all — not a
  // Block D lifecycle state (the PRD's model assumes a submission exists).
  unreviewed: { tone: "muted", label: "Not yet reviewed" },
  submitted: { tone: "muted", label: "Submitted" },
  under_review: { tone: "muted", label: "Under Review" },
  peer_reviewed: { tone: "info", label: "Peer Reviewed · Not Revised" },
  peer_reviewed_responded: { tone: "warning", label: "Peer Reviewed · Responded" },
  peer_reviewed_revised: { tone: "success", label: "Peer Reviewed · Revised" },
  // Legacy aliases for the ad hoc keys used before the PRD's status
  // inventory was adopted — kept so any remaining callers still render with
  // the corrected label casing.
  "not-revised": { tone: "info", label: "Peer Reviewed · Not Revised" },
  responded: { tone: "warning", label: "Peer Reviewed · Responded" },
  revised: { tone: "success", label: "Peer Reviewed · Revised" },
};
const GENERAL = {
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
};

// Compact labels for contexts with limited space (Browse's per-rubric review
// tags, ResourceDetail's coverage table) — must stay in sync with `REVIEW`
// above and `TONE` in ReviewTimeline.jsx whenever a status is added.
export const SHORT_STATUS_LABEL = {
  unreviewed: "Not reviewed",
  submitted: "Submitted",
  under_review: "Under review",
  peer_reviewed: "Reviewed",
  peer_reviewed_responded: "Responded",
  peer_reviewed_revised: "Revised",
  "not-revised": "Reviewed",
  responded: "Responded",
  revised: "Revised",
};

/**
 * StatusBadge — pill with a colored dot + label. Handles the three peer-review
 * states and the four general UI states. Never color-only (WCAG 1.4.1).
 */
export function StatusBadge({ status = "info", children, className = "", ...rest }) {
  useStyles();
  const review = REVIEW[status];
  const tone = review ? review.tone : GENERAL[status] || "info";
  const label = children != null ? children : review ? review.label : status;
  return (
    <span className={`oer-status oer-status--${tone} ${className}`.trim()} {...rest}>
      <span className="oer-status__dot" />
      {label}
    </span>
  );
}
