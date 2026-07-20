import React, { useState } from "react";
import { Input } from "../forms/Input.jsx";
import { Select } from "../forms/Select.jsx";
import { Button } from "../forms/Button.jsx";

const ROLE_OPTIONS = ["An educator", "An author", "A reviewer", "An institution", "Press / other"];

const CSS = `
.oer-contactform__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 479px) { .oer-contactform__row { grid-template-columns: 1fr; } }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "contactformcard");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * ContactFormCard — the Name/Email/role-select/Message form shell used by
 * both About's "Get in touch" and Community's "Join the community" sections,
 * per Figma's own `ContactFormCard` component.
 */
export function ContactFormCard({ roleOptions = ROLE_OPTIONS }) {
  useStyles();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
      {submitted ? (
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-default)", margin: 0 }}>
          Thanks — your message has been sent. The team will reply within two working days.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="oer-contactform__row">
            <Input label="Name" placeholder="Your name" required />
            <Input label="Email" type="email" placeholder="you@institution.edu" required />
          </div>
          <Select label="I'm reaching out as">
            {roleOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
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
  );
}
