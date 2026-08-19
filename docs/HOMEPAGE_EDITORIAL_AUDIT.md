# Homepage Editorial Audit — Editorial Refinement 1

**Status: observation and critique only. No code was changed to produce this
document. Nothing in it has been implemented.** Written against the homepage as
it actually renders today (Sprint 11's redesign, verified live in-browser during
this audit), cross-checked against `docs/CREATIVE_DIRECTION.md`,
`docs/DESIGN_SYSTEM.md`, `docs/BRAND_USAGE.md`, `docs/UX_ARCHITECTURE.md`,
`docs/PROJECT_MEMORY.md`, and `docs/ROADMAP.md`. Every claim below is about what
is currently rendered — not an imagined or aspirational version of the site.

---

## Why this homepage is roughly a 9/10, not a 9.7–10/10

The honest short answer: **the system is correct and the execution is safe.**
Every individual decision — the palette, the type pairing, the section anatomy,
the mark's frozen geometry — is exactly what the design system prescribes. What's
missing is *tension*. Nothing on this page currently risks anything. The hero is
a centred, evenly-split two-column layout — a pattern used by thousands of
marketing sites. The Teaching Areas section is a five-up icon-grid — the single
most recognisable SaaS-marketing-template convention there is, the exact thing
`docs/CREATIVE_DIRECTION.md` names as something to avoid. The About section's
only real visual event is a placeholder monogram. The section-tone rhythm runs
four and five same-toned sections in a row before a navy break, when the system's
own layout philosophy calls for varied rhythm. None of these are implementation
bugs — the code does exactly what it was asked to do. They are *composition*
decisions that were made safely rather than distinctively, which is precisely
the gap between "correct" and "bespoke."

---

## 1. Hero Audit

### Composition

The hero is a `grid-cols-[1.05fr_0.95fr]` two-column split: emblem left, copy
right, vertically centred, at every desktop breakpoint. `docs/DESIGN_SYSTEM.md`
Section 5 states explicitly: *"a slightly asymmetric ratio reads as composed, an
even split reads as a template default"* — 1.05fr/0.95fr **is**, for any
practical visual purpose, an even split. The system's own stated rule is not
being followed by its own hero. This is the single most fixable, most citable
finding in this entire audit.

The emblem itself sits inside an `aspect-square w-full max-w-md` box (448px
cap), with the actual glow occupying 65% of that box and the mark occupying 46%
of the box's height. On a 1440–1568px viewport this renders as a modest ~400px
circle holding a mark that reads, at a glance, roughly 180–200px tall — small
enough that a first-time visitor's eye lands on the eyebrow/headline first and
the emblem second, which is backwards from what "the emblem should remain the
primary visual anchor" (per `docs/CREATIVE_DIRECTION.md` Section 12 and this
project's own Hero Mode A rationale) is supposed to achieve. The composition
does not feel *built around* the emblem — it feels like a well-produced circular
badge placed in the left half of a conventional two-column hero. The two
concentric hairline rings and radial glow are tasteful in isolation, but because
the whole assembly sits inside so much surrounding ivory whitespace (the `max-w-
md` box floats in a much wider grid column), the "seal" reads more delicate than
monumental — the visual opposite of "architectural anchor."

There is close to zero visual tension anywhere in this composition. Everything
is centred, evenly weighted, and predictable: symmetric circle, centred rings,
right-aligned text block vertically centred against it. A visitor's eye has
nowhere surprising to travel.

### Typography

The headline is two lines — "Ahmad" (Newsreader Regular, ink) directly above
"*Mohamed Kassa*" (Newsreader italic, gold) — with enough line-height between
them that they read less like one flowing name and more like a form field:
*Given name* / *Family name*, stacked. A name is strongest as one continuous
typographic gesture; splitting first and surname onto two full-height lines,
each nearly the same visual weight, produces an oddly bureaucratic rhythm for
what should be the single most confident line on the site.

The eyebrow reads "ISLAMIC TEACHER · AUTHOR · KHATEEB" — correct in spirit but
not the exact order given in this sprint's locked identity copy ("Author •
Teacher • Khateeb"). Small, but worth reconciling before Editorial Refinement 2
locks the copy for real.

