# Section Library — OER Peer Review Hub

Status: **documentation.** Each pattern below is either (a) an existing,
production component being formalized as a reusable section contract, or
(b) a new pattern proposed for the landing page in
`LANDING_PAGE_ARCHITECTURE.md`, clearly marked **[NEW]**. Tokens referenced
are defined in `DESIGN_SYSTEM.md`; motion specs referenced are defined in
`MOTION_SYSTEM.md` — this document does not restate either, it composes
them into section-level contracts a coding agent can implement directly.

---

## Announcement Bar `[NEW]`

- **Appropriate use:** A single, time-bound, dismissible message above the
  nav (e.g., "New: partner logos live," a launch announcement, a maintenance
  notice). Premium SaaS sites use this for exactly one message at a time.
- **Inappropriate use:** Marketing copy that isn't genuinely time-bound
  (that belongs in the hero). Multiple simultaneous messages (rotate or
  drop, never stack). Anything that can't be dismissed — a permanently
  present bar competes with the nav for the top-of-page role.
- **Required content:** One short message (≤ 80 characters), one dismiss
  control.
- **Optional content:** An inline link/CTA within the message text.
- **Layout rules:** Full-width, sits above `Header`, `~36-40px` height,
  centered text, dismiss control right-aligned. Must not push the nav's own
  height calculation — `Header.jsx` currently hardcodes `height: 50` for
  itself; an announcement bar is a separate stacked element, not a nav
  modification.
