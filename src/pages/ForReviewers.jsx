import React from "react";
import { Button } from "../components/forms/Button.jsx";
import { Badge } from "../components/feedback/Badge.jsx";
import { StatusBadge } from "../components/feedback/StatusBadge.jsx";

const container = { maxWidth: 1280, margin: "0 auto" };

const CRITERIA = [
  {
    n: "01",
    title: "Accuracy & rigor",
    copy: "Is the content correct, current, and appropriately sourced for its level and discipline?",
  },
  {
    n: "02",
    title: "Pedagogical design",
    copy: "Do learning outcomes, examples, and assessments align and support the stated audience?",
  },
  {
    n: "03",
    title: "Accessibility",
    copy: "Are figures described, structure navigable, and the resource usable with assistive technology?",
  },
  {
    n: "04",
    title: "Openness & reuse",
    copy: "Is the licence clear and does the format genuinely support adaptation and reuse?",
  },
];

// Statuses follow the Block D PRD's lifecycle: a task awaiting or partway
// through reviewer assignment is "submitted" or "under_review" — it has not
// reached "Peer Reviewed" yet, since no reviewer has submitted a review.
const ASSIGNMENTS = [
  {
    discipline: "Statistics",
    status: "under_review",
    title: "Bayesian Methods for the Behavioral Sciences",
    meta: "Submitted 4 days ago · 1 of 2 reviewers assigned",
  },
  {
    discipline: "Chemistry",
    status: "submitted",
    title: "Foundations of Organic Chemistry (v2)",
    meta: "Re-review requested after author response · v1 → v2 · awaiting reviewer assignment",
  },
  {
    discipline: "Computer Science",
    status: "submitted",
    title: "Introduction to Systems Programming in Rust",
    meta: "Submitted 1 week ago · 0 of 2 reviewers assigned",
  },
];

export function ForReviewers() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "80px 32px 72px" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={eyebrowStyle}>For reviewers</div>
            <h1 style={h1Style}>Lend your expertise to open education.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 32px" }}>
              Evaluate open resources in your field against clear, published criteria. Your review is
              credited, visible, and directly shapes what educators adopt — a service contribution that
              counts.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary" size="lg">
                Become a reviewer
              </Button>
              <Button variant="secondary" size="lg" href="#">
                Go to reviewer dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Review criteria */}
      <section>
        <div style={{ ...container, padding: "72px 32px" }}>
          <h2 style={h2Style}>What you evaluate</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 48px", maxWidth: 620 }}>
            Every review scores four dimensions on the same public rubric authors and adopters can see.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {CRITERIA.map((c) => (
              <div key={c.n} style={cardStyle}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-subtle)", marginBottom: 8 }}>
                  {c.n}
                </div>
                <h3 style={h3Style}>{c.title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{c.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open assignments */}
      <section
        id="assignments"
        style={{
          background: "var(--surface-subtle)",
          borderTop: "1px solid var(--border-default)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div style={{ ...container, padding: "72px 32px" }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={h2Style}>Open assignments in your field</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              Submissions awaiting reviewers. Claim one to start.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ASSIGNMENTS.map((a) => (
              <div key={a.title} style={assignmentCardStyle}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Badge variant="neutral">{a.discipline}</Badge>
                    <StatusBadge status={a.status} />
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-display)", fontSize: 18, color: "var(--text-default)" }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{a.meta}</div>
                </div>
                <Button variant="secondary" size="md">
                  Claim review
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--brand-primary)" }}>
        <div style={{ ...container, padding: "64px 32px", textAlign: "center" }}>
          <h2 style={{ ...h2Style, color: "var(--text-inverse)", marginBottom: 12 }}>Join the reviewer community</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-on-ink-muted)", margin: "0 auto 28px", maxWidth: 560 }}>
            Tell us your fields and availability. We&apos;ll match you with submissions that fit your
            expertise.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="secondary" size="lg">
              Become a reviewer
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

const eyebrowStyle = {
  fontFamily: "var(--font-label)",
  fontSize: 13,
  fontWeight: "var(--weight-medium)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--brand-secondary)",
  marginBottom: 16,
};

const h1Style = {
  fontFamily: "var(--font-heading)",
  fontWeight: "var(--weight-display)",
  fontSize: 40,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  color: "var(--text-default)",
  margin: "0 0 20px",
};

const h2Style = {
  fontFamily: "var(--font-heading)",
  fontWeight: "var(--weight-display)",
  fontSize: 32,
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
  color: "var(--text-default)",
  margin: "0 0 8px",
};

const h3Style = {
  fontFamily: "var(--font-heading)",
  fontWeight: "var(--weight-display)",
  fontSize: 20,
  lineHeight: 1.4,
  color: "var(--text-default)",
  margin: "0 0 8px",
};

const cardStyle = {
  background: "var(--surface-subtle)",
  borderRadius: "var(--radius-lg)",
  padding: 32,
};

const assignmentCardStyle = {
  background: "var(--surface-default)",
  boxShadow: "var(--shadow-subtle)",
  borderRadius: "var(--radius-lg)",
  padding: "20px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
};
