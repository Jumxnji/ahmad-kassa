# Sprint 19: Future Courses — Editorial Card Correction

## Brief

The homepage remained design frozen overall (Sprint 18). The next
content-driven correction, per the client, was the Future Courses
section: the existing cards read as a generic course-marketplace/SaaS
feature grid — a large decorative icon panel that added no information,
no refined hover interaction, and five courses producing an orphaned
fifth card on a second row. The goal: make courses feel like future
programmes in a premium educational publication — closer to a
university prospectus or editorial programme index than Udemy/Coursera
product tiles.

## What changed

### Data model — `featured` flag on `Course`

`src/types/content.ts` gained `Course.featured?: boolean`, mirroring
the existing `Article.featured` convention exactly rather than
inventing a new pattern. `src/lib/data/courses.ts` marks 4 of the 5
existing courses `featured: true`:

- Psychology in Islam
- Marriage in Islam
- Foundations of Ruqyah
- Understanding Aqeedah

**Islamic Family Guidance** is the one held back — not for weaker
content, but because it and Marriage in Islam both sit under the same
"Marriage & Family" Teaching Area; keeping both on the homepage would
mean two courses competing for one subject while Aqeedah (a genuinely
distinct pillar already established by Teaching Areas) went
unrepresented. It remains a completely genuine, undeleted course
record — `/courses` still renders it via the same unfiltered
`getAllCourses()` call it always used.

This is the "smallest clean architectural solution" the brief asked
for: no hard-coded array slicing, no new content field, no admin UI —
just an explicit editorial boolean already precedented by `Article`.

### New component — `FutureCourseCard`

`src/components/cards/future-course-card.tsx` is a new, homepage-only
card, deliberately kept separate from the existing `CourseCard`
(`src/components/cards/course-card.tsx`), which `/courses` continues to
use unmodified — the same "shared component untouched, new
presentational component for the homepage" pattern already used for
`VideoCard`/`KhutbahEntry` in Sprint 18.

Card structure, top to bottom:

1. A mono/tracked archival-label line — `Coming soon · {Level}` — using
   the same `font-mono text-[11px] tracking-[0.08em] uppercase
   text-stone-500` idiom already established by About's marginal index
   and Khutbah's metadata line. No rounded pill.
2. Course title (`font-display text-xl`).
3. Excerpt (existing course copy, unedited).
4. A hairline `border-t` divider, then the existing
   `CourseInterestLink` ("Notify me at launch," bell icon + text,
   reused completely unmodified).

No thumbnail, icon, illustration, gradient, or repeated brand motif.
Typography, spacing, and a single `border border-stone-200` rule carry
the card.

### Section — `FutureCoursesSection`

`src/components/sections/future-courses-section.tsx` now filters
`getAllCourses()` by `.featured` and renders `FutureCourseCard`. The
grid class (`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`) was left
unchanged — with exactly 4 curated items it already produces the
requested 1 → 2×2 → 4 responsive flow with no orphan state. Section
header copy ("Sequenced study, in depth") and the "View the academy"
button were left untouched per the design freeze.

### Hover / focus interaction

`group` + `focus-within:` on the card, applying to both real `:hover`
and keyboard focus of the inner link equally:

```
hover:-translate-y-1 hover:border-gold-400/50
focus-within:-translate-y-1 focus-within:border-gold-400/50
transition-[transform,border-color] duration-300
```

Confirmed via direct style inspection (`getComputedStyle`) — Tailwind
v4 sets the native CSS `translate` property, not `transform`, for
`-translate-y-*` utilities, so `translate` (not `transform`) is what
must be checked when verifying this kind of interaction going forward.
No scale, shadow, glow, or icon animation. The card lifts 4px and the
border tints toward gold — nothing else moves. Inherits the sitewide
`prefers-reduced-motion` CSS override, confirmed present in
`globals.css`.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean.
- `npx vitest run` — 35/35 passing across 6 files.
- `npm run build` — compiles clean, all 34 routes generate, including
  `/` and `/courses`.
- Live-browser check at 390px (single column), 768px (2×2 grid, no
  orphan), and 1024px (the exact `lg:` breakpoint — full 4-column row,
  balanced, no orphan). No console errors from this section (one
  pre-existing, unrelated Next Image warning on the About portrait was
  observed and left alone — out of scope for this task, About is
  design-frozen).
- Confirmed `/courses` renders all 5 genuine course records, including
  Islamic Family Guidance and Understanding Aqeedah, via `CourseCard`
  and the original icon system — completely unaffected by the
  homepage's new filter.
- Keyboard-focus parity with mouse hover confirmed directly
  (`getComputedStyle(card).translate` === `"0px -4px"` under both).

## Notes

This was a local, content-driven refinement of one section under the
existing homepage design freeze (Sprint 18) — no other section's
composition, typography, or motion changed.
