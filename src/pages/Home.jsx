import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/forms/Button.jsx";
import { Input } from "../components/forms/Input.jsx";
import { StatusBadge } from "../components/feedback/StatusBadge.jsx";
import { ResourceCard } from "../components/content/ResourceCard.jsx";
import { FilterChip } from "../components/forms/FilterChip.jsx";
import { RESOURCES, FACET_GROUPS, getAggregatedStatus } from "../data/resources.js";

const container = { maxWidth: 1280, margin: "0 auto", padding: "0 32px" };

const DISCIPLINES = FACET_GROUPS.find((g) => g.key === "primarySubject").options;

const FEATURED = RESOURCES.filter((r) => getAggregatedStatus(r) != null).slice(0, 3);

export function Home() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "80px 32px 72px" }}>
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-label)",
                fontSize: 13,
                fontWeight: "var(--weight-medium)",
                color: "var(--text-brand)",
                background: "var(--brand-primary-subtle)",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                marginBottom: 24,
              }}
            >
              Transparent academic peer review for open resources
            </div>
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
              Peer-reviewed open educational resources, in one trusted library.
            </h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 32px" }}>
              Discover, evaluate, and share teaching materials vetted through an open, versioned review
              process — so you can adopt with confidence and cite with clarity.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "stretch", maxWidth: 640, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <Input placeholder="Search by title, author, discipline, or DOI…" aria-label="Search resources" />
              </div>
              <Button variant="primary" size="lg" href="/browse">
                Search
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                fontFamily: "var(--font-label)",
                fontSize: 14,
                color: "var(--text-subtle)",
              }}
            >
              <span>Popular:</span>
              <Link to="/browse">Introductory statistics</Link>
              <Link to="/browse">Organic chemistry</Link>
              <Link to="/browse">U.S. history</Link>
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
            ["12,480", "Reviewed resources"],
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

      {/* How review works */}
      <section>
        <div style={{ ...container, padding: "72px 32px" }}>
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
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
              How review works on the Hub
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              Every resource carries its full review history. A three-state status tells you at a glance
              where each version stands — no digging required.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                status: "not-revised",
                title: "Reviewed, awaiting revision",
                copy: "Reviewers have evaluated the submission and requested changes. The author has not yet responded.",
              },
              {
                status: "responded",
                title: "Author responded",
                copy: "The author has addressed the feedback in writing. The response is public and awaiting re-review.",
              },
              {
                status: "revised",
                title: "Revised & re-published",
                copy: "A new version incorporates the requested changes. Every prior version stays on the record.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{ background: "var(--surface-subtle)", borderRadius: "var(--radius-lg)", padding: 32 }}
              >
                <div style={{ marginBottom: 16 }}>
                  <StatusBadge status={card.status} />
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
                  {card.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{card.copy}</p>
              </div>
            ))}
          </div>
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
            {DISCIPLINES.map((d) => (
              <FilterChip key={d.label} label={d.label} count={d.count} />
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
              Join 240 universities and colleges contributing reviewed materials and reviewer time to the
              open community.
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
