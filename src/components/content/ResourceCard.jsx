import React from "react";
import { StatusBadge } from "../feedback/StatusBadge.jsx";
import { Badge } from "../feedback/Badge.jsx";
import { OutboundLink } from "./OutboundLink.jsx";

const CSS = `
/* Feature-Card (Taupe) treatment: flat taupe fill, no border, no shadow at
   rest — separation comes from the color step against the eggshell canvas,
   not a drawn edge. Hover lifts with the system's near-invisible whisper
   shadow rather than darkening a border. */
.oer-rc {
  display: flex; flex-direction: column; gap: 12px; box-sizing: border-box;
  background: var(--surface-subtle); border: none;
  border-radius: var(--radius-lg); padding: 32px;
  box-shadow: none; transition: box-shadow 150ms var(--ease-out);
}
.oer-rc:hover { box-shadow: var(--shadow-subtle); }
.oer-rc__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.oer-rc__tags { display: flex; gap: 6px; flex-wrap: wrap; }
.oer-rc__title {
  font-family: var(--font-heading); font-weight: var(--weight-bold); font-size: 20px;
  line-height: 1.4; color: var(--text-default); margin: 0; text-decoration: none;
}
a.oer-rc__title:hover { color: var(--text-brand); }
.oer-rc__authors { font-family: var(--font-body); font-size: 14px; line-height: 1.5; color: var(--text-muted); }
.oer-rc__abstract {
  font-family: var(--font-body); font-size: 16px; line-height: 1.6; color: var(--text-default);
  margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.oer-rc__foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding-top: 14px; border-top: 1px solid var(--color-stone-strong); flex-wrap: wrap;
}
.oer-rc__meta { font-family: var(--font-label); font-size: 13px; color: var(--text-subtle); }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "resourcecard");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * ResourceCard — the browse-grid unit. Composes StatusBadge, Badge and
 * OutboundLink. `status` is a peer-review state.
 */
export function ResourceCard({
  title,
  href = null,
  authors,
  abstract,
  discipline = null,
  license = null,
  status = "peer_reviewed_revised",
  reviewCount = null,
  sourceHref = null,
  className = "",
  ...rest
}) {
  useStyles();
  return (
    <article className={`oer-rc ${className}`.trim()} {...rest}>
      <div className="oer-rc__top">
        <div className="oer-rc__tags">
          {discipline && <Badge variant="neutral">{discipline}</Badge>}
          {license && <Badge variant="brand">{license}</Badge>}
        </div>
        <StatusBadge status={status} />
      </div>
      {href ? (
        <a className="oer-rc__title" href={href}>
          {title}
        </a>
      ) : (
        <h3 className="oer-rc__title">{title}</h3>
      )}
      {authors && <div className="oer-rc__authors">{authors}</div>}
      {abstract && <p className="oer-rc__abstract">{abstract}</p>}
      <div className="oer-rc__foot">
        <span className="oer-rc__meta">
          {reviewCount != null
            ? `${reviewCount} peer review${reviewCount === 1 ? "" : "s"}`
            : ""}
        </span>
        {sourceHref && <OutboundLink href={sourceHref} variant="inline" />}
      </div>
    </article>
  );
}
