import React from "react";

const CSS = `
.oer-highlight { background: var(--brand-primary-subtle); color: inherit; border-radius: 2px; }
`;

let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "highlighttext");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}

/**
 * HighlightText — renders `text` with the first case-insensitive match of
 * `query` wrapped in a highlighted <mark>. Used by searchable FilterGroup
 * options so a typed query visibly matches the label, not just filters the
 * list. Renders `text` plain when `query` is empty or doesn't match.
 */
export function HighlightText({ text, query }) {
  useStyles();
  const q = (query || "").trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="oer-highlight">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}
