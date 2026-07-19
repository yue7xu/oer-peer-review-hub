import React from "react";
import { Button } from "../components/forms/Button.jsx";
import { InstitutionCard } from "../components/content/InstitutionCard.jsx";
import { ProjectCard } from "../components/content/ProjectCard.jsx";
import { ContactChannelList } from "../components/content/ContactChannelList.jsx";
import { ContactFormCard } from "../components/content/ContactFormCard.jsx";
import { CONTACT_CHANNELS } from "../data/contact.js";
import { PARTNERS } from "../data/partners.js";

const container = { maxWidth: 1280, margin: "0 auto" };

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

          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {PARTNERS.map((partner) => (
              <li key={partner.name}>
                <InstitutionCard name={partner.name} logo={partner.logo} alt={partner.alt} />
              </li>
            ))}
          </ul>
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
            <div style={{ maxWidth: 640 }}>
              <h2 style={h2Style}>Related projects</h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                Open-education projects whose resources are indexed and reviewed on the Hub.
              </p>
            </div>
            <Button variant="secondary" size="md">
              Join as an project
            </Button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            <ProjectCard
              initials="REAL"
              name="REAL Astronomy Workshop"
              subtitle="Hold by Joe Tamer"
              description="A Relevant, Engaging, Active Learning Astronomy Courseware Co-Create by three partners and reviewed on the Hub."
              badges={["SETI Institute", "Arizona State University", "OpenStax Astronomy 2e"]}
              linkHref="https://openstax.org/details/books/astronomy-2e"
              linkLabel="Visit the REAL Astronomy Workshop"
            />
            <ProjectCard
              name="Project Name"
              subtitle="Hold by firstname lastname"
              description={'project description or "quote" from project manager'}
            />
          </div>
        </div>
      </section>

      {/* Join the community */}
      <section>
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
            <h2 style={h2Style}>Join the community</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 28px" }}>
              Are you a coordinator who want to streamline the review workflow? Send a note and the team
              will reply within two working days.
            </p>
            <ContactChannelList channels={CONTACT_CHANNELS} />
          </div>

          <ContactFormCard />
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
