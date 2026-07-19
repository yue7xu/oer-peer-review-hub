# Motion System — OER Peer Review Hub

Status: **documentation, proposal where new.** Part A inventories motion
that already exists in the codebase, verified by reading component source —
nothing in Part A is inferred or assumed. Part B extends that vocabulary
into a complete system for the landing page proposed in
`LANDING_PAGE_ARCHITECTURE.md`, reusing Part A's real timings wherever a
pattern already has precedent rather than inventing new numbers.

No motion library is installed (`package.json` dependencies:
`react`, `react-dom`, `react-router-dom` only — no `framer-motion`, `gsap`,
`motion`, `lenis`, `lottie-react`, `@react-spring/*`). Every animation in
this codebase today is **CSS transitions/keyframes plus vanilla
`IntersectionObserver`/`requestAnimationFrame`.** This document assumes that
constraint continues — nothing here requires a new dependency (and
`CLAUDE.md`'s task instructions for the current work explicitly prohibit
installing one).

## Motion principles

1. **Motion confirms, it doesn't decorate.** Every pattern below exists to
   answer a real question: did my click register (hover/focus feedback),
   where am I in a sequence (progress rail, tab indicator), is this the
   active item (role toggle, sticky-rail highlight), did new content arrive
   (entrance/stagger). If a proposed animation doesn't answer one of those,
   cut it — this is the same discipline the existing codebase already
   follows (`ReviewTimeline`, for example, is deliberately static; its own
   code comment states "no scroll-triggered animation" is intentional for
   an audit-trail component).
2. **Two motion families, not one.** (a) **State feedback** — hover, focus,
   active, toggle — always fast (150ms), always `--ease-out`. (b) **Content
   choreography** — entrance, reveal, disclosure — slower (220-600ms),
   scoped to `--ease-out` for things entering/settling and `--ease-in-out`
   for things swapping in place. Never blend the two families' timings.
3. **Every scroll- or load-triggered animation ships a
   `prefers-reduced-motion: reduce` fallback that shows the same final
   state instantly.** This is already true of every existing animated
   component in the codebase (`PartnerLogoMarquee`, `ProcessSpine`,
   `RubricMethod`, `ReviewConsoleDemo`) — the new landing page must match
   that 100% coverage, not fall short of the bar the existing app already
   clears.
4. **Animate `transform` and `opacity` first.** Every existing entrance/
   reveal pattern in the codebase already follows this (see Part A) — the
   one exception, `RubricMethod`'s JS-measured `height` animation, is a
   deliberate, justified exception for a disclosure panel where `height:
   auto` cannot be transitioned in CSS alone, not a precedent to copy
   casually elsewhere.
5. **Nothing loops forever except the partner marquee.** A continuous
   `linear infinite` animation is appropriate exactly once on this page — a
   logo marquee, where "wallpaper" motion communicates "there's more here."
   Applying the same treatment to anything else (a looping product video,
   for instance) risks becoming visual noise; `ReviewConsoleDemo`'s ambient
   loop is the sole other continuous-motion element and it already pauses
   out of viewport — a deliberate exception, not a pattern to generalize.

## Duration tokens

Current state (`src/design-system/tokens/spacing.css`) has only two:

```css
--dur-short: 150ms;  /* state feedback: hover, focus, active */
--dur-med:   220ms;  /* tab-indicator slide, small transitions */
```

Every longer duration found in the codebase is a **hard-coded literal**
inside a component's own CSS string, not a token. This document proposes
promoting them into the shared scale below — implementing this promotion is
a code change (out of scope for this documentation task), but the values
themselves are drawn directly from existing, working code, not invented:

| Proposed token | Value | Real precedent (file:line) |
|---|---|---|
| `--dur-short` | 150ms | *(existing)* Button/chip/input hover-focus, everywhere |
| `--dur-med` | 220ms | *(existing)* `AnimatedTabBar` indicator slide |
| `--dur-cross` | 400ms | `RoleToggle`/`hiwStyles.js` active-chip background+color crossfade |
| `--dur-long` | 450ms | `hiwStyles.js` row/badge entrance (opacity+transform), `ProcessStatusPill` scale-in |
| `--dur-panel` | 480ms | `RubricMethod.jsx` `OPEN_MS` — accordion height-open |
| `--dur-reveal` | 600ms | `hiwStyles.js` `.hiw-row` entrance (opacity+translateX) |

