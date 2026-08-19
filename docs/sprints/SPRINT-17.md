# Sprint 17 — Editorial Refinement 5: Professional Portrait Integration

Follows Sprint 16's full-page creative-director pass. A distinct brief: the
client supplied the first approved professional photograph of Ahmad
Mohamed Kassa (`headshot.png`) and asked for it to activate the Hero Mode
A/B architecture (built in Sprint 11 for exactly this moment) and replace
the About section's emblem placeholder — without redesigning the
homepage, undoing ER1–ER4, or replacing the professional mark.

## Source image handling

The delivered file (`/Users/website/Downloads/headshot.png`, 1122×1402,
8-bit RGB, ~1.9MB) was inspected directly before any processing. Assessed:
sharp, well-lit, natural cream/navy colour palette that already sits
inside the site's own system, centred face with direct eye contact, the
kufi's pattern crisp and fully legible, roughly a native 4:5 aspect ratio.

The original was copied byte-for-byte into `portrait-source/ahmad-mohamed-
kassa-headshot-original.png` at the project root — kept outside `public/`,
mirroring the existing `brand-source/` provenance convention (a delivered
master file has no reason to be publicly servable at full resolution).
Verified identical via `diff` after copying. Two web-ready JPEG crops were
derived from that one source with `sharp` (already a project dependency)
and written to `public/portraits/`:

- `ahmad-mohamed-kassa-hero.jpg` — 880×880, a tighter square crop
- `ahmad-mohamed-kassa-about.jpg` — 1122×1402, the full chest-up frame

No retouching, no AI reconstruction, no alteration to facial features,
glasses, clothing, or the kufi — both files are direct crops of the
original pixels.

## Hero crop/treatment

A tight, shoulders-up square crop (left 131, top 30, 880×880 from the
source) — small headroom above the kufi, ends around the collar, eyes
landing naturally in the upper-40% of the frame. Chosen over showing the
full original frame (which, cropped to a square, still included the whole
jacket and read as loose, not "tighter/more formal" as the brief asked
for). Reads as an author-profile photograph, not a LinkedIn headshot.
Rendered via `PortraitFrame`'s existing `aspect-4/5`-overridden-to-
`aspect-square` box (unchanged from Sprint 16's mobile-scale fix) — the
Mode A/B architecture required zero layout changes, exactly as it was
built to allow. `priority` is set (this is the largest above-the-fold
image on the homepage).

## About crop/treatment

The near-complete original frame (1122×1402, i.e. essentially uncropped)
— showing the full jacket and more context than the Hero crop, per the
brief's own suggested Hero/About pairing. Rendered inside `PortraitFrame`'s
existing `aspect-4/5` box (also unchanged) in the sticky media column. Not
`priority` — lazy-loaded, since About sits below the fold behind Hero and
Featured Book.

Both crops come from one photograph and read as clearly related, but are
deliberately not the same framing, satisfying the brief's "complementary,
not duplicated" requirement.

## Emblem in the composition

No new mark placement was added to either section. The brand mark remains
present as supporting brand language through what was already there and
untouched: the header/footer `Logo` (visible on every page, including the
homepage, in the same viewport as the Hero) and Mode A itself (`HeroEmblem`),
which stays in the codebase as the "no photo yet" fallback rather than being
deleted. This was a deliberate minimal choice — the brief explicitly warned
against "portrait + giant logo + another watermark + divider logo all at
once," and asked for only one supporting treatment "if possible"; the
safest, most restrained option was to add nothing new rather than invent a
second treatment on top of what the mark already does sitewide.

## Mode A vs Mode B assessment

Compared directly in-browser by temporarily toggling `HERO_VISUAL` back to
`"emblem"`, screenshotting, then reverting to `"portrait"`. Mode B is
clearly stronger: the same visual-column position that held an elegant but
abstract calligraphy mark now holds a real, direct-eye-contact photograph,
which reads as considerably warmer and more trustworthy without giving up
any of the editorial restraint — no circular avatar, no card chrome, no
frame. The photograph's cream jacket and ivory background blend almost
seamlessly into the hero's own paper background, so the composition still
reads as one coherent surface, not "a photo pasted into a template." Mode A
remains in the codebase, fully functional, as the documented fallback for
if a future portrait is ever unavailable.

## Mobile-specific decisions

No structural reordering. The Hero's existing mobile order (identity copy
→ CTAs → visual, from `order-1`/`order-2` set in Sprint 11) was left
exactly as is — this is a photograph occupying an existing slot, not a
reason to redesign the mobile flow, and the brief restricted structural
changes to only what the photograph required. The one thing the photograph
did require was already fixed in Sprint 16: the visual's mobile width cap
(`max-w-[260px]`) — without that prior fix, the portrait would have filled
nearly the full mobile viewport width. Verified at 390px: the portrait
reads as an intentional, correctly-scaled element with real eye contact,
not a giant, uncontrolled image.

## Performance/image optimisation

Both crops are already reasonably sized (105KB/175KB JPEG) before Next.js's
own optimisation layer touches them. `next.config.ts` already configures
AVIF/WebP negotiation (`images.formats`), so no source-format work was
needed — confirmed live: the Hero portrait request resolves through
`/_next/image?...&w=828&q=75`, Next's standard responsive-resize pipeline,
returning `200`. `PortraitFrame` uses `fill` + `sizes="(min-width: 1024px)
40vw, 80vw"` (matching the box's real rendered width at each breakpoint) —
the same `fill`-based pattern already established by `BookCover`, so no
layout shift is introduced (the parent box's own `aspect-4/5`/`aspect-
square` classes reserve the space before the image loads). `priority` is
set only on the Hero instance; About lazy-loads.

## What was deliberately not done

- No new mark/watermark placement added anywhere (see "Emblem in the
  composition" above).
- No mobile ordering change beyond what Sprint 16 already fixed.
- No image caption added to About — reviewed and judged unnecessary; the
  section's own heading and lede already identify who's pictured.
- No retouching or colour grading of the photograph.
- No portrait placements added to the footer, header, loading screen,
  book sections, Newsletter, or Ask Ahmad CTA — the brief's explicit "keep
  it special" instruction.
- Mode A (`HeroEmblem`) was not deleted from the codebase.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint src --max-warnings=0` — clean.
- `npx vitest run` — 35/35 passing.
- `npm run build` — all 34 routes generated successfully.
- Live-browser check of the homepage at ~390px and ~1568px: Hero Mode B and
  About both render the real photograph correctly; Mode A vs Mode B
  side-by-side comparison performed and documented above.
- Console/network check: no errors, portrait request resolves through
  Next's image-optimisation pipeline at `200`.
- Confirmed `portrait-source/ahmad-mohamed-kassa-headshot-original.png` is
  byte-identical to the originally supplied file (`diff`).
