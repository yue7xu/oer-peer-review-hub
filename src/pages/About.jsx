import React from "react";
import { ContactChannelList } from "../components/content/ContactChannelList.jsx";
import { ContactFormCard } from "../components/content/ContactFormCard.jsx";
import { Reveal } from "../components/content/Reveal.jsx";
import { CONTACT_CHANNELS } from "../data/contact.js";
import { usePageLayoutStyles } from "../design-system/pageLayout.js";

const CSS = `
.oer-about__principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 899px) { .oer-about__principles { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 639px) { .oer-about__principles { grid-template-columns: 1fr; } }

.oer-about__contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; }
@media (max-width: 899px) { .oer-about__contact-grid { grid-template-columns: 1fr; gap: 40px; } }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "about");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

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
  usePageLayoutStyles();
  useStyles();
  return (
    <div className="oer-page">
      {/* Hero */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y">
          <div style={{ maxWidth: 760 }}>
            <div className="oer-eyebrow">About</div>
            <h1 className="oer-h1">Trustworthy open resources, through review anyone can see.</h1>
            <p style={{ fontSize: 20, lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
              The Hub exists to make open educational resources as credible as anything behind a paywall —
              by putting an honest, versioned peer review process in front of every educator who has to
              choose.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <Reveal as="section">
        <div className="oer-container oer-section-y">
          <h2 className="oer-h2" style={{ marginBottom: 48 }}>
            What we stand for
          </h2>
          <div className="oer-about__principles">
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <h3 className="oer-h3">{p.title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Contact */}
      <Reveal as="section" style={{ background: "var(--surface-subtle)", borderTop: "1px solid var(--border-default)" }}>
        <div className="oer-container oer-section-y oer-about__contact-grid">
          <div>
            <h2 className="oer-h2">Get in touch</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-muted)", margin: "0 0 12px" }}>
              Questions about submitting, reviewing, or partnering? Send a note and the team will reply
              within two working days.
            </p>
            <p style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "var(--text-subtle)", margin: "0 0 20px" }}>
              Demo data — these addresses are placeholders until the Hub&apos;s real inboxes go live.
            </p>
            <ContactChannelList channels={CONTACT_CHANNELS} />
          </div>

          <ContactFormCard />
        </div>
      </Reveal>
    </div>
  );
}
