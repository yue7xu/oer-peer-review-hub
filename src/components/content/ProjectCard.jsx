import React from "react";
import { LogoPlaceholder } from "./LogoPlaceholder.jsx";
import { Badge } from "../feedback/Badge.jsx";
import { OutboundLink } from "./OutboundLink.jsx";
import { injectStyles } from "../../lib/injectStyles.js";

/* Same card family as InstitutionCard.jsx — flat surface-subtle fill, no
   shadow, radius-lg, height:100% to fill its grid cell, logo-then-name
   vertical rhythm — so "Partner institutions" and "Related projects" read
   as one consistent card system rather than two different treatments. */
const CSS = `
.oer-projectcard {
  border-radius: var(--radius-lg); padding: 20px; display: flex; flex-direction: column; gap: 14px;
  align-items: flex-start; background: var(--surface-subtle); box-sizing: border-box; height: 100%;
}
.oer-projectcard__head { display: flex; flex-direction: column; gap: 2px; }
.oer-projectcard__name {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 18px;
  line-height: 1.3; color: var(--text-default); margin: 0;
}
.oer-projectcard__subtitle { font-family: var(--font-label); font-size: 13px; color: var(--text-muted); }
.oer-projectcard__desc { font-size: 14px; line-height: 1.6; color: var(--text-muted); margin: 0; }
.oer-projectcard__badges { display: flex; gap: 6px; flex-wrap: wrap; }

@media (max-width: 640px) {
  .oer-projectcard { padding: 16px; gap: 12px; }
}
`;

function useStyles() {
  injectStyles("projectcard", CSS);
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
  logoShape = "square",
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
      <LogoPlaceholder initials={initials} shape={logoShape} />
      <div className="oer-projectcard__head">
        <h3 className="oer-projectcard__name">{name}</h3>
        {subtitle && <div className="oer-projectcard__subtitle">{subtitle}</div>}
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
