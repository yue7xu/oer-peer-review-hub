import React from "react";
import { LogoPlaceholder } from "./LogoPlaceholder.jsx";
import { Badge } from "../feedback/Badge.jsx";
import { OutboundLink } from "./OutboundLink.jsx";

const CSS = `
.oer-projectcard {
  flex: 1 1 380px; max-width: 587px; box-sizing: border-box;
  background: var(--surface-default); box-shadow: var(--shadow-subtle); border-radius: var(--radius-lg);
  padding: 32px; display: flex; flex-direction: column; gap: 20px;
}
.oer-projectcard__head { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.oer-projectcard__logo { width: 120px; flex: none; }
.oer-projectcard__name {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 24px;
  line-height: 1.25; color: var(--text-default); margin: 0 0 4px;
}
.oer-projectcard__subtitle { font-family: var(--font-label); font-size: 14px; color: var(--text-muted); }
.oer-projectcard__desc { font-size: 16px; line-height: 1.6; color: var(--text-muted); margin: 0; }
.oer-projectcard__badges { display: flex; gap: 8px; flex-wrap: wrap; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "projectcard");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * ProjectCard — a partner project's logo placeholder, name/subtitle,
 * description, affiliated-institution badges, and an optional outbound
 * link. Badges and the link are omitted when not supplied — the honest
 * rendering for a generic "not yet a real project" placeholder card, per
 * Community's "Related projects" section.
 */
export function ProjectCard({
  initials = "?",
  name,
  subtitle,
  description,
  badges = null,
  linkHref = null,
  linkLabel = null,
  className = "",
  ...rest
}) {
  useStyles();
  return (
    <div className={`oer-projectcard ${className}`.trim()} {...rest}>
      <div className="oer-projectcard__head">
        <div className="oer-projectcard__logo">
          <LogoPlaceholder initials={initials} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 className="oer-projectcard__name">{name}</h3>
          {subtitle && <div className="oer-projectcard__subtitle">{subtitle}</div>}
        </div>
      </div>
      {description && <p className="oer-projectcard__desc">{description}</p>}
      {badges && badges.length > 0 && (
        <div className="oer-projectcard__badges">
          {badges.map((b) => (
            <Badge key={b} variant="neutral">
              {b}
            </Badge>
          ))}
        </div>
      )}
      {linkHref && (
        <div>
          <OutboundLink href={linkHref} variant="inline">
            {linkLabel}
          </OutboundLink>
        </div>
      )}
    </div>
  );
}
