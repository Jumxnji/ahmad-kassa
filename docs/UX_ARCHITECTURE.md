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

| Page | Route | Purpose | Primary Audience | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|
| Home | `/` | First impression; establish premium/scholarly tone; route every visitor toward biography, the book, or the newsletter | First-time visitors, prospective students | "Read The Great Debate" | "Get khutbah updates" (newsletter) |
| About | `/about` | Tell Ahmad's story; build the trust that everything else depends on | Visitors deciding whether to invest time/money/attention | "See his book" | "Ask a question" |
| Books (listing) | `/books` | Present the catalogue — one title today, ready for more | Readers, gift buyers | Open "The Great Debate" | "Notify me of future books" |
| Book Detail | `/books/the-great-debate` | Convert interest into a purchase or a sample read | Purchase-intent readers | "Buy the book" | "Read a sample chapter" |
| Khutbahs | `/khutbahs` | House Jumu'ah khutbah recordings as they're published | Community members, regular followers | Play latest khutbah | "Get notified of new khutbahs" |
| Videos | `/videos` | House the wider (currently small) video library — lectures, interviews, talks | New visitors discovering him via social/YouTube | Play featured video | Subscribe on YouTube |
| Articles (listing) | `/articles` | Future long-form writing, structured to scale to hundreds | Students of knowledge, SEO/search visitors | (once live) Read latest article | "Notify me when articles launch" |
| Article Detail | `/articles/[slug]` | Distraction-free long-form reading | Readers of a specific piece | Read next article | Subscribe |
| Contact | `/contact` | Categorised questions (Marriage, Family, Aqeedah, Fiqh, Ruqyah, Mental Health, Other) + general/business enquiries | Individuals with personal questions, event organisers, press | "Submit your question" | General enquiry email |
| Privacy Policy | `/privacy` | Legal transparency, data handling | Legally-conscious visitors | — | "Contact us about privacy" |
| Terms | `/terms` | Legal terms of use | Anyone reading fine print | — | Back to Home |
| 404 | *(not found)* | Recover a broken/removed link gracefully, on-brand | Anyone landing on a dead link | "Return home" | Search the site |
| Search | `/search?q=` | Cross-content search results | Anyone using nav search | Open a result | Browse by section instead |
| Newsletter Thank You | `/newsletter/thank-you` | Confirm subscription, keep momentum | Just-subscribed visitor | Read the book | Follow on social |
| Question Submitted | `/contact/thank-you` | Confirm a question was received, set expectations | Just-submitted visitor | Browse khutbahs while you wait | Share with someone who'd benefit |
| Book Purchase Thank You | `/books/thank-you` | Bridge to the external retailer / confirm a direct purchase | Purchase-intent visitor | Continue to retailer / View order | Subscribe for future book news |
| Courses — Coming Soon | `/courses` | Capture demand for the future academy honestly | Prospective students | "Join the waiting list" | Read the book in the meantime |
| Student Portal — Coming Soon | *(unlisted, reserved)* | Placeholder for the future enrolled-student area | Curious visitors who find it, not yet linked from nav | "Join the waiting list" (same as Courses) | Back to Home |

Two intentional decisions worth flagging:

