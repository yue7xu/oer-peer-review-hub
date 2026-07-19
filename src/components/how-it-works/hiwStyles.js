/**
 * Page-local layout for How It Works (/solution).
 * Visual language matches Home / About / Community (design.md tokens).
 * Structure & interaction remain prototype-driven.
 */
export const HIW_CSS = `
.hiw-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}
.hiw-hero {
  background: var(--surface-subtle);
  border-bottom: 1px solid var(--border-default);
}
.hiw-hero__inner {
  padding: 72px 32px 80px;
  max-width: 1280px;
  margin: 0 auto;
}
.hiw-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
  gap: 40px 40px;
  align-items: center;
}
.hiw-hero__copy {
  min-width: 0;
}
.hiw-hero__demo {
  min-width: 0;
}
.hiw-eyebrow {
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand-secondary);
  margin-bottom: 16px;
}
.hiw-h1 {
  font-family: var(--font-heading);
  font-weight: var(--weight-display);
  font-size: 40px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-default);
  margin: 0 0 20px;
  max-width: 34ch;
}
.hiw-lede {
  font-size: 18px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0;
  max-width: 42ch;
}
.hiw-hero__cta {
  margin-top: 28px;
}

/* ---- Review Console demo (hero) ---- */
.hiw-demo {
  --hiw-demo-accent: var(--feedback-success-icon);
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--surface-default);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-subtle);
  width: 100%;
  min-height: 280px;
}
.hiw-demo__media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--surface-subtle);
  border: 0;
}
.hiw-demo__media--hidden {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.hiw-demo-mock {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  height: 100%;
  min-height: 0;
}
.hiw-demo-mock__pane {
  padding: 16px 18px;
  min-width: 0;
  overflow: hidden;
}
.hiw-demo-mock__pane--oer {
  border-right: 1px solid var(--border-default);
}
.hiw-demo-mock__pane-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
  margin-bottom: 10px;
}
.hiw-demo-mock__passage {
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0;
}
.hiw-demo-mock__hl {
  background: transparent;
  color: inherit;
  padding: 0 2px;
  border-radius: 2px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  transition: background 400ms var(--ease-out), color 400ms var(--ease-out);
}
.hiw-demo-mock--play .hiw-demo-mock__hl--1 {
  background: var(--color-sage-bg);
  color: var(--text-default);
  transition-delay: 120ms;
}
.hiw-demo-mock--play .hiw-demo-mock__hl--2 {
  background: var(--color-sage-bg);
  color: var(--text-default);
  transition-delay: 420ms;
}
.hiw-demo-mock__criterion {
  font-family: var(--font-label);
  font-size: 12px;
  font-weight: var(--weight-medium);
  color: var(--text-default);
  margin-bottom: 12px;
  line-height: 1.4;
}
.hiw-demo-mock__bank {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hiw-demo-mock__note {
  background: var(--surface-subtle);
  border-radius: 10px;
  padding: 10px 12px;
  border-left: 2px solid var(--hiw-demo-accent);
  opacity: 0;
  transform: translateX(12px);
  transition: opacity 450ms var(--ease-out), transform 450ms var(--ease-out);
}
.hiw-demo-mock--play .hiw-demo-mock__note--1 {
  opacity: 1;
  transform: none;
  transition-delay: 520ms;
}
.hiw-demo-mock--play .hiw-demo-mock__note--2 {
  opacity: 1;
  transform: none;
  transition-delay: 780ms;
}
.hiw-demo-mock__note-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--hiw-demo-accent);
  margin-bottom: 4px;
}
.hiw-demo-mock__note p {
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--text-muted);
  margin: 0;
}

/* ---- process section intro (below hero) ---- */
.hiw-process-intro {
  max-width: 720px;
  margin-bottom: 40px;
}
.hiw-process-heading {
  font-family: var(--font-heading);
  font-weight: var(--weight-display);
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--text-default);
  margin: 0 0 12px;
}
.hiw-process-lede {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
}

/* ---- controls ---- */
.hiw-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  margin-top: 28px;
}
.hiw-toggle {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}
.hiw-toggle-hint {
  font-family: var(--font-label);
  font-size: 13px;
  color: var(--text-subtle);
}
.hiw-backstage {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 720px;
}
.hiw-backstage__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-subtle);
  flex: none;
  margin-top: 8px;
}

/* ---- spine ---- */
.hiw-section {
  padding: 72px 0;
}
.hiw-section--band {
  background: var(--surface-subtle);
  border-top: 1px solid var(--border-default);
  border-bottom: 1px solid var(--border-default);
}
.hiw-spine {
  position: relative;
  margin-top: 8px;
}
.hiw-spine::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--border-default);
  transform: translateX(-50%);
}
.hiw-progress {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 1px;
  height: 0;
  background: var(--color-graphite);
  transform: translateX(-50%);
  pointer-events: none;
}
.hiw-progress-dot {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--text-default);
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}
.hiw-spine.go .hiw-progress-dot { opacity: 1; }

.hiw-row {
  position: relative;
  display: flex;
  margin-bottom: 32px;
}
.hiw-row:last-child { margin-bottom: 0; }
.hiw-row--left { justify-content: flex-start; }
.hiw-row--right { justify-content: flex-end; }
.hiw-node {
  position: absolute;
  left: 50%;
  top: 28px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--surface-default);
  border: 1.5px solid var(--border-strong);
  transform: translateX(-50%);
  z-index: 2;
  transition: background 400ms var(--ease-out), border-color 400ms var(--ease-out);
}
.hiw-row.in .hiw-node {
  background: var(--text-default);
  border-color: var(--text-default);
}

.hiw-card {
  --hiw-focus: 0;
  --hiw-focus-amp: 1;
  width: calc(50% - 40px);
  background: var(--surface-subtle);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
  box-sizing: border-box;
  /* Active-card focus: lift / scale / shadow — driven by --hiw-focus (0–1).
     Applied on the card so it layers on top of the row's slide-in reveal. */
  transform: translate3d(
      0,
      calc(var(--hiw-focus) * -6px * var(--hiw-focus-amp)),
      0
    )
    scale(calc(0.988 + var(--hiw-focus) * 0.032 * var(--hiw-focus-amp)));
  box-shadow:
    0 calc(1px + var(--hiw-focus) * 10px * var(--hiw-focus-amp))
      calc(3px + var(--hiw-focus) * 28px * var(--hiw-focus-amp))
      rgba(0, 0, 0, calc(0.025 + var(--hiw-focus) * 0.07 * var(--hiw-focus-amp))),
    0 0 0 1px rgba(0, 0, 0, calc(0.02 + var(--hiw-focus) * 0.02));
  filter: brightness(calc(0.975 + var(--hiw-focus) * 0.025));
  will-change: transform, box-shadow;
  position: relative;
  z-index: 1;
}
.hiw-spine.anim .hiw-row { opacity: 0; }
.hiw-spine.anim .hiw-row--left { transform: translateX(-28px); }
.hiw-spine.anim .hiw-row--right { transform: translateX(28px); }
.hiw-spine.anim .hiw-row.in {
  opacity: 1;
  transform: none;
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
}

.hiw-c-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.hiw-rolepill {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: var(--weight-medium);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.hiw-rd {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}
.hiw-rd--author { background: var(--text-default); }
.hiw-rd--reviewer {
  background: var(--surface-default);
  border: 1px solid var(--text-default);
}
.hiw-rd--public { background: var(--text-muted); }
.hiw-num {
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: var(--weight-semibold);
  color: var(--text-subtle);
}
.hiw-card h3 {
  font-family: var(--font-heading);
  font-weight: var(--weight-display);
  font-size: 20px;
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin: 14px 0 0;
  color: var(--text-default);
}
.hiw-card h3 .hiw-opt {
  font-size: 15px;
  color: var(--text-muted);
  letter-spacing: 0;
}
.hiw-desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 8px 0 0;
}
.hiw-divider {
  height: 1px;
  background: var(--border-default);
  margin-top: 18px;
}
.hiw-list {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hiw-list li {
  display: flex;
  gap: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-muted);
}
.hiw-list li::before {
  content: "";
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-subtle);
  margin-top: 10px;
  flex: none;
}
.hiw-status-wrap { margin-top: 14px; }

.hiw-spine.anim .hiw-row .hiw-status-wrap {
  opacity: 0;
  transform: scale(0.94);
}
.hiw-spine.anim .hiw-row.in .hiw-status-wrap {
  opacity: 1;
  transform: scale(1);
  transition: opacity 450ms var(--ease-out) 200ms, transform 450ms var(--ease-out) 200ms;
}

.hiw-jump {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: var(--weight-medium);
  color: var(--text-default);
  text-decoration: none;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-full);
  padding: 8px 14px;
  background: var(--surface-default);
  transition: border-color 150ms var(--ease-out), background 150ms var(--ease-out);
  cursor: pointer;
}
.hiw-jump:hover {
  border-color: var(--text-default);
  background: var(--surface-subtle);
}
.hiw-jump:focus-visible {
  outline: 2px solid var(--interactive-focus);
  outline-offset: 2px;
}
.hiw-jump__ar { transition: transform 150ms var(--ease-out); }
.hiw-jump:hover .hiw-jump__ar { transform: translateY(2px); }

/* role filter */
.hiw-spine.filter-author .hiw-row.in:not(.hiw-row--author),
.hiw-spine.filter-reviewer .hiw-row.in:not(.hiw-row--reviewer),
.hiw-spine.filter-author .hiw-row:not(.hiw-row--author),
.hiw-spine.filter-reviewer .hiw-row:not(.hiw-row--reviewer) {
  opacity: 0.34;
  transition: opacity 300ms var(--ease-out);
}
.hiw-spine.filter-author .hiw-row--author .hiw-node,
.hiw-spine.filter-reviewer .hiw-row--reviewer .hiw-node {
  background: var(--text-default);
  border-color: var(--text-default);
}

/* ---- rubric method ---- */
.hiw-sec-eye {
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: var(--weight-medium);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--brand-secondary);
  margin-bottom: 12px;
}
.hiw-sec-h {
  font-family: var(--font-heading);
  font-weight: var(--weight-display);
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0 0 12px;
  color: var(--text-default);
}
.hiw-method-lede {
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 700px;
  margin: 0;
}
.hiw-rubset {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}
/* Disclosure: height on shell, content beats fade/rise separately */
.hiw-rubpanel-shell {
  overflow: hidden;
  height: 0;
  margin-top: 0;
  transition:
    height 480ms cubic-bezier(0.22, 1, 0.36, 1),
    margin-top 480ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hiw-rubpanel-shell.is-open {
  margin-top: 16px;
}
.hiw-rubpanel {
  background: var(--surface-default);
  border-radius: var(--radius-lg);
  padding: 28px 32px;
}
.hiw-rubpanel__beat {
  opacity: 0;
  transform: translate3d(0, 8px, 0);
  transition:
    opacity 160ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 160ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hiw-rubpanel.is-visible .hiw-rubpanel__beat {
  opacity: 1;
  transform: none;
  transition-duration: 420ms;
}
.hiw-rubpanel.is-visible .hiw-rubpanel__beat--1 {
  transition-delay: 0ms;
}
.hiw-rubpanel.is-visible .hiw-rubpanel__beat--2 {
  transition-delay: 55ms;
}
.hiw-rubpanel.is-visible .hiw-rubpanel__beat--3 {
  transition-delay: 110ms;
}
.hiw-rubpanel:not(.is-visible) .hiw-rubpanel__beat {
  transition-delay: 0ms;
}
.hiw-rubpanel__summary {
  font-size: 16px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0 0 20px;
  max-width: 720px;
}
.hiw-rubpanel__covers-block {
  margin: 0;
}
.hiw-rubpanel__covers-label {
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: var(--weight-medium);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--brand-secondary);
  margin-bottom: 12px;
}
.hiw-rubpanel__covers {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hiw-rubpanel__covers li {
  font-size: 15px;
  line-height: 1.55;
  color: var(--text-muted);
  padding-left: 14px;
  position: relative;
}
.hiw-rubpanel__covers li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-subtle);
}
.hiw-rubpanel__cover-title {
  color: var(--text-default);
  font-weight: var(--weight-medium);
}
.hiw-rubpanel__cover-gloss {
  color: var(--text-muted);
}
.hiw-rubpanel__note {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-subtle);
  margin: 20px 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--border-default);
  max-width: 720px;
}
.hiw-spr {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 16px;
  align-items: stretch;
  margin-top: 32px;
}
.hiw-spr-side {
  border-radius: var(--radius-lg);
  padding: 24px;
  background: var(--surface-default);
  transition: opacity 300ms var(--ease-out);
}
.hiw-spr-side:not(.on) { opacity: 0.4; }
.hiw-spr-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: var(--weight-medium);
  color: var(--text-muted);
  background: var(--surface-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  padding: 7px 12px;
  cursor: pointer;
  transition: border-color 150ms var(--ease-out), color 150ms var(--ease-out), background 150ms var(--ease-out);
}
.hiw-spr-tag:hover {
  border-color: var(--border-strong);
  color: var(--text-default);
}
.hiw-spr-tag:focus-visible {
  outline: 2px solid var(--interactive-focus);
  outline-offset: 2px;
}
.hiw-spr-tag__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-stone-strong);
  flex: none;
}
.hiw-spr-side--exceed .hiw-spr-tag__dot {
  background: var(--feedback-success-icon);
}
.hiw-spr-side.on .hiw-spr-tag {
  background: var(--brand-primary-subtle);
  border-color: var(--brand-primary);
  color: var(--text-brand);
}
.hiw-spr-com {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 14px 0 0;
}
.hiw-spr-target {
  border-radius: var(--radius-lg);
  padding: 28px;
  background: var(--surface-default);
  border: 1px solid var(--border-strong);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hiw-spr-tlabel {
  font-family: var(--font-label);
  font-size: 12px;
  font-weight: var(--weight-medium);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--brand-secondary);
}
.hiw-spr-ttext {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-default);
  margin: 12px 0 0;
}
.hiw-spr-caption {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-subtle);
  margin: 20px 0 0;
  max-width: 700px;
}

/* ---- closing pair: matched full-width cards ---- */
.hiw-closing-stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  width: 100%;
}
.hiw-closing-card {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 32px;
  border-radius: var(--radius-lg);
  background: var(--surface-subtle);
}
.hiw-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 24px;
}
.hiw-close .hiw-list { margin-top: 22px; }
.hiw-close .hiw-list li b {
  color: var(--text-default);
  font-weight: var(--weight-medium);
}
.hiw-notes {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hiw-note {
  display: flex;
  gap: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-subtle);
}
.hiw-note svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.6;
  flex: none;
  margin-top: 2px;
}

.hiw-why__body {
  font-size: 18px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0 0 28px;
}
.hiw-why__roles {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.hiw-why__roles li {
  font-size: 16px;
  line-height: 1.55;
  color: var(--text-muted);
}
.hiw-why__role {
  font-family: var(--font-label);
  font-weight: var(--weight-medium);
  color: var(--text-default);
}
.hiw-why__role-text {
  color: var(--text-muted);
}
.hiw-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 40px;
}
.hiw-cta-browse {
  display: inline-block;
  margin-top: 16px;
  font-family: var(--font-label);
  font-size: 14px;
  font-weight: var(--weight-medium);
  color: var(--text-muted);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 150ms var(--ease-out), border-color 150ms var(--ease-out);
}
.hiw-cta-browse:hover {
  color: var(--text-default);
  border-bottom-color: var(--border-strong);
}
.hiw-cta-browse:focus-visible {
  outline: 2px solid var(--interactive-focus);
  outline-offset: 2px;
}

@media (max-width: 960px) {
  .hiw-hero__grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .hiw-hero__copy { order: 0; }
  .hiw-hero__demo { order: 1; }
}

@media (max-width: 820px) {
  .hiw-h1 { font-size: 32px; max-width: none; }
  .hiw-lede { font-size: 17px; max-width: none; }
  .hiw-process-heading { font-size: 28px; }
  .hiw-sec-h { font-size: 28px; }
  .hiw-demo-mock { grid-template-columns: 1fr; }
  .hiw-demo-mock__pane--oer {
    border-right: none;
    border-bottom: 1px solid var(--border-default);
  }
  .hiw-demo { min-height: 220px; }
  .hiw-spr { grid-template-columns: 1fr; }
  .hiw-spr-target { order: -1; }
  .hiw-spine::before,
  .hiw-progress,
  .hiw-progress-dot { left: 6px; }
  .hiw-row--left,
  .hiw-row--right { justify-content: flex-start; }
  .hiw-node { left: 6px; }
  .hiw-card { width: 100%; margin-left: 28px; }
  .hiw-spine.anim .hiw-row--left,
  .hiw-spine.anim .hiw-row--right { transform: translateX(20px); }
  .hiw-closing-card { padding: 24px; }
}

@media (prefers-reduced-motion: reduce) {
  .hiw-spine.anim .hiw-row {
    opacity: 1;
    transform: none;
  }
  .hiw-spine.anim .hiw-row .hiw-status-wrap {
    opacity: 1;
    transform: none;
  }
  .hiw-card {
    --hiw-focus: 0 !important;
    transform: none;
    box-shadow: none;
    filter: none;
    will-change: auto;
  }
  .hiw-rubpanel-shell {
    transition: none !important;
  }
  .hiw-rubpanel__beat {
    transition: none !important;
    opacity: 1;
    transform: none;
  }
  .hiw-rubpanel:not(.is-visible) .hiw-rubpanel__beat {
    opacity: 0;
  }
  .hiw-demo-mock__hl,
  .hiw-demo-mock__note {
    transition: none !important;
    transition-delay: 0ms !important;
  }
  .hiw-demo-mock--play .hiw-demo-mock__hl,
  .hiw-demo-mock--play .hiw-demo-mock__note {
    opacity: 1;
    transform: none;
  }
}
`;

let injected = false;
export function useHowItWorksStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.setAttribute("data-oer", "how-it-works");
    el.textContent = HIW_CSS;
    document.head.appendChild(el);
    injected = true;
  }
}
