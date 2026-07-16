import React from "react";
import { StatusBadge, SHORT_STATUS_LABEL } from "../feedback/StatusBadge.jsx";
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
.oer-rc__tagrow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.oer-rc__more { font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-medium); color: var(--text-brand); text-decoration: none; }
.oer-rc__more:hover { color: var(--text-brand-hover); }
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

// Per-rubric review pill row (Browse variant's footer) — one StatusBadge per
// rubric review, capped at 2 visible + a "+N more" link to the resource's own
// coverage table, per Figma's BrowseResourceCard.
function ReviewTagRow({ rubricReviews, href }) {
  const visible = rubricReviews.slice(0, 2);
  const overflow = rubricReviews.length - visible.length;
  return (
    <div className="oer-rc__tagrow">
      {visible.map((rr) => (
        <StatusBadge key={rr.rubric} status={rr.status}>
          {rr.rubric} · {SHORT_STATUS_LABEL[rr.status] || rr.status}
        </StatusBadge>
      ))}
      {overflow > 0 && (
        <a className="oer-rc__more" href={href}>
          More…
        </a>
      )}
    </div>
  );
}

/**
 * ResourceCard — composes StatusBadge, Badge and OutboundLink.
 *
 * `variant="featured"` (default) is the Home page's simple treatment: an
 * aggregated top-right StatusBadge + a plain review-count footer.
 * `variant="browse"` is Browse's richer treatment: no top-right badge, an
 * "· Updated {date}" byline, and a per-rubric ReviewTagRow footer instead of
 * the aggregated count.
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
  variant = "featured",
  updated = null,
  rubricReviews = null,
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
        {variant === "featured" && <StatusBadge status={status} />}
      </div>
      {href ? (
        <a className="oer-rc__title" href={href}>
          {title}
        </a>
      ) : (
        <h3 className="oer-rc__title">{title}</h3>
      )}
      {authors && (
        <div className="oer-rc__authors">
          {authors}
          {variant === "browse" && updated && ` · Updated ${updated}`}
        </div>
      )}
      {abstract && <p className="oer-rc__abstract">{abstract}</p>}
      <div className="oer-rc__foot">
        {variant === "browse" && rubricReviews ? (
          <ReviewTagRow rubricReviews={rubricReviews} href={href} />
        ) : (
          <span className="oer-rc__meta">
            {reviewCount != null
              ? `${reviewCount} peer review${reviewCount === 1 ? "" : "s"}`
              : ""}
          </span>
        )}
        {sourceHref && <OutboundLink href={sourceHref} variant="inline" />}
      </div>
    </article>
  );
}
