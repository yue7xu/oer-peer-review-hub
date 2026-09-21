import React, { useState } from "react";
import { StatusBadge, SHORT_STATUS_LABEL } from "../feedback/StatusBadge.jsx";
import { Badge } from "../feedback/Badge.jsx";
import { OutboundLink } from "./OutboundLink.jsx";

const CSS = `
/* Feature-Card (Taupe) treatment: flat taupe fill, no border, no shadow at
   rest — separation comes from the color step against the eggshell canvas,
   not a drawn edge. Hover lifts with the system's near-invisible whisper
   shadow rather than darkening a border. */
.oer-rc {
  display: flex; align-items: stretch; gap: 24px; box-sizing: border-box;
  background: var(--surface-subtle); border: none;
  border-radius: var(--radius-lg); padding: 32px;
  box-shadow: none; transition: box-shadow 150ms var(--ease-out);
}
.oer-rc:hover { box-shadow: var(--shadow-subtle); }
/* Cover slot (Browse only): one fixed 120x160 (3:4) box for every book regardless of
   source platform, so Pressbooks and OpenStax covers render identically.
   Images crop to fill (object-fit), never stretch. The placeholder occupies the
   same box, so a card without a cover keeps the same layout. */
.oer-rc__cover {
  flex: none; display: block; width: 120px; height: 160px; align-self: flex-start;
  border-radius: var(--radius-md); overflow: hidden; background: var(--color-stone);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, var(--shadow-inset-hairline);
}
.oer-rc__cover img { display: block; width: 100%; height: 100%; object-fit: cover; }
.oer-rc__cover--empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  box-shadow: var(--shadow-inset-hairline);
}
.oer-rc__cover--empty svg { width: 32px; height: 32px; }
.oer-rc__cover--empty span { font-family: var(--font-label); font-size: 12px; font-weight: var(--weight-medium); color: var(--text-muted); }
/* Everything that used to be the card's direct children now lives here, with
   the same 12px rhythm the card had before; min-width:0 lets long titles wrap
   instead of pushing the card wider than its column. */
.oer-rc__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
/* The cover takes 144px (120 + 24 gap) from the text column, so the abstract
   gets one extra line to show at least as much text as it did before. */
.oer-rc--cover .oer-rc__abstract { -webkit-line-clamp: 4; }
/* Tags, title and authors: the part that sits beside the cover on phones. */
.oer-rc__head { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.oer-rc__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.oer-rc__tags { display: flex; gap: 6px; flex-wrap: wrap; }
.oer-rc__title {
  font-family: var(--font-heading); font-weight: var(--weight-bold); font-size: 20px;
  line-height: 1.4; color: var(--text-default); margin: 0; text-decoration: none;
}
a.oer-rc__title:hover { color: var(--text-brand); }
.oer-rc__title, .oer-rc__authors { overflow-wrap: anywhere; }
.oer-rc__authors { font-family: var(--font-body); font-size: 14px; line-height: 1.5; color: var(--text-muted); }
.oer-rc__abstract {
  font-family: var(--font-body); font-size: 16px; line-height: 1.6; color: var(--text-default);
  margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.oer-rc__foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding-top: 14px; border-top: 1px solid var(--color-stone-strong); flex-wrap: wrap;
  margin-top: auto; /* pin to the card bottom when the cover makes the card taller than its text */
}
.oer-rc__meta { font-family: var(--font-label); font-size: 13px; color: var(--text-subtle); }
.oer-rc__tagrow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.oer-rc__more { font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-medium); color: var(--text-brand); text-decoration: none; }
.oer-rc__more:hover { color: var(--text-brand-hover); }
@media (max-width: 639px) {
  .oer-rc { padding: 20px; }
}
/* Narrow screens (phone / portrait tablet): a cover beside the whole text
   column leaves only ~170px for it, so the cover shrinks (still one 3:4 size
   for every card) and sits beside the header only; the abstract and footer run
   the full card width underneath. The body is flattened with display:contents
   so its children become grid items. Badges and status pills may wrap here:
   they are nowrap, so a long discipline name overflows the narrower header
   column and a long rubric pill overflows a 320px card. */
@media (max-width: 767px) {
  .oer-rc--cover { display: grid; grid-template-columns: 96px minmax(0, 1fr); column-gap: 16px; row-gap: 12px; }
  .oer-rc--cover .oer-rc__body { display: contents; }
  .oer-rc--cover .oer-rc__cover { width: 96px; height: 128px; grid-column: 1; grid-row: 1; }
  .oer-rc--cover .oer-rc__head { grid-column: 2; grid-row: 1; }
  .oer-rc--cover .oer-rc__tags .oer-badge { white-space: normal; }
  .oer-rc--cover .oer-rc__tagrow .oer-status { max-width: 100%; white-space: normal; line-height: 1.25; padding-top: 4px; padding-bottom: 4px; }
  .oer-rc--cover .oer-rc__abstract { grid-column: 1 / -1; -webkit-line-clamp: 3; }
  .oer-rc--cover .oer-rc__foot { grid-column: 1 / -1; margin-top: 0; }
}
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

// Book cover for the Browse variant. Falls back to the same-size placeholder
// when there's no URL or the image fails to load (dead hotlink, blocked host).
function Cover({ src, href }) {
  const [failed, setFailed] = useState(false);
  const hasImage = src && !failed;
  const inner = hasImage ? (
    <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
  ) : (
    <>
      <svg viewBox="0 0 32 32" fill="none" stroke="var(--color-ash)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 5.5A2.5 2.5 0 0 1 8.5 3H25v21H8.5A2.5 2.5 0 0 0 6 26.5v-21Z" />
        <path d="M6 26.5A2.5 2.5 0 0 0 8.5 29H25v-5" />
        <path d="M12 9h8" />
      </svg>
      <span>No cover</span>
    </>
  );
  const className = `oer-rc__cover${hasImage ? "" : " oer-rc__cover--empty"}`;
  // Decorative: the adjacent title link already names the resource, so the
  // cover repeats its destination but stays out of the tab order / a11y tree.
  return href ? (
    <a className={className} href={href} tabIndex={-1} aria-hidden="true">
      {inner}
    </a>
  ) : (
    <div className={className} aria-hidden="true">
      {inner}
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
 * the aggregated count. It also reserves a fixed cover slot on the left
 * (`coverUrl`, or a same-size placeholder when null).
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
  coverUrl = null,
  className = "",
  ...rest
}) {
  useStyles();
  return (
    <article className={`oer-rc${variant === "browse" ? " oer-rc--cover" : ""} ${className}`.trim()} {...rest}>
      {variant === "browse" && <Cover src={coverUrl} href={href} />}
      <div className="oer-rc__body">
        <div className="oer-rc__head">
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
        </div>
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
      </div>
    </article>
  );
}