Proposed new token for the landing page's stagger pattern (no existing
precedent — see § Stagger behavior):

```css
--dur-stagger-step: 90ms;  /* new — interval between staggered siblings */
```

## Easing tokens

Current state (`spacing.css`), unchanged, all three already correct and
sufficient — no new easing curve is proposed:

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);  /* entrances, reveals, settling */
--ease-in:     cubic-bezier(0.7, 0, 0.84, 0);  /* exits only */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* swaps in place (tab indicator, crossfades) */
```

**Rule, confirmed by auditing every existing usage:** the codebase never
uses the browser default `ease`, never uses a bounce/overshoot curve, and
`--ease-in` is essentially unused in practice (nothing entrance-only exits
today — this app has almost no exit animation at all, see below). The new
landing page should preserve this restraint: `--ease-out` is the workhorse,
`--ease-in-out` is for in-place swaps, `--ease-in` is reserved for the rare
case something needs to accelerate away (a dismissed toast, a closed
drawer) and should not be reached for by default.

## Entrance animation

**Real precedent 1 — `ProcessSpine` row entrance** (`hiwStyles.js:345-350`):
- Purpose: signal a new process step has scrolled into relevance.
- Trigger: `IntersectionObserver`, `threshold: 0.2`, `rootMargin: "0px 0px
  -12% 0px"` (fires slightly before the element is fully in view).
- Properties animated: `opacity` (0→1) + `transform: translateX(±28px)→
  none` (left-side steps slide from -28px, right-side from +28px).
- Duration: 600ms.
- Easing: `--ease-out`.
- Repetition: once per element, never replays (`IntersectionObserver`
  disconnects that entry after first trigger via the `inIds` Set in
  `ProcessSpine.jsx`).
- Mobile behavior: same effect, amplitude reduced implicitly by the
  component's own `amp` calculation (`window.innerWidth <= 820 ? 0.55 : 1`)
  — already scoped for narrower viewports.
- Reduced-motion fallback: all rows marked "in" immediately on mount
  (`setInIds(new Set(STEPS.map(s => s.id)))`), no transform offset applied.
- Accessibility risk: none observed — content is present in the DOM
  regardless of animation state, nothing is hidden from assistive tech
  pending a trigger.

**Real precedent 2 — status pill scale-in** (`hiwStyles.js:441-446`):
- Purpose: draw attention to a newly-revealed status badge within an
  already-visible card.
- Trigger: parent step becoming "in" (chained off the row entrance above).
- Properties animated: `transform: scale(0.94)→scale(1)` + `opacity`.
- Duration: 450ms, with a 200ms delay (so it settles after the row's own
  600ms entrance is underway, not simultaneously).
- Easing: `--ease-out`.
- Repetition: once.
- Mobile behavior: unchanged (no viewport-conditional override observed).
- Reduced-motion fallback: `transform: none` (no scale), per the shared
  reduced-motion block.
- Accessibility risk: none — text content unaffected by the scale.

**Proposed for the new landing page (§3, §4, §7, §9 sections in
`LANDING_PAGE_ARCHITECTURE.md`):**
- Purpose: signal each new section's content is ready to read as it scrolls
  into view — consistent "the page is alive" feedback without being showy.
- Trigger: `IntersectionObserver`, same `threshold: 0.2` /
  `rootMargin: "0px 0px -12% 0px"` values as `ProcessSpine` — reuse exactly,
  don't reinvent the trigger geometry.
