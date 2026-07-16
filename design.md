# Design — OER Peer Review Hub

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

Source: adapted from a supplied `DESIGN.md` style-DNA extraction (ElevenLabs
reference). Applied wholesale to the OER Peer Review Hub's existing 7 pages —
the information architecture, routes, and copy are unchanged; only the visual
and interaction layer was redesigned.

## Genre
modern-minimal (closest cluster to the source's own "Similar Brands": Linear,
Vercel, Stripe, Notion, Framer)

## Macrostructure family
Pages keep their existing shape — this was a visual-system redesign, not a
structural rebuild. Three families:

- **Marketing pages** (Home, For authors, For reviewers): hero-led vertical
  section stack, alternating eggshell / taupe bands, 96px section gaps.
- **App pages** (Browse, Resource detail): sidebar + content workbench shape,
  flat taupe feature-cards replace the old bordered-white cards.
- **Content pages** (Community, About): stacked panels, taupe feature-cards
  for grouped content, a white whisper-shadow card only for the one place that
  needs to visually float (the About contact form).

## Theme
- `--color-eggshell`  #fdfcfc — page canvas
- `--color-warm-taupe` #f5f3f1 — section bands, feature-card fill
- `--color-stone`      #ebe8e4 — hairline borders, dividers
- `--color-ink`        #000000 — primary text, filled buttons, links
- `--color-graphite`   #44403b — secondary text, hover states
- `--color-smoke`      #777169 — body/muted text
- `--color-ash`        #a59f97 — faintest helper text
- `--color-violet-spark` #0447ff / `--color-ember-orange` #ff4704 — reserved
  for product-visual decoration only; **never** UI chrome, text, or buttons.

**Deliberate deviation from the source:** the peer-review StatusBadge / review-
timeline dots keep muted sage / amber / terracotta / slate hues. These encode
real status information (WCAG 1.4.1 — never color-only, but color IS part of
the signal), so removing them for the sake of "97% achromatic" would delete
functionality, not decoration. They're desaturated to sit inside the warm
neutral system rather than reading as bright brand color.

## Typography
- Display/heading: Inter, weight 300 (whisper-weight — Waldenburg substitute
  per the source system's own documented fallback)
- Body/label: Inter, weight 400/500
- Mono/identifiers: Geist Mono, weight 400
- Display tracking: -0.02em (headings only — never on body copy)
- Type scale anchor: `--text-display` = 48px / 1.08 / -0.02em

**Never bold or semibold a heading.** The whisper-weight is the system's
signature restraint; carry emphasis with size, tracking, or color instead.

## Spacing
4px base unit, "comfortable" density. Named scale in `tokens/spacing.css`
(4 → 160). Section gaps 96px, card padding 32px, element gaps 8–16px, page
max-width 1280px with 64px outer gutters (32px on the app's current container
padding where content is denser, e.g. Browse's filter sidebar).

## Radius
- Inputs: 4px · Cards: 20px · Large/flagship cards: 24px · Buttons/tags/tabs:
  9999px (pill — the system's most recognizable shape, non-negotiable).

## Motion
- Easings: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1), plus `--ease-in` /
  `--ease-in-out`.
- Reveal pattern: none — this system doesn't specify scroll reveals; the
  existing pages already ship no reveal animation and that's preserved.
- Reduced-motion fallback: opacity-only, ≤150ms (unchanged from before).

## Microinteractions stance
- Hover: fill lightens toward graphite (filled buttons) or border strengthens
  toward stone-strong (outline elements) — never opacity fades.
- Focus: visible ring via `--interactive-focus` (graphite), never animated in.
- No scale/bounce transforms on buttons or cards.

## CTA voice
- **Primary:** Filled Pill — ink fill, eggshell text, 9999px radius, Inter
  14px/500, 1px `--color-legacy-border` hairline. ("Search", "Submit a
  resource", "Become a reviewer".)
- **Secondary:** Outline Pill — eggshell fill, ink text, 9999px radius, 1px
  stone border. ("Sign in", "Add to collection", dashboard links.)
- **Tertiary:** Ghost — transparent fill, ink text, no border until hover.
  (Nav items, inline actions.)
- **Outbound ("leaving the platform"):** styled as an Outline Pill (button) or
  underlined ghost text (inline) with a trailing ↗ glyph. Distinctiveness
  comes from the icon + "opens in a new tab" copy, not color — the source
  system's terracotta accent is reserved for decoration, so the "leaving the
  Hub" affordance can no longer borrow it.

## Per-page allowances
- Marketing pages MAY use the Home hero's stat row and discipline-chip grid.
- App pages MUST keep filter/timeline function readable — status color-coding
  is never removed for stylistic purity.
- Content pages: typography + flat feature-cards only, no added imagery.

## What pages MUST share
- The `OER Peer Review Hub` wordmark (Inter, ink, no icon mark).
- Ink-only interactive chrome — no colored links, no colored button fills.
- The pill shape across every button, tag, and chip.
- Hairline stone dividers for section separation; flat taupe fill (never a
  border) for grouped-content feature-cards.
- The muted peer-review status palette (sage/amber/terracotta/slate).

## What pages MAY differ on
- Whether a section uses a feature-card grid (Home's "how review works",
  ForAuthors' benefits) or a plain two-column layout (About's principles).
- Hero copy density per page.

## Exports

### tokens.css
See `src/design-system/tokens/colors.css`, `typography.css`, and
`spacing.css` — the live, in-repo token files. This project's token names
predate Hallmark's `--color-paper` / `--color-accent` convention; the mapping
is: `--color-eggshell` = paper, `--color-ink` = ink, `--brand-primary` = accent
(here, accent is ink itself — the system has no chromatic UI accent).
