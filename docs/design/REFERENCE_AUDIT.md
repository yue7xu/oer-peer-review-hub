# Reference Audit — Premium SaaS Landing Pages

Status: **documentation.** This is a reference-analysis **framework**,
populated with one fully-audited reference (lovable.dev/home) and left open
for additional references to be added the same way. It exists to justify
*why* `LANDING_PAGE_ARCHITECTURE.md`'s proposed sections look the way they
do, with a hard separation between what was actually observed, what is
inferred/assumed, and what this project proposes to adapt — per the task's
explicit instruction not to claim an animation or responsive behavior was
observed unless it can be verified.

## Methodology

The Lovable audit below was produced via **URL-mode structural extraction**,
not a screenshot/visual study: the page's raw HTML and compiled CSS were
fetched directly (same-origin only, treated as inert data, no scripts
executed) during an earlier session on this project. This method is
accurate for **exact values** — font names, hex/HSL colors, DOM structure,
script tags present/absent — and **blind to rhythm** — the felt pacing,
density, and visual weight of the page, which can only be judged from a
rendered screenshot or live browsing session. Every row below states which
category its claims fall into. Where the original extraction marked
something `unknown (URL mode)`, that status is preserved here rather than
quietly upgraded to an observed fact.

**Never copy pixels.** Every "how it may be adapted" note below describes
adapting a *structural or interaction pattern* — a macrostructure, an
interaction technique, a content-sequencing logic — never Lovable's actual
copy, brand colors, illustrations, or asset files. `LANDING_PAGE_ARCHITECTURE.md`
and `SECTION_LIBRARY.md` reuse this project's own existing tokens
(`DESIGN_SYSTEM.md`) and existing components throughout — nothing in this
audit proposes importing a Lovable-specific visual value.

---

## Reference: lovable.dev/home

### Directly observed (verified from fetched HTML/CSS, cited to source)

| Pattern | Observed detail |
|---|---|
| Typography | Single self-hosted variable font family, "Camera Plain Variable" (`--font-sans`, regular + italic instances preloaded), carrying **both** display and body roles via its weight axis — not a two-family pairing. Mono role: "Roboto Mono Variable" (`--font-mono`). Confirmed via `@font-face`/`--font-*` custom properties in the site's compiled CSS. |
| Color/accent | Paper is light, near-white (`#fafafa`/`#f5f5f5` band, confirmed via `--bg-base`/`--bg-primary` tokens). Visible chrome accent is **monochrome ink** — primary buttons render `background: transparent` with `light-dark(oklch(0 0 0), oklch(1 1 1))` low-alpha overlays for hover/press states, not a brand-color fill. A blue HSL(~225°) token exists in the shared CSS bundle but reads as a product/theme-preset value (the product lets end users pick brand colors for *their own* generated apps), not the marketing chrome's own accent — this ambiguity is preserved, not resolved into a false certainty. |
| Button micro-interaction | A two-layer system: an `interaction` opacity-overlay layer (separate resting/hover/pressed opacity values) stacked under a `secondary-spotlights` inset-`box-shadow` layer, both driven by CSS `light-dark()` so light/dark mode share one rule set. No `transition-all`, no hover-scale detected in the sampled CSS. |
| Structure — nav | Logo + 6 top-level links (Solutions, Resources, Community, Enterprise, Pricing, Security) + Log in / Get started buttons, plus a dismissible announcement strip above the nav ("New: Lovable apps, now in ChatGPT and Claude"). Confirmed via raw HTML. |
| Structure — hero | Centered, single-column. Short headline ("Build something Lovable") + one-line subhead + a functional prompt/input control (not a static image) + a low-key "Build" CTA (ghost/pill button, not a filled brand-color button) + a "Teams from top companies build with Lovable" social-proof line. Confirmed via raw HTML. |
| Structure — mid-page | A 9-card template gallery (grid of real generated-app screenshots with title/description) directly below the hero. Confirmed via raw HTML. |
| Structure — stats | "Lovable in numbers" heading + 3 numeric callouts, rendered as `"0M"` in the static HTML fetch (client-side count-up JS presumably fills these at runtime — the static value itself is not evidence of the real numbers, only of the section's existence and shape). |
| Structure — footer | 4-5 column link index (Company, Product, Resources, Legal, Community) + language selector. Confirmed via raw HTML — matches this project's own existing `Ft3`-style footer shape already in `Footer.jsx`, not a novel pattern to import. |
| Motion — library | No `framer-motion`, `gsap`, `lottie-web`, `lenis`, or `motion` script tag detected in the fetched HTML's `<script src>` list. |
| Distinctive treatment | A blurred, full-bleed atmospheric background image (`pulse.webp`), positioned absolutely behind a lower section (a CTA band, based on its position after `</main>` in the DOM) — soft radial-glow effect via image blur, not a CSS-only gradient. |

### Inferred (plausible but not directly verifiable from the HTML/CSS fetch)

| Pattern | Inference | Why it can't be confirmed |
|---|---|---|
| Rhythm/density/pacing | Likely "generous" spacing given the light, minimal-accent visual system observed — but this is a stylistic guess, not a measurement. | URL-mode's explicit, known blind spot — HTML can report a literal `padding: 8rem` value but not whether that reads as generous or templated next to its neighbors; that's a gestalt judgment requiring a rendered screenshot. |
| Product-demo interactivity | The hero's "functional prompt/input control" likely accepts real text input leading into an app-generation flow (consistent with the product's known purpose as an AI app builder) — but the exact interaction (autocomplete, submit behavior, loading state) was not inspected. | Would require a live browsing session or video capture, not a static HTML fetch. |
| Stats' real values | The three "Lovable in numbers" figures are presumably meaningful adoption metrics (users, apps built, etc.) given the section's framing. | The static fetch only returned placeholder `"0M"` markup; actual values are client-rendered and were not captured. |
| Scroll reveal behavior | No `@keyframes` or `IntersectionObserver`-pattern script references were found, suggesting entrances may be minimal or CSS-only — but absence of evidence in a partial fetch is not proof of absence. | Only a subset of the site's JS bundle was inspected for library names; custom inline reveal logic (this project's own `ProcessSpine` is a precedent for how much a page can do without a named library) cannot be ruled out from a script-tag scan alone. |