- Properties animated: `opacity` (0→1) + `transform: translateY(12px)→
  none` (vertical, not horizontal — horizontal slide is `ProcessSpine`'s
  specific signature for its left/right role columns; a generic section
  fade-up should move vertically, the more common and less attention-
  grabbing choice for content that isn't inherently paired left/right).
- Duration: 450ms (`--dur-long`).
- Easing: `--ease-out`.
- Repetition: once per section, never replays on scroll-back.
- Mobile behavior: same effect; no amplitude reduction needed since 12px is
  already small (unlike `ProcessSpine`'s 28px, which does need the
  narrow-viewport reduction it already has).
- Reduced-motion fallback: element renders at final state immediately, no
  observer attached (short-circuit the same way `ProcessSpine` does).
- Accessibility risk: low. Ensure the `IntersectionObserver` never sets
  `opacity: 0` as the *only* state before JS executes — use a CSS
  `@supports`/no-JS-safe default of `opacity: 1` with JS opting elements
  into the animated `0→1` state, so content is never invisible if JS fails
  to load (this is a real gap: verify `ProcessSpine`'s current
  implementation guards against this — it does, via the `anim` state
  starting `false` and only becoming `true` after the reduced-motion check
  runs client-side; replicate that guard, don't skip it).

## Exit animation

The codebase has almost no exit animation — confirmed by inspection, this
is not an oversight, it reflects an app that rarely removes content from
view (no toasts, no dismissible banners, no modal-close observed in
`src/components/`). The one real exit precedent:

**Real precedent — `RubricMethod` panel collapse** (`RubricMethod.jsx`
`handleChip`, collapse branch):
- Purpose: close an expanded rubric disclosure cleanly.
- Trigger: user clicks the already-active chip.
- Properties animated: content `opacity` fades out first (160ms), *then*
  the shell's `height` eases to 0 (480ms, starting after the content fade).
- Duration: 160ms content-out, 480ms height-close (sequential, not
  simultaneous — this ordering matters: content must be invisible before
  the container starts shrinking, or text visibly clips/reflows mid-close).
- Easing: `--ease-out` for both phases (not `--ease-in`, even though this
  is technically an exit — the existing code uses `--ease-out` throughout,
  which this document treats as the established precedent to follow rather
  than "correct" toward `--ease-in`, since consistency with real working
  code outranks a stricter reading of the principle above).
- Repetition: once per collapse action.
- Mobile behavior: unchanged.
- Reduced-motion fallback: instant — `shell.style.transition = "none"`,
  height set directly, no sequencing at all.
- Accessibility risk: `aria-hidden={!expanded}` is already toggled
  correctly on the shell (`RubricMethod.jsx`), confirm any new
  disclosure component copies this rather than only hiding visually.

**Proposed:** the new landing page's role-tab swap (§5) reuses this exact
sequence verbatim (see `LANDING_PAGE_ARCHITECTURE.md` §5 Motion behavior) —
no new exit pattern is being introduced by this document.

## Hover and focus feedback

Real precedent, universal across `Button`, `FilterChip`, `Input`, `Select`,
`Checkbox`, `AnimatedTabBar` links, `ResourceCard`:

- Purpose: confirm an interactive element registered the pointer/keyboard.
- Trigger: `:hover`, `:focus-visible`, `:active` pseudo-classes (native CSS,
  no JS).
- Properties animated: `background-color`, `border-color`, `color` (never
  `transform` — the system's buttons and chips do not scale or lift on
  hover, confirmed across every component read; `ResourceCard` is the one
  exception, animating `box-shadow` on hover, not transform).
- Duration: 150ms (`--dur-short`), universal.
- Easing: `--ease-out`, universal.
- Repetition: continuous/stateful (re-triggers every hover/focus/blur
  cycle, not a one-shot).
- Mobile behavior: `:hover` has no effect on touch — `:active` and
  `:focus-visible` carry the feedback burden on touch devices. No component
  currently has a touch-specific fallback beyond relying on `:active`,
  which is sufficient here (these are all simple color-state changes, not
  hover-dependent reveals).
- Reduced-motion fallback: **not required** — color/border transitions at
  150ms are not the kind of motion `prefers-reduced-motion` targets (per
  WCAG 2.3.3's own scope, which concerns large-scale movement/parallax, not
  micro-feedback). Confirmed the existing codebase does not gate these
  behind the media query either — consistent, correct.
- Accessibility risk: `:focus-visible` must always render a visible ring at
  ≥3:1 contrast and must **never be animated in** (it should appear
  instantly on focus, not fade/transition) — verify every new interactive
  element in the landing page follows the existing `outline: 2px solid
  var(--interactive-focus); outline-offset: 2px` pattern used everywhere
  today, with no `transition` property applied to `outline`.

## Stagger behavior

**No existing precedent in the codebase.** `ProcessSpine`'s row-by-row
reveal is driven by real scroll position via `IntersectionObserver`, not a
fixed JS/CSS stagger interval — each row animates independently when it
individually crosses the trigger threshold, which produces a stagger-like
effect but is architecturally different from a true stagger (a group
revealing together with a fixed per-item delay). This document proposes the
first real stagger pattern for sections where all items enter the viewport
at once (§4 Three-Step Workflow, §8 Community institution grid):

- Purpose: make a group of equal-weight items (3 workflow steps, N
  institution cards) feel like one composed reveal rather than N
  independent pop-ins.
- Trigger: parent container's `IntersectionObserver` entry (single
  observer on the section, not one per child).
- Properties animated: same as § Entrance animation (`opacity` +
  `translateY(12px)→none`) per child.
- Duration: 450ms per item (`--dur-long`), **staggered** by
  `--dur-stagger-step` (90ms) between siblings — implemented via CSS
  `transition-delay: calc(var(--stagger-index) * 90ms)` with
  `--stagger-index` set inline per child (`style={{ "--stagger-index": i
  }}`), not a JS `setTimeout` chain.
- Easing: `--ease-out`.
- Repetition: once, on first viewport entry of the group.
- Mobile behavior: cap total stagger spread — for a 3-item group, max
  delay is 180ms (negligible); for a larger group (institution grid could
  be 13 items), cap the stagger at **6 items' worth of delay** (540ms) and
  have any items beyond that animate simultaneously with the 6th, so a
  long list doesn't make a mobile visitor wait a full second-plus for the
  last card to appear while scrolling past it.
- Reduced-motion fallback: `transition-delay: 0` and no transform/opacity
  animation at all — all items present at final state immediately, same as
  every other entrance pattern in this document.
- Accessibility risk: verify content order in the DOM matches visual
  stagger order (left-to-right, top-to-bottom) so screen-reader reading
  order isn't scrambled relative to the visual reveal sequence.

## Marquee behavior

**Real precedent — `PartnerLogoMarquee`** (already production-quality, no
changes proposed, documented here for completeness since the landing page
reuses it directly):

- Purpose: signal "there are more partners than fit on screen" via
  continuous motion, a wallpaper effect rather than a message to read.
- Trigger: mount (`animation: ... infinite`), no scroll trigger needed.
- Properties animated: `transform: translateX(0)→translateX(-50%)` on a
  track containing the logo set duplicated once (so -50% is exactly one
  full seamless loop).
- Duration: 32s default (component prop, caller-configurable via
  `duration`), `linear` timing function (**not** one of the three
  `--ease-*` tokens — a continuous loop must be linear, easing it would
  produce a visible speed-up/slow-down stutter at the loop seam).
- Easing: `linear` (explicit exception to every other pattern in this
  document — documented here so it isn't "corrected" to `--ease-out` by
  mistake in a future implementation).
- Repetition: `infinite`.
- Mobile behavior: existing breakpoints (900px, 640px) already reduce logo
  tile size and gap, keeping more logos legible per screen width — no
  further change proposed.
- Reduced-motion fallback: `animation: none`, track becomes `flex-wrap:
  wrap`, duplicate group `display: none`, edge-fade masks hidden — a fully
  static, wrapped, non-repeating grid. Already implemented correctly.
- Accessibility risk: already mitigated — `role="region"` +
  `aria-label`, pauses on `:hover` and `:focus-within`/`:focus-visible`
  (a keyboard user tabbing through the page can stop the motion), `tabIndex
  ={0}` makes the region itself focusable to trigger the pause without
  needing to focus a specific logo.

## Tab transitions

**Real precedent 1 — `AnimatedTabBar`** (nav underline):
- Purpose: show which nav destination is active with continuity between
  route changes, not just a static highlight.
- Trigger: route change (`useLocation`), also re-measures on window
  `resize`.
- Properties animated: `left` + `width` of an absolutely-positioned
  indicator span, measured from the active link's real
  `getBoundingClientRect()` (not guessed from index/font metrics — this
  matters, it's why the indicator tracks correctly even with variable-width
  labels and late font loads).
- Duration: `--dur-med` (220ms) for `left`/`width`; `--dur-short` (150ms)
  for `opacity` (indicator fades in once its position is known, avoiding a
  flash-from-0 on first paint).
- Easing: `--ease-out` for position, `--ease-out` for opacity too (single
  easing family, not mixed).
- Repetition: once per route change.
- Mobile behavior: unaffected by viewport width directly, but depends on
  the nav's own mobile treatment (see `RESPONSIVE_BEHAVIOR.md` §
  Navigation behavior) — if nav collapses to a drawer, this indicator
  pattern likely doesn't apply inside the drawer (a vertical link list
  doesn't need a sliding underline) — **`[[email protected]]`** flag for
  the drawer's own interaction design, not reused as-is.
