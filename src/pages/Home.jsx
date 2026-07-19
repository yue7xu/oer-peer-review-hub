import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/forms/Button.jsx";
import { Input } from "../components/forms/Input.jsx";
import { StatusBadge } from "../components/feedback/StatusBadge.jsx";
import { ResourceCard } from "../components/content/ResourceCard.jsx";
import { FilterChip } from "../components/forms/FilterChip.jsx";
import { RESOURCES, getAggregatedStatus } from "../data/resources.js";

const container = { maxWidth: 1280, margin: "0 auto", padding: "0 32px" };

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
function RefreshIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
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
function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: "none" }}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

const LIFECYCLE_STAGES = [
  {
    number: "01",
    title: "Submit",
    icon: <UploadIcon />,
    copy: "The author submits an OER link, selects the relevant rubrics, and chooses whether the review stays private or may later be published.",
  },
  {
    number: "02",
    title: "Expert Review",
    icon: <UsersIcon />,
    copy: "A coordinator matches qualified reviewers. Reviewers evaluate the resource using structured rubrics and evidence-linked comments, and OER can been found in here with",
    badge: { status: "peer_reviewed", label: "Peer Reviewed" },
  },
  {
    number: "03",
    title: "Feedback & Revision",
    icon: <RefreshIcon />,
    copy: "The author receives structured feedback and may accept the review, revise the resource, or request another independent round.",
  },
  {
    number: "04",
    title: "New Version Publish",
    icon: <CheckCircleIcon />,
    copy: "The completed resource is marked",
    badge: { status: "peer_reviewed_revised", label: "Peer Reviewed · Revised" },
    after: "and full review loop has been closed. Adopters can confidently cite or remix this OER.",
  },
];

const QUALITY_STAGES = [
  {
    number: "01",
    title: "Expert Reviewers",
    copy: "Experienced educators from leading institutions must go through pertaining so that they can be qualified to attend evaluation on each resource against rigorous standards.",
  },
  {
    number: "02",
    title: "Structured Evaluation",
    intro: "Six Open4PeerReview rubrics cover:",
    list: ["accessibility", "copyright", "eLearning", "universal design for learning", "copy editing", "disciplinary appropriateness"],
  },
  {
    number: "03",
    title: "Evidence-Based Feedback",
    copy: "Reviewers connect comments directly to specific locations in the resource so authors know exactly what to improve. Each annotation will come with constructive feedback and actionable suggestions.",
  },
  {
    number: "04",
    title: "Transparent Results",
    copy: "Review summaries, criteria ratings, author responses and reviewer credentials* can be publicly visible.",
    footnote: "*means pre-training credentials. Public reviewer may show name and institution.",
  },
];

const FEATURED = RESOURCES.filter((r) => getAggregatedStatus(r) != null).slice(0, 3);

