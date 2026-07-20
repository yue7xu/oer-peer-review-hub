import React from "react";

const CSS = `
.oer-logoph {
  width: 56px; height: 56px; border-radius: var(--radius-sm); background: var(--surface-default);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 15px;
  color: var(--text-subtle); letter-spacing: 0.02em; box-sizing: border-box; flex: none;
}
.oer-logoph--circle { border-radius: var(--radius-full); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "logoplaceholder");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * LogoPlaceholder — a plain eggshell square (or circle, via `shape="circle"`)
 * standing in for an institution or partner-project logo we don't have an
 * asset for yet. Shows the org's initials (or "?" for a fully generic
 * placeholder) — sized to match InstitutionCard's 56px real-logo frame so a
 * placeholder and a real logo sit at the same visual weight.
 */
export function LogoPlaceholder({ initials, shape = "square", className = "", ...rest }) {
  useStyles();
  return (
    <div
      className={`oer-logoph${shape === "circle" ? " oer-logoph--circle" : ""} ${className}`.trim()}
      {...rest}
    >
      {initials}
    </div>
  );
}
