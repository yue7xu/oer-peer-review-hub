# Design System — OER Peer Review Hub

Status: **documentation audit, current as of 2026-07-19.** This file consolidates
and updates the visual-system facts previously recorded in the project-root
`design.md`. It does not replace `design.md` as a historical record — that
file stays in place, unedited — but for any fact where the two disagree,
**this file is authoritative**, because it was verified against the live
token files and component code, not against the original redesign brief.

This document is part of the `docs/design/` package created for the
landing-page experience specification. It answers "what is the design system,
today" so that `LANDING_PAGE_ARCHITECTURE.md`, `MOTION_SYSTEM.md`, and
`SECTION_LIBRARY.md` can build on it without re-deriving tokens. It does not
cover page-level section architecture (see `LANDING_PAGE_ARCHITECTURE.md`),
animation timing rationale (see `MOTION_SYSTEM.md`), or breakpoint strategy
(see `RESPONSIVE_BEHAVIOR.md`) — `design.md` and the token files never
defined any of those, which is the gap this whole package exists to close.

## 1. Provenance

- `design.md` (project root) was produced by a Hallmark full-site redesign
  pass on **2026-07-09** (`.hallmark/log.json`), adapting a user-supplied
  ElevenLabs-style `DESIGN.md` reference onto the Hub's existing 7 pages.
  Scope was **visual-system only** — routes, copy, and information
  architecture were explicitly preserved.
- The tokens it produced live in `src/design-system/tokens/{colors,typography,
  spacing,fonts}.css`, aggregated by `src/design-system/styles.css`, imported
  once by `src/index.css`. `src/index.css` itself carries the Hallmark stamp
  confirming this provenance.
- **What has changed since 2026-07-09:** the Solution page (`/solution`,
  `src/pages/Solution.jsx`) and its `src/components/how-it-works/` component
  set (`ProcessSpine`, `RubricMethod`, `RoleToggle`, `ReviewConsoleDemo`,
  `ProcessStatusPill`) were built after the redesign pass and introduce real
  scroll-linked motion, an accordion/tab pattern, and a video-based product
  demo — none of which `design.md` accounts for. This is the primary way
  `design.md` is out of date: it describes a static, reveal-free system, and
  the codebase has since grown a working motion vocabulary that contradicts
  that description. See § 6 Drift log.

## 2. Color

Primitives, then semantic aliases — components reference semantic names only
(`src/design-system/tokens/colors.css`).

