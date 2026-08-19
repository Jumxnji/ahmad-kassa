# Ahmad Mohamed Kassa — Visual Design System

**This is the implementation reference — the "how."** For the reasoning behind
these decisions — brand voice, design goals, the logo-as-design-language
concept, motion/photography/watermark philosophy — see
[`docs/CREATIVE_DIRECTION.md`](./CREATIVE_DIRECTION.md), the "why" companion to
this document. The split is deliberate: this file should never restate
`CREATIVE_DIRECTION.md`'s reasoning, and that file should never restate this
one's exact values. If a rule seems to belong in both, the philosophy goes
there and the specification stays here, cross-linked both ways. **This
document is the single source of truth for implementation details** — a
pixel value, a token, a duration, or a component spec should only ever be
defined once, here.

This document formalises the visual language for the public website. Where a token,
component, or pattern already exists in the codebase, this document documents and
extends it with rationale — per the project's standing rule, **the established
navy / gold / paper system is never redesigned, only completed.** Where a genuine gap
exists (Arabic/Qur'an typography, imagery direction, a full motion system, component
specs for parts of the site not yet built), this document defines it for the first
time, in the same spirit as what's already there.

Everything below assumes **light mode only** for the public site (see Section 14) and
is written for a Next.js + Tailwind CSS + shadcn/ui team to implement — no code
appears in this document; every recommendation maps onto tokens and primitives that
already exist in `globals.css`, `src/components/ui/`, and `next/font/google`, or
extends them using the same conventions.

---

## 1. Brand Personality

**Five core values**

1. **Authenticity** — knowledge presented with sanad and sincerity, never diluted for
   trend or reach.
2. **Accessibility of knowledge** — scholarly does not mean gatekept; a beginner and a
   student of knowledge should both feel this platform was built for them.
3. **Continuity** — a living link to a long tradition of Islamic teaching, not a
   disconnected "content brand."
4. **Craftsmanship** — the site itself should feel made with the same care as a
   well-bound book, not assembled from a template.
5. **Quiet confidence** — the platform never has to raise its voice to be taken
   seriously.

**Five personality traits**

1. **Composed** — nothing rushes the visitor; pacing is unhurried by design.
2. **Precise** — exact typography, exact spacing, exact colour use — precision reads
   as respect for the subject matter.
3. **Warm, not cold** — "scholarly" here means *considered*, not clinical; warmth
   comes from the paper/gold palette and serif type, never from decoration.
4. **Understated** — the most expensive-feeling design decisions on this site are
   almost all subtractions, not additions.
5. **Enduring** — nothing trend-driven (no gradients-of-the-moment, no meme-adjacent
   motion) — this has to still look right in ten years, which the vision brief asks
   for explicitly.

**Visual identity principles**

- **One accent color, spent rarely.** Gold marks the single most important element on
  a screen — never a whole section, never decoration for its own sake.
- **Paper, not screen.** The background palette (`--paper-50/100/200`) and the
  ink/ink-900 text pairing are named and treated as an actual paper-and-ink metaphor —
  margins, line-lengths, and type sizes should all read like a well-typeset book
  page, not a SaaS dashboard.
- **The manuscript-divider motif is the brand's signature flourish** and its *only*
  decorative flourish — it should never compete with a second decorative device (no
  icon dividers, no gradient rules, no dotted borders elsewhere on the site).
- **Hierarchy through type and space, not colour.** Because the palette is
  deliberately restrained, hierarchy has to come from scale, weight, and whitespace —
  never from introducing a fourth or fifth "important" colour to make something stand
  out.
- **Nothing imitates a template.** Every layout decision should be traceable to this
  document's rationale, not to "what shadcn ships by default" — shadcn/ui is the
  implementation substrate, never the aesthetic.

**Emotional goals for visitors**

- In the first three seconds: *"this is a serious, considered institution."*
- By the end of the homepage: *"I trust the person behind this."*
- On the book page: *"this is worth paying for, not just browsing."*
- On the Khutbah/Articles pages, even at low volume: *"there's already something
  real here, and more is clearly coming."*
- Site-wide: never anxiety, never urgency, never "act now" pressure — calm is a
  deliverable, not an accident.

---

## 2. Colour System

The system already lives in `globals.css` as five scales (Navy, Gold, Paper, Ink,
Stone) plus three semantic state colours. What follows documents *why* each exists
and *when* to reach for it — treat this as the canonical usage guide, not a new
palette.

### Primary — Ink Navy

| Token | Hex | Use |
|---|---|---|
| `navy-950` | `#0a1628` | Dark-mode background only (admin dashboard); never used on the public site |
| `navy-900` | `#0f1e33` | Primary brand colour — logo ink, primary buttons, primary nav text, footer background |
| `navy-800` | `#16294a` | Hover/pressed state for navy surfaces |
| `navy-700` | `#1e355c` | Secondary navy accents, larger decorative fills |
| `navy-600` / `navy-500` | `#2a4676` / `#3b5998` | Reserved for illustrative/data-viz use (e.g. a future stats or timeline graphic) — not for text or buttons |
| `navy-100` / `navy-50` | `#e7ebf2` / `#f3f5f9` | Very light navy tints for subtle section backgrounds that need to feel "cooler" than paper (e.g. a quote block) |

*Why navy:* deep ink-blue is the closest premium-editorial equivalent to true black —
readable, authoritative, and warmer/less severe than pure black, which suits
"scholarly but not cold." *When to use:* primary CTAs, the wordmark, section
backgrounds that need maximum contrast against paper, the footer. *Accessibility:*
`navy-900` on `paper-50` measures roughly **15.8:1** — comfortably exceeds WCAG AAA
(7:1) for any text size.

### Secondary — Warm Stone

| Token | Hex | Use |
|---|---|---|
| `stone-600` | `#706c63` | Muted/secondary body text (captions, metadata, timestamps) |
| `stone-500` | `#8a8579` | Placeholder text, disabled text |
| `stone-300` | `#cec7b6` | Decorative rules, disabled borders |
| `stone-200` | `#e2dccb` | Default border colour site-wide |
| `stone-100` | `#ede8dc` | Muted surface fill (secondary buttons, subtle card backgrounds) |

*Why stone, not grey:* a true neutral grey reads as "unconsidered" against a warm
paper background — stone carries the same warmth bias as the paper/gold palette, so
borders and muted text feel chosen, not inherited from a UI kit. *When to use:*
anywhere information needs to recede (captions, borders, dividers, disabled states) —
never for primary body copy, which stays on the Ink scale.

### Accent — Manuscript Gold

