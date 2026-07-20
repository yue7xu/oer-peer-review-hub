// Shared marketing/content-page layout primitives — container gutter,
// section rhythm, and responsive heading scale. Promotes the pattern
// docs/design/RESPONSIVE_BEHAVIOR.md flags as a real, currently-missing gap
// (fixed 32px gutter and fixed-px headings with no narrower-viewport
// override anywhere in the codebase) into one reusable place instead of
// repeating the same CSS block per page.
import { injectStyles } from "../lib/injectStyles.js";

const CSS = `
.oer-page .oer-container { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
@media (max-width: 899px) { .oer-page .oer-container { padding: 0 24px; } }
@media (max-width: 639px) { .oer-page .oer-container { padding: 0 16px; } }

.oer-page .oer-section-y { padding-top: 72px; padding-bottom: 72px; }
@media (max-width: 899px) { .oer-page .oer-section-y { padding-top: 56px; padding-bottom: 56px; } }
@media (max-width: 639px) { .oer-page .oer-section-y { padding-top: 40px; padding-bottom: 40px; } }

.oer-page .oer-eyebrow {
  font-family: var(--font-label); font-size: 13px; font-weight: var(--weight-medium);
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--brand-secondary); margin-bottom: 16px;
}

.oer-page .oer-h1 {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 40px;
  line-height: 1.1; letter-spacing: -0.02em; color: var(--text-default); margin: 0 0 20px;
  overflow-wrap: anywhere; min-width: 0;
}
@media (max-width: 899px) { .oer-page .oer-h1 { font-size: 34px; } }
@media (max-width: 639px) { .oer-page .oer-h1 { font-size: 28px; } }

.oer-page .oer-h2 {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 32px;
  line-height: 1.2; letter-spacing: -0.01em; color: var(--text-default); margin: 0 0 8px;
  overflow-wrap: anywhere; min-width: 0;
}
@media (max-width: 899px) { .oer-page .oer-h2 { font-size: 28px; } }
@media (max-width: 639px) { .oer-page .oer-h2 { font-size: 24px; } }

.oer-page .oer-h3 {
  font-family: var(--font-heading); font-weight: var(--weight-display); font-size: 20px;
  line-height: 1.4; color: var(--text-default); margin: 0 0 8px; overflow-wrap: anywhere; min-width: 0;
}
@media (max-width: 639px) { .oer-page .oer-h3 { font-size: 18px; } }
`;

export function usePageLayoutStyles() {
  injectStyles("pagelayout", CSS);
}
