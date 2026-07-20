# Landing Page Architecture — OER Peer Review Hub

Status: **proposal, not approved implementation.** This document specifies a
homepage section sequence detailed enough for a coding agent to implement
without inventing structure, but every section below is a design proposal.
Anywhere a decision needs a product or stakeholder call, it is marked
**`[OPEN DECISION LP-OD-#]`** rather than guessed.

This document assumes the tokens and components inventoried in
`DESIGN_SYSTEM.md`, the motion patterns specced in `MOTION_SYSTEM.md`, and
the reusable section contracts in `SECTION_LIBRARY.md`. It does not restate
those — it sequences and composes them for the Home route specifically.

## Part A — Current state (baseline audit)

`src/pages/Home.jsx` today, section by section, as it exists right now
(post the two most recent edits: nav label rename to "Solution" and the
"Demo data" stats labeling):

| # | Section | What it does today |
|---|---|---|
| 1 | Hero | Search-first: H1 + subhead + search input/button + two secondary buttons ("Browse Peer-Reviewed OERs", "See the Solution"). No product visual. |
| 2 | Stats | 4-stat grid, explicitly labeled "Demo data" (illustrative, not live). |
| 3 | Our Partners | `PartnerLogoMarquee`, 13 logos, infinite scroll. |
| 4 | The Lifecycle | 4-stage grid (Submit → Expert Review → Feedback & Revision → New Version Publish) inside a taupe panel, plus a "See the detailed process →" CTA to `/solution`. |
| 5 | How We Ensure Quality | 4-stage grid (Expert Reviewers, Structured Evaluation, Evidence-Based Feedback, Transparent Results) — overlaps conceptually with §4. |
| 6 | Browse by discipline | `FilterChip` row, 7 disciplines, links to `/browse`. |
| 7 | Featured resources (Recently reviewed) | 3-card `ResourceCard` grid pulling live from `RESOURCES`. |
| 8 | Institutions CTA | Ink-fill band, single message + single CTA button to `/community`. |

**What this baseline is missing, relative to the brief's required
architecture:** a product-focused visual in the hero (current hero is
text+search only — `ReviewConsoleDemo`, the one real product-demo asset in
the codebase, is not used on Home, only on `/solution`); a stated
problem/outcome framing (Lifecycle and Quality sections explain *how*, never
*why it matters*); a role-based value split (Author vs. Reviewer vs.
Institution needs are never separated — all copy is addressed to a generic
reader); any sticky or scroll-linked narrative (`ProcessSpine`'s scroll-lerp
pattern is `/solution`-only); a public-review-record showcase (no link from
Home into an actual reviewed resource's transparent history); and any
community-trust signal beyond the logo marquee (no testimonial, no reviewer
credential proof). §4 and §5 are also redundant with each other and with
`/solution`'s content — worth resolving, not just adding to.

## Part B — Proposed sequence

```
Navigation (sticky, revised)
  ↓
1. Product-Focused Hero
  ↓
2. Partner-Logo Showcase
  ↓
3. Problem & Outcome
  ↓
4. Three-Step Review Workflow
  ↓
5. Role-Based Value Presentation
  ↓
6. Sticky Product Narrative (the six rubrics)
  ↓
7. Public Review Record
  ↓
8. Community & Trust
  ↓
9. Final CTA
  ↓
Footer (revised)
```

Rationale for the order: hero and partner logos establish "this is real and
trusted" in the first two folds (Lovable's own sequence does this — see
`REFERENCE_AUDIT.md`). Problem/outcome then earns the *why* before workflow
explains the *how*. Role-based value comes after workflow, not before,
because a visitor needs to see the process exists before they self-select
into "which part of this am I." The sticky rubric narrative and public
review record are the credibility payload — proof the process is real and
specific, not marketing language. Community/trust and the final CTA close
the page the same way every SaaS landing page does, and the footer is
unchanged in position.

**`[OPEN DECISION LP-OD-1]`** Whether Home counts as a "marketing page" under
`design.md`'s per-page allowances (imagery/richer treatment sanctioned) or
must hold to the "content page" no-added-imagery rule. This document assumes
marketing-page treatment throughout, consistent with `design.md`'s own
framing of Home as a marketing page — flagging for explicit confirmation
before implementation.

---

## Section specs

### Navigation

- **Section name:** Navigation (Header)
- **Business objective:** Constant orientation and a low-friction path to
  Browse/Sign up from anywhere on the page.
- **User question being answered:** "Where am I, and how do I get to the
  thing I actually want (the catalog, or my account)?"
- **Primary audience:** All visitors, every screen.
- **Content hierarchy:** Wordmark (left) → primary nav links (center) →
  Login / Sign up (right). Unchanged from current `Header.jsx` structure.
- **Desktop layout:** Unchanged: 1280px max-width container, `64px`
  horizontal padding, 50px height, `AnimatedTabBar` for the 4 nav links
  (Browse, Solution, Community, About).
