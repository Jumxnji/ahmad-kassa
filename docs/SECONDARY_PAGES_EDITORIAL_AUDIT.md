# Secondary Pages Editorial Audit

**Status: observation and critique only. No code was changed to produce this
document.** Written against the live implementation as of Sprint 19 (`/about`,
`/books`, `/books/the-great-debate`, `/courses`, `/articles`,
`/articles/[slug]`, `/ask`, `/contact`, verified live in-browser and against
their real source), cross-checked against `docs/CREATIVE_DIRECTION.md`,
`docs/DESIGN_SYSTEM.md`, `docs/BRAND_USAGE.md`, `docs/UX_ARCHITECTURE.md`,
`docs/PROJECT_MEMORY.md`, and `docs/HOMEPAGE_EDITORIAL_AUDIT.md`. The homepage
is the quality benchmark (~9.7/10, per that document) but is not copied
mechanically onto the pages below — each page's own archetype is proposed in
Section 8.

**A methodology note on the mobile pass.** This environment's browser window
has a hard floor of ~531px — narrower true-mobile emulation (390px) was not
achievable via window resize. 531px is still below both the `sm` (640px) and
`lg` (1024px) breakpoints this codebase actually branches on, so it exercises
the identical mobile-nav/single-column code paths true 390px would — the
structural findings below are trustworthy, but exact line-wrap/character-count
observations at 531px will read slightly more generous than they would at
375–390px. Flagged once here rather than caveated in every section.

---

## Why these pages sit well below the homepage's ~9.7 benchmark

The short version: **the homepage was rebuilt six times over five Editorial
Refinement passes; every secondary page below has been touched roughly once,
at Sprint 1's baseline quality, and never revisited.** The design system's
raw materials — the palette, Newsreader/Manrope, the mono-eyebrow idiom, the
manuscript divider — are applied correctly and consistently everywhere. What's
missing is exactly what Sprint 14–19 spent five sprints adding to the
homepage: edited hierarchy, varied composition, restraint over
default-Tailwind-grid instincts, and — on two pages specifically — a genuine
content-honesty gap the brief was right to worry about in advance. None of
this is a bug. It is six pages still running the homepage's *pre-Sprint-11*
design maturity while the homepage itself is five refinement passes ahead.

---

## 1. About — `/about`

### What's actually there

Eight stacked `Section`s, alternating `tone="paper"`/`tone="alt"`: Hero
(portrait + name + 4 badges) → Biography (4 paragraphs, single column) →
Education/Professional Background (2-col icon list) → Islamic
Teaching/Public Speaking (2-col text) → Books/Research Interests (2-col,
badges) → Timeline (8-step numbered list, icon-circle + connecting line) →
Mission (navy pull-quote) → Future Academy CTA. Confirmed live at 1440px and
531px — see screenshots taken during this audit's browser pass.

### Does it read as an edited profile, or as heading → paragraph → credentials → another section?

**The latter, and the code confirms why.** Five of the eight sections
(Education, Professional Background, Islamic Teaching, Public Speaking,
Books, Research Interests) are built from one repeating unit:
`Eyebrow → h2 → paragraph[, optional icon-circle list]`, laid out in
`grid gap-12 lg:grid-cols-2`. This is the *exact* "consultancy about-page"
pattern `docs/HOMEPAGE_EDITORIAL_AUDIT.md` Section 7 already diagnosed and
fixed on the homepage's own About Preview in Sprint 15 ("paragraph, then
facts-as-bullets... nothing signals editorial profile") — but that fix
(the narrow sticky-portrait + wide-text-column + unquoted lede + marginal
index composition, `about-preview-section.tsx`) was never carried over to
this page, which still runs the pre-Sprint-15 pattern in five consecutive
sections. A reader scrolling this page can predict its next section after
seeing the second one — precisely the failure mode `docs/CREATIVE_DIRECTION.md`
Section 9 warns against ("a visitor should never be able to predict the
whole rest of the page from its first two sections").

**Specific, fixable evidence, not a vibe:**

- `src/app/(site)/about/page.tsx:174-186` and `:200-208` — the Education
  list and the Professional Background "two disciplines" line both use an
  identical `flex size-9 items-center justify-center rounded-full bg-navy-50
  text-navy-800` icon badge (`School`/`GraduationCap`/`Briefcase` from
  Lucide). `docs/DESIGN_SYSTEM.md` Section 9 permits icons only "when they
  genuinely improve understanding" — a School icon next to "Religious
  Institute, Kuwait" and a graduation cap next to "PGCE, University of
  London" are decorative restatements of text already self-explanatory,
  the exact overuse the system's own icon rule exists to prevent.
- The Timeline section (`:288-310`) renders 8 numbered entries but every
  entry's text sits in a `max-w-md` (28rem) column on the *left half* of a
  `container-wide` (80rem) page — confirmed live: at 1440px, roughly
  60–65% of the section's horizontal space is empty to the right of every
  timeline entry (see the "01 Foundations" screenshot from this audit).
  This is `docs/CREATIVE_DIRECTION.md` Section 9's exact distinction between
  "whitespace as content" and "content floating inside an oversized
  canvas" — the emptiness here isn't composed, it's a single-column list
  that never got a second column or a narrower container.
- Five sections in a row (Education through Research Interests) share one
  `alternating alt/paper tone, 2-col grid, eyebrow-h2-paragraph` rhythm
  with no vertical-weight variation — `docs/DESIGN_SYSTEM.md` Section 4's
  "a section that matters more should get more room to breathe" is not
  applied anywhere on this page; every section uses the same `Section`
  default size.

### What should change (Tier 1)

Apply the same edit the homepage's own About Preview already received in
Sprint 15, not a new design: fewer, stronger editorial moments instead of
five near-identical 2-column fact blocks. Concretely — collapse Education +
Professional Background into one narrative movement (the icon-circle list
already reads better as prose, per the homepage's own "marginal index"
convention using the mono/tracked `text-eyebrow` idiom instead of icons);
let the Timeline either take a narrower `container-content` width so its
copy doesn't float in open canvas, or gain a second column (a supporting
quote, a photo, or nothing — genuinely empty space used deliberately rather
than left over); vary at least one section's `size="lg"`/`tone` so the page
doesn't read as eight equal beats.

### What should be removed, not just redesigned