Below the headline: a mission sentence (Manrope, `body-large`), then a second,
smaller trust line ("Khateeb, Masjid Al-Noor · Teaching since 2009 · Arabic &
Islamic Studies"), then two CTAs. That is eyebrow → H1 (two lines) → paragraph →
second paragraph-like line → two buttons: five distinct text/action blocks
stacked vertically, each competing for the same "first three seconds" attention
`docs/DESIGN_SYSTEM.md`'s own emotional goal names. The system's Section 12
"Feature sections" anatomy is explicitly *eyebrow → heading → supporting copy →
single CTA* — the hero currently runs two supporting-copy blocks and two CTAs,
more elements than the system's own template for a section allows itself.
Nothing here is wrong information to have on the page — trust-building context
matters — but a hero benefits from restraint the way no other section does; this
one is trying to do a hero's job and an About-preview's job at once.

Regarding the approved identity copy ("Arabic & Islamic Studies" /
"Author • Teacher • Khateeb"): it currently appears **twice**, in two different
forms, within the first viewport — once as the eyebrow, once folded into the
trust line below the CTAs ("Khateeb, Masjid Al-Noor · Teaching since 2009 ·
Arabic & Islamic Studies"). That's a repetition the visitor absorbs within one
screen's worth of scrolling, which reads as uncertainty about which line is the
"real" identity statement rather than confidence in one.

### Visual weight

- Emblem: currently under-weighted relative to the amount of space around it —
  not "too dominant," the opposite problem.
- Text: the two-line stacked name plus two paragraphs plus two buttons adds up
  to more visual mass than the emblem side of the composition, which further
  tips the "built around the emblem" intent toward "emblem beside content."
- Glow/rings: tasteful, not intrusive. Correctly restrained.
- Watermark: not present in the hero (correctly reserved for navy sections per
  policy) — no issue here.
- `.manuscript-texture` (radial glow + faint geometric tile) on the hero
  background: essentially invisible at normal viewing distance against the
  paper-50 background — present in the DOM, not really perceptible in the
  render. Not a problem, but also not doing much work; it's a texture that
  exists more because the system defines one than because this specific hero
  needs it.
- Whitespace: generous, arguably to a fault given how much of it surrounds the
  emblem specifically (see Composition above).

### CTA hierarchy

Correct as specified: gold "Explore Books" primary, outline "Ask Ahmad"
secondary. This matches the brief exactly — Newsletter and Courses correctly
appear later in the page flow rather than competing in the hero, and Articles
correctly has no homepage CTA at all. No change needed here; this is one part of
the hero that is already right.

---

## 2. Three Hero Directions

All three reuse only what already exists in the codebase and design system — no
new imagery, no new colour, no new type family, no new motion primitive beyond
what `src/constants/motion.ts` and `ScrollReveal` already provide.

### Direction A — Editorial Split (recommended)

**Layout.** Keep the two-column idea, but make the ratio genuinely asymmetric
(e.g. `1.3fr` text / `0.7fr` emblem, or invert which side is wider depending on
which reads better with real content) and break the vertical-centre default —
align the text block to the top of the column and let the emblem's optical
centre sit slightly lower, so the two halves relate rather than mirror.
**Hierarchy.** One headline treatment, not two paragraphs of supporting copy:
eyebrow → a single-line-broken headline ("Ahmad Mohamed Kassa" set with a
deliberate, considered line break — not first-name/last-name split into two
full lines) → one line of positioning copy → two CTAs. The trust line
("Khateeb, Masjid Al-Noor · Teaching since 2009...") either merges into the
eyebrow or moves out of the hero entirely into the About Preview section
immediately below it, where it isn't competing with the headline.
**Emblem treatment.** Same `HeroEmblem` seal, but scaled up materially — closer
to filling its column's real available width rather than being capped at
`max-w-md` inside a wider column — so it reads as architecturally load-bearing,
not decorative.
**CTA structure.** Unchanged — gold primary, outline secondary.
**Watermark/texture.** Keep `.manuscript-texture` at current intensity; it's
correctly subtle.
**Mode B integration.** `HeroPortrait` already occupies the identical aspect
box — no change required; a real portrait would only need the column ratio
this direction already establishes.
**Mobile.** Stacks with the (now larger) emblem first, full-width; single-line-
broken headline; both CTAs full-width, stacked.
**Benefits.** Lowest engineering risk (mostly ratio, sizing, and copy-editing
changes to existing components), most directly fixes the "even split reads as
template default" violation the system already flags.
**Risks.** A larger emblem needs care not to overpower the seal treatment's
delicacy — test at a few intermediate sizes rather than jumping straight to
full-column width.
**Why it feels premium.** It's the version of the current hero with the fat
trimmed off and the asymmetry the system already asks for actually applied —
premium here comes from editing, not reinvention.
**Scores (/10):** editorial 8, warmth 7, longevity 9, luxury 7, accessibility 9,
future-portrait compatibility 9.

### Direction B — Emblem Monument

**Layout.** The mark becomes the compositional centre of the entire hero, full-
bleed vertically, with the eyebrow above and a short single-line headline below
it, both centred beneath the emblem rather than beside it — closer to how a
publisher's colophon or a seal-of-approval anchors a title page.
**Hierarchy.** Eyebrow → large centred emblem (no column split at all) →
headline (single line, both names together, no stacking) → one short line of
copy → CTAs, all centred, all on one vertical axis.
**Emblem treatment.** Significantly larger than today, likely the single
largest element on the page — the "seal" becomes genuinely monumental rather
than a badge.
**CTA structure.** Centred, side-by-side, same variants as today.
**Watermark/texture.** The existing radial glow already reads better in a
centred, larger composition than a small offset one — this direction actually
makes better use of the current texture treatment than the split layout does.
**Mode B integration.** Requires the most rework of the three — `HeroPortrait`
inside a circular medallion frame would need new bounding logic distinct from
`HeroEmblem`'s current square-aspect box, since a centred monument composition
and a side-column portrait composition are structurally different layouts, not
a one-line constant swap. This is the one direction that would cost a real
layout change when photography eventually arrives.
**Mobile.** Naturally mobile-first already (a centred single column is exactly
what every hero collapses to under 1024px) — the strongest mobile story of the
three.
**Benefits.** The most literal, most confident execution of "the mark is not an
illustration, it is the core visual language of the brand" — nothing competes
with it.
**Risks.** Text becomes secondary to an image in the single moment (the hero)
where the visitor most needs to understand *who this is and why it matters* —
risks feeling more like a brand mark splash screen than an introduction to a
person. Also the direction most likely to feel over-designed if the emblem is
sized too aggressively.
**Why it feels premium.** Restraint through singularity — one large, confident
gesture instead of several medium ones.
**Scores (/10):** editorial 8, warmth 5, longevity 8, luxury 9, accessibility
8, future-portrait compatibility 5.

### Direction C — Publication Cover

**Layout.** Treat the hero as the opening spread of a book: a large left margin
of pure typography (no visual element at all in that margin), the emblem
appearing small and precise — closer to a printer's colophon mark — bottom-
corner or inline with the byline, not centre-stage.
**Hierarchy.** A large, editorial masthead-style headline leads (closer to a
magazine cover line than a marketing H1), a short standfirst/deck paragraph
beneath it in the `body-large` style, byline-style attribution ("Ahmad Mohamed
Kassa — Islamic Teacher, Author, Khateeb") set small beneath that, small emblem
mark beside the byline, CTAs set as understated text-links or a single quiet
button rather than a prominent gold block.
**Emblem treatment.** Deliberately small and precise — a colophon, not a hero
image. This is the one direction where the emblem's *smallness* is the correct,
intentional choice rather than an accidental under-weighting.
**CTA structure.** Would need to shift the primary CTA away from a large gold
button toward something quieter (an underlined text link, per the "Text"
button role in `docs/DESIGN_SYSTEM.md` Section 6) — a genuine departure from
this project's current CTA convention, worth flagging as the one place this
direction asks the design system itself to stretch.
**Watermark/texture.** Would suit a very faint full-bleed geometric-tile
texture across the whole hero rather than a localised glow — closer to a
book's endpaper pattern.
**Mode B integration.** Simple — a portrait would sit exactly where the small
emblem sits today, at the same small scale, functioning as a byline photo
rather than a hero image; genuinely easy to swap.
**Mobile.** Requires real editorial discipline to keep the masthead-scale
headline legible without overwhelming a small viewport — the riskiest of the
three on mobile specifically.
**Benefits.** The most genuinely *editorial* (as opposed to "editorial-
adjacent-marketing") of the three — closest to what `docs/CREATIVE_DIRECTION.md`
names as the luxury-publishing reference point.
**Risks.** The biggest departure from what a "hero" currently means on this
site — CTA de-emphasis is a real content-strategy risk if Book/Ask-Ahmad
conversion matters more than editorial atmosphere at this stage of the
platform's life. Highest implementation risk of the three, and the one most
likely to need a second design pass before shipping.
**Why it feels premium.** Typography-as-image, exactly the "a well-set page of
type, with nothing else on it, can be the most premium thing on the site"
principle from `docs/CREATIVE_DIRECTION.md` Section 4.
**Scores (/10):** editorial 10, warmth 6, longevity 9, luxury 8, accessibility
7, future-portrait compatibility 8.

### Recommendation

**Direction A — Editorial Split.** It fixes the one concrete, citable violation
of the system's own stated rule (the even-split composition), requires the
least structural risk to the Mode A/B swap mechanism the project has already
invested in, and improves the hero without asking the CTA/conversion strategy
to change. Direction C is the most editorially ambitious and worth a genuine
second look once real photography exists and the CTA question can be revisited
deliberately — it shouldn't be discarded, just sequenced later. Direction B is
the highest-risk, most singular bet; strong as a concept, but the Mode B
rework cost and the "text becomes secondary" risk make it a harder sell for
this stage of the project.

---

## 3. Header & Logo Lockup Audit

**Desktop.** The mark renders at a genuinely small size (24×34 intrinsic,
`h-8`/32px container) beside the wordmark. Two concrete findings:

1. **The header currently reads "Ahmad Kassa," not "Ahmad Mohamed Kassa."**
   This is a direct contradiction of this sprint's own instruction ("the full
   name should remain the primary identity... do not shorten it unless there
   is a compelling UX reason") and of `docs/BRAND_USAGE.md`'s explicit
   guidance. There is no compelling UX reason visible in the current
   implementation — the header has real horizontal room at every desktop
   width tested. This is the single highest-confidence, most concrete finding
   in this entire audit.
2. **Optical alignment is imprecise.** The mark's visual weight (thin,
   delicate calligraphic strokes) sits noticeably lighter than the wordmark's
   bold serif next to it, and the mark's own visual "centre of gravity" (the
   teardrop's widest point) sits above the wordmark's cap-height rather than
   aligned to it. The two elements currently read as *a small icon next to a
   text logo*, not as one integrated lockup — closer to a favicon bolted onto
   a wordmark than a considered digital lockup.

**Mobile.** The same lockup scales down proportionally with no independent
mobile tuning — at the smallest widths this makes the already-small mark even
less legible as a distinct shape, while the wordmark (already shortened) stays
perfectly readable. The imbalance gets worse, not better, at mobile sizes.

**Recommendation.** The digital-lockup policy this project already committed
to (mark image + live text, composed per-context, documented in
`public/brand/README.md`) is the right mechanism — it is simply not being used
at its intended strength yet. The strongest header treatment is: **official
emblem, scaled and vertically tuned so its visual weight reads as intentional
next to the wordmark (larger than today, or paired with a heavier baseline
alignment), full name "Ahmad Mohamed Kassa," using the site's live Newsreader
type** — not the supplied full lockup file (correctly not shipped, per the
frozen-mark/no-flattened-lockup policy), and not the current shortened form.
This is squarely Editorial Refinement 2's job (typography & hero, header
lockup named explicitly in the roadmap) — **not implemented here.**

---

## 4. Logo as Brand Language — Placement Audit

| Placement | Verdict | Why |
|---|---|---|
| Header | **Works, but underpowered** | Present and correct in concept; execution (size, alignment, shortened name) undercuts it — see Section 3. |
| Hero (seal) | **Works, underpowered** | Correct concept (Mode A anchor), too small relative to its surrounding space — see Section 1. |
| Loading screen | **Works well** | A small, quiet, breathing mark is exactly the right register for a loading state — restrained, on-brand, not attention-seeking. Keep as-is. |
| Section divider (`mark` prop) | **Works well, correctly rare** | Used once on the homepage (before the Ask Ahmad CTA) — exactly the "one or two genuinely significant transitions" restraint the system calls for. Keep. |
| Watermark (Quote, Newsletter) | **Works, correctly restrained** | See detailed opacity discussion below. |
| Newsletter | Same as Watermark above — the mark appears as the section's background watermark, not a second placement. |
| Footer | **Works well** | Inverted mark + full name (footer correctly uses the full name, unlike the header — worth noting this inconsistency exists *within* the current implementation, not just against policy) + tagline. The strongest single placement on the page. |
| 404 (before this sprint's fix) | **Was missing entirely** | Now present via `ManuscriptDivider`'s `mark` variant, added in the Sprint 13 checkpoint — a genuine gap that has since been closed, not part of this audit's remaining findings. |
| Book-related surfaces | **Not present** | No mark placement anywhere in `FeaturedBookSection` or the book detail page — arguably correct (the book cover is already the "product hero" per `docs/DESIGN_SYSTEM.md` Section 10, and a second mark nearby would compete with it), but worth a deliberate decision rather than an omission. |

**On the 5% watermark opacity specifically:** judged by the rendered result (not
by any prior number discussion), 5% on navy reads as intended — visible as a
"there's something here" texture on close inspection, invisible as a distraction
at normal reading distance, and does not compete with the Quote/Newsletter
section's foreground text. **No change recommended.**

**Placements to keep:** loading screen, section divider, watermark, footer.
**Placements to strengthen:** header (Section 3), hero (Section 1).
**Placements to remove:** none — nothing currently overuses the mark.
**Possible new placement, used with real restraint:** a very small mark glyph
as part of the About section's redesign (Section 7 below) — e.g. a quiet
corner mark on the portrait placeholder/frame — would give that section a
brand touchpoint it currently lacks entirely, without adding a whole new
"watermark" instance. This should be evaluated once the About redesign
direction is chosen, not assumed.

---

## 5. Homepage Narrative

Current order: **Hero → Featured Book → About Preview → Teaching Areas → Quote
→ Latest Khutbah → Future Courses → CTA (Ask Ahmad) → Newsletter → Footer.**

Mapped against the intended visitor journey:

1. *Who is Ahmad Mohamed Kassa?* — Hero (partially) + About Preview. ✅ present,
   but split oddly: the Hero's trust line already answers a slice of "who," then
   About Preview answers it again three sections later. Some redundancy (see
   Section 1).
2. *Why should I trust him?* — About Preview's credentials list. ✅ present, but
   thin — a bulleted list of five short phrases is information, not persuasion
   (see Section 7).
3. *What has he produced?* — Featured Book, positioned **second**, directly
   after the Hero. ✅ strong placement — this is correct and effective; the
   book is the platform's realest asset and it's shown early.
4. *What areas does he teach or speak about?* — Teaching Areas. ✅ present,
   correctly positioned after the reader has met the person and his work.
5. *Can I hear/watch him?* — Latest Khutbah. ✅ present, honestly framed.
6. *Can I ask a question?* — Ask Ahmad CTA. ✅ present, but positioned **after**
   Future Courses — a slightly odd sequencing, since "can I ask a question" is
   a lower-commitment, more universally relevant action than "here's a future
   academy," and arguably deserves to sit closer to where trust has just been
   established (nearer About/Teaching Areas) rather than after two
   forward-looking sections in a row (Khutbah "coming soon," Courses "coming
   soon").
7. *What is coming in the future?* — Future Courses. ✅ present.
8. *How do I stay connected?* — Newsletter, Footer. ✅ present, correctly last.

**One real structural observation:** Quote sits between About Preview and
Teaching Areas — a navy pull-quote interstitial with no narrative function
beyond rhythm-breaking (which it does do well, see Section 14). It is not part
of the numbered journey above at all; it is pure atmosphere. That's a legitimate
role for one section to play, but it does mean two of this page's three "coming
soon" sections (Latest Khutbah, Future Courses) sit back-to-back with only a
CTA between them and the newsletter — a run of forward-looking, not-yet-real
content immediately before the page asks for an email address. Reordering is
not obviously necessary, but the CTA and Newsletter's proximity to two
consecutive "coming soon" sections is worth being aware of as the platform's
real content grows and this balance shifts.

**Recommendation:** no reordering is strictly necessary — the story mostly
holds together — but consider moving the Ask Ahmad CTA to sit directly after
Teaching Areas (a natural "you've just seen what he teaches — have a question
about one of these?" moment) rather than after Future Courses. This is a Tier 2
change, not a rewrite of the page.

---

## 6. Featured Book Audit

Currently the strongest section on the page relative to its own goal. The cover
is shown at real size with a soft radial glow and a small rotated "Featured"
seal badge — genuinely closer to a product-launch treatment than a generic
website card. Eyebrow → title → italic excerpt → CTAs follows the system's
section anatomy correctly and reads as intentional, not templated.

What keeps it from fully landing as "a premium publication launch" rather than
"a card on a website":

- **The section still uses the same `Section` component rhythm as every other
  section** (eyebrow-heading-copy-CTA, same alternating tone background) — a
  true "flagship title" treatment on a publisher's site usually breaks its own
  page's grid slightly (a wider cover, a genuinely asymmetric column split, a
  detail the surrounding sections don't share) to signal "this one is
  different." Right now it's a well-executed instance of the same pattern
  everything else on the page uses, just with a nicer image.
- **No table-of-contents/chapter signal, no author-note excerpt, no sense of
  the book's actual substance** beyond the one-sentence hook — `docs/
  UX_ARCHITECTURE.md` already documents this as a known, deliberate gap on
  the Book Detail page itself; the homepage section inherits the same
  thinness by necessity, but a homepage teaser has more room than it's
  currently using for one additional concrete, specific detail (a chapter
  count, a page count, a single line from the author's own voice) that would
  make the book feel weightier without becoming a full product page inline.
- **The "Featured" seal is a UI badge, not a publishing convention** — real
  book marketing rarely uses a corner ribbon; it uses things like an award
  mark, a bestseller line, a category label ("New release"). Worth reviewing
  whether "Featured" (a CMS/admin term leaking into the public copy) is the
  right word for a visitor at all, versus something like "Now Available" or
  simply removing the badge and letting the cover and copy carry the weight.

**Recommendation:** keep the core anatomy, but let this specific section break
the page's shared rhythm slightly (wider image, one more concrete detail about
the book itself, reconsider the badge copy) — Tier 2, not urgent, but the
highest-leverage "make this feel less like a website and more like a launch"
opportunity outside the hero.

---

## 7. About Section Audit

This is the weakest section on the page today, and the reason is almost
entirely one thing: **`PortraitFrame` currently renders a placeholder — a navy
card with the initials "AK" in large italic type — because no real portrait
exists yet.** Two problems with this specifically:

1. It is a literal, visible "asset missing" state, dressed up but still
   legible as one. It's the single moment on the homepage that most reads as
   "unfinished website" rather than "considered design choice," precisely
   because every *other* no-photo moment on this site (the Hero) deliberately
   substitutes the emblem instead of a generic placeholder — About is the one
   section that fell back to a generic initials-avatar pattern instead of
   reusing the brand's own established "no photo yet" convention.
2. Beyond the placeholder, the surrounding content — a bio paragraph, a
   2-column bulleted credentials list, a "Read full biography" link — is
   competent but generic. It reads like the "About the founder" block on a
   thousand consultancy websites: paragraph, then facts-as-bullets. Nothing
   in the typography, composition, or structure signals "editorial profile"
   versus "company bio page."

### Three conceptual About treatments

**Treatment 1 — Emblem-anchored profile (lowest risk, ships soonest).**
Replace the initials placeholder with the emblem itself (same `HeroEmblem`-
family treatment, smaller and quieter) inside the portrait frame's slot until
real photography exists — consistent with how the Hero already handles the
same "no photo yet" situation, rather than inventing a second placeholder
convention. Pair with a large single pull-quote (in Ahmad's own words, drawn
from existing bio copy — do not manufacture a new quote) set above or beside
the credentials, breaking up the paragraph-then-bullets rhythm. Low
implementation cost, immediately fixes the placeholder problem, doesn't
require any new content.

**Treatment 2 — Asymmetric editorial spread.** Break the current even
`0.85fr/1fr` two-column split into a genuinely asymmetric composition — a
narrow left margin carrying only the eyebrow and a large pull-quote in
Newsreader italic, a wider right column carrying the bio prose, with the
credentials reduced from a bulleted list to a single restrained inline index
line (e.g. "Khateeb, Masjid Al-Noor — Teaching since 2009 — Arabic & Islamic
Studies — Author, *The Great Debate*" set as one typographic line, not five
bullet points). Closest to a magazine-profile layout. Medium implementation
cost — mostly layout/typography, no new content required, but a genuine
composition change.

**Treatment 3 — Restrained timeline module.** Keep the two-column portrait+
text structure, but replace the flat bulleted credentials list with a
compact, minimal vertical index (year or era markers, one line each, no
description text — closer to a colophon's printing history than the current
8-step numbered timeline already documented as "more literal than the
'restrained' brief called for" on the full About page in `docs/
UX_ARCHITECTURE.md` Section 10). This treatment intentionally keeps the
homepage's About Preview *simpler* than the full `/about` page, using
restraint as the differentiator between the teaser and the full biography
rather than trying to out-detail it.

No new facts are proposed in any of the three — Arabic & Islamic Studies,
author, teacher, khateeb, community involvement, academic background, and
Ruqyah work since 2009 are all already documented and simply need a stronger
container, not new material.

**Recommendation for Editorial Refinement 3 to evaluate:** Treatment 1 first
(cheapest, fixes the most visible problem immediately), with Treatment 2 as
the fuller ambition once a real portrait exists and there's a natural reason
to revisit this section's layout anyway.

---

## 8. Teaching Areas / Premium Cards Audit

The current section is a five-up grid: circular icon-in-a-circle, heading,
description, repeated five times, `sm:grid-cols-2 lg:grid-cols-5`. This is,
structurally, a textbook SaaS "features grid" — icon, title, one-line
description, arranged in a uniform row — the single most recognisable
marketing-template convention there is, and the exact pattern `docs/
CREATIVE_DIRECTION.md` Section 5 names directly as something this brand
explicitly does not borrow from ("Startup / SaaS... bento-grid feature
sections"). The content underneath it is genuinely good (real taxonomy shared
with Ask Ahmad's categories, well-written one-line descriptions) — the
container is doing the content a disservice.

**What currently makes it feel generic, specifically:**
- Icon-in-a-filled-circle is the exact visual grammar of a SaaS pricing/
  features page.
- Five equal-weight cards in a perfectly even row reinforces "these are
  interchangeable feature bullets," when in reality some of these subjects
  (Aqeedah, Fiqh) likely carry more weight in Ahmad's actual body of work than
  others — the grid currently can't express that.
- The cards use the same white/bordered card surface convention as every
  other card-shaped thing on the site, with no differentiation for "this is a
  taxonomy, not a product feature list."

**Recommended direction: drop the card metaphor entirely.** A numbered or
unnumbered editorial index — five short entries set as a horizontal or
vertical typographic list (large Newsreader label, small Manrope description,
separated by thin hairline rules rather than card borders, no icons or a
single very small restrained icon at most) — would read as a table of
contents for "what Ahmad teaches," which is a much stronger metaphor for this
specific content than a features grid. This also removes the icon-in-circle
convention from the page entirely, which is the single most SaaS-coded visual
element currently on the homepage.

If some visual marker beyond typography is wanted, a small numeral (01–05, in
the mono/eyebrow style already used elsewhere) reads as archival/editorial in
a way a filled icon circle does not — but only if the numbering communicates
real information (sequence, not just decoration); here it would just be an
index marker, which is a legitimate, restrained use.

**This is a Tier 1 recommendation** — of everything in this audit, replacing
the icon-grid card pattern is one of the highest-leverage single changes
available, because it's the most direct, nameable instance of "this looks
like a website with feature cards" rather than "this looks like a considered
editorial index."

---

## 9. Latest Khutbah Audit

This section already does the hardest thing correctly: it is honest. The large
navy video-placeholder card with a centred play affordance and a real duration
badge ("22m") communicates "there is a real, specific thing here, it just isn't
uploaded yet" — very different from, and much better than, a vague "coming
soon" banner. It earns its space.

**Recommendations:**
- **When real recordings connect:** the section should evolve from single-
  spotlight to something closer to a media feature — the current single-card
  layout scales fine to "one real video" but the section's whole framing
  ("Latest khutbah") implies an ongoing cadence; once 3–4 real recordings
  exist, a small "more khutbahs" link (even without a full library page yet)
  would set the expectation that this becomes a recurring, growing archive
  rather than a one-off.
- **Until then:** the current honest-teaser treatment should stay exactly as
  it is. Do not dress it up further or add fake urgency — its restraint is
  the reason it currently works.
- **Framing choice:** editorial feature (its current form) is correct over
  either a plain media card (too small a treatment for the section's
  narrative role — "hear him speak" is a meaningful trust-building beat, see
  Section 5) or a dense multi-item teaser (would overstate how much content
  actually exists, undermining the honesty this section is built on).

---

## 10. Future Academy Audit

The current Future Courses section (a 4-up grid of in-development course
cards under "The academy — coming soon," plus a "View the academy" link to
`/courses`) sits in a reasonable middle ground: not exciting, not premature,
mildly sales-heavy in tone relative to the rest of the page (course cards with
"Coming soon" badges, module/lesson counts) — the most concrete, itemised,
catalogue-like content on the entire homepage, which stands out against
everything else's editorial restraint.

**Assessment:** appropriately restrained in *intent* (it doesn't oversell what
doesn't exist), but the *presentation* — four cards with module/lesson counts
— borrows more "product catalogue" visual language than anything else on the
page, which creates a small tonal seam between this section and its
neighbours.

**Recommendation:** keep it as a dedicated section (it earns its place in the
narrative — see Section 5), but consider trimming it to fewer, larger course
entries with less itemised metadata (drop the "3 modules · 12 lessons"
counts, which read as e-commerce/course-platform convention) in favour of a
shorter, more editorial description per course — visually distinguishing
"future, aspirational" content from "live, real" content through *restraint*
rather than through a badge doing all the work. This is Tier 2 — meaningful,
not urgent.

---

## 11. Ask Ahmad (Homepage CTA) Audit

The current CTA section: mark-glyph divider, "Ask Ahmad" eyebrow, "Have a
question in mind?" heading, one line of framing copy, gold "Ask a question"
primary + ghost "Join the newsletter instead" secondary. This is close to
right — the copy is warm and specific ("Aqeedah, Fiqh, or daily practice —
answered directly, in plain language") rather than support-desk language, and
pairing it with a secondary newsletter path (rather than making this section
purely transactional) keeps it from feeling like a conversion funnel.

**Minor observation:** "or daily practice" as the third example alongside
"Aqeedah, Fiqh" is slightly generic compared to the specificity of the actual
question categories the real form offers (marriage, family, ruqyah, mental
health) — a small copy tightening opportunity, not a structural one.

**Verdict:** this section is already close to the target register. No
significant redesign needed — Tier 3 polish only (copy specificity).

---

## 12. Footer Audit

Four columns: mark (inverted) + tagline + social icons | Explore | Connect |
Newsletter, then a legal row with the disabled language selector. This is a
clean, functional footer and the strongest single mark placement on the page
(see Section 4) — but it is not yet "the closing page of a premium
publication" that `docs/CREATIVE_DIRECTION.md` Section 14 and `docs/
DESIGN_SYSTEM.md` Section 12 both call for, for one specific, fixable reason:

**There is no standalone mission-statement band.** `docs/DESIGN_SYSTEM.md`
Section 12 explicitly specifies "mission statement in Newsreader above a
four-column grid" — the current footer instead folds the tagline
("Islamic scholarship for the modern seeker") inline, small, under the logo
in the first column, alongside everything else in that column. This is the
one place the actual implementation diverges from the design system's own
documented spec (already flagged during Sprint 13's documentation
reconciliation, not a new finding, but worth restating here as a design
observation, not just a documentation one) — and it's precisely the missing
element that would give the footer the "closing page of a book" weight the
brief asks for. A single line, set large in Newsreader, sitting alone above
the column grid — even using the *same* tagline text that exists today, just
given room to be a statement rather than a caption — would do most of the
work here without adding any new copy.

**Otherwise:** visual density is appropriate (not sparse, not crowded),
hierarchy is legible, navigation/legal/social/newsletter are all present
without competing, whitespace is generous without feeling empty, and the
final impression (mark, name, tagline, quiet legal row) closes the page
calmly. Do not add a pull-quote here without a real, approved quotation —
correctly avoided today, and correctly should stay avoided rather than
inventing one to fill the mission-statement gap.

**Recommendation:** add the standalone mission-statement line above the grid
— genuinely Tier 1, since it's cheap (no new content, no layout rework, just
promoting existing copy to its own typographic moment) and closes a real,
specifically-documented gap between stated system and actual footer.

---

## 13. Typography Audit

Overall, the type system itself (Newsreader/Manrope/IBM Plex Mono, the scale,
the weight discipline of "headings stay Regular, italic is the one emphasis
device") is being followed correctly almost everywhere on the page — this is
a genuine strength of the current implementation, not a weak area in general.
The specific places it slips toward "web-designed" rather than "editorially
typeset":

- **The hero headline's two-line name stack** (Section 1) is the most acute
  instance — it's the one place scale and line-break decisions read as
  incidental (however the text happened to wrap) rather than deliberate
  (a line break chosen for meaning or rhythm).
- **The Teaching Areas cards' titles** ("Aqeedah," "Fiqh," etc.) are set at a
  size and weight that reads as a UI card title (H4-equivalent) rather than
  an editorial label — part of the same "this is a features grid" problem
  named in Section 8; a typography-only fix (larger, more confident heading
  treatment) would help even before any layout change.
- **The Future Courses cards' metadata line** ("3 modules · 12 lessons") is
  set in the same register as everything else, when this is exactly the kind
  of "archival label" content `docs/DESIGN_SYSTEM.md` Section 3 says IBM Plex
  Mono exists for — currently it isn't using the mono/eyebrow treatment,
  which would visually mark it as "specification," distinct from prose,
  automatically.
- **No visually obvious orphans/widows** were found in the current headline
  or body copy at the viewport widths tested (1440/1568px) — worth re-
  checking once any hero copy changes are made, since a new line length
  could introduce one.

**Highest-impact single typography change:** resolve the hero's two-line name
stack (Section 1/2) — of everything in this section, it's the one place
where a small change (a different line-break decision, or setting the full
name on one confident line) would most immediately make the page feel
"editorially typeset" rather than "wrapped by the browser."

---

## 14. Spacing & Rhythm Audit

Section-level padding and container widths are implemented consistently with
`docs/DESIGN_SYSTEM.md` Section 4 — no arbitrary one-off spacing values were
found, and the `Section` component's `size="lg"` variant is used sparingly
(Featured Book, Teaching Areas) rather than everywhere, which is correct.

**The real rhythm problem is tonal, not spatial.** Mapping the actual section
tones top to bottom: Hero (`paper`+texture) → Featured Book (`alt`/paper-100)
→ About Preview (`paper`) → Teaching Areas (`paper`) → Quote (`navy`+texture)
→ Latest Khutbah (`alt`/paper-100) → Future Courses (`paper`) → CTA (`paper`)
→ Newsletter (`navy`+texture) → Footer (`navy`).

That's **three consecutive paper-family sections** (Featured Book → About →
Teaching Areas) before the first navy break, then **three more**
(Khutbah → Courses → CTA) before the second. `docs/CREATIVE_DIRECTION.md`
Section 9 states directly: *"avoid several visually identical sections in a
row. A visitor should never be able to predict the whole rest of the page from
its first two sections."* Right now, after the Hero, a visitor could
reasonably predict "paper, paper, paper" three times in a row — the page
currently violates its own governing layout principle, not through any single
bad section, but through the *sequence* of otherwise-correct sections.

This isn't simply "add more navy" — Quote and Newsletter are correctly the
only two navy moments (matching the "spend the accent rarely" philosophy
applied to tone, not just colour). The fix is more likely a *variation in
density and rhythm within the paper-toned run* — alternating `paper`/`alt`
more deliberately (the system already has `paper-100` available specifically
for this), or varying section height/weight more (Featured Book and Teaching
Areas already use `size="lg"`; About Preview and Future Courses currently
don't, which means two `size="lg"` sections and two default-size sections are
interleaved without an obvious pattern to why) — so that even within the
long paper stretch, a visitor feels *some* pulse rather than a flat run.

**Card gutters, text measure, content width:** all consistent with the
documented system, no issues found.

**Verdict:** not "too loose" or "too tight" in any single section — the
system's spacing values are being applied correctly. The rhythm problem is
structural (tone sequencing across sections), which is why "more whitespace"
would not fix it — this needs a sequencing/alternation decision, not a
padding adjustment.

---

## 15. Motion Audit

| Element | Classification | Notes |
|---|---|---|
| Hero stagger/fade-in (`staggerContainer`/`fadeUp`) | **Keep** | Correct implementation, respects `useReducedMotion`, appropriately restrained (600ms, `EASE_OUT`). |
| `ScrollReveal` on section entry (About, Featured Book, Teaching Areas, CTA) | **Keep** | This is exactly the "content settles into place once" principle done right — one-time, no re-trigger, consistent across sections. |
| Manuscript divider fade-in below hero | **Keep** | Subtle, purposeful, closes the hero without calling attention to itself. |
| Button hover (colour deepen) | **Keep** | Matches spec exactly. |
| Card hover (lift + shadow) | **Keep** | Matches spec; not evaluated for over-tuning, no issues found. |
| Logo hover (scale 105% + opacity) | **Refine** | A `group-hover:scale-105` on the header logo is a small but real deviation from `docs/DESIGN_SYSTEM.md`'s own stated hover language ("a same-family colour deepen... never a scale-up" — Section 6, applied there to buttons but stated as a general system preference against scale-based hover elsewhere in the same document). A subtle opacity-only change (already partially in place) would be more consistent with the rest of the system than adding a scale transform. |
| Watermark / background texture | **Keep (static)** | Correctly not animated — a moving watermark would compete with foreground content; its current static state is right. |
| Loading screen breathing pulse | **Keep** | Appropriately quiet, already respects reduced motion. |

**Suggested new micro-interactions (at most 2–3, only if genuinely additive):**
1. A very subtle underline-draw-in on the Featured Book/CTA text-style links
   (already specified in `docs/DESIGN_SYSTEM.md` Section 11 as the system's
   link-hover convention but not confirmed consistently implemented across
   every inline link on the homepage) — low risk, reinforces an existing
   documented pattern rather than inventing a new one.
2. If Teaching Areas moves away from cards (Section 8), a minimal hover state
   on the new index items (a hairline rule brightening, or the label
   shifting from ink to navy-900 with no movement) would confirm
   interactivity without reintroducing card-hover language.
No motion is recommended for the hero emblem itself, the watermark, or the
footer — these should stay exactly as static as they are today.

---

## 16. Mobile Audit

Verified directly (390×844 viewport) as part of this and the prior sprint's
work, plus reasoned from the actual responsive Tailwind classes in each
component (`sm:`/`lg:` breakpoints throughout).

- **Header/logo lockup:** collapses correctly to logo + search + hamburger;
  the lockup-weight problem from Section 3 gets *worse*, not better, at this
  size — the mark shrinks proportionally with the (already shortened)
  wordmark, so the imbalance is more visible on the exact device most
  visitors will actually use.
- **Hero:** the visual (emblem) moves above the text on mobile (`order-2
  lg:order-1` / `order-1 lg:order-2` — visual-first is correct per the site's
  own mobile-experience convention). The two-line name-stack problem
  (Section 1) is unchanged on mobile — if anything more pronounced, since
  mobile headline sizes are smaller and the gap between the two lines reads
  as even more like two separate elements at a small viewport.
  Buttons stack full-width — correct, no issue.
- **Featured Book:** stacks single-column, cover above text — reasonable,
  no obvious problem found.
- **Teaching Areas:** collapses `sm:grid-cols-2` — on mobile the "five
  feature cards" problem (Section 8) is unchanged in kind, just narrower;
  worth re-evaluating once the desktop treatment changes, since an editorial
  index (the recommended replacement) may need its own distinct mobile
  composition rather than simply collapsing the same grid to one column.
- **Footer:** the four-column grid collapses — verified this stacks to a
  single column with all sections still present (Explore, Connect,
  Newsletter, legal row) — no accordion behaviour was found in the current
  implementation despite `docs/UX_ARCHITECTURE.md`'s original (pre-Sprint-11)
  plan proposing one; the current flat-stack approach is simpler and not
  obviously worse, but is a real, current divergence from that older planning
  document worth being aware of, not something this audit is flagging as
  broken.
- **Tap targets:** nav links, CTA buttons, and footer links all appeared to
  meet reasonable touch-target sizing in the verified viewport; no specific
  violations found.
- **Scroll length:** the homepage is long on mobile (ten distinct sections,
  several with generous vertical padding) — not unusually long for a
  homepage of this type, but worth keeping in mind if any section gains
  additional content in a future refinement pass, since mobile scroll
  fatigue compounds faster than desktop.

**Where mobile currently feels "merely collapsed from desktop" rather than
intentionally composed:** the Hero (name-stack problem inherited directly)
and Teaching Areas (grid-to-single-column is a literal reflow, not a
redesign). Both are downstream of the desktop fixes recommended above (Hero
direction, Teaching Areas index treatment) rather than needing independent
mobile-only solutions — fixing the desktop composition should substantially
fix the mobile one too, given how directly the mobile layout inherits from
the desktop component structure.

---

## 17. Reference Analysis

| Reference | What makes it feel premium | Relevant principle for this site | What NOT to copy | Concrete translation |
|---|---|---|---|---|
| **Aesop** | Ingredient-label honesty — plain, confident language, no hype adjectives, product left to speak for itself | The "no overselling" instinct already present in this project's Ruqyah/mental-health duty-of-care copy, and in the Latest Khutbah section's honest "coming soon" framing | Aesop's dark, apothecary-bottle visual register — wrong palette, wrong mood entirely | Apply the same restraint-as-confidence logic to the Featured Book's copy (Section 6) — resist adding a second adjective where one precise one would do |
| **Kinfolk** | Unhurried pacing, generous negative space, a page can say very little and still feel complete | Directly relevant to the rhythm problem in Section 14 — Kinfolk's pages don't fear a long quiet stretch, but they vary *density* within it (a full-bleed image, then a small caption, then air) rather than repeating the same block shape | Kinfolk's very cool, desaturated photographic palette — this brand's warmth (navy/gold/ivory) is a different temperature entirely | Vary section *weight* (not just tone) more deliberately across the paper-toned run identified in Section 14, the way Kinfolk varies image scale within a quiet layout |
| **Monocle** | Typographic hierarchy doing the work colour or iconography would do elsewhere — confident wayfinding through type alone | Directly the fix for Section 8 (Teaching Areas) — an index built from type weight and scale, not icons-in-circles | Monocle's density (small type, many items packed tightly) — wrong register for a five-item list on a calm homepage | Set the Teaching Areas replacement in a Monocle-style typographic index: scale and weight carry hierarchy, no icon system needed |
| **Aman Resorts** | Arrival as ritual — the first few seconds matter disproportionately, nothing is revealed all at once | Directly relevant to the Hero (Section 1/2) — right now the hero reveals everything (headline, mission, trust line, two CTAs) in one glance rather than staging a "first impression, then more" sequence | Aman's dependence on large-format photography — this site is correctly text/mark-led, not photo-led, at this stage | Direction C (Publication Cover) is the closest translation of "arrival as ritual" already proposed in Section 2 — a masthead line first, detail revealed on scroll |
| **Norm Architects** | Warmth through material honesty (real wood, real light) rather than ornament | The paper/gold palette is already the digital equivalent of this — the system correctly avoids decorative flourish standing in for warmth | Their literal material/photographic vocabulary (wood grain, natural light photography) — not applicable without real photography, which doesn't exist yet | Keep leaning on typography and the palette itself as the warmth-carrier, exactly as the system already prescribes — no change needed here, this reference is already being honoured |
| **Luxury/high-end publishing** | Typography as the primary storytelling device — margins are content | The single most under-used principle on the current homepage — see Sections 1, 8, and 13 | Dense, magazine-style multi-column text layouts — wrong for a homepage's shorter-form content | Direction C's masthead treatment and the Teaching Areas typographic-index recommendation are both direct applications |
| **Pentagram (editorial identity work)** | Identity as a coherent *system* of decisions, not a logo placed on a template | This is the reasoning `docs/CREATIVE_DIRECTION.md` and `docs/DESIGN_SYSTEM.md` already exist to enforce — the gap isn't in the documents, it's between the documents and a few specific implementation choices (Sections 1, 3, 8, 12, 14) | Pentagram's client roster's visual specifics (a "big identity system" scale this project doesn't need) | Treat every fix in this audit as a system-consistency correction, not a one-off tweak — e.g. fixing the Hero's asymmetry (Section 1) should also inform how Featured Book (Section 6) breaks its own grid, so the two changes reinforce one coherent idea rather than solving two unrelated problems |

---

## 18. Remove / Simplify

- **The icon-in-circle treatment on Teaching Areas** (Section 8) — the single
  clearest "resembles SaaS UI" element on the page. Remove the icon circles;
  the taxonomy doesn't need iconography to be legible.
- **The hero's trust line, in its current form** — repeats the eyebrow's
  identity claim in different words within the same viewport (Section 1).
  Either merge it into the eyebrow or drop it from the hero and let About
  Preview carry that information, where it isn't competing with the
  headline.
- **The Future Courses cards' module/lesson-count metadata** (Section 10) —
  the most catalogue/e-commerce-coded piece of copy on the page; removing it
  (or demoting it to the dedicated `/courses` page only, not the homepage
  teaser) would bring this section's tone closer to the rest of the page's
  restraint.
- **The "Featured" badge on the book cover**, as currently worded (Section
  6) — an admin/CMS term surfacing in public copy; either reword or remove
  in favour of letting the section's own heading ("The featured book") carry
  that meaning without a second on-image label repeating it.
- **The header logo's scale-on-hover transform** (Section 15) — a small
  deviation from the system's own "colour-deepen, never scale-up" hover
  philosophy; simplifying to opacity-only would cost nothing and remove one
  small inconsistency.

Nothing else currently reviewed exists "merely because there was space" —
every other section earns its place in the narrative (Section 5) and isn't
obviously repeating another section's message.

---

## 19. Prioritised Recommendations

### Tier 1 — Highest impact (most likely to move ~9.1 → ~9.7)

| # | Recommendation | Effort | Risk |
|---|---|---|---|
| 1 | Replace Teaching Areas' icon-in-circle cards with a typographic index (Section 8) | Medium | Low |
| 2 | Fix the hero's even-split composition and two-line name stack — implement Direction A (Sections 1–2) | Medium | Low |
| 3 | Header lockup: restore the full name, resolve the mark/wordmark optical imbalance (Section 3) | Small–Medium | Low |
| 4 | Add the standalone mission-statement line to the footer (Section 12) | Small | Low |
| 5 | Replace the About section's initials placeholder with the emblem, consistent with the Hero's own convention (Section 7, Treatment 1) | Small | Low |

### Tier 2 — Important refinement

| # | Recommendation | Effort | Risk |
|---|---|---|---|
| 6 | Vary tone/weight within the long paper-toned section run (Section 14) | Medium | Low |
| 7 | Give Featured Book a section-specific composition that breaks the shared grid slightly (Section 6) | Medium | Medium |
| 8 | Trim Future Courses' catalogue-style metadata; shorten to fewer, more editorial entries (Section 10) | Small–Medium | Low |
| 9 | Move the Ask Ahmad CTA to follow Teaching Areas rather than Future Courses (Section 5) | Small | Low |
| 10 | About section: pursue Treatment 2 (asymmetric spread + pull-quote) once a portrait exists (Section 7) | Medium | Medium |

### Tier 3 — Micro-polish

| # | Recommendation | Effort | Risk |
|---|---|---|---|
| 11 | Reconcile hero eyebrow copy with the locked "Author • Teacher • Khateeb" order (Section 1) | Small | Low |
| 12 | Tighten Ask Ahmad CTA's example copy ("daily practice" → a more specific category) (Section 11) | Small | Low |
| 13 | Simplify header/footer logo hover to opacity-only (Sections 15, 18) | Small | Low |
| 14 | Set Future Courses' remaining metadata (if kept) in the mono/eyebrow style rather than body text (Section 13) | Small | Low |
| 15 | Reconsider the "Featured" badge wording on the book cover (Sections 6, 18) | Small | Low |

---

## 20. Summary

See the chat response accompanying this document for the required concise
summary (current score, five biggest reasons, recommended hero/About
directions, highest-impact typography change, what to remove, recommended
sequence). This document is the full record; nothing above had been
implemented at the time it was written.

---

## Implementation Outcome — Editorial Refinement 2 (Tier 1)

All eleven Tier 1 items were implemented, in the order this document
recommended (header → hero → Teaching Areas → About → footer → rhythm), each
verified live in-browser before moving to the next. Full detail:
`docs/sprints/SPRINT-14.md`.

**Shipped as recommended:**

- #1 Teaching Areas: icon-in-circle cards replaced with a numbered
  typographic index (`TeachingAreaRow`) — the SaaS feature-grid pattern this
  document names directly is gone.
- #2 Hero: genuinely asymmetric column split (`2fr`/`3fr`, ~40/60), Direction
  A implemented — the name now sets as one line ("Ahmad Mohamed *Kassa*") at
  most viewports instead of stacking "Ahmad" over "Mohamed Kassa," the
  emblem was enlarged to read as a counterweight, and the redundant trust
  line was removed (item #6) in favour of the eyebrow/role-line pair this
  document proposed.
- #3 Header: full name restored ("Ahmad Mohamed Kassa," never shortened),
  mark enlarged and re-aligned — same fix applied to the footer's `Logo`
  usage, since both share one component; the audit's footer note claiming
  the footer already used the full name was itself inaccurate and is
  corrected here.
- #4 Footer: a standalone Newsreader mission-statement line was added above
  the link grid (`SITE_TAGLINE`, promoted rather than newly written).
- #5 About: the `AK` initials placeholder replaced with the emblem
  (`PortraitFrame`, shared with the dormant Hero Mode B slot) — the one
  placeholder on the site that wasn't reusing the brand's own "no photo yet"
  convention now does.

**Shipped, with a deliberate deviation from the literal Tier 2/3 suggestion:**

- #6 Featured Book badge: removed entirely rather than reworded — the
  section's own "The featured book" eyebrow already said this; a restrained
  editorial marker in its place would have repeated the same information a
  third time.
- Future Courses metadata (Section 10's recommendation, not itself a Tier 1
  line item but implemented alongside #1 since it's the same "remove
  fake-precision metadata" family): the module/lesson counts were removed
  from `CourseCard` (shared by the homepage and `/courses`), rather than
  reworded into the mono/eyebrow style Tier 3 item #14 proposed — once the
  audit's own reasoning ("read as e-commerce/course-platform convention")
  was applied, restyling the same numbers seemed like it would keep the
  problem rather than solve it.
- Rhythm (Section 14 / Section 9 of the brief): rather than reshuffle tone
  across every section, one targeted change was made — Latest Khutbah
  promoted to `size="lg"` — to break the three-consecutive-default-size run
  identified between Quote and Newsletter, without adding a third navy
  section or mechanically alternating paper/alt.

**Not implemented — deferred, not rejected:**

- Tier 1 item #5's fuller "Treatment 2" (asymmetric spread + pull-quote) —
  only the placeholder fix and the credential-line simplification were
  applied; the composition itself is unchanged pending a real portrait or a
  dedicated pass.
- Tier 2 and Tier 3 items not listed above (Featured Book's own asymmetric
  treatment, Ask Ahmad CTA copy tightening, the header/footer logo hover
  simplification, moving the Ask Ahmad CTA earlier in the page) — correctly
  out of scope for a Tier 1 sprint, per the brief's explicit "do not begin
  Tier 2 refinements."

**What still prevents 9.7+:** the credential-index treatment on About is a
genuine improvement but stops short of the fuller "editorial profile"
composition (Section 7's Treatment 2/3) — that's the single largest
remaining gap. The header/footer logo hover scale-transform (Tier 3 #13)
was left as a very minor, known inconsistency. Featured Book still shares
the page's default grid rhythm rather than breaking it (Section 6) — the
next highest-leverage Tier 2 item once this baseline is reviewed.

---

## Implementation Outcome — Editorial Refinement 3

Both remaining Tier 2 gaps named above — About's Treatment 2/3 (Section 7)
and Featured Book breaking its own grid (Section 6) — were addressed in this
pass. Full detail: `docs/sprints/SPRINT-15.md`.

**About Preview — Section 7's Treatment 2 implemented, adapted.** Of the
three fuller composition directions considered (an asymmetric editorial
spread with a pull-quote; a text-dominant "magazine profile" with a small
sticky emblem column; keeping the ER2 two-column layout but adding a single
typographic lede), the text-dominant direction was built: a narrow
(`0.55fr`) sticky `PortraitFrame` column beside a wide (`1.45fr`) text
column carrying an eyebrow, the name, an unquoted editorial lede statement
set in `font-display text-2xl`–`3xl` (the "one strong typographic moment"
the brief asked for — deliberately **not** quotation-marked, since no
genuine direct quote from Ahmad Mohamed Kassa exists to attribute), a body
paragraph carrying the full biographical detail, a four-line marginal index
(`Arabic & Islamic Studies — Kuwait`, `PGCE — University of London`,
`Khateeb — Masjid Al-Noor, East London`, `Ruqyah — practising and teaching
since 2009`) above a single understated "Read the full biography" CTA. This
was chosen over Treatment 2's literal pull-quote-in-a-margin layout because
the brief's own no-fabricated-quotation constraint made a "pull-quote"
device the wrong tool here — an unquoted lede does the same typographic job
without implying testimony. This direction was also chosen specifically
because it's the composition most different from the Hero and the
newly-enlarged Featured Book (both image-dominant/asymmetric-with-large-
visual), which directly serves the brief's own homepage-rhythm requirement
(Hero: image-led → Featured Book: cover-dominant → About: text-dominant,
small emblem → Teaching Areas: pure typographic list — no two adjacent
sections share a composition type).

**Featured Book — Section 6's "break its own grid" recommendation
implemented.** The cover column was widened (`minmax(0,0.55fr)` →
`minmax(0,0.62fr)` of the section grid, cover's own cap `max-w-xs
lg:max-w-sm` → `max-w-xs lg:max-w-md`), making the cover genuinely the
largest single visual element on the homepage — the "product-launch,"
not "grid item," scale the audit called for. An honest, conditionally
rendered publication caption (`[book.category, publicationYear].filter
(Boolean).join(" · ")`, only real `Book` schema fields, never fabricated)
and a plain "By {authorName}" line were added below the cover and title
respectively — satisfying the brief's "author connection, not a separate
author card" instruction. The `directBookSales`-gated CTA and the existing
CTA button set were left untouched. The already-removed "Featured" badge
(ER2) was not reinstated. The emblem was deliberately **not** added to this
section — the brief itself warns against stamping the mark in "simply
because it exists," and the section's whole point is the cover commanding
attention; a second gold mark competing with the cover would undercut that.

**What was removed during this pass:** ER2's `MARGIN_INDEX`
(flowing-sentence, comma-joined credential line, e.g. "Khateeb, Masjid
Al-Noor · Teaching since 2009 · ...") was replaced with a four-line
stacked index — tested against the brief's own "if it makes the section
feel like a CV, remove it" instruction and judged to still read as
restrained marginalia (small, muted, tracked type; a single top hairline;
no icons, borders, or bullet styling) rather than a CV list. Nothing else
was removed; both sections were net small-additions (a caption line, an
author line, a wider grid ratio) rather than large rewrites.

**Before/after:** About went from a two-column portrait+bio+bulleted-
credentials layout functionally identical in structure to "About the
founder" consultancy-site boilerplate, to a text-led editorial profile
where the reader's eye lands on a single unquoted statement before the
supporting biography — the change the audit named as the single largest
remaining gap after ER2. Featured Book went from a correctly-executed but
same-rhythm-as-everything-else section to one where the cover is
unmistakably the page's largest visual object, with two small, honest,
non-decorative facts (category/year, author) added rather than invented
marketing language.

**What still prevents 9.7+:** no real portrait exists yet, so About's
media column is still carrying the emblem rather than photography — the
layout is now built so a real portrait can occupy the same sticky slot
with zero architectural change, but the section's full "documentary
portrait" potential is necessarily unrealized until one exists. The
Featured Book caption currently renders nothing in production, since the
seed `Book` row has neither `category` nor `publicationDate` set — correct,
honest behavior today, but it means the "publication metadata" idea is
implemented and unverified visually until real data is entered through the
CMS. Tier 2/3 items from the ER2 addendum not touched by this pass (the
header/footer logo hover scale-transform, Ask Ahmad CTA copy tightening,
moving the Ask Ahmad CTA earlier in the page) remain open — out of scope
for this brief's explicit two-section focus.

---

## Implementation Outcome — Editorial Refinement 4 (Creative Director Pass)

A full-page micro-polish pass, not a redesign — per the brief's own explicit
scope, the architecture established across ER1–ER3 was treated as stable
and untouched. Every homepage section was reviewed live in-browser at
~390px, ~768px, ~1440px, and ~1568px and classified Keep / Refine / Remove;
only findings that survived that classification as genuine, low-risk
improvements were implemented. Full detail: `docs/sprints/SPRINT-16.md`.

**Shipped:**

- **Header/footer logo hover** (`Logo`, Section 15/18 of ER1's own audit,
  still open after ER2 and ER3): the `group-hover:scale-105` transform was
  removed, leaving an opacity-only dim — closing the one Tier 3 item this
  audit document has flagged as a known deviation from `docs/
  DESIGN_SYSTEM.md` Section 6's own "colour/opacity deepen, never scale-up"
  hover rule since it was first written in ER1.
- **Header nav "Newsletter" button**: demoted from `variant="gold"` to
  `variant="outline"`. As sticky chrome, it rendered gold on every page at
  every scroll position, alongside whichever section-level gold CTA was
  also on screen — diluting gold's meaning as "the single most important
  action" (`docs/DESIGN_SYSTEM.md` Section 6) into "a colour that just
  appears in the header." The link still goes to `/newsletter`; only its
  visual weight changed.
- **About's marginal index** (`about-preview-section.tsx`): restyled from
  plain small sans text to the site's existing mono/tracked "archival
  label" idiom (`font-mono text-[11px] tracking-[0.06em]`, the same
  register `Eyebrow` and `.text-eyebrow` already use elsewhere) so it reads
  as editorial notation set in a different register from the biography
  prose above it, rather than smaller body text.
- **Hero emblem/portrait mobile scale** (`hero-emblem.tsx`,
  `hero-portrait.tsx`): the shared aspect box's mobile cap changed from
  `w-full` (which resolved to ~290–340px, nearly the full mobile content
  width) to `max-w-[260px]` at mobile, stepping up through `sm:max-w-sm
  lg:max-w-lg` — desktop is pixel-identical to before; mobile now reads as
  a "seal" sitting in generous space rather than a shape filling the
  viewport edge-to-edge.
- **Footer newsletter duplication** (`site-footer.tsx`): the footer's own
  inline `NewsletterForm` column was removed. It was the third "join the
  newsletter" touchpoint within one continuous scroll — the dedicated
  `NewsletterSection` immediately above already carries a full form, and
  the footer's own "Connect" column already links to `/newsletter` — and
  reads, live, as an insistent repetition rather than restraint. The
  footer grid was changed from a fixed 3–4 `fr`-column stretch (tuned
  around the now-removed Newsletter block) to a `max-w-2xl` `grid-cols-2`/
  `grid-cols-3` (with confirmed socials) that sits compactly under the
  masthead rather than stretching across the full `container-ultra` width
  — closer to a colophon page than a utility grid.

**Considered, explicitly rejected — not silently skipped:**

- **Softening the paper→navy tone cuts** (Teaching Areas→Quote,
  CTA→Newsletter) with an additional `ManuscriptDivider` at each boundary.
  Rejected: the mark-variant divider's whole value is that it marks only
  "one or two genuinely significant transitions" (already true today,
  before Ask Ahmad, and already praised as correctly restrained in Section
  4 of this document) — adding it at two more boundaries would dilute
  that, not fix anything. The abrupt navy cuts are themselves the site's
  existing "spend the accent rarely, mark it clearly" rhythm device, not a
  defect.
- **Demoting Featured Book's "Learn more" CTA from gold to outline** to
  reduce gold-button count further. Rejected: unlike the header's
  persistent nav button, Featured Book's gold CTA is a genuinely singular
  action for a section explicitly built as the platform's flagship asset,
  and it sits far enough down the scroll from the Hero's own gold CTA not
  to visually compete with it in the same viewport.
- **Restructuring Future Courses from a card grid into a Teaching-Areas-
  style typographic list.** Rejected: courses are more substantial,
  self-contained future products than a topic taxonomy, and the existing
  diamond/icon-circle illustration already reuses the site's own
  manuscript rotated-square motif rather than a generic SaaS icon
  language — it does not repeat the specific problem Teaching Areas had.
- **Watermark opacity change** (Quote, Newsletter sections). Reviewed live
  at desktop: legible as the mark's shape on close inspection but does not
  compete with or precede the foreground text/headline in either section.
  This document's Section 4 already reviewed and approved this exact
  treatment; nothing in this pass's live check produced strong enough
  evidence to override that call.
- **A 5-course grid producing one orphaned card on its own row at desktop**
  (Future Courses, `lg:grid-cols-4` with 5 real course entries). Noted, not
  fixed: this is content-driven (five real, non-fabricated courses), not a
  styling defect, and no grid-column change was found that fixes it without
  either cramming columns or leaving two orphans instead of one.

**What was removed:** the header hover's scale transform, and the footer's
duplicate inline newsletter form (see above) — the only two removals in
this pass; everything else was a targeted style/scale adjustment to
existing elements.

**What still prevents 9.7+:** the same two items named at the end of the
ER3 addendum remain true — no real portrait exists yet, so About's media
column still carries the emblem rather than photography, and the Featured
Book publication caption still renders nothing in production pending real
`category`/`publicationDate` data in the CMS. Neither is fixable by a
design pass; both require real assets/data the client controls. No new
gap was introduced or discovered by this pass — this was confirmed to be
the same limiting pair as before, not a new finding.