- **Tablet layout:** Same horizontal layout down to ~768px; nav link gap
  (`28px` in `AnimatedTabBar`'s CSS) should compress — **`[OPEN DECISION
  LP-OD-2]`** no current breakpoint exists for the header at all (see
  `RESPONSIVE_BEHAVIOR.md` § Navigation behavior for the proposed collapse
  point and pattern).
- **Mobile layout:** Collapses to wordmark + hamburger menu; nav links and
  Login/Sign up move into a full-screen or slide-in drawer. **This does not
  exist today** — `Header.jsx` has no mobile treatment at all (no
  `@media` query in the file, confirmed by inspection). New build, not a
  tweak.
- **Main visual treatment:** Transparent background at rest (current
  behavior, preserved) — **`[OPEN DECISION LP-OD-3]`** whether the nav
  should gain a solid/blurred background on scroll (a near-universal premium
  SaaS pattern, absent today: `Header.jsx`'s own comment states "no sticky
  behavior" explicitly). Proposed default: yes, becomes sticky with a
  background-fill transition past 24px of scroll — see `MOTION_SYSTEM.md` §
  Scroll-aware navigation. Flagged because it's a functional behavior change
  requiring explicit sign-off, not just visual polish.
- **Interaction behavior:** Sliding underline indicator on the active tab
  (existing `AnimatedTabBar` behavior, preserved). Hover states unchanged.
- **Motion behavior:** Indicator slide on route change (existing, ~220ms via
  `--dur-med`). New: background fade-in on scroll-past-threshold (proposed,
  150ms opacity, see `MOTION_SYSTEM.md`).
- **CTA behavior:** "Login" (secondary pill) + "Sign up" (primary pill) —
  both currently point to `/` (home), which is a placeholder; needs a real
  destination once auth exists. Not fixed here — flagged as a known gap, not
  a documentation decision.
- **Relationship to adjacent sections:** Sits above the hero; if made
  sticky, must not visually collide with the hero's own content on scroll
  (verify z-index/backdrop against §1 Hero once both are built).
- **Accessibility considerations:** Keep `AnimatedTabBar`'s `NavLink`
  semantics. Mobile drawer must trap focus while open, restore focus to the
  hamburger button on close, and be dismissible via `Escape`. Nav landmark
  (`<nav>` or `role="navigation"`) must be present — currently the tab list
  itself is a `<nav>`, confirm the mobile drawer preserves one accessible
  nav landmark, not two competing ones.

### 1. Product-Focused Hero

- **Section name:** Product-Focused Hero
- **Business objective:** Convert "OER quality is hard to trust" into "here
  is a working system that proves quality," in the first viewport.
- **User question being answered:** "What does this actually do, and can I
  see it working right now?"
- **Primary audience:** First-time visitors from all three roles (author,
  reviewer, adopter/institution) — the hero must not over-index on one role.
- **Content hierarchy:** Eyebrow (optional, off by default per Hallmark's
  own section-tag discipline) → H1 (≤7 words/≤50 chars if newly written) →
  one-sentence subhead → primary CTA + secondary CTA → product visual.
- **Desktop layout:** Two-column split, ~55/45. Left: headline, subhead, CTA
  pair. Right: `ReviewConsoleDemo` (the existing, real video component —
  reused from `/solution`, not rebuilt) inside its own bordered frame, no
  fake browser chrome (already true of the component). This replaces the
  current search-bar-first hero; search moves to a secondary position (see
  CTA behavior below).
- **Tablet layout:** Column stack — copy above, demo video below, both
  full-width within the container. Demo keeps its intrinsic aspect ratio
  (the component already computes this from real video metadata — see
  `MOTION_SYSTEM.md` § Product-demo transitions).
- **Mobile layout:** Same stack as tablet; demo video's `preload="metadata"`
  and IntersectionObserver play/pause (existing component behavior) keeps
  autoplay from costing data before the user scrolls to it. CTA buttons
  become full-width, stacked, per `RESPONSIVE_BEHAVIOR.md`'s no-two-line-text
  rule.
- **Main visual treatment:** The existing `review-console-demo.mp4` (already
  in `public/how-it-works/`), muted/looped/ambient — not a new asset
  requirement. **`[OPEN DECISION LP-OD-4]`** whether the Home hero reuses
  the *exact same* video as `/solution`'s hero (redundant if a visitor views
  both pages back to back) or whether a second, Home-specific demo clip
  should be recorded (e.g., a shorter "browse → open a reviewed resource"
  flow instead of the review-console annotation flow). Recommend the latter
  for narrative variety, but this requires a new screen recording — see
  `REFERENCE_AUDIT.md` § Evidence still needed.
- **Interaction behavior:** Video plays only while in viewport (existing
  `IntersectionObserver` behavior in `ReviewConsoleDemo`, reused as-is).
- **Motion behavior:** Entrance: headline/subhead/CTA fade-up on page load
  (new — see `MOTION_SYSTEM.md` § Entrance animation, use the existing
  600ms/`--ease-out` family already established by `ProcessSpine`'s row
  entrance, not a new duration). Demo video: ambient ammo loop, no entrance
  animation on the frame itself beyond the shared fade-up.
- **CTA behavior:** Primary = "Browse Peer-Reviewed OERs" (existing copy,
  proven), Secondary = "See the Solution" (existing copy, proven, links
  `/solution`). Search input **moves out of the hero** into its own
  lightweight utility position (e.g., inline in the nav or as the first
  action inside §2/§4) — **`[OPEN DECISION LP-OD-5]`** exact relocation
  target for search; not resolved here since it changes IA, not just visual
  layout.
- **Relationship to adjacent sections:** Hands off directly into the Partner
  Logo Showcase — the demo proves "real product," the logos immediately
  prove "real institutions use it." No stat row between them (stats move
  later, see §7/§8 discussion) — **`[OPEN DECISION LP-OD-6]`** whether the
  "Demo data" stats section is kept at all on the new sequence, given it's
  explicitly labeled illustrative; recommend folding any *real* stat that
  becomes available into §8 Community & Trust instead of keeping a
  standalone illustrative-stats band, but do not silently drop existing
  content — confirm before removing.
- **Accessibility considerations:** Video is `muted` (existing), needs no
  captions since it's decorative/ambient (`aria-hidden` pattern already used
  by `ReviewConsoleDemo`'s mock fallback) — but the *product screenshot's*
  informational content (if any text is legible in-frame) should not be the
  sole carrier of information the surrounding copy doesn't already state.
  H1 must remain a single real `<h1>` (verify no duplicate `<h1>` between
  hero and any per-page title elsewhere on Home).

### 2. Partner-Logo Showcase

- **Section name:** Partner-Logo Showcase
- **Business objective:** Borrowed credibility — "13 real institutions trust
  this" — immediately after the product proof.
- **User question being answered:** "Is this a real, adopted system, or a
  prototype?"
- **Primary audience:** Institutional/adopter visitors specifically, but
  legible as trust signal to everyone.
- **Content hierarchy:** Small label ("Our Partners" or similar, existing
  copy) → marquee.
- **Desktop layout:** Full-width `PartnerLogoMarquee`, unchanged from
  current implementation — this component already meets the bar (infinite
  scroll, hover/focus pause, reduced-motion fallback, responsive logo sizing
  at 900px/640px). No rebuild needed, only reposition earlier in the page.
- **Tablet layout:** Existing 900px breakpoint already reduces logo tile
  size (`168px→136px`) and gap — no change needed.
- **Mobile layout:** Existing 640px breakpoint already reduces further
  (`136px→112px`) — no change needed. Confirm this breakpoint value is
  reconciled with the new global breakpoint set proposed in
  `RESPONSIVE_BEHAVIOR.md` (currently `900px`/`640px`, which don't match the
  `960px`/`820px` used elsewhere in `hiwStyles.js` — a consolidation
  candidate, not a functional bug).
- **Main visual treatment:** Continuous horizontal scroll, existing edge
  fade-gradient masks (`oer-marquee__edge`), unchanged.
- **Interaction behavior:** Pause on hover/focus (existing, preserved).
- **Motion behavior:** `oer-marquee-scroll` keyframe, existing 32s default
  duration, `linear` timing (already correct for a marquee — never ease a
  continuous loop). Reduced-motion: static wrapped row, `@keyframes`
  disabled, duplicate group hidden (existing, preserved as-is — this
  fallback is already correct, see `MOTION_SYSTEM.md` § Marquee behavior).
- **CTA behavior:** None — this section is proof, not a conversion point.
- **Relationship to adjacent sections:** Bridges hero credibility into the
  Problem & Outcome section's argument — "these institutions adopted this
  because the old way was broken," setting up §3.
- **Accessibility considerations:** Existing `role="region"` +
  `aria-label="Partner organizations"` (already correct). Confirm each logo
  `img alt` stays as the real institution name (existing behavior) — the
  duplicated (second) track correctly uses `alt=""` since it's decorative
  repetition (existing, correct, do not change).

### 3. Problem & Outcome

- **Section name:** Problem & Outcome
- **Business objective:** Justify why peer review for OER needs to exist at
  all before explaining the mechanism.
- **User question being answered:** "Why should I care about this — what's
  broken without it?"
- **Primary audience:** Adopters/faculty evaluating whether to trust an OER
  without a publisher's imprint; secondarily authors deciding whether
  submitting is worth the effort.
- **Content hierarchy:** Problem statement (short, concrete) → outcome
  statement (what changes because the Hub exists) → optional supporting
  detail (2-3 short proof points, not a full feature list — that's §4/§5's
  job).
- **Desktop layout:** Two-column: Problem (left) / Outcome (right), OR a
  single-column before/after statement — **`[OPEN DECISION LP-OD-7]`** this
  document does not have real problem-statement copy to draw from; nothing
  in the current codebase states the problem in the visitor's terms (Home's
  existing copy jumps straight to "Discover peer-reviewed textbooks..."
  without ever stating what's wrong with *un*-reviewed OER). **Do not invent
  this copy** — it needs a real product-owner statement of the actual
  problem (e.g., is it "faculty can't tell which OER meets ADA compliance,"
  "OER quality varies wildly and there's no way to check," something else?).
  Layout choice depends on final copy length.
- **Tablet layout:** Column stack if two-column desktop; single column
  either way at this breakpoint.
- **Mobile layout:** Single column, generous vertical rhythm between problem
  and outcome statements (not cramped — this section's persuasive weight
  depends on breathing room, per the editorial genre's "generous negative
  space" register already established by `design.md`'s whisper-weight
  system).
- **Main visual treatment:** Typography-only by default (per Hallmark's
  hierarchy: strongest hero is often typographic, and this system has no
  precedent for editorial illustration). **`[OPEN DECISION LP-OD-8]`**
  whether a supporting visual (e.g., a simple before/after status-badge
  comparison, reusing the real `StatusBadge` component to show "unreviewed"
  vs. "Peer Reviewed · Revised") adds proof without fabricating imagery —
  recommend this over any invented illustration, since it reuses real
  product chrome.
- **Interaction behavior:** None required.
- **Motion behavior:** Fade-up entrance on scroll-into-view (see
  `MOTION_SYSTEM.md` § Entrance animation), single trigger, no stagger
  needed for a 2-block section.
- **CTA behavior:** None, or a soft text link into §4 ("See how review
  works ↓") — no button-weight CTA here, this section's job is persuasion
  not conversion.
- **Relationship to adjacent sections:** Sets up the workflow explanation in
  §4 as "the answer to the problem just stated" — the two sections should
  read as one continuous argument, not two disconnected blocks.
- **Accessibility considerations:** Ensure heading level continuity (`h2`
  following the hero's `h1`, not skipping to `h3`). If the `StatusBadge`
  before/after visual (LP-OD-8) ships, both badges need their real text
  labels visible (already guaranteed — `StatusBadge` never renders
  color-only, per `CLAUDE.md`'s status-model rule).

### 4. Three-Step Review Workflow

- **Section name:** Three-Step Review Workflow
- **Business objective:** Make the mechanism feel simple and fast, even
  though the real process (`ProcessSpine`'s 7 steps on `/solution`) is
  detailed — this is the teaser, not the full explanation.
- **User question being answered:** "How does a resource actually get
  reviewed, in brief?"
- **Primary audience:** All visitors — this is the page's single most
  load-bearing explanatory section.
- **Content hierarchy:** Section heading → 3 steps, each: number, icon,
  title, one-sentence description → single CTA to the full process.
- **Desktop layout:** 3-column grid (not 4 — condense the current
  4-stage "Lifecycle" grid and the separate "How We Ensure Quality" grid,
  which currently overlap in content, down to one authoritative 3-step
  version). **`[OPEN DECISION LP-OD-9]`** the exact 3-step grouping —
  candidate mapping is **Submit → Review Against Rubrics → Publish &
  Certify**, condensing `ProcessSpine`'s 7 real steps (`src/components/
  how-it-works/ProcessSpine.jsx` STEPS array) 2-3 steps at a time. This
  needs product sign-off since it's compressing existing, precise process
  language — not this document's call to make unilaterally.
- **Tablet layout:** 3-column grid holds down to ~768px (3 short items fit
  tighter than a 4-column grid would have), single column below that.
- **Mobile layout:** Single column, full-width, generous gap between steps
  (not a cramped list) — connecting line/number treatment optional (see
  `SECTION_LIBRARY.md` § Three-step workflow for the exact card contract).
- **Main visual treatment:** Icon + number per step, matching the existing
  Lifecycle section's icon language (`UploadIcon`, `UsersIcon`,
  `RefreshIcon`, `CheckCircleIcon` — real, existing inline SVGs in
  `Home.jsx`, reusable) — not new iconography.
- **Interaction behavior:** None required; optional hover lift on each step
  card (reuse `ResourceCard`'s existing hover-shadow pattern for
  consistency, `--shadow-subtle` on hover, 150ms).
- **Motion behavior:** Stagger entrance, 3 items, 80-100ms stagger interval
  (see `MOTION_SYSTEM.md` § Stagger behavior for the exact value and
  rationale) — first codified stagger pattern in the system; no existing
  precedent uses a numeric stagger today (`ProcessSpine`'s reveal is
  per-item via `IntersectionObserver`, not a fixed stagger).
- **CTA behavior:** Single button, "See the full process →" → `/solution`
  (reusing existing copy pattern from current "See the detailed process →").
- **Relationship to adjacent sections:** This is the literal, compressed
  version of everything `/solution` explains — its whole job is to make
  a visitor want to click through, not to duplicate `/solution` in full.
- **Accessibility considerations:** Steps are an ordered concept — use an
  `<ol>` semantically even if visually a grid, so assistive tech announces
  step order correctly.

### 5. Role-Based Value Presentation

- **Section name:** Role-Based Value Presentation
- **Business objective:** Let each of the three real audiences (Author,
  Reviewer, Institution/Coordinator) self-select and see value specific to
  them, instead of one generic pitch.
- **User question being answered:** "What's in this for someone like me,
  specifically?"
- **Primary audience:** Segmented — the whole point of this section is that
  audience determines content.
- **Content hierarchy:** Section heading → role tab/toggle control → active
  role's value copy (2-3 benefit statements) + role-specific CTA.
- **Desktop layout:** Tab control (reuse `RoleToggle`'s `FilterChip`-based
  pattern from `/solution`, extended from 2 roles to 3 — Author, Reviewer,
  Institution) above a content panel that swaps on selection.
- **Tablet layout:** Same tab control, content panel remains full-width.
- **Mobile layout:** Tabs may need horizontal scroll or wrap to 2 rows at
  narrow widths — `FilterChip` wraps naturally (`flexWrap: "wrap"` already
  used elsewhere), confirm 3 chips fit one line down to ~375px before
  allowing wrap.
- **Main visual treatment:** Typography + `StatusBadge`/`Badge` accents
  where relevant (e.g., showing the Author role's "Peer Reviewed" badge
  outcome) — no new illustration needed.
- **Interaction behavior:** Click/tap a role chip to swap the panel content.
  Reuse `RubricMethod`'s existing JS-measured height-animation pattern for
  the swap (480ms open / 160ms content-out / 200ms content-in-delay — see
  `MOTION_SYSTEM.md` § Tab transitions) rather than inventing a new timing.
- **Motion behavior:** Panel content cross-fades on role swap using the
  exact `RubricMethod` sequence (content fade-out 160ms → height eases to
  new panel's measured height → content fades in after a 200ms delay) —
  this is the one place in the new landing page that should copy an
  *existing* interaction pattern verbatim, since `RubricMethod` already
  solves this exact problem (swapping disclosure content without layout
  jank) well.
- **CTA behavior:** Each role panel ends in its own CTA: Author → "Submit a
  resource," Reviewer → "Become a reviewer," Institution → "Partner with
  us" (all → `/community` or a future role-specific route — **`[OPEN
  DECISION LP-OD-10]`** none of these submission flows exist yet as real
  routes; CTAs need a confirmed destination before implementation, not a
  placeholder `href="/"` like the current nav Login/Sign up buttons).
- **Relationship to adjacent sections:** Follows the workflow section
  naturally — "now that you've seen how it works, here's your specific
  path in." Precedes the sticky rubric narrative, which is Reviewer/Author
  -relevant detail for whichever role a visitor just selected.
- **Accessibility considerations:** Must use proper `tablist`/`tab`/
  `tabpanel` ARIA roles (note: `RubricMethod`'s existing implementation
  already does this correctly — `role="tablist"`, `aria-expanded`,
  `aria-controls`, `role="tabpanel"`, `aria-labelledby` — replicate that
  exact pattern here, don't simplify it away). Keyboard arrow-key navigation
  between tabs per the ARIA APG tabs pattern — **not currently implemented**
  in `RubricMethod` (it uses `FilterChip` buttons, which are individually
  tabbable but don't support arrow-key roving focus) — flag as a genuine
  a11y gap to fix in this new build, not just copy forward.

### 6. Sticky Product Narrative

- **Section name:** Sticky Product Narrative — "Six rubrics, one method"
- **Business objective:** Demonstrate depth and rigor without a wall of
  text — prove the six-rubric method is real and specific.
- **User question being answered:** "What does 'peer review' actually check
  for, criterion by criterion?"
- **Primary audience:** Skeptical adopters and prospective reviewers
  evaluating whether the rubrics are rigorous enough to trust/join.
- **Content hierarchy:** Sticky left rail: rubric name list (6 items,
  real data from `RUBRIC_PANELS` in `rubricPanels.js` — Accessibility, Copy
  Editing, Copyright, Disciplinary Appropriateness, eLearning, UDL) →
  scrolling right content: each rubric's real `summary` text and a sample
  `covers` item or two, changing as the visitor scrolls past each rubric's
  anchor point.
- **Desktop layout:** Two-column: left rail `position: sticky; top: <nav
  height + spacing>` (the existing, real precedent for this technique is
  `ResourceDetail.jsx`'s sidebar, `position: "sticky", top: 88` — reuse that
  exact mechanism, not a new one) — right column scrolls normally,
  triggering an active-state change on the left rail as each rubric's block
  crosses a scroll threshold (`IntersectionObserver`, same technique
  `ProcessSpine` already uses for its row-reveal, repurposed here to also
  drive left-rail active-state instead of just a reveal).
- **Tablet layout:** Sticky-left/scroll-right can hold down to ~1024px if
  the left rail is narrowed; below that, **`[OPEN DECISION LP-OD-11]`**
  whether to keep a (narrower) sticky rail or collapse to the fallback
  described in `RESPONSIVE_BEHAVIOR.md` § Sticky-layout fallback (a
  non-sticky, single-column stack of the same 6 rubric blocks in order,
  each with its own heading — content-equivalent, motion-reduced).
  Recommend the fallback below ~900px, matching `PartnerLogoMarquee`'s
  existing 900px breakpoint for a consistent "tablet" cutover across the
  page.
- **Mobile layout:** Fallback stack (per above) — no sticky positioning on
  mobile at all. Each rubric block becomes its own full-width card with
  heading, summary, and 1-2 sample criteria.
- **Main visual treatment:** Typography-led; each active rubric could
  optionally surface 1-2 real `covers` items as a short list (existing data
  already provides `title`/`gloss` pairs — no new content needed, this is
  purely reusing `rubricPanels.js` in a different presentation shape than
  `RubricMethod`'s accordion).
- **Interaction behavior:** Left-rail item highlights as its corresponding
  right-column content becomes active; clicking a left-rail item
  scroll-jumps to that rubric's anchor (progressive enhancement — must also
  work via normal scroll with no JS, since the content should be real
  server-rendered/static HTML, not JS-gated).
- **Motion behavior:** Active-state change on the left rail: background/
  color crossfade, reuse the existing `400ms`/`--ease-out` timing already
  established by `RoleToggle`'s chip highlight crossfade (`hiwStyles.js`
  line 128) rather than inventing a new duration. No lift/scale effect here
  (that's `ProcessSpine`'s specific signature for its own section — don't
  reuse it verbatim elsewhere, see `MOTION_SYSTEM.md`'s note on
  over-application).
- **CTA behavior:** None mid-section; optional single CTA at the end
  ("See a full rubric review →" linking to a real example resource, bridges
  into §7).
- **Relationship to adjacent sections:** This section is the rigor proof;
  §7 Public Review Record is the "and here's it applied to a real
  resource" follow-through — the two should feel like one continuous
  "trust the method → see the method in action" beat.
- **Accessibility considerations:** Sticky positioning must not trap
  keyboard focus or scroll — verify `position: sticky` (not `fixed`) so it
  scrolls out of view naturally at the section's end (same requirement
  already satisfied by `ResourceDetail`'s sidebar). Reduced-motion: the
  active-state crossfade should drop to an instant swap, no transition (per
  `prefers-reduced-motion`, consistent with every other component in the
  codebase).

### 7. Public Review Record

- **Section name:** Public Review Record
- **Business objective:** Prove transparency is real by showing an actual
  reviewed resource's public history, not just describing the concept.
- **User question being answered:** "Can I actually see a real review, or
  is 'transparent' just a claim?"
- **Primary audience:** Adopters deciding whether to trust the badge system;
  secondarily authors curious what a public review looks like before
  submitting.
- **Content hierarchy:** Section heading + one-sentence framing → a single
  featured example (reusing `ReviewTimeline` + `StatusBadge`, real
  component, real data) → CTA to view the full record.
- **Desktop layout:** Single centered or two-column card: left/top a
  resource summary (title, status badges), right/bottom the
  `ReviewTimeline` component rendering that resource's actual version
  history (reuse `EXAMPLE_RESOURCE`'s timeline data from `resources.js`
  **only if visibly labeled as an example**, consistent with
  `ResourceDetail.jsx`'s existing `isExample` banner treatment — do not
  present example data as a real reviewed resource without that same
  label).
- **Tablet layout:** Column stack, timeline retains its own internal
  responsive behavior (existing 640px breakpoint in `ReviewTimeline.jsx`
  already reduces the grid-template-columns and stacks the head row — no
  change needed there).
- **Mobile layout:** Same stack, full-width timeline card.
- **Main visual treatment:** The real `ReviewTimeline` component — dots on
  a rail, cards with title/date/description, tone-colored per status
  (existing, correct implementation, static/no animation by design — do
  not add scroll animation to this component, its current "always fully
  rendered, no scroll-trigger" behavior is intentional per its own code
  comment and should stay that way for an audit-trail component where
  every entry should be immediately scannable, not progressively revealed).
- **Interaction behavior:** None beyond the CTA — this is a read-only proof
  section.
- **Motion behavior:** Section-level fade-up entrance only (consistent with
  §3); the `ReviewTimeline` content itself stays static, no internal
  animation (see above).
- **CTA behavior:** Single button, "View this resource's full review →"
  linking to the real `/resource/:id` route for whichever resource is
  featured. **`[OPEN DECISION LP-OD-12]`** which real resource to feature —
  should be one with genuine reviewer activity (not the flat "unreviewed"
  state), or the clearly-labeled `EXAMPLE_RESOURCE` if no real submission
  has a rich-enough history yet. Product call, not a documentation default.
- **Relationship to adjacent sections:** Closes the "prove it" arc that
  §6 opened — after this, the page moves from proof into belonging (§8
  Community).
- **Accessibility considerations:** If `EXAMPLE_RESOURCE` is used, the same
  visible "Example" `Badge` + explanatory sentence used in
  `ResourceDetail.jsx` (lines ~50-68) must appear here too — this label is
  load-bearing for honesty, not just a `ResourceDetail`-page convention.

### 8. Community & Trust

- **Section name:** Community & Trust
- **Business objective:** Convert "the process is rigorous" into "I'd be
  joining a real, active community," addressing the social-proof gap the
  current page has no answer for.
- **User question being answered:** "Who else is actually doing this, and
  what do they say about it?"
- **Primary audience:** Prospective reviewers and institutional partners
  weighing whether to commit time/resources.
- **Content hierarchy:** Section heading → institution grid (reuse
  `InstitutionCard` + real `PARTNERS` data, same as `Community.jsx`'s
  existing "Partner institutions" section) → **`[OPEN DECISION LP-OD-13]`**
  testimonial/quote content.
- **Desktop layout:** Institution grid: `repeat(auto-fit, minmax(200px,
  1fr))` (existing `Community.jsx` pattern, reusable as-is). Below/beside
  it, a testimonial block IF real quotes exist.
- **Tablet layout:** Grid naturally reflows via `auto-fit` (existing
  behavior needs no breakpoint override).
- **Mobile layout:** Same auto-fit behavior; confirm `minmax(200px, 1fr)`
  doesn't force horizontal scroll below 400px viewport width — verify
  against `RESPONSIVE_BEHAVIOR.md` § Overflow prevention (`minmax(0, 1fr)`
  may be required instead, per that document's grid-safety rule).
- **Main visual treatment:** Real institution logos (already exist, 13
  partners). No fabricated headshots, quotes, or company logos beyond the
  real partner set.
- **Interaction behavior:** None required (static grid, unlike the
  scrolling marquee in §2 — intentionally a different presentation so the
  page doesn't repeat the same logo-marquee twice).
- **Motion behavior:** Stagger entrance on the institution grid (see
  `MOTION_SYSTEM.md` § Stagger behavior), same interval family as §4.
- **CTA behavior:** "Join as an institution" / "Become a reviewer" (existing
  copy patterns from `Community.jsx`, reusable) — **`[OPEN DECISION
  LP-OD-14]`** whether Home needs its own community CTA or should simply
  route to `/community` for all of this (avoiding duplicate content between
  Home and Community). Recommend routing, with Home showing a condensed
  proof + single link, not a full re-implementation of Community's content.
- **Relationship to adjacent sections:** Directly precedes the Final CTA —
  this section's job is to make joining feel real and populated before the
  page asks for commitment.
- **Accessibility considerations:** Same as §2 — real `alt` text per
  institution logo.

**`[OPEN DECISION LP-OD-13, continued]`** No testimonial or reviewer-quote
content exists anywhere in the codebase today (confirmed by inspection —
`grep` for quote/testimonial-shaped content returns nothing). Per this
project's own honest-copy convention (already established in
`resources.js`'s placeholder-marking pattern and this session's prior work
labeling demo data), **do not fabricate a testimonial.** Either omit the
testimonial sub-block entirely until real quotes exist, or render it with
the same explicit "Demo data" labeling pattern used elsewhere on Home's
stats row — this document does not choose for you; it flags the choice.

### 9. Final CTA

- **Section name:** Final CTA
- **Business objective:** Single, unambiguous conversion moment before the
  footer.
- **User question being answered:** "Okay, I'm convinced — what do I do
  right now?"
- **Primary audience:** Warmed-up visitors who've scrolled the full page.
- **Content hierarchy:** Headline (short) → one supporting sentence → one
  button. Not two — per the section-sequence guidance's own "voice rules for
  SaaS sections," a repeated single CTA is the call to action, and the
  current Home page's existing Institutions CTA band already gets this
  right (one button, "Explore community") — **preserve that discipline**,
  don't add a second button when this section is rebuilt.
- **Desktop layout:** Reuse the existing ink-fill band layout
  (`background: var(--brand-primary)`, flex row: copy left, button right) —
  this section doesn't need new layout, only a copy/destination review once
  the rest of the page changes (its current copy, "Bring transparent review
  to your institution," is institution-specific; **`[OPEN DECISION
  LP-OD-15]`** whether the final CTA should stay institution-focused or
  broaden now that §5's role-based section already gives institutions their
  own dedicated CTA — risk of redundancy between §5's Institution panel CTA
  and this section).
- **Tablet layout:** Existing `flexWrap: "wrap"` behavior already handles
  this reasonably — copy and button wrap to stacked when they don't fit,
  confirm this still reads well once container padding is standardized
  (see `RESPONSIVE_BEHAVIOR.md`).
- **Mobile layout:** Stacked, full-width button, per the no-two-line-CTA
  rule.
- **Main visual treatment:** Ink-fill band (existing, high-contrast,
  correctly used exactly once on the page — do not repeat this treatment
  elsewhere, its rarity is what makes it read as "the" final moment).
- **Interaction behavior:** Standard button hover/focus (existing `Button`
  component states, unchanged).
- **Motion behavior:** Fade-up entrance only, consistent with other
  sections — no special treatment needed here; the visual weight of the
  ink-fill band itself is the emphasis, motion doesn't need to add more.
- **CTA behavior:** Single button (see above). Confirm real destination
  once LP-OD-15 is resolved.
- **Relationship to adjacent sections:** Last content section before the
  footer — should feel like a clean stop, not a transition into more
  content.
- **Accessibility considerations:** Text-on-ink contrast already verified
  by the existing implementation (`--text-inverse` on `--brand-primary`,
  both pure eggshell/ink — maximum contrast, no issue). Ensure the button
  inside the ink band uses the `secondary` variant as it does today (an
  outline pill in eggshell reads correctly against the ink fill) — do not
  switch it to `primary` variant, which would render ink-on-ink and fail
  contrast entirely.

### Footer

- **Section name:** Footer
- **Business objective:** Secondary navigation + legal/trust closure.
- **User question being answered:** "What else is on this site, and is it
  legitimate (terms, licensing, contact)?"
- **Primary audience:** All visitors, low-intent browsing.
- **Content hierarchy:** Unchanged from current `Footer.jsx`: brand block +
  3 link columns (Explore / For / About) → divider → back-to-top + legal
  row.
- **Desktop layout:** Existing `2fr 1fr 1fr 1fr` grid at `1280px` max-width,
  `64px 32px` outer padding — reusable as-is.
- **Tablet layout:** **`[OPEN DECISION LP-OD-16]`** no breakpoint exists
  today (`Footer.jsx` has zero `@media` queries). Proposed: collapse to a
  2-column grid (brand block full-width, other 3 columns wrap to 2+1 or all
  3 in a row if width allows) around the same ~768px cutover proposed for
  navigation.
- **Mobile layout:** Single column, all 4 blocks stacked, generous vertical
  gap between them (currently `gap: 40` — likely too tight once stacked;
  `RESPONSIVE_BEHAVIOR.md` proposes a mobile-specific vertical rhythm).
- **Main visual treatment:** Warm stone surface band (existing,
  `var(--surface-subtle)`), unchanged.
- **Interaction behavior:** Standard link hover/focus states, unchanged.
- **Motion behavior:** None — footers do not warrant scroll-entrance motion
  (a visitor scrolling this far is already past the point where reveal
  animation adds anything; adding it would be decoration, which
  `MOTION_SYSTEM.md`'s own governing principle prohibits).
- **CTA behavior:** None (footer is navigation, not conversion).
- **Relationship to adjacent sections:** Terminal element — no section
  follows it.
- **Accessibility considerations:** Confirm `<footer>` landmark (existing,
  correct). **Known content issue, not a design-system issue:** the
  "Explore" column currently links both "How peer review works" and "Our
  process" to the same `/solution` route with different labels — this is a
  copy/IA bug worth fixing when Footer is touched, but is out of scope for
  this documentation pass (flagging so it isn't silently missed, not fixing
  it here since this task is documentation-only).

---

## Summary of open decisions requiring product/stakeholder input

| ID | Decision |
|---|---|
| LP-OD-1 | Does Home count as a "marketing page" (imagery allowed) under `design.md`'s per-page allowances? |
| LP-OD-2 | Tablet nav collapse breakpoint and pattern. |
| LP-OD-3 | Should nav become sticky-on-scroll (functional change, not just visual)? |
| LP-OD-4 | Reuse `/solution`'s exact demo video on Home, or record a Home-specific clip? |
| LP-OD-5 | Where does the search input relocate to, once removed from the hero? |
| LP-OD-6 | Keep, relocate, or drop the "Demo data" stats band in the new sequence? |
| LP-OD-7 | Real problem-statement copy for §3 (currently no source exists). |
| LP-OD-8 | Use a `StatusBadge` before/after visual in §3, or stay typography-only? |
| LP-OD-9 | Exact grouping of `ProcessSpine`'s 7 real steps into 3 teaser steps. |
| LP-OD-10 | Real destinations for role-specific CTAs in §5 (no submission routes exist yet). |
| LP-OD-11 | Sticky-narrative fallback breakpoint for §6 (recommend 900px, needs confirmation). |
| LP-OD-12 | Which real resource (or the labeled example) is featured in §7. |
| LP-OD-13 | Whether/how to source real testimonial content for §8 — do not fabricate. |
| LP-OD-14 | Does §8 duplicate `/community` content or condense-and-link? |
| LP-OD-15 | Does the Final CTA stay institution-focused or broaden, given §5 now covers institutions separately? |
| LP-OD-16 | Footer tablet/mobile breakpoint and column-collapse pattern. |