- Reduced-motion fallback: **gap in current implementation** —
  `AnimatedTabBar.jsx` has no `prefers-reduced-motion` check at all; the
  `left`/`width` transition is a small, contained UI element (not a
  large-scale motion), so this is a low-severity gap, but the new landing
  page's tab patterns (§5 role tabs) should not repeat this omission.
- Accessibility risk: the indicator itself is `aria-hidden="true"`
  (decorative), and active state is separately conveyed via the
  `oer-tabbar__link--active` class + real `NavLink` `isActive` — correct,
  the indicator is enhancement, not the sole signal.

**Real precedent 2 — `RubricMethod` chip/panel swap** (see § Exit animation
above for the full sequence) — this is the pattern §5 Role-Based Value
Presentation reuses verbatim.

## Sticky-scroll transitions

**Two distinct existing techniques, not one — do not conflate them:**

**Technique A — plain CSS sticky positioning** (`ResourceDetail.jsx`
sidebar, `position: "sticky", top: 88`):
- Purpose: keep a supporting panel (checkout/details card) in view while
  its related long-form content scrolls.
- Trigger: none (native CSS `position: sticky`, browser-computed).
- Properties animated: none — no transition, the element simply sticks.
- Duration/Easing: n/a.
- Repetition: n/a.
- Mobile behavior: **not verified against a real breakpoint** — sticky
  sidebars are typically disabled on narrow viewports where there's no
  room for a two-column layout at all; `ResourceDetail.jsx`'s grid
  (`gridTemplateColumns: "1fr 340px"`) has no mobile override found in the
  file, meaning the sticky sidebar currently likely breaks or overflows
  below ~700px — flagged as an existing gap for `RESPONSIVE_BEHAVIOR.md`,
  not fixed here.
