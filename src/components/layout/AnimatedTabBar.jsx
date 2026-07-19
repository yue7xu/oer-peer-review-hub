import React, { useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const CSS = `
.oer-tabbar { position: relative; display: flex; align-items: center; gap: 28px; }
.oer-tabbar__link {
  position: relative; padding: 4px 0; font-family: var(--font-label); font-size: 14px;
  font-weight: var(--weight-medium); color: var(--text-muted); text-decoration: none;
  transition: color var(--dur-short) var(--ease-out);
}
.oer-tabbar__link:hover { color: var(--text-default); }
.oer-tabbar__link--active { color: var(--text-default); }
.oer-tabbar__indicator {
  position: absolute; bottom: -6px; height: 2px; background: var(--brand-primary);
  border-radius: var(--radius-full); pointer-events: none;
  transition: left var(--dur-med) var(--ease-out), width var(--dur-med) var(--ease-out), opacity var(--dur-short) var(--ease-out);
}
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "animatedtabbar");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * AnimatedTabBar — an underline-style tab list whose active indicator
 * slides between tabs. Indicator position/width are measured from the
 * active tab's actual DOM rect (not guessed from index/font metrics), so it
 * tracks real layout — including variable label widths and font loading —
 * and animates via CSS transitions on `left`/`width` rather than a JS
 * animation loop.
 */
export function AnimatedTabBar({ links, className = "", ...rest }) {
  useStyles();
  const location = useLocation();
  const containerRef = useRef(null);
  const linkRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const activeTo = links.find((link) => location.pathname === link.to)?.to;

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const activeEl = activeTo && linkRefs.current[activeTo];
      if (!container || !activeEl) {
        setIndicator((prev) => ({ ...prev, ready: false }));
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setIndicator({ left: activeRect.left - containerRect.left, width: activeRect.width, ready: true });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTo]);

  return (
    <nav className={`oer-tabbar ${className}`.trim()} ref={containerRef} {...rest}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          ref={(el) => {
            linkRefs.current[link.to] = el;
          }}
          className={({ isActive }) => `oer-tabbar__link${isActive ? " oer-tabbar__link--active" : ""}`}
        >
          {link.label}
        </NavLink>
      ))}
      <span
        className="oer-tabbar__indicator"
        style={{ left: indicator.left, width: indicator.width, opacity: indicator.ready ? 1 : 0 }}
        aria-hidden="true"
      />
    </nav>
  );
}
