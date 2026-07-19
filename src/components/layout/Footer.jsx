import React from "react";
import { Link } from "react-router-dom";

// Compact single band — warm stone surface, hairline top rule, ink/graphite
// type. Replaces the previous near-black block: this system never uses
// pure-black surface fills, only ink text on warm neutral surfaces.
export function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface-subtle)",
        borderTop: "1px solid var(--border-default)",
        color: "var(--text-muted)",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 64px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
          }}
        >
          <div style={{ maxWidth: 280 }}>
            <div
              style={{
                fontFamily: "var(--font-label)",
                fontWeight: "var(--weight-medium)",
                fontSize: 16,
                color: "var(--text-default)",
                marginBottom: 12,
              }}
            >
              OER Peer Review Hub
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
              A transparent, community-run peer review library for open educational resources.
            </p>
          </div>
          <div>
            <div style={footerHeadingStyle}>Explore</div>
            <div style={footerLinksStyle}>
              <Link to="/browse" style={footerLinkStyle}>
                Browse resources
              </Link>
              <Link to="/solution" style={footerLinkStyle}>
                How peer review works
              </Link>
              <Link to="/solution" style={footerLinkStyle}>
                Our process
              </Link>
            </div>
          </div>
          <div>
            <div style={footerHeadingStyle}>For</div>
            <div style={footerLinksStyle}>
              <span style={footerLinkStyle}>Authors</span>
              <span style={footerLinkStyle}>Reviewers</span>
              <span style={footerLinkStyle}>Coordinators</span>
            </div>
          </div>
          <div>
            <div style={footerHeadingStyle}>About</div>
            <div style={footerLinksStyle}>
              <Link to="/community" style={footerLinkStyle}>
                Partner
              </Link>
              <span style={footerLinkStyle}>Team</span>
              <Link to="/about" style={footerLinkStyle}>
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border-default)",
            marginTop: 32,
            paddingTop: 20,
          }}
        >
          <a href="#top" style={{ ...footerLinkStyle, fontSize: 13 }}>
            Back to top
          </a>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              fontFamily: "var(--font-label)",
              fontSize: 13,
              color: "var(--text-subtle)",
            }}
          >
            <span>© 2026 OER Peer Review Hub</span>
            <span>Content licensed CC BY 4.0 unless noted</span>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="#" style={footerLinkStyle}>
                Online Terms of Service
              </a>
              <a href="#" style={footerLinkStyle}>
                Privacy Statement
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerHeadingStyle = {
  fontFamily: "var(--font-label)",
  fontSize: 12,
  fontWeight: "var(--weight-medium)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-subtle)",
  marginBottom: 14,
};

const footerLinksStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  fontFamily: "var(--font-label)",
  fontSize: 14,
};

const footerLinkStyle = { color: "var(--text-muted)" };