- Reduced-motion fallback: n/a (no animation to reduce).
- Accessibility risk: low; sticky elements can trap visual attention but
  don't trap keyboard focus (unlike `position: fixed` overlays).

**Technique B — scroll-linked JS effect** (`ProcessSpine`'s focus-lerp):
- Purpose: draw the eye to whichever process-step card is nearest the
  viewport's vertical center, simulating a "focus" as the user scrolls
  through a long list.
- Trigger: `scroll` + `resize` event listeners (passive), throttled via a
  `requestAnimationFrame` tick flag (`ticking` boolean) so work happens at
  most once per frame.
- Properties animated: CSS custom property `--hiw-focus` (0→1), consumed by
  the card's own CSS to drive `transform: translate3d(...) scale(...)`,
  `box-shadow`, and `filter: brightness(...)` simultaneously — all derived
  from the single `--hiw-focus` value, not four separate animations.
- Duration: not a fixed duration — this is a **continuous lerp**, not a
  discrete transition. Each frame, the current focus value moves 16% of
  the remaining distance to its target (`prev + (target - prev) * 0.16`) —
  this produces an exponential ease-toward-target feel without a CSS
  transition at all. Documented here as the literal formula so a future
  implementation reproduces the same "weight," not an approximation.
- Easing: n/a in the CSS sense — the 0.16 lerp factor **is** the easing.
  Given this project's existing curves, 0.16/frame at 60fps settles to
  within 1% of target in ~26 frames (~430ms) — in the same neighborhood as
  the `--dur-long` (450ms) family, which is presumably not a coincidence.
- Repetition: continuous, re-evaluated every scroll frame for as long as
  any card's focus value hasn't settled (the `stillMoving` check keeps the
  rAF loop alive briefly after scroll stops, so the lift eases to rest
  rather than snapping when scrolling stops abruptly).
- Mobile behavior: already scoped — `range`/`amp` constants both branch on
  `window.innerWidth <= 820` (range narrows, amplitude drops to 0.55),
  built into the component today.
- Reduced-motion fallback: entirely bypassed — `--hiw-focus` fixed at `"0"`
  for every card, `will-change` reset to `auto`, no scroll listener
  attached at all (checked once via `prefersReducedMotion()` at mount).
- Accessibility risk: the visual lift/scale carries no information (it's
  pure emphasis, not state) — safe to fully disable under reduced-motion,
  which the component already does. `will-change: transform, box-shadow`
  is set only on animating cards, correctly avoiding a persistent
  compositing cost on cards that aren't currently focused.

**Proposed for the landing page (§6 Sticky Product Narrative):** combine
Technique A (sticky left rail, `position: sticky`, same `top` offset logic
as `ResourceDetail`) with a simpler version of Technique B's trigger
(`IntersectionObserver` on each right-column rubric block, not a
continuous scroll-lerp) — active-state changes are binary (this rubric is
active / not), not a continuous focus value, so the simpler
`IntersectionObserver` approach `ProcessSpine` already uses for its *row
reveal* (not its focus-lerp) is the right-sized precedent, not the full
lerp machinery. See `LANDING_PAGE_ARCHITECTURE.md` §6 for the full spec.

## Product-demo transitions

**Real precedent — `ReviewConsoleDemo`:**
- Purpose: show the real review console in action as ambient proof, without
  demanding the visitor press play.
- Trigger: `IntersectionObserver`, `threshold: 0.25` — video plays only
  while ≥25% visible, pauses otherwise (saves battery/bandwidth off-screen,
  and avoids an ambient video auto-playing somewhere the user has already
  scrolled past).
- Properties animated: this is real video playback, not a CSS/transform
  animation — but the component's *state transitions* (loading → video →
  poster → mock fallback) are worth documenting: video element visibility
  toggles via a `hiw-demo__media--hidden` class rather than
  mount/unmount, avoiding layout thrash during the loading→playing
  handoff.
