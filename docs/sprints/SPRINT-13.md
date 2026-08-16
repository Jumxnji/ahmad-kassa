# Sprint 13 — Baseline Recovery & Documentation Reconciliation

Follows Sprints 11–12. Explicit scope per the client's brief: **not** a redesign
sprint. "Do not change the visual direction. Do not redesign the homepage. Do not
introduce new features. Do not redesign the logo." Priorities, in order: repair the
live brand-asset break; reconcile documentation with actual implementation; preserve
historical documentation appropriately; verify the application is healthy;
establish a clean baseline for future editorial refinement work.

## Root cause

Sprint 11 replaced the mark (`logo-mark.svg` + colourway variants) and rebuilt the
homepage around it, but deliberately did not regenerate every dependent production
asset in that pass (favicons, platform icons, the OG/Twitter fallback images, the
transactional email logo) — a flagged, known gap at the time. Separately, designer
source/reference files (`AHMAD.ai`, raw exports, two still-Fiverr-watermarked
drafts) had been placed inside `public/brand/` — publicly downloadable, despite
being non-production files. Neither of these was a Sprint 11 mistake in the sense of
broken code; they were scoped-out follow-up work that had accumulated into a real,
live gap by the time Sprint 13 started.

## Phase 1–2: Brand asset repair

Every dependent production asset was regenerated mechanically from the same frozen
mark path data (`brand-source/AHMAD-06.svg`) — recoloured/rescaled/rasterized, never
redrawn or reinterpreted:

- `favicon.svg`, `favicon.ico` (hand-rolled multi-resolution ICO writer, no new npm
  dependency)
