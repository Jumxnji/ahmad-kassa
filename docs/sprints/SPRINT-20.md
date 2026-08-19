# Sprint 20: Books Index — Publication Archetype

## Brief

The Secondary Pages Editorial Audit scored `/books` 4/10 — the second-
largest cross-site weakness after Articles' content-truth problem. The
page visually behaved like an incomplete ecommerce catalogue: one real
book sitting in the first slot of a 3-column grid clearly built to hold
more, generic "The catalog" framing, and a large stretch of unused space
before the footer. There is genuinely one published book. The brief was
explicit: don't disguise that, and don't apologize for it either.

## Phase 0 — content truth first

Before any layout work, the client flagged a suspected inconsistency:
the index card's excerpt described "The Great Debate" as an examination
of "the arguments for and against belief in God," while the real cover
artwork's subtitle reads "Is It Permissible to Use Jinn in Islamic
Exorcism (Ruqyah)?" — a different subject entirely.

Investigation confirmed it, with a specific provenance:

- `prisma/seed.ts` originally wrote `excerpt`/`description` at seed
  time, when `coverImageId` was still `null` — the seed script's own
  comment says the placeholder text stands in "until a real cover is
  uploaded via the Media Library."
- The live database row shows a real cover **was** uploaded on
  2026-08-01 (`coverImageId` populated, `public/uploads/…-cover.jpg`)
  — but the excerpt/description were never revisited to match it.
- Reading the real cover image directly (not inferring or composing)
  shows its own printed subtitle and strapline: "Is It Permissible to
  Use Jinn in Islamic Exorcism (Ruqyah)?" / "A Critical Analysis of
  Ruqyah, and the Use of Jinn in Light of the Qur'an and Sunnah."
- The book's real Amazon listing URL — already correctly seeded —
  independently corroborates this: its own slug reads
  `GREAT-DEBATE-Permissible-Exorcism-Critical-ebook`.

No bibliographic information was inferred or invented. The correction
uses only text that is itself real source material — quoted verbatim
off the actual published cover, not composed. `prisma/seed.ts` gained a
guarded backfill (identical in shape to the pre-existing Amazon-URL
backfill): it overwrites `excerpt`/`description` only if the field
still holds the exact old placeholder string, so a genuine future
editor rewrite through the admin CMS is never silently clobbered by a
repeat `db seed` run. Applied to the live dev database via `npx prisma
db seed`.

Because `excerpt` is read by the book detail page, its meta description,
its JSON-LD, and the homepage's Featured Book section, this single data
correction fixed the same wrong copy everywhere it appeared — including
the frozen homepage, which is permitted under "design frozen,
content-driven changes only." No homepage code or layout changed.

## Compositions considered

Three directions were weighed, per the brief's own naming:

- **A — Editorial publication spread**: cover and text in a roughly
  balanced asymmetric grid, closest in spirit to the homepage's own
  Featured Book section. Rejected as the primary direction because it
  risked reading as a re-skin of that section rather than a page with
  its own identity — the brief explicitly asked for visual distinction
  from Featured Book.
- **B — Oversized cover, marginal details**: cover as the dominant
  object, information reduced to a narrow sidebar column. Strong
  instinct, but on its own gives the page no answer to "how does a
  second book extend this without looking like a special case for
  book #1."
- **C — Numbered catalogue entry** (selected, blended with B's cover
  dominance): a fixed-width, oversized cover paired with a narrow
  `max-w-md` text column — closer to B's ratio than a 50/50 split — led
  by an archival "01 / Published" label. The number is what makes the
  architecture scale: a second title becomes entry 02 in the same list,
  not a redesign. This also produces the strongest, most legible
  differentiation from Featured Book: a fixed-width cover instead of a
  percentage-based full-bleed grid, no radial gold glow, no primary gold
  button, a constrained measure that doesn't span the container instead
  of stretching to fill it.

## What changed

