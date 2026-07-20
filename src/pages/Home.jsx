import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/forms/Button.jsx";
import { Input } from "../components/forms/Input.jsx";
import { StatusBadge } from "../components/feedback/StatusBadge.jsx";
import { Badge } from "../components/feedback/Badge.jsx";
import { FilterChip } from "../components/forms/FilterChip.jsx";
import { PartnerLogoMarquee } from "../components/content/PartnerLogoMarquee.jsx";
import { InstitutionsGrid } from "../components/content/InstitutionsGrid.jsx";
import { ReviewTimeline } from "../components/content/ReviewTimeline.jsx";
import { OutboundLink } from "../components/content/OutboundLink.jsx";
import { StepGrid } from "../components/content/StepGrid.jsx";
import { RoleTabs } from "../components/content/RoleTabs.jsx";
import { RubricTabs } from "../components/content/RubricTabs.jsx";
import { Reveal } from "../components/content/Reveal.jsx";
import { useHowItWorksStyles } from "../components/how-it-works/hiwStyles.js";
import { ReviewConsoleDemo } from "../components/how-it-works/ReviewConsoleDemo.jsx";
import { RUBRIC_PANELS } from "../components/how-it-works/rubricPanels.js";
import { EXAMPLE_RESOURCE, getAggregatedStatus } from "../data/resources.js";
import { PARTNERS } from "../data/partners.js";
import { usePageLayoutStyles } from "../design-system/pageLayout.js";
import { injectStyles } from "../lib/injectStyles.js";

const CSS = `
.oer-hero__grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); gap: 48px; align-items: center; }
.oer-hero__demo { min-width: 0; }
.oer-hero__copy, .oer-hero__demo { opacity: 0; transform: translateY(16px); transition: opacity var(--dur-long) var(--ease-out), transform var(--dur-long) var(--ease-out); }
.oer-hero--mounted .oer-hero__copy, .oer-hero--mounted .oer-hero__demo { opacity: 1; transform: none; }
@media (max-width: 899px) {
  .oer-hero__grid { grid-template-columns: 1fr; gap: 32px; }
  .oer-hero__copy { order: 0; }
  .oer-hero__demo { order: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .oer-hero__copy, .oer-hero__demo { transition: none; opacity: 1; transform: none; }
}

.oer-problem__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px; align-items: start; }
@media (max-width: 899px) { .oer-problem__grid { grid-template-columns: 1fr; gap: 32px; } }
.oer-problem__badges { display: flex; align-items: center; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
.oer-problem__arrow { color: var(--text-subtle); flex: none; }

.oer-stats__row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 32px; }
@media (max-width: 899px) { .oer-stats__row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 639px) { .oer-stats__row { grid-template-columns: 1fr; } }

.oer-review-record__grid { display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); gap: 48px; align-items: start; }
@media (max-width: 899px) { .oer-review-record__grid { grid-template-columns: 1fr; gap: 32px; } }

.oer-final-cta { display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
`;

