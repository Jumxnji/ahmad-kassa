# Sprint 23 — Final Visual Polish: Header, Homepage Transitions, Footer

## Brief

The homepage is structurally approved and design-frozen. This is a
targeted polish pass on the two persistent brand anchors (header,
footer) plus two specific homepage section transitions the client
flagged after review — not a reopening of any content section. Hero,
Featured Book, About's content, Teaching Areas' entries, Latest
Khutbah, Future Courses' cards, Ask Ahmad's content, Newsletter,
colours, fonts, logo artwork, and navigation structure are all
explicitly out of scope.

## 1. Header lockup

**Diagnosis** (from the preceding audit, confirmed here): the emblem
and wordmark were each individually centered correctly via flexbox
`items-center`, but the emblem's ink — a droplet shape, thin point at
top, full round base — carries more visual weight low in its own box,
while "Ahmad Mohamed Kassa" has no descenders, so its own ink sits
high in its line-box. Two mathematically-correct centerings produced
ink that visually disagreed: the droplet's round base hung below the
text baseline.

**Fix**: `src/components/shared/logo.tsx` — mark height `h-9` (36px) →
`h-8` (32px), gap `gap-2 sm:gap-3` (8/12px) → `gap-2 sm:gap-2.5`
(8/10px), mark given `-translate-y-0.5` (Tailwind's exact -2px step).
Values were fine-tuned live in-browser at zoom, not applied blind:
`-translate-y-0.5` (-2px) read as correctly composed; a `-3px` test
visibly overshot. Verified at ~545px, 768px (implied by the shared
component), 1024px, and 1440px — the misalignment was width-independent
(driven by the fixed-height emblem, not responsive text sizing), so one
fix applies everywhere. Confirmed working in both `tone="default"`
(paper header) and `tone="inverted"` (navy footer) — `Logo` is shared,
no per-context divergence.

No SVG file, path data, or wordmark text changed.

## 2. About → Teaching Areas transition

**Measured** (Tailwind source, `src/components/shared/section.tsx`):
`AboutPreviewSection` uses `Section`'s `default` size (`py-20 sm:py-28`
— 80px/112px bottom), `TeachingAreasSection` uses `size="lg"` (`py-28
sm:py-36` — 112px/144px top). Combined desktop gap: 256px. Confirmed
visually as excessive, live in-browser.

**Considered**: A) spacing-only (~20–30% reduction); B) spacing +
one hairline between sections; C) a tiny archival register signalling
person → subjects. **A won** — tested live (screenshot comparison at
the same scroll position, not just class-name reasoning) and it
resolved the complaint on its own; adding B or C on top would have
been decoration the brief explicitly didn't ask for once the actual
problem (excess space, not missing structure) was fixed.

**Fix**: `TeachingAreasSection`'s `Section` given `className="pt-16
sm:pt-20"` (64px/80px), overriding only its own top padding — `size="lg"`
and its bottom padding are untouched (still correct for the transition
*into* the Quote section after it). `AboutPreviewSection` was not
touched at all. New combined gap: 144px (mobile) / 192px (desktop) — a
25% reduction at both breakpoints, deliberately proportional rather
than an arbitrary number.

## 3. Future Courses → Ask Ahmad transition

**Measured**: `FutureCoursesSection` uses `Section`'s `default` size
(80/112px bottom, untouched), `CtaSection` (Ask Ahmad) also used
`default` (80/112px top) plus its own `ManuscriptDivider`'s `mb-14`
(56px) before the eyebrow. The divider itself sits at the very top of
`CtaSection`'s own padded box — i.e. already adjacent to "Ask Ahmad,"
not floating mid-gap — so the perceived "floating divider" was really
the *approach* to it: 192px of combined section padding before a
reader ever reaches it.

**Considered**: A) keep centered Ask Ahmad, reduce the gap
substantially; B) keep the divider, move it structurally closer to Ask
Ahmad; C) rework Ask Ahmad into a more editorial (non-centered)
composition. **A won** — since the divider already sits at the
boundary of `CtaSection`'s own content, tightening that section's own
top padding *is* "moving the divider closer to Ask Ahmad" (B), just
via the actual lever available, without restructuring anything. C was
not attempted; nothing in live testing suggested the centered
composition itself was failing.

