# Ahmad Mohamed Kassa — UX Architecture & Experience Plan

This document plans the complete user experience of the public website. It does not
touch code, components, or the design system already in place (navy / gold / ivory
palette, serif display type, Arabic-calligraphy wordmark, manuscript-divider motif) —
it decides what gets built with that system, in what order, and why.

The brief for this platform (per `docs/project_vision.docx`) is explicit: this is not
a personal website, it's the foundation of a long-term digital academy, and it should
draw on Apple, Stripe, Harvard, MasterClass, and Yaqeen Institute — without copying
any of them — while feeling premium, timeless, minimal, scholarly, calm, and
trustworthy. Everything below is designed against that brief, and against the current
reality: one book, no courses, no portal, almost no video, and no articles yet.

That reality is the actual design problem. A thin content library that's asked to look
like an institution can go one of two ways: it can pad itself with filler ("Coming Soon
Q1 2027!", stock testimonials, empty carousels) and read as thin anyway — or it can be
honest about its size and let restraint, craft, and generous whitespace do the work
that volume would otherwise do. Everything in this plan takes the second path.

---

## 0. Document Status — What's Built vs. What's Planned

This document was originally written as a forward-looking UX plan, before most of it
was built. A homepage redesign (Sprint 11) and a permanent creative-direction split
(`docs/CREATIVE_DIRECTION.md` = why, `docs/DESIGN_SYSTEM.md` = how, Sprint 12) have
since shipped real, different decisions in several places this document originally
proposed. Rather than delete the long-term thinking below — most of it is still the
right direction — every section is now marked against reality:

- 🟢 **CURRENT** — live in the codebase today, matches this document.
- 🟡 **PLANNED** — not built, but scoped and intended as a fairly near-term next step
  (an existing feature flag, an explicit roadmap item).
- 🔵 **FUTURE-ASPIRATIONAL** — the long-term academy vision from `docs/project_vision.docx`.
  Real, still wanted, but with no committed timeline and no code — do not build or
  expose any of it (nav items, routes, UI affordances) just because it's described
  here in detail.

**The single most important reality check**: the site's actual global navigation
today is five items — **About, Books, Courses, Articles, Ask Ahmad**
(`src/constants/navigation.ts`) — not the seven-item Home/About/Books/Khutbahs/
Videos/Articles/Contact nav this document originally specified. There is no
`/khutbahs` page, no `/videos` page, and no `/search` page yet — Khutbah content
exists only as a single homepage section (`LatestKhutbahSection`) pulling from
`src/lib/data/lectures.ts`, where every entry is honestly `status: "coming-soon"`.
"Contact" and "Ask Ahmad" are two separate real routes (`/contact` and `/ask`), not
one page with an internal category switch as Section 11 below originally proposed —
see the correction inline. Sections 7 (Khutbah Library), and the Videos/Search/
language-selector material in Sections 3 and 15, are 🔵 FUTURE-ASPIRATIONAL in full —
kept because the long-term academy vision should stay documented, not because any of
it is close to being built.

---

## 1. Design Principles Guiding Every Decision

- **Institution, not blog.** Every page is laid out like a page in a considered
  publication (Harvard/MasterClass register), not a stream of "posts." No page should
  ever look like it's waiting to be filled in.
- **Confidence over density.** One book presented perfectly outperforms one book
  presented like a placeholder in a grid built for twelve. Nothing on this site should
  visibly apologise for the amount of content behind it.
- **Every empty state is designed, never apologetic.** "Coming Soon" pages read as
  *anticipation* — a preview of what the academy becomes — never as an unfinished
  screen. This is the single hardest-working idea in this plan, because right now
  roughly a third of the site's routes are, honestly, "not yet."
- **One accent, used rarely.** Warm gold marks exactly one action per screen — the
  thing you actually want a visitor to do next. If everything is gold, nothing is.
- **Content earns real estate, not the other way round.** A one-book catalogue and a
  future twelve-book catalogue use the *same* grid, the *same* card, the *same* filter
  bar. Nothing is rebuilt when the library grows — see the Books and Khutbah sections
  below for exactly how.
- **Scale without redesign.** This is a literal requirement from the vision doc
  ("without requiring a redesign"), not just good practice. Every list, filter, and
  card pattern in this document is written to work correctly at 0, 1, and 100 items.
- **Trust is built before anything is sold.** The path to a book purchase or a future
  course always runs through the biography and the teaching content first — never
  straight from ad-click to checkout. This mirrors Yaqeen Institute and MasterClass
  more than a typical e-commerce funnel, deliberately.

---

## 2. Site Map

| Page | Route | Status | Purpose | Primary Audience | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|---|
| Home | `/` | 🟢 CURRENT | First impression; establish the editorial/quiet-luxury tone (Sprint 11); route every visitor toward the emblem, the book, teaching areas, or the newsletter | First-time visitors, prospective students | "Explore Books" | "Ask Ahmad" |
| About | `/about` | 🟢 CURRENT | Tell Ahmad's story; build the trust everything else depends on | Visitors deciding whether to invest time/money/attention | "See his book" | "Ask a question" |
| Books (listing) | `/books` | 🟢 CURRENT | Present the catalogue — one title today, live from the CMS (`bookService`), ready for more | Readers, gift buyers | Open "The Great Debate" | — |
| Book Detail | `/books/[slug]` | 🟢 CURRENT | Convert interest into a purchase | Purchase-intent readers | "Buy the book" | — |
| Courses | `/courses` | 🟢 CURRENT (honest "coming soon") | Capture demand for the future academy — a real, live page listing planned courses, each clearly framed as in development, not a stub | Prospective students | Newsletter signup | Read the book in the meantime |
| Articles (listing) | `/articles` | 🟢 CURRENT | Long-form writing, structured to scale | Students of knowledge, SEO/search visitors | Read an article | — |
| Article Detail | `/articles/[slug]` | 🟢 CURRENT | Distraction-free long-form reading | Readers of a specific piece | Read next article | — |
| Ask Ahmad | `/ask` | 🟢 CURRENT | Categorised personal questions (marriage, family, aqeedah, fiqh, ruqyah, mental health) — its own route, not a tab inside Contact | Individuals with personal questions | "Submit your question" | — |
| Contact | `/contact` | 🟢 CURRENT | General/business enquiries — speaking engagements, media/press, book enquiries — its own route, separate audience and tone from Ask Ahmad | Event organisers, press, business enquiries | Contact form | Social links |
| Newsletter | `/newsletter` | 🟢 CURRENT | Dedicated signup page (also embedded as a homepage/footer section) | Anyone not ready to commit further yet | Subscribe | — |
| Newsletter confirm/unsubscribe | `/newsletter/confirm`, `/newsletter/unsubscribe` | 🟢 CURRENT | Double-opt-in confirmation and one-click unsubscribe (token-based, Sprint 8) | Just-confirmed / opting-out subscribers | — | — |
| Privacy Policy | `/privacy` | 🟢 CURRENT | Legal transparency, data handling | Legally-conscious visitors | — | — |
| Terms | `/terms` | 🟢 CURRENT | Legal terms of use | Anyone reading fine print | — | — |
| Login | `/login` | 🟢 CURRENT | Admin/staff authentication (Auth.js v5) — not a public-facing feature | Admin/Editor/Viewer staff | — | — |
| Student Portal | `/dashboard`, `/academy` *(reserved, unlisted)* | 🟡 PLANNED — route reserved, not built out | Placeholder route group for the future enrolled-student area | — | — | — |
| 404 | *(not found)* | 🟢 CURRENT | Recover a broken/removed link gracefully, on-brand | Anyone landing on a dead link | "Return home" | — |
| Khutbah Library | `/khutbahs` | 🔵 FUTURE-ASPIRATIONAL — no route exists | Dedicated home for Jumu'ah khutbah recordings as they're published; today, a single `LatestKhutbahSection` on the homepage carries this signal instead | Community members, regular followers | — | — |
| Videos | `/videos` | 🔵 FUTURE-ASPIRATIONAL — no route exists | House a wider video library (lectures, interviews, talks) | New visitors discovering him via social/YouTube | — | — |
| Search | `/search?q=` | 🔵 FUTURE-ASPIRATIONAL — no route exists | Cross-content search results | Anyone using nav search | — | — |
| Newsletter Thank You | `/newsletter/thank-you` | 🔵 FUTURE-ASPIRATIONAL — superseded | The real `/newsletter` route's inline success state + double opt-in via `/newsletter/confirm` already cover this job; a dedicated thank-you page was not built | Just-subscribed visitor | — | — |
| Book Purchase Thank You | `/books/thank-you` | 🔵 FUTURE-ASPIRATIONAL — no route exists | Bridge to the external retailer / confirm a direct purchase | Purchase-intent visitor | — | — |

Two intentional decisions worth flagging (still true today):

1. **Student Portal is not in the navigation at all.** `/dashboard` and `/academy`
   exist as reserved, unexposed route groups — matching the engineering convention
   that this path stays reserved until the feature actually ships (see
   `docs/PROJECT_MEMORY.md`). No "Coming Soon" waitlist page has actually been built
   for it yet (that page itself is still 🔵 FUTURE-ASPIRATIONAL); the routes exist as
   placeholders only.
2. **Events, Certificates, and Payments have no dedicated page yet**, matching the
   vision doc's own phasing (Phase 3–4) — these remain 🔵 FUTURE-ASPIRATIONAL,
   further out than Courses.

---

## 3. Global Navigation

🟢 **CURRENT**, corrected to match the real implementation (`src/components/layout/
site-header.tsx`, `main-nav.tsx`, `mobile-nav.tsx`, `search-trigger.tsx`) — this
section originally described a planned nav that differs from what actually shipped
in Sprint 11 in several concrete ways, noted inline below. The logo lockup shown
below uses the full name as of Sprint 14 (Editorial Refinement 2) — it briefly
showed the shortened "AMK"/"Ahmad Kassa" form between Sprint 11 and Sprint 14,
corrected back to the full name per the client's standing "never shorten unless
there's a compelling UX reason" policy.

### Desktop (≥1024px)

```
[Logo mark + "Ahmad Mohamed Kassa"]      About   Books   Courses   Articles   Ask Ahmad      [Search icon]  [Log in]  [Newsletter →]
```

- **Five text links** (`PRIMARY_NAV` in `src/constants/navigation.ts`) — About,
  Books, Courses, Articles, Ask Ahmad. No "Home" link (the logo serves that role,
  standard convention) and no "Khutbahs"/"Videos"/"Contact" links — Khutbah/video
  content isn't a standalone section yet (see Section 0), and Contact is reachable
  from the footer rather than primary nav. No dropdowns/mega menus, matching the
  original reasoning here (an empty dropdown reads as small) — still correct, still
  followed.
- **Two buttons on the right, not one** — a ghost "Log in" (admin/staff entry point,
  hidden on small screens) and a filled gold "Newsletter" CTA. This is a real
  difference from the original single-CTA plan ("Read the Book"): the newsletter, not
  a specific book, is the nav's standing highest-value ask, consistent with
  `docs/CREATIVE_DIRECTION.md`'s emphasis on the newsletter as the primary
  relationship-building mechanism.
- A quiet search icon sits to the left of Log in/Newsletter — see Search below.
- The "Books gains a dropdown at 3+ titles" / "Articles gains a category dropdown"
  evolution path remains 🔵 FUTURE-ASPIRATIONAL — not built, no trigger threshold
  reached yet.

### Tablet (768–1023px)

- The real breakpoint is `lg` (1024px), not a separate tablet tier — below `lg`,
  the five-link `MainNav` is replaced entirely by the hamburger/`MobileNav`, not
  progressively condensed link-by-link as originally planned.

### Mobile (<1024px)

- Logo (left) + search icon + hamburger (right). The hamburger opens a **right-side
  sliding drawer** (`Sheet`, `w-full sm:max-w-xs`) — not the full-screen overlay
  originally specified. The drawer lists all five nav links, then a gold "Join the
  newsletter" button and an outline "Log in" button pinned near the bottom. The
  full-screen-over-drawer reasoning in the original plan wasn't followed through in
  implementation; revisit only as part of a deliberate Editorial Refinement pass, not
  as an incidental fix.

### Sticky behaviour

- The header is **translucent with backdrop-blur at all times** (`bg-background/85
  backdrop-blur-md`), not "transparent over the hero, crossfading to solid navy."
  A soft shadow appears once scrolled (`useScrolled()`), and a `ManuscriptDivider`
  sits along the header's bottom edge always. This is a real, simpler implementation
  than the original hero-crossfade plan — the crossfade concept remains 🔵
  FUTURE-ASPIRATIONAL if a future Editorial Refinement pass wants to reintroduce it.
- No hide-on-scroll-down behaviour, consistent with the original "calm, doesn't jump
  around" reasoning — still true.

### Search

🟢 A `SearchTrigger` icon is real and live in the header today — clicking it opens a
Dialog with an honest, on-brand message ("Search is coming soon. In the meantime,
explore Books, Courses, and Articles from the menu."), not a functioning search. The
full live-filtered overlay + grouped `/search` results page described below remains
🔵 FUTURE-ASPIRATIONAL:

- Clicking it (eventually) would expand a centred overlay: a single large input,
  live-filtered suggestions grouped by type, and a "See all results" link to a full
  `/search` page for anything with more than a handful of matches.
- Kept documented because the interaction pattern (icon → overlay → grouped results)
  is still the right target design once there's enough content to search.

### Language selector

🟡 **PLANNED, partially scaffolded** — not in the header (this document's original
placement) but a real, honestly-disabled `<select>` sits in the **footer**
(`site-footer.tsx`), pre-populated from `src/config/i18n.ts`'s locale list
(English/French/Kiswahili/Arabic) and clearly marked `disabled` with an
`aria-label="Language (more coming soon)"`. `src/config/i18n.ts` itself is
explicitly "configuration only... no routing, middleware, or translation loading is
wired up yet." Moving this into the header's icon-triggered-overlay pattern next to
Search, once real translated content exists, remains 🔵 FUTURE-ASPIRATIONAL.

---

## 4. Global Footer

🟢 **CURRENT** — updated for Sprint 14 (Editorial Refinement 2), which added a
standalone mission-statement line and made social icons conditional on a real
profile URL existing:

```
[Logo mark, inverted] + [Ahmad Mohamed Kassa]      "Islamic scholarship for the
                                                     modern seeker." (large, italic)
─────────────────────────────────────────────────────────────────────────────────
Social icons (only rendered   Explore      Connect        Newsletter
 if a real profile URL         About       Ask Ahmad      [email input] [Subscribe]
 exists — currently none)      Books       Newsletter     "Book announcements,
                                Courses     Contact         courses, seminars &
                                Articles                    articles — no spam."
─────────────────────────────────────────────────────────────────────────────────────────
© {year} Ahmad Mohamed Kassa. All rights reserved.    Privacy Policy · Terms   [language select, disabled]
```

**What's real vs. what the original (pre-Sprint-14) plan proposed:**

- **Standalone mission-statement band — now real** (Sprint 14). `SITE_TAGLINE`
  ("Islamic scholarship for the modern seeker") is promoted to a large Newsreader
  italic line, set beside the logo in a masthead-style row at desktop (stacked at
  mobile) — the originally-planned Harvard/Yaqeen-style opening statement this
  section used to flag as future-aspirational is now shipped, using the existing
  tagline rather than new copy.
- **Social icons are conditionally rendered** (Sprint 14): `hasConfirmedProfile()`
  (`src/constants/site.ts`) filters `SOCIAL_LINKS` before rendering — since none of
  YouTube/Instagram/TikTok are confirmed real profiles yet (see Section 2/
  `docs/PROJECT_MEMORY.md`), the icon row currently renders nothing at all, and the
  link-column grid collapses from 4 to 3 columns rather than leaving a visibly empty
  one. The moment a real profile URL is set, its icon appears automatically — no
  code change needed.
- **"Explore"** (`FOOTER_EXPLORE`: About, Books, Courses, Articles) and **"Connect"**
  (`FOOTER_CONNECT`: Ask Ahmad, Newsletter, Contact) are the two real link columns —
  not "Quick Links" + a dedicated "Books" column. Books stays inside Explore rather
  than getting its own column; the "ready to become a real catalogue list without
  changing the footer's grid" future-proofing idea from the original plan no longer
  applies to this layout and can be dropped rather than carried forward.
- **Newsletter** is the last column, using the same `NewsletterForm` component the
  dedicated `/newsletter` page and homepage section use (`variant="footer"`) — matches
  the original "one input, one button" intent exactly.
- **Legal row** includes the disabled language `<select>` (see Section 3) alongside
  Privacy/Terms — there is no "Sitemap" link in the real footer.
- **Copyright** — plain text, no styling flourish, as originally planned.

---

## 5. Page-by-Page Wireframes

Each entry lists the section stack top-to-bottom. Pages called out for full "why"
treatment (Home, Books, Khutbahs, Articles, About, Contact, Newsletter) are kept brief
here and expanded in Section 6 onward — this section exists so every page in the site
map has a complete, standalone wireframe in one place.

### Home — `/`

🟢 **CURRENT** — real section order (`src/app/(site)/page.tsx`, Sprint 11), replacing
the original plan below it:

```
Navigation
Hero (Mode A: emblem anchor; Mode B: portrait, built and ready, not yet wired)
Featured Book
About Preview
Teaching Areas
Quote (pull-quote interstitial)
Latest Khutbah
Future Courses
CTA (Ask Ahmad)
Newsletter
Footer
```

*Full rationale in Section 6.* There is no separate "Featured Video" section on the
homepage today — video content isn't modelled as its own homepage section (🔵
FUTURE-ASPIRATIONAL, see Section 0).

### About — `/about`

```
Navigation
Page Hero (portrait, name, single-line role: "Islamic Teacher · Author · Khateeb")
The Story (long-form biography, broken into 3–4 movements, not one wall of text)
Teaching Philosophy
Credentials & Qiraʼah / Ijazah (if applicable) / Community Role
Quote (pull-quote from his own teaching)
CTA — Read the Book / Ask a Question
Newsletter
Footer
```
*Full rationale in Section 10.*

### Books (listing) — `/books`

```
Navigation
Page Hero ("Books" — one short line of framing copy)
Featured Book (large, full-width treatment — not a grid cell, since there's only one)
"More titles are in progress" — quiet notice + notify-me capture
Related: Khutbahs / Articles cross-link
Newsletter
Footer
```
- With exactly one title, a multi-column grid with one card and eleven ghosts would
  look broken. Instead the single book gets the full-bleed "featured" treatment a
  12-book catalogue would reserve for its lead title — the page never looks like
  it's missing inventory.
- The moment a second book ships, this page's hero book stays as-is and a proper
  grid appears beneath it — the layout doesn't need to be rebuilt, only populated.

### Book Detail — `/books/the-great-debate`

*Full wireframe and rationale in Section 7.*

### Khutbahs — `/khutbahs`

*Full wireframe and rationale in Section 8.*

### Videos — `/videos`

🔵 **FUTURE-ASPIRATIONAL — no route exists.** Kept documented as the long-term target
design; do not build without a fresh scoping decision (see Section 0).

```
Navigation
Page Hero ("Lectures & Talks" — framed as occasional, not a channel replica)
Featured Video (large player, most recent or most requested)
Grid of remaining videos (2–3 columns; collapses gracefully to a single full-width
  card when there are fewer than 4 videos, never an awkward half-empty row)
"Subscribe on YouTube for everything else" — honest redirect for volume, rather than
  pretending this page replaces the channel
Newsletter
Footer
```
- This page is deliberately *not* built like the Khutbah library (no filters, no
  search, no series/date sorting) — with "very few videos available," a filter bar
  over four items is furniture, not function. It gains the Khutbah library's tooling
  only once volume justifies it; until then it's a simple, well-composed featured +
  grid layout.
- Framing copy explicitly sets expectation ("a growing collection of talks and
  lectures") rather than a countable promise ("12 videos") that reads as thin.

### Articles (listing) — `/articles`

*Full wireframe and rationale in Section 9.*

### Article Detail — `/articles/[slug]`

```
Navigation
Article Header (category label, title, byline, read time, publish date)
Body (constrained ~68ch reading column, serif headings/sans body per design system)
Pull-quotes styled as a distinct, reusable block (not ad hoc per-article styling)
Author card (small, links to About)
Related Articles (2–3, same category first, falls back to "Latest" if too few exist)
Newsletter
Footer
```
- Reading width and typography are the entire design here — no sidebar, no related
  widgets crowding the copy, consistent with the "whitespace over decoration"
  instruction in the vision doc.

### Ask Ahmad — `/ask`, and Contact — `/contact`

🟢 **CURRENT, but split into two real routes** — the original plan below (Section 11)
described one `/contact` page with an internal category-selector-then-form flow
covering both personal questions and business enquiries. In reality these shipped as
two separate pages with two separate audiences: `/ask` (Ask Ahmad — the categorised
personal-question form: marriage, family, aqeedah, fiqh, ruqyah, mental health) and
`/contact` (general/business enquiries: speaking engagements & seminars, media &
press, book enquiries, plus social links). *Full wireframe and rationale, corrected,
in Section 11.*

### Privacy Policy — `/privacy` & Terms — `/terms`

```
Navigation
Page Header (title + "Last updated" date)
Body (single ~68ch column, numbered sections, anchor-linked sub-nav for long documents)
Footer
```
- Purpose: legal transparency and trust signalling — not conversion. No CTA banners,
  no newsletter box interrupting legal text; the only exit points are the persistent
  nav/footer. A short, jump-to-section anchor list at the top (like a table of
  contents) keeps a long legal document navigable without feeling like a wall of text.

### 404 — Not Found

```
Navigation
Centered Message ("This page has moved on, like a good khutbah.")
Two clear paths: "Return Home" (primary) · "Search the site" (secondary)
Quiet suggestion of 2–3 popular destinations (Home, Books, Khutbahs)
Footer
```
- Tone matters more than mechanics here: the copy is warm and on-voice rather than a
  cold "Error 404," in keeping with "calm" and "elegant" from the design brief. No
  dead-end — always two ways forward, never just a message.

### Search — `/search?q=`

🔵 **FUTURE-ASPIRATIONAL — no route exists.** The header's `SearchTrigger` icon is
real (Section 3) but opens an honest "coming soon" dialog, not this page.

```
Navigation (search overlay pre-filled with the query)
Query Header ("Results for '…'" + result count)
Grouped Results (Pages · Book · Khutbahs · Videos · Articles — only groups with
  matches render, empty groups are omitted entirely, never shown as "0 results")
Empty State (no matches: warm copy + shortcuts to Books / Khutbahs / Contact,
  never a bare "No results found.")
Footer
```
- Grouped-by-type results (rather than one flat list) are what make this scale
  cleanly from "matches almost nothing" today to "matches across a real archive"
  later, without changing the page's structure.

### Newsletter Thank You — `/newsletter/thank-you`

🔵 **FUTURE-ASPIRATIONAL — superseded, not built as a dedicated route.** The real
`/newsletter` page (Section 0, Site Map) plus `/newsletter/confirm`'s double-opt-in
flow already cover this job with an inline success state. *Full original rationale
kept in Section 12* as a reference if a dedicated confirmation page is ever wanted.

### Question Submitted — `/contact/thank-you` and `/ask` inline success

🟡 **Real, but not a separate route.** `AskAhmadForm` shows an inline success state
in place (checkmark + confirmation copy) after submission, matching this section's
"what happens next" intent, rather than navigating to a dedicated `/contact/
thank-you` page — that specific route is 🔵 FUTURE-ASPIRATIONAL. The design intent
below is still worth preserving for whenever a fuller confirmation experience is
built:

```
Navigation
Confirmation (checkmark motif consistent with the manuscript-divider style,
  not a generic system icon)
"What happens next" — one short paragraph setting an honest expectation
  (e.g. "Ahmad reviews questions personally; not every question can receive a
  public or private reply, but every one is read.")
While-you-wait suggestions: Khutbahs · About · Newsletter signup (if not already
  subscribed)
Footer
```
- The "what happens next" line matters more than the checkmark: a categorised
  question form (Marriage, Aqeedah, Mental Health, etc.) is often submitted at an
  emotionally loaded moment — the confirmation should feel personally received, not
  like a support-ticket system.

### Book Purchase Thank You — `/books/thank-you`

🔵 **FUTURE-ASPIRATIONAL — no route exists**, and no direct-purchase/Stripe checkout
exists yet to redirect from (see `docs/PROJECT_MEMORY.md`'s "Features intentionally
postponed"). Kept as the target design for whenever Stripe/direct sales ship.

```
Navigation
Confirmation Header (adapts to context — see below)
Order/Redirect Detail
Related: "While you're here" — Newsletter signup, Khutbahs, About
Footer
```
- This page is written to serve two different real states without becoming two
  pages: **(a)** today, purchases route to an external retailer (Amazon/direct
  link), so this screen is a brief, honest interstitial — *"You're being taken to
  [Retailer] to complete your purchase"* with a manual continue button (never a
  silent auto-redirect, which feels untrustworthy) — and **(b)** once direct
  checkout (Stripe) ships per the roadmap, the same route becomes a true order
  confirmation with order number and delivery/access details. The page's shape
  doesn't change between these two states, only its content.

### Courses — Coming Soon — `/courses`

🟢 **CURRENT — closely matches this original plan.** Real structure: Page Hero
("Structured study, coming soon") → a real grid of in-development courses
(`getAllCourses()`, `CourseCard`) under an "In development" eyebrow → newsletter
capture ("Join the newsletter for enrollment," `NewsletterForm source=
"COURSES_COMING_SOON"`). No separate "In the Meantime" cross-link section exists
today (🔵 FUTURE-ASPIRATIONAL addition, not a gap in what shipped).

```
Navigation
Page Hero (name the future academy directly: "Courses are coming.")
What's Being Built (2–3 short lines: structured lessons, at your own pace,
  taught directly by Ahmad — sets real expectation, not vague hype)
Waiting List Capture (single email field, one clear line of copy)
In the Meantime (cross-link to the book and khutbahs — "start learning today")
Footer
```
- This is the single most important "empty" page on the site, because it's the one
  the vision doc explicitly asks to feel like a real institution's admissions page,
  not a "not implemented yet" screen. No stock imagery of laptops or graduation
  caps — the same restrained, text-led, serif-forward treatment as every other page,
  so it reads as *forthcoming*, not *placeholder*.

### Student Portal — Coming Soon — `/dashboard`, `/academy` *(unlisted)*

🟡 **PLANNED — routes reserved, real content not built.** Both routes exist today,
`noindex`, unauthenticated, and unlinked from navigation — but each currently
renders a plain `EmptyState` ("The dashboard isn't built yet. This is a reserved
route for the future student dashboard."), not the designed waiting-list page
below. The design intent — a warm, on-brand "coming soon" page rather than a bare
placeholder, reached only via a link from Courses — remains the right target and is
worth building whenever the student portal moves from "reserved route" to "actively
planned":

```
Navigation
Page Hero ("Student accounts will live here.")
One short paragraph: what a future student will be able to do (track courses,
  download certificates, revisit lessons)
Waiting List Capture (same list as Courses — one waitlist, not two)
Footer
```
- Reached only via a link from the Courses page, never from primary nav (see
  Section 2's notes) — this keeps the page honestly discoverable for the curious
  without implying it's a live feature.

---

## 6. Deep Dive — Homepage

🟢 **CURRENT** — this entire section is corrected to describe the real Sprint 11
homepage (`src/app/(site)/page.tsx` and its section components). The original plan
below it is superseded, not merely inaccurate in details — kept as a historical
record of the pre-Sprint-11 thinking; do not treat any of it as current.

```
Navigation
Hero
Featured Book
About Preview
Teaching Areas
Quote
Latest Khutbah
Future Courses
CTA
Newsletter
Footer
```

**Hero** (`hero.tsx`, `hero-emblem.tsx`/`hero-portrait.tsx`). Ivory background with
the `.manuscript-texture` background utility, a two-column layout (visual left,
copy right on desktop; stacked, visual-first on mobile). Real copy: eyebrow "Islamic
Teacher · Author · Khateeb," headline "Ahmad *Mohamed Kassa*" (the surname in
italic gold), a one-sentence mission line, a trust line ("Khateeb, Masjid Al-Noor ·
Teaching since 2009 · Arabic & Islamic Studies"), and two CTAs — gold "Explore
Books" (`/books`) and outline "Ask Ahmad" (`/ask`), not the single "Read the Book"
button originally planned. The visual side is the `HERO_VISUAL` Mode A/B switch: the
emblem (`HeroEmblem`, live today) or a future portrait (`HeroPortrait`, built,
unwired) in the identical composition slot — see `docs/PROJECT_MEMORY.md`. A
`ManuscriptDivider` closes the section, fading in after the rest of the content, as
originally planned.

**Featured Book** (`featured-book-section.tsx`) — promoted to position 2, right
after Hero (originally planned as position 3, after a Biography Preview). Reads
live from `homepageService`/`bookService.resolveFeatured()` (CMS-editable featured
title, falling back to the newest published book). Large `BookCover` with a soft
radial gold glow and a small rotated-square "Featured" seal, title, excerpt, and up
to three CTAs (Learn more; Buy on Amazon if set; Purchase direct, only if the
`directBookSales` flag is on and a direct link exists). *Exists because:* the book
is the site's clearest "we're real" signal — matches the original plan's reasoning
even though its position and visual treatment changed.

**About Preview** (`about-preview-section.tsx`) — moved to position 3 (after
Featured Book, not immediately after Hero as originally planned). `PortraitFrame` +
a real short bio paragraph (Religious Institute in Kuwait, Khateeb at Masjid
Al-Noor) + a five-item credentials list (Khateeb — Masjid Al-Noor; Author — The
Great Debate; Teaching since 2009; Arabic & Islamic Studies; Computer Science &
Education) + "Read full biography" outline button to `/about`. Same "answer who
this person is, then hand off" intent as the original "Biography Preview" plan,
different copy/position.

**Teaching Areas** (`teaching-areas-section.tsx`) — new in Sprint 11, not part of
the original plan at all. Five cards (Aqeedah, Fiqh, Marriage & Family, Ruqyah,
Mental Health) — deliberately the same real taxonomy already used by Ask Ahmad's
question categories, not an invented marketing list. Fills the conceptual slot the
old, now-deleted `PillarsSection` used to occupy, rebuilt fresh for the new visual
language rather than restored.

**Quote** (`quote-section.tsx`) — a navy-background pull-quote interstitial with a
faint (5% opacity) full-bleed emblem watermark behind the text — the site's rhythm
break between the lighter sections above and below it, an idea the original plan
didn't call out by this name but that fulfils the same "alternate layouts" instinct
it asked for.

**Latest Khutbah** (`featured-lectures-section.tsx`, exported as
`LatestKhutbahSection`) — a single editorial spotlight card (not a grid, and not
linking to a `/khutbahs` library page, which doesn't exist — see Section 0),
featuring the one lecture already categorized `"Weekly Khutbah"` in
`src/lib/data/lectures.ts`. Every lecture in that file is honestly
`status: "coming-soon"`, so the section keeps that framing ("recordings are on the
way") rather than implying a real upload exists, plus a "Watch more on YouTube"
outside link. This replaces the original plan's separate "Latest Khutbah" +
"Featured Video" sections with one combined, honestly-framed spotlight.

**Future Courses** (`future-courses-section.tsx`) — not part of the original plan.
Mirrors the real `/courses` page's course grid (`getAllCourses()`, `CourseCard`)
under an "The academy — coming soon" eyebrow, with a "View the academy" link to
`/courses`.

**CTA** (`cta-section.tsx`) — a paper-tone Ask Ahmad prompt ("Have a question in
mind?") with a mark-glyph `ManuscriptDivider`, gold "Ask a question" (`/ask`) and
ghost "Join the newsletter instead" (`/newsletter`) buttons. Functionally the
original plan's "Final CTA," but focused on Ask Ahmad rather than repeating the
hero's book CTA.

**Newsletter** (`newsletter-section.tsx`) — navy background, same faint emblem
watermark treatment as Quote, headline "One email, every new release," the shared
`NewsletterForm`. Matches the original plan's intent closely (short headline, one
field, one button, no-spam reassurance folded into the surrounding copy).

**Footer.** As specified in Section 4.

---

## 7. Deep Dive — Book Section (`/books/[slug]`)

🟡 **PARTIALLY CURRENT — the real page (`src/app/(site)/books/[slug]/page.tsx`) is
simpler than this original plan in several real ways.** Corrected structure:

```
Navigation
Book Hero — cover, title, status badge, category, author byline, excerpt,
  publication/ISBN/language details, Buy on Amazon (or "Coming soon" disabled
  state), directBookSales-flag-gated purchase options, share buttons
Description (CMS rich text, only if the editor set one)
Gallery (only if gallery images exist)
About the Author — short blurb + link to /about (not a distinct "Author Notes"
  passage in Ahmad's own voice)
Reviews — real section, always rendered, showing an honest EmptyState
  ("Reviews aren't open yet") rather than being conditionally hidden
Related — real books from bookService.getRelated(), only if any exist
Newsletter
```

**What didn't ship, and remains 🔵 FUTURE-ASPIRATIONAL:** a Contents/chapter-list
preview, a distraction-free Sample Pages reader, a dedicated "Author Notes" block
written in Ahmad's own voice (distinct from the shorter About-the-Author blurb that
did ship), and a "Future Titles" placeholder line. The reasoning behind each — see
the original bullets below — is still worth pursuing; none of it has been built.
**What shipped differently than planned:** Reviews is a real, always-visible section
using the project's standard `EmptyState` pattern, not a carousel component that's
entirely unrendered until the first review exists — a real UX difference worth
noting if a future Editorial Refinement pass wants to reconcile the two approaches.

With one title, the temptation is to build a thin product page. Instead this page is
built to the depth a *flagship* title on a real publisher's site would get — because
right now, it effectively is the flagship.

- **Book Hero.** Large cover render (with a subtle drop shadow/perspective treatment
  rather than a flat thumbnail — the one place on the site a slightly more tactile
  visual treatment earns its keep), format options if more than one exists (hardcover/
  paperback/ebook), and the two CTAs stacked with clear hierarchy: filled gold "Buy
  Now" leads straight to the retailer, outlined "Read a Sample" scrolls down-page
  rather than navigating away (keeps purchase-intent visitors from bouncing early).

- **Contents Preview.** A clean, numbered table-of-contents list — chapter titles
  only, no descriptions. This single element does more to make a book feel
  substantial than almost anything else on the page; it signals structure and depth
  before a single word of the book is read.

- **Sample Pages.** The actual opening chapter (or a curated excerpt chosen by
  Ahmad), rendered in the same reading-column typography as Article Detail — reusing
  that pattern rather than inventing a new "reader" component. Ends with a soft
  paywall moment ("Continue reading in the full book →" + Buy Now), not a hard cutoff
  mid-sentence.

- **Author Notes.** A short, personal passage — why this book, why now, who it's for
  — set apart visually (indented, serif, perhaps a subtle quotation treatment). This
  is the single highest-trust element on the page: it's Ahmad's own voice, not
  marketing copy, and it's cheap to produce (a paragraph, not a production).

- **Reviews — future-ready layout, built now, empty for now.** A horizontal
  card-carousel pattern (photo/initial, name, one-line quote, optional star rating)
  is designed and *reserved* in the page's structure today, but is **not rendered at
  all** while there are zero reviews — an empty carousel or three stock "Coming soon"
  cards would be worse than no section. The moment even one genuine review/testimonial
  exists, the section activates automatically; nothing about the page needs to be
  rebuilt to add it. This is the concrete answer to "ready for future" reviews.

- **Related Resources.** Two or three khutbah/video cards that touch on the book's
  themes, if any are tagged as such — a small but real cross-promotion loop between
  content types, costing nothing extra to build once tagging exists in the CMS.

- **Future Titles placeholder.** A single quiet line beneath everything else — *"More
  books are being written."* — with the same waitlist capture used on the Courses
  page. Not a fake "coming Spring 2027" card; honesty over false specificity.

---

## 8. Deep Dive — Khutbah Library (`/khutbahs`)

🔵 **FUTURE-ASPIRATIONAL — no route exists.** Today, Khutbah content is a single
homepage section (`LatestKhutbahSection`, Section 6) pulling from
`src/lib/data/lectures.ts`, where every lecture is honestly `status: "coming-soon"`.
This entire section is kept as the long-term target design for once a real,
dedicated Khutbah library is scoped — none of it should be treated as a near-term
build.

```
Navigation
Page Hero ("Jumu'ah Khutbahs" + one framing line)
Filter Bar — Topic · Series · Date range · Search-within
Featured/Latest Khutbah (large, above the grid)
Grid of khutbah cards (thumbnail, title, date, series tag, duration)
Video Player (on open) — with transcript panel + download options
Newsletter ("Notified of every new khutbah")
Footer
```

This is the page most explicitly designed for a future that doesn't exist yet
("weekly or bi-weekly … recordings will eventually be uploaded"), so every element
here is chosen for how it behaves at 1 khutbah as much as at 200.

- **Filter Bar.** Topic, Series, and Date range are present in the UI from day one,
  but each control **only appears once it has at least two meaningfully different
  values** — a single-value filter (e.g. one series) is worse than no filter at all.
  With one khutbah uploaded, the bar may show nothing but the search box; with fifty,
  it's a genuinely useful research tool. The component doesn't change, only what
  populates it.
- **Series.** Khutbahs are taggable into a "series" (e.g. a multi-week topic) from day
  one in the data model, even before any series exists in practice — this is the one
  piece of future-proofing worth building slightly ahead of content, because
  retrofitting series onto years of un-tagged recordings later is real, avoidable pain.
- **Search-within.** A simple text filter across khutbah titles/topics/transcripts —
  becomes genuinely valuable once transcripts exist (see below), since it lets a
  visitor search *what was said*, not just titles.
- **Video Player.** Opens in-page (not a new tab/modal that loses context), audio-first
  fallback if only an audio recording exists for a given week (Jumu'ah khutbahs are
  often audio-only in practice) — the player component should treat audio and video
  as the same content type with a different media element, not two different features.
- **Transcript support.** A collapsible panel beside/beneath the player. Even a
  rough, unedited transcript adds real value here: accessibility (deaf/hard-of-hearing
  visitors), SEO (searchable text where there was none), and it's the raw material
  the Search-within filter depends on. Transcripts can lag behind uploads (added
  later) without blocking publication of the recording itself.
- **Download options.** Audio-only download offered as a first-class option, not
  buried — many in this specific audience listen to khutbahs offline (commute, gym,
  no signal at the masjid car park). This is a genuinely audience-specific UX
  decision, not a generic media-library feature.
- **Empty state (today's actual state).** With zero or one khutbah uploaded, the page
  never shows a bare grid — the Featured/Latest slot carries whatever exists (even
  one item looks intentional at large size), and the grid section beneath is replaced
  with a warm "New khutbahs are added weekly — subscribe to be notified" card rather
  than an obviously sparse 1-item grid.

---

## 9. Deep Dive — Articles (`/articles`)

🟡 **PARTIALLY CURRENT — simpler than planned.** The real page
(`src/app/(site)/articles/page.tsx`) is a `PageHeader` + a paginated **list**
(`getArticlesPage()`, real page-number pagination via `Pagination`), not a grid:

```
Navigation
Page Header ("Articles" / "Writing" + framing line)
Vertical list of article cards (ArticleCard, one per row, not a multi-column grid)
Pagination (real page-number controls, once content exceeds one page)
Footer
```

**What didn't ship, and remains 🔵 FUTURE-ASPIRATIONAL:** a category filter bar, a
separately-treated Featured Article slot, and a dedicated Newsletter section on this
specific page (the site-wide footer newsletter still appears, just not a second
in-page one). None of the reasoning below about category filters or a Featured slot
is wrong — it just hasn't been built, and shouldn't be assumed to exist.

Designed to scale from **zero** articles today to hundreds later without ever being
rebuilt — this is the page most literally asked ("design so it scales to hundreds
later") to prove out the plan's "scale without redesign" principle.

- **At zero articles (today):** the page is not hidden or 404'd — it exists, on-brand,
  with the Page Hero switching to a "Coming Soon" framing ("Ahmad's writing will
  appear here.") and the grid replaced by the waitlist capture pattern used elsewhere.
  This keeps `/articles` as a real, linkable, indexable page from day one — useful for
  SEO and for anyone who taps it from the nav expecting *something*.
- **At 1–12 articles:** Featured Article + a single grid row, no pagination, no
  category filter yet (see the conditional-visibility rule above) — the page looks
  exactly as complete as it is.
- **At 12–100+ articles:** the *same* grid gains pagination (or "Load more"), the
  category filter bar activates once ≥2 categories exist, and a simple "Most read /
  Newest" sort appears. None of this requires new components — `parseListQuery` /
  `TableSearchForm` / `PaginationControls`-style patterns already used elsewhere in
  this project's admin apply just as well to a public list page.
- **Categories.** Chosen to mirror likely teaching topics (Aqeedah, Fiqh, Seerah,
  Family, Reflections, Announcements) but populated from real content as it's
  written — never pre-seeded with empty category pages just to look thorough.
- **Featured Article slot** always exists once ≥1 article is published, giving
  editorial control (Ahmad or an editor chooses what leads the page) rather than
  defaulting blindly to "most recent," which matters a great deal when there are only
  a few pieces and each one's placement is a real editorial decision.

---

## 10. Deep Dive — About Page (`/about`)

🟢 **CURRENT, and more developed than this original plan** — the real page
(`src/app/(site)/about/page.tsx`) shipped more sections than originally scoped, in a
different order. Still 100% hardcoded content (see `docs/PROJECT_MEMORY.md`'s Known
Limitations — the Homepage/About CMS editors persist real rows with zero effect on
this page). Real structure:

```
Navigation
Page Hero — portrait + name + one-line description + 4 identity badges
  (Khateeb · Author · Islamic Speaker · Ruqyah since 2009)
Biography (4 short paragraphs — Kuwait study, academic background, Khateeb role,
  Ruqyah practice since 2009)
Education / Professional Background (two columns: formal training list,
  academia & consultancy)
Islamic Teaching / Public Speaking (two columns: teaching philosophy,
  minbar & seminars)
Books / Research Interests (two columns: The Great Debate + "Explore the books,"
  a tag list of research areas)
Timeline — 8-step numbered path (Foundations → Undergraduate → Postgraduate →
  Career → Community → 2009 Ruqyah → 2024 Books → Ahead: The Academy) — a
  richer, more literal timeline than the original plan's "restrained
  timeline/credentials" guidance called for
Mission (navy pull-quote band, his mission statement)
Future Academy CTA — "Join the newsletter" (primary) / "Ask a question"
  (secondary) — not "Read the Book," a real difference from the original plan
```

The original plan's four-movement narrative structure, dedicated "Teaching
Philosophy" section, and single striking pull-quote are all present in spirit but
reorganized into more, shorter, two-column sections rather than four narrative
movements — worth a look during a future Editorial Refinement pass (Section 3 of
`docs/ROADMAP.md`'s proposed sequence) given the original "not one continuous block"
intent has arguably been satisfied a different way. Original reasoning kept below
for that future review.

**Why it's broken into movements, not one block.** A single unbroken biography reads
like a CV; four short, titled movements read like a story — each gets its own
breathing room (a divider, a slight background shift, or a supporting image), which
matches "scholarly but not dry" better than a dense paragraph wall. This structure
also gives future content somewhere to go — a fifth movement (e.g. "Founding the
Academy") can be appended later without restructuring the page.

**Why Teaching Philosophy is separate from The Story.** The Story answers "who is
this person"; Teaching Philosophy answers "what will I get from him," which is the
actual question a prospective student or reader is holding by the time they reach
this far down the page — worth its own short, distinct section rather than being
buried inside the narrative.

**Why the Pull-Quote exists.** One large, isolated line in his own voice does more to
build a personal connection in five seconds than another paragraph would — a
technique borrowed deliberately from MasterClass instructor pages.

**Why the CTA is "Read the Book" first, "Ask a Question" second.** By the time a
visitor reaches the bottom of a full biography, they've already decided whether they
trust him — the book is the next logical, low-friction step; a direct question is a
higher-commitment ask, so it's offered but not pushed first.

---

## 11. Deep Dive — Ask Ahmad (`/ask`) and Contact (`/contact`)

🟢 **CURRENT, but shipped as two separate real routes, not one page with an internal
category-then-form flow as originally planned** (see Section 0). Each page's real
structure:

**Ask Ahmad — `/ask`** (`AskPage` + `AskAhmadForm`):

```
Navigation
Page Header ("Ask Ahmad" — personal framing, matches the original intent)
Question Form:
  Name + Email
  Category (dropdown Select: Marriage · Family · Aqeedah · Fiqh · Ruqyah ·
    Mental Health · Other)
  Question (single textarea, 2000-char counter, same shape for every category)
  Consent checkbox (privacy reassurance folded into its own label text)
  Submit → inline success screen (checkmark, reference number with copy button,
    "Ask another question")
```

**Contact — `/contact`** (`ContactPage` + `ContactForm`):

```
Navigation
Page Header ("Get in touch" — explicitly redirects Islamic-knowledge questions to
  Ask Ahmad in its own description line)
Enquiry-type list (Speaking engagements & seminars · Media & press ·
  Book enquiries) + "Based in: East London, United Kingdom" + social icons
Contact form (general enquiry — separate component, not read in this pass)
```

**What matches the original plan:** the categorised-question concept (now `/ask`'s
Category field), the privacy/confidentiality reassurance near the form, and the
clear separation between personal-question and business-enquiry audiences/tone —
all present, just expressed as two pages instead of one page with a divider.

**What didn't ship, and remains 🔵 FUTURE-ASPIRATIONAL:** the tappable-tile category
selector (today it's a standard dropdown `Select`), the Ruqyah/Mental-Health
crisis-resource note, and the Aqeedah/Fiqh optional "reference/madhhab context"
field. All three are genuine duty-of-care/quality ideas worth revisiting — none of
the reasoning below is wrong, none of it has been built yet:

- The selector is presented as large, tappable tiles (not a dropdown) — the act of
  choosing "Mental Health" or "Marriage" is itself a small, sensitive decision for a
  visitor, and a dropdown trivialises that; a tile grid gives it appropriate visual
  weight.
- Selecting **Ruqyah** or **Mental Health** surfaces one extra line above the form —
  a gentle note that this is *not a crisis service*, with a link to appropriate
  professional/emergency resources — a genuine duty-of-care addition, not boilerplate.
- Selecting **Aqeedah** or **Fiqh** surfaces an optional "reference/madhhab context"
  field — these questions often benefit from knowing the asker's background; it's
  optional, never required.

---

## 12. Deep Dive — Newsletter (signup UX + confirmation)

🟡 **PARTIALLY CURRENT — real double opt-in exists, but the signup UX and
confirmation differ from this original plan.**

**Where signup appears — matches the plan, plus one more:** a dedicated `/newsletter`
page (not originally planned as its own route), the homepage's `NewsletterSection`,
every page's footer, and secondary CTAs on the homepage `CtaSection` ("Join the
newsletter instead") and `/courses`/`/books/[slug]`. Never an interrupting popup —
still true.

**The real signup UX** (`NewsletterForm`, `src/components/forms/newsletter-form.tsx`):

```
[ First name (optional) — non-footer variant only ]
[ Email address input ]  [ Join Newsletter ]
"By subscribing you agree to receive occasional email updates. Unsubscribe anytime."
```

- A real difference from the original plan: there **is** an optional first-name
  field on the non-footer variant (the plan explicitly said "no name field" to
  maximise conversion) — kept because personalised email greetings were judged worth
  the small friction. The footer variant stays email-only, closer to the original
  minimal-friction intent.
- **Success is a toast notification** (`sonner`, "your subscription is pending
  confirmation" — see below), not the inline checkmark-morph originally planned.
  There is no dedicated `/newsletter/thank-you` page (🔵 FUTURE-ASPIRATIONAL,
  superseded — see Section 5); a direct link from a campaign email lands on
  `/newsletter/confirm` instead.
- **Real double opt-in** (Sprint 8): signup creates a `PENDING` subscriber; only
  clicking the confirmation link (`/newsletter/confirm`) flips it to `ACTIVE` — this
  matches the original plan's "recommended, given the personal/Islamic-content
  nature of this list" reasoning closely, just implemented as a real confirm route
  rather than a thank-you-page-with-a-click-through.

**What didn't ship, and remains 🔵 FUTURE-ASPIRATIONAL:** the dedicated
`/newsletter/thank-you` "You're in" page with cross-links, and the specific inline
checkmark-morph success animation. The cadence-setting copy principle below is still
sound and worth applying to `/newsletter/confirm`'s real copy if it doesn't already:

- Page: *"You're in. You'll hear from us when there's something worth sharing — new
  khutbahs, new writing, and news about future courses."* This line does real work:
  it sets a *cadence* expectation (not "every day") and previews exactly the content
  types this plan is built around, turning a first-time subscriber into someone who
  now has a concrete reason to return (see the User Journey below).

---

## 13. Animations

🟡 **Directionally current; exact values superseded.** `docs/DESIGN_SYSTEM.md`'s
Motion section is now the authoritative implementation reference (constants,
variants, the `ScrollReveal`/`useReducedMotion` pattern) — treat the specific
timing/distance numbers below as the original design intent, not verified current
values. One concrete example: the real scroll-reveal fade (`src/constants/
motion.ts`'s `fadeUp`) settles 16px over 600ms with a `[0.16, 1, 0.3, 1]` ease, not
the "8-12px, near-instant" figure below — same restrained spirit, different exact
numbers. The overall philosophy (restraint, one-time reveals, no parallax/
auto-playing carousels/scroll-jacking) still holds and is still followed.

Restraint is the animation strategy, not an afterthought to it — nothing here should
ever be the reason a visitor notices "an animation" rather than simply feeling the
page respond well.

- **Loading states.** No spinners. Content-shaped skeleton blocks (matching the
  eventual layout's proportions — a book-cover-shaped block, a text-line-shaped
  block) fade into the real content once loaded. A page never "pops" from blank to
  full; it settles.
- **Hover effects.** Buttons: a subtle 150ms colour/shadow deepen, never a scale/bounce.
  Cards (book, khutbah, article, video): a gentle 2–4px lift with a softened shadow —
  enough to confirm "this is clickable," never enough to feel gamified. Text links:
  an underline that draws in from one side rather than snapping on, echoing the
  manuscript-divider's handcrafted feel.
- **Page transitions.** A short (200–250ms) cross-fade between routes, with the new
  page's hero content given a slight upward settle (8–12px) as it fades in — enough to
  feel considered, far too subtle to feel like "an effect."
- **Scroll effects.** Sections fade/settle into place once ~20% visible (one-time,
  never re-triggering on scroll-up/down) — used exactly once per section, never
  stacked (no simultaneous fade + slide + scale on the same element). The nav's
  transparent-to-solid crossfade (Section 3) is the one scroll-driven effect used
  more than once, because it serves an actual functional purpose (legibility), not
  decoration.
- **Reduced motion.** Every animation above collapses to an instant (or near-instant,
  ≤50ms opacity-only) state when `prefers-reduced-motion` is set — detailed further
  in Accessibility below.
- **What's deliberately absent.** No parallax, no auto-playing carousels, no
  scroll-jacking, no confetti/celebration animations on form success (a checkmark and
  warm copy do that job with more dignity, matching "calm" from the brief), no
  looping background video. Every one of these is a common "premium site" instinct
  that this specific brief's tone (scholarly, calm) actively argues against.

---

## 14. Accessibility

🟡 **Principles still followed; treat `docs/ACCESSIBILITY.md` as the authoritative,
current reference for what's actually implemented** (reduced-motion coverage,
RTL/logical-property status, live-region form errors) rather than this section —
this plan predates that document and hasn't been reconciled line-by-line against it
in this pass. One known inaccuracy: the `/` keyboard shortcut for opening search
described below is not confirmed wired up to the real `SearchTrigger` (Section 3);
verify before relying on it.

- **Keyboard navigation.** Full site operable without a mouse: logical tab order
  following visual order, a visible focus ring (gold, matching the brand accent,
  never suppressed for aesthetics), `/` opens search from anywhere, `Escape` closes
  any overlay (search, mobile nav, category tiles' expanded state) and returns focus
  to the control that opened it.
- **Contrast.** Navy-on-ivory and ivory-on-navy body text both meet WCAG AA at
  minimum (targeting AAA for primary reading copy, given how text-led this site is);
  gold is used for accents, icons, and short CTA labels — never as a body-text colour
  on ivory, since warm gold on light ivory is the one combination in this palette
  that struggles to meet contrast targets at small sizes.
- **Screen readers.** Every image (book cover, portrait, khutbah thumbnails) carries
  meaningful alt text — not filenames, not "image of…" — landmark regions
  (`nav`, `main`, `footer`) are used correctly throughout, the video/audio player
  exposes proper controls and states (not a custom unlabelled div), and category
  tiles on the Contact page are true radio-button semantics under the hood, not
  styled `div`s.
- **Reduced motion.** Respecting `prefers-reduced-motion: reduce` is a hard
  requirement, not a nice-to-have: all fades/settles/lifts from Section 13 collapse
  to immediate or near-immediate state changes; nothing essential to understanding
  the page (a status change, a form result) is ever conveyed by motion alone.
- **Forms.** Every field has a real, associated `<label>` (never placeholder-only
  labelling), errors are announced to assistive tech and described in specific,
  actionable text next to the field in question, and the Contact page's
  category-then-form flow never traps a screen-reader or keyboard user between steps.

---

## 15. Mobile Experience

🟡 **Principles still sound; some specifics superseded by Section 3's corrections**
— notably, the mobile nav is a right-side sliding drawer (`Sheet`) today, not the
full-screen overlay this section (and Section 3) originally specified. The
Khutbah/Article/Video grid, filter-bar-as-bottom-sheet, and sticky mini-player
material below is 🔵 FUTURE-ASPIRATIONAL wherever it depends on pages that don't
exist yet (Khutbah library, Videos — see Section 0); Articles' real pagination
(Section 9) doesn't yet have the column-count/filter behavior described here.

Given the audience ("practising Muslims of all ages"), a meaningful share of visits —
likely the majority — will be mobile, often on the way to or from the masjid. Every
responsive change below is written with that specific, real use-case in mind.

- **Navigation.** Full-screen overlay menu (Section 3), gold CTA pinned within
  natural thumb reach at the bottom of the overlay, not stranded at the top.
- **Hero (Home/About/Book/Coming-Soon pages).** Stacks to a single column;
  portrait/cover image moves above the headline (visual-first on mobile, since a
  photograph reads faster than reading a full headline on a small screen); CTA
  button becomes full-width for an easy, unambiguous tap target.
- **Featured Book / Featured Video / Latest Khutbah cards.** Full-width single
  cards, stacked vertically — never a horizontally-scrolling row on mobile for a
  *primary* section (fine for a *secondary* "related" row, where horizontal scroll
  is an acceptable, well-understood pattern).
- **Khutbah/Article/Video grids.** Collapse from 3 columns → 2 → 1 as width shrinks;
  the filter bar (Section 8/9) collapses into a single "Filter & Sort" button that
  opens a bottom sheet, rather than trying to squeeze Topic/Series/Date controls
  into a horizontal strip that would wrap awkwardly.
- **Video/audio player.** Full-width, sticky mini-player behaviour when scrolling
  away mid-playback (small persistent bar at the screen bottom with play/pause +
  title) — genuinely useful for the "listening to a khutbah while browsing the rest
  of the site" behaviour this audience is likely to exhibit.
- **Contact category tiles.** 3-across grid on desktop becomes a single-column
  stacked list on mobile — tiles stay large and easy to tap rather than shrinking to
  fit a multi-column grid on a small screen.
- **Footer.** Four columns collapse to a single stacked column, with Quick Links and
  Books each becoming a tidy accordion (tap to expand) so the footer doesn't become
  an enormous scroll-past wall on mobile — Connect (social icons) and the newsletter
  input stay always-visible, not hidden behind an accordion, since they're the two
  actions worth keeping frictionless.
- **Reading pages (Article/Book sample/Legal).** Column width goes full-viewport
  with generous side padding (never edge-to-edge text) and the type scale steps down
  one notch from desktop, not more — long-form reading is the one place mobile type
  should stay as close to desktop size as comfortably possible, since shrinking
  reading type to "fit more on screen" is a common mobile mistake this plan
  deliberately avoids.
- **Sticky nav height.** Condenses further on mobile than on desktop (search icon and
  CTA remain, logo mark shrinks more aggressively) to protect vertical space on small
  screens, where every pixel of scroll-viewport matters more.

---

## 16. End-to-End User Journey

🔵 **Directionally FUTURE-ASPIRATIONAL from step 5 onward** — steps 1–4 describe
real, buildable behavior (homepage → About → Book Detail → Newsletter signup all
exist, with real routes and forms, per Sections 6, 10, 7, 12 above). Step 5 assumes
a Khutbah library page that doesn't exist yet (Section 8); step 6 assumes a live,
purchasable Courses catalogue and Stripe checkout, both explicitly deferred (see
`docs/PROJECT_MEMORY.md`'s "Features intentionally postponed"). The overall
narrative arc — trust before content before commitment — remains the right guiding
principle for real work; treat the specific pages/routes named in later steps as
aspirational, not as claims about what exists today.

```
1. LANDS ON HOMEPAGE
   Entry: search, social bio link, word of mouth, khutbah audio shared in a group chat.
   Sees: confident hero, one clear CTA — no clutter, no ask beyond "look further."
   Feels: "this is a real, considered platform, not a hobby site."

        ↓

2. READS THE BIOGRAPHY
   Path: Hero → Biography Preview → "Read his full story" → /about
   Sees: a real person, a real teaching lineage, a real community role
     (Khateeb, Masjid Al-Noor).
   Feels: trust forming — the actual purpose of the entire About page.

        ↓

3. VIEWS THE BOOK
   Path: About's CTA → /books/the-great-debate
   Sees: contents preview, a real sample chapter, Ahmad's own author's note.
   Decision point: buy now, or "not yet, but I'm interested" — the site needs
     to serve BOTH outcomes gracefully, which is exactly what step 4 is for.

        ↓

4. SIGNS UP FOR THE NEWSLETTER
   Path: Book Detail's secondary CTA, or the homepage/footer newsletter section,
     for anyone not ready to buy today.
   Sees: one field, one button, an honest "no spam" line.
   Lands: inline success, or /newsletter/thank-you, which explicitly previews
     what they'll hear about next — new khutbahs, new writing, future courses.
   Why this step is the hinge of the whole journey: content today is thin
     (one book, few videos, occasional khutbahs) — the newsletter is what
     converts a single visit into a standing relationship with the site,
     regardless of whether a purchase happened this visit.

        ↓

5. RETURNS LATER FOR KHUTBAHS
   Trigger: a "new khutbah is up" email, or simply habit (checking most Friday
     evenings/Saturdays).
   Path: direct newsletter link → /khutbahs, or nav → /khutbahs directly.
   Sees: the featured/latest khutbah front and centre, filters that will
     matter more as the library grows, a download option for offline listening.
   Feels: this is becoming a habit, not a one-off visit — the site now has
     recurring, low-friction value even though nothing has been purchased.

        ↓

6. EVENTUALLY PURCHASES A FUTURE COURSE
   Trigger: months of accumulated trust (biography once, book once, khutbahs
     repeatedly) plus a newsletter announcement that Courses has moved from
     "Coming Soon" to live.
   Path: newsletter → /courses (now a real catalogue, same URL, same waitlist
     audience already captured) → course detail → checkout (Stripe, per the
     roadmap) → a genuine confirmation at /books-or-courses/thank-you,
     structurally the same pattern already built for book purchases.
   Feels: this is not a cold sale — it's the natural next chapter of a
     relationship that started with a free biography read months earlier.
```

**Why this journey is the actual design brief.** Nothing in this plan tries to
convert a first-time visitor into a course customer in one session — the content
doesn't exist yet to justify that, and the vision doc's own tone (calm, trustworthy,
scholarly) argues against a hard-sell funnel even once it does. Every page above is
built to move a visitor exactly one step down this ladder and then hand them off
cleanly to the next one — which is also, not coincidentally, the only realistic way
a thin-content platform earns the right to look and feel like a premium institution
before it has the content volume of one.