1. **Student Portal is not in the navigation at all.** It exists in this plan only as a
   destination reachable from the Courses "Coming Soon" page ("Student accounts will
   live here"), matching the existing engineering convention that `/dashboard` stays
   reserved and unexposed until the feature actually ships. Adding a greyed-out nav
   item for something that doesn't exist reads as a website apologising for itself —
   exactly what this plan avoids.
2. **Events, Certificates, and Payments have no dedicated page yet.** Per the vision
   doc's own phasing (Phase 3–4), these are further out than Courses. Rather than
   invent three more "Coming Soon" stubs today, they're folded into a single line on
   the Courses page ("and, over time, seminars, certificates, and enrolment") until
   one of them is close enough to ship to deserve its own page.

---

## 3. Global Navigation

### Desktop (≥1024px)

```
[Logo: Arabic calligraphy + wordmark]      Home   About   Books   Khutbahs   Videos   Articles   Contact        [Search icon]   [Read the Book →]
```

- Seven text links, evenly spaced, generous letter-spacing — no dropdowns, no mega
  menu. **This is deliberate, not an oversight:** a mega menu under "Books" that opens
  to reveal one title, or under "Articles" that opens to reveal none, actively
  undermines the premium feel this brief asks for. Empty dropdown panels are one of
  the fastest ways a small site reads as small. The nav should look exactly as
  confident as the content behind it.
- One filled gold button on the far right — always the single highest-value action
  available right now (currently "Read the Book"; becomes "Explore Courses" once
  Phase 3 ships, per the vision doc's own roadmap).
- A quiet search icon sits just left of the CTA button, not a full search bar — see
  Search below.
- **Evolution path, so this isn't rebuilt later:** once 3+ books exist, "Books"
  gains a simple two-column dropdown (cover thumbnails, not a mega menu). Once
  Articles has real categories, it gains a lightweight category dropdown. Neither
  is built now — the trigger is content, not a sprint number.

### Tablet (768–1023px)

- Same logic, condensed: link spacing tightens, the CTA button shrinks to icon+label,
  and once space is fully exhausted, the last 2–3 links (Videos, Articles) collapse
  into the hamburger menu before anything else does — Home/About/Books/Contact stay
  visible longest, since they're the highest-traffic destinations.

### Mobile (<768px)

- Logo (left) + search icon + hamburger (right). Tapping the hamburger opens a
  full-screen overlay (not a slide-in drawer) in the site's ivory/navy palette:
  large, generously-spaced link list, the gold CTA button pinned near the thumb at
  the bottom, and a small "Subscribe" line beneath it. Full-screen over a drawer
  because a drawer on a content-light site tends to feel like a leftover admin
  pattern; full-screen reads as considered.

### Sticky behaviour

- On the homepage only, the nav starts **transparent over the hero** (logo/text in
  ivory) and crossfades to a solid navy bar with a soft bottom hairline once the
  visitor scrolls past the hero — a small, standard, high-craft touch (this is the
  Apple/Stripe marketing-site pattern named explicitly in the brief).
- Everywhere else, the nav is solid from the first frame (there's no hero to sit
  over) and stays fixed at a slightly condensed height (logo mark shrinks ~15%) once
  scrolling begins, so the CTA and search stay reachable without the bar eating too
  much vertical space on long pages (Khutbahs, Articles).
- No hide-on-scroll-down behaviour — the vision doc's "calm" register doesn't suit a
  nav that jumps around; it stays put.

### Dropdowns / mega menus

None at launch, per above. The only exception: **Search** (see below), which behaves
like a dropdown/overlay hybrid rather than a full page navigation.

### Search

- A single icon-triggered overlay, not a persistent search bar — with only one book,
  a handful of khutbahs, and no articles yet, a bar occupying permanent nav real
  estate would be searching almost nothing. The icon signals "search exists and is
  built properly" (a premium-site expectation) without visually competing for
  attention it hasn't earned yet.
- Clicking it (or pressing `/` on desktop) expands a centred overlay: a single large
  input, live-filtered suggestions grouped by type (Pages · Book · Khutbahs · Videos
  · Articles) appearing as the visitor types, and a "See all results" link to the
  full `/search` page for anything with more than a handful of matches.
- This is explicitly future-proofed: the exact same overlay and results page will
  carry real weight once Articles and the Khutbah library grow — nothing about the
  pattern changes, only the volume of results.

### Language selector

- **Reserved, not built.** The vision doc lists multilingual support as future scope,
  and the codebase already carries a `multilingual` feature flag for this reason. A
  language selector placeholder is *not* added to the nav today — a globe icon that
  only ever says "English" is dead weight. When Arabic (or another language) content
  is real, a compact selector lands to the immediate left of the search icon, using
  the same icon-triggered-overlay pattern as search rather than a traditional
  dropdown, so the two feel like one consistent "utility cluster" rather than two
  unrelated widgets bolted onto the nav.

---

## 4. Global Footer

```
Mission statement (short, one sentence, serif)
─────────────────────────────────────────────
Quick Links        Books              Connect            Stay Updated
 About              The Great Debate   YouTube             [email input] [Subscribe]
 Khutbahs           (future titles     Instagram           "Monthly-ish. No spam."
 Videos              listed here as    Facebook
 Articles            they publish)
 Contact
─────────────────────────────────────────────
Privacy Policy · Terms · Sitemap          © 2026 Ahmad Mohamed Kassa. All rights reserved.
```

**Why each part exists:**

- **Mission statement** — one sentence, set in the display serif, sitting alone above
  the column grid. This is the "institution" signal: Harvard/Yaqeen-style footers open
  with a statement of purpose, not a logo repeated from the header. Something in the
  register of: *"Sharing authentic Islamic knowledge, one lesson at a time."*
- **Quick Links** — the full primary nav again, for the (large, real) share of
  visitors who scroll straight to the footer to orient themselves, a well-documented
  pattern on content-first sites.
- **Books column** — deliberately its own column, not folded into Quick Links. This is
  quiet future-proofing: today it lists one title; it's structurally ready to become a
  real catalogue list without changing the footer's grid.
- **Connect (social)** — icon row, not text links, kept small and quiet — this is a
  secondary trust signal ("this is a real, active person"), not a primary CTA. Given
  "very few videos" exist today, YouTube is listed but not oversold.
- **Stay Updated (newsletter)** — the *only* input field in the footer, and the only
  place other than the dedicated newsletter section it needs to appear. Repeating the
  ask at the natural end of every page maximises capture without nagging mid-page.
- **Legal row** — small, quiet, bottom-most, exactly where a visitor expects it and
  nowhere it competes with real content.
- **Copyright** — plain text, no styling flourish. This is the one place on the site
  that should look completely unremarkable.

---

## 5. Page-by-Page Wireframes

Each entry lists the section stack top-to-bottom. Pages called out for full "why"
treatment (Home, Books, Khutbahs, Articles, About, Contact, Newsletter) are kept brief
here and expanded in Section 6 onward — this section exists so every page in the site
map has a complete, standalone wireframe in one place.

### Home — `/`

```
Navigation (transparent → solid on scroll)
Hero
Biography Preview
Featured Book
Latest Khutbah
Featured Video
Newsletter
Final CTA
Footer
```
*Full rationale in Section 6.*

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

### Contact — `/contact`

*Full wireframe and rationale in Section 11.*

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

*Full rationale in Section 12.*

### Question Submitted — `/contact/thank-you`

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

### Student Portal — Coming Soon — *(unlisted)*

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

```
Navigation (transparent → solid on scroll)
Hero
Biography Preview
Featured Book
Latest Khutbah
Featured Video
Newsletter
Final CTA
Footer
```

**Hero.** Full-bleed, generous vertical space, ivory background with a large serif
headline (his name or a single teaching-forward line — not a marketing slogan),
one-line role descriptor ("Islamic Teacher · Author · Khateeb"), and exactly one gold
button ("Read the Book"). No slider, no auto-rotating claims — a static, confident
hero is itself a premium signal (this is precisely the Apple/Stripe pattern: one
message, stated once, stated well). A small manuscript-divider motif closes the
section, tying it visually to the brand rather than a generic underline.

**Biography Preview.** Three to four sentences pulled from the full About page, set
in serif at a larger-than-body size, paired with a single portrait photo. Its entire
job is to answer "who is this person" in under ten seconds and hand off to the full
story — a "Read his full story →" link, never a button competing with the hero's CTA.
*Exists because:* trust has to be established before the book is asked to sell
itself; this is the first proof point.

**Featured Book.** The one published book, presented like a hero product shot — cover
image with real weight (not a thumbnail), title, one-sentence hook, and the same gold
"Buy the book" CTA repeated here (consistency, not novelty). *Exists because:* the
book is the site's only current revenue driver and its clearest "we're real, ask
serious" signal — it deserves its own full section, not a passing mention.

**Latest Khutbah.** A single card: thumbnail, date, title, a small "▶" play affordance
linking through to the Khutbah library. If no khutbah has been uploaded yet, this
section is replaced — not hidden — by a quiet "Khutbah recordings begin soon; subscribe
to be notified" card in the same visual slot, so the homepage's rhythm never breaks
because of what hasn't been recorded yet. *Exists because:* it signals an *active,
ongoing* practice (not a one-off book launch), which is core to the "long-term
academy" positioning.

**Featured Video.** One embedded/thumbnail video, chosen manually (not "most recent,"
since with so few videos, manual curation always beats an algorithmic pick from a
pool this small). If
zero videos exist, this section is omitted entirely from the homepage rather than
shown empty — Latest Khutbah alone can carry the "active teacher" signal.
*Exists because:* video is the lowest-trust-cost way for a brand-new visitor to
sample his teaching style before committing to a book purchase.

**Newsletter.** A dedicated, unmissable but not desperate section — short headline
("Stay close to new lessons"), one input, one button, one line of reassurance ("no
spam, unsubscribe anytime"). *Exists because:* with thin content today, the
newsletter is the primary mechanism for turning a one-time visitor into a returning
one — see the User Journey in Section 16.

**Final CTA.** A closing full-width band (navy background, ivory text, gold button)
restating the single most important next step for a visitor who scrolled the whole
page without acting yet — mirrors the hero's CTA exactly, closing the loop.

**Footer.** As specified in Section 4.

---

## 7. Deep Dive — Book Section (`/books/the-great-debate`)

```
Navigation
Book Hero — cover, title, one-line premise, price/format, Buy Now (primary),
  Read a Sample (secondary)
Contents Preview — chapter/section list
Sample Pages — first chapter or a curated excerpt, distraction-free reader
Author Notes — a short passage from Ahmad on why he wrote it
Reviews — reserved, future-ready layout (see below)
Related Resources — khutbahs/videos that reference the book's themes
Future Titles — quiet placeholder for what's next
Newsletter
Footer
```

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

```
Navigation
Page Hero ("Articles" + framing line — or, at zero content, an honest "Coming Soon"
  variant of the same hero)
Category filter bar (same conditional-visibility rule as Khutbahs' filters)
Featured Article (large, top of page)
Grid of article cards (title, category, excerpt, read time, date)
Newsletter ("Be the first to read new articles")
Footer
```

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

```
Navigation
Page Hero — portrait + name + one-line role
The Story — 3–4 narrative movements (not one continuous block)
  1. Early life / how his Islamic education began
  2. Formal study — teachers, institutions, ijazah/qira'ah if applicable
  3. Becoming a Khateeb — his role at Masjid Al-Noor, East London
  4. Why he writes and teaches today — the throughline into his book/khutbahs
Teaching Philosophy — a short, quotable statement of how he approaches teaching
Pull-Quote — a single striking line, set large, in his own words
CTA — "Read the Book" (primary) / "Ask a Question" (secondary)
Newsletter
Footer
```

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

## 11. Deep Dive — Contact (`/contact`)

```
Navigation
Page Hero ("Ask Ahmad" framing — personal, not corporate "Contact Us")
Category Selector — Marriage · Family · Aqeedah · Fiqh · Ruqyah · Mental Health · Other
Question Form (adapts slightly per category — see below)
Privacy/Confidentiality Reassurance (short, explicit line)
Divider
General/Business Enquiries — a separate, smaller block (press, events, collaborations)
Footer
```

**Why a category selector, not a single generic form.** These categories are not
decorative — the whole page is designed around them:

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
- **Marriage** and **Family** share the same form shape but different placeholder
  copy, tuned to the kind of detail that's actually useful for each.
- **Other** is a deliberately plain fallback — no visitor should ever feel their
  question doesn't fit anywhere.

**Privacy reassurance.** One explicit sentence near the form — *"Your question is
read only by Ahmad and is never shared publicly without your permission."* — placed
here because personal/Aqeedah/mental-health questions carry real emotional weight;
trust copy earns its place directly beside the submit button, not buried in the
Privacy Policy alone.

**General/Business Enquiries — kept separate and smaller.** Press, event bookings,
and collaboration requests are a fundamentally different audience and tone from a
personal Fiqh question — visually demoting this to a smaller block beneath a divider
keeps the page's primary energy focused on the community-facing Q&A experience,
while still giving professional enquiries a clear, findable path (a plain email
link is enough here; it doesn't need its own categorised form).

---

## 12. Deep Dive — Newsletter (signup UX + confirmation)

**Where signup appears:** homepage dedicated section, every page's footer, and as a
secondary CTA on Home/About/Book Detail/Khutbahs. Never as an interrupting popup or
exit-intent modal — those patterns actively work against "calm" and "trustworthy."

**The signup UX itself:**

```
[ Email address input ]  [ Subscribe → ]
"No spam. Unsubscribe anytime."
```

- Single field, single button, one line of reassurance — no name field, no interest
  checkboxes, no "how did you hear about us" survey. Every extra field measurably
  lowers signup rate, and nothing here needs more than an email address to work.
- Inline success state first: on submit, the input/button pair itself morphs into a
  small checkmark + "You're subscribed" message *without* a full page navigation —
  fast, low-friction confirmation for the common case.
- The **dedicated `/newsletter/thank-you` page** is reserved for the cases that
  benefit from a full page: a direct link shared from an email campaign, or a
  double-opt-in confirmation click (recommended, given the personal/Islamic-content
  nature of this list — a confirmed list is a healthier, more trusted one).

**`/newsletter/thank-you` wireframe:**

```
Navigation
Confirmation (manuscript-divider-styled checkmark, on-brand — not a generic icon)
"You're in." + one warm line about what to expect (cadence, content type)
While You Wait — Book / Khutbahs / About cross-links
Footer
```

**Success messaging, written deliberately:**
- Inline: *"You're subscribed — thank you."*
- Page: *"You're in. You'll hear from us when there's something worth sharing — new
  khutbahs, new writing, and news about future courses."* This line does real work:
  it sets a *cadence* expectation (not "every day") and previews exactly the content
  types this plan is built around, turning a first-time subscriber into someone who
  now has a concrete reason to return (see the User Journey below).
- Error state (invalid email, already subscribed): calm, specific, never alarmist —
  *"That doesn't look like a valid email — mind checking it?"* / *"You're already on
  the list — thank you!"* (the second one framed warmly, not as a rejection).

---

## 13. Animations

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