### Proposed adaptation for this project

| Lovable pattern | Adapted as | Where |
|---|---|---|
| Functional, product-forward hero (not a static marketing image) | Reuse this project's own real, existing `ReviewConsoleDemo` video component instead of inventing a new interactive input — same *intent* (show the real product working immediately), entirely different, already-existing asset. | `LANDING_PAGE_ARCHITECTURE.md` §1 |
| Announcement strip above nav | Documented as an available pattern (`SECTION_LIBRARY.md` § Announcement Bar) but **not defaulted into the proposed sequence** — this project has no standing announcement content today, and per the honest-copy discipline, the pattern ships empty rather than pre-filled. | `SECTION_LIBRARY.md` |
| Template/proof gallery directly after hero | Adapted as the Partner-Logo Showcase (§2) — this project's equivalent "immediate credibility" proof is real partner institutions, not a gallery of generated content (the Hub has no equivalent "gallery of outputs" — its proof is who trusts it, not what it produces on demand). | `LANDING_PAGE_ARCHITECTURE.md` §2 |
| Stats band | Adapted as the existing Metrics Strip pattern (already live on Home, already correctly labeled "Demo data" pending real figures) — same shape, same honesty discipline this project already independently arrived at. | `SECTION_LIBRARY.md` § Metrics Strip |
| Monochrome-ink button depth via layered opacity/shadow instead of color | Adapted as a **token-safe interaction refinement** — this project's `design.md` already specifies an ink-only accent system (no chromatic UI color), so Lovable's *technique* (depth via layered opacity + inset shadow, not a new color) is directly compatible with the existing locked palette. Proposed for `Button.jsx`'s hover/press states generally, not landing-page-specific. | Cross-cutting; noted in `DESIGN_SYSTEM.md`'s existing CTA voice section as a candidate refinement, not a section-specific change. |
| 4-5 column footer index | Not adapted — this project's `Footer.jsx` already implements an equivalent, smaller (3-column) index pattern; no structural change proposed, only the responsive fixes noted in `RESPONSIVE_BEHAVIOR.md`. | — |
| Atmospheric blurred background image | **Not adopted.** This project's design system has no precedent for photographic/blurred background treatments, and `design.md`'s content-page rule ("no added imagery") plus the achromatic-by-default palette make this a poor fit without a separate design decision. Noted here only to document that it was considered and deliberately excluded, not overlooked. | — |

### Risks

