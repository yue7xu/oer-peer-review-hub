import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../forms/Button.jsx";
import { AnimatedTabBar } from "./AnimatedTabBar.jsx";

const NAV_LINKS = [
  { to: "/browse", label: "Browse" },
  { to: "/solution", label: "Solution" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
];

const CSS = `
.oer-header {
  position: sticky; top: 0; z-index: 40;
  background: transparent; border-bottom: 1px solid transparent;
  transition: background 150ms var(--ease-out), border-color 150ms var(--ease-out);
}
.oer-header--scrolled {
  background: color-mix(in srgb, var(--surface-default) 92%, transparent);
  border-bottom-color: var(--border-default);
  backdrop-filter: blur(8px);
}
.oer-header__inner {
  max-width: 1280px; margin: 0 auto; padding: 0 64px; height: 50px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
}
.oer-header__wordmark {
  font-family: var(--font-label); font-weight: var(--weight-medium); font-size: 16px;
  color: var(--text-default); letter-spacing: -0.01em; white-space: nowrap;
}
.oer-header__desktop-nav { display: flex; align-items: center; gap: 24px; }
.oer-header__burger {
  display: none; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: var(--radius-md); border: 1px solid transparent;
  background: transparent; cursor: pointer; flex: none;
}
.oer-header__burger:focus-visible { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
.oer-header__burger-bar {
  display: block; width: 18px; height: 1.6px; background: var(--text-default);
  margin: 3.5px auto; border-radius: 1px; transition: transform 150ms var(--ease-out), opacity 150ms var(--ease-out);
}

.oer-header__backdrop {
  position: fixed; inset: 0; background: var(--surface-overlay); opacity: 0;
  transition: opacity 300ms var(--ease-out); pointer-events: none; z-index: 45;
}
.oer-header__backdrop--open { opacity: 0.4; pointer-events: auto; }

.oer-header__drawer {
  position: fixed; top: 0; right: 0; bottom: 0; width: 360px; max-width: 100%;
  background: var(--surface-default); box-shadow: var(--shadow-subtle);
  transform: translateX(100%); transition: transform 300ms var(--ease-out);
  z-index: 46; display: flex; flex-direction: column; padding: 20px 24px 32px;
  overflow-y: auto;
}
.oer-header__drawer--open { transform: translateX(0); }
.oer-header__drawer-head { display: flex; justify-content: flex-end; margin-bottom: 24px; }
.oer-header__drawer-close {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-md); border: none; background: transparent; cursor: pointer;
}
.oer-header__drawer-close:focus-visible { outline: 2px solid var(--interactive-focus); outline-offset: 2px; }
.oer-header__drawer-links { display: flex; flex-direction: column; gap: 4px; margin-bottom: 24px; }
.oer-header__drawer-link {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 22px;
  color: var(--text-default); padding: 10px 0; border-bottom: 1px solid var(--border-default);
}
.oer-header__drawer-divider { border: none; border-top: 1px solid var(--border-default); margin: 0 0 20px; }
.oer-header__drawer-actions { display: flex; flex-direction: column; gap: 10px; }
.oer-header__drawer-actions .oer-btn { width: 100%; }

@media (max-width: 899px) {
  .oer-header__desktop-nav { display: none; }
  .oer-header__burger { display: inline-flex; }
}
@media (max-width: 639px) {
  .oer-header__drawer { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .oer-header__drawer, .oer-header__backdrop, .oer-header { transition: none; }
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "header");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

function BurgerIcon() {
  return (
    <span aria-hidden="true">
      <span className="oer-header__burger-bar" />
      <span className="oer-header__burger-bar" />
      <span className="oer-header__burger-bar" />
    </span>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// Top Nav Bar — transparent at rest, gains a soft blurred surface once the
// page scrolls past 24px so nav content stays legible over any section it
// crosses. Below 900px, the inline nav/auth buttons collapse into a
// hamburger-triggered drawer (full-screen under 640px, partial-width above
// it) since there is no room for four links + two pill buttons at that width.
export function Header() {
  useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const burgerRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll(
      'a[href], button:not([disabled])',
    );
    focusable?.[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    burgerRef.current?.focus();
  };

  return (
    <header className={`oer-header${scrolled ? " oer-header--scrolled" : ""}`}>
      <div className="oer-header__inner">
        <NavLink to="/" className="oer-header__wordmark">
          OER Peer Review Hub
        </NavLink>
        <div className="oer-header__desktop-nav">
          <AnimatedTabBar links={NAV_LINKS} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="secondary" size="md" href="/">
              Login
            </Button>
            <Button variant="primary" size="md" href="/">
              Sign up
            </Button>
          </div>
        </div>
        <button
          ref={burgerRef}
          type="button"
          className="oer-header__burger"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="oer-mobile-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <BurgerIcon />
        </button>
      </div>

      <div
        className={`oer-header__backdrop${drawerOpen ? " oer-header__backdrop--open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <nav
        id="oer-mobile-drawer"
        ref={drawerRef}
        className={`oer-header__drawer${drawerOpen ? " oer-header__drawer--open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div className="oer-header__drawer-head">
          <button type="button" className="oer-header__drawer-close" aria-label="Close menu" onClick={closeDrawer}>
            <CloseIcon />
          </button>
        </div>
        <div className="oer-header__drawer-links">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className="oer-header__drawer-link" onClick={closeDrawer}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <hr className="oer-header__drawer-divider" />
        <div className="oer-header__drawer-actions">
          <Button variant="secondary" size="lg" href="/" onClick={closeDrawer}>
            Login
          </Button>
          <Button variant="primary" size="lg" href="/" onClick={closeDrawer}>
            Sign up
          </Button>
        </div>
      </nav>
    </header>
  );
}
