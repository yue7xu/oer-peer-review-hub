import React from "react";
import { Button } from "../components/forms/Button.jsx";
import { Badge } from "../components/feedback/Badge.jsx";
import { OutboundLink } from "../components/content/OutboundLink.jsx";

const container = { maxWidth: 1280, margin: "0 auto" };

const INSTITUTIONS = [
  { name: "Open Learning Initiative", initials: "OLI", location: "Pittsburgh, Pennsylvania" },
  { name: "Arizona State University", initials: "ASU", location: "Tempe, Arizona" },
  { name: "Carnegie Mellon University", initials: "CMU", location: "Pittsburgh, Pennsylvania" },
  { name: "Maricopa Community Colleges", initials: "MCC", location: "Tempe, Arizona" },
  { name: "OpenStax", initials: "OS", location: "Houston, Texas" },
];

function LogoPlaceholder({ initials }) {
  return (
    <div
      style={{
        width: "100%",
        height: 64,
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-default)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-heading)",
        fontWeight: "var(--weight-display)",
        fontSize: 15,
        color: "var(--text-subtle)",
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

export function Community() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "72px 32px" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={eyebrowStyle}>Community</div>
            <h1 style={h1Style}>Built by institutions and projects who believe in open review.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
              The Hub is a shared effort: universities and colleges contribute materials and reviewer time,
              and partner projects supply the resources educators adopt. Everyone works in the open.
            </p>
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section>
        <div style={{ ...container, padding: "72px 32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: 36,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={h2Style}>Partner institutions</h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                Universities and colleges contributing materials and reviewer time to open review.
              </p>
            </div>
            <Button variant="secondary" size="md">
              Join as an institution
            </Button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {INSTITUTIONS.map((inst) => (
              <div
                key={inst.name}
                style={{
                  borderRadius: "var(--radius-lg)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  background: "var(--surface-subtle)",
                }}
              >
                <LogoPlaceholder initials={inst.initials} />
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: "var(--weight-display)",
                      fontSize: 17,
                      lineHeight: 1.35,
                      color: "var(--text-default)",
                      margin: "0 0 4px",
                    }}
                  >
                    {inst.name}
                  </h3>
                  <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{inst.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related projects */}
      <section
        style={{
          background: "var(--surface-subtle)",
          borderTop: "1px solid var(--border-default)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div style={{ ...container, padding: "72px 32px" }}>
          <div style={{ maxWidth: 640, marginBottom: 36 }}>
            <h2 style={h2Style}>Related projects</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              Open-education projects whose resources are indexed and reviewed on the Hub. Following a link
              takes you to the project&apos;s own site.
            </p>
          </div>

          <div
            style={{
              maxWidth: 760,
              background: "var(--surface-default)",
              boxShadow: "var(--shadow-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 120, flex: "none" }}>
                <LogoPlaceholder initials="REAL" />
              </div>
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: "var(--weight-display)",
                    fontSize: 24,
                    lineHeight: 1.25,
                    color: "var(--text-default)",
                    margin: "0 0 4px",
                  }}
                >
                  REAL Astronomy Workshop
                </h3>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 14, color: "var(--text-muted)" }}>
                  Co-Create Relevant, Engaging, Active Learning
                </div>
              </div>
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              Openly licensed astronomy courseware built for active learning, developed collaboratively by
              three partners and reviewed on the Hub.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge variant="neutral">Arizona State University</Badge>
              <Badge variant="neutral">OpenStax Astronomy 2e</Badge>
              <Badge variant="neutral">DTI Institute</Badge>
            </div>
            <div>
              <OutboundLink href="https://openstax.org/details/books/astronomy-2e" variant="inline">
                Visit the REAL Astronomy Workshop
              </OutboundLink>
            </div>
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