- **Animation rules:** Entrance: none needed (present on load, not a
  reveal). Dismiss: height + opacity collapse, 220ms (`--dur-med`),
  `--ease-out`, content fades before the height collapses (same ordering
  principle as `RubricMethod`'s panel-close in `MOTION_SYSTEM.md`).
- **Responsive behavior:** Message text truncates or wraps to a second line
  only if unavoidable — prefer shortening copy over allowing a two-line bar
  on mobile (per the no-two-line-clickable-text discipline, even though this
  isn't a button, a two-line announcement bar reads as a layout defect at
  320-375px).
- **Accessibility rules:** `role="region"` with `aria-label`, dismiss button
  needs a real accessible name ("Dismiss announcement," not an icon alone).
  Once dismissed, persist the choice (localStorage or session) so it
  doesn't reappear on every navigation within the same visit.
- **Suggested component boundaries:** `src/components/layout/
  AnnouncementBar.jsx`, rendered by `Layout.jsx` above `Header`, not inside
  it — keeps it swappable/removable independent of nav structure.
- **Data requirements:** Real message content only — **do not fabricate** a
  launch/update announcement. This component should ship with zero default
  content and be opt-in per deploy, not pre-filled with placeholder copy
  that could accidentally ship live.

---

## Product Hero

- **Appropriate use:** The homepage's above-the-fold section, and any other
  page that needs to establish "here's the product, working" in one
  viewport (the existing `/solution` hero already does this with
  `ReviewConsoleDemo`).
- **Inappropriate use:** Interior/utility pages (Browse, Resource Detail) —
  those need task-focused headers, not a persuasive hero; `Browse.jsx`'s
  simple search-bar header is correctly *not* this pattern.
- **Required content:** H1 (≤7 words/≤50 characters if newly authored — see
  `typography.md`-derived sizing rule in `DESIGN_SYSTEM.md`), one-sentence
  subhead, primary CTA.
- **Optional content:** Secondary CTA, product visual (video/demo/
  screenshot), eyebrow label (off by default per the section-tag
  discipline — only justified if genuinely ordinal/contextual).
- **Layout rules:** Two-column split (copy + visual) at desktop, single
  column stacked at tablet/mobile — see `LANDING_PAGE_ARCHITECTURE.md` §1
  for the full breakpoint-specific spec. Container matches the page's
  standard `1280px` max-width.
- **Animation rules:** Entrance fade-up on mount (not scroll-triggered,
  since this is always the first visible content) — see
  `MOTION_SYSTEM.md` § Entrance animation, 450ms/`--ease-out`. Product
  visual (if video): `MOTION_SYSTEM.md` § Product-demo transitions.
- **Responsive behavior:** CTA buttons stack full-width below ~480px (no
  two-line button text). Visual asset maintains intrinsic aspect ratio at
  every width — never crops awkwardly or gets replaced by a different
  asset at smaller sizes.
- **Accessibility rules:** Exactly one real `<h1>` per page. If the visual
  is a video, it must be `muted` and not auto-play sound; if it's a static
  image, it needs descriptive `alt` text (not `alt=""`) unless the
  surrounding copy already fully describes its content.
- **Suggested component boundaries:** Page-level composition (not a shared
  component) — the hero's copy is inherently page-specific, but it should
  compose the existing `Button` and (where applicable) `ReviewConsoleDemo`
  rather than reimplementing either.
- **Data requirements:** Copy must be real/approved (no invented product
  claims). If a video/screenshot is used, it must show the actual product
  UI, not a mockup styled to look real (`ReviewConsoleDemo`'s own CSS mock
  fallback is explicitly `aria-hidden` and only shown when the real video
  is unavailable — never present the mock as if it were live product
  footage).

---

## Partner Logo Marquee

- **Appropriate use:** Trust/social-proof display of real named partners,
  early in a page (already used this way on Home) or as a lighter-weight
  echo later in a page (e.g., footer-adjacent).
- **Inappropriate use:** Fewer than ~6 logos (a marquee implies "more than
  fits" — a short list should render as a static row instead, no scroll
  needed). Logos the Hub doesn't have real permission/relationship to
  display.
- **Required content:** Partner name + logo image per entry (real data from
  `src/data/partners.js` — 13 entries currently).
- **Optional content:** A short label/heading above the marquee ("Our
  Partners," existing copy).
- **Layout rules:** Full-width, `72px` fixed-height logo tiles at desktop
  (existing `PartnerLogoMarquee` values), edge fade-gradient masks at both
  sides, `168px` tile width per logo — see `DESIGN_SYSTEM.md` for exact
  token values, this section already has a correct, reusable implementation.
- **Animation rules:** See `MOTION_SYSTEM.md` § Marquee behavior in full —
  `linear infinite`, 32s default duration, pause on hover/focus, static
  wrapped fallback under reduced motion. Already implemented correctly;
  reuse verbatim, do not modify.
- **Responsive behavior:** Existing 900px/640px breakpoints reduce tile
  size and gap — see `RESPONSIVE_BEHAVIOR.md` for whether these should be
  reconciled with the page's broader breakpoint set.
- **Accessibility rules:** `role="region"` + `aria-label="Partner
  organizations"`, `tabIndex={0}` for keyboard-triggered pause, real `alt`
  text on the primary (non-duplicate) track, `alt=""` on the decorative
  duplicate track. Already correct in `PartnerLogoMarquee.jsx`.
- **Suggested component boundaries:** `src/components/content/
  PartnerLogoMarquee.jsx` (existing — reuse directly, no new component
  needed).
- **Data requirements:** `partners.js`'s existing `{ name, logo, alt }`
  shape. Every entry must be a real, current partner — do not pad the list
  with aspirational/pending partners to make the marquee feel longer.

---

## Product Demonstration

- **Appropriate use:** Showing the actual working product UI in motion —
  the hero (see Product Hero above) or a dedicated mid-page section
  explaining a specific workflow moment.
- **Inappropriate use:** A stand-in for content that could be stated in
  text more clearly and quickly (a demo of a simple toggle isn't worth a
  video). Fake/re-drawn UI chrome standing in for a real screen recording —
  never construct a fake browser/app frame; `ReviewConsoleDemo`'s own code
  comment is explicit: "Rounded bordered frame only — no fake browser
  chrome."
- **Required content:** A real screen-recorded video (`.mp4`, H.264+AAC)
  showing actual product UI, OR (fallback tier, per Hallmark's enrichment
  hierarchy referenced in prior work on this project) a hand-built CSS/SVG
  mock **only** as a loading/error fallback, never presented as the primary
  asset.
- **Optional content:** A poster/still frame for pre-load state (optional —
  the component can auto-capture frame 0 if none is supplied, existing
  behavior).
- **Layout rules:** Bordered frame (hairline border, existing pattern),
  aspect ratio derived from the real video's own metadata at runtime, not
  hardcoded.
- **Animation rules:** See `MOTION_SYSTEM.md` § Product-demo transitions in
  full. `IntersectionObserver`-gated play/pause, muted/looped/`playsInline`,
  reduced-motion → static captured frame instead of removing the asset
  entirely.
- **Responsive behavior:** `preload="metadata"` keeps mobile data cost low
  until the element is actually in view; aspect-ratio-based sizing prevents
  layout shift at any width.
- **Accessibility rules:** `muted` (no unexpected audio), descriptive
  `aria-label` on the container describing what the demo shows (existing
  pattern: `"O4PR Review Console — annotate OER text with evidence bound to
  a rubric criterion"`).
- **Suggested component boundaries:** `src/components/how-it-works/
  ReviewConsoleDemo.jsx` (existing — reusable as-is for any section needing
  this exact video, or as the direct pattern to replicate for a
  second/different demo clip per LP-OD-4).
- **Data requirements:** A real screen recording. This is an **asset
  dependency, not a data dependency** — see `REFERENCE_AUDIT.md` § Evidence
  still needed for what recording(s) would need to be produced.

---

## Three-Step Workflow

- **Appropriate use:** A condensed, teaser-level explanation of a longer
  process that has its own full explanation elsewhere (the existing
  Lifecycle/Quality grids on Home condense `/solution`'s 7-step
  `ProcessSpine`; the proposed §4 in `LANDING_PAGE_ARCHITECTURE.md`
  consolidates both into one authoritative 3-step version).
- **Inappropriate use:** As a replacement for the full process explanation
  — this pattern must always link out to the complete version, never claim
  to be exhaustive.
- **Required content:** Exactly 3 steps (the pattern's name is load-bearing
  — a 4th or 2nd step should use a different pattern, like the existing
  4-column grid pattern already on Home, not be forced into this one),
  each with a number, short title, one-sentence description.
- **Optional content:** An icon per step (existing inline SVGs —
  `UploadIcon`, `UsersIcon`, `RefreshIcon`, `CheckCircleIcon` — are real,
  reusable prior art for this), a connecting line/rail between steps.
- **Layout rules:** 3-column grid at desktop (`repeat(3, 1fr)`, `24px` gap
  — matching the existing 4-column grid's gap value for consistency), single
  column at mobile.
- **Animation rules:** Stagger entrance, 3 items, `90ms` interval — see
  `MOTION_SYSTEM.md` § Stagger behavior.
- **Responsive behavior:** Single column below ~768px, full-width cards,
  generous vertical gap (not the tight `24px` grid-gap value carried over
  from desktop — vertical rhythm should increase when the layout goes
  single-column, per `RESPONSIVE_BEHAVIOR.md`).
- **Accessibility rules:** Semantic `<ol>` (ordered list) even though the
  visual is a grid — step order is meaningful and should be announced as
  such.
- **Suggested component boundaries:** New `src/components/content/
  StepGrid.jsx` (or similar) taking a `steps` prop array — generalizing the
  pattern already inline in `Home.jsx`'s `LIFECYCLE_STAGES`/
  `QUALITY_STAGES` rendering rather than continuing to hand-roll grid JSX
  per page.
- **Data requirements:** Step copy condensed from `ProcessSpine.jsx`'s real
  `STEPS` array — see LP-OD-9 in `LANDING_PAGE_ARCHITECTURE.md` for the
  required product sign-off on the exact 7→3 grouping.

---

## Role-Based Tabs

- **Appropriate use:** Presenting genuinely different content per audience
  segment where the segments are mutually exclusive and few (2-4) — the
  existing `RoleToggle` (Author/Reviewer on `/solution`) is direct prior
  art, extendable to a 3rd role (Institution) for the landing page.
- **Inappropriate use:** More than ~4 roles (becomes a menu, not a toggle).
  Content that's mostly the same across roles with minor wording changes —
  if 80% of the content is shared, don't fragment it into tabs, state it
  once and only branch the CTA.
- **Required content:** A tab/chip control (2-4 options), one content panel
  per option.
- **Optional content:** A role-specific CTA per panel (see
  `LANDING_PAGE_ARCHITECTURE.md` §5, LP-OD-10 for destination
  requirements).
- **Layout rules:** Tab control above the content panel, `FilterChip`-based
  (existing component, existing visual language — pill chips, selected
  state via `--brand-primary-subtle` background).
- **Animation rules:** Reuse `RubricMethod`'s exact swap sequence — content
  fade-out (160ms) → height eases to new panel's measured height (480ms) →
  content fades in (200ms delay) — see `MOTION_SYSTEM.md` § Tab transitions
  and § Exit animation for the full timing breakdown. This is the one
  pattern in the whole package explicitly specified to copy an existing
  implementation's timing verbatim rather than deriving new values.
- **Responsive behavior:** Chips wrap to a second row if they don't fit one
  line (existing `flexWrap` behavior) — verify 3-4 chips fit one line down
  to ~375px before relying on wrap.
- **Accessibility rules:** Full ARIA tabs pattern — `role="tablist"`,
  `role="tab"` with `aria-selected`/`aria-controls`, `role="tabpanel"` with
  `aria-labelledby` (existing `RubricMethod` implementation already does
  this correctly for `aria-expanded`/`aria-controls`, but **is missing
  keyboard arrow-key roving focus** between tabs per the ARIA APG pattern —
  this is a real gap to close in the new implementation, not carry
  forward).
- **Suggested component boundaries:** Generalize `RoleToggle.jsx` (2-role,
  `/solution`-specific) into a shared `RoleTabs.jsx` accepting an arbitrary
  `roles` array + `panels` render map, used by both `/solution` and the new
  landing-page §5 — avoids diverging implementations of the same pattern.
- **Data requirements:** Real, distinct value-proposition copy per role.
  Must not reuse the exact same sentence reworded three times — if the
  content doesn't meaningfully differ per role, this is the wrong pattern
  (see Inappropriate use above).

---

## Sticky Feature Narrative `[NEW — composed from two existing techniques]`

- **Appropriate use:** Explaining several parallel, roughly-equal-weight
  facets of one system (the six O4PR rubrics is the concrete case — see
  `LANDING_PAGE_ARCHITECTURE.md` §6) where a visitor benefits from seeing
  "which facet am I reading about" persist while they scroll through
  detail.
- **Inappropriate use:** Sequential/ordinal content (that's the Three-Step
  Workflow or a `ProcessSpine`-style scroll-lerp pattern instead — sticky
  narrative implies "these are siblings," not "these happen in order").
  Fewer than ~4 items (not enough content to justify sticky scroll
  overhead — a static list is simpler and equally effective).
- **Required content:** A left-rail list of item labels (4-8 items), a
  right-column detail block per item.
- **Optional content:** Sample sub-content per item (e.g., 1-2 example
  criteria per rubric, drawn from real `rubricPanels.js` data).
- **Layout rules:** Desktop: sticky left rail (`position: sticky`, same
  `top` offset technique as `ResourceDetail.jsx`'s existing sidebar) +
  scrolling right column. Below ~900px: non-sticky stacked fallback (see
  `RESPONSIVE_BEHAVIOR.md` § Sticky-layout fallback) — this breakpoint
  matches `PartnerLogoMarquee`'s existing 900px cutover for consistency
  across the page.
- **Animation rules:** Active-rail-item highlight via `IntersectionObserver`
  on each right-column block (binary active/inactive, not a continuous
  lerp — see `MOTION_SYSTEM.md` § Sticky-scroll transitions for why the
  simpler technique is right-sized here vs. `ProcessSpine`'s full
  focus-lerp). Crossfade: `400ms`/`--ease-out`, matching `RoleToggle`'s
  existing active-chip crossfade duration.
- **Responsive behavior:** Non-sticky stacked fallback on tablet/mobile —
  each item becomes its own full-width card in the same order, no content
  lost, just the sticky mechanic removed.
- **Accessibility rules:** `position: sticky`, never `position: fixed` (must
  scroll away naturally at section end, not trap in viewport indefinitely).
  Clicking a rail item should scroll-jump to its detail block and this must
  work with JS disabled too (real anchor-link fallback, not a JS-only
  handler) since the underlying content should be static-renderable HTML.
- **Suggested component boundaries:** New `src/components/content/
  StickyNarrative.jsx`, generic over an `items` array of `{ label, content
  }` — reusable beyond just the rubrics section if a similar need arises
  elsewhere later.
- **Data requirements:** Real data only — for the concrete rubrics use
  case, source directly from `src/components/how-it-works/
  rubricPanels.js`'s existing `RUBRIC_PANELS` (summary + covers fields),
  do not re-author new rubric descriptions.

---

## Metrics Strip

- **Appropriate use:** A short row of real, current numbers that
  contextualize scale (resource count, reviewer count, institution count) —
  the existing Home "Stats" section is this pattern, currently populated
  with explicitly-labeled demo data pending real figures.
- **Inappropriate use:** Fabricated or unverifiable numbers presented as
  fact (per this project's own established honest-copy convention). Vanity
  metrics with no real meaning to the visitor ("10,000+ API calls" means
  nothing to an OER adopter).
- **Required content:** 3-5 number+label pairs.
- **Optional content:** A demo-data disclosure badge/caption, as currently
  implemented on Home (`Badge variant="secondary"` + explanatory caption —
  existing, real pattern, keep it whenever the underlying numbers aren't
  yet live).
- **Layout rules:** Horizontal grid, equal-width columns
  (`repeat(N, 1fr)`), large display-weight number + small muted label
  underneath — existing Home implementation is the correct reference.
- **Animation rules:** Optional count-up-on-scroll (number animates from 0
  to its final value as it enters the viewport) is a common premium-SaaS
  touch, but **has no existing precedent in this codebase and is not
  required** — if added, cap at 800-1000ms per number, `--ease-out`,
  triggered once via `IntersectionObserver`, and it must respect reduced-
  motion by rendering the final number immediately rather than animating
  the count.
- **Responsive behavior:** Reduce from `repeat(4, 1fr)` to `repeat(2, 1fr)`
  at tablet, single column at mobile — no existing breakpoint does this
  today (confirmed no `@media` in `Home.jsx`), a genuine gap to fix (see
  `RESPONSIVE_BEHAVIOR.md`).
- **Accessibility rules:** If numbers are demo/illustrative, the disclosure
  text must be programmatically associated with the numbers (adjacent in
  DOM order, not just visually nearby) so screen-reader users get the same
  "this isn't live data" context sighted users get from the badge.
- **Suggested component boundaries:** Extract into `src/components/content/
  MetricsStrip.jsx` (currently inline JSX in `Home.jsx` — generalizing it
  makes the "is this real or demo data" disclosure pattern consistent
  anywhere metrics appear, rather than re-implemented ad hoc).
- **Data requirements:** Real numbers when available; explicitly labeled
  demo data (current state) otherwise. Never silently swap from labeled-
  demo to unlabeled-real without an explicit content review — the
  transition itself should be a deliberate, reviewed change.

---

## Testimonial Section `[NEW — no content currently exists]`

- **Appropriate use:** A specific, attributed quote from a real
  author/reviewer/institution about a concrete experience with the Hub —
  strengthens §8 Community & Trust once real quotes exist.
- **Inappropriate use:** **Right now, on this project, today** — there is
  no real testimonial content anywhere in the codebase or data layer
  (confirmed by inspection). Do not fabricate one. This pattern is
  documented for when real content becomes available, not to be
  implemented with placeholder quotes in the meantime (per this project's
  established honest-copy discipline).
- **Required content (once real):** Quote text, attributed name, role,
  institution/affiliation — never an anonymous or generic
  "Engineering Manager"-style placeholder role.
- **Optional content:** A photo (only if the person has given permission
  for their photo to be used — do not default to including one).
- **Layout rules:** Single large quote (pull-quote style) or a 2-3 card
  row — decision depends on how many real quotes exist at implementation
  time; a single quote should not be padded into a fake 3-card grid with
  invented filler.
- **Animation rules:** Fade-up entrance only, consistent with other content
  sections — no special treatment.
- **Responsive behavior:** Single column at all widths if only 1-2 quotes
  exist; grid-to-stack collapse if 3+.
- **Accessibility rules:** Use `<blockquote>` with `<cite>` for proper
  semantic quotation, not a styled `<div>`.
- **Suggested component boundaries:** `src/components/content/
  TestimonialCard.jsx` — does not exist yet, create only when real content
  is ready to populate it.
- **Data requirements:** Real, attributable quotes with explicit permission
  to publish. See `REFERENCE_AUDIT.md` § Evidence still needed and
  `LANDING_PAGE_ARCHITECTURE.md` LP-OD-13.

---

## Community Collage `[NEW — partial precedent]`

- **Appropriate use:** A visual sense of "many real people/institutions
  participate," beyond a logo list — e.g., a grid mixing institution logos
  (real, existing) with role/activity indicators.
- **Inappropriate use:** Stock photography of generic "students" or
  "professors" standing in for the Hub's actual community — this project
  has no real photography asset pipeline and per Hallmark's own
  placeholder-imagery discipline, invented stock photos must never be
  presented as if they were the final design.
- **Required content:** Real institution data (existing `PARTNERS`/
  `InstitutionCard`, already used on `Community.jsx`).
- **Optional content:** Real project cards (existing `ProjectCard`
  component — note one of the two current instances on `Community.jsx` is
  itself a placeholder, "Project Name"/"firstname lastname" — do not treat
  that placeholder card as real content to reuse on the landing page).
- **Layout rules:** `repeat(auto-fit, minmax(200px, 1fr))` grid — existing
  `Community.jsx` pattern, reusable.
- **Animation rules:** Stagger entrance, same family as Three-Step Workflow
  (90ms interval, capped at 6 items' worth of delay for longer lists — see
  `MOTION_SYSTEM.md` § Stagger behavior).
- **Responsive behavior:** `auto-fit`/`minmax` already reflows naturally;
  verify `minmax(200px, 1fr)` doesn't force horizontal overflow below
  ~400px viewport width (may need `minmax(0, 1fr)` or a smaller floor — see
  `RESPONSIVE_BEHAVIOR.md` § Overflow prevention).
- **Accessibility rules:** Real `alt` text per logo (existing, correct
  pattern via `InstitutionCard`).
- **Suggested component boundaries:** Reuse existing `InstitutionCard.jsx`
  and `ProjectCard.jsx` directly — no new component needed, only a new
  page-level composition for the landing page's condensed version (see
  LP-OD-14 on whether to condense-and-link vs. duplicate `Community.jsx`'s
  full content).
- **Data requirements:** `src/data/partners.js` (real, 13 entries) for
  institutions. Real project data for `ProjectCard` — the current
  placeholder second card must not be copied onto the landing page as if
  it were a real example.

---

## FAQ `[NEW — no content currently exists]`

- **Appropriate use:** Answering genuine, recurring visitor
  questions/objections in the visitor's own words, late in the page after
  the main argument has been made.
- **Inappropriate use:** Restating marketing copy as a fake question
  ("Why is peer review important?" answered with a sales pitch) — a real
  FAQ answers like a person, specific and direct, per the Hallmark
  section-sequence guidance already referenced in prior work on this
  project ("Yes — Stripe and Adyen are both supported" beats "Our platform
  integrates with leading payment providers").
- **Required content:** 5-10 real question/answer pairs.
- **Optional content:** Category grouping if the question count grows past
  ~10.
- **Layout rules:** Single column, collapsible accordion rows — reuse
  `RubricMethod`'s existing height-animated disclosure mechanism (same
  480ms/160ms/200ms sequence) rather than building a second accordion
  implementation.
- **Animation rules:** Identical to Role-Based Tabs' disclosure sequence —
  see `MOTION_SYSTEM.md` § Exit animation / Tab transitions.
- **Responsive behavior:** Single column at every width already (no
  breakpoint-specific change needed for a vertically-stacked accordion).
- **Accessibility rules:** Each question is a real heading (`<h3>` inside
  the accordion trigger) with `aria-expanded`; answer region has
  `aria-hidden` toggled with the same discipline as `RubricMethod`'s panel
  shell.
- **Suggested component boundaries:** Extract the disclosure mechanics from
  `RubricMethod.jsx` into a shared `Accordion.jsx` (or
  `DisclosureGroup.jsx`) usable by both the rubric method panel and a new
  FAQ section, rather than a third hand-rolled implementation of the same
  height-animation logic.
- **Data requirements:** Real questions — ideally sourced from actual
  support/inquiry patterns (e.g., recurring questions from the About page's
  contact form, once real submissions exist) rather than invented
  hypotheticals.

---

## Final CTA

- **Appropriate use:** The single conversion moment before the footer —
  the existing Home "Institutions CTA" band is correct prior art for this
  pattern's visual treatment.
- **Inappropriate use:** More than one button. Repeating this treatment
  more than once per page (its rarity is what makes it read as "the"
  closing moment — see `LANDING_PAGE_ARCHITECTURE.md` §9).
- **Required content:** Short headline, one supporting sentence, exactly
  one button.
- **Optional content:** None — this pattern is deliberately minimal.
- **Layout rules:** Full-width ink-fill band (`background: var(--brand-
  primary)`), flex row (copy left, button right) at desktop, stacked at
  mobile — existing Home implementation.
- **Animation rules:** Fade-up entrance only, no special treatment — see
  `MOTION_SYSTEM.md` § Entrance animation.
- **Responsive behavior:** `flexWrap: wrap` already handles reasonable
  reflow (existing behavior); button becomes full-width below ~480px.
- **Accessibility rules:** Button must be the `secondary` (outline pill)
  variant against the ink fill, never `primary` (which would render
  ink-text-on-ink-fill and fail contrast) — existing implementation already
  gets this right, preserve it.
- **Suggested component boundaries:** Page-level composition reusing
  `Button` — no dedicated component needed, this is simple enough to stay
  inline, consistent with its current implementation.
- **Data requirements:** Real, confirmed destination for the CTA button
  (see LP-OD-15 — avoid a placeholder `href` shipping to production).
