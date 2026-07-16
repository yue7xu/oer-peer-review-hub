import React from "react";
import { Button } from "../components/forms/Button.jsx";

const container = { maxWidth: 1280, margin: "0 auto" };

const STEPS = [
  {
    n: 1,
    title: "Submit",
    copy: "Add your resource link, licence, and metadata. We check scope and eligibility, then assign reviewers.",
  },
  {
    n: 2,
    title: "Get reviewed",
    copy: (
      <>
        Two reviewers in your field evaluate against public criteria. Status shows <em>Not revised</em>.
      </>
    ),
  },
  {
    n: 3,
    title: "Respond",
    copy: (
      <>
        Reply to feedback point by point. Your public response moves status to <em>Responded</em>.
      </>
    ),
  },
  {
    n: 4,
    title: "Revise & publish",
    copy: (
      <>
        Publish a new version incorporating changes. Status becomes <em>Revised</em> — every version
        preserved.
      </>
    ),
  },
];

const BENEFITS = [
  {
    title: "A citable version of record",
    copy: "Each version gets a DOI, so adopters cite exactly what they used and your work counts toward review.",
  },
  {
    title: "Credible, constructive feedback",
    copy: "Reviews come from qualified educators in your discipline, evaluated against clear published criteria.",
  },
  {
    title: "Reach through the library",
    copy: "Reviewed resources surface in Browse and discipline pages, in front of educators actively choosing materials.",
  },
];

const REQUIREMENTS = [
  "An open licence (CC BY, CC BY-SA, or CC BY-NC) is applied to the resource.",
  "The resource is publicly accessible at a stable URL you control or link to.",
  "Learning outcomes, level, and discipline are described in the metadata.",
  "Figures include alt text and the resource meets basic accessibility guidance.",
];

export function ForAuthors() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "80px 32px 72px" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={eyebrowStyle}>For authors</div>
            <h1 style={h1Style}>Get your open resource peer reviewed — in the open.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: "0 0 32px" }}>
              Submit a textbook, courseware, or activity and have it evaluated by qualified reviewers in your
              field. Every review, response, and revision stays on the public record, so adopters can trust
              your work and cite the version they used.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary" size="lg">
                Submit a resource
              </Button>
              <Button variant="secondary" size="lg" href="#">
                Go to author dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How submission works */}
      <section>
        <div style={{ ...container, padding: "72px 32px" }}>
          <h2 style={h2Style}>How submission works</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 48px", maxWidth: 620 }}>
            Four steps, fully transparent. Your resource moves through the same three-state status readers
            see on every page.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {STEPS.map((step) => (
              <div key={step.n}>
                <div style={stepBadgeStyle}>{step.n}</div>
                <h3 style={h3Style}>{step.title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        style={{
          background: "var(--surface-subtle)",
          borderTop: "1px solid var(--border-default)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div style={{ ...container, padding: "72px 32px" }}>
          <h2 style={{ ...h2Style, marginBottom: 48 }}>Why authors submit</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={cardStyle}>
                <h3 style={h3Style}>{b.title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{b.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section>
        <div style={{ ...container, padding: "72px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <h2 style={h2Style}>What we ask before you submit</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              A short checklist keeps review fast and fair. Reviewers see the same criteria you do.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REQUIREMENTS.map((r) => (
              <div key={r} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "var(--feedback-success-icon)", fontSize: 20, lineHeight: 1.4 }}>✓</span>
                <span style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-default)" }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--brand-primary)" }}>
        <div style={{ ...container, padding: "64px 32px", textAlign: "center" }}>
          <h2 style={{ ...h2Style, color: "var(--text-inverse)", marginBottom: 12 }}>Ready to submit your resource?</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-on-ink-muted)", margin: "0 auto 28px", maxWidth: 560 }}>
            Create an author account and add your first resource in a few minutes.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="secondary" size="lg">
              Submit a resource
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

const stepBadgeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "var(--radius-full)",
  background: "var(--brand-primary)",
  color: "var(--text-inverse)",
  fontFamily: "var(--font-heading)",
  fontWeight: "var(--weight-display)",
  fontSize: 18,
  marginBottom: 16,
};

const cardStyle = {
  background: "var(--surface-default)",
  boxShadow: "var(--shadow-subtle)",
  borderRadius: "var(--radius-lg)",
  padding: 32,
};