- `safari-pinned-tab.svg` (single-colour silhouette; a first-draft Y-flip transform,
  copied from the old font-glyph-derived mark's convention, was caught and corrected
  before shipping — the new mark's paths are already Y-down, unlike the old one)
- `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`,
  `mstile-150x150.png` (opaque navy background, mark centred at ~55% height)
- `exports/logo-mark-{64,128,256,512,1024,2048}.png` (transparent raster ladder)
- `og-image.png`/`twitter-card.png` — regenerated through the site's existing
  `renderBrandedOgImage()` (Satori/`next/og`) rather than attempting to recreate the
  old hand-shaped-vector-text source file, which would have required a text-shaping
  pipeline this project doesn't have

Designer source/reference files were moved from `public/brand/` to a new
`brand-source/` directory at the project root — outside `public/`, not publicly
servable.

## Phase 3: Logo lockup policy

The client confirmed the identity is now frozen (the designer is no longer revising
the logo) and clarified the "digital lockup" concept: where the mark and the
wordmark need to appear together, compose them live (mark image/SVG + real text)
rather than shipping a new flattened logo-with-text file. Applied concretely to the
transactional/newsletter email header (`src/lib/email/layout.ts`), which previously
referenced a deleted flattened lockup PNG.

The client separately raised a concern that the light/dark mark colourway files
(`logo-mark-white.svg`/`logo-mark-dark.svg`) had been deleted and regenerated
without consent. Direct inspection confirmed they were fully intact — the exact
colourway variants generated in Sprint 11, byte-for-byte consistent path data — and
this was corrected with the client rather than silently proceeding. Per the client's
explicit "consent before you make such changes" instruction, no further action was
taken on those three files pending their own visual review of header alignment.

The header's "AMK" abbreviated wordmark was evaluated against Phase 3's guidance and
deliberately left unchanged in this sprint — implementing the full-name digital
lockup in the header is scoped as part of a future Editorial Refinement sprint
(typography/hero work), not this repair-only pass; making that change now would
functionally start the next design sprint the client explicitly asked to defer.

## Phase 4: Brand asset manifest

`public/brand/README.md` was substantially rewritten: every stale reference removed
(old `favlogo/` paths, the deleted `logo-primary*.svg` family, the deleted
`og-source.svg`, the dead `brand.logo.primary` code example, the now-false "not yet
regenerated" note), and a canonical per-asset manifest table added (file path,
purpose, source/master, light/dark suitability, generated-vs-supplied, where used)
— see `docs/BRAND_USAGE.md` for the corresponding quick-reference rules.

## Phase 5: Documentation reconciliation

Targeted corrections, not rewrites, across:

- **`docs/PROJECT_MEMORY.md`** — corrected the stale "never redesign the Sprint 1
  design system" claim, recorded the Sprint 11 mark replacement/homepage redesign/
  Hero Mode A-B/current section order, and scoped the Sprint 2.5 diacritics
  correction to the mark it actually applied to. Historical sprint records
  untouched.
- **`docs/ROADMAP.md`** — added Sprint 11–13 to Completed, relabeled the
  now-stale "Sprint 11 candidate" immediate-priority heading (that number now
  belongs to real, different, already-shipped work), and added a frozen-logo
  constraint plus a pointer to the new Editorial Refinement sequence.
- **`docs/UX_ARCHITECTURE.md`** — restructured with an explicit CURRENT/PLANNED/
  FUTURE-ASPIRATIONAL legend and corrected section-by-section against the real
  implementation: the real 5-item nav (not 7), the real homepage section order and
  content, the real `/ask` vs `/contact` split (previously documented as one page),
  the real footer layout, and explicit future-aspirational flags on everything that
  was planned but never built (a Khutbah library page, a Videos page, real search, a
  language-selector UI). The long-term academy vision was preserved, not deleted.
- **`docs/BRAND_USAGE.md`** — rewritten to remove claims about a horizontal/vertical
  logo lockup that never existed as production files, and reconciled against the
  real mark placements and the digital-lockup policy.
- **`docs/PERFORMANCE.md`** — corrected the About-page DB-call claim (metadata does
  call `aboutService.get()`; only the visible content is hardcoded/zero-DB) and
  added the Sprint 10 admin 404 boundary to the error-boundary list.
- **`docs/ACCESSIBILITY.md`** — added the `ScrollReveal` pattern to the
  reduced-motion inventory; replaced the stale, hardcoded Sprint-9 RTL
  physical-utility counts with a reproducible `rg` audit command, since a stored
  count goes stale within a sprint or two and had already done so.
- **`docs/ARCHITECTURE.md`** — added a new cross-cutting section covering the
  `ScrollReveal` client-island pattern, the Section texture mechanism, and the
  `tailwind-merge` `bg-` prefix naming gotcha, cross-referencing rather than
  duplicating `docs/DESIGN_SYSTEM.md`'s design rationale.
- **`docs/DEPLOYMENT.md`** — the environment-variable table was rebuilt from
  `.env.example` (the prior table was missing `DATABASE_URL`, `AUTH_SECRET`,
  `AUTH_TRUST_HOST`, `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` entirely), and
  reorganised into required-in-production / feature-specific / optional /
  reserved-inert-scaffold, explicitly stating Stripe has no live integration code
  anywhere in the codebase yet.

## Phase 6: Paper trail

`CHANGELOG.md` gained three retroactive entries (v0.10.0 Sprint 11, v0.11.0 Sprint
12, v0.11.1 this sprint) and this file — documenting Sprints 11–12 after the fact,
clearly labeled as retrospective, without claiming the work happened during Sprint
13 or inventing dates that didn't occur.

## Phase 7: Creative governance check

`docs/CREATIVE_DIRECTION.md` and `docs/DESIGN_SYSTEM.md` were reviewed for
contradictions introduced by this sprint's asset regeneration and documentation
changes. None found — both left unmodified, per the client's explicit "do not
rewrite them if no correction is required."

## Phases 8–10: Verification

**Phase 8 — current-state truth check.** Confirmed directly against the codebase
(not assumed) before writing the Phase 5 corrections above: real primary nav is 5
items (About, Books, Courses, Articles, Ask Ahmad — `src/constants/navigation.ts`);
real homepage section order matches Sprint 11's build; `/ask` and `/contact` are
genuinely separate routes with different real components; `/courses` is a real, live
"coming soon" page; `/dashboard` and `/academy` are real but bare `EmptyState`
placeholders, not a designed waiting-list page; the footer's language `<select>` is
real but disabled; Stripe has no live integration code anywhere.

**Phase 9 — live browser verification.** Dev server run locally; every regenerated
brand asset requested directly and confirmed `200`: `/brand/favicon.svg`,
`/brand/favicon.ico`, `/brand/apple-touch-icon.png`, `/brand/manifest.webmanifest`,
`/brand/mstile-150x150.png`, `/brand/safari-pinned-tab.svg`,
`/brand/android-chrome-{192x192,512x512}.png`, `/brand/og-image.png`,
`/brand/twitter-card.png`, `/brand/exports/logo-mark-256.png`, and all three
`logo-mark*.svg` colourways. Homepage, About, Book Detail, and every primary nav
route loaded with zero console errors and zero failed network requests (verified via
the browser's console/network inspection, not just visual spot-checks). Header,
footer, hero (mark seal + digital lockup), and the navy-section watermarks all
render exactly as documented above and in `docs/UX_ARCHITECTURE.md`.

One genuine, pre-existing finding surfaced during this check, **not caused by this
sprint and not fixed in it**: a completely unmatched top-level path (e.g.
`/this-page-does-not-exist`) renders Next's bare default 404, not the branded
`(site)/not-found.tsx` — because no root-level `src/app/not-found.tsx` exists, only
the route-group-scoped one. A `notFound()` call *within* a matched route (e.g. an
invalid `/books/[slug]`) correctly renders the branded page. This is a structural
Next.js App Router gap, unrelated to the brand-asset break, flagged here for the
client's decision rather than fixed under this repair-only sprint's scope.

**Phase 10 — engineering verification.** `tsc --noEmit`: clean. `eslint src
--max-warnings=0`: clean. `vitest run`: 6 files, 35 tests, all passing. `next build`
(Turbopack): compiled and generated all 34 static/SSG routes successfully — the only
build-time output was a benign, pre-existing macOS `objc[...]` warning about a
duplicate `sharp`/libvips dylib version between the project's own `sharp` dependency
and the one Next bundles internally; cosmetic, does not affect the build or runtime.

`git status` reviewed in full: this sprint's own changes are exactly the files
listed in "What was found and fixed" and "Phase 4/5/6" above — no unrelated files
touched. Separately, and predating this sprint entirely: **the repository's git
history stops at Sprint 6** ("Ignore local-dev media uploads"); every sprint from 7
through this one exists only as uncommitted working-tree changes. Per the client's
explicit instruction, nothing was committed during this sprint — this is noted here
as a fact for the client's awareness, not something this sprint attempted to
address.

## Checkpoint: root 404 fix & Git history

Two items were flagged in the original baseline report as needing the client's
decision. Both were resolved in a follow-up checkpoint pass, still within this
sprint (not a new one) per the client's framing ("resolve the two remaining
baseline issues you identified").

### Root 404 fix

**Root cause**: `(site)/not-found.tsx` only renders when a `notFound()` call
happens *within* a matched route inside the `(site)` segment tree (e.g. an
invalid `/books/[slug]`). A completely unmatched URL — a typo, a dead link —
matches no route segment at all, so Next never mounts `(site)/layout.tsx` and
falls back to its own bare default 404 instead. No root-level
`src/app/not-found.tsx` existed to catch that case.

**Solution**: added `src/app/not-found.tsx`, which renders `SiteHeader`/
`SiteFooter` directly (the same components `(site)/layout.tsx` uses) around the
same content, rather than a bare, disconnected page. The actual 404 content
(previously inline in `(site)/not-found.tsx`) was extracted into a shared
`src/components/shared/not-found-content.tsx`, so both files render one
implementation instead of duplicating it — and it now includes the official
mark via `ManuscriptDivider`'s existing `mark` variant, which the page
previously lacked. `robots: { index: false, follow: false }` metadata carried
over unchanged.

Verified live: a random unknown URL now renders the full branded page (header,
mark-glyph divider, "This page isn't here," two CTAs, footer); an invalid book
slug still renders identically via the unchanged `(site)/not-found.tsx` path;
mobile viewport (390×844) collapses correctly (hamburger nav, stacked CTAs).

### Git checkpoint

Investigated the full working-tree diff and `git log` before touching anything:
no secrets, no `.env` (real values, correctly gitignored), no build artefacts,
no AI-tool config directories appeared in `git status`. Two real issues found
and fixed: `.gitignore`'s `.env*` pattern was accidentally also excluding
`.env.example` (a secret-free template meant to be shared — fixed with a
`!.env.example` exception), and `brand-source/`'s two authoritative files
(`AHMAD.ai`, `AHMAD-06.svg`) needed a deliberate include/exclude decision — the
two Fiverr-watermarked drafts and five non-essential reference comps in the
same directory are now gitignored rather than committed.

Sprints 7–13 were organised into four commits — not a fabricated per-sprint
history, since most sprints share files with no intermediate commit to
separate them on. Where a shared file's diff was traceable to one clear origin
(e.g. `src/app/layout.tsx`'s Sprint 9 analytics/verification additions vs.
`src/app/globals.css`'s Sprint 11 texture utility), it was placed with that
origin; where it wasn't (e.g. `src/lib/email/`, majority Sprint 7 with a small
Sprint 13 digital-lockup edit inside it), the whole file went into its
majority-origin commit rather than being split:

1. **Sprints 7–10** — the Ask Ahmad/Contact communication system, newsletter +
   campaigns, launch-readiness (SEO, analytics, accessibility, performance, OG
   images), and Sprint 10's QA fixes and dead-code deletions.
2. **Sprint 11** — the new mark (`logo-mark*.svg`, `brand-source/`'s two
   authoritative files) and the homepage redesign (Hero Mode A/B, Featured
   Book promotion, Teaching Areas, `ScrollReveal`, the texture utility).
3. **Sprint 12** — `docs/CREATIVE_DIRECTION.md` and the `docs/DESIGN_SYSTEM.md`
   revision, untouched by this sprint's own work.
4. **Sprint 13** — everything this sprint (and this checkpoint) actually did:
   regenerated brand assets, `brand-source/` relocation, every reconciled doc,
   the new sprint docs, `CHANGELOG.md`, the root 404 fix, and the `.gitignore`
   corrections.

See `git log` for the final commit messages and exact file lists.

## What this sprint deliberately did not do

No visual redesign, no new features, no logo redesign, and no code changes beyond
the brand-asset regeneration and the two small config edits (`src/config/brand.ts`'s
dead field removal, `src/lib/email/layout.ts`'s lockup swap) required to fix the
actual break. The header's wordmark, the About/Hero/section visual treatments, and
every other design decision from Sprints 11–12 were left exactly as they were.
