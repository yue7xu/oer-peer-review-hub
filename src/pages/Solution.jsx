import React, { useState } from "react";
import { Button } from "../components/forms/Button.jsx";
import { StatusBadge } from "../components/feedback/StatusBadge.jsx";
import { useHowItWorksStyles } from "../components/how-it-works/hiwStyles.js";
import { RoleToggle } from "../components/how-it-works/RoleToggle.jsx";
import { ProcessSpine } from "../components/how-it-works/ProcessSpine.jsx";
import { RubricMethod } from "../components/how-it-works/RubricMethod.jsx";
import { ReviewConsoleDemo } from "../components/how-it-works/ReviewConsoleDemo.jsx";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
      <path d="M6.5 9.5V14c0 1.7 2.9 3 6 3s6-1.3 6-3V9.5" />
    </svg>
  );
}

/**
 * How It Works — served at /solution (nav label: How It Works).
 * Structure/copy/interaction from design_handoff/detailed-process-final.html;
 * visual system aligned with Home / About / Community (design.md).
 */
export function Solution() {
  useHowItWorksStyles();
  const [filterRole, setFilterRole] = useState(null);

  return (
    <>
      {/* Page hero — orients the visitor; adopter CTA lives here */}
      <section className="hiw-hero">
        <div className="hiw-hero__inner">
          <div className="hiw-hero__grid">
            <div className="hiw-hero__copy">
              <div className="hiw-eyebrow">How It Works</div>
              <h1 className="hiw-h1">
                Peer review for open educational resources — and the workspace built to run it.
              </h1>
              <p className="hiw-lede">
                Trained reviewers evaluate each resource against six evidence-based rubrics,
                criterion by criterion, in a purpose-built console. Authors respond and revise in
                the open — so adopters, authors, and reviewers all see the same transparent record.
              </p>
              <div className="hiw-hero__cta">
                <Button variant="primary" size="lg" href="/browse">
                  Browse peer-reviewed OER
                </Button>
              </div>
            </div>
            <div className="hiw-hero__demo">
              <ReviewConsoleDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Process spine — former page heading becomes this section's title */}
      <section className="hiw-section" aria-labelledby="hiw-process-heading">
        <div className="hiw-container">
          <div className="hiw-process-intro">
            <h2 className="hiw-process-heading" id="hiw-process-heading">
              The peer review flow, with every role on one path.
            </h2>
            <p className="hiw-process-lede">
              Trained reviewers evaluate each resource against six evidence-based rubrics, criterion
              by criterion. Authors respond and can revise, and every result you see is transparent
              down to the criterion.
            </p>

            <RoleToggle activeRole={filterRole} onChange={setFilterRole} />

            <div className="hiw-backstage">
              <span className="hiw-backstage__dot" aria-hidden="true" />
              <span>
                A coordinator matches reviewers and keeps rounds on schedule behind the scenes.
                Coordinators never appear in a public review.
              </span>
            </div>
          </div>

          <ProcessSpine filterRole={filterRole} />
        </div>
      </section>

      <section className="hiw-section hiw-section--band">
        <div className="hiw-container">
          <RubricMethod />
        </div>
      </section>

      <section className="hiw-section">
        <div className="hiw-container">
          <div className="hiw-closing-stack">
            <section
              className="hiw-closing-card hiw-close"
              aria-labelledby="hiw-result-heading"
            >
              <div className="hiw-sec-eye">The result</div>
              <h2 className="hiw-sec-h" id="hiw-result-heading">
                What a published review shows.
              </h2>
              <div className="hiw-badges">
                <StatusBadge status="peer_reviewed">Peer Reviewed</StatusBadge>
                <StatusBadge status="peer_reviewed_revised">Peer Reviewed · Revised</StatusBadge>
              </div>
              <ul className="hiw-list">
                <li>Every reviewer rating and comment, criterion by criterion</li>
                <li>The author&apos;s reply to each point</li>
                <li>
                  The badge a resource earned — Peer Reviewed or Peer Reviewed · Revised
                </li>
                <li>Reviewers stay anonymous; working notes are not shown</li>
              </ul>
              <div className="hiw-notes">
                <div className="hiw-note">
                  <LockIcon />
                  <span>
                    Private by default. Authors decide whether a completed review becomes public.
                  </span>
                </div>
                <div className="hiw-note">
                  <CapIcon />
                  <span>
                    Student and self-reviews are supported, but only reviews by qualified reviewers
                    earn a badge.
                  </span>
                </div>
              </div>
            </section>

            <section
              className="hiw-closing-card hiw-why"
              aria-labelledby="hiw-why-heading"
            >
              <div className="hiw-sec-eye">Why we make reviews open</div>
              <h2 className="hiw-sec-h" id="hiw-why-heading">
                A quality mark you can look behind.
              </h2>
              <p className="hiw-why__body">
                Most quality marks ask you to trust a stamp. We&apos;d rather show the reasoning.
                When the comments and the author&apos;s replies are open, the badge means something
                you can check for yourself, and each review stays accountable to the community it
                serves. Kept open together, these reviews become a shared, growing record of what
                good open teaching material looks like.
              </p>
              <ul className="hiw-why__roles">
                <li>
                  <span className="hiw-why__role">For adopters</span>
                  <span className="hiw-why__role-text">
                    — quality you can inspect, not take on faith.
                  </span>
                </li>
                <li>
                  <span className="hiw-why__role">For authors</span>
                  <span className="hiw-why__role-text">
                    — a credible, citable mark for teaching work that too often goes unrecognized.
                  </span>
                </li>
                <li>
                  <span className="hiw-why__role">For reviewers</span>
                  <span className="hiw-why__role-text">
                    — recognized expertise, and a hand in the standards of your field.
                  </span>
                </li>
              </ul>
            </section>
          </div>

          <div className="hiw-cta">
            <Button variant="primary" size="lg" href="/about">
              Become a qualified reviewer
            </Button>
            <Button variant="secondary" size="lg" href="/about">
              Get your OER reviewed
            </Button>
          </div>
          <a className="hiw-cta-browse" href="/browse">
            Just browsing? Explore the library →
          </a>
        </div>
      </section>
    </>
  );
}
