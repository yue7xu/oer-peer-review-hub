/* Hallmark · macrostructure: Ecosystem Index (adapted) · tokens: locked to
 * project design.md — not Lovable's own dress
 * nav: N1b (existing Header.jsx, unchanged) · footer: Ft3 (existing
 * Footer.jsx, unchanged)
 * studied: yes · DNA-source: url (https://lovable.dev/community) — structure
 * only, per user's option (A): rails + browsing shape adopted, palette/type
 * stay on this project's own locked system.
 */
import React from "react";
import { Button } from "../components/forms/Button.jsx";
import { InstitutionsGrid } from "../components/content/InstitutionsGrid.jsx";
import { ProjectCard } from "../components/content/ProjectCard.jsx";
import { ContactChannelList } from "../components/content/ContactChannelList.jsx";
import { ContactFormCard } from "../components/content/ContactFormCard.jsx";
import { Reveal } from "../components/content/Reveal.jsx";
import { CONTACT_CHANNELS } from "../data/contact.js";
import { PARTNERS } from "../data/partners.js";
import { usePageLayoutStyles } from "../design-system/pageLayout.js";

const CSS = `
.oer-community__section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 36px; flex-wrap: wrap; }
/* Same auto-fit grid mechanism as InstitutionsGrid.jsx — "Partner
   institutions" and "Related projects" read as one consistent grid system. */
.oer-community__projects {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;
}
.oer-community__join-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; }
@media (max-width: 899px) { .oer-community__join-grid { grid-template-columns: 1fr; gap: 40px; } }

/* "Ways to join" pathway rail — the Ecosystem Index's discovery-surface
   entry point, adapted from lovable.dev/community's three-path hero band. */
.oer-community__pathways { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 899px) { .oer-community__pathways { grid-template-columns: 1fr 1fr; } }
@media (max-width: 639px) { .oer-community__pathways { grid-template-columns: 1fr; } }

.oer-pathcard {
  background: var(--surface-subtle); border-radius: var(--radius-lg); padding: 24px;
  display: flex; flex-direction: column; gap: 14px; height: 100%; box-sizing: border-box;
  transition: background 150ms var(--ease-out), box-shadow 150ms var(--ease-out);
}
.oer-pathcard:hover { background: var(--surface-default); box-shadow: var(--shadow-subtle); }
.oer-pathcard:focus-visible { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
.oer-pathcard__icon {
  width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--surface-default);
  display: flex; align-items: center; justify-content: center; color: var(--text-default); flex: none;
}
.oer-pathcard__icon--circle { border-radius: var(--radius-full); }
.oer-pathcard__title { font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 18px; color: var(--text-default); margin: 0; }
.oer-pathcard__desc { font-size: 14px; line-height: 1.6; color: var(--text-muted); margin: 0; flex: 1; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "community");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function BuildingIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M4 10 12 4l8 6" />
      <path d="M9 20v-6M15 20v-6" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function PathwayCard({ icon, shape = "square", title, description, href }) {
  return (
    <a href={href} className="oer-pathcard" style={{ textDecoration: "none" }}>
      <div className={`oer-pathcard__icon${shape === "circle" ? " oer-pathcard__icon--circle" : ""}`}>
        {icon}
      </div>
      <h3 className="oer-pathcard__title">{title}</h3>
      <p className="oer-pathcard__desc">{description}</p>
    </a>
  );
}

export function Community() {
  usePageLayoutStyles();
  useStyles();
  return (
    <div className="oer-page">
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y">
          <div style={{ maxWidth: 720 }}>
            <div className="oer-eyebrow">Community</div>
            <h1 className="oer-h1">Built by institutions and projects who believe in open review.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
              The Hub is a shared effort: universities and colleges contribute materials and reviewer time,
              and partner projects supply the resources educators adopt. Everyone works in the open.
            </p>
          </div>
        </div>
      </section>

      {/* Ways to join — a browsing entry point into the rails below, not a
          form itself; adapted from lovable.dev/community's three-path band */}
      <Reveal as="section">
        <div className="oer-container oer-section-y" style={{ paddingBottom: 0 }}>
          <div style={{ maxWidth: 640, marginBottom: 32 }}>
            <h2 className="oer-h2">Three ways to join</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              Pick the path that fits — each leads to the section below.
            </p>
          </div>
          <div className="oer-community__pathways">
            <PathwayCard
              icon={<BuildingIcon />}
              shape="square"
              title="As an institution"
              description={`Contribute reviewer time and reviewed materials, alongside ${PARTNERS.length} partner universities and colleges already in the network.`}
              href="#institutions"
            />
            <PathwayCard
              icon={<FolderIcon />}
              shape="circle"
              title="As a project"
              description="Bring an open-education project whose resources get indexed and reviewed on the Hub."
              href="#projects"
            />
            <PathwayCard
              icon={<PersonIcon />}
              shape="square"
              title="As an individual"
              description="Educator, author, or reviewer — reach out directly and the team will follow up."
              href="#join"
            />
          </div>
        </div>
      </Reveal>

      {/* Institutions */}
      <Reveal as="section" id="institutions">
        <div className="oer-container oer-section-y">
          <div className="oer-community__section-head">
            <div>
              <h2 className="oer-h2">Partner institutions</h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                Universities and colleges contributing materials and reviewer time to open review.
              </p>
            </div>
            <Button variant="secondary" size="md" href="#join">
              Join as an institution
            </Button>
          </div>
          <InstitutionsGrid partners={PARTNERS} />
        </div>
      </Reveal>

      {/* Related projects */}
      <Reveal
        as="section"
        id="projects"
        style={{ background: "var(--surface-subtle)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="oer-container oer-section-y">
          <div className="oer-community__section-head">
            <div style={{ maxWidth: 640 }}>
              <h2 className="oer-h2">Related projects</h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                Open-education projects whose resources are indexed and reviewed on the Hub.
              </p>
            </div>
            <Button variant="secondary" size="md" href="#join">
              Join as a project
            </Button>
          </div>

          <ul className="oer-community__projects">
            <li>
              <ProjectCard
                initials="REAL"
                name="REAL Astronomy Workshop"
                subtitle="Hold by Joe Tamer"
                description="A Relevant, Engaging, Active Learning Astronomy Courseware Co-Create by three partners and reviewed on the Hub."
                badges={["SETI Institute", "Arizona State University", "OpenStax Astronomy 2e"]}
                linkHref="https://openstax.org/details/books/astronomy-2e"
                linkLabel="Visit the REAL Astronomy Workshop"
              />
            </li>
            <li>
              <ProjectCard
                logoShape="circle"
                name="Project Name"
                subtitle="Hold by firstname lastname"
                description={'project description or "quote" from project manager'}
              />
            </li>
          </ul>
        </div>
      </Reveal>

      {/* Join the community */}
      <Reveal as="section" id="join">
        <div className="oer-container oer-section-y oer-community__join-grid">
          <div>
            <h2 className="oer-h2">Join the community</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 28px" }}>
              Are you a coordinator who want to streamline the review workflow? Send a note and the team
              will reply within two working days.
            </p>
            <ContactChannelList channels={CONTACT_CHANNELS} />
          </div>

          <ContactFormCard />
        </div>
      </Reveal>
    </div>
  );
}
