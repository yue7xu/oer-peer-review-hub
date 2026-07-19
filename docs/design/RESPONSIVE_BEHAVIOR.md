# Responsive Behavior — OER Peer Review Hub

Status: **documentation, proposal where new.** This document opens with an
honest audit: as of this writing, **the app's page-level layouts have no
responsive behavior at all.** `grep`-confirmed: `Home.jsx`, `Browse.jsx`,
`About.jsx`, `Community.jsx`, and `ResourceDetail.jsx` contain zero `@media`
queries between them. Every multi-column grid on every page
(`gridTemplateColumns: "repeat(4, 1fr)"`, `"repeat(3, 1fr)"`, `"1fr 340px"`,
`"1fr 1.2fr"`) is a fixed value with no narrower-viewport override. Below
some unmeasured width, every one of these pages will overflow horizontally
or render illegibly cramped columns.

**What does exist:** four components have their own `@media` breakpoints —
`PartnerLogoMarquee` (900px, 640px), `InstitutionCard` (640px),
`ReviewTimeline` (640px), and `hiwStyles.js` for the Solution page (960px,
820px). These four breakpoint sets don't agree with each other (three cluster
around 640px, one uses 820px) and none of them is a shared token — each is a
literal `@media (max-width: NNNpx)` hard-coded per file. This document
proposes consolidating these into one coherent scale and then applying it to
every page, not just the four components that happen to have it today.

## Breakpoint strategy

Proposed scale, reconciling the existing ad hoc values rather than inventing
new ones from nothing — three of the four existing breakpoint sources
already agree closely enough to consolidate on round numbers:

```css
--bp-sm: 640px;   /* mobile ceiling — matches existing PartnerLogoMarquee,
                      InstitutionCard, ReviewTimeline breakpoints exactly */
--bp-md: 900px;   /* tablet ceiling — matches existing PartnerLogoMarquee's
                      first breakpoint; also the recommended sticky-narrative
                      fallback threshold (LANDING_PAGE_ARCHITECTURE.md §6) */
--bp-lg: 1280px;  /* desktop content ceiling — matches the existing container
                      max-width everywhere already */
```

**`[OPEN DECISION RB-OD-1]`** `hiwStyles.js`'s existing `960px`/`820px` pair
(Solution page) doesn't fit this scale cleanly. Recommend migrating those two
call sites to `--bp-md` (900px) and a to-be-confirmed smaller "narrow
tablet" step, rather than keeping a fifth, page-specific breakpoint pair
alive — but migrating existing, working CSS is a code change outside this
documentation task's scope; flagging the inconsistency for a future pass
rather than silently declaring it resolved.

Three tiers, named per the brief's own vocabulary (desktop / tablet /
mobile), plus Hallmark's four mandatory verification widths (320, 375, 414,
768px) as the concrete test points within the mobile/tablet tiers:

| Tier | Range | Verification widths |
|---|---|---|
| Mobile | `< 640px` | 320px, 375px, 414px |
| Tablet | `640px – 899px` | 768px |
| Desktop | `≥ 900px`, full layout at `≥ 1280px` | — |

This is a **mobile-first cascade in intent, but the current codebase writes
`max-width` (desktop-first) queries throughout** (`PartnerLogoMarquee`,
`InstitutionCard`, `ReviewTimeline`, `hiwStyles.js` all use `@media
(max-width: ...)`). This document does not propose flipping the whole
codebase to `min-width` queries — that would touch every existing responsive
component for no functional gain — new landing-page CSS should match the
existing `max-width` convention for consistency, not introduce a second
convention alongside it.

## Grid behavior

General rule for every multi-column grid on the page (not stated anywhere
today — this is the gap):

- **Desktop (`≥900px`):** full column count as designed (3 or 4, per
  section — see `LANDING_PAGE_ARCHITECTURE.md` per-section specs).
- **Tablet (`640–899px`):** reduce to **2 columns** for any grid that was
  3+ at desktop. This is not "just stack it" — 2 columns preserves scannable
  grid structure at a width that can still comfortably hold two ~300px+
  cards, and avoids the jarring jump from "grid" to "list" in one step.