| Token | Hex | Use |
|---|---|---|
| `gold-700` | `#7c5f2f` | Small-text accents on paper (eyebrow labels, small links) — the *only* gold weight approved for body-size text |
| `gold-600` | `#9c7a3c` | Large text (≥24px) and UI elements (icons, borders, focus rings) on paper |
| `gold-500` | `#b8924a` | Primary decorative/button fill — always paired with dark (`navy-950`) text on top, never used as text on paper |
| `gold-400` | `#c9a65e` | Hover state for gold fills; primary accent in dark-mode contexts (admin) |
| `gold-300` | `#d8bc85` | Text selection highlight, subtle decorative fills |
| `gold-100` / `gold-50` | `#f1e6cd` / `#f8f2e4` | Very light gold tints — badge backgrounds, hover fills on ivory surfaces |

*Why gold:* warm brass/gold reads as manuscript illumination — the coloured ink used
to mark what matters in an old text — which is exactly the job it does here: mark
the one thing that matters per screen. *Accessibility is the whole reason this scale
has so many steps:* measured against `paper-50` —

- `gold-700` ≈ **5.6:1** — passes AA for normal text. This is the only gold weight
  ever used as small running text (see the existing `.text-eyebrow` utility, which
  already encodes this rule).
- `gold-600` ≈ **3.8:1** — fails AA for normal text, passes for large text/UI
  components (3:1 minimum). Use only at ≥24px or for icons/borders, never body copy.
- `gold-500` ≈ **2.7:1** — fails even the large-text threshold against paper. **Never
  used as a text colour.** It exists purely as a fill — always paired with
  `navy-950` text on top, which measures ≈ **6.3:1**, comfortably passing AA. This is
  already exactly how the primary "gold" button variant is built.

### Background — Paper

| Token | Hex | Use |
|---|---|---|
| `paper-50` | `#faf8f3` | Default page background site-wide |
| `paper-100` | `#f4f0e7` | Slightly deeper paper tone for alternating section backgrounds (breaks up long pages without introducing a new hue) |
| `paper-200` | `#ece5d6` | Deepest paper tone — sparingly, for a section that needs to feel like a distinct "page" within the page (e.g. a pull-quote block) |

*Why paper, not white:* pure white is clinical and screen-like; a warm off-white
reads as a physical page, reinforcing the manuscript metaphor and reducing glare on
long reading pages (Articles, Book sample, Legal pages). *When to use:* `paper-50`
everywhere by default; step to `paper-100`/`paper-200` only to create rhythm between
long stacked sections, never adjacent to each other without at least one `paper-50`
section between.

### Surface

| Token | Hex | Use |
|---|---|---|
| `card` (white `#ffffff`) | `#ffffff` | Cards, dialogs, popovers — sits *above* the paper background, so it's deliberately whiter/crisper than the page itself |

*Why a distinct surface colour from the background:* on a warm paper background, a
card that used the same paper tone would have no visible edge without a border doing
all the work. A slightly crisper white surface gives cards a gentle, natural lift
even before a shadow is added — closer to how a printed card sits on a wooden desk
than how a `<div>` sits on a screen.

### Border

| Token | Hex | Use |
|---|---|---|
| `stone-200` | `#e2dccb` | Default border on all cards, inputs, dividers |
| `gold-500` (as `--ring`) | `#b8924a` | Focus ring only — never a resting border colour |

*Why a warm stone border, not grey:* consistent with Secondary above — a border is
one of the most visible neutral elements on the page, and a grey one would fight the
paper background's warmth constantly. *Accessibility:* borders are not relied on to
convey information alone (see Accessibility, Section 13) — they are a visual
convenience, with real semantic grouping always reinforced by spacing/labels too.

### Success / Warning / Error

| State | Token | Hex | Contrast on paper-50 |
|---|---|---|---|
| Success | `success-500` | `#3f6c4e` | ≈ 5.7:1 — safe as text or icon |
| Warning | `warning-500` | `#a6752b` | ≈ 3.8:1 — large text/icons only, pair with dark text on a `warning-100` fill for body-size messaging |
| Error | `error-500` | `#9b3b3b` | ≈ 6.4:1 — safe as text or icon |

*Why muted, desaturated versions of the "obvious" red/amber/green:* saturated
stoplight colours would be the single loudest thing on an otherwise quiet page — these
three are pulled toward the same warm, muted register as the rest of the palette, so
a validation message reads as *considered feedback*, not an alarm. Each pairs with a
matching `-100` tint (`success-100` / `warning-100` / `error-100`) for message
backgrounds, so status messages always show as a soft filled band with dark-enough
text on top, never a jarring pure-hue banner.

### Muted

| Token | Hex | Use |
|---|---|---|
| `stone-100` (as `--muted`) | `#ede8dc` | Muted surface — secondary buttons, subtle section fills, disabled input backgrounds |
| `stone-600` (as `--muted-foreground`) | `#706c63` | Muted text — captions, helper text, placeholder copy |

---

## 3. Typography

### Existing type families (keep exactly as implemented)

- **Heading / display — Newsreader** (serif, `next/font/google`, italic available).
  *Why:* Newsreader is a modern editorial serif built for on-screen reading at
  display sizes, with real optical sizing and a warm, literary character that avoids
  both "generic Times New Roman" and "trendy geometric-serif" — exactly the
  "elegant, scholarly, timeless" brief. Its italic is genuinely well-drawn, which
  matters for pull-quotes and author notes.
- **Body — Manrope** (grotesque sans, `next/font/google`). *Why:* a humanist sans
  with generous x-height and calm, even letterforms — reads comfortably at length
  (Articles, Book sample) without competing with Newsreader's character at heading
  sizes. Its restraint is the point: body text should be invisible in service of the
  words.
- **Mono / labels — IBM Plex Mono** (weights 400/500/600). *Why:* used exclusively
  for the small "eyebrow" label style (`.text-eyebrow` — uppercase, tracked-out,
  gold-700) and any tabular/data-like content (dates, durations, prices). A mono face
  in these narrow, specific roles reads as an "archival label" — like a caption typed
  on an old library card — reinforcing the manuscript metaphor in the one place a
  sans or serif would feel generic.

### New — Arabic body/UI font: Noto Naskh Arabic

*Recommended for:* any Arabic UI text — future multilingual navigation and any
inline Arabic word or phrase used for terminology (e.g. "Aqeedah — عقيدة"). This
does not apply to the brand mark itself (see "The Mark as a Design Language" in
Section 10) — the mark is a commissioned illustration, not typeset text, and
stays completely unaffected by any font decision made here.

*Why:* Noto Naskh Arabic is a true Naskh book-hand — the register Arabic readers
actually expect for formal/educational text (as opposed to a Kufi or decorative
style) — with excellent Unicode and diacritic (tashkeel) coverage, a companion
family to the Noto ecosystem already standard for reliable multi-script rendering,
and it's available through `next/font/google`, matching the project's existing
font-loading pattern exactly. Its proportions (moderate x-height, restrained
calligraphic flourish) sit comfortably next to Newsreader without either face
overpowering the other when mixed on the same line.

