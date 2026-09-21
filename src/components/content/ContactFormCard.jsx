import React, { useId, useState } from "react";
import { Input } from "../forms/Input.jsx";
import { Select } from "../forms/Select.jsx";
import { Button } from "../forms/Button.jsx";
import { injectStyles } from "../../lib/injectStyles.js";
import { CONTACT_FORM_RECIPIENT } from "../../data/contact.js";

const ROLE_OPTIONS = ["An educator", "An author", "A reviewer", "An institution", "Press / other"];

const CSS = `
.oer-contactform__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 479px) { .oer-contactform__row { grid-template-columns: 1fr; } }
`;

function useStyles() {
  injectStyles("contactformcard", CSS);
}

function buildMailto({ name, email, role, message }) {
  const subject = `OER Peer Review Hub — message from ${name} (${role})`;
  const body = `${message}\n\n—\nName: ${name}\nEmail: ${email}\nReaching out as: ${role}`;
  return `mailto:${CONTACT_FORM_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * ContactFormCard — the Name/Email/role-select/Message form shell used by
 * both About's "Get in touch" and Community's "Join the community" sections,
 * per Figma's own `ContactFormCard` component. There is no backend: submitting
 * opens the visitor's mail client with a pre-filled message to
 * CONTACT_FORM_RECIPIENT, so the confirmation copy must not claim it was sent.
 */
export function ContactFormCard({ roleOptions = ROLE_OPTIONS }) {
  useStyles();
  const [mailtoHref, setMailtoHref] = useState(null);
  const uid = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const href = buildMailto({
      name: data.get("name"),
      email: data.get("email"),
      role: data.get("role"),
      message: data.get("message"),
    });
    setMailtoHref(href);
    window.location.href = href;
  };

  return (
    <div
      style={{
        background: "var(--surface-default)",
        boxShadow: "var(--shadow-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 32,
      }}
    >
      {mailtoHref ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-default)", margin: 0 }}>
            Your email app should have opened with your message ready to send. Press send there to
            reach the team.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
            Nothing happened? <a href={mailtoHref}>Open it again</a>, or write to{" "}
            <a href={`mailto:${CONTACT_FORM_RECIPIENT}`}>{CONTACT_FORM_RECIPIENT}</a> directly.
          </p>
          <div>
            <Button variant="secondary" size="md" type="button" onClick={() => setMailtoHref(null)}>
              Edit message
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="oer-contactform__row">
            <Input id={`${uid}-name`} name="name" label="Name" placeholder="Your name" required />
            <Input id={`${uid}-email`} name="email" label="Email" type="email" placeholder="you@institution.edu" required />
          </div>
          <Select id={`${uid}-role`} name="role" label="I'm reaching out as">
            {roleOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </Select>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor={`${uid}-message`}
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
              id={`${uid}-message`}
              name="message"
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
  );
}
