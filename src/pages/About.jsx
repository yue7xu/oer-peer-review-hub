import React, { useState } from "react";
import { Input } from "../components/forms/Input.jsx";
import { Select } from "../components/forms/Select.jsx";
import { Button } from "../components/forms/Button.jsx";

const container = { maxWidth: 1280, margin: "0 auto" };

const PRINCIPLES = [
  {
    title: "Trust & credibility",
    copy: "Review is done by qualified educators against public criteria, and the full history stays on the record — nothing is hidden after publication.",
  },
  {
    title: "Openness & access",
    copy: "Every resource is openly licensed and freely readable. We link to the source rather than locking it behind our own walls.",
  },
  {
    title: "Human warmth",
    copy: "A community of authors and reviewers, not a black box. Feedback is constructive, credited, and written to help — never to gatekeep.",
  },
];

export function About() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{ ...container, padding: "72px 32px" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={eyebrowStyle}>About</div>
            <h1 style={h1Style}>Trustworthy open resources, through review anyone can see.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
              The Hub exists to make open educational resources as credible as anything behind a paywall —
              by putting an honest, versioned peer review process in front of every educator who has to
              choose.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section>
        <div style={{ ...container, padding: "72px 32px" }}>
          <h2 style={{ ...h2Style, marginBottom: 48 }}>What we stand for</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <h3 style={h3Style}>{p.title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ background: "var(--surface-subtle)", borderTop: "1px solid var(--border-default)" }}>
        <div
          style={{
            ...container,
            padding: "72px 32px",
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 64,
          }}
        >
          <div>
            <h2 style={h2Style}>Get in touch</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 28px" }}>
              Questions about submitting, reviewing, or partnering? Send a note and the team will reply
              within two working days.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={contactLabelStyle}>General</div>
                <a href="mailto:hello@oerhub.org" style={{ fontSize: 16 }}>
                  hello@oerhub.org
                </a>
              </div>
              <div>
                <div style={contactLabelStyle}>Institutions</div>
                <a href="mailto:partners@oerhub.org" style={{ fontSize: 16 }}>
                  partners@oerhub.org
                </a>
              </div>
              <div>
                <div style={contactLabelStyle}>Press</div>
                <a href="mailto:press@oerhub.org" style={{ fontSize: 16 }}>
                  press@oerhub.org
                </a>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--surface-default)",
              boxShadow: "var(--shadow-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: 32,
            }}
          >
            {submitted ? (
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-default)", margin: 0 }}>
                Thanks — your message has been sent. The team will reply within two working days.
              </p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input label="Name" placeholder="Your name" required />
                  <Input label="Email" type="email" placeholder="you@institution.edu" required />
                </div>
                <Select label="I'm reaching out as">
                  <option>An educator</option>
                  <option>An author</option>
                  <option>A reviewer</option>
                  <option>An institution</option>
                  <option>Press / other</option>
                </Select>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label
                    style={{
                      fontFamily: "var(--font-label)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-default)",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    placeholder="How can we help?"
                    rows={5}
                    required
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--text-default)",
                      background: "var(--surface-default)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-sm)",
                      padding: "9px 12px",
                      resize: "vertical",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <Button variant="primary" size="lg" type="submit">
                    Send message
                  </Button>
                </div>
              </form>
            )}
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
  margin: "0 0 16px",
};

const h3Style = {
  fontFamily: "var(--font-heading)",
  fontWeight: "var(--weight-display)",
  fontSize: 20,
  lineHeight: 1.4,
  color: "var(--text-default)",
  margin: "0 0 8px",
};

const contactLabelStyle = {
  fontFamily: "var(--font-label)",
  fontSize: 12,
  fontWeight: "var(--weight-medium)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-subtle)",
  marginBottom: 3,
};
