import React from "react";
import { Button } from "../components/forms/Button.jsx";
import { EmptyState } from "../components/content/EmptyState.jsx";

const container = { maxWidth: 1280, margin: "0 auto" };

export function Solution() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "72px 32px" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={eyebrowStyle}>Solution</div>
            <h1 style={h1Style}>A closer look at the Solution is on its way.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
              We're still designing this page. In the meantime, the peer-review lifecycle is covered on the
              homepage, or you can browse resources that have already been through it.
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder */}
      <section>
        <div style={{ ...container, padding: "72px 32px" }}>
          <EmptyState
            title="This page is under construction"
            message="We're building out a full breakdown of the Open4PeerReview solution. Check back soon."
            action={
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Button variant="primary" size="md" href="/#how-it-works">
                  See how it works
                </Button>
                <Button variant="secondary" size="md" href="/browse">
                  Browse resources
                </Button>
              </div>
            }
          />
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
