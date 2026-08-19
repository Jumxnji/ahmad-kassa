# Sprint 14 — Editorial Refinement 1 & 2: Homepage Audit and Tier 1 Implementation

Follows Sprint 13's baseline recovery checkpoint. Two client-directed stages,
run back to back per the client's own sequencing ("Editorial Refinement 1
begins only after this checkpoint is verified").

## Editorial Refinement 1 — Homepage Design Audit

Observation and critique only, per explicit instruction — no code changed.
Delivered `docs/HOMEPAGE_EDITORIAL_AUDIT.md`, a 20-section audit of the live
homepage (studied in-browser at desktop and mobile, cross-checked against
`docs/CREATIVE_DIRECTION.md`/`docs/DESIGN_SYSTEM.md`/`docs/BRAND_USAGE.md`/
`docs/UX_ARCHITECTURE.md`). Headline findings: the hero's near-even column
split contradicted the design system's own "even split reads as template
default" rule; Teaching Areas' icon-in-circle grid was the single most
SaaS-coded element on the page; the About section's portrait slot fell back
to a generic "AK" monogram instead of the emblem, the one placeholder not
reusing the brand's own established convention; the header showed "Ahmad
Kassa," contradicting the client's own locked full-name policy; and the
homepage ran three consecutive same-toned, same-sized sections twice,
violating the layout philosophy's "never let a visitor predict the next
section" principle. Full findings, three proposed hero directions, and a
tiered (1/2/3) prioritised recommendation list are in the audit document
itself.

## Editorial Refinement 2 — Tier 1 Implementation

Implemented the audit's Tier 1 recommendations only, working one area at a
time (header → hero → Teaching Areas → About → footer → whole-page rhythm),
verifying each live in-browser before moving to the next, per the client's
explicit working method.

### Header — digital lockup fix

`src/components/shared/logo.tsx`: renders `siteConfig.name` ("Ahmad Mohamed
Kassa") instead of `siteConfig.shortName`, at all viewports — the emblem was
enlarged (24×34 → 28×40 intrinsic, `h-8` → `h-9`) and the gap/alignment
tuned. Verified at ~390px, ~1024px, and ~1568px: the full name fits on one
line at every width tested, no crowding against the nav/utility cluster.
Since `Logo` is shared, this fixed the footer's identical shortened-name
issue in the same change — the original audit's claim that the footer
already used the full name was itself inaccurate, corrected in the audit
document's Implementation Outcome section.

### Hero — editorial split

`src/components/sections/hero.tsx`: grid ratio changed from
`lg:grid-cols-[1.05fr_0.95fr]` (a near-even split) to `lg:grid-cols-[2fr_3fr]`
(a genuine ~40/60 asymmetry); `HeroEmblem`/`HeroPortrait`'s shared bounding
box widened (`max-w-md` → `max-w-lg`) so the mark reads as a counterweight
rather than a badge floating in extra space. Headline: the emphasis span
moved from "Mohamed Kassa" to just "Kassa" ("Ahmad Mohamed *Kassa*"), the
max-width widened (`max-w-xl` → `max-w-2xl`) and the scale reduced
(`text-7xl` → `text-6xl` at `lg`, bringing it in line with `docs/
DESIGN_SYSTEM.md`'s documented 56–64px H1 range) — the full name now sets on
one line at common desktop widths instead of splitting across two lines that
read as separate elements. The redundant trust line was removed; the
approved identity copy now appears once, split as an overline ("Arabic &
Islamic Studies") above the name and a role line ("Author · Teacher ·
Khateeb") beneath it. Body copy trimmed by one clause for a tighter
editorial measure.

### Teaching Areas — typographic index

`src/components/cards/teaching-area-card.tsx`: `TeachingAreaCard` (icon
circle + card) replaced with `TeachingAreaRow` — a numbered
(`01`–`05`, mono/tracked), rule-separated index row with no icon, no
border, no fill. `src/components/sections/teaching-areas-section.tsx`
updated to render a plain stacked list instead of a `sm:grid-cols-2
lg:grid-cols-5` card grid. Real topic descriptions unchanged — nothing was
invented.

### About — editorial profile

`src/components/media/portrait-frame.tsx`: the "AK" initials monogram
replaced with the brand mark (`logo-mark-white.svg`), the same "no photo
yet" substitute the Hero already uses — shared by the dormant Hero Mode B
placeholder as well as About, so both placeholders now follow one
convention. `src/components/sections/about-preview-section.tsx`: layout
widened to a genuinely asymmetric `0.8fr`/`1.2fr` split (from `0.85fr`/
`1fr`), heading enlarged, and the five-item bulleted credentials list
replaced with one flowing typographic line beneath a hairline rule — no new
facts, the same five credentials, reworded from a list into a sentence-like
index.

### Featured Book — badge cleanup

`src/components/sections/featured-book-section.tsx`: the "Featured" corner
badge removed — the section's own "The featured book" eyebrow already
carried that information.

### Future Courses — real-metadata-only

`src/components/cards/course-card.tsx`: the "N modules · N lessons" line
removed (shared component — this also affects `/courses`, not just the
homepage teaser). Real course content (title, excerpt, level, coming-soon
status) unchanged.

### Footer — editorial masthead

`src/components/layout/site-footer.tsx`: added a standalone Newsreader
italic mission-statement line (`SITE_TAGLINE`, promoted from a small caption
under the logo to its own large statement, right-aligned against the logo
at desktop) above the link grid, separated by a hairline rule. Social icons
are now genuinely conditional: `src/constants/site.ts`'s new
`hasConfirmedProfile()` helper (a URL has a real profile if its pathname is
longer than `/` — the same heuristic `src/lib/seo.ts`'s `confirmedSocialUrls()`
already used for structured data, now shared rather than duplicated) filters
`SOCIAL_LINKS` before rendering; since none are currently confirmed, the
footer shows zero placeholder icons today, and the grid collapses to 3
columns rather than leaving a visibly empty one. The moment a real profile
URL is set, its icon appears automatically.

### Whole-page rhythm

Reviewed the full section-tone/size sequence rather than each section in
isolation. Rather than add a third navy section or mechanically alternate
`paper`/`alt`, one targeted change was made:
`src/components/sections/featured-lectures-section.tsx` (Latest Khutbah)
promoted from default to `size="lg"`, breaking the three-consecutive-
default-size run between Quote and Newsletter and giving the page a
big → small → big → *pause* → big → small → small → *pause* rhythm instead
of a flat one.

## Verification

`tsc --noEmit`, `eslint --max-warnings=0`, `vitest run` (35/35), and `next
build` (34 routes) all clean throughout, checked after each area and again
at the end. Live-browser walkthrough of the full homepage at ~390px,
~1024px, and desktop widths (1440–1568px), plus `/courses` (shares
`CourseCard`) — zero console errors, zero failed requests at any point.

## What this sprint deliberately did not do

No Tier 2 or Tier 3 changes. No new pages, no new colours, no logo
redesign, no backend/CMS/architecture changes. `docs/CREATIVE_DIRECTION.md`
and `docs/DESIGN_SYSTEM.md` were not rewritten — one new implemented
touchpoint (the emblem in `PortraitFrame`) was added to `DESIGN_SYSTEM.md`
Section 10's existing touchpoint table, since that table's own stated
purpose is to track exactly this.