**Fix**: `CtaSection`'s `Section` given `className="pt-12 sm:pt-12
text-center"` (48px, flat across breakpoints — chosen because the live
test target was one concrete value, not a responsive ramp). One bug
caught and fixed during implementation: the first attempt used
`className="pt-12"` alone, and — because `sm:py-28` is a *different*
Tailwind utility from the unprefixed `pt-12`, not a variant of it —
`twMerge` correctly left `sm:py-28` in place at `sm:` and above, so the
override silently did nothing at desktop widths. Confirmed via
`getComputedStyle` before and after; the fix is to always pair an
override with the same responsive prefixes as what it's overriding.
`FutureCoursesSection` was not touched. **Ask Ahmad's own composition
(centred layout, copy, CTAs) did not change** — only the space before
it.

## 4. Footer — two-zone composition

**Before**: opening row was `flex ... sm:justify-between` — brand
lockup at the far left, `SITE_TAGLINE` at the far right, both isolated
at the edges of a `container-ultra` (96rem) field; the Explore/Connect
nav grid sat capped at `max-w-2xl` directly under the logo, leaving
roughly half the wide desktop field empty on the right.

**Fix**: `src/components/layout/site-footer.tsx` restructured into two
zones at `lg` (1024px) and above — left zone (`lg:w-[38%]`): logo with
the tagline now stacked directly beneath it (not split across the row);
right zone (`lg:w-[52%]`, `max-w-2xl` cap removed): Explore/Connect
(and the confirmed-social-icons block, when present), positioned via
`lg:justify-between` on the shared parent. Below `lg`, both zones stack
in one column, in source order — logo, tagline, then the nav grid, the
same shape the mobile layout already read well in before this change
(confirmed by testing, not assumed). Legal row is unchanged and stays
full-width below both zones at every size. Mission wording, the
`hasConfirmedProfile()` gate (still renders zero icons — no
placeholders added), legal links, and the language selector are all
untouched.

## 5. Homepage rhythm pass

Scrolled the full homepage top to bottom after all four fixes. About →
Teaching Areas now reads as a deliberate pause, not a gap. Future
Courses → Ask Ahmad reads as connected rather than a CTA floating in
empty space. Ask Ahmad → Newsletter was not touched by this sprint and
was re-checked live to confirm the Ask Ahmad spacing change didn't
disturb it — it didn't (Newsletter is its own navy section with its
own independent padding). The footer now reads as a deliberate two-zone
conclusion rather than a left-heavy sitemap. The header lockup reads as
one composed mark across every page checked. No further transition
issue was found; no new work was started.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean.
- `npx vitest run` — 35/35 passing.
- `npm run build` — clean; all routes generated, including `/books/the-great-debate` (SSG).
- Live-browser checked at ~545px (this environment's actual mobile
  floor) and ~1440–1520px for the homepage; ~545px and ~1520px for
  `/courses`, `/about`, `/books`, `/contact` specifically because
  header/footer are global and needed a cross-page regression check.
- Zero console errors on any of the five pages checked, both before
  and after a hard reload.
- Keyboard focus verified directly on the header logo link
  (`getComputedStyle` — `outline-style: auto`, the sitewide focus-ring
  token, unchanged by the lockup's own transform/size edit).
- Sitewide `prefers-reduced-motion` CSS override confirmed still
  present and unaffected — no new motion was introduced by this sprint.
- One real bug was found and fixed during implementation (see Section
  3) via direct `getComputedStyle` inspection, not assumed from the
  className alone — every spacing change in this sprint was confirmed
  the same way, not just visually inferred.

## Documentation

`docs/UX_ARCHITECTURE.md`: two stale footer descriptions corrected —
Section 4's own wireframe/notes (still described a footer newsletter
column removed back in Sprint 16, and the pre-Sprint-14 4-column/
accordion mobile plan) and the mobile-breakpoints inventory's footer
bullet (same accordion/newsletter-column staleness). Both now describe
the actual Sprint 23 two-zone layout and its real mobile behavior.

## Notes

This sprint touched exactly four files:
`src/components/shared/logo.tsx`,
`src/components/sections/teaching-areas-section.tsx`,
`src/components/sections/cta-section.tsx`,
`src/components/layout/site-footer.tsx` — plus documentation. No
content, copy, colour, font, or navigation-structure change anywhere.
Homepage design-freeze status is unchanged; this is chrome/spacing
polish under the freeze's own "content-driven and defect corrections
are fine" allowance, not a reopening of it.
