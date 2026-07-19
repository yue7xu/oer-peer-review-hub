import React from "react";

const CSS = `
.oer-instcard {
  border-radius: var(--radius-lg); padding: 20px; display: flex; flex-direction: column; gap: 14px;
  align-items: flex-start; background: var(--surface-subtle); box-sizing: border-box; height: 100%;
}
.oer-instcard__logo-frame {
  width: 100%; height: 56px; display: flex; align-items: center; justify-content: flex-start;
}
.oer-instcard__logo { max-width: 100%; max-height: 100%; object-fit: contain; }
.oer-instcard__name {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 16px;
  line-height: 1.35; color: var(--text-default); margin: 0;
}

@media (max-width: 640px) {
  .oer-instcard { padding: 16px; gap: 12px; }
}
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
 * InstitutionCard — a partner organization's logo and name. Used by
 * Community's partner grid; logo/alt come from src/data/partners.js.
 */
export function InstitutionCard({ name, logo, alt = "", className = "", ...rest }) {
  useStyles();
  return (
    <div className={`oer-instcard ${className}`.trim()} {...rest}>
      <div className="oer-instcard__logo-frame">
        <img src={logo} alt={alt} className="oer-instcard__logo" />
      </div>
      <h3 className="oer-instcard__name">{name}</h3>
    </div>
  );
}