The `School`/`GraduationCap`/`Briefcase` icon badges (Section 12's finding)
— they add visual weight without adding information, and `docs/
CREATIVE_DIRECTION.md` Section 9's governing rule ("remove before adding")
applies directly. The Badge-pill "Research Interests" tag cloud
(`RESEARCH_INTERESTS`, six pill badges) is borderline — it's real content,
but pill badges are exactly the treatment Sprint 19's Future Courses
correction just removed from the homepage for reading as "product UI."
Reconsider as a plain comma-separated or mono-list treatment instead.

### Content truth

Every fact on this page (Kuwait study, CS/Telecoms degree, PGCE, Khateeb
role, Ruqyah since 2009, book title) matches the real biography already
established on the homepage and in `docs/PROJECT_MEMORY.md` — nothing
fabricated. No finding here.

### Mobile (531px)

Structurally sound — all 2-column sections collapse cleanly to one column,
the Timeline's numbered-circle-and-connector list reads fine narrow, no
overlap or clipping bugs found. No Tier 1 mobile-specific issue; the desktop
composition findings above are the real work.

**Score: 6/10** — editorial 5, typography 7 (correct fonts/scale, but no
distinctive treatment), composition 4 (the core problem), warmth 6, content
honesty 10, mobile 8, consistency with homepage 5 (uses the *system*
correctly, not the homepage's *maturity level*), overall 6.

---

## 2. Books — `/books`

### What's there

`PageHeader` (eyebrow "Books" → h1 "The catalog" → description) followed by
`<BooksGrid books={books} />`, which renders `book.length === 0 ? <p>… :
<div className="grid sm:grid-cols-2 lg:grid-cols-3">`. With one real book
(`The Great Debate`), this produces a single `BookCard` — a modest,
`max-w`-unconstrained grid-cell-sized card — sitting in the far-left third
of a `container-wide` (80rem/1280px) page. Confirmed live at 1440px: the
book cover, title, and "Learn more" link occupy roughly the leftmost 300px
of a 1568px-wide viewport; everything to the right and below, all the way
to the footer, is empty paper background.

### Does the page embrace having one book, or apologize for it?

**It apologizes for it — and this directly contradicts what's already
documented as the intended design.** `docs/UX_ARCHITECTURE.md`'s own
Page-by-Page Wireframes (Section 5, "Books (listing) — `/books`") states
explicitly: *"With exactly one title, a multi-column grid with one card and
eleven ghosts would look broken. Instead the single book gets the full-bleed
'featured' treatment a 12-book catalogue would reserve for its lead
title... Featured Book (large, full-width treatment — not a grid cell,
since there's only one)."* The shipped `BooksGrid`/`BookCard` implementation
does exactly the thing that document says not to do: it puts the one real
book into the same `sm:grid-cols-2 lg:grid-cols-3` grid a twelve-book
catalogue would use, at the same small card size, with no adaptation for
the current, honest reality of a single title.

### What should change (Tier 1, highest-leverage single fix in this whole audit)

`BooksGrid` needs a real conditional, not a cosmetic one: when
`books.length === 1`, render that title using the same large-cover,
full-width, asymmetric-column treatment `FeaturedBookSection` already
built and proved out on the homepage (`src/components/sections/
featured-book-section.tsx` — large `BookCover size="lg"`, soft gold glow,
`lg:grid-cols-[minmax(0,0.62fr)_1fr]`) rather than a new component — reuse,
don't reinvent. The grid path (`sm:grid-cols-2 lg:grid-cols-3`) should only
activate at 2+ titles, exactly as `docs/UX_ARCHITECTURE.md` already
specifies ("the moment a second book ships... a proper grid appears
beneath it — the layout doesn't need to be rebuilt, only populated").

### What should be removed

Nothing — this is a composition gap, not an excess.

### Content truth

Correct — `bookService.listPublic()` reads the real, single published book;
no fabricated inventory.

**Score: 4/10** — editorial 3 (the core failure), typography 7, composition
2, warmth 4, content honesty 10, mobile — not separately audited this page
(the fix is a desktop/tablet composition problem first; a single stacked
card already reads fine at any narrow width), consistency with homepage 3
(the homepage's own Featured Book component already solves this and wasn't
reused), overall 4.

---

## 3. Book Detail — `/books/the-great-debate`

### What's there

Hero (cover + title/author/excerpt/metadata/Buy CTA/share) → Description
(CMS rich text) → Gallery (conditional) → About the Author (initials-circle
avatar + intro text) → Reviews (`EmptyState`, honestly labeled "aren't open
yet") → Related (conditional) → Newsletter.

### Does it feel like a premium publisher's title page, or a product page?

**Closer to the former than any other secondary page** — no reviews/star
ratings/bestseller labels/fake scarcity are present (confirmed: none exist
in the code at all, so there's nothing to remove here), the Buy CTA is a
single clear gold button, and the Reviews section's honest `EmptyState`
("Reviews aren't open yet... once the book is available for purchase") is
exactly the content-honesty discipline the brief asks for — keep this
pattern, it's already correct. The real weaknesses are narrower and more
specific:

- **The "About the Author" block still uses a generic initials-monogram
  avatar** (`book/[slug]/page.tsx:236-243`:
  `book.authorName.split(" ").map(part => part[0]).slice(0,2).join("")` →
  a circular navy badge reading "AM"). This is the *exact* pattern
  `docs/HOMEPAGE_EDITORIAL_AUDIT.md` Section 7 called "the single moment
  that most reads as unfinished website" when it was the homepage About
  placeholder — that placeholder has since been replaced with a real
  portrait (Sprint 17), but this page was never updated to match. Per
  `docs/BRAND_USAGE.md`, the portrait is deliberately restricted to Hero
  and About only ("deliberately not placed anywhere else... book
  sections"), so simply adding the photo here would violate that policy —
  the fix is not the portrait, it's replacing the initials-circle with
  the site's own mark-based "no photo" convention (the same emblem
  treatment `PortraitFrame` already uses when no `src` is supplied)
  instead of a generic avatar-initials pattern that exists nowhere else
  in the current design language.
- **A large unused vertical gap between the Description section's short
  paragraph and the "About the Author" section below it** (confirmed live
  at 1440px — roughly 300px of empty `paper-100` background between the
  four-sentence description and the next section). `docs/UX_ARCHITECTURE.md`
  Section 7 already documents *why* this gap exists and what's missing to
  fill it meaningfully: a Contents/chapter-list preview and a short
  Author's Note in Ahmad's own voice, both explicitly scoped and both
  still unbuilt. This is a real, previously-identified, still-open gap —
  not a new finding, but worth re-flagging since it's now visibly the
  emptiest moment on the page.
- **The cover renders as the navy placeholder pattern** in local dev (no
  real cover image uploaded to this environment's Media Library) — not a
  code defect, `BookCover`'s fallback is well-built (gold hairline frame,
  large italic initial), but worth confirming a real cover file exists
  before this page is considered "live-ready," since the placeholder,
  while tasteful, is still visibly a placeholder at `size="lg"`.

### What should be removed rather than redesigned

Nothing needs removing here — this page is already close to "additive
gaps," not "excess to trim." The one thing worth *reconsidering* rather
than removing: the Reviews section always renders even with zero reviews.
`docs/UX_ARCHITECTURE.md` itself flags this as a real, intentional
difference from a "don't render until content exists" carousel approach —
current behavior is defensible (an honest empty state, not silence) and
shouldn't change without deliberate discussion, not simply as tidying.

### Content truth

Fully honest — no fabricated reviews, no invented endorsements, no fake
scarcity. This page should be the model the rest of the audit's
content-truth findings are measured against.

**Score: 7/10** — editorial 7, typography 7, composition 6 (the empty-gap
finding), warmth 7, content honesty 10, mobile — cover and metadata stack
cleanly at 531px, no issues found, consistency with homepage 6, overall 7.

---

## 4. Courses — `/courses`

### What's there

`PageHeader` (centered, "Structured study, coming soon") → `ManuscriptDivider`
→ "In development" eyebrow + h2 → `grid sm:grid-cols-2 lg:grid-cols-4` of
all 5 `CourseCard`s (icon-in-diamond-frame illustration, "Coming soon" pill
badge, level text, title, excerpt, `CourseInterestLink`) → newsletter
capture. Confirmed live: exactly the 4-across-then-one-orphan-on-its-own-row
layout the Sprint 19 brief described and the homepage's Future Courses
section was just rebuilt specifically to avoid.

### The clearest, most citable finding on this page

**This page is now the single largest visual inconsistency on the entire
site, and it exists because of work this same project just finished.**
Sprint 19 replaced the homepage's icon-illustration `CourseCard` treatment
with a typography-led `FutureCourseCard` (no icons, mono-label instead of a
pill, `featured` flag limiting the homepage to 4 curated courses, no
orphan row) specifically because the icon-grid version read as "a generic
course marketplace/SaaS feature grid." `/courses` was explicitly left
untouched by that sprint ("don't assume the homepage and `/courses` need
identical components") — which was the right call *for that sprint's
scope*, but it means a visitor can currently click "View the academy" on
the homepage and land, one click later, on the exact card style the
homepage just spent a sprint removing, showing four of the same five
courses plus a fifth in an orphaned single-card row. This is not a
hypothetical inconsistency — it's two pages, one click apart, presenting
overlapping content in two visibly different registers.

### Does the dedicated page still need the old illustration-heavy CourseCard?

**No.** A dedicated catalogue page is allowed more information than a
homepage teaser (per the brief's own framing), but "more information"
means more real metadata (a longer description, a level, a module count if
genuine) — not a decorative icon panel. The `COURSE_ICONS` map
(`src/components/cards/course-icons.ts`) assigns a Lucide icon per course
slug purely for illustration; none of the five icons convey information a
reader couldn't get from the title alone (a brain for "Psychology in
Islam," a heart for "Marriage in Islam"). This is exactly `docs/
DESIGN_SYSTEM.md` Section 9's "icons... never used to decorate an interface"
rule, being violated at a larger scale here than anywhere else audited.

### What should change (Tier 1)

Two independent fixes, both small: (1) remove the icon/diamond-frame
illustration panel from `CourseCard`, following the same typography-led
"Coming soon · Level → title → excerpt → hairline → notify link" anatomy
`FutureCourseCard` already established — this can be the *same* component
now, or a close sibling, since the constraint that kept them separate in
Sprint 19 (don't let a homepage refinement regress `/courses`) no longer
applies once `/courses` is being refined on its own terms; (2) let all 5
courses render in a true `sm:grid-cols-2 lg:grid-cols-4` (or a `lg:grid-cols-5`
single row, or a 3+2 balanced layout) — anything except the current
4-then-1 orphan.

### What should be removed

The `COURSE_ICONS` map and its five per-course Lucide icon assignments —
directly, not just visually deprecated. If `CourseCard`/`CourseIllustration`
end up genuinely unused anywhere else after this change, they should be
deleted rather than left as dead code (confirmed in this audit's earlier
Sprint 19 work: `course-illustration.tsx` was already left in place only
because `/courses` still used it — that reason goes away if this fix
ships).

### Content truth

All 5 courses are honestly labeled "Coming soon," no fake enrollment
numbers, no invented start dates, no module/lesson counts shown on this
page's cards (though the underlying `Course.modules` data exists — it's
correctly not surfaced as if real). No finding here.

**Score: 5/10** — editorial 4 (the icon-grid regression relative to the
homepage), typography 6, composition 4 (the orphan row), warmth 5, content
honesty 9, mobile — the orphan-row problem is somewhat *less* visible on a
single-column mobile layout (every card stacks regardless), so mobile is
not the priority here, consistency with homepage 2 (the starkest gap in
this entire audit), overall 5.

---

## 5. Articles — `/articles`

### What's there

`PageHeader` ("Writing") → a vertical list (not grid) of `ArticleCard`s,
one per row, via `getArticlesPage()` → `Pagination`. Confirmed live: the
page renders a fully populated, confidently laid-out editorial index —
category badge, date, reading time, title, excerpt, "Read the piece" link,
repeated ten times across two pages (`ARTICLES_PER_PAGE = 6`).

### Does the page feel intentionally quiet, or obviously empty?

**Neither — it feels fully, confidently populated, which is the actual
problem.** This is the single highest-priority content-truth finding in
this entire audit, and it's already flagged, in plain language, in the
codebase itself. `src/lib/data/articles.ts`'s own top comment reads:
*"Placeholder editorial catalog — no CMS yet."* Every one of the ten
entries carries `status: "published"`, a specific publish date (the most
recent, "Protecting the Heart," dated 2026-07-22), a reading time, a
category, and several hundred words of genuinely well-written, in-voice
long-form content per article — with no visual or textual signal anywhere
on the public-facing page that distinguishes this from real, published
writing.

This is a direct, current contradiction of the exact instruction this
audit's own brief gave in advance ("There is currently little real article
content... Do NOT solve sparse content by inventing articles... If the
existing page contains placeholder/demo articles, identify them clearly.
Do not allow fake editorial content to appear as published work") — the
sparse-content problem this brief anticipated has, in fact, already been
solved by writing ten complete placeholder articles and presenting them as
genuinely published, with real-looking dates and metadata, rather than by
the honest "coming soon" framing `docs/UX_ARCHITECTURE.md` Section 9
documents as the intended zero-content behavior for this exact page
("At zero articles... the Page Hero switching to a 'Coming Soon' framing").
A visitor has no way to know, and the site currently gives them every
signal (dates, categories, reading times, a working pagination control)
telling them otherwise.

**This is not a design finding — it's a content-honesty finding that sits
above every design recommendation in this section.** Whatever visual
changes this page eventually gets, they should not be made before this is
resolved with the client: either these ten pieces are genuinely Ahmad's
work and should be labeled/dated honestly as an initial writing set (in
which case the page's design is actually close to fine as-is), or they are
placeholder copy written to demonstrate the page's design and must not
ship to production presented as his real, dated writing.

### Design findings, secondary to the above

Assuming real content eventually replaces or confirms the above: the
vertical-list treatment (not a grid) is a good, deliberate choice already
— it reads as an index, not a blog feed, and `docs/UX_ARCHITECTURE.md`
Section 9 documents this as the intended design. No Tier 1 design issue
found here; the list/pagination/typography are all consistent with the
system.

### What should be removed

Nothing structurally — but see the content-truth finding above, which is
a removal-or-relabel decision for the client to make, not a design call
this audit can resolve unilaterally.

**Score: 3/10, driven entirely by content honesty** — editorial 8 (the
actual list/index design is genuinely good), typography 8, composition 8,
warmth 7, **content honesty 1** (the single lowest score anywhere in this
audit), mobile — not separately verified pending the honesty question
above, consistency with homepage 7, overall 3 (content honesty is treated
as a hard gate here, not averaged in neutrally, per the brief's own
explicit instruction to flag this clearly).

---

## 6. Ask Ahmad — `/ask`

### What's there

`PageHeader` (`containerWidth="content"`, 672px) → `<AskAhmadForm />`
(client component, `max-w-xl`, 576px) — name/email (2-col), category
select, question textarea with character counter, consent checkbox, single
gold submit button, inline success screen with a copyable reference number.
Confirmed live at 1440px: the entire form occupies roughly the left 35% of
the viewport, ending directly into the footer with no supporting content
beside or around it.

### Does this feel thoughtful and personal, or like a support ticket?

**The form itself is well-built and appropriately worded** — the consent
copy ("I understand my question is read only by Ahmad... does not
guarantee a response") and the success screen's copy ("Ahmad reviews
questions personally — not every one can receive a public or private
reply, but every one is read") are both genuinely warm, specific, and
non-generic; this is real writing, not template copy, and should not
change. **The composition around the form is where this page falls short**
— a plain form floating alone in a 672px column against a much wider page,
with no editorial framing, is exactly the "narrow-form-on-a-huge-canvas"
problem the brief names, and it's the reason the page reads more
utilitarian than personal despite the copy already doing real work.

### What should change (Tier 2)

An asymmetric editorial introduction + form composition, as the brief
itself suggests: a wider left column carrying the page's own framing (the
same warm, specific voice already present in the consent/success copy,
expanded slightly — what happens to a question, roughly how long a reply
might take, that not every question receives one) beside the form on the
right, rather than the form alone, centered-left, in isolation. This
doesn't need new content invented — the honest "what happens next" framing
already exists in the success-state copy and could simply move earlier,
into view before submission, rather than being revealed only after.

### What should be removed

Nothing in the form itself — it is not over-built; adding fields or
decoration would be the wrong direction. The empty canvas around it is the
issue, not the form's own density.

### Content truth

No issues — the spam protections, consent copy, and success-state
messaging are all real, accurate, and already live.

**Score: 6/10** — editorial 5 (composition, not copy), typography 7,
composition 5, warmth 7 (the copy itself is genuinely strong), content
honesty 10, mobile — form fields stack cleanly single-column at 531px,
touch targets adequate, no issues found, consistency with homepage 6,
overall 6.

---

## 7. Contact — `/contact`

### What's there

`PageHeader` ("Get in touch," explicitly redirecting knowledge questions to
Ask Ahmad) → two-column layout: enquiry-type list (3 icon+label rows) +
"Based in" + social icons, beside `<ContactForm />`. Confirmed live at
1440px.

### Does Contact feel meaningfully distinct from Ask Ahmad?

**Barely, and largely by accident of shared components rather than
deliberate differentiation.** Both pages use `PageHeader` at the same
scale, a form built from the same `Form`/`Input`/`Select`/`Textarea`
primitives at the same visual weight, and (on Contact specifically) the
same icon-in-circle badge treatment `/about`'s Education section also
uses. The one real differentiator — Contact's left column (enquiry types,
location, social icons) versus Ask's plain page-header-then-form — does
create *some* distinction, but the two pages still read as close siblings
rather than two different registers ("categorised personal-question form"
vs. "general business enquiry"), which is what the brief's Section 7 asks
for. The brief is explicit that the fix should be "copy and hierarchy,"
not new fields — that's the right instinct, since neither form is
over-built.

### A genuine bug, not a design opinion — dead social links

`src/app/(site)/contact/page.tsx:68-81` renders `SOCIAL_LINKS.map(...)`
unconditionally. `SOCIAL_LINKS` (`src/constants/site.ts:25-27`) still
holds the generic placeholder domains `PROJECT_MEMORY.md` already
documents as unconfirmed (`https://youtube.com`, `https://instagram.com`,
`https://tiktok.com` — bare platform homepages, not Ahmad's actual
profiles). The site already has the correct mechanism for this —
`hasConfirmedProfile()` (`src/constants/site.ts:38-44`), which filters
these exact placeholders out of the public footer's social row and out of
structured data's `sameAs` field, specifically so a placeholder is never
presented as an active profile. **Contact's social icon row is the one
place on the public site that does not use this filter** — right now it
renders three functioning, clickable icons that route a visitor to
generic YouTube/Instagram/TikTok homepages, not Ahmad's channels. This is
a direct, current instance of the exact problem `hasConfirmedProfile()`
exists to prevent, on a page the footer's own version of the same UI
already handles correctly.

### What should change

**Tier 1 (the bug):** wrap Contact's `SOCIAL_LINKS.map()` in the same
`hasConfirmedProfile()` filter the footer already uses — a one-line fix,
zero design risk, directly closes a real dead-link/misleading-affordance
issue. **Tier 2 (differentiation):** lean harder into the copy/hierarchy
distinction the brief asks for — Contact's framing could open with who it's
*for* (organisers, press, publishers) more prominently than it currently
does, rather than leading with "for questions of Islamic knowledge, use
Ask Ahmad instead," which defines Contact by what it *isn't*.

### What should be removed

Nothing to remove — the icon-in-circle enquiry-type list is genuine,
useful information, not decoration.

**Score: 5/10** — editorial 5, typography 7, composition 6, warmth 5,
**content honesty 4** (the dead-link finding), mobile — not separately
verified this pass, consistency with homepage 6, overall 5.

---

## 8. Page Openings — cross-page comparison

Every secondary page except About and Book Detail opens with the identical
`PageHeader` composition: mono eyebrow → serif H1 (`text-4xl sm:text-5xl`)
→ `text-lg` description paragraph, `max-w-2xl`, left- or center-aligned.
Confirmed via the shared component's source (`page-header.tsx`) and live on
Books, Courses, Articles, Ask, Contact.

| Page | Opening | Classification |
|---|---|---|
| About | Custom: portrait + name + 4 badges | Strong — the one genuinely distinct opening |
| Books | `PageHeader`, left-aligned | Generic — identical shape to Courses/Articles/Ask/Contact |
| Book Detail | Custom: cover + title + CTA hero | Acceptable — distinct from the `PageHeader` pattern, appropriately so |
| Courses | `PageHeader`, **centered** | Too repetitive — same shape as Books, only alignment differs |
| Articles | `PageHeader`, left-aligned | Too repetitive |
| Ask Ahmad | `PageHeader`, left-aligned | Too repetitive |
| Contact | `PageHeader`, left-aligned | Too repetitive |

Four of seven pages share one composition with only alignment (`center` vs.
`left`) as a variable — this is the "accidental repetition" the brief's
Section 8 asks to check for, and it is real, confirmed by reading the
actual shared component rather than by impression.

**Recommended archetypes**, matching the brief's own suggested groupings and
grounded in what each page is actually for:

- **Profile** (About) — already distinct; the fix here is internal
  composition (Section 1), not the opening.
- **Publication** (Books, Book Detail) — once Books gets its Tier-1 fix
  (Section 2), both pages in this group should lead with the object itself
  (a cover, real or placeholder) rather than a text-only `PageHeader` —
  Books currently doesn't; Book Detail already does.
- **Programme** (Courses) — once its Tier-1 fixes ship (Section 4), this
  page's opening could reasonably keep `PageHeader` but should stop being
  visually identical to Articles/Ask/Contact — center-alignment alone is
  not enough differentiation; consider pairing the opening with the first
  row of the (now-fixed) course grid peeking into view, the way a
  prospectus's cover page often previews its own table of contents.
- **Editorial archive** (Articles) — `PageHeader` is fine here structurally
  (Section 5's own finding); once the content-honesty question is
  resolved, no opening-specific change is needed.
- **Correspondence** (Ask Ahmad, Contact) — both should keep `PageHeader`
  but need the asymmetric-intro treatment from Sections 6–7 to stop
  reading as the same page twice.

---

## 9. Typography Consistency

No drift found in the core scale — every page audited uses Newsreader for
display type, Manrope for body, IBM Plex Mono for the eyebrow/label idiom,
at the sizes `docs/DESIGN_SYSTEM.md` Section 3 specifies. `PageHeader`'s
`text-4xl sm:text-5xl` H1 matches the documented H1 scale; body copy holds
at 16–19px throughout. **The one real inconsistency** is About's icon-badge
treatment (Section 1) introducing a visual element with no typographic
equivalent anywhere else in the secondary-page set — not a font issue, a
composition-vocabulary issue. No font-family or type-scale changes are
recommended anywhere in this document, matching the brief's own instruction
not to touch fonts.

---

## 10. Page Width / Empty Space

Three genuinely different situations, worth distinguishing precisely per
the brief's own instruction:

- **Creates luxury** (working as intended): Book Detail's hero column
  ratio, the Quote-style breathing room already established sitewide. No
  change needed anywhere this pattern appears on the pages audited.
- **Creates focus**: Ask Ahmad's narrow form column is *directionally*
  right (a form shouldn't stretch edge-to-edge) but the canvas around it is
  too large relative to the form's own visual weight — this is the
  "focus" intent partially achieved, not fully (see Section 6).
- **Makes the page feel unfinished**: Books' single-card-in-a-wide-grid
  (Section 2) and the Timeline's copy-in-a-half-width-column-with-nothing-
  beside-it (Section 1) are the two clearest instances of unintentional
  emptiness in this audit — both are composition gaps (a missing large
  treatment, a missing second column), not places that need new content
  added to fill them.

---

## 11. Portrait Use

Correct and unchanged across every secondary page audited — the real
portrait (Sprint 17) appears only on About's hero, exactly matching `docs/
BRAND_USAGE.md`'s "deliberately not placed anywhere else" rule. **The one
place this policy creates a visible gap** is Book Detail's Author block
(Section 3), which falls back to a generic initials-monogram avatar rather
than the site's own established "no portrait here" convention (the mark,
per `PortraitFrame`'s own no-`src` fallback). No page audited over-uses the
portrait; the fix needed is narrower than "add more portrait placements" —
it's "use the mark's existing no-photo fallback instead of a generic
avatar pattern that exists nowhere else in this design system."

---

## 12. Emblem Use

The mark appears correctly and sparingly across every secondary page's
shared chrome (header, footer, `ManuscriptDivider`'s default rotated-square
accent) — no secondary page introduces a new watermark, seal, or decorative
mark placement beyond what the homepage's audit already confirmed is
correctly restrained. `ManuscriptDivider`'s `mark` (glyph) variant is used
in exactly one place sitewide (`cta-section.tsx`, homepage only) — no
secondary page uses it, which is correctly restrained, not a gap. **No
findings for this section** — emblem discipline holds on every page
audited.

---

## 13. Cards — inventory and verdicts

| Card | Where | Verdict | Why |
|---|---|---|---|
| `BookCard` | Books grid, Book Detail's Related | **Keep, but fix the single-item case** (Section 2) | Genuinely distinct objects (covers) benefit from a container; the container itself is fine, its use at `n=1` is the problem |
| `CourseCard` + `COURSE_ICONS` | Courses | **Simplify — remove the icon panel** (Section 4) | Same lesson the homepage's Sprint 19 correction already proved: typography and a hairline rule carry a "coming soon" card better than an illustration |
| `ArticleCard` | Articles, related-reading rows | **Keep as-is** | Already a border-bottom row, not a boxed card — matches `docs/CREATIVE_DIRECTION.md`'s "avoid boxed layouts" guidance correctly |
| About's icon-circle "cards"* | About (Education, Professional Background) | **Convert to editorial row/index** (Section 1) | Not really cards (no border/surface), but the icon-badge-plus-text unit is the same over-decorated instinct a card would produce — drop the icon, keep the text as a plain list |
| Contact's enquiry-type icon rows | Contact | **Keep** | Real, load-bearing information (what Contact is for), appropriately lightweight — not a container, a plain icon+label row |

\* Not literal `<Card>` components — included because the brief asks for
every card-*like* unit, and these function the same way visually.

The homepage's own lesson (removing cards can raise editorial quality) does
not apply mechanically everywhere: Book covers and Article rows are already
right; the actual over-decoration on secondary pages lives specifically in
Courses' icon panel and About's icon badges, not in every container on
these pages.

---

## 14. Forms

`AskAhmadForm` and `ContactForm` both build on the same `Form`/`Input`/
`Select`/`Textarea`/`Checkbox` primitives, both correctly sized (16px text,
never triggering mobile-Safari zoom), both with visible labels (no
placeholder-only labeling), both with a working focus state (gold ring,
confirmed inherited from the shared `Input`/`Textarea`/`Select` components,
not overridden). `AskAhmadForm`'s live character counter and copyable
reference-number success state are genuinely well-built, specific details
— keep both exactly as they are. No field-density or over-decoration
issues found in either form; the composition problem (Sections 6–7) is
around the forms, not in them.

---

## 15. Mobile

Verified at 531px (see the methodology note at the top of this document)
for About (full page) and spot-checked via code review for the remaining
pages, since every audited page uses the same `sm:grid-cols-*` /
`lg:grid-cols-*` responsive utilities already confirmed working correctly
elsewhere in this project (Sprint 19's Future Courses verification; the
homepage's own ER-series audits). **No new mobile-specific defects were
found** on any secondary page — every two-column section collapses to a
single stacked column correctly, the mobile nav (`Sheet` drawer) is shared
chrome already verified working, and no clipping, overlap, or broken-layout
issue was observed on About at 531px (the one page audited at length,
end-to-end, on a narrow viewport). The desktop composition findings above
(Books' empty grid, Courses' orphan card, About's icon repetition) are the
real, portable issues — none of them are mobile-specific, so none of them
"disappear" on a small screen; they simply become less visually prominent
because everything is already single-column there.

---

## 16. Content Truth

This is the section the brief weighted most heavily, and the findings
above already surface the two real issues directly:

- **Articles (Section 5) is the dominant finding in this entire audit.**
  Ten fully-written, dated, categorized placeholder articles
  (`src/lib/data/articles.ts`, self-documented in its own top comment as
  "Placeholder editorial catalog — no CMS yet") render on a public,
  indexed, paginated page with zero visitor-facing indication that they
  are not genuinely published writing. This is qualitatively different
  from every other honestly-labeled "coming soon" placeholder on the site
  (Courses, the pre-Sprint-18 Khutbah section) — those say "coming soon";
  Articles says nothing and presents specific real-looking dates instead.
- **Contact's unconditional social links (Section 7)** present three
  unconfirmed placeholder URLs as if they were live, working profile
  links — a real, if smaller, instance of the same category of problem
  (presenting something as real/live that isn't), and one with an
  existing, already-built fix (`hasConfirmedProfile()`) sitting unused one
  file away.
- **No other content-truth issues were found.** Book Detail's Reviews
  section, Courses' "coming soon" labeling, and every real biographical
  fact on About all pass — these are the site's own best examples of
  honest empty/placeholder states, worth holding up as the standard the
  two findings above should be brought in line with.
- **No dead social links elsewhere** — the footer correctly filters via
  `hasConfirmedProfile()`; only Contact's own separate render path skips
  that filter.
- **No placeholder images presented as real** were found beyond the
  already-documented, already-honest `BookCover`/`CourseCard` fallback
  patterns, which identify themselves visually as placeholders rather than
  pretending to be real photography.

---

## 17. Page-End Experience

| Page | Ends with | Assessment |
|---|---|---|
| About | Future Academy CTA (gold "Join the newsletter" + ghost "Ask a question") | Appropriate — a biography earning a relationship-building ask at its close |
| Books | Nothing — grid, then straight into footer | Under-built once Section 2's fix ships, a "More titles are in progress" notice (already scoped in `docs/UX_ARCHITECTURE.md`) would be the right, honest ending — not a CTA band |
| Book Detail | `NewsletterSection` | Appropriate |
| Courses | Newsletter capture ("Be the first to know") | Appropriate — matches the page's own purpose exactly |
| Articles | Pagination, then footer | Appropriate — an index shouldn't force a CTA at the bottom of every page of results |
| Ask Ahmad | Inline success state (no page-level ending otherwise) | Appropriate |
| Contact | Form, then footer | Appropriate — a general-enquiry page doesn't need a second ask |

Only Books lacks an intentional ending — every other page's conclusion
already matches the "avoid conversion-funnel thinking" instruction
correctly.

---

## 18. Current Quality Scores

Homepage benchmark: ~9.7/10 (per `docs/HOMEPAGE_EDITORIAL_AUDIT.md` and its
five subsequent Editorial Refinement passes).

| Page | Editorial | Typography | Composition | Warmth | Content honesty | Mobile | Consistency w/ homepage | **Overall** |
|---|---|---|---|---|---|---|---|---|
| About | 5 | 7 | 4 | 6 | 10 | 8 | 5 | **6** |
| Books | 3 | 7 | 2 | 4 | 10 | 7* | 3 | **4** |
| Book Detail | 7 | 7 | 6 | 7 | 10 | 8 | 6 | **7** |
| Courses | 4 | 6 | 4 | 5 | 9 | 6* | 2 | **5** |
| Articles | 8 | 8 | 8 | 7 | **1** | 7* | 7 | **3** |
| Ask Ahmad | 5 | 7 | 5 | 7 | 10 | 8 | 6 | **6** |
| Contact | 5 | 7 | 6 | 5 | **4** | 7* | 6 | **5** |

\* Not exhaustively verified narrow-viewport this pass (see Section 15) —
inferred from shared, already-confirmed-working responsive utilities;
flagged rather than asserted with full confidence.

No score above was inflated to look more finished than the evidence
supports — Articles and Contact's low overall scores are driven
specifically by content-honesty findings, not by design quality, which on
Articles in particular is otherwise the strongest secondary page audited.

---

## 19. Priority Ranking

The brief's own guess (About → Ask/Contact → Books/Book Detail → Courses →
Articles) is **not** what this audit's evidence supports. Re-ranked by
actual severity and fix leverage found during this pass:

### Tier 1 — high-impact structural/content correction

1. **Articles — content-truth resolution.** Not a design task first; a
   client decision (Section 5/16). Effort: **Small** (a labeling/framing
   decision plus, if needed, a short "these early pieces..." note — the
   design underneath is already good). Risk: **Low** technically, but the
   decision itself matters — this should not wait behind any other item on
   this list.
2. **Books — single-title composition fix.** Reuse
   `FeaturedBookSection`'s existing large-cover treatment instead of the
   generic grid at `n=1` (Section 2). Effort: **Small** (a conditional plus
   reusing an existing component). Risk: **Low**.
3. **Contact — dead social links.** Apply the existing
   `hasConfirmedProfile()` filter (Section 7). Effort: **Trivial** (one
   filter call). Risk: **Low**.
4. **Courses — remove the icon panel, fix the orphan grid.** Bring
   `/courses` in line with the homepage's own Sprint 19 correction
   (Section 4). Effort: **Medium** (component consolidation, not a
   from-scratch rebuild — `FutureCourseCard` already exists as the target
   shape). Risk: **Low** — no data-model change needed, since `featured`
   already exists and `/courses` can simply ignore it and show all 5.

### Tier 2 — important refinement

5. **About — composition edit**, applying the same "fewer, stronger
   moments" lesson Sprint 15 already proved on the homepage's own About
   Preview (Section 1). Effort: **Medium-Large** (five sections' worth of
   restructuring, though no new content needs writing). Risk: **Medium**
   — the most content-dense page in this audit, more ways to get the edit
   wrong.
6. **Ask Ahmad — asymmetric intro + form composition** (Section 6).
   Effort: **Medium**. Risk: **Low** — the form itself doesn't change.
7. **Contact — sharper differentiation from Ask Ahmad** via copy/hierarchy
   (Section 7). Effort: **Small**. Risk: **Low**.
8. **Book Detail — Author block's initials-avatar fix** (Section 3, mark
   fallback instead of generic monogram). Effort: **Small**. Risk: **Low**.

### Tier 3 — micro-polish

9. **About — remove the three decorative icon badges** (Section 1/12) —
   can ship independently of the larger About restructuring in item 5, or
   alongside it.
10. **Books — add the "more titles are in progress" page-end notice**
    (Section 17), once item 2 ships.
11. **Book Detail — fill or intentionally compose the Description-to-
    Author gap** (Section 3) — already scoped in `docs/UX_ARCHITECTURE.md`
    (Contents preview, Author's Note); revisit as a deliberate follow-up,
    not urgent.

**Recommended implementation order**: items 1–4 first (all Tier 1, all
small-to-medium effort, all low risk, and item 1 in particular is
time-sensitive since it concerns what's currently live and publicly
indexed) — then items 5–8 as a second pass once Tier 1 is confirmed
resolved, since item 5 (About) is the largest single piece of work in this
document and deserves its own focused pass rather than being bundled with
smaller fixes.

---

## 20. Design System vs. Page-Specific Work

- **Existing system applied better, not extended**: items 1, 3, 4, 8, 9
  above — every one reuses a component, convention, or fix that already
  exists elsewhere in this codebase (`FeaturedBookSection`'s large-cover
  treatment, `hasConfirmedProfile()`, `FutureCourseCard`'s anatomy,
  `PortraitFrame`'s no-photo fallback, the "remove decorative icons" rule
  already applied on the homepage). None of these require a new pattern.
- **Page-specific composition work**: items 5, 6, 7 — About's
  restructuring, Ask Ahmad's asymmetric intro, and Contact's copy
  rework are each specific to that page's own content and purpose, not a
  reusable pattern extraction.
- **A genuinely reusable pattern worth formalizing**, if this work
  proceeds: a `SingleFeaturedItem` composition concept (large cover/image,
  asymmetric columns, no grid) — currently exists only inside
  `FeaturedBookSection`; extracting its shape (not necessarily its exact
  code) so Books' fix (item 2) and any future "one item, not a grid" page
  can share the same underlying idea would be worth a short design-system
  note, though not a prerequisite for shipping item 2 itself.
- **Content issue, not a design issue**: item 1 (Articles) is the one
  finding in this whole document that isn't a design decision at all —
  it's a real/placeholder content-labeling question only the client can
  resolve.

---

## 21. Where the live review contradicted existing documentation

Two direct contradictions were found between what's documented as the
intended design and what's actually shipped — both already cited in full
above, restated here together since the brief specifically asked for this:

1. **`docs/UX_ARCHITECTURE.md`'s Books wireframe** (Section 5 of that
   document) explicitly specifies the single-book "full-bleed featured
   treatment, not a grid cell" behavior this audit's Section 2 confirms is
   *not* what `BooksGrid`/`BookCard` actually does — the documentation
   describes the correct design; the implementation never caught up to it.
2. **`docs/UX_ARCHITECTURE.md`'s Articles wireframe** (Section 9) documents
   the intended zero-content behavior ("Page Hero switching to a 'Coming
   Soon' framing... the grid replaced by the waitlist capture pattern") as
   what should happen when no real articles exist — but ten placeholder
   articles already exist and render as if genuinely published, so the
   page never reaches the state that document describes, and the
   documentation gives no guidance for the actual state the page is
   currently in (populated, but with acknowledged-placeholder content).

No other contradictions between documentation and implementation were
found in the pages and components audited this pass.

---

## Return summary

1. **Scores** — About 6, Books 4, Book Detail 7, Courses 5, Articles 3
   (content-honesty-gated), Ask Ahmad 6, Contact 5. Homepage benchmark 9.7.
2. **Five largest cross-site weaknesses** — (1) Articles presenting ten
   placeholder pieces as genuinely published, dated writing; (2) Books
   apologizing for having one title instead of featuring it, directly
   contrary to its own design doc; (3) Courses running the pre-Sprint-19
   icon-grid card style the homepage already proved wrong, one click away
   from the corrected version; (4) About's five consecutive
   heading-paragraph-icon-list sections, the exact pattern already fixed
   on the homepage's own About Preview in Sprint 15 but never carried
   here; (5) Contact's unconditional render of placeholder social links,
   bypassing a filter (`hasConfirmedProfile()`) that already exists and
   already fixes this everywhere else.
3. **Highest-priority page** — Articles, but as a content decision, not a
   design one; the highest-priority *design* fix is Books (Section 19,
   Tier 1 #2), because it's the smallest effort, lowest risk, and most
   visually glaring gap between documented intent and shipped reality.
4. **Recommended archetypes** — Profile (About), Publication (Books, Book
   Detail), Programme (Courses), Editorial archive (Articles),
   Correspondence (Ask Ahmad, Contact) — detailed in Section 8.
5. **What should be removed, not redesigned** — About's three decorative
   education/background icon badges; Courses' `COURSE_ICONS` illustration
   panel entirely (following the homepage's own Sprint 19 precedent);
   nothing on Book Detail, Ask Ahmad, or Contact needs removing, only
   recomposing.
6. **Structural vs. micro-polish** — Structural: About (composition
   restructure), Books (single-item treatment), Courses (card + grid
   fix), Ask Ahmad (asymmetric intro). Micro-polish: About's icon removal,
   Book Detail's author-avatar fallback, Contact's social-link filter and
   copy sharpening, Books' page-end notice.
7. **Recommended implementation order** — Tier 1 first (Articles
   decision, Books fix, Contact link fix, Courses fix — all small-to-medium,
   low-risk, and Articles is time-sensitive as currently-live content),
   then Tier 2 (About's larger restructure as its own focused pass, Ask
   Ahmad, Contact copy, Book Detail avatar), then Tier 3 polish.
8. **What contradicted existing documentation** — `docs/UX_ARCHITECTURE.md`'s
   own Books and Articles wireframes both describe correct, already-decided
   designs that the live implementation does not match (Section 21) — in
   both cases the documentation was right and the code needs to catch up
   to it, not the reverse.

## Books Index Correction Outcome — Sprint 20

Books scored 4/10 in the pass above, the second-largest cross-site
weakness after Articles' content-truth problem — a single genuine title
sitting in the first slot of a 3-column ecommerce-style grid, visually
apologizing for not having a second and third book to fill the row.

**A real content-truth problem surfaced first, before any layout work
began.** The book's `excerpt`/`description` — "a clear-eyed examination
of the arguments for and against belief in God" — were written at seed
time, before a real cover existed, and were never reconciled once one
was uploaded through the admin Media Library. The real cover (visually
inspected directly, not inferred) shows this is a fiqh analysis of using
jinn in Ruqyah — an entirely different subject, corroborated
independently by the book's own Amazon listing URL. This was displayed,
uncorrected, on the book detail page, the homepage's Featured Book
section, and every meta-description/JSON-LD surface reading `excerpt`.
Corrected via a guarded backfill in `prisma/seed.ts` (the same pattern
already used for a stale Amazon placeholder URL) — the DB now holds the
book's own real, verbatim cover text, not invented marketing copy. This
is a content-truth fix, not a design change, so it also silently
corrected the frozen homepage's Featured Book excerpt — permitted under
"design frozen, content-driven changes only."

**Design fix:** replaced the grid + `BookCard` with a numbered editorial
spread (`PublicationIndex`/`PublicationEntry`) — a dominant, real-
aspect-ratio cover beside a narrow, restrained information column,
archival "01 / Published" label instead of a badge, index CTA reading
"Read about the book" (Amazon stays exclusive to the detail page). The
composition doesn't span the full container width — its own constrained
measure, not a stretched grid, is what makes one title read as
intentional rather than sparse. The list renders every published title
the same way, so a second or third book extends the pattern (02, 03)
without a redesign. Verified live at ~600px (this environment's actual
mobile floor), 768px, 1024px, and 1440px — no awkward half-grid at any
width, and the transition into the (untouched) footer now reads as
normal page-end rhythm rather than a stray void, purely from the
richer composition and `size="lg"` section padding, no filler copy
added. Full reasoning: `docs/sprints/SPRINT-20.md`.

**What this changes about the page overall:** Books moves off the
"apologizing for scarcity" list — the second-largest weakness this audit
found is resolved the same way Sprint 19 resolved Courses' analogous
problem: content truth first, then composition, never a fabricated fix.

**Correction (same sprint, post-review):** live browser review approved
the concept above but not its proportions — excessive opening
whitespace before the publication appeared, a cover that had grown
poster-sized, and a text column that read as stranded beside it. Fixed
by rebalancing padding (asymmetric `pt`/`pb` instead of a single `size`
token), reducing the cover ~20% at each breakpoint, and widening/
upsizing the text column so title and cover now read as one spread
rather than two competing objects. The architecture, CTA, and content-
truth fix above were untouched. Full reasoning: `docs/sprints/
SPRINT-20.md`'s "Correction — Proportion, Pacing & Hierarchy."

## About Editorial Rebuild Outcome — Sprint 21

About scored 6/10 in the pass above — clean content, but still
presenting the "no photo yet" emblem placeholder a full four sprints
after Sprint 17 put the real, approved portrait into production
elsewhere on the site, plus gold pill credential badges and a body
that repeated the same eyebrow → heading → paragraph shape six times,
including a dotted/connected Timeline component.

**Portrait:** replaced the placeholder with `CURRENT_PORTRAIT.about` —
the same crop the homepage's own About Preview section has used since
Sprint 17, not a new commission or a copy of Hero's tighter crop. The
opening was rebuilt around it (not the old panel's dimensions reused
with a swapped image) as a fuller version of the homepage preview's own
proven composition — `lg:grid-cols-[0.55fr_1.45fr]`, sticky portrait,
unquoted factual lede, mono margin index — since this page is literally
where that preview's "Read the full biography" link leads. Exactly one
portrait treatment appears on the page; the mark remains the site's
only repeated identity device, via header/footer alone.

**Removed:** all four gold `Badge` credential pills and the `Badge`
"tag" treatment on Research Interests — both replaced with the same
mono/archival idiom already established elsewhere (About Preview's
margin index, Future Courses' status line, Latest Khutbah's metadata
line), not a new visual system. The dotted/connected Timeline component
— explicitly named as an anti-pattern in the brief — was first rebuilt
as a hairline-divided era-list, then removed outright once review
showed every one of its 8 entries duplicated a fact already covered in
Education, Academia, Teaching & Speaking, Books, or the credential
index — a second restatement of the same biography, not a genuinely
distinct section. No biography content was lost by removing it; every
fact it held already lives in the section it's actually about.

**Copy audit:** the previous lede's "committed to grounded
scholarship... clarity today's seeker needs" used none of the site's
forbidden titles but was vaguer positioning language, absent from every
other approved source in the repo. Replaced with the same factual
framing the homepage About Preview already uses (trained in Kuwait,
academia/consultancy career) — traceable directly to the Biography
section's own paragraphs, not invented. The Books section's stale
"examines belief in God" line — the same placeholder text Sprint 20
corrected on `/books` — was also carrying over onto this page; now
quotes the book's real, corrected description.

**What this changes about the page overall:** About moves from "clean
content, dated presentation" to the same restrained, typography-led
register as the rest of the site's corrected secondary pages — the
real portrait finally appears where a full profile most needs it, and
no section on the page still relies on a pill, badge, or connected-line
graphic to carry information typography already does better elsewhere
on this site. Full reasoning: `docs/sprints/SPRINT-21.md`.