export function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "80px 32px 72px" }}>
          <div style={{ maxWidth: 760 }}>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: "var(--weight-display)",
                fontSize: 40,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--text-default)",
                margin: "0 0 20px",
              }}
            >
              Peer-reviewed OER, in one trusted library.
            </h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 32px" }}>
              Discover peer-reviewed textbooks, courses, and materials vetted by pre-trained reviewers
              using evidence-based rubrics developed with AAC&amp;U. Every resource meets rigorous quality
              standards — so you can adopt with confidence, teach with impact, and cite with clarity.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "stretch", maxWidth: 640, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="Search by title, author, discipline, or institution…"
                  aria-label="Search resources"
                />
              </div>
              <Button variant="primary" size="lg" href="/browse">
                Search
              </Button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="secondary" size="md" href="/browse">
                Browse Peer-Reviewed OERs
              </Button>
              <Button variant="secondary" size="md" href="/solution">
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div
          style={{
            ...container,
            padding: "40px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          {[
            ["X", "Peer Reviewed resources"],
            ["X", "Active reviewers"],
            ["X", "Partner institutions"],
            ["X", "Disciplines"],
          ].map(([value, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 32, color: "var(--text-default)" }}>
                {value}
              </div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 14, color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The lifecycle */}
      <section id="how-it-works">
        <div style={{ ...container, padding: "72px 32px" }}>
          <div style={{ maxWidth: 700, marginBottom: 48 }}>
            <div
              style={{
                fontFamily: "var(--font-label)",
                fontSize: 13,
                fontWeight: "var(--weight-semibold)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-brand)",
                marginBottom: 12,
              }}
            >
              The Lifecycle
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: "var(--weight-display)",
                fontSize: 32,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "var(--text-default)",
                margin: "0 0 12px",
              }}
            >
              How O4PR Peer Review Works
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              A concise overview of the complete open educational resource review lifecycle, from
              submission to certification.
            </p>
          </div>

          <div style={{ background: "var(--surface-subtle)", borderRadius: "var(--radius-lg)", padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {LIFECYCLE_STAGES.map((stage) => (
                <div key={stage.number}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "var(--radius-md)",
                        background: "var(--surface-default)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-default)",
                      }}
                    >
                      {stage.icon}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-label)",
                        fontSize: 13,
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--text-subtle)",
                      }}
                    >
                      {stage.number}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: "var(--weight-display)",
                      fontSize: 20,
                      lineHeight: 1.4,
                      color: "var(--text-default)",
                      margin: "0 0 8px",
                    }}
                  >
                    {stage.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", margin: stage.badge ? "0 0 10px" : 0 }}>
                    {stage.copy}
                  </p>
                  {stage.badge && (
                    <div style={{ marginBottom: stage.after ? 10 : 0 }}>
                      <StatusBadge status={stage.badge.status}>{stage.badge.label}</StatusBadge>
                    </div>
                  )}
                  {stage.after && (
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{stage.after}</p>
                  )}
                </div>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-default)", margin: "28px 0 20px" }} />

            <p style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-subtle)", margin: "0 0 4px" }}>
              <LockIcon /> Private by default. Authors decide whether completed review results are published.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-subtle)", margin: 0 }}>
              We also provide student review and self-review, but only reviews by qualified reviewers can get
              badges.
            </p>
          </div>

          <div style={{ marginTop: 28 }}>
            <Button variant="primary" size="md" href="/solution">
              See the detailed process →
            </Button>
          </div>
        </div>
      </section>

      {/* How we ensure quality */}
      <section style={{ background: "var(--surface-subtle)", borderTop: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "72px 32px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: "var(--weight-display)",
              fontSize: 32,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "var(--text-default)",
              margin: 0,
            }}
          >
            How We Ensure Quality
          </h2>

          <hr style={{ border: "none", borderTop: "1px solid var(--border-strong)", margin: "24px 0 32px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 28 }}>
            {QUALITY_STAGES.map((stage) => (
              <div key={stage.number}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-default)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "none",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-default)" }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-label)",
                      fontSize: 13,
                      fontWeight: "var(--weight-semibold)",
                      color: "var(--text-subtle)",
                    }}
                  >
                    {stage.number}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: "var(--weight-display)",
                    fontSize: 18,
                    lineHeight: 1.4,
                    color: "var(--text-default)",
                    margin: "0 0 8px",
                  }}
                >
                  {stage.title}
                </h3>
                {stage.intro && (
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 4px" }}>{stage.intro}</p>
                )}
                {stage.list && (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)" }}>
                    {stage.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {stage.copy && (
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{stage.copy}</p>
                )}
                {stage.footnote && (
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: "12px 0 0" }}>{stage.footnote}</p>
                )}
              </div>
            ))}
          </div>
          <Button variant="secondary" size="md" href="/about">
            Learn about the review standards →
          </Button>
        </div>
      </section>

      {/* Featured resources */}
      <section
        style={{
          background: "var(--surface-subtle)",
          borderTop: "1px solid var(--border-default)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div style={{ ...container, padding: "72px 32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 36,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: "var(--weight-display)",
                fontSize: 32,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "var(--text-default)",
                margin: 0,
              }}
            >
              Recently reviewed
            </h2>
            <Link to="/browse" style={{ fontFamily: "var(--font-label)", fontWeight: "var(--weight-medium)", fontSize: 14 }}>
              Browse all resources →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {FEATURED.map((r) => (
              <ResourceCard
                key={r.id}
                title={r.title}
                href={`/resource/${r.id}`}
                authors={r.authors}
                abstract={r.abstract}
                discipline={r.primarySubject}
                license={r.license}
                status={getAggregatedStatus(r)}
                reviewCount={r.rubricReviews.length}
                sourceHref={r.sourceUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by discipline */}
      <section>
        <div style={{ ...container, padding: "72px 32px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: "var(--weight-display)",
              fontSize: 32,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "var(--text-default)",
              margin: "0 0 32px",
            }}
          >
            Browse by discipline
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {DISCIPLINES.map((label) => (
              <FilterChip
                key={label}
                label={label}
                onClick={() => navigate("/browse")}
                onRemove={() => navigate("/browse")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Institutions CTA */}
      <section style={{ background: "var(--brand-primary)" }}>
        <div
          style={{
            ...container,
            padding: "64px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: "var(--weight-display)",
                fontSize: 32,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "var(--text-inverse)",
                margin: "0 0 12px",
              }}
            >
              Bring transparent review to your institution
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-on-ink-muted)", margin: 0 }}>
              Join 13 universities and colleges contributing reviewed materials and reviewer time to the
              OER community.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Button variant="secondary" size="lg" href="/community">
              Explore community
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
