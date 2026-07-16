import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/forms/Button.jsx";
import { Input } from "../components/forms/Input.jsx";
import { ResourceCard } from "../components/content/ResourceCard.jsx";
import { FilterChip } from "../components/forms/FilterChip.jsx";
import { RESOURCES, getAggregatedStatus } from "../data/resources.js";

const container = { maxWidth: 1280, margin: "0 auto", padding: "0 32px" };

const DISCIPLINES = [
  "Statistics",
  "Chemistry",
  "Psychology",
  "Health Sciences",
  "Mathematics",
  "Political Science",
  "Biology",
  "Computer Science",
];

const LIFECYCLE_STAGES = [
  {
    number: "01",
    title: "Submit",
    copy: "The author submits an OER link, selects the relevant rubrics, and chooses whether the review stays private or may later be published.",
  },
  {
    number: "02",
    title: "Expert Review",
    copy: "A coordinator matches qualified reviewers. Reviewers evaluate the resource using structured criteria and evidence-linked comments, and OER can move forward with another independent round.",
  },
  {
    number: "03",
    title: "Feedback & Revision",
    copy: "The author reviews structured feedback, revises the resource, or requests another independent round.",
  },
  {
    number: "04",
    title: "New Version Publish",
    copy: "The completed resource is marked Peer Reviewed · Revised and full review loop has been closed. Adopters can confidently cite or reuse this OER.",
  },
];

const QUALITY_STAGES = [
  {
    number: "#1",
    title: "Expert Reviewers",
    copy: "Experienced educators from leading institutions must go through pertaining so that they can be qualified to attend evaluation on each resource against rigorous standards.",
  },
  {
    number: "#2",
    title: "Structured Evaluation",
    copy: "Six OpenEDPeer Review rubrics cover: Accessibility · Copy Editing · Copyright · Disciplinary Appropriateness · eLearning · Universal Design for Learning.",
  },
  {
    number: "#3",
    title: "Evidence-Based Feedback",
    copy: "Reviewers connect comments directly to specific locations in the resource so authors know exactly what to improve. Each annotation comes with constructive feedback and actionable suggestions.",
  },
  {
    number: "#4",
    title: "Transparent Results",
    copy: "Review summaries, criteria ratings, author responses and reviewer credentials* can be publicly shown.\n*names pre-training credentials. Public reviews may show name and institution.",
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
              <Button variant="secondary" size="md" href="/#how-it-works">
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
            ["12,480", "Peer Reviewed resources"],
            ["3,200", "Active reviewers"],
            ["240", "Partner institutions"],
            ["38", "Disciplines"],
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 24 }}>
            {LIFECYCLE_STAGES.map((stage) => (
              <div
                key={stage.number}
                style={{ background: "var(--surface-subtle)", borderRadius: "var(--radius-lg)", padding: 32 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-label)",
                    fontSize: 13,
                    fontWeight: "var(--weight-semibold)",
                    color: "var(--text-subtle)",
                    marginBottom: 16,
                  }}
                >
                  {stage.number}
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
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{stage.copy}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-subtle)", margin: "0 0 4px" }}>
            🔒 Private by default. Authors decide whether completed review results are published.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-subtle)", margin: "0 0 28px" }}>
            We also provide student review and self-review, but only reviews by qualified reviewers can get
            badges.
          </p>
          <Button variant="primary" size="md" href="#">
            See the detailed process →
          </Button>
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
              margin: "0 0 32px",
            }}
          >
            How We Ensure Quality
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 28 }}>
            {QUALITY_STAGES.map((stage) => (
              <div key={stage.number}>
                <div
                  style={{
                    fontFamily: "var(--font-label)",
                    fontSize: 13,
                    fontWeight: "var(--weight-semibold)",
                    color: "var(--text-brand)",
                    marginBottom: 12,
                  }}
                >
                  {stage.number}
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
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0, whiteSpace: "pre-line" }}>
                  {stage.copy}
                </p>
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
