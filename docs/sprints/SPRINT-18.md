# Sprint 18 — Real Khutbah Integration

Follows Sprint 17's portrait integration. A content-integration sprint,
explicitly not another design pass: the homepage editorial design is
treated as frozen (Hero, About, Teaching Areas, Featured Book, Future
Courses, Ask Ahmad, Newsletter, header, footer, typography/spacing/colour
systems all untouched), and only the Latest Khutbah section's placeholder
content is replaced with two genuine, verified khutbah recordings supplied
by the client.

## Metadata verification

Both YouTube URLs were inspected directly before any code changed, using
YouTube's own oEmbed API and the watch page's own server-rendered
structured data (not scraped guesswork):

| | `sA6wi43Jj9A` | `mEuDvsEGHhg` |
|---|---|---|
| Title (verbatim wording) | DOMESTIC VIOLENCE : In Light of the Qur'an and Sunnah | Parental Conflicts : IMPACT ON CHILD MENTAL HEALTH |
| Channel | Masjid Al-Noor (`@MasjidAlNoorOfficial`) | Masjid Al-Noor (`@MasjidAlNoorOfficial`) |
| Publish date | 2024-10-21 | 2024-09-28 |
| Duration | 1223s (20:23) | 1115s (18:35) |
| Thumbnail | `i.ytimg.com/vi/sA6wi43Jj9A/maxresdefault.jpg` (1280×720, real) | `i.ytimg.com/vi/mEuDvsEGHhg/maxresdefault.jpg` (1280×720, real) |
| Description | empty | empty |