- Duration: n/a (video is a continuous loop, `loop` attribute, muted,
  `playsInline`).
- Easing: n/a.
- Repetition: `loop` — continuous while in viewport, matching the marquee's
  "ambient wallpaper" register rather than a one-shot demo.
- Mobile behavior: `playsInline` (required for iOS autoplay without
  fullscreen takeover), `preload="metadata"` (doesn't download the full
  file until playback is needed), poster-frame fallback shown first paint.
- Reduced-motion fallback: under `prefers-reduced-motion: reduce`, the
  component **does not skip the video entirely** — it shows a static frame
  (`video.currentTime = 0.05`, captured to canvas as a poster) instead of
  looping playback. This is a more thoughtful fallback than a blanket
  "hide the video" — it preserves the product-proof content while removing
  the motion.
- Accessibility risk: video has no captions/audio (muted, ambient,
  decorative-adjacent) — acceptable since it's illustrative of a UI
  already described in surrounding copy, not conveying unique information
  only available in the video. If the Home hero (§1) reuses or extends this
  component, confirm the same `aria-label` describing what the demo shows
  (existing: `"O4PR Review Console — annotate OER text with evidence bound
  to a rubric criterion"`) is updated if the demo content itself changes
  (see `LANDING_PAGE_ARCHITECTURE.md` LP-OD-4).

## Loading and skeleton behavior

**No skeleton-loading pattern exists anywhere in the codebase** — confirmed
by inspection (`grep` for "skeleton"/"shimmer" returns nothing). All current
data (`RESOURCES`, `PARTNERS`) is bundled statically at build time via
`src/data/*.js` imports, not fetched at runtime, so there has never been a
loading state to design for. This is a **structural gap**, not a missed
detail: the moment any real API call is introduced (live stats, a real
reviewer-assignment feed, a search-as-you-type result list), a loading
state will be needed and none exists to extend.

**Proposed baseline, for when that need arises** (not needed for the static
landing page spec in this document, included for completeness since the
brief asks for it explicitly):
- Purpose: communicate "content is coming" without a layout jump when it
  arrives.
- Trigger: data-fetch pending state.
- Properties animated: background-color pulse between `--surface-subtle`
  and `--color-stone` (both existing tokens — no new color needed).
