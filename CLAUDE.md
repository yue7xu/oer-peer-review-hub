# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (HMR).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the production build locally.
- `npm run lint` — run oxlint (config in `.oxlintrc.json`; rules: `react/rules-of-hooks`, `react/only-export-components`).

There is no test suite / test runner configured in this project.

## Architecture

This is a Vite + React 19 SPA (plain `.jsx`, no TypeScript compilation despite the
`@types/*` dev dependencies — those are editor-hint-only). Routing is
`react-router-dom` v7, with all routes declared in `src/App.jsx` and wrapped in a
single shared `Layout` (`src/components/layout/Layout.jsx` → `Header` + page content
+ `Footer`). Each route maps 1:1 to a file in `src/pages/`.

### Design system — `design.md` is the locked source of truth

`design.md` at the project root is a **Hallmark-generated, locked design system**
(see `.hallmark/log.json` for provenance — it was produced by a full-site redesign
pass). It documents the palette, type scale, spacing, radii, motion, and CTA voice
that every page and component must stay consistent with. **Read it before making any
visual change** — don't invent new colors, fonts, or spacing values; extend the
tokens below instead, and update `design.md` if the system itself needs to change.

Tokens live as CSS custom properties in `src/design-system/tokens/{colors,typography,
spacing,fonts}.css`, aggregated by `src/design-system/styles.css` and imported once
in `src/index.css`. Pages and components consume tokens by name via inline
`style={{ color: "var(--text-default)", ... }}` objects — there is no CSS-in-JS
library, Tailwind, or CSS Modules in this codebase; **all styling is either an inline
style object referencing a `var(--token)`, or the component-scoped CSS pattern
below.** Semantic token names (`--text-default`, `--surface-subtle`,
`--brand-primary`, `--radius-lg`, `--space-32`, etc.) are the same names used
throughout every page — check `colors.css`/`spacing.css`/`typography.css` for the
full list before adding a new one.

Fonts are self-hosted `.woff2` files in `src/design-system/assets/fonts/`, declared
via `@font-face` in `tokens/fonts.css`.

### Component-scoped CSS pattern

Every component in `src/components/**/*.jsx` follows the same convention: a `CSS`
template-string constant at the top of the file (plain CSS, using `var(--token)`
references only), injected into `<head>` once via a module-level `injected` flag and
a `useStyles()` call at the top of the component function:

```js
const CSS = `.oer-btn { ... }`;
let injected = false;
function useStyles() {
  if (!injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }
}
```

This is the only styling mechanism inside `src/components/`; there's no external
CSS-in-JS dependency. When adding a new component, follow this same pattern rather
than introducing a different one.

Components are organized by concern: `forms/` (Button, Input, Select, Checkbox,
FilterChip), `feedback/` (Badge, StatusBadge), `content/` (ResourceCard,
ReviewTimeline, OutboundLink), `layout/` (Header, Footer, Layout).

### Peer-review status model

`StatusBadge` (`src/components/feedback/StatusBadge.jsx`) encodes the product's
core status concept — four states, each a pill with a colored dot **and** a text
label (never color-only, for accessibility): `unreviewed` (muted/gray — the default
for every resource currently in the catalog, since none has entered review yet),
`not-revised`, `responded`, `revised`. `ReviewTimeline` renders the same
status-to-tone mapping for a resource's version history. If you add a new status,
add it to the `REVIEW` map in `StatusBadge.jsx` and the `TONE` map in
`ReviewTimeline.jsx` together — they must stay in sync.

### Data layer — Supabase-backed, read-only from the client

Catalog data lives in a Supabase Postgres project (`public.resources` table), not in
the repo. `src/lib/supabaseClient.js` creates the client from `VITE_SUPABASE_URL` /
`VITE_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`; copy to `.env.local` for local
dev — the publishable/anon key is safe to commit/expose client-side). `src/data/
resources.js` fetches and shapes that data; it exports:

- `fetchResources()` — async, returns every row from `public.resources` mapped from
  snake_case DB columns to the camelCase shape components expect (`authorList`,
  `primarySubject`, `rubricReviews`, etc.). Used by `Browse.jsx` in a `useEffect`.
- `fetchResourceById(id)` — async, single-row lookup. Used by `ResourceDetail.jsx`
  (route `/resource/:id`).
- `buildFacetGroups(resources)` — takes an already-fetched resources array and
  returns `Browse.jsx`'s sidebar filter facets (counts per `primarySubject`,
  `materialKind`, `license`, `institution`, etc.) — call it after `fetchResources()`
  resolves, not at module load (there's no synchronous `RESOURCES`/`FACET_GROUPS`
  export anymore).
- `EXAMPLE_RESOURCE` — the one hardcoded exception (`isExample: true`), illustrating
  the fully-populated card/detail layout. Not stored in Supabase.

RLS on `public.resources` grants `SELECT` to the anon/publishable key only — **there
is no public write path**. The catalog is single-writer: only the maintainer adds or
edits rows, directly via SQL against the Supabase project (migrations under Supabase,
not tracked in this repo). `Browse.jsx` still filters/sorts/searches client-side via
`useMemo` once the fetched array is in state — same pattern as before, just fed by an
async fetch instead of a static import.

Book covers: `public.resources.cover_url` (nullable) feeds `ResourceCard`'s
Browse-variant cover slot (fixed 144×192, 3:4, `object-fit: cover`); null or a failed
load shows a same-size "No cover" placeholder. Cover images live in the public
Supabase Storage bucket `covers` (2 MB limit; png/webp/jpeg only), named
`<resource id>.<ext>`, and `cover_url` is their public URL
(`https://<project>.supabase.co/storage/v1/object/public/covers/<file>`). The bucket
has no write policies, so the client can't upload — add files via the Supabase
dashboard (Storage → covers) or the service role, then
`update public.resources set cover_url = '<public url>' where id = '<id>'`.

To add a catalog entry: write/run an `insert into public.resources (...)` against the
Supabase project (ask Claude to do this in a session with Supabase MCP access) —
don't add it to a `RAW` array in this repo, there isn't one anymore.