function useStyles() {
  injectStyles("home", CSS);
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function UploadIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="oer-problem__arrow">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

const DISCIPLINES = [
  "Statistics",
  "Chemistry",
  "Psychology",
  "Health Sciences",
  "Mathematics",
  "Political Science",
  "Biology",
];

// Condensed from ProcessSpine.jsx's 7 real steps (src/components/how-it-works/
// ProcessSpine.jsx STEPS) down to 3 teaser beats — see docs/design/
// LANDING_PAGE_ARCHITECTURE.md LP-OD-9 for the grouping this follows.
const WORKFLOW_STEPS = [
  {
    number: "01",
    icon: <UploadIcon />,
    title: "Submit",
    description:
      "An author brings an OER they've already published and picks which of the six rubrics it should be reviewed on.",
  },
  {
    number: "02",
    icon: <UsersIcon />,
    title: "Review against the rubrics",
    description:
      "A qualified reviewer works through it criterion by criterion in the Review Console, tying every comment to evidence in the resource itself.",
  },
  {
    number: "03",
    icon: <CheckCircleIcon />,
    title: "Publish & certify",
    description:
      "Once the author responds and the review loop closes, the resource carries a Peer Reviewed badge and its full history stays public.",
  },
];

const ROLES = [
  { id: "author", label: "Author" },
  { id: "reviewer", label: "Reviewer" },
];

const ROLE_PANELS = {
  author: {
    body: "Get a structured, criterion-by-criterion review instead of silence after you publish.",
    benefits: [
      "Pick which of the six rubrics apply to your resource",
      "Every comment is tied to evidence in your OER, so you know exactly what to change",
      "You decide if and when a completed review becomes public",
    ],
    cta: { label: "Submit a resource", href: "/community" },
  },
  reviewer: {
    body: "Bring your expertise to resources that need it, and get credited for the work.",
    benefits: [
      "Complete rubric training before your first assignment, so every review meets the same bar",
      "Work in one console instead of scattered docs and email threads",
      "Your name and institution appear on the public record, if you choose to share it",
    ],
    cta: { label: "Become a reviewer", href: "/community" },
  },
};

const RUBRIC_ITEMS = RUBRIC_PANELS.map((r) => ({
  id: r.id,
  label: r.label,
  summary: r.summary,
}));

// The Accessibility rubric's real review history on the labeled example
// resource — reused verbatim, not re-authored, per SECTION_LIBRARY.md's
// "Public Review Record" data requirement.
const EXAMPLE_TIMELINE = EXAMPLE_RESOURCE.rubricReviews.find((r) => r.rubricId === "accessibility")?.timeline || [];

export function Home() {
  usePageLayoutStyles();
  useStyles();
  useHowItWorksStyles();
  const navigate = useNavigate();
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const exampleStatus = getAggregatedStatus(EXAMPLE_RESOURCE);

  return (
    <div className="oer-page">
      {/* 1 — Product-Focused Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div className={`oer-container oer-hero__grid${heroMounted ? " oer-hero--mounted" : ""}`} style={{ padding: "80px 32px 72px" }}>
          <div className="oer-hero__copy">
            <h1 className="oer-h1" style={{ marginBottom: 20 }}>
              See the review before you adopt.
            </h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 32px" }}>
              Every resource in the Hub carries a public, evidence-based peer review against six rubrics
              developed with AAC&amp;U — real reviewers, criterion-by-criterion comments, nothing hidden
              after publication.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary" size="lg" href="/browse">
                Browse Peer-Reviewed OERs
              </Button>
              <Button variant="secondary" size="lg" href="/solution">
                See the Solution
              </Button>
            </div>
          </div>
          <div className="oer-hero__demo">
            <ReviewConsoleDemo />
          </div>
        </div>
      </section>

      {/* 2 — Partner-Logo Showcase */}
      <section style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y" style={{ paddingTop: 56, paddingBottom: 56 }}>
          <div style={{ maxWidth: 700, marginBottom: 40 }}>
            <h2 className="oer-h2" style={{ marginBottom: 12 }}>
              Our Partners
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              Universities, colleges, and open-education projects collaborating with the Hub on peer review.
            </p>
          </div>
          <PartnerLogoMarquee partners={PARTNERS} duration={32} pauseOnHover />
        </div>
      </section>

      {/* 3 — Problem & Outcome */}
      <Reveal as="section">
        <div className="oer-container oer-section-y">
          <div className="oer-eyebrow">Why review matters</div>
          <div className="oer-problem__grid">
            <div>
              <h2 className="oer-h2" style={{ marginBottom: 16 }}>
                Open doesn&apos;t tell you if it&apos;s any good.
              </h2>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
                Anyone can publish an open educational resource. Almost nothing about the license tells
                you whether it&apos;s accessible, accurate, current, or classroom-ready — so adopting one
                usually means trusting a stranger&apos;s word.
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 20, color: "var(--text-default)", margin: "0 0 12px" }}>
                What changes with the Hub
              </h3>
              <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
                The Hub puts a structured, six-rubric peer review in front of every resource, done by
                qualified reviewers, with the full record left public after publication. Adopting one
                means trusting a documented process, not a guess.
              </p>
              <div className="oer-problem__badges">
                <StatusBadge status="unreviewed" />
                <ArrowRightIcon />
                <StatusBadge status="peer_reviewed_revised" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 4 — Three-Step Review Workflow */}
      <section style={{ background: "var(--surface-subtle)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y">
          <div style={{ maxWidth: 700, marginBottom: 40 }}>
            <h2 className="oer-h2" style={{ marginBottom: 12 }}>
              How a resource gets reviewed
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              A condensed look at the full lifecycle — every step, criterion, and status is detailed on
              the Solution page.
            </p>
          </div>
          <StepGrid steps={WORKFLOW_STEPS} />
          <div style={{ marginTop: 32 }}>
            <Button variant="primary" size="md" href="/solution">
              See the full process →
            </Button>
          </div>
        </div>
      </section>

      {/* Search & browse by discipline — search relocated out of the hero */}
      <section style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y" style={{ paddingTop: 56, paddingBottom: 56 }}>
          <h2 className="oer-h2" style={{ marginBottom: 24 }}>
            Search the library
          </h2>
          <div style={{ display: "flex", gap: 12, alignItems: "stretch", maxWidth: 640, marginBottom: 28 }}>
            <div style={{ flex: 1 }}>
              <Input placeholder="Search by title, author, discipline, or institution…" aria-label="Search resources" />
            </div>
            <Button variant="primary" size="lg" href="/browse">
              Search
            </Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {DISCIPLINES.map((label) => (
              <FilterChip key={label} label={label} onClick={() => navigate("/browse")} />
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Role-Based Value Presentation */}
      <section>
        <div className="oer-container oer-section-y">
          <div style={{ maxWidth: 700, marginBottom: 32 }}>
            <h2 className="oer-h2" style={{ marginBottom: 12 }}>
              Built for every role in the process
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              Select a role to see what the Hub gives you specifically.
            </p>
          </div>
          <RoleTabs roles={ROLES} panels={ROLE_PANELS} />
        </div>
      </section>

      {/* 6 — Rubric method (single rubric shown at a time) */}
      <section style={{ background: "var(--surface-subtle)", borderTop: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y">
          <div className="oer-eyebrow">The rubric method</div>
          <h2 className="oer-h2" style={{ marginBottom: 16 }}>
            Six rubrics, one honest method.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 760, margin: "0 0 48px" }}>
            Every resource is checked against the same six lenses. Each carries a public, single-point
            standard, and reviewers respond with specific written comments rather than a bare number.
          </p>
          <RubricTabs items={RUBRIC_ITEMS} />
          <div style={{ marginTop: 48 }}>
            <OutboundLink href="https://library.scottsdalecc.edu/c.php?g=1521072&p=11385521" variant="button">
              Know more about O4PR rubric
            </OutboundLink>
          </div>
        </div>
      </section>

      {/* 7 — Public Review Record */}
      <Reveal as="section" style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y">
          <h2 className="oer-h2" style={{ marginBottom: 12 }}>
            A real, public review record
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 700, margin: "0 0 40px" }}>
            &quot;Transparent&quot; isn&apos;t just a claim — here&apos;s one resource&apos;s complete,
            unedited review history.
          </p>
          <div className="oer-review-record__grid">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                  padding: "10px 16px",
                  background: "var(--surface-default)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <Badge variant="solid">Example</Badge>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "var(--text-muted)" }}>
                  Illustrative — not part of the Hub&apos;s live catalog yet.
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 24, color: "var(--text-default)", margin: "0 0 8px" }}>
                {EXAMPLE_RESOURCE.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-subtle)", margin: "0 0 16px" }}>
                {EXAMPLE_RESOURCE.authorList.join(", ")} · {EXAMPLE_RESOURCE.primarySubject}
              </p>
              {exampleStatus && (
                <div style={{ marginBottom: 20 }}>
                  <StatusBadge status={exampleStatus} />
                </div>
              )}
              <Button variant="secondary" size="md" href={`/resource/${EXAMPLE_RESOURCE.id}`}>
                View this resource&apos;s full review →
              </Button>
            </div>
            <ReviewTimeline items={EXAMPLE_TIMELINE} />
          </div>
        </div>
      </Reveal>

      {/* 8 — Community & Trust */}
      <section style={{ background: "var(--surface-subtle)", borderTop: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y">
          <h2 className="oer-h2" style={{ marginBottom: 12 }}>
            A growing, active network
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 700, margin: "0 0 16px" }}>
            Institutions and projects already contributing reviewed materials and reviewer time.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <Badge variant="secondary">Demo data</Badge>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "var(--text-subtle)" }}>
              Illustrative figures — real reporting numbers aren&apos;t published yet.
            </span>
          </div>
          <div className="oer-stats__row" style={{ marginTop: 0, marginBottom: 40 }}>
            {[
              ["30+", "Peer Reviewed resources"],
              ["12+", "Active reviewers"],
              ["13", "Partner institutions"],
              ["8", "Disciplines"],
            ].map(([value, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 32, color: "var(--text-default)" }}>
                  {value}
                </div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 14, color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
          <InstitutionsGrid partners={PARTNERS} />
          <div style={{ marginTop: 32 }}>
            <Link to="/community" style={{ fontFamily: "var(--font-label)", fontWeight: "var(--weight-medium)", fontSize: 14 }}>
              See all partner institutions →
            </Link>
          </div>
        </div>
      </section>

      {/* 9 — Final CTA */}
      <Reveal as="section" style={{ background: "var(--brand-primary)" }}>
        <div className="oer-container oer-final-cta" style={{ padding: "64px 32px" }}>
          <div style={{ maxWidth: 620 }}>
            <h2 className="oer-h2" style={{ color: "var(--text-inverse)", marginBottom: 12 }}>
              Ready to see review done in the open?
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-on-ink-muted)", margin: 0 }}>
              Join authors, reviewers, and institutions building a transparent alternative to
              take-our-word-for-it OER.
            </p>
          </div>
          <Button variant="secondary" size="lg" href="/community">
            Explore community
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