- Duration: 1200ms per pulse cycle (slow, calm — not a fast strobe).
- Easing: `--ease-in-out` (smooth up-down, not a hard snap).
- Repetition: `infinite` while loading, removed the instant real content
  mounts (no cross-fade needed if the skeleton's shape matches the real
  content's shape — swap should be invisible, not itself an animated
  event).
- Mobile behavior: unchanged.
- Reduced-motion fallback: static `--surface-subtle` fill, no pulse.
- Accessibility risk: skeleton regions must carry `aria-busy="true"` on
  their container and real content must clear it on arrival; a screen
  reader should not attempt to read skeleton placeholder shapes as content.

## Reduced-motion behavior

Global baseline (`src/index.css`):

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

This disables the global smooth-scroll (`html { scroll-behavior: smooth }`,
used for anchor links like the Solution page's `#rubrics` jump target).
**Every component-level animation reviewed in this document additionally
implements its own `prefers-reduced-motion` handling** — this is not
delegated to the global rule alone, and the new landing page must continue
that per-component discipline:

| Component | Reduced-motion behavior |
|---|---|
| `PartnerLogoMarquee` | Static wrapped grid, animation removed, duplicate track hidden |
| `ProcessSpine` | All rows revealed instantly, no lift/scale, no scroll listener attached |
| `RubricMethod` | All height/opacity transitions become instant (`transition: none`) |
| `ReviewConsoleDemo` | Static poster frame instead of looping video |
| `html` (global) | Anchor-link scroll becomes instant, not smooth |

**Rule for new patterns:** check `window.matchMedia("(prefers-reduced-
motion: reduce)").matches` once, synchronously, before attaching any
scroll/observer listener (the existing `prefersReducedMotion()` helper
function, duplicated verbatim across `ProcessSpine.jsx` and
`ReviewConsoleDemo.jsx`, is the precedent to reuse — worth promoting to a
single shared `src/lib/` or `src/hooks/` utility during implementation
rather than continuing to duplicate it a third and fourth time for §4/§6/§8
of the new landing page, though that refactor is a code change out of scope
for this document).

## Performance requirements

1. **No new runtime dependency.** Every pattern in this document is
   achievable with CSS transitions/keyframes + `IntersectionObserver` +
   `requestAnimationFrame`, matching the existing zero-motion-library
   baseline. This is also an explicit constraint of the current
   documentation task.
2. **`will-change` is scoped, not blanket.** `ProcessSpine`'s existing
   pattern — setting `will-change: transform, box-shadow` only while a card
   is actively animating, resetting to `auto` under reduced-motion — is the
   standard to match. A `will-change` applied to every card at all times
   (rather than only the ones currently moving) would cost unnecessary GPU
   memory across a long scroll section; the new §6 sticky narrative and §4/
   §8 stagger groups must scope it the same way.
3. **Scroll listeners are passive and rAF-throttled.** `ProcessSpine`'s
   `{ passive: true }` listener + `ticking` flag pattern (at most one
   `requestAnimationFrame` callback in flight per scroll burst) is the
   required baseline for any new scroll-driven behavior (§6's
   `IntersectionObserver`-driven rail is actually simpler/cheaper than this
   — `IntersectionObserver` doesn't need manual scroll-listener throttling
   at all, which is why it's the recommended technique for §6 over a raw
   scroll handler).
4. **Video stays out of the critical path.** `preload="metadata"` (not
   `auto`), `IntersectionObserver`-gated `play()`, poster-frame first paint
   — all three already true of `ReviewConsoleDemo` and required of any
   additional demo video the landing page introduces (see LP-OD-4).
5. **Stagger and entrance animations must not block first paint.** All
   entrance patterns in this document are scroll/viewport-triggered, not
   load-triggered on the initial hero fold content — the hero's own
   entrance (§1) is the one exception (fires on mount, not scroll), and
   should therefore use the shorter `--dur-long` (450ms) family, not a
   longer duration that would delay perceived readiness.
6. **Marquee images are `loading="lazy"`.** Already true of
   `PartnerLogoMarquee`'s `<img>` tags — preserve this if the marquee moves
   earlier in page order (§2), since "earlier in the DOM" doesn't mean "not
   lazy" when the duplicated second track is always off the visible
   viewport at load.