**New**: `src/components/catalog/publication-entry.tsx` — one numbered
editorial spread (archival label, dominant real-aspect-ratio cover,
title, real subtitle-as-excerpt, author line, understated "Read about
the book →" link — no metadata `dl`, since neither ISBN nor a
publication date is actually set for this title, and a single "English"
language fact wasn't worth its own row). `src/components/catalog/
publication-index.tsx` — maps a list of entries with hairline-divided
vertical spacing; same empty-state message as the retired `BooksGrid`
when zero published titles exist.

**Changed**: `src/app/(site)/books/page.tsx` — swapped `BooksGrid` for
`PublicationIndex`, `size="lg"` on the `Section` (richer vertical rhythm
solves the page-ending gap compositionally, no filler copy), header
copy: eyebrow "Books," title "Published works" (was "The catalog" —
the specific phrase the audit flagged as implying more items should
follow), description reworded to explain the pace of the writing rather
than announce a a schedule of titles.

**Untouched, deliberately**: `BookCard`/`BooksGrid` (still used by Book
Detail's "Related" section — a genuine multi-item grid, where a card
treatment is still correct), `BookCover` (reused as-is by the new
entry component), Book Detail composition, header, footer.

## Header focus-state check

Verified, not changed: the "Books" nav item's focus outline is correctly
`:focus-visible`-gated — a real keyboard `Tab` shows a clear gold ring;
a mouse click shows only the existing gold underline active-state, no
persistent outline. No accessibility issue found; no fix needed.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean.
- `npx vitest run` — 35/35 passing.
- `npm run build` — clean; `/books` static, `/books/[slug]` SSG
  (`the-great-debate`).
- Live-browser checked at ~600px (this environment's actual mobile
  resize floor — a literal 390px was not achievable this session),
  768px, 1024px, and 1440px: no awkward half-grid at any width; mobile
  reads as the intended opening → cover → info → CTA sequence; the
  1024px `lg:` transition is clean.
- Zero console errors/warnings on `/books`.
- CTA verified to route to `/books/the-great-debate`; the corrected
  excerpt/description confirmed rendering correctly there and on the
  homepage's Featured Book section.

## Notes

This was a Books-index-only correction under the existing homepage
design freeze — no other secondary page, and no homepage section's
code, moved in this pass. Full outcome addendum: `docs/
SECONDARY_PAGES_EDITORIAL_AUDIT.md`'s "Books Index Correction Outcome"
section.

---

## Correction — Proportion, Pacing & Hierarchy

The concept above was approved on live browser review, but the
proportions weren't: too much empty space before `01 / PUBLISHED`
appeared, the cover had grown poster-sized, and the text column read
as stranded next to it. This is a correction to the same architecture,
not a second redesign.

**Opening whitespace.** `size="lg"` on the page's `Section` (`py-28
sm:py-36`) had been the mechanism used to fix the *closing* gap before
the footer in the first pass — but it also inflated the *opening*,
compounding with `PublicationIndex`'s own `mt-16 lg:mt-20` before the
entry began. Replaced with explicit `pt-14 sm:pt-16 pb-28 sm:pb-36` on
the `Section` (asymmetric — tight top, the same generous bottom that
already solved the footer transition) and tightened
`PublicationIndex`'s top margin to `mt-10 lg:mt-12`. On a normal
1440–1568px desktop viewport, `01 / PUBLISHED`, the title, and the top
of the cover are now all visible without scrolling.

**Intro paragraph — provenance checked, removed.** "Long-form writing
on belief and practice, built from years of teaching and study — not
released on a schedule" does not exist anywhere else in the repository
(confirmed by grep) — it was written fresh during the first pass, not
pulled from approved source material. No genuinely fitting existing
sentence covers this specific claim elsewhere on the site, so per the
brief's own instruction (retain if supported / replace with real copy
/ remove) it was removed rather than replaced with new marketing
language. Removing it also directly shortens the opening.

**Cover size.** `PublicationEntry`'s cover `max-w` reduced from
16rem/20rem/22rem (mobile/sm/lg) to 13rem/15rem/17rem — roughly 19–23%
smaller at each breakpoint, landing inside the brief's 20–30% starting
range after live-browser judgment. Still clearly the strongest single
object in the composition; no longer competing with the whole page.

**Column rebalance.** Text column widened `max-w-md` → `max-w-lg`;
title `text-3xl sm:text-4xl` → `text-4xl sm:text-5xl`; excerpt-as-
subtitle `text-xl` → `text-2xl`; gap between cover and text reduced
slightly (`lg:gap-20` → `lg:gap-16`) so the two feel like one
composition rather than two separate blocks. Asymmetry preserved — not
50/50.

**Preserved unchanged:** the `01 / PUBLISHED` archival-label concept,
`PublicationIndex`'s list-based scalability, `PublicationEntry` as its
own dedicated component (not reverted to `BookCard`), the internal
"Read about the book →" CTA with Amazon staying exclusive to the
detail page, and Sprint 20's original content-truth correction to the
book's real excerpt/description.

Verified live at ~545px (this environment's mobile floor), 768px,
1024px, and 1440px — no first-viewport emptiness, no half-grid at
tablet, cover and text now read as one balanced spread at every width.
