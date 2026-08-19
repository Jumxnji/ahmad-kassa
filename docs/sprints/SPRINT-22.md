# Sprint 22 — Courses Page Editorial Rebuild

## Brief

The Secondary Pages Editorial Audit scored `/courses` 5/10. A live
in-browser re-review confirmed the diagnosis: an oversized opening,
illustration-heavy cards, a 4-column grid that orphaned the fifth
course on its own row, repeated "Coming soon" pills, and icon panels
adding no substantive information — the same course-marketplace
visual language the homepage's own Future Courses section had already
moved away from in Sprint 19. The brief specified the destination
directly: an **Editorial Programme Index**, all five real courses
presented as five deliberate entries, no grid.

## Content-truth investigation, before any layout work

**Opening copy.** The old description — "A sequenced academy in
Aqeedah, Fiqh, and Arabic" — was checked against the five real
courses (Psychology in Islam, Marriage in Islam, Foundations of
Ruqyah, Islamic Family Guidance, Understanding Aqeedah). Only Aqeedah
matches; Fiqh and Arabic don't correspond to any live course. This is
the same category of unsupported, invented positioning copy found and
removed from Books (Sprint 20) and About (Sprint 21) — not preserved.
Replaced with the homepage's own already-approved Future Courses copy
("Structured courses in the areas asked about most — built for depth,
not just completion"), the established pattern of reusing real,
approved copy rather than inventing new claims, plus one honest,
page-level status line ("Five programmes are currently in
development") that also does the work item 8 of the brief asked for.

**Level labels (Beginner/Intermediate).** `src/lib/data/courses.ts`
has no comment documenting the provenance of these values, and there
is no CMS/admin editing path for courses (static data only) —
strictly, their origin can't be verified as a deliberate pedagogical
decision. However, they are not uniform: 4 of 5 courses share
"beginner" and one (Psychology in Islam) is "intermediate" — a
non-uniform pattern is more consistent with a genuine, if informal,
editorial judgment than a lazy placeholder default (which would more
likely show the same value everywhere). Classified **Supported, not
Verified** — retained as quiet metadata per the brief's own
instruction for this classification, not upgraded to a confident
claim.

**Category.** `Course` (`src/types/content.ts`) has no `category`
field at all — unlike `Book`, which does. The brief's suggested entry
composition mentions "category" as potential left-column metadata;
this project has no real category data for courses, so category is
**omitted entirely** rather than invented. Level fills that role in
the metadata column instead.

**"Notify me at launch."** `CourseInterestLink`
(`src/components/cards/course-interest-link.tsx`, still used
unmodified by the homepage's `FutureCourseCard`) is a plain `<Link
href="/newsletter">` with a `trackEvent({ name: "course_interest_click",
props: { courseSlug } })` call on click — it is the general newsletter
signup, not a course-specific waitlist; no per-course notification
infrastructure exists anywhere in the codebase. This page's own
"Notify me at launch" link (in the new `ProgrammeEntry`, not a reuse
of `CourseInterestLink` — see below) points to the same real
`/newsletter` route and fires the same `course_interest_click` event
with `courseSlug`, so the underlying behavior is identical and
truthful; only the bell icon was dropped per the brief's explicit
"if the bell icon makes the page feel like software UI, remove it and
use a restrained text action" instruction. The label was not changed
to something more literal like "Join the newsletter" because the
underlying action — one email, sent once, when this specific
course's enrollment opens via the newsletter's own segmentation — is
accurately described by "notify me at launch"; nothing about the
current copy overclaims a capability the newsletter can't deliver.

### Content-truth classification (all five courses)

| Field | Status | Note |
|---|---|---|
| Title | Verified | Matches the real, unedited course data. |
| Excerpt/description | Verified | Genuine existing copy, unedited, unpadded. |
| Level | Supported | Non-uniform pattern (4 beginner, 1 intermediate) suggests genuine judgment; provenance undocumented, not confirmed as a deliberate curriculum decision. |
| Category | N/A — not in schema | Omitted rather than invented. |
| Status ("coming soon") | Verified | `status: "coming-soon"` on all five, genuinely true — the academy has not launched. |
| CTA behaviour | Verified | Confirmed by reading `CourseInterestLink`'s actual implementation: real `/newsletter` link + real analytics event, not decorative. |

## Removed from the public presentation

`CourseCard`, `CourseIllustration` (the decorative panel/circular
icon), `COURSE_ICONS`, and the repeated gold "Coming soon" pill badge
are no longer used by `/courses`. Not replaced with new icons,
thumbnails, or photography — typography, hairline rules, numbers, and
whitespace carry the page instead, per the brief.

**Left orphaned, not deleted.** `CourseCard`/`CourseIllustration`/
`COURSE_ICONS` were already unused by the homepage since Sprint 19
(which built `FutureCourseCard` instead); with this sprint they lose
their only remaining consumer (`/courses` itself) and become fully
unreferenced anywhere in `src/`. They were not deleted in this pass —
removing genuinely dead files wasn't part of this directive's scope,
and doing it unasked risked broadening the change beyond "rebuild
`/courses`." Flagged here explicitly as a real, safe cleanup
candidate for a future pass, not a silent gap.

## Selected composition

**Editorial two-column entry**: a fixed-width left column (number +
level, `lg:w-36`) beside a flexible right column (title, excerpt,
"Notify me at launch"), hairline `border-t` dividers between entries,
collapsing to a single stacked column below `lg` (1024px). Built and
compared live against a single-column stacked-at-all-widths
alternative (closer to Teaching Areas' `TeachingAreaRow`, which uses a
narrower `3rem` number-only left column since it carries no
level/status metadata) — the two-column split reads meaningfully
stronger at desktop specifically because Courses entries carry more
metadata than Teaching Areas' rows (level, not just a number), so a
dedicated metadata column earns its keep here in a way it wouldn't for
a simpler list. `TeachingAreaRow` itself was not reused or modified —
this page needed its own component with its own props shape
(`level`, no `icon`), consistent with the established "new
presentational component per page" pattern (Sprint 18's
`VideoCard`/`KhutbahEntry`, Sprint 20's `CourseCard`/
`PublicationEntry`).

New: `src/components/catalog/programme-entry.tsx` (`ProgrammeEntry`),
`src/components/catalog/programme-index.tsx` (`ProgrammeIndex`) —
alongside Books' `publication-entry.tsx`/`publication-index.tsx` in
the same `catalog/` directory, the same "numbered index, not a grid"
family of components.

## A real engineering bug found and fixed mid-sprint

While building and live-verifying the hover/focus treatment, the
dev server's cold-start Turbopack build began panicking with `'src/
generated/prisma/prisma' is a symlink causes that causes an infinite
loop!`, crashing the entire CSS pipeline (new utility classes silently
stopped compiling into the served stylesheet — not a Tailwind syntax
problem, a build panic). Root cause: a stray, self-referencing symlink
(`src/generated/prisma/prisma → src/generated/prisma`) sitting inside
the gitignored, untracked `src/generated/prisma/` directory — almost
certainly accidental debris from an earlier session's isolated
`git worktree` verification step, where a symlink meant to be created
inside a `/tmp` worktree was instead created in the real project
directory. Removed the stray symlink (a single untracked file, not
project source, not touched by git) and did a full clean restart
(`rm -rf .next`); the dev server and production build both work
correctly afterward. This is exactly the kind of "genuine shared
issue, minimal fix" exception the brief allowed for — no design or
unrelated code was touched to resolve it.

## Coming Soon

Not rendered 5 times as a pill. "Five programmes are currently in
development" appears once, at page level, in the opening description.
No per-entry status label — with that framing already set, and every
entry visibly identical in this respect, repeating it five more times
would be exactly the redundancy the brief asked to avoid, not added
clarity. Availability stays unambiguous: nothing on the page implies
any course is open for enrollment.

## Hover / focus

`ProgrammeEntry` uses a named `group/entry` (matching `PublicationEntry`'s
own naming convention) — on hover or keyboard focus of the "Notify me
at launch" link, the title shifts `translate-x-1` (4px) and the number
tints from `gold-700` toward `gold-600`, both over 200ms. No scale,
shadow, glow, or large movement. Verified directly via
`getComputedStyle` (`translate` — not `transform`, per this project's
established Tailwind v4 verification method) confirming the value
changes from `none` to a real translate on both mouse hover and
`.focus()`; keyboard-focus parity confirmed the same way. Inherits the
sitewide `prefers-reduced-motion` CSS override — no new motion system.

## Section rhythm / page end

Opening compressed with the same asymmetric-padding technique Books'
proportion correction used (`docs/sprints/SPRINT-20.md`'s "Correction —
Proportion, Pacing & Hierarchy"): `pt-14 sm:pt-16 pb-28 sm:pb-36` on
the page's `Section`, tight top so entry 01 appears within the first
viewport at normal desktop widths, generous bottom for a clean footer
transition. The old page-end newsletter CTA block was removed
entirely rather than kept — every entry already links to `/newsletter`
via its own "Notify me at launch," so a sixth newsletter mention at
the very end would be pure repetition; the page now concludes after
entry 05 and flows directly into the footer, per the brief's explicit
permission ("not every page needs a conversion section").

## No dead links

Course titles are plain text, never a `<Link>` — no
`/courses/[slug]` detail route exists, so nothing points at a route
that doesn't resolve. **Future recommendation, documentation only**:
once a course genuinely ships with a real detail page, wrap the title
in `<Link href={`/courses/${course.slug}`}>` inside `ProgrammeEntry` —
the component already receives `course.slug` via `ProgrammeEntryData`,
so this is a one-line addition when the time comes, not a
restructure.

## Mobile

Verified at ~545px (this environment's actual resize floor), 768px,
1024px (the exact `lg:` transition), and 1440px. Below `lg`, the
two-column split collapses to a single intentional sequence — number +
level on one line, title, description, action link, hairline rule,
next entry — never five large stacked cards. At exactly 1024px the
two-column layout activates cleanly with no intermediate/half-grid
state.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean (one `no-empty-object-type`
  error caught and fixed: `ProgrammeEntryData` changed from an empty
  `interface extends Pick<...>` to a plain `type` alias).
- `npx vitest run` — 35/35 passing.
- `npm run build` — clean; `/courses` static; confirmed the
  Turbopack panic above is fully resolved in a production build too.
- Live-browser checked at ~545px, 768px, 1024px, and 1440px. Zero
  console errors at any width. No failed network requests. Keyboard
  focus and mouse hover both verified to trigger the intended
  micro-interaction.

## Notes

Homepage's `FutureCoursesSection`/`FutureCourseCard` (Sprint 19) were
not touched. No other secondary page, header, footer, or global
typography changed. Full audit-outcome addendum:
`docs/SECONDARY_PAGES_EDITORIAL_AUDIT.md`'s "Courses Editorial Rebuild
Outcome — Sprint 22" section.

---

## Correction — Opening & Catalogue Register

The programme index itself (numbering, all five entries, the
two-column composition, level metadata, hairline dividers, "Notify me
at launch," hover/focus, responsive behavior) was approved after live
review and explicitly locked — nothing in `programme-entry.tsx` or
`programme-index.tsx` changed in this pass. The remaining problem was
narrower: the opening ("The academy" / "Structured study, in depth")
didn't read as direct or editorial, and there was no real visual
break between the introduction and where the catalogue actually
begins — the two ran together in the same ivory field.

**Opening copy provenance, checked before changing anything.** The
supporting paragraph ("Structured courses in the areas asked about
most...") is genuinely the homepage's own approved `FutureCoursesSection`
copy, reused verbatim — no issue there. The heading and eyebrow are a
different story: `/courses`'s own eyebrow, "The academy," is a
truncation of the homepage's real, approved eyebrow, "The academy —
coming soon" — the honesty qualifier was silently dropped when this
page's opening was first written earlier in this same sprint. That
matters concretely: "The academy" alone implies an operating academy
already exists, when the actual fact is five courses in development.
The heading, "Structured study, in depth," is not the homepage's real
heading either (which reads "Sequenced study, in depth") — it's a
near-paraphrase invented during this sprint's own earlier pass, not
sourced from any approved copy. Both are corrected below.

**Three opening directions built and compared live** at 1440px
against the frozen homepage, the redesigned Books and About pages,
and `docs/CREATIVE_DIRECTION.md`/`docs/DESIGN_SYSTEM.md`:

- **A — Direct Editorial**: eyebrow "Courses," heading "Courses in
  development," a short supporting line. Clear and factual, but the
  heading restates the eyebrow's own word ("Courses... Courses"),
  reading slightly circular rather than adding information.
- **B — Programme-led**: eyebrow "Courses," heading reusing the
  homepage's real, approved "Sequenced study, in depth" verbatim (the
  strongest possible provenance — zero invention). Rejected: a visitor
  arriving from the homepage's own "View the academy" link would land
  on a page repeating the exact section heading they just left,
  reading as duplication rather than this page having its own
  identity.
- **C — Minimal Catalogue** (selected): eyebrow "Courses," heading
  "Five programmes in development," the same short supporting line as
  A. Chosen because the heading alone — not the eyebrow, not the
  supporting line — already answers the brief's own test ("these are
  Ahmad's planned courses, in development, here are the five") in one
  factual sentence: what (programmes), how many (five), status (in
  development). No demand, outcome, or popularity claim anywhere.
  Matches the minimal eyebrow+title(+short description) register
  Books' own opening already established as this site's approved
  "index page" precedent, rather than inventing a fourth register.

**Final opening copy:** eyebrow "Courses"; heading "Five programmes in
development"; supporting line "Structured courses in the areas asked
about most — built for depth, not just completion." (unchanged from
the already-approved homepage copy). The old copy's dangling "Five
programmes are currently in development" sentence was folded into the
heading itself rather than kept as a separate, now-redundant trailing
clause.

**The catalogue register — the actual fix for the intro/catalogue
blur.** A single new element between `PageHeader` and `ProgrammeIndex`,
reusing the exact archival idiom already established by Books'
`PublicationEntry` header row (`flex items-baseline gap-3`, `font-mono
text-[11px] tracking-[0.08em] uppercase`, `text-stone-500`/`-400`) and
a `border-b border-stone-200` hairline rule — no new typographic
language invented:

```tsx
<div className="mt-16 flex items-baseline gap-3 border-b border-stone-200 pb-3 lg:mt-20">
  <span className="font-mono text-[11px] tracking-[0.08em] text-stone-500 uppercase">
    Programmes
  </span>
  <span className="ml-auto font-mono text-[11px] tracking-[0.08em] text-stone-400 uppercase">
    01–05
  </span>
</div>
```

"Programmes" on the left names what follows; "01–05" on the right is
the same numbering already used inside each entry, read as a table-of-
contents range before the reader reaches entry 01 itself. No navy
section, no gold banner, no card, no gradient, no icon, no second
emblem, no thick separator — the distinction is entirely typographic
(a smaller, tracked, mono register against the intro's serif display
type) plus one hairline rule and `mt-16`/`lg:mt-20` spacing.

**Spacing/hierarchy changes:** the `Section`'s own `pt-14 sm:pt-16
pb-28 sm:pb-36` (the asymmetric padding from the original Sprint 22
opening compression) is untouched. The new register sits `mt-16
lg:mt-20` below the (also untouched) `PageHeader`, and `ProgrammeIndex`
keeps its own existing `mt-10 lg:mt-12` below the register — no
change to the vertical rhythm between entries or the footer
transition, since neither was part of this correction.

**What was deliberately left untouched:** the 01–05 numbering, all
five courses, the two-column `ProgrammeEntry` composition, level
metadata treatment, titles/descriptions, hairline dividers between
entries, "Notify me at launch," hover/focus interaction, the no-icon
direction, entry-level responsive behavior, and the footer transition
— none of `programme-entry.tsx`/`programme-index.tsx` changed; only
`src/app/(site)/courses/page.tsx`'s opening block was edited.

**Mobile-specific decision:** verified at ~545px (this environment's
resize floor), 768px, 1024px, and 1440px. The register's `flex
items-baseline` + `ml-auto` layout already collapses correctly at
every width tested with no separate mobile variant needed — "PROGRAMMES"
and "01–05" stay on one line at 545px without crowding, so no
mobile-specific simplification was required.

**Verification (this correction):** `tsc --noEmit`, `eslint
--max-warnings=0`, `vitest` (35/35), and `npm run build` all clean.
Live-browser re-checked at ~545px, 768px, 1024px, and 1440px; zero
console errors or failed requests at any width; heading wraps cleanly
at narrow widths with no overflow or layout shift.

No version bump and no new `CHANGELOG.md` entry — this corrects
Sprint 22's own not-yet-committed opening, not an already-committed
release; the existing Sprint 22 `CHANGELOG.md` entry and `0.20.0`
`package.json` version already cover this page's work as a whole and
were amended in place rather than duplicated.

## Correction — Register-to-Programme-01 Spacing

After the opening correction above, live review found the gap between
the "PROGRAMMES — 01–05" register's hairline and programme 01 read as
slightly detached from the catalogue it introduces. The only
controllable lever is `ProgrammeIndex`'s own top margin — its
`mt-10 lg:mt-12` (40px / 48px) sits on top of `ProgrammeEntry`'s own
protected `py-9 lg:py-10` padding, which is not part of this
correction.

Three margin values were tested live (register-hairline-to-"01" text,
measured via `getBoundingClientRect`, not eyeballed): current
(40/48px margin → 103px total gap at 1440px), ~10% tighter
(36/44px → 99px), and ~15–20% tighter (32/40px → 95px). The tightest
option was chosen — not for being smallest, but because even at its
tightest the entries retain their own generous internal padding
(~55px worth of the total gap comes from `ProgrammeEntry` itself,
untouched), so the register still reads as a deliberate pause, not a
cramped transition. `ProgrammeIndex`'s margin changed from
`mt-10 lg:mt-12` to `mt-8 lg:mt-10` (32px / 40px) — a single class
change, one file.

Verified live at ~545px, 768px, 1024px, and 1440px: the register now
reads as belonging to the catalogue below it while still functioning
as the visual break from the introduction above; no crowding at any
width. Re-ran `tsc --noEmit`, `eslint --max-warnings=0`, `vitest`
(35/35), and `npm run build` — all clean. Nothing else changed:
opening copy, heading, supporting copy, register typography/rule,
programme entries, numbering, titles, descriptions, metadata, "Notify
me at launch," hover/focus, inter-entry separators, and the footer
transition are all untouched.