- **Font confusion:** "Camera Plain Variable" is Lovable's own commissioned/
  licensed font. This project must not attempt to source or embed that
  specific font file — its *role* (a single humanist sans carrying both
  display and body weight) is the transferable idea, not the file itself.
  This project's locked system already uses a single-family approach in a
  different way (Inter at three weights for display/body/label) — no font
  change is proposed anywhere in this package.
- **Brand-color drift:** the ambiguous blue HSL(~225°) token observed in
  Lovable's CSS must not be mistaken for "the Lovable brand color" and
  accidentally referenced anywhere — this project's `--color-violet-spark`/
  `--color-ember-orange` are its own, unrelated, pre-existing accent tokens
  and nothing in this package proposes changing them.
- **Copy proximity:** none of Lovable's actual headline/subhead copy
  ("Build something Lovable," "Create apps and websites by chatting with
  AI") appears anywhere in this package's proposed copy — every example
  headline referenced in `LANDING_PAGE_ARCHITECTURE.md` either reuses this
  project's own existing, real copy or is explicitly flagged as an open
  decision requiring new copy to be written, not lifted.

### Elements that must not be copied

- Lovable's wordmark, logo, or any brand mark.
- The exact template-gallery grid's specific card contents (project names,
  thumbnails) — this project's Partner-Logo Showcase uses entirely
  different, real content (institution logos already in
  `src/data/partners.js`).
- The atmospheric blur background asset (`pulse.webp` itself, or a
  visually-similar commissioned replacement) — excluded outright, see
  Proposed adaptation table above.
- Lovable's specific font file (Camera Plain Variable) — licensing and
  brand-identity concern, not just a style preference.
- The exact nav link taxonomy (Solutions/Resources/Community/Enterprise/
  Pricing/Security) — this project's nav (Browse/Solution/Community/About)
  is its own, smaller, already-correct information architecture and is not
  being expanded to mimic Lovable's link count.

### Evidence still needed

- **A rendered screenshot or short screen recording of lovable.dev/home**,
  to fill the rhythm/density blind spot the URL-mode fetch explicitly
  cannot resolve — needed before any claim about "generous vs. templated"
  pacing can move from Inferred to Directly observed.
- **A recording of the hero's actual input interaction** (what happens on
  submit, autocomplete behavior, loading state) if this project ever wants
  to adapt the *interaction mechanics* of a functional hero input beyond
  what's already covered by reusing `ReviewConsoleDemo`.
- **Additional reference sites**, per the brief's own framing ("premium
  product-led SaaS websites such as Lovable" — plural, one example). This
  project's own `design.md` already names a comparison set from its prior
  redesign work ("Similar Brands: Linear, Vercel, Stripe, Notion, Framer")
  — none of those have been studied for this package. **Do not treat that
  named list as evidence of anything about those sites' actual patterns** —
  it's a genre-cluster label from a prior, unrelated redesign pass, not a
  reference audit. Any future audit of those sites should use this same
  three-column (Directly observed / Inferred / Proposed adaptation)
  framework and either a screenshot (for rhythm) or a URL fetch (for exact
  values), per `study.md`'s existing methodology already used for Lovable.

---

## Framework for adding a new reference

To audit an additional site, copy this shape:

```markdown
## Reference: <site>/<page>

### Directly observed (verified from <screenshot | fetched HTML/CSS>)
| Pattern | Observed detail |
|---|---|

### Inferred (plausible but not directly verifiable)
| Pattern | Inference | Why it can't be confirmed |
|---|---|---|

### Proposed adaptation for this project
| <site> pattern | Adapted as | Where |
|---|---|---|

### Risks
- ...

### Elements that must not be copied
- ...

### Evidence still needed
- ...
```

**Rules for filling it in:**

1. State the extraction method up front (screenshot vs. URL fetch) — this
   determines which category (rhythm, exact fonts/colors, DOM structure)
   can honestly land in "Directly observed" vs. "Inferred," per
   `study.md`'s own source-mode table.
2. Never populate "Directly observed" with something that was actually
   guessed from a vague visual impression — if in doubt, it belongs in
   "Inferred."
3. Every "Proposed adaptation" row must name the *pattern*, not the pixel
   values — a color, font file, or copy string is never itself the
   adaptation; the structural or interaction idea behind it is.
4. "Elements that must not be copied" is not optional boilerplate — name
   the actual brand marks, copy, and proprietary assets specific to that
   reference, the same way the Lovable section above does.