- **Mobile (`<640px`):** **1 column**, full width. This is where true
  stacking happens — anything narrower than ~600px cannot hold two
  legible content cards side by side without cramming.

Grid tracks that hold images/logos must use `minmax(0, 1fr)`, never a bare
`1fr` — a bare `1fr` track cannot shrink below its content's intrinsic size
(an image's natural width), which is exactly the mechanism that produces
silent horizontal overflow on narrow viewports. This is not yet a problem in
observed grids because most existing image content (partner logos) is
already constrained by its own component (`object-fit: contain` inside a
fixed-size frame), but any new grid introduced for the landing page
(institution collage, resource cards) must use `minmax(0, 1fr)` from the
start.

`repeat(auto-fit, minmax(200px, 1fr))` (used today by `Community.jsx`'s
institution grid) needs verification below ~400px viewport width — a
`200px` floor on a `375px` viewport with `32px` total horizontal padding
leaves `343px` of usable width, which just barely fits one `200px+` column;
below `375px` (down to Hallmark's mandated `320px` check) this could force a
column to overflow rather than wrap. Recommend lowering the floor to
`minmax(160px, 1fr)` for this specific grid, or explicitly capping it at 2
columns via a `640px` breakpoint rather than relying on `auto-fit` alone at
the narrowest widths.

## Maximum container width

Current state: `1280px` max-width is consistent everywhere (`Header`,
`Footer`, `Home`, `Community`, `About`, `ResourceDetail` all use `maxWidth:
1280`) — **this part is already correct and should not change.**

**What is not consistent: horizontal padding at the container edge.**
`Header`/`Footer` use `padding: "0 64px"`; `Home`/`Community`/`About` use
`padding: "0 32px"` — same 1280px container, two different gutter values,
meaning the nav/footer content edge doesn't visually align with the page
content edge at any viewport width. This predates the landing-page work
(confirmed via `DESIGN_SYSTEM.md` § Drift log D2) and should be resolved as
part of implementing this document, not left to compound with new sections.

**Proposed:** standardize on `32px` gutter at desktop as the container
default (matching the majority of existing page components), and step it
down responsively:

| Tier | Horizontal gutter |
|---|---|
| Desktop (`≥900px`) | 32px |
| Tablet (`640–899px`) | 24px |
| Mobile (`<640px`) | 16px |

`[OPEN DECISION RB-OD-2]` Whether `Header`/`Footer`'s current `64px` value
should reduce to match `32px`, or whether the marketing-page body content
should increase to `64px` instead. Either direction is a visible layout
change to an existing, shipped page — flagging rather than silently picking
one.

## Section padding

Current vertical section padding is a set of inline literals — `40px`
(Stats), `56px` (Partners), `72px` (most major sections) — with no token
and no responsive reduction. Proposed scale, replacing the ad hoc literals
with named tokens (a code change, documented here as the target state):

```css
--space-section-y-desktop: 72px;  /* matches the existing majority value */
--space-section-y-tablet:  56px;
--space-section-y-mobile:  40px;
```

**Rationale for reducing on mobile, not just relying on content reflow:**
a `72px` top+bottom gap between sections is proportionally enormous on a
`375px`-tall mobile viewport fold — it reads as "the page is mostly empty
space" rather than "generously composed," which is the opposite of the
editorial-restraint effect this padding value achieves at desktop width.
Reducing it on mobile isn't a compromise, it's necessary to preserve the
same *felt* density across viewport sizes.

## Typography scaling

Current state: all type-scale tokens (`DESIGN_SYSTEM.md` § 3) are single
fixed pixel values — `--text-display-size: 48px` never changes. Every H1 on
every page is an inline `fontSize: 40` (Home/About/Community all use `40`,
not even the token's `48` value — another minor inconsistency worth noting)
with no mobile override found anywhere.

**Concrete risk:** a `40px` H1 at `320px` viewport width, inside a
`16px`-gutter container (`288px` usable width), forces a line break after
very few words for any headline longer than ~4-5 words — several existing
headlines ("Peer-reviewed OER, in one trusted library.", "Built by
institutions and projects who believe in open review.") would wrap
awkwardly or overflow-wrap mid-word without a size reduction.

**Proposed scaling (three-tier, matching the breakpoint strategy above):**

| Token | Desktop | Tablet | Mobile |
|---|---|---|---|
| `--text-display-size` | 48px | 40px | 32px |
| `--text-h1-size` | 36px | 32px | 28px |
| `--text-h2-size` | 32px | 28px | 24px |
| `--text-h3-size` | 20px | 20px | 18px |
| Body/label sizes | unchanged at every tier | | |

Line-height and tracking tokens stay proportionally the same (ratios, not
pixel values) at every tier — only the size steps down. Headings must also
carry `overflow-wrap: anywhere; min-width: 0` so a single long word (a
technical term, a long institution name) cannot force horizontal overflow
even after size reduction — this is not implemented anywhere currently and
is a hard requirement per the section-collapse rule below, not optional
polish.

## Column collapse

This section explains **hierarchy**, not just "it stacks" — per the task's
explicit instruction not to hand-wave this.

**Two-column content+visual sections** (e.g., the proposed Product Hero,
`LANDING_PAGE_ARCHITECTURE.md` §1): copy column collapses **above** the
visual column in DOM/visual order at mobile — the headline and CTA are the
conversion-critical content, and should not require scrolling past a video
to reach. This is the opposite of a naive "just reverse nothing" collapse;
it's a deliberate reordering rule (see § Content reordering below).

**Sidebar+main layouts** (e.g., `ResourceDetail.jsx`'s `"1fr 340px"` grid):
sidebar content is *secondary* (checkout link, metadata, contributing
institution) — it collapses **below** the main content at mobile, not
above, since a visitor arriving at a resource page wants the abstract and
review content first, the "leave the Hub to read it" checkout card second.
This is the inverse hierarchy rule from the hero case above, and both are
correct for their own content — the rule is "conversion/primary-read
content wins the top position," not a blanket "always copy first" or
"always keep DOM order."

**Left-rail+right-detail sticky layouts** (proposed §6 Sticky Product
Narrative): collapses to a **single ordered stack**, rail labels becoming
inline headings directly above their own content block (not moved
elsewhere, not demoted) — see § Sticky-layout fallback below.

**Symmetric grids** (3-4 equal cards): no hierarchy question — column count
reduces per § Grid behavior, order is preserved left-to-right/top-to-bottom
at every tier.

## Content reordering

Beyond simple column collapse, two places in the proposed landing page
involve genuine DOM-order changes between breakpoints, both flagged
explicitly so they're implemented deliberately rather than left to whatever
a naive flexbox/grid collapse produces by default:

1. **Product Hero (§1):** desktop DOM order can be copy-then-visual or
   visual-then-copy (doesn't matter, they're side by side); mobile **must**
   render copy first, visual second, regardless of desktop source order —
   implement via explicit `order` CSS property or actual DOM order, not an
   accidental byproduct of the grid template.
2. **Nav (Header):** desktop order is wordmark → links → auth buttons,
   left to right. Mobile collapsed nav (§ Navigation behavior below) should
   keep wordmark + hamburger visible in the collapsed bar, with links and
   auth buttons moving into the drawer — not simply hidden, and not
   reordered within the drawer relative to their desktop left-to-right
   sequence (Browse, Solution, Community, About, then Login, Sign up).

No other section in the proposed sequence requires content reordering
beyond straightforward column collapse.

## Sticky-layout fallback

Two sticky mechanisms exist or are proposed (see `MOTION_SYSTEM.md` §
Sticky-scroll transitions for the full technical detail):

- **`ResourceDetail.jsx`'s existing sidebar** (`position: sticky, top: 88`,
  inside a `"1fr 340px"` grid): **currently has no mobile fallback at all**
  — confirmed no `@media` override in the file. Below the width where two
  340px+/1fr columns can't both fit (~700px, given the grid has no `minmax`
  floor), this will either overflow or squeeze the main column illegibly.
  **Fix required:** below `--bp-md` (900px, matching the broader tablet
  cutover), the grid becomes single-column and `position: sticky` is
  removed entirely (not just visually ineffective — actively remove the
  `position` and `top` values, since a lingering `sticky` on a full-width
  mobile element could still cause unexpected scroll-pinning behavior in
  some browsers if the parent's height happens to exceed the viewport).
- **Proposed §6 Sticky Product Narrative:** as specified in
  `SECTION_LIBRARY.md`, below `--bp-md` (900px) the sticky left rail
  collapses to a plain stacked list — each rubric becomes its own
  full-width heading + content block, in the same order, with no sticky
  positioning and no `IntersectionObserver`-driven active-state highlight
  (the highlight has no purpose once there's no persistent rail to
  highlight against).

**General fallback rule for any future sticky element:** the non-sticky
fallback must be **content-equivalent** — same information, same order,
just without the persistent-positioning mechanic. Never hide content
entirely as the "mobile version" of a sticky section.

## Mobile animation reductions

Distinct from `prefers-reduced-motion` (an explicit user preference,
covered fully in `MOTION_SYSTEM.md` § Reduced-motion behavior) — this
section covers animations that should scale down on **narrow viewports
specifically**, independent of the user's motion preference:

- **`ProcessSpine`'s focus-lerp amplitude** already does this correctly
  (existing code: `amp = window.innerWidth <= 820 ? 0.55 : 1`) — the lift/
  scale effect is dampened, not removed, below 820px. This is the pattern
  to match for any new viewport-conditional (not preference-conditional)
  motion scaling.
- **Stagger spread** (`MOTION_SYSTEM.md` § Stagger behavior) already
  specifies a cap independent of viewport (6 items' worth of delay,
  regardless of screen size) — no further mobile-specific reduction needed
  beyond that existing cap.
- **Marquee speed:** no change proposed — `PartnerLogoMarquee`'s existing
  duration is a fixed seconds-value regardless of viewport, and since
  smaller viewports show fewer logos per screen-width, the perceived speed
  (logos-per-second passing a fixed viewing window) is already
  self-adjusting without needing a separate mobile duration.
- **Sticky-narrative highlight crossfade:** irrelevant on mobile since the
  sticky mechanic itself is removed below `--bp-md` (see above) — no
  separate mobile timing needed, the pattern doesn't exist at that tier.

## Navigation behavior

Current state: `Header.jsx` has no mobile treatment — no hamburger, no
drawer, nothing. At any viewport narrow enough that `AnimatedTabBar`'s 4
links + wordmark + 2 buttons don't fit `900px`'s available width (which is
likely well before mobile — probably somewhere in the tablet range given 4
text links plus 2 pill buttons plus a wordmark is a lot of horizontal
content), the nav will either wrap unpredictably or overflow. **This is a
functional gap requiring a new build, not a tweak** (already flagged in
`LANDING_PAGE_ARCHITECTURE.md` § Navigation).

Proposed behavior:

- **Desktop (`≥900px`):** current layout unchanged — wordmark, inline
  `AnimatedTabBar`, Login/Sign up buttons, all in one row.
- **Tablet (`640–899px`):** collapse to wordmark + hamburger icon button,
  right-aligned. Tapping opens a **slide-in drawer from the right** (not a
  full-screen takeover — at tablet width there's room to show the drawer
  without completely obscuring page context, distinguishing it from the
  mobile treatment below).
- **Mobile (`<640px`):** same collapse trigger (wordmark + hamburger), but
  the drawer becomes a **full-screen overlay** (more appropriate at this
  width where a partial-width drawer would leave too little room to be
  legible).
- **Drawer contents (both tiers):** nav links first (Browse, Solution,
  Community, About), then a divider, then Login/Sign up as full-width
  stacked buttons — same left-to-right desktop order, just vertical.
- **Drawer motion:** slide-in from the right, `transform: translateX(100%)
  → translateX(0)`, 300ms, `--ease-out` (a new duration — not directly
  matched by any existing token, positioned between `--dur-panel` 480ms and
  `--dur-med` 220ms; `[OPEN DECISION RB-OD-3]` whether to introduce this as
  a new `--dur-drawer` token or round to the nearest existing value).
  Backdrop fades in simultaneously, 300ms, `opacity 0→0.4` over
  `var(--surface-overlay)` (existing ink-based overlay token).

## Touch interactions

- **Minimum tap target:** all existing interactive components already meet
  a reasonable floor — `Button`'s smallest size (`sm`) is `7px 12px`
  padding at `13px` font, which combined with line-height comfortably
  clears 32px+ effective height; `FilterChip` similarly. **No component
  currently falls below the ~44×44px recommended touch target once padding
  is included**, confirmed by reviewing each component's CSS — this is a
  pass, not a gap, but worth stating explicitly since it wasn't verified
  before.
- **Hover-dependent affordances must have a touch equivalent:**
  `PartnerLogoMarquee`'s hover-pause already also triggers on `:focus-
  within`/`:focus-visible` (keyboard), but has **no touch-tap pause** —
  a touch user cannot pause the marquee at all short of triggering
  reduced-motion at the OS level. `[OPEN DECISION RB-OD-4]` whether to add
  a tap-to-pause interaction (would require a JS touch handler, not just
  CSS `:hover`, since touch devices don't reliably fire hover states) —
  flagging as a real accessibility gap for touch users specifically, not
  fixing unilaterally in a documentation pass.
- **Sticky rail (§6) tap targets:** each rail item must be large enough to
  tap accurately even in its narrowed tablet-width state — minimum 44px
  tap height regardless of visual label size.
- **No hover-only content:** confirm no proposed section reveals content
  *exclusively* on hover with no click/tap/focus equivalent — reviewing the
  proposed sections in `LANDING_PAGE_ARCHITECTURE.md`, none currently do
  (the sticky-narrative active state responds to scroll position, which
  works identically on touch).

## Overflow prevention

- **Root-level containment:** `html`/`body` should carry `overflow-x:
  clip` (not `hidden` — `clip` doesn't create a new scroll container or
  affect `position: sticky` behavior the way `hidden` can). **Not currently
  set anywhere** — `src/index.css` has no `overflow-x` rule at all. This is
  a base-layer gap that should be fixed regardless of any landing-page work,
  since it's cheap insurance against any single component's overflow bug
  taking down the whole page's horizontal scroll.
- **Grid tracks with images:** `minmax(0, 1fr)`, not bare `1fr` — see §
  Grid behavior above.
- **Long unbroken strings:** headings need `overflow-wrap: anywhere;
  min-width: 0` (see § Typography scaling above) — applies to any
  user-influenced or long institution/resource-title text, not just hero
  headlines. `ResourceCard`'s title (`-webkit-line-clamp: 3` on the
  abstract, but the title itself has no clamp or wrap rule) is a concrete
  existing spot to verify against a very long real resource title.
- **Marquee containment:** already correct (`overflow: hidden` on
  `PartnerLogoMarquee`'s root, intentional here since the whole point is a
  clipped scrolling track — the one place `hidden` over `clip` is correct,
  since this container is deliberately a scroll-clipping viewport, not a
  layout-safety backstop).

## Image and video behavior

- **Logos (`PartnerLogoMarquee`, `InstitutionCard`):** `object-fit:
  contain` inside a fixed-height frame — already correct, prevents
  distortion at any width, existing pattern to replicate for any new logo
  display.
- **Product demo video (`ReviewConsoleDemo`):** aspect ratio derived from
  real video metadata at runtime (`stageStyle` computed from
  `video.videoWidth`/`videoHeight`), not hardcoded — already correct,
  already responsive by construction (no separate breakpoint logic needed,
  since a percentage/aspect-ratio-based box scales naturally).
- **No responsive `<img>` `srcset`/`sizes` usage found anywhere** in the
  codebase (confirmed by inspection — every `<img>` tag uses a single
  `src`). For partner logos (small, already size-optimized PNG/SVG files
  under ~130KB each per the build output inspected earlier) this is
  low-risk to leave as-is. For any new, larger image asset introduced by
  the landing page (a testimonial photo, once real ones exist; a
  full-bleed section image, if one is ever approved), `srcset`/`sizes`
  should be used from the start rather than shipping a single
  desktop-resolution file to mobile connections.
- **`loading="lazy"`:** already applied to marquee logo images; should be
  applied to any new below-the-fold image (institution collage, testimonial
  photos) as a default, reserving eager-loading for only the hero's own
  above-the-fold visual.