**Critical typographic rule:** never apply letter-spacing/tracking to Arabic text.
Arabic is a cursive, joining script — added tracking breaks letter connections and
produces visibly broken words. Any `tracking-*` utility used for Latin eyebrows/
labels must be explicitly excluded from Arabic-language text runs.

### New — Qur'an quotation font: Amiri Quran

*Recommended for:* any direct quotation of Qur'anic text specifically (not general
Arabic UI copy, and not hadith/scholarly Arabic quotations, which should use Noto
Naskh Arabic like any other Arabic text).

*Why a second, distinct Arabic face just for this:* Amiri Quran is a purpose-built
revival of classical Naskh Mushaf typesetting, engineered with the correct Uthmani
script shaping and glyph substitutions that a general-purpose UI Arabic font does
not attempt — this is the standard the practice actually calls for when rendering the
Qur'an respectfully online, not a stylistic upgrade. Using it exclusively for Qur'an
text (never for Ahmad's own words, never for hadith) also gives visitors a
consistent, learnable visual cue: *this specific typographic treatment always means
"these are the words of the Qur'an,"* distinct from every other quotation style on
the site.

*Presentation guidance:* Qur'an quotations should sit in their own isolated block
(never inline mid-paragraph with Latin/Naskh text), right-aligned or centred per
convention, in `navy-900` on a `paper-100` or `gold-50` background field, with a
citation (surah:ayah) set below in Manrope at a clearly smaller, muted size — the
Qur'an's words should always look visibly different from, and set apart from,
everything surrounding them.

### Type scale

| Role | Font | Size (desktop) | Size (mobile) | Line height | Weight | Letter spacing |
|---|---|---|---|---|---|---|
| Display / H1 (hero) | Newsreader | 56–64px | 36–40px | 1.1 | 400 (Regular) | -0.01em |
| H2 (section title) | Newsreader | 36–40px | 28–30px | 1.15 | 400 | -0.01em |
| H3 (subsection) | Newsreader | 26–28px | 22–24px | 1.2 | 400 | normal |
| H4 (card/component title) | Newsreader | 20–22px | 18–20px | 1.3 | 500 (Medium) | normal |
| Body large (intro paragraphs, lede) | Manrope | 19–20px | 17–18px | 1.6 | 400 | normal |
| Body (default running text) | Manrope | 16px | 16px | 1.65 | 400 | normal |
| Body small (captions, metadata) | Manrope | 14px | 14px | 1.5 | 400–500 | normal |
| Eyebrow / label | IBM Plex Mono | 12px | 12px | 1.4 | 500–600 | 0.18em, uppercase |
| Button label | Manrope | 14–15px | 14–15px | 1 | 500 | normal |

Headings are set at **font-weight 400 (Regular)**, deliberately — Newsreader's
Regular weight at large sizes already carries enough presence; a Bold display serif
would read closer to a tabloid headline than a scholarly title. Weight is used to
create *internal* hierarchy (H4 at 500 vs. H1–H3 at 400) rather than to shout.

### Responsive scaling

Rather than a fixed set of breakpoint-specific sizes, headings use fluid scaling
(CSS `clamp()`-equivalent in the Tailwind config) between the mobile and desktop
values in the table above — this keeps every heading proportionate to its viewport
instead of "jumping" at a breakpoint, which reads as considered rather than
templated. Body text does **not** fluid-scale — it stays fixed at 16px across all
breakpoints (see Mobile Experience in the UX plan: shrinking reading type on mobile
is a common mistake this system avoids).

### Quote / pull-quote styling

As implemented in `QuoteSection` and `FeaturedBookSection`'s excerpt: Newsreader,
italic, `text-2xl` stepping to `text-3xl` at `sm:`, `leading-relaxed`, on a navy
background in `paper-50` (the full-width pull-quote treatment) or in
`text-muted-foreground` on paper (the shorter in-context excerpt treatment, at
`text-xl`). Attribution, where present, sits below in the eyebrow style (mono,
tracked, uppercase, `gold-400` on navy / `gold-700` on paper) — never in the
quote's own serif, so the words being quoted and the attribution never compete
for the same visual register. A pull-quote is always its own isolated block,
never inline mid-paragraph.

### Rules for emphasis

Italic (Newsreader's own italic, not a synthetic slant) is the system's one
emphasis device for warmth or idiom — used for a person's name within a headline
(see the Hero's "*Mohamed Kassa*" treatment), for pull-quotes, and for occasional
in-sentence emphasis in longer prose. **Bold is not used for emphasis in running
text** — Newsreader's regular weight already carries enough presence (see
"Headings are set at font-weight 400" above), and introducing bold as a second
emphasis device alongside italic would create two competing signals where one is
enough. Colour is never used for textual emphasis — gold marks a UI element
(a link, an accent, a small label), never a word inside a sentence; using it that
way would break the "one accent, spent rarely" rule the first time a paragraph
needed to emphasise more than one word.

---

## 4. Spacing System

An **8-point base grid**, with a 4px half-step available for fine adjustments inside
components (icon gaps, badge padding) — never for macro layout spacing.

| Token | Value | Typical use |
|---|---|---|
| `space-1` | 4px | Icon-to-label gap, tight badge padding |
| `space-2` | 8px | Base unit; form field internal padding (vertical) |
| `space-3` | 12px | Small component padding, gap between related inline elements |
| `space-4` | 16px | Default card padding (mobile), gap between form fields |
| `space-6` | 24px | Default card padding (desktop), gap between related content blocks |
| `space-8` | 32px | Gap between distinct components within a section |
| `space-12` | 48px | Sub-section spacing (e.g. hero → first content block) |
| `space-16` | 64px | Section-to-section spacing (mobile) |
| `space-24` | 96px | Section-to-section spacing (desktop) |
| `space-32` | 128px | Major section breaks on long pages (Home, About) at desktop widths |

**Margins & padding.** Components use the smaller end of the scale internally
(`space-4`–`space-6`); layout-level gaps between components use the larger end
(`space-8` and up). This split matters: it keeps individual components from feeling
cramped while keeping the overall page rhythm generous, which is where "premium"
whitespace actually reads from — page-level air, not component-level padding.

**Section spacing.** Every full-width page section (Hero, Featured Book, Latest
Khutbah, etc., per the UX plan) uses `space-24` top/bottom on desktop, `space-16` on
mobile, as a fixed rhythm — a visitor should be able to feel a consistent "breath"
between sections across every page on the site without consciously noticing it.

**Container widths** (already defined in `globals.css`):

| Token | Value | Use |
|---|---|---|
| `container-content` | 42rem (672px) | Long-form reading columns — Articles, Book sample, Legal pages |
| `container-narrow` | 56rem (896px) | Forms, the Contact question flow, narrow single-column sections |
| `container-wide` | 80rem (1280px) | Standard page container — most section content |
| `container-ultra` | 96rem (1536px) | Full-bleed hero backgrounds, image-led sections |
| `breakpoint-3xl` | 120rem (1920px) | Upper bound where `container-ultra` content stops growing further, preventing an unreadably wide hero on very large displays |

**Maximum reading width.** `container-content` (672px) targets **65–75 characters
per line** at the body type size (16px/1.65 Manrope) — the widely-established
comfortable reading measure. This is a hard ceiling: no long-form paragraph content
(articles, sample chapters, legal text, biography prose) should ever exceed it,
regardless of how wide the viewport is.

---

## 5. Layout System

**Grid.** A 12-column grid at desktop (`container-wide`, 80rem), collapsing to 6
columns at tablet and a single implicit column at mobile — gutters at `space-6` (24px)
desktop, `space-4` (16px) mobile.

**Columns in practice:**
- Full-bleed sections (Hero, Final CTA band): no grid, edge-to-edge background with
  content constrained to `container-wide` or `container-ultra`.
- Two-up content (e.g. Biography Preview's text+portrait, Book Detail's cover+info):
  a 5/7 or 6/6 split, never a perfect 1:1 split for text+image pairings — a slightly
  asymmetric ratio reads as composed, an even split reads as a template default.
- Card grids (Khutbahs, Videos, Articles): 3 columns desktop → 2 tablet → 1 mobile,
  per the UX plan's responsive rules.

**Responsive breakpoints:**

| Name | Width | Notes |
|---|---|---|
| `sm` | 640px | Rarely a distinct layout — mostly type/spacing adjustments |
| `md` | 768px | Tablet — nav condenses, grids go to 2 columns |
| `lg` | 1024px | Desktop layout activates fully (nav, multi-column sections) |
| `xl` | 1280px | Container reaches `container-wide` |
| `3xl` | 1920px | Upper bound for full-bleed sections (defined above) |

**Content widths by page type:**
- Reading pages (Articles, Book sample, Legal): `container-content` (672px)
- Standard pages (Home, About, Khutbahs, Videos, Contact): `container-wide` (1280px)
- Forms (Contact question flow, Newsletter standalone page): `container-narrow`
  (896px), and the form itself further constrained to ~480–560px within that, so a
  single-column form never stretches into uncomfortably long input fields.

**Card layouts.** Every card in the system (see Section 8) shares one anatomy —
image/media area (fixed aspect ratio per card type), eyebrow label, title, one line
of metadata, optional short excerpt, all inside consistent padding (`space-6`
desktop / `space-4` mobile) on a white `card` surface with a `stone-200` border and
`shadow-sm` at rest, `shadow-md` on hover. This consistency is what lets Book,
Article, Video, and Khutbah cards sit in the same visual family without looking
like four different components.

---

## 6. Buttons

The system already defines seven variants and six sizes (`button.tsx`) — this section
documents intended usage per the "Primary / Secondary / Ghost / Text / Icon" request,
mapped onto what exists.

| Requested role | Existing variant | Background | Text | Use |
|---|---|---|---|---|
| Primary | `gold` | `gold-500` → `gold-400` on hover | `navy-950` | The single most important action per page (Buy the Book, Subscribe, Submit) |
| Primary (on dark/navy sections) | `default` | `navy-900` → `navy-900/80` on hover | `paper-50` | Same role, used when the surrounding section is already navy (e.g. Final CTA band), so gold-on-navy can be reserved for true emphasis |
| Secondary | `secondary` | `stone-100` | `navy-900` | Supporting actions that still matter (Read a Sample, Notify Me) |
| Ghost | `ghost` | transparent → `stone-100` on hover | `navy-900` | Tertiary actions inside already-busy contexts (card actions, toolbar buttons) |
| Text | `link` | transparent | `navy-900`, underline on hover | Inline actions inside prose or card footers ("Read more →") |
| Icon | `ghost` / `outline` + `icon` sizes | as ghost/outline | as ghost/outline | Search trigger, social icons, media controls |
| Destructive (rare on public site) | `destructive` | `destructive/10` → `destructive/20` | `destructive` | Only realistic public-site use: a "remove from list"-type action, if ever needed |

**Gold in persistent chrome.** The "single most important action per page"
rule above governs page content — it does not cover the header/nav, which
renders identically on every page and at every scroll position. A gold
button living there is gold on every page simultaneously, competing with
whatever the current page's own real primary action is. Persistent chrome
(header nav, sticky utility bars) should use `outline` or `ghost`, never
`gold` — reserve gold for the CTA that is actually this specific page's
one most important action (added Sprint 16, after the header's nav
"Newsletter" button was found doing exactly this).

**Sizes.** `xs`(24px)/`sm`(28px)/`default`(32px)/`lg`(36px)/`xl`(48px) height, plus
matching `icon`/`icon-xs`/`icon-sm`/`icon-lg` square variants. **On the public site,
`default` is the floor and `lg`/`xl` are the norm** for primary CTAs — the compact
`xs`/`sm` sizes exist for dense admin UI, not the more spacious public marketing
pages. A hero or section CTA should use `xl`; a card's inline "Read more" link-style
button can stay at `default`.

**Radius.** Buttons inherit the shared radius scale — `rounded-lg` (8px) at
`default`/`lg`/`xl`, stepping down slightly for `xs`/`sm` to stay visually
proportionate at smaller sizes. No fully-rounded ("pill") buttons anywhere — soft
rectangular corners read as editorial/print-adjacent; full pills read as generic
SaaS/app UI, which this brief explicitly argues against.

**Hover state.** A same-family colour deepen (`gold-500`→`gold-400`, `navy-900`→
`navy-900/80`, etc.) — never a scale-up, shadow-pop, or colour-hue change. Deepening
the existing colour keeps the interaction feeling like *the same object responding*,
not a different object appearing.

**Active/pressed state.** A 1px downward translate (`translate-y-px`, already
implemented) — a small, tactile "this button was physically pressed" cue, consistent
with the print/manuscript metaphor (like a letterpress stamp) rather than a digital
ripple or glow.

**Disabled state.** 50% opacity, pointer-events removed (already implemented) — no
colour change, so a disabled primary button is still recognisably "the primary
button, just not available right now," not restyled into an unrelated grey block.

**Loading state.** Not yet built — recommended pattern: replace the button's leading
icon slot with a small spinning indicator (Lucide's `Loader2`, animated), keep the
label text in place (e.g. "Subscribing…"), and **fix the button's width** to its
resting-state width before the loading state triggers, so the layout never shifts.
For icon-only buttons, centre the spinner in place of the icon. The button remains
visually in its normal variant colour throughout — a loading button should look like
"working," not like a disabled/greyed-out button.

**Focus state.** A visible ring using `--ring` (`gold-500`) at 50% opacity, 3px,
plus a solid border-ring — already implemented and correct: gold is otherwise used
so sparingly that a gold focus ring is unmistakable and never confused with a resting
border or another UI state.

---

## 7. Forms

**Inputs & textareas.** White surface, `stone-200` border, `space-2`–`space-3`
internal padding, `rounded-lg`, 16px Manrope text (never smaller — prevents
mobile-Safari auto-zoom-on-focus, a real usability detail). Placeholder text in
`stone-500`. Focus state matches buttons: gold ring + border. Textareas fix a
sensible default height (~4–5 lines) and allow vertical resize only, never
horizontal.

**Dropdowns/selects.** Same visual shell as text inputs (so a form never looks like
it's mixing two different input systems), with a small chevron icon, and an
on-brand popover surface (white, `shadow-md`, `stone-200` border, `rounded-lg`) for
the open menu — matching the existing `select.tsx`/`popover.tsx` primitives.

**Radio buttons.** True `<input type="radio">` semantics under the hood always, even
where the Contact page's category picker (Section 11 of the UX plan) is presented as
large visual tiles rather than traditional radio dots — the *visual* treatment
changes per context (a settings form gets classic dot+label radios; the Contact
category picker gets large tappable cards with an icon, label, and a selected-state
gold border + `gold-50` fill + subtle check icon), but the underlying control is
never re-invented as an unlabelled clickable `div`.

**Checkboxes.** Small, square, `rounded-md`-equivalent at this scale, gold check
mark on a navy-900 fill when checked (mirrors the button colour logic: filled state
uses dark-on-gold-adjacent, i.e. here gold-on-navy, for maximum legibility of the
check glyph itself) — used sparingly (newsletter consent, "remember me"-style
utility, never as a primary content-selection device on the public site).

**Validation.** Inline, per-field, appearing directly beneath the field the moment it
becomes invalid (on blur, not on every keystroke) — never a single summary banner at
the top of a long form forcing the visitor to scroll back up to find which field was
wrong.

**Error messages.** `error-500` text, small (14px), paired with a small inline error
icon — specific and actionable ("Enter a valid email address," never "Invalid
input"). The field's border also switches to `error-500` at 50% opacity so the
error is visible even to a visitor scanning quickly rather than reading every line.

**Success states.** Two tiers, matching the Newsletter deep-dive in the UX plan:
*inline* success (the field/button itself morphs into a small checkmark + short
confirmation, no page change, for fast common-case actions like newsletter signup),
and *page-level* success (a dedicated thank-you page, for actions substantial enough
to deserve their own screen — question submission, book purchase). Both use the same
success visual language: `success-500` icon/accent, warm confirming copy, never a
generic green "Success!" toast for anything that matters to the visitor personally.

---

## 8. Cards

All cards share the base anatomy from Section 5 (media area, eyebrow, title,
metadata, optional excerpt, consistent padding/border/shadow). Differences are only
in the media aspect ratio and metadata content:

- **Book card.** Portrait-oriented cover image (2:3 aspect ratio, with a subtle
  drop-shadow/perspective treatment — the one card type allowed slightly more visual
  richness, since the cover *is* the product). Eyebrow: format ("Paperback · Ebook").
  Title + one-line hook. Metadata: price. CTA: "View Book" (ghost/link style within
  the card, not a full button, since the whole card is already clickable).
- **Article card.** Landscape image or, if none, a typographic placeholder using the
  category name set large in Newsreader on a `paper-100`/`gold-50` field (never a
  generic grey placeholder box — even a missing image should look intentional).
  Eyebrow: category. Title, one-line excerpt, metadata: read time + date.
- **Video card.** 16:9 thumbnail with a centred play-icon overlay (simple circle,
  gold-500 fill, navy-950 icon — consistent with button colour logic) and a duration
  badge bottom-right (small, `navy-900/80` background, white text, `rounded-md`).
  Title + date, no excerpt (video titles should already be descriptive).
- **Khutbah card.** Same shape as Video card, plus a small series/topic tag (badge,
  `gold-50` background, `gold-700` text — meets the small-text contrast rule from
  Section 2) and, where available, a small "Transcript available" indicator icon.
- **Author profile card.** Used in article bylines and any future "our teachers"
  context — circular portrait, name in Newsreader, one-line role, optional small
  social icon row. Deliberately the *only* card type with a circular (not rounded-
  rectangle) media crop — a person's portrait is the one image type this system
  treats differently from an object (book/video/article) image.
- **Newsletter card.** Used when the newsletter section needs to sit *as a card*
  within a mixed-content area (e.g. inside a sidebar or a related-content grid,
  rather than its own full section) — `gold-50` background (the only card that
  breaks from a white surface, to visually separate "an ask" from "content"),
  headline, single input + button per Section 12 of the UX plan.
- **Call-to-action card.** A generic wrapper for any secondary CTA embedded inside a
  content flow (e.g. "In the Meantime" on the Courses Coming Soon page) — navy-900
  background, paper-50 text, single button, used only where a full-width CTA band
  would be too heavy for the surrounding content density.

**Numbered publication entry** (Sprint 20) — not a card, the deliberate alternative
to one. Used on `/books` where a genuine multi-item *grid* (Book detail's "Related"
section still uses the Book card above) would misrepresent how few titles actually
exist: a vertical list of full-width editorial spreads, each led by an archival
`0X / {status}` mono label instead of a badge, a dominant fixed-width cover, and a
narrow restrained text column — never stretched into equal grid cells. Reach for
this pattern (`PublicationEntry`/`PublicationIndex`,
`src/components/catalog/publication-entry.tsx`) whenever a catalogue-shaped page has
too few genuine items for its grid to read as intentional rather than sparse; reach
for the ordinary card grid once there are enough real items that a grid stops
looking like it's apologizing for empty cells.

**Numbered editorial index** (Sprint 22) — the metadata-forward sibling of the
pattern above, for a catalogue with no cover image or other single dominant visual
per item. Used on `/courses` (`ProgrammeEntry`/`ProgrammeIndex`,
`src/components/catalog/programme-entry.tsx`): a fixed-width left column (`lg:w-36`)
holding an archival number and level/status metadata, beside a flexible right
column (title, excerpt, one restrained text action), hairline-divided, collapsing
to a single stacked column below `lg`. Reach for this variant instead of the
publication-entry pattern when the items being indexed have no image worth
anchoring a layout around — text-only prospectus/programme-style content — and
for the publication-entry pattern itself when a real image (a cover, a portrait)
is the strongest available visual per item.

**Catalogue register** (Sprint 22 correction) — the transition between an index
page's introduction and its first entry, when the two would otherwise sit in the
same field with no visual reset. A single mono row —
`flex items-baseline gap-3 border-b border-stone-200 pb-3`, a left label
(what follows) and a right range (`01–0N`, `ml-auto`), both
`font-mono text-[11px] tracking-[0.08em] uppercase` in `text-stone-500`/`-400` —
reusing the exact label idiom `PublicationEntry`'s own per-entry header row
already established, not a new typographic language. No navy band, banner,
card, gradient, icon, or second emblem — the break is typography, spacing, and
one hairline rule only. Used on `/courses`, between `PageHeader` and
`ProgrammeIndex`; reach for it on any future index page with the same
intro-then-catalogue shape.

**Chronological/career facts belong inside the section they're relevant to,
not a standalone timeline.** Sprint 21 first tried a "marginal era-list" —
a hairline-divided vertical list replacing About's old dotted/connected
timeline component — before finding, in review, that every one of its
entries already duplicated a fact stated in Education, Academia, Teaching &
Speaking, Books, or the credential index elsewhere on the same page. The
list was removed rather than kept as a second, reskinned restatement of the
same facts. A dedicated chronological/"journey" component (dotted timeline
or otherwise) is avoided site-wide for this reason — it isn't just the
dots-and-connectors styling that reads as a generic "our journey" resume
widget, it's presenting the same biography a second time as its own
section. Fold dates/history into the prose or archival index of whichever
section they actually belong to instead.

---

## 9. Icons

**Library: Lucide** (`lucide-react`, already installed). *Why:* a single consistent
stroke-based icon set with excellent coverage, tree-shakeable per-icon imports (no
unused-icon bloat), and a neutral, editorial line quality that doesn't fight the
serif/manuscript character of the type system the way a filled or duotone icon set
would.

**Sizing.** Base UI icon size is **16px** (matching the existing button component's
default `size-4` SVG sizing) for inline/button contexts; **20px** for standalone
icon buttons and nav utilities (search, social); **24px** for feature/emphasis icons
inside larger content blocks (e.g. a small icon accompanying a pull-quote or a
feature-section heading). Icons never exceed 32px anywhere on the public site — at
that scale, an illustration or photograph should be doing the work instead.

**Stroke width.** Lucide's default is 2px; **this system uses 1.5px** as the
standard override across the public site — a slightly lighter line pairs better with
Newsreader's own delicate serifs and Manrope's moderate weight, and reads as more
refined/editorial than the somewhat heavier default. The one exception: icon-only
buttons at 12–14px (`icon-xs`/`icon-sm`), where 1.5px stroke starts to look faint at
that scale — those keep the 2px default for legibility.

**Usage.** Icons are always paired with a visible text label except in three
well-established contexts: the nav search trigger, social links in the footer, and
media player controls — everywhere else, an icon-only control is accessibility risk
this system deliberately avoids.

---

## 10. Imagery

### The Mark as a Design Language

The philosophy behind this is in `CREATIVE_DIRECTION.md`, Section 6 — this
subsection is the concrete implementation of it, as actually built.

**Assets.** `public/brand/logo-mark.svg` (gold, on light backgrounds),
`logo-mark-white.svg` (white, on dark/navy backgrounds), `logo-mark-dark.svg`
(navy, single-colour print/fallback contexts) — three flat colourways of the
same path data, no redrawing between them. Provenance and regeneration notes
live in `public/brand/README.md`.

**Implemented touchpoints, and their exact treatment:**

| Touchpoint | Component | Treatment |
|---|---|---|
| Header / footer / loading screen | `src/components/shared/logo.tsx` | Mark + live-composed wordmark (Newsreader), `tone="default"` (gold) or `tone="inverted"` (white); subtle scale + opacity shift on hover |
| Hero (Mode A — no portrait yet) | `src/components/sections/hero-emblem.tsx` | Large-format mark inside a soft circular gold glow (`radial-gradient`) with two concentric hairline rings — a "seal" treatment, not a literal frame |
| Hero (Mode B — once a portrait exists) | `src/components/sections/hero-portrait.tsx` | Occupies the identical aspect box as Mode A; swapping is a one-line constant change in `hero.tsx` (`HERO_VISUAL`), never a layout change |
| Background watermark | `QuoteSection`, `NewsletterSection` | The white mark colourway, `opacity-[0.05]`, large scale, absolutely positioned, on navy sections only — never on paper/ivory backgrounds (see the explicit warning below) |
| Section-transition accent | `src/components/shared/manuscript-divider.tsx`'s `mark` prop | Swaps the usual rotated-gold-square accent for a small mark glyph, reserved for one or two genuinely significant transitions per page (currently: before "Ask Ahmad" on the homepage) |
| "No photo yet" placeholder | `src/components/media/portrait-frame.tsx` (Sprint 14) | The white mark colourway, centred on the same navy card treatment `HeroEmblem`'s "no portrait" state uses conceptually — replaces a generic initials monogram, so About and the dormant Hero Mode B slot share one "not a photo yet" convention instead of two |

**Why the watermark is navy-only, not a stylistic preference.** The mark
reads as a considered texture at low opacity against navy; on paper/ivory
the available contrast range is narrower, and the same low-opacity treatment
that looks intentional on navy risks looking either invisible or like a
visible smudge on a light ground, depending on the exact colourway used.
Rather than tune a paper-safe version, the simpler and more reliable rule is
the one already in place: **watermark placements stay on navy sections
only.**

**An implementation gotcha worth flagging for anyone extending this
pattern.** The navy-tuned watermark/texture utility class is deliberately
named `manuscript-texture-navy`, *not* `bg-manuscript-texture-navy` — a
`bg-`-prefixed custom utility was tried first and silently collided with
Tailwind's `bg-navy-950` class in `tailwind-merge`'s conflict resolution
(both get grouped as "background colour" utilities by name pattern, so the
later one in the class list wins and the earlier one is dropped), which
made the navy background disappear entirely underneath the texture layer.
Any future custom background utility that layers on top of a Tailwind
colour class should avoid the `bg-` prefix for exactly this reason.

**Portraits (Ahmad).** Natural light, warm colour grading (slightly lifted shadows,
never high-contrast/dramatic lighting), plain or softly blurred backgrounds — never
a busy setting competing with the subject. As implemented since Sprint 17 (the first
approved photograph): consistent *register* — same photographic session, same
natural colour, immediately recognisable as the same person — but **not** identical
crops. Hero and About deliberately use different crops from the one source photo
(a tighter, more formal square for Hero; a fuller chest-up frame for About) so the
two placements feel related rather than duplicated — see `src/config/portrait.ts`
for the current canonical source/crops and `docs/BRAND_USAGE.md`'s "The Portrait"
section for full placement rules. Live today: Hero (Mode B), About preview only —
not yet Author card or OG images; extend this same source/crop pattern rather than
commissioning or cropping independently if those are ever wired up.

**Book covers.** Treated as the single "product hero" image type on the site — shown
at real size and real proportion (2:3), never cropped or overlaid with UI chrome.
The one place a drop-shadow/subtle 3D tilt is acceptable (Section 8), because a
cover's whole job, historically and now, is to be looked at as an object.

**Hero images.** Used sparingly and only where they earn their place — the Home hero
may use a portrait or a quiet, wide architectural/textural image (see below) rather
than a portrait, depending on what's being led with; both Book Detail and Coming
Soon pages intentionally use **no** hero photograph at all, leading with type
instead, per the "restraint over filler" principle established in the UX plan.

**Islamic architecture.** Not yet implemented — recommended for later, not
required now. A soft, desaturated, out-of-focus geometric or mihrab-adjacent
architectural detail could appear as a section background texture at very
low opacity, purely to add quiet depth, once real (non-stock) photography of
this kind exists. It should never be a literal, sharp photograph of "a
generic mosque" used as set-dressing — that reads as a stock-photo shortcut,
which undercuts the personal, specific nature of this platform. Until then,
the geometric-tile texture below covers the same "quiet depth" need without
depending on photography that doesn't exist yet.

**Texture — as actually implemented.** `.manuscript-texture` /
`.manuscript-texture-navy` (`src/app/globals.css`) — a warm radial glow
(`gold-50` on paper, `navy-800` on navy) layered with a large-tile (160px),
low-opacity (0.05–0.07) interlocking-square geometric pattern, the same
motif family as the manuscript-divider's rotated-square accent. Applied via
`Section`'s `texture` prop (`src/components/shared/section.tsx`), currently
used on the Hero and the two navy sections (Quote, Newsletter) — not applied
globally to every `paper-50` surface, since a texture that's everywhere
stops registering as a texture and starts registering as a background
colour. No other textures (fabric, wood, paper-grain, gradients-as-texture)
appear anywhere in the system.

**Background imagery.** Full-bleed background photography is reserved for the
homepage hero only (if a photographic hero is chosen over a portrait/type-led
treatment) and the Final CTA band — everywhere else, backgrounds are flat colour
from the palette in Section 2. This scarcity is deliberate: a site that uses a big
background photo on every section stops feeling premium and starts feeling like a
stock-photo slideshow.

---

## 11. Motion

The system already enforces a global `prefers-reduced-motion` shutoff in
`globals.css` — every animation below must respect that as a hard constraint, not an
afterthought.

**As implemented.** `src/constants/motion.ts` exports the shared `fadeUp` /
`fadeIn` / `staggerContainer` variants and the `EASE_OUT` cubic-bezier
(`[0.16, 1, 0.3, 1]`) every Framer Motion usage should reuse rather than
hand-rolling a new curve per component. The reduced-motion guard is a fixed
idiom, used identically in every animated component (`hero.tsx`,
`template.tsx`, `loading-screen.tsx`, `reading-progress-bar.tsx`, and the
`ScrollReveal` wrapper below): read `useReducedMotion()` from
`framer-motion`, and set `initial` to the resting/settled state instead of
the animated-from state when it's `true`. **`ScrollReveal`**
(`src/components/shared/scroll-reveal.tsx`) is the shared client-island
pattern for scroll-triggered reveals on Server Component sections (an async
section with a DB fetch can't itself be `"use client"`, so it wraps its
content in `<ScrollReveal>` rather than converting the whole section) — any
new section that needs a reveal-on-scroll should reuse this component, not
add a bespoke `whileInView` block.

**Durations & easing.**

| Interaction | Duration | Easing |
|---|---|---|
| Hover (colour/shadow) | 150ms | ease-out |
| Button press (translate) | 100ms | ease-out |
| Page/route cross-fade | 200–250ms | ease-in-out |
| Scroll-reveal (section enters view) | 400–500ms | ease-out, with an 8–12px upward settle |
| Skeleton → content swap | 200ms cross-fade | ease-in-out |
| Overlay open/close (search, mobile nav, dialogs) | 200ms | ease-out (open) / ease-in (close) |

A **250ms** ceiling applies to almost everything — nothing on this site should ever
feel like it's "performing" for the visitor; motion here exists purely to make state
changes legible, never to entertain.

**Page transitions.** A short cross-fade between routes (matching the UX plan) —
the outgoing page fades out first, the incoming page fades and settles up slightly,
never a slide/wipe/zoom transition, which would read as app-like rather than
editorial.

**Fade animations.** Used for all content-appearing moments (skeleton→content,
route transitions, overlay open) — opacity only, no accompanying scale, to keep
every fade feeling like the same restrained "material."

**Hover animations.** Buttons deepen colour (Section 6); cards lift 2–4px with a
shadow step-up (`shadow-sm`→`shadow-md`); text links draw an underline in from one
side rather than snapping on — all under 200ms.

**Scroll reveals.** Each section fades/settles into place once ~20% visible,
**once only** — never re-triggering on scroll-up/scroll-down, and never more than one
motion property (opacity + translate together counts as one composed effect, not
two) animating on the same element simultaneously.

**Loading skeletons.** Grey-toned (using `stone-100`/`stone-200`, not a generic
system grey) blocks shaped to match the eventual content's real proportions (a
book-cover-shaped block, a heading-width text bar) — a subtle shimmer sweep is
acceptable at low opacity, but the skeleton must never pulse aggressively or use a
colour outside this palette.

**What's explicitly excluded.** No parallax scrolling, no scroll-jacking, no
auto-playing carousels, no looping background video, no confetti/celebration
animation on form success, no bouncy/spring easing anywhere in the system — every one
of these is a common "premium site" instinct this specific brief's calm, scholarly
register argues against.

---

## 12. Components

Most of these already have a shadcn/Radix primitive in `src/components/ui/`
(`accordion.tsx`, `breadcrumb.tsx`, `dialog.tsx`, `sonner.tsx`, `tabs.tsx`, etc.) —
this section is on-brand usage guidance for the public site, not new primitives.

- **Navigation.** Per the UX plan's navigation spec (Section 3 there) — solid navy
  bar, transparent-to-solid crossfade on the homepage only, no dropdowns/mega menu
  at current content volume.
- **Footer.** `navy-900` background with `paper-50` text (the one place the full
  palette inverts, giving the footer a distinct "closing" weight). As shipped
  (Sprint 14, rebalanced Sprint 23): a two-zone composition at `lg`+ — the brand
  lockup with the mission statement (Newsreader) stacked directly beneath it on
  the left (~38%), Explore/Connect navigation on the right (~52%) — rather than
  the originally-planned four-column grid, which read as under-using the field
  once the mission line moved out of a standalone band. Both zones stack to one
  column, in source order, below `lg`.
- **Hero.** Full-bleed section, `paper-50` (or the rare photographic treatment per
  Section 10), generous vertical padding (`space-32` desktop), Newsreader display
  headline, single gold CTA.
- **Feature sections** (Biography Preview, Featured Book, Latest Khutbah, etc.).
  Consistent internal rhythm: eyebrow label (mono, gold-700) → Newsreader heading →
  Manrope supporting copy → single CTA, in that order, every time — a visitor should
  be able to predict a section's structure after seeing it once.
- **Testimonials (future).** A horizontal card carousel — quote in Newsreader
  italic (leaning on the same italic already loaded for author notes), name +
  affiliation in small Manrope beneath, no star ratings by default (ratings feel
  transactional; a direct quote is more in keeping with the scholarly register) —
  **built but never rendered until real testimonials exist**, per the Book Section
  deep-dive in the UX plan.
- **Newsletter.** Single input + button + reassurance line, per Section 12 of the UX
  plan — `gold-50` background when it appears as its own card/section, transparent
  when it's the dedicated footer row.
- **Search.** Icon-triggered centred overlay, white surface, `shadow-lg`, grouped
  results by content type — per the UX plan's Navigation section.
- **Pagination.** Simple "Previous / Page X of Y / Next" — text buttons (`ghost`
  variant) either side of a plain page indicator, never a long row of numbered page
  buttons, which reads as a forum/e-commerce pattern out of step with the editorial
  register. Appears only once a list genuinely needs it (Section 9 of the UX plan's
  conditional-visibility rule for Articles/Khutbahs).
- **Breadcrumbs.** Small, muted (`stone-600`), mono-adjacent letter-spacing to match
  the eyebrow style, used only on genuinely nested pages (Article Detail, Book
  Detail) — never on top-level pages, where they'd add clutter without adding
  orientation value.
- **Tabs.** Underline-style (a gold underline sliding beneath the active tab),
  never a filled "pill" tab style — used sparingly (e.g. a future "Transcript /
  Details" split within a Khutbah's detail view).
- **Accordions.** Used for Legal pages' section navigation and the mobile footer's
  Quick Links/Books columns (Section 15, Mobile Experience, of the UX plan) — a thin
  `stone-200` top-border per item, a rotating chevron (not a plus/minus swap), 200ms
  expand/collapse.
- **Modals/Dialogs.** White surface, `shadow-xl`, `rounded-xl`, centred, with a soft
  navy-tinted scrim behind (not pure black) — reserved for genuinely modal moments
  (a confirmation, a full-size image view) and never used for the newsletter capture,
  which per Section 12 must never be an interrupting popup.
- **Toast notifications.** Bottom-right (already configured via `sonner.tsx`), white
  surface, small `success`/`error` icon-and-accent per Section 2's semantic colours,
  auto-dismissing — used for lightweight confirmations (e.g. "Copied") never for
  anything a visitor needs to actually read and retain (that's what dedicated
  thank-you pages are for, per the UX plan).

---

## 13. Accessibility

Target: **WCAG 2.1 AA** across the public site (several pairings, noted above, clear
AAA already).

- **Colour contrast.** Every text/background pairing in Section 2 is documented with
  its approximate ratio; the two rules that matter most in implementation are (1)
  never use `gold-500` as a text colour on paper, and (2) always verify any *new*
  colour combination introduced later against these same thresholds before shipping
  it, rather than assuming the palette is automatically safe in every pairing.
- **Keyboard focus.** Every interactive element uses the shared gold focus ring
  (Section 6) — never suppressed for aesthetic reasons. Logical tab order follows
  visual order on every page; skip-to-content link is already implemented at the
  root layout level.
- **Reduced motion.** Already enforced globally in `globals.css` — any *new* motion
  added per Section 11 must be built using standard CSS transitions/animations so it
  is automatically caught by that existing blanket rule, rather than a bespoke JS
  animation that bypasses it.
- **Touch targets.** Minimum 44×44px hit area on every tappable element on mobile,
  even where the visible icon/label is smaller (e.g. a 16px icon button still gets a
  44px tappable padding box) — this affects icon-button implementation specifically,
  since the visual `icon-sm`/`icon` sizes in Section 6 are smaller than 44px and need
  invisible padding to meet this on touch devices.
- **Screen reader considerations.** Landmark regions (`nav`/`main`/`footer`) used
  correctly on every page; every card is a single accessible link/region (not a div
  with an onClick and a separately-tabbable link buried inside); form fields always
  have a real associated `<label>`; the video/audio player exposes proper native or
  ARIA-complete controls; decorative images (the architectural texture in Section 10)
  are marked `aria-hidden`/empty-alt, while meaningful images (portraits, book
  covers, khutbah thumbnails) always carry descriptive alt text.

---

## 14. Dark Mode

**The public website stays light-mode only, by deliberate decision, not by omission.**

- The paper/ink metaphor at the centre of this brand *is* a light-mode metaphor —
  ink on paper. A dark-mode version would need a fundamentally different visual
  story (the `.dark` tokens already reserved in `globals.css` invert to navy
  background/gold-forward text, which is a legitimate *screen-reading* palette, but
  it is not "the same brand at night," it's a different register entirely).
- Every reference point in the brief (Harvard, MasterClass, Yaqeen Institute, most
  premium publishing sites) defaults to light mode for exactly this reason — long-form
  reading and scholarly credibility both read better on a light, paper-like surface
  than on a dark one, which is closer to a code editor or an entertainment app.
- Practically: the `.dark` CSS variables that already exist in `globals.css` are
  **shared infrastructure for the authenticated admin dashboard**, an internal tool
  used for extended working sessions where a dark mode has real ergonomic value — not
  a signal that the public site should offer one too. Implementation guidance: the
  public site's root layout should never apply the `.dark` class and should not
  surface a theme toggle to visitors; keep that control (if any) exclusively within
  the authenticated `/admin` shell.
- **Consistency going forward:** if a future sprint ever revisits this decision, it
  should be treated as a deliberate brand extension (a genuinely redesigned dark
  variant, reviewed the same way any other brand change would be), never as a
  mechanical "invert the existing tokens" exercise — an inverted paper/ink metaphor
  does not automatically produce a coherent dark theme.

---

## 15. Deliverables & Implementation Notes

For the development team implementing this against Next.js + Tailwind CSS +
shadcn/ui:

- **Nothing in this document requires new design tokens beyond what already exists**
  in `globals.css`'s `:root`/`@theme inline` blocks, except: the two new font
  families (Noto Naskh Arabic, Amiri Quran — both available via `next/font/google`,
  loaded the same way as the existing three fonts, and only activated once
  multilingual/Qur'an-quotation content actually ships) and the 8-point spacing
  scale in Section 4 (which should be expressed as Tailwind spacing scale entries,
  not one-off arbitrary values, so every component pulls from the same scale).
- **Every component spec above maps to an existing shadcn primitive already present
  in `src/components/ui/`** — this is a styling/usage specification layered on top
  of those primitives, not a request for new component libraries or a parallel
  design system.
- **The one net-new pattern** with no existing implementation is the button loading
  state (Section 6) and the public-site pagination component (Section 12) — both
  should be built as thin wrappers around existing primitives (`Button`, `Loader2`
  from `lucide-react`), following the same variant/size API already established in
  `button.tsx`, rather than new one-off components.
- **Testimonials remain unbuilt-but-designed** (Section 12) — the spec exists so
  that whenever real testimonials arrive, engineering can implement directly from
  this document without a follow-up design pass.
