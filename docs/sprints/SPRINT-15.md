# Sprint 15 — Editorial Refinement 3: About Profile & Featured Publication

Follows Sprint 14's Editorial Refinement 1 & 2. A new, separately-directed
client brief scoped to exactly two sections — the homepage About preview and
"The Great Debate" Featured Book section — explicitly excluding the header,
hero, Teaching Areas, and footer, and explicitly not revisiting Tier 1
decisions absent a genuine regression.

Required reading confirmed before implementation: `docs/CREATIVE_DIRECTION.md`,
`docs/DESIGN_SYSTEM.md`, `docs/HOMEPAGE_EDITORIAL_AUDIT.md`,
`docs/BRAND_USAGE.md`, and the current homepage implementation, followed by
an in-browser inspection of both sections before writing any code.

## Part 1 — About: premium editorial profile

Three composition directions were considered against the existing homepage
(full detail in `docs/HOMEPAGE_EDITORIAL_AUDIT.md`'s ER3 outcome addendum):
an asymmetric spread with a pull-quote, a text-dominant "magazine profile"
with a small sticky emblem column, and a lighter-touch version of ER2's
existing two-column layout with one added typographic lede. The text-dominant
direction was chosen — it's the composition most different from the Hero and
the (now cover-dominant) Featured Book, which directly serves the brief's own
homepage-rhythm requirement, and it accommodates the "no fabricated
quotation" constraint more naturally than a literal pull-quote device.

`src/components/sections/about-preview-section.tsx` rebuilt: a narrow
(`lg:grid-cols-[0.55fr_1.45fr]`) sticky `PortraitFrame` column beside a wide
text column — eyebrow ("Who teaches here") → name → an unquoted editorial
lede statement (`font-display text-2xl sm:text-3xl`, deliberately without
quotation marks — no genuine direct quote from Ahmad Mohamed Kassa exists to
attribute) → a body paragraph carrying the full biographical detail (Arabic
and Islamic Studies in Kuwait, foundational training under respected
teachers, the Computer Science and Telecommunications degree, the PGCE from
the University of London, Ruqyah since 2009 taught in the UK and abroad,
Khateeb at Masjid Al-Noor) → a restrained four-line marginal index → a single
understated "Read the full biography" CTA. No new facts were introduced;
every sentence traces to material already established on the site. The
`PortraitFrame` emblem placeholder itself (established in ER2) was left
unchanged — it already satisfies "the emblem should continue to occupy the
visual role elegantly... without architectural redesign" once a real
portrait exists, since a photograph drops into the same aspect box with no
component change.

## Part 2 — Featured Book: premium publication feature

The existing section was audited first (full detail in the audit addendum):
cover size was adequate but not dominant, copy didn't compete with the
cover, but the section shared the page's default grid rhythm rather than
breaking it — the single highest-leverage gap named in the original ER1
audit (Section 6) and left open at the end of ER2. Of the layout directions
considered ("Large Cover / Quiet Copy," "Editorial Spread," "Offset Cover"),
the enlarged-cover direction was chosen — it directly answers the audit's
own "the cover should be the largest single visual element on the page"
finding without resorting to a gimmick (an offset/bleed cover) purely for
novelty, which the brief explicitly warned against.

`src/components/sections/featured-book-section.tsx`: cover column widened
(grid ratio `minmax(0,0.55fr)_1fr` → `minmax(0,0.62fr)_1fr`; cover's own cap
`max-w-xs lg:max-w-sm` → `max-w-xs lg:max-w-md`). An honest, conditionally
rendered publication caption was added below the cover
(`[book.category, publicationYear].filter(Boolean).join(" · ")` — only real
`Book` schema fields, never fabricated, and rendered only when at least one
is actually set) and a plain "By {authorName}" line was added beneath the
title — satisfying the brief's "subtle author connection, not a separate
author card" instruction. The CTA button set (`Learn more`, conditional
`Buy on Amazon`, conditional `directBookSales`-gated `Purchase direct`) was
left completely untouched, as was the `isFeatureEnabled("directBookSales")`
gate. No marketing labels ("Featured," "Best seller," etc.) were added — the
already-removed ER2 "Featured" badge was not reinstated. The emblem was
deliberately **not** added to this section: the brief itself warns against
stamping the mark in "simply because it exists," and the section's purpose
is the cover commanding attention on its own.

## Rhythm check

Walked Hero → Featured Book → About → Teaching Areas after both changes:
Hero (image-led, moderate asymmetry) → Featured Book (cover-dominant, the
single largest visual element on the page) → About (text-dominant, small
sticky emblem) → Teaching Areas (pure typographic list, no image at all) —
four adjacent sections, four different compositional types, satisfying the
brief's "must not read as two-column, two-column, list, two-column repeated
mechanically" requirement without introducing a new color, font, or motion
primitive.

## What was removed

ER2's `MARGIN_INDEX` (a flowing, comma-joined credential sentence) was
replaced with a four-line stacked index — checked against the brief's own
"if it makes the section feel like a CV, remove it" instruction and judged
to still read as marginalia (small, muted, tracked, one top hairline, no
bullets/borders/icons) rather than a CV list. Nothing else was removed;
both sections were small, targeted additions rather than rewrites.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean.
- `npm test` — 35/35 passing.
- `npm run build` — all 34 routes generated successfully.
- Live-browser check of the homepage at ~390px, ~768px, and desktop
  (~1456px), covering both redesigned sections plus the surrounding Hero/
  Teaching Areas rhythm.
- `/books/the-great-debate` (the real book detail page, not touched by this
  sprint but sharing the same `Book` data shape) checked for regressions:
  no console errors, no failed network requests (all `200`/`304`).

## What still prevents 9.7+

No real portrait exists yet, so About's media column still carries the
emblem rather than photography — the layout now accepts a real portrait in
the same sticky slot with zero architectural change, but the section's full
"documentary portrait" effect is necessarily unrealized until one exists.
The Featured Book publication caption currently renders nothing in
production, since the seed `Book` row has neither `category` nor
`publicationDate` set — correct, honest behavior today, but means the
metadata treatment is implemented and not yet visually verified against
real data. Tier 2/3 items named in the ER2 audit addendum but out of this
brief's two-section scope (header/footer logo hover, Ask Ahmad CTA copy,
CTA section reordering) remain open, untouched by design.