| Primitive | Value | Role |
|---|---|---|
| `--color-eggshell` | `#fdfcfc` | Page canvas |
| `--color-warm-taupe` | `#f5f3f1` | Section bands, feature-card fill |
| `--color-stone` | `#ebe8e4` | Hairline borders, dividers |
| `--color-stone-strong` | `#d9d4cd` | Hover/active borders (derived) |
| `--color-ink` | `#000000` | Primary text, filled buttons, links |
| `--color-graphite` | `#44403b` | Secondary text, hover states |
| `--color-smoke` | `#777169` | Body/muted text |
| `--color-ash` | `#a59f97` | Faintest helper text |
| `--color-violet-spark` | `#0447ff` | Product-visual accent **only** — never UI chrome, text, or buttons |
| `--color-ember-orange` | `#ff4704` | Product-visual accent **only** — never UI chrome, text, or buttons |
| `--color-legacy-border` | `#e5e5e5` | Button hairline |
| `--color-on-ink-muted` | `rgba(253,252,252,0.7)` | Secondary text on an ink-fill band (e.g. Home's Institutions CTA) |

Peer-review status hues are **deliberately kept** (not folded into the
achromatic system) because they carry real WCAG 1.4.1 status information —
color is part of the signal, not decoration:

| Status hue | Background | Text | Icon |
|---|---|---|---|
| Sage (success/revised) | `#eef3ea` | `#3f6b34` | `#5b8a4c` |
| Amber (responded) | `#faf1e0` | `#8a5a1f` | `#b3781f` |
| Terracotta (error) | `#f8e9e6` | `#93402f` | `#c0503a` |
| Slate (info/reviewed) | `#eef0f5` | `#35415c` | `#56698f` |

Semantic aliases (brand / text / surface / border / interactive / feedback)
map onto these primitives 1:1 with the current live values — see
`colors.css` directly rather than duplicating the full alias table here; it
is short (72 lines) and the primitives above are the part likely to be asked
about in a landing-page brief.

**Non-negotiable rule:** `--color-violet-spark` and `--color-ember-orange`
are the system's only chromatic UI accents, and they are reserved for
product-visual decoration (illustration, diagrams, chart accents) — never a
button fill, a link color, or any interactive chrome. A new landing page must
not introduce a third accent color or promote these two into button/link use
without an explicit design decision (see open decision LP-OD-3 in
`LANDING_PAGE_ARCHITECTURE.md`).

## 3. Typography

Source: `src/design-system/tokens/typography.css` + `fonts.css`.

- **Display/heading:** Inter, weight **300** ("whisper-weight" — the
  system's signature restraint, substituted for the source system's
  proprietary Waldenburg). **Never bold or semibold a heading** — carry
  emphasis with size, tracking, or color instead. This is stated as
  non-negotiable in `design.md` and is still true throughout every page.
- **Body/label:** Inter 400/500.
- **Mono/identifiers:** Geist Mono 400 — used for DOIs, dates in
  `ReviewTimeline`, and other identifier-shaped text.
- **Display tracking:** `-0.02em` on headings only, never on body copy.
- Self-hosted `.woff2` files, `font-display: swap`, declared via
  `@font-face` in `fonts.css` (Inter 300/400/500, Geist Mono 400 — 4 files
  total, ~85KB combined).

Type scale (all tokens, not just the anchor):

| Token | Size | Line-height | Tracking |
|---|---|---|---|
| `--text-display-size` | 48px | 1.08 | -0.02em |
| `--text-h1-size` | 36px | 1.17 | -0.02em |
| `--text-h2-size` | 32px | 1.13 | -0.018em |
| `--text-h3-size` | 20px | 1.35 | normal |
| `--text-h4-size` | 18px | 1.6 | normal |
| `--body-xl-size` | 20px | 1.35 | — |
| `--body-lg-size` | 18px | 1.6 | — |
| `--body-md-size` | 16px | 1.5 | 0.01em |
| `--body-sm-size` | 14px | 1.5 | 0.01em |
| `--label-md-size` | 14px | 1.4 | — |
| `--label-sm-size` | 12px | 1.4 | — |
| `--text-caption-size` | 10px | 1.6 | — |
| `--code-md-size` | 13px | 1.69 | — |

**Gap this document flags:** none of these tokens has a mobile-scaled
counterpart. `--text-display-size: 48px` is a single fixed value with no
`clamp()` or breakpoint override anywhere in the codebase. Every current page
that uses `--text-display-size`/`h1` sizing does so via an inline `fontSize:
40` or `48` literal, not the token, and never changes it per viewport. See
`RESPONSIVE_BEHAVIOR.md` § Typography scaling for the proposed fix — this is
an open gap, not yet a system decision.

## 4. Spacing, radius, elevation

Source: `src/design-system/tokens/spacing.css`.

- **Base unit:** 4px. Named scale from `--space-4` (4px) to `--space-160`
  (160px), all multiples of 4.
- **Density:** "comfortable" — current page sections use `72px`/`96px`
  vertical padding between major bands (see literal values in `Home.jsx`,
  `Community.jsx`, `About.jsx`; not yet tokenized as `--space-section-y`,
  they're inline `padding: "72px 32px"` literals).
- **Container:** `maxWidth: 1280`, centered, `padding: "0 32px"` (Home) or
  `"0 64px"` (Header/Footer) — **inconsistent gutter between components**,
  see § 6 Drift log.
- **Radius:** inputs 4px (`--radius-sm`) · small elements 10px (`--radius-md`)
  · cards 20px (`--radius-lg`) · large/flagship cards 24px (`--radius-xl`) ·
  buttons/tags/tabs/chips **9999px pill** (`--radius-full`) — the system's
  most recognizable shape, applied without exception across `Button`,
  `FilterChip`, `Badge`, `StatusBadge`.
- **Elevation:** near-invisible. `--shadow-subtle` is a 3-layer whisper
  shadow (`0px 0px 1px`, `0px 1px 1px`, `0px 2px 4px`, all ≤4% opacity black)
  — used only on hover states (`ResourceCard`, sidebar cards), never at rest.
  No heavy drop shadows anywhere in the codebase. `--shadow-inset-hairline`
  exists for a subtle inset border effect but has no current callers found
  in `src/components/` — available, unused.

## 5. Motion tokens (existing, incomplete)

Source: `src/design-system/tokens/spacing.css` (motion tokens are
co-located with spacing tokens, not a separate file — a structural gap noted
here so `MOTION_SYSTEM.md` doesn't silently duplicate/contradict it).

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in: cubic-bezier(0.7, 0, 0.84, 0);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-short: 150ms;
--dur-med: 220ms;
```

This is the **entire** token-level motion vocabulary. There is no
`--dur-long`, no stagger-interval token, no marquee-duration token (marquee
duration is passed as a component prop, default `32s`, not a CSS custom
property at `:root`). Every duration longer than 220ms found in the
codebase (400ms role-toggle crossfade, 450ms card entrance, 480ms accordion
open, 600ms row entrance — see `MOTION_SYSTEM.md` § Duration tokens) is a
**hard-coded literal inside a component's CSS string**, not a shared token.
`MOTION_SYSTEM.md` proposes promoting these into a real token scale; until
that's implemented, treat the values above as the only ones safe to assume
are consistent across components.

## 6. CTA voice (confirmed still accurate)

From `design.md`, verified against `Button.jsx` and callers — **unchanged
and correct**:

- **Primary:** Filled Pill — ink fill, eggshell text, 9999px radius, Inter
  14px/500\*, 1px `--color-legacy-border` hairline. (`variant="primary"`)
- **Secondary:** Outline Pill — eggshell fill, ink text, 9999px radius, 1px
  stone-strong border. (`variant="secondary"`)
- **Tertiary/Ghost:** transparent fill, ink text, no border until hover.
  (`variant="ghost"`)
- **Outbound ("leaving the platform"):** Outline Pill button or underlined
  ghost text with a trailing ↗ glyph (`OutboundLink.jsx`) — never colored,
  the icon + "opens in a new tab" copy carries the distinction.

\* `--label-md-size` (14px) is the `md` button size; `Button.jsx` also ships
`sm` (13px) and `lg` (16px) — `design.md` only documented the one size.

## 7. Drift log — where `design.md` no longer matches the code

| # | `design.md` claim | Current reality | Resolution |
|---|---|---|---|
| D1 | "Reveal pattern: none — this system doesn't specify scroll reveals; the existing pages already ship no reveal animation and that's preserved." | `ProcessSpine.jsx` (Solution page) ships IntersectionObserver row reveals, a scroll-linked progress rail, and a `requestAnimationFrame`-driven focus-lerp lift/scale effect on cards. `RubricMethod.jsx` ships a JS-measured accordion open/close (480ms) with staggered content fade. Both post-date the 2026-07-09 redesign pass. | Treat `design.md`'s motion claim as **superseded**. `MOTION_SYSTEM.md` documents the real, current motion vocabulary and is the source of truth going forward. |
| D2 | Container gutter implied consistent (not explicitly stated, but implied by "page max-width 1280px with 64px outer gutters (32px on the app's current container padding where content is denser, e.g. Browse's filter sidebar)") | `Header`/`Footer` use `padding: "0 64px"`; `Home`/`Community`/`About` use `padding: "0 32px"` on the same 1280px container. This isn't the documented "denser app page" exception — it's the marketing pages themselves being inconsistent with the nav/footer that wraps them. | Open decision — see `RESPONSIVE_BEHAVIOR.md` § Container width. Not silently resolved here. |
| D3 | No mention of a nav-underline indicator component | `Header.jsx` uses `AnimatedTabBar` — a DOM-measured sliding underline (not documented anywhere in `design.md`). | Documented fresh in `MOTION_SYSTEM.md` § Tab transitions. |
| D4 | No mention of the partner-logo marquee | `PartnerLogoMarquee.jsx` (CSS `@keyframes` infinite scroll, hover/focus pause, reduced-motion → static wrap) exists and is live on Home. Not in `design.md` at all. | Documented fresh in `MOTION_SYSTEM.md` § Marquee behavior and `SECTION_LIBRARY.md` § Partner logo marquee. |
| D5 | No breakpoint strategy stated | Confirmed: `design.md` contains zero mentions of breakpoints, mobile, or tablet. Four different max-width values (`900px`, `960px`, `820px`, `640px`) are used ad hoc across components with no shared token. | This is the core gap `RESPONSIVE_BEHAVIOR.md` exists to close. |

## 8. Per-page allowances (confirmed still accurate)

From `design.md`, unchanged:

- Marketing pages (Home, and any future landing-style pages) MAY use the
  Home hero's stat-row and discipline-chip-grid patterns.
- App pages (Browse, Resource Detail) MUST keep filter/timeline function
  readable — status color-coding is never removed for stylistic purity.
- Content pages (Community, About) use typography + flat feature-cards only,
  no added imagery, per `design.md`. **Open question for the landing-page
  work:** does a redesigned Home page count as a "marketing page" (imagery
  allowed) or does the no-imagery rule extend to it too? `design.md` implies
  marketing pages are the one family where richer treatment (stat rows,
  chip grids) is already sanctioned, so `LANDING_PAGE_ARCHITECTURE.md`
  proceeds on that reading — flagged as open decision LP-OD-1.

## 9. What this document does not cover

- Section-by-section landing-page architecture → `LANDING_PAGE_ARCHITECTURE.md`
- Full motion pattern specs (trigger, properties, duration, easing,
  reduced-motion fallback per pattern) → `MOTION_SYSTEM.md`
- Reusable section component contracts → `SECTION_LIBRARY.md`
- Breakpoints, grid behavior, touch, overflow → `RESPONSIVE_BEHAVIOR.md`
- External reference analysis (Lovable and peers) → `REFERENCE_AUDIT.md`
