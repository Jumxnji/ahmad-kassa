# Sprint 11 — Homepage Redesign & Brand Identity Integration

*Written retrospectively during Sprint 13's documentation reconciliation. This
sprint happened before Sprint 13 — nothing here was performed during the
reconciliation pass; this file documents work that shipped earlier, since it never
got a dedicated sprint doc at the time.*

The client supplied a new logo emblem — a calligraphic "Ahmad" set inside a
teardrop/flame mark, commissioned from a designer — replacing the Sprint 2 mark, and
directed a full homepage rebuild around it: "The brand identity has now been
finalised... continue from the completed project."

## Asset delivery and mark integration

The designer delivered a batch of raw files (`AHMAD.ai` Illustrator source,
`AHMAD-06.svg` clean vector export, several raster/reference comps, two
still-Fiverr-watermarked drafts). `logo-mark.svg`, `logo-mark-white.svg`, and
`logo-mark-dark.svg` were replaced in place with the new mark's path data in three
flat colourways (gold/paper/navy) — the same technique the existing system already
used for the old mark, not a redesign of the approach. Every existing consumer
(`Logo` component, `src/config/brand.ts`) picked up the new mark automatically since
the file paths didn't change.

No vector wordmark was supplied — only the mark. The site's existing pattern of
composing the wordmark live in HTML/CSS (Newsreader) rather than shipping a
flattened lockup file was kept, not redesigned.

## Homepage rebuild

- **Hero** (`hero.tsx`) rebuilt with a Mode A/B visual-slot mechanism:
  `HERO_VISUAL: "emblem" | "portrait"`, a single local constant. Mode A
  (`hero-emblem.tsx`) — the mark as a large "seal," soft radial gold glow, hairline
  rings — built and wired live. Mode B (`hero-portrait.tsx`) — built on the existing
  `PortraitFrame` pattern, occupies the identical composition slot, ready for a
  one-line constant swap once a professional portrait exists. This was a deliberate,
  plain code-level switch, not CMS-wired — avoiding scope creep into an upload UI
  for this pass.
- **Featured Book** promoted from position 3 to position 2 (right after Hero), given
  a larger `BookCover`, an asymmetric editorial grid, and a small gold "Featured"
  seal accent — same underlying data contract (`homepageService`/
  `bookService.resolveFeatured()`), no service-layer changes.
- **Teaching Areas** — new section, five cards reusing the same real topic taxonomy
  Ask Ahmad's question categories already established (Aqeedah, Fiqh, Marriage &
  Family, Ruqyah, Mental Health), not an invented marketing list. Fills the
  conceptual slot the old, already-orphaned `PillarsSection`/`PillarCard` (deleted in
  Sprint 10 for having zero remaining references) used to occupy — built fresh for
  the new visual language rather than restored.
- **Latest Khutbah** (`featured-lectures-section.tsx`, exported `LatestKhutbahSection`)
  restyled into a single editorial spotlight card rather than a grid, featuring the
  one lecture already categorized `"Weekly Khutbah"` — every lecture in
  `src/lib/data/lectures.ts` is honestly `status: "coming-soon"`, so the section
  keeps that framing rather than implying a real upload exists.
- **About Preview** credentials rewritten into short editorial labels sourced only
  from facts already in the existing bio paragraph — no new claims.
- `FeaturedArticlesSection` removed from the homepage entirely (the `/articles` page
  and its nav link untouched) — Articles was explicitly asked to become less
  prominent until there's real content.
- Real final section order: Hero → Featured Book → About Preview → Teaching Areas →
  Quote → Latest Khutbah → Future Courses → CTA → Newsletter.

## Cross-cutting patterns introduced

- **`ScrollReveal`** (`src/components/shared/scroll-reveal.tsx`) — a small client
  island wrapping `whileInView`/`useReducedMotion()`, so an `async` Server Component
  section can get the same scroll-triggered fade-up `hero.tsx` gets without itself
  becoming a Client Component. See `docs/ARCHITECTURE.md`.
- **`.manuscript-texture`/`.manuscript-texture-navy`** (`src/app/globals.css`) — a
  warm radial glow + low-opacity geometric-tile background utility, applied via
  `Section`'s new `texture` prop. Used on Hero and the two navy sections (Quote,
  Newsletter) only — not applied globally.
- **Recurring mark usage, kept deliberately subtle**: the hero seal, a
  5%-opacity full-bleed watermark on navy sections, and an optional mark-glyph
  variant on `ManuscriptDivider` (`mark` prop) reserved for one or two genuinely
  significant transitions per page.

## A real bug found and fixed during this sprint

**`tailwind-merge` `bg-` prefix collision.** The navy-tuned texture utility was
first named `bg-manuscript-texture-navy` and silently broke the navy background
underneath it — `tailwind-merge` (used by this project's `cn()` helper) groups
classes into conflict buckets by name pattern, not by what they do, so anything
matching `bg-*` was treated as a "background colour" utility and collided with the
real `bg-navy-950` class, with whichever appeared later in the string silently
winning. Fixed by renaming to `manuscript-texture-navy` (no `bg-` prefix). See
`docs/ARCHITECTURE.md` for the durable, future-facing writeup of this gotcha.

## What this sprint deliberately did not touch

- Favicons, platform icons (`apple-touch-icon.png`, `android-chrome-*`,
  `mstile-150x150.png`), `safari-pinned-tab.svg`, the OG/Twitter fallback images, and
  the transactional email logo were **not** regenerated from the new mark in this
  sprint — flagged at the time as a known, deliberate gap, not an oversight. This
  gap later caused the live brand-asset break repaired in Sprint 13.
- The site header's "AMK" abbreviated wordmark was left unchanged — full-name digital
  lockup work was deferred to a future Editorial Refinement sprint.
- No new content types, no CMS changes, no backend/architecture changes beyond the
  two client-side patterns above.

## Verification

Live-browser checked at 375/768/1024/1440px+, plus a `prefers-reduced-motion: reduce`
pass confirming every new scroll-reveal goes static. `tsc --noEmit`, `eslint
--max-warnings=0`, `vitest run`, and `next build` all stayed clean.
