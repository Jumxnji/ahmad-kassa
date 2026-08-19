# Sprint 21: About — Full Editorial Rebuild

## Brief

The Secondary Pages Editorial Audit flagged `/about` as needing
structural work: a navy emblem-placeholder panel where the real,
already-approved portrait now exists (Sprint 17), gold pill credential
badges out of step with the mature mono/archival idiom established
elsewhere, and a body that repeated the same eyebrow → heading →
paragraph shape (Education, Professional background, Islamic Teaching,
Public Speaking, Books, Research Interests) six times in a row,
including a dotted/connected Timeline component the brief explicitly
named as an anti-pattern to remove. Homepage stayed frozen throughout.

## The portrait

`/about` previously called `<PortraitFrame />` with no `src` — it was
still showing the "no photo yet" emblem placeholder, unlike the
homepage's About Preview section, which has used the real portrait
since Sprint 17. The fix: pass `CURRENT_PORTRAIT.about.src` (the same
1122×1402 crop the homepage preview already uses) rather than
`CURRENT_PORTRAIT.hero.src` — this crop already shows meaningfully
more of the frame than Hero's tighter 880×880 square (visible jacket
and chest, not just a close head crop), satisfying the brief's request
for "more of the vertical portrait than Hero" without commissioning or
generating a new crop file. `priority` is set, since the portrait is
the first substantial image on the page and sits above the fold.

## Composition considered

Direction A (portrait in a controlled column beside eyebrow/name/lede/
credential notation) was selected. It wasn't chosen for convenience —
the homepage's own About Preview section (frozen, already shipped)
already runs almost exactly this composition (`lg:grid-cols-[0.55fr_
1.45fr]`, sticky portrait, unquoted lede, mono margin index, all using
the same `about` crop) as the direct teaser for this exact page. Since
`/about` is literally where that preview's "Read the full biography"
link leads, building its opening as a fuller, unlinked version of the
same proven composition was judged stronger than introducing a second,
unrelated visual language for the same person on an adjacent page.
Direction B (portrait larger and offset, narrower text) and Direction
C (narrow portrait, wide text) were both live-reasoned against this
precedent and rejected: B would read as competing with, not extending,
the homepage's version; C would under-use the one asset the brief
specifically wanted foregrounded.

## Credential pills → marginal index

The four gold `Badge` pills ("Khateeb," "Author," "Islamic Speaker,"
"Ruqyah since 2009") are gone. The underlying facts weren't deleted —
they're reframed as a `CREDENTIAL_INDEX`, the exact same four lines as
the homepage About Preview's `MARGIN_INDEX` ("Arabic & Islamic Studies
— Kuwait," "PGCE — University of London," "Khateeb — Masjid Al-Noor,
East London," "Ruqyah — practising and teaching since 2009"), in the
same `font-mono text-[11px] tracking-[0.06em] text-stone-500` idiom.
One set of verified facts, reused, not re-derived or reworded for this
page.

## Lede copy audit

The previous lede — "committed to grounded scholarship... carried with
the clarity today's seeker needs" — was vaguer marketing language, not
a specific factual claim, and not present anywhere else in the site's
approved copy. It didn't use any of the site's forbidden titles
(Scholar/Sheikh/Imam/Ustadh), but its tone drifted further from the
concrete, source-grounded register the rest of the page now uses.
Replaced with the same factual framing as the homepage About Preview's
lede ("An Islamic teacher, author, and Khateeb — trained in Arabic and
Islamic Studies in Kuwait, and shaped by a parallel career in academia
and consultancy") — directly traceable to the Biography section's own
first two paragraphs, and consistent with the homepage precedent this
page extends.

## Section rhythm

- **Education + Professional background** merged into one asymmetric
  spread (`lg:grid-cols-[0.42fr_0.58fr]`): a narrow marginal index on
  the left (mono era label, title, detail, hairline-divided — no
  icons, no circles) beside the Professional background prose on the
  right. Two repeated eyebrow blocks became one composition.
- **Islamic Teaching + Public Speaking** merged under a single
  `Eyebrow` ("Teaching & speaking") with two mono-labeled sub-blocks
  ("In the classroom" / "On the minbar and beyond") side by side,
  rather than two full separate eyebrow+heading pairs. Genuine prose
  content unchanged.
- **Research Interests** badges (`Badge variant="outline"` pills)
  replaced with a single mono, middot-separated line — the same
  archival idiom as everything else on the page, not a second visual
  system for "tags."
- **Timeline** removed outright, not reskinned. It was first rebuilt as
  a hairline-divided era-list (no circles, no connecting spine — the
  explicit anti-patterns named in the brief), but on review every one
  of its 8 entries duplicated a fact already stated in Education,
  Academia, Teaching & Speaking, Books, or the credential index — the
  page's biography a second time, not new information. Removing it
  outright, rather than keeping a better-looking restatement, is what
  actually serves "profile in a serious publication": no genuine
  biography content was lost, since every fact already lives in the
  section it's actually about.
- **Books** section keeps its existing structure but now quotes the
  book's real, Sprint-20-corrected description ("a critical analysis
  of Ruqyah and the use of jinn...") instead of the old, incorrect
  "examines belief in God" framing — this page was quietly carrying
  the same stale copy the Books-index correction fixed.
- **Mission** (navy pull-quote) and **Future academy** (closing CTA)
  sections are unchanged — both already read as genuinely different
  moments, not repeats of the same pattern.

`ScrollReveal` (the existing homepage-proven fade-up-on-scroll
component) wraps each restructured section — no new animation system,
no portrait motion of any kind.

## Portrait restraint

Exactly one portrait treatment on the page, at the top. Not repeated
in the Education, Teaching, Books, or closing sections. The brand mark
remains available only through the global header/footer, as before —
no watermark or second mark placement was added.

## Mobile

Verified at ~545px (this environment's actual floor). The desktop
portrait `max-w` (`max-w-sm`, 384px) was found to make the portrait
dominate essentially the entire first mobile viewport on first pass —
tightened to `max-w-[14rem] sm:max-w-sm` so name, eyebrow, and the
start of the lede are visible in the same first screen as the
portrait, while still preserving full eye contact and jacket context.
Portrait-first DOM order (matching the homepage About Preview's own
mobile stacking) was kept after live comparison — reordering to text-
first read as detached from the name it introduces.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean.
- `npx vitest run` — 35/35 passing.
- `npm run build` — clean; `/about` static.
- Live-browser checked at ~545px, 768px, 1024px, and 1440px. Zero
  console errors. Portrait loads correctly (confirmed past the
  Framer-Motion `whileInView` paint-lag this project's browser
  automation has repeatedly hit — a scroll nudge resolves it, not a
  real bug).

## Notes

Both `/books` (correction) and `/about` (full rebuild) are secondary-
page work under the still-active homepage design freeze — no homepage
section's code, copy, or composition changed in this sprint. Full
audit-outcome addendum: `docs/SECONDARY_PAGES_EDITORIAL_AUDIT.md`'s
"About Editorial Rebuild Outcome" section.
