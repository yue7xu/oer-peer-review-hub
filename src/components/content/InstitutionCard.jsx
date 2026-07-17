import React from "react";
import { LogoPlaceholder } from "./LogoPlaceholder.jsx";

const CSS = `
.oer-instcard {
  border-radius: var(--radius-lg); padding: 20px; display: flex; flex-direction: column; gap: 14px;
  background: var(--surface-subtle); box-sizing: border-box;
}
.oer-instcard__name {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 17px;
  line-height: 1.35; color: var(--text-default); margin: 0 0 4px;
}
.oer-instcard__location { font-size: 14px; color: var(--text-muted); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "institutioncard");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * InstitutionCard — a partner institution's logo placeholder, name, and
 * location. Used by Community's "Partner institutions" grid.
 */
export function InstitutionCard({ name, initials, location, className = "", ...rest }) {
  useStyles();
  return (
    <div className={`oer-instcard ${className}`.trim()} {...rest}>
      <LogoPlaceholder initials={initials} />
      <div>
        <h3 className="oer-instcard__name">{name}</h3>
        <div className="oer-instcard__location">{location}</div>
      </div>
    </div>
  );
}
