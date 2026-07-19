import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../forms/Button.jsx";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/solution", label: "How It Works" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
];

// Top Nav Bar — transparent on the eggshell canvas, no sticky behavior, no
// background fill until the page has real content behind it. 50px height.
export function Header() {
  return (
    <header
      style={{
        background: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 64px",
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <NavLink
          to="/"
          style={{
            fontFamily: "var(--font-label)",
            fontWeight: "var(--weight-medium)",
            fontSize: 16,
            color: "var(--text-default)",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          OER Peer Review Hub
        </NavLink>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontFamily: "var(--font-label)",
            fontSize: 14,
          }}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              style={({ isActive }) => ({
                color: isActive ? "var(--text-default)" : "var(--text-muted)",
                fontWeight: "var(--weight-medium)",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button variant="secondary" size="md" href="/">
            Login
          </Button>
          <Button variant="primary" size="md" href="/">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