Only letter-casing was normalised for display (the channel's shouted-caps
style → sentence case, matching this site's own typesetting) — no word
added, removed, or reordered. Both videos' own descriptions are empty, so
`excerpt` uses the same minimal, factual line for both rather than
inventing a thematic summary neither Ahmad nor the mosque supplied:
"A Jumu'ah khutbah delivered at Masjid Al-Noor, East London."

## Existing architecture reused, not replaced

`src/lib/data/lectures.ts`'s `Lecture` type already had everything needed
(`youtubeId`, `publishedAt`, `durationMinutes`, `coverImageUrl` from
`ContentBase`) — no new field, no new abstraction, no CMS/database model
was introduced. The two real khutbahs replaced the one fictional "Weight
of Gratitude" placeholder that previously occupied the "Weekly Khutbah"
category slot.

**Remaining `LECTURES` entries audited and classified:**
- 2 entries: real, verified, published (`status: "published"`, real
  `youtubeId`) — the two khutbahs above.
- 3 entries ("The Names of Allah, Applied," "The Seerah in Times of
  Crisis," "Raising Believing Children"): intentional unpublished
  placeholders (`status: "coming-soon"`, no `youtubeId`) — real future
  talks Ahmad has planned, not fake/demo content. They live under
  categories other than "Weekly Khutbah" (`Lecture`, `Conference Talk`,
  `Seminar`), so `LatestKhutbahSection`'s category filter already excludes
  them from ever surfacing — and no public route lists the full catalog
  either, so nothing here was ever at risk of appearing as if it had a
  real recording. Left in place; the file's own top comment now
  explicitly distinguishes the two categories so this isn't ambiguous to
  a future reader.
- 0 fake/demo entries requiring quarantine.

`VideoThumbnail` was extended (not duplicated) to accept an optional
`thumbnailUrl` + `size` — real image + play affordance when supplied,
the original placeholder facade when not, so a future lecture without a
recording yet still gets the same honest "not available" treatment. A new
`KhutbahEntry` component composes this one thumbnail primitive with
section-specific typography (no badge, no excerpt shown) for the
primary/secondary editorial pairing; `VideoCard` (badge+excerpt card,
unused by any live route today) was left in place and also updated to
pass `coverImageUrl` through, so it stays correct if a future
`/khutbahs`-style listing page ever reuses it.

## Primary vs secondary

Selection is genuine chronology, not array or URL order:
`getAllLectures().filter(category === "Weekly Khutbah" && youtubeId).sort
by publishedAt desc`. The Domestic Violence khutbah (2024-10-21) is
newer than Parental Conflicts (2024-09-28), so it received primary
prominence despite being the *second* URL supplied — confirms the
selection logic is date-driven, not incidentally tied to input order.

## Visual composition

- **Primary** (Domestic Violence): large 16:9 real thumbnail, gold
  circular play affordance, small navy duration badge on the image
  corner, title in Newsreader below, then a small mono/tracked metadata
  line ("MASJID AL-NOOR · OCT 2024 · 20 MIN") — the same archival-label
  typographic idiom already established elsewhere on the site (About's
  marginal index).
- **Secondary** (Parental Conflicts): a small horizontal row — a
  much smaller thumbnail beside the title and the same metadata line at
  a smaller scale, no image-corner badge. The layout *shape* differs from
  primary (vertical feature vs. horizontal row), not just the size, so
  hierarchy reads immediately without needing "Featured"/"Latest" labels.
- No YouTube-red, no rounded pill badges, no gradient overlays. Both
  photographs' own cream/white backgrounds and navy/geometric-star mosque
  backdrop sit naturally inside the existing ivory/navy/gold palette with
  no colour grading applied.

## Thumbnail/embed strategy

Reused `VideoCard`'s existing click-to-play pattern exactly (thumbnail
until clicked → a single lazy `<iframe>` with `?autoplay=1`, triggered
only by the click itself, never on page load) rather than opening YouTube
externally or introducing a new video-player dependency. This keeps the
in-page watching experience the architecture already supported, stays
lightweight (no iframe exists in the DOM until a user asks for one), and
required no new library.

## What had to change outside the khutbah section

`next.config.ts`'s `images.remotePatterns` gained one entry —
`{ protocol: "https", hostname: "i.ytimg.com" }` — because `next/image`
refuses to optimise a remote host that isn't explicitly allow-listed.
HTTPS-only, a single exact hostname, no wildcard; the existing
`formats: ["image/avif", "image/webp"]` config is untouched. This is the
only change outside `featured-lectures-section.tsx`/`khutbah-entry.tsx`/
`video-thumbnail.tsx`/`video-card.tsx`/`lectures.ts`, and it's additive
only — nothing else that already loaded images was affected (confirmed by
the production build still generating every route, including `/courses`,
which doesn't touch this config at all).

## Mobile treatment

Verified at ~390px, ~768px, ~1024px (the exact breakpoint the grid
switches at), and ~1385–1568px. Below `lg` (1024px), primary and
secondary stack vertically — primary remains full-width and clearly
dominant, secondary keeps its smaller horizontal-row shape (not simply a
scaled-down copy of primary), so it never reads as "an accidental
leftover card." Titles wrap cleanly at both sizes tested. Tap targets are
generous (the entire thumbnail area is the button). At and above `lg`,
the two-column asymmetric grid activates cleanly with no cramping.

## Accessibility

- Each play button's `aria-label` is `"Play {exact title}"` — verified
  directly via `getComputedStyle`/`.focus()` in-browser, not assumed:
  both buttons resolve a real, distinct accessible name and a visible
  1px gold-tinted focus outline (`outline-style: auto`, inherited from
  the sitewide `outline-ring/50` baseline already used everywhere else on
  the site — no new focus-visible rule was needed).
- The real thumbnail `<Image>` uses `alt=""` — deliberately decorative,
  since the enclosing button already supplies the full accessible name;
  a second, verbose description would be redundant, not more accessible.
- Buttons are plain, non-`tabindex`-modified `<button>` elements, so they
  sit in natural tab order and respond to both Enter and Space.
- No autoplay on page load — verified live (thumbnail-only state renders
  first; clicking the primary thumbnail loaded the real 20:24 YouTube
  player only after the click).
- Hover scale transforms on the play button inherit the sitewide
  `prefers-reduced-motion: reduce` override in `globals.css` (forces all
  transition durations to ~0) — no new motion was introduced.
- "Watch more on YouTube" keeps the sitewide external-link convention
  (`target="_blank" rel="noopener noreferrer"`, no added visual/text
  affordance) — verified it resolves to the real, live Masjid Al-Noor
  channel (2.34k subscribers, 218 videos).

## Performance

- Hero portrait (Sprint 17) remains the only `priority`-loaded major
  image; both khutbah thumbnails have no `priority`, confirmed lazy —
  network requests for the two `i.ytimg.com` thumbnails only fired once
  scrolled near the section, not on initial page load.
- `next/image` responsive negotiation confirmed live: the primary
  thumbnail requested at `w=1080`, the secondary at `w=384` — genuinely
  different resolutions per its real rendered size, not one fixed size
  serving both.
- No iframe exists in the DOM for either video until its thumbnail is
  clicked — zero heavyweight embeds load automatically.
- The real thumbnails are hotlinked from `i.ytimg.com`, not downloaded
  into the repository — the standard way to display a YouTube thumbnail,
  and consistent with not duplicating an asset that isn't the client's
  own commissioned photography (unlike the portrait in Sprint 17, which
  is preserved as a source asset for exactly that reason).

## Real-content visual review

No design defects were exposed by the real thumbnails. Both were shot in
the same well-lit, neutral setting (Masjid Al-Noor, a geometric star
wood-screen backdrop that happens to echo the site's own manuscript
texture motif); no embedded text/graphics beyond the channel's own small
logo watermark (top-right, part of the source image, not something this
project added); face positioning, contrast, and colour all sit
comfortably against the ivory/navy palette with no grading needed. Titles
of both lengths wrap without orphans at every width tested.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean.
- `npx vitest run` — 35/35 passing.
- `npm run build` — all 34 routes generated successfully, including
  `/courses` (unaffected — no shared component it depends on was
  touched).
- Live-browser check at ~390px, ~768px, ~1024px, ~1385px, and ~1568px:
  composition, click-to-play, keyboard focus (`.focus()` + computed
  style inspection), and the external YouTube link all verified working.
- Console/network check: no errors, all `_next/image` and embed requests
  `200`.

## Design freeze

The homepage can be formally marked **DESIGN FROZEN — CONTENT-DRIVEN
CHANGES ONLY**. This sprint replaced real content inside an existing,
already-approved architecture without altering hero, typography, colour,
section order, or any decorative motif — exactly the kind of change the
freeze is meant to keep permitting. See `docs/PROJECT_MEMORY.md` and
`docs/ROADMAP.md` for the durable record of what "design frozen" allows
and doesn't.

---

## Correction — Three-Khutbah Editorial Layout

With two real khutbahs, the 1-primary + 1-secondary layout above left a
large empty area beside the lone secondary entry — a genuine, in-browser-
confirmed composition problem, not a subjective preference. A third real
khutbah was added and the composition was corrected to 1 primary + 2
secondary, all under the same content-driven-correction allowance the
design freeze grants — no other homepage section was touched.

**Third video verified** (same method: oEmbed + the watch page's own
structured data):

| | `du8JPMOcgBQ` |
|---|---|
| Title (YouTube's exact text) | Lessons from the Prophet's Farewell Sermon Part 2 \| Ustadh Ahmad Mohamed Kassa |
| Channel | Masjid Al-Noor (`@MasjidAlNoorOfficial`) |
| Publish date | 2023-07-21 |
| Duration | 1727s (28:47) |
| Thumbnail | `i.ytimg.com/vi/du8JPMOcgBQ/maxresdefault.jpg` (1280×720, real) |
| Description | Real, but a donation-appeal paragraph mentioning "Ustadh Ahmad Mohamed Kassa," not a clean summary — not reproduced (see below) |

Two deliberate deviations from a literal verbatim reproduction, both
documented in `lectures.ts`'s own top comment:
- **The " | Ustadh Ahmad Mohamed Kassa" suffix was dropped from the
  displayed title.** It's the channel's own appended byline, not part of
  the talk's actual title, and this site has an explicit, established
  rule never to refer to him as "Ustadh" (`docs/BRAND_USAGE.md`). His name
  and the Masjid Al-Noor source are already established elsewhere on the
  page without it.
- **The real YouTube description exists but wasn't used.** It's a
  donation-appeal paragraph ("Extend your hand in support... Sadaqah..."),
  not a clean "about this khutbah" summary, and also uses "Ustadh." All
  three khutbahs share the same minimal factual excerpt instead, so the
  data model stays consistent rather than arbitrarily quoting one source
  and not the others.

**Chronological order of all three** (newest → oldest): Domestic Violence
(2024-10-21) → Parental Conflicts (2024-09-28) → Farewell Sermon Part 2
(2023-07-21). Strict recency produced the correct-feeling result without
needing an editorial override: the oldest video — which also happens to
have a channel-designed text-graphic thumbnail ("JUMU'AH KHUTBAH" in gold
on a teal panel, visually different in register from the other two clean
photographic thumbnails) — naturally lands in the least prominent slot
(bottom of the secondary column), rather than needing to be manually
demoted.

**Thumbnail note:** YouTube's own low-res auto-frame candidates
(`1.jpg`/`2.jpg`/`3.jpg`, one of which — frame 2 — is a clean photographic
shot matching the other two videos' register) were checked as an
alternative to the channel's designed thumbnail, but all three are only
120×90 — far too low-resolution to use at any size in this layout. The
real `maxresdefault` (the channel's own designed thumbnail) was used
unmodified, per "do not heavily edit source thumbnails" — its different
visual style from the other two is an honest fact about the real content,
not a defect to paper over.

**Layout change** (`featured-lectures-section.tsx`, `khutbah-entry.tsx`
untouched): the primary/secondary grid ratio changed from
`lg:grid-cols-[1.3fr_1fr]` to `lg:grid-cols-[1.6fr_1fr]` (~62%/38%,
matching "primary approximately 60–65%"). The secondary column now maps
over up to two entries (`.slice(1, 3)` after the primary — a deliberate
cap, "a small curated selection," not an ever-growing feed) in a
`flex flex-col justify-between` column that stretches to match the grid
row's height (grid's own default `align-items: stretch`, no explicit
height needed) — closing the previous dead space by distributing the two
entries across the primary's full height rather than leaving them
clustered at the top. A hairline `border-t border-stone-200` divider
between the two secondary entries (mirroring Teaching Areas' and About's
own established index-row convention) reinforces "editorial sidebar," not
"two miniature cards."

**Bottom action reworded and repositioned.** "Watch more on YouTube"
(centred, `variant="outline"`, its own large gap below the media) became
"More khutbahs on YouTube →" (`variant="link"` — the system's own
documented but previously-unused "Text" button role, `docs/
DESIGN_SYSTEM.md` Section 6: transparent, underline-on-hover, exactly the
"Read more →" card-footer role already specified there), left-aligned
directly under the media grid instead of centred beneath a large gap.
This reads as a natural continuation of the composition rather than a
CTA floating in empty space, and accurately describes the real
destination (the full Masjid Al-Noor channel, not an Ahmad-only
playlist).

**Spacing.** The gap between the media grid and the bottom action
tightened from a centred `mt-10` to a left-aligned `mt-8` immediately
following the grid — closing the "disconnected" feeling without making
the section dense; the heading-to-media gap and the section's own
top/bottom padding were left untouched (already correct).

**Browser review confirmed:** the right column now reads as intentional
(no dead quadrant — the two-entry column's height closely matches the
primary's), primary/secondary hierarchy is immediately obvious from
composition alone (no labels added), the section doesn't compete with
Featured Book (different composition entirely — cover-dominant vs.
video-grid), all three real title lengths wrap cleanly, mobile shows an
intentional primary → compact-row → compact-row sequence (not three
stacked cards — secondary rows keep their horizontal shape at every
width), and the bottom link now reads as connected to the composition.

**Verification (this correction):** `tsc --noEmit`, `eslint --max-
warnings=0`, `vitest` (35/35), and `next build` (34/34 routes) all passed
cleanly. Live-browser re-check at ~390px, ~768px, ~1024px, and ~1568px;
click-to-play re-verified on both the primary and the smallest secondary
thumbnail (the third video's embed loads correctly even at the reduced
size); no console errors; no failed thumbnail requests.

The homepage remains **DESIGN FROZEN — CONTENT-DRIVEN CHANGES ONLY** —
this was exactly that: a content-driven layout correction inside Latest
Khutbah, not a reopening of any other section.
