import React from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../components/feedback/Badge.jsx";
import { StatusBadge } from "../components/feedback/StatusBadge.jsx";
import { ReviewCoverageTable } from "../components/content/ReviewCoverageTable.jsx";
import { RubricReviewSection } from "../components/content/RubricReviewSection.jsx";
import { RubricSidebarNav } from "../components/content/RubricSidebarNav.jsx";
import { OutboundLink } from "../components/content/OutboundLink.jsx";
import { Button } from "../components/forms/Button.jsx";
import { getResourceById } from "../data/resources.js";

const container = { maxWidth: 1280, margin: "0 auto" };

export function ResourceDetail() {
  const { id } = useParams();
  const resource = getResourceById(id);

  if (!resource) {
    return (
      <div style={{ ...container, padding: "72px 32px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 28, color: "var(--text-default)", margin: "0 0 12px" }}>
          Resource not found
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", margin: "0 0 24px" }}>
          We couldn&apos;t find a resource with that ID.
        </p>
        <Link to="/browse" style={{ fontFamily: "var(--font-label)", fontWeight: 500 }}>
          ← Back to Browse
        </Link>
      </div>
    );
  }

  const hasRubricReviews = Array.isArray(resource.rubricReviews) && resource.rubricReviews.length > 0;

  const details = [
    ["Material type", resource.bookInfo || "Not specified"],
    ["Licence", resource.license || "Not specified"],
    ["Publish date", resource.publishDate || "Not specified"],
    ["Last updated", resource.lastUpdated || "Not specified"],
    ["Language(s)", resource.language || "Not specified"],
  ];
  if (resource.doi) details.push(["DOI", resource.doi]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Title block */}
      <div style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "24px 32px 36px" }}>
          {resource.isExample && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
                padding: "10px 16px",
                background: "var(--surface-default)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <Badge variant="solid">Example</Badge>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "var(--text-muted)" }}>
                This is a sample resource illustrating the full peer-review experience — it is not part of
                the Hub's live catalog.
              </span>
            </div>
          )}
          <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "var(--text-subtle)", marginBottom: 20 }}>
            <Link to="/browse">Browse</Link> &nbsp;/&nbsp; <Link to="/browse">{resource.primarySubject}</Link> &nbsp;/&nbsp;{" "}
            <span style={{ color: "var(--text-muted)" }}>{resource.title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <Badge variant="neutral">{resource.primarySubject}</Badge>
            {resource.additionalSubjectList.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
            {resource.license && <Badge variant="brand">{resource.license}</Badge>}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: "var(--weight-display)",
              fontSize: 40,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-default)",
              margin: "0 0 12px",
              maxWidth: 820,
              overflowWrap: "anywhere",
            }}
          >
            {resource.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, color: "var(--text-muted)" }}>
              {resource.authors}
              {resource.year ? ` · ${resource.year}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          ...container,
          padding: "40px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 48,
          width: "100%",
        }}
      >
        {/* Main */}
        <main style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 44 }}>
          <section>
            <h2 style={h2Style}>Abstract</h2>
            {resource.abstract ? (
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-default)", margin: 0, whiteSpace: "pre-line" }}>
                {resource.abstract}
              </p>
            ) : (
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-subtle)", margin: 0 }}>
                No abstract has been submitted for this resource yet.
              </p>
            )}
          </section>

          {hasRubricReviews ? (
            <>
              {/* Layer 2: Review Coverage overview */}
              <section>
                <h2 style={h2Style}>Peer review</h2>
                <ReviewCoverageTable rubricReviews={resource.rubricReviews} />
              </section>

              {/* Layer 3: one section per rubric reviewed */}
              {resource.rubricReviews.map((rr) => (
                <RubricReviewSection key={rr.rubricId} rubricReview={rr} />
              ))}
            </>
          ) : (
            /* Peer review status — no rubric reviews recorded yet */
            <section>
              <h2 style={{ ...h2Style, margin: "0 0 20px" }}>Peer review</h2>
              <div
                style={{
                  background: "var(--surface-subtle)",
                  borderRadius: "var(--radius-lg)",
                  padding: 28,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ maxWidth: 480 }}>
                  <div style={{ marginBottom: 10 }}>
                    <StatusBadge status={resource.status} />
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                    This resource has been catalogued but has not yet been assigned reviewers. Once peer
                    review begins, its version history and reviewer feedback will appear here.
                  </p>
                </div>
                <Button variant="secondary" size="md" href="/community">
                  Volunteer to review
                </Button>
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside style={{ alignSelf: "start", display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 88 }}>
          {hasRubricReviews && <RubricSidebarNav rubricReviews={resource.rubricReviews} />}

          {/* Outbound checkout */}
          <div style={{ borderRadius: "var(--radius-lg)", padding: 24, background: "var(--surface-default)", boxShadow: "var(--shadow-subtle)" }}>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "var(--text-subtle)", marginBottom: 14 }}>
              You&apos;ll leave the Hub to read it.
            </div>
            <div style={{ marginBottom: resource.sourceNote ? 10 : 12 }}>
              <OutboundLink href={resource.sourceUrl}>Access this OER</OutboundLink>
            </div>
            {resource.sourceNote && (
              <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-subtle)", marginBottom: 12 }}>
                {resource.sourceNote}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="secondary" size="md">
                Add to collection
              </Button>
              <Button variant="ghost" size="md">
                Cite
              </Button>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: "var(--surface-subtle)", borderRadius: "var(--radius-lg)", padding: 24 }}>
            <h3 style={h3Style}>Resource details</h3>
            <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {details.map(([term, value]) => (
                <div key={term}>
                  <dt style={dtStyle}>{term}</dt>
                  <dd style={{ margin: 0, fontSize: 15, color: "var(--text-default)" }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Contributing institution */}
          <div style={{ background: "var(--surface-subtle)", borderRadius: "var(--radius-lg)", padding: 24 }}>
            <h3 style={h3Style}>Contributed by</h3>
            <div style={{ fontSize: 15, color: "var(--text-default)", marginBottom: 4 }}>{resource.institution}</div>
            <Link to="/community" style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 500 }}>
              View institution profile →
            </Link>
          </div>
        </aside>
      </div>

      {/* Bottom CTA */}
      {resource.sourceUrl && (
        <div style={{ borderTop: "1px solid var(--border-default)" }}>
          <div style={{ ...container, padding: "32px 32px 56px", textAlign: "center" }}>
            <OutboundLink href={resource.sourceUrl}>Access this OER</OutboundLink>
          </div>
        </div>
      )}
    </div>
  );
}

const h2Style = {
  fontFamily: "var(--font-heading)",
  fontWeight: "var(--weight-display)",
  fontSize: 24,
  color: "var(--text-default)",
  margin: "0 0 14px",
};

const h3Style = {
  fontFamily: "var(--font-heading)",
  fontWeight: "var(--weight-display)",
  fontSize: 16,
  color: "var(--text-default)",
  margin: "0 0 16px",
};

const dtStyle = {
  fontFamily: "var(--font-label)",
  fontSize: 12,
  fontWeight: "var(--weight-medium)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-subtle)",
  marginBottom: 3,
};
