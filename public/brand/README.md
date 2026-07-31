# Ahmad Mohamed Kassa — Brand Asset System

This directory is the single source of truth for the Ahmad Mohamed Kassa
visual identity. Every asset below is generated from one master: the Arabic
calligraphy mark **أَحْمَد** (Ahmad), vocalized with the correct ḥarakāt
(fatḥa · sukūn · fatḥa), paired with the Latin wordmark **AHMAD / MOHAMED
KASSA**.

The Arabic mark is built from real, HarfBuzz-shaped Unicode text converted to
vector outlines (Amiri Bold) — not a traced or hand-drawn approximation — so
every joining form and diacritic is guaranteed linguistically correct.

## Directory contents

### Logo — vector (SVG)

| File | Contents | Use on |
| --- | --- | --- |
| `logo-primary.svg` | Full lockup: mark + "AHMAD" + "MOHAMED KASSA" + diamond mark, gold mark / navy "AHMAD" / gold "MOHAMED KASSA" | Light backgrounds |
| `logo-primary-white.svg` | Full lockup, all white | Navy / dark / photo backgrounds |
| `logo-primary-dark.svg` | Full lockup, all navy | Light backgrounds where gold can't be used (e.g. single-colour print) |
| `logo-mark.svg` | Calligraphy mark only, gold | Light backgrounds, square/compact placements |
| `logo-mark-white.svg` | Calligraphy mark only, white | Navy / dark / photo backgrounds |
| `logo-mark-dark.svg` | Calligraphy mark only, navy | Light backgrounds, single-colour print |

All six are hand-composed vector paths (no embedded fonts, no raster data,
no unnecessary editor metadata) and scale losslessly to any size, including
print.

**Horizontal lockup**: there is no separate `logo-horizontal.svg` file — in
production, the horizontal arrangement (mark left, wordmark right, as used
in the site header and the Open Graph image) is composed live from
`logo-mark.svg` + text, exactly like `src/components/shared/logo.tsx` does.
Shipping it as a fixed file would fight the site's own responsive header
layout; composing it live doesn't.

### Logo — raster (PNG), transparent background

`exports/logo-mark-{64,128,256,512,1024,2048}.png` and
`exports/logo-primary-{1024,2048}.png`. The mark ships at the full size
ladder since it's the asset used at icon scale; the full lockup only ships
at the two largest sizes since a full wordmark is illegible much below
that (print, slide decks, letterheads — never favicons).

All PNGs are true RGBA with alpha transparency, aspect ratio preserved
(never stretched to a forced square).

### Favicons & platform icons

| File | Size | Background | Where it's used |
| --- | --- | --- | --- |
| `favicon.svg` | scalable | transparent | Modern browsers, `<link rel="icon" type="image/svg+xml">` |
| `favicon.ico` | 16/32/48 multi-res | transparent | Legacy fallback, `/favicon.ico` |
| `apple-touch-icon.png` | 180×180 | **opaque navy** | iOS/iPadOS home screen |
| `android-chrome-192x192.png` | 192×192 | **opaque navy** | Android home screen, PWA manifest |
| `android-chrome-512x512.png` | 512×512 | **opaque navy** | PWA splash/install, manifest |
| `mstile-150x150.png` | 150×150 | **opaque navy** | Windows Start tile |
| `safari-pinned-tab.svg` | scalable | n/a (single colour) | Safari pinned-tab mask icon |

Platform icons are intentionally **opaque** (navy background, mark
centred with a safe zone) rather than transparent — iOS, Android, and
Windows all composite these against their own chrome, and a transparent
icon renders as a broken/black square on several of them. `favicon.svg`
and `favicon.ico` are the exception: browser tabs already provide their
own background, so transparency is correct there.

`safari-pinned-tab.svg` is a **single-colour silhouette** (pure black
fill, no gradients or multiple colours) — this is a hard Safari
requirement. Safari recolours it at render time using the `color`
attribute on the `<link rel="mask-icon">` tag (set to the brand navy in
this project's metadata config), not the fill in the file itself.

### Social sharing

| File | Size | Notes |
| --- | --- | --- |
| `og-image.png` | 1200×630 | Open Graph — Facebook, LinkedIn, WhatsApp, iMessage, etc. |
| `twitter-card.png` | 1200×630 | Identical composition, served for `twitter:image` (Twitter's `summary_large_image` card uses the same 1200×630 aspect, so one design serves both) |

Composition: deep navy background (subtle radial gradient, not flat, for
depth without noise), a thin gold hairline frame, the gold calligraphy
mark, a gold divider rule, and the wordmark ("AHMAD" in white, "MOHAMED
KASSA" in gold). No photography, no tagline — deliberately minimal so it
reads instantly at thumbnail size in a social feed.

`og-source.svg` is the editable vector source both PNGs were rendered
from — edit this and re-rasterize rather than touching the PNGs by hand.

### App manifest

`manifest.webmanifest` — name, short name, theme/background colour, and
icons for PWA installability. See [Manifest](#manifest) below for the
exact values and why they were chosen.

## Usage in code

```ts
import { brand } from "@/config/brand";

brand.logo.primary;   // "/brand/logo-primary.svg"
brand.logo.mark;      // "/brand/logo-mark.svg"
brand.logo.favicon;   // "/brand/favicon.svg"
brand.colors.primary; // "#0B1F36"
brand.colors.accent;  // "#C6A15B"
```

Next.js metadata (icons, Open Graph, Twitter, manifest, theme colour) is
wired centrally in `src/lib/seo.ts` and `src/app/layout.tsx` — every page
inherits it automatically via `buildMetadata()`. Don't hand-roll
`<link rel="icon">` tags on individual pages.

## Brand colours

| Token | Hex | Role |
| --- | --- | --- |
| Primary (Deep Navy) | `#0B1F36` | Backgrounds, primary text on light, theme colour |
| Accent (Gold) | `#C6A15B` | The mark, dividers, small emphasis — **accent only, never a fill colour for large areas** |
| Background (Soft Ivory) | `#FAFAF8` | Light-mode background |
| Text (Near Black) | `#111111` | Body copy on light backgrounds |
| Muted (Neutral Grey) | `#6B7280` | Secondary text, captions |

These five tokens are the canonical brand palette and live in
`src/config/brand.ts`. They are intentionally close to, but not always
identical to, the existing Tailwind design tokens in `src/app/globals.css`
(`--navy-900`, `--gold-500`, `--paper-50`, etc.), which were established in
an earlier design pass. The two systems weren't merged in this pass to
avoid an unrequested site-wide re-theme — `brand.ts` is the source of
truth for brand/marketing assets (this folder, metadata, social cards);
`globals.css` remains the source of truth for on-site UI. If the two are
ever unified, `globals.css` should be brought in line with `brand.ts`, not
the reverse.

**Gold is an accent, not a fill.** Every asset in this system uses gold for
the mark and hairline details only — never as a large background field.
Backgrounds are navy or ivory; gold appears only where it does work.

## Typography

- **Arabic mark** — Amiri Bold. Chosen specifically for correctness: Amiri
  is a meticulously produced revival of classical Naskh with exceptionally
  reliable ḥarakāt (diacritic) positioning, which mattered because the
  first version of this mark had incorrect/decorative diacritics. Do not
  swap this for a more "decorative" Arabic font without checking its
  ḥarakāt rendering as carefully as Amiri's was checked.
- **Latin wordmark** — Newsreader (the same serif already used site-wide
  for display type), at weight ~560 for "AHMAD" and ~430 for "MOHAMED
  KASSA", both letter-spaced. Using the site's existing display face here
  ties the logo typographically to the rest of the site rather than
  introducing a third typeface.

## Accessibility

- Every SVG has a `<title>` and `role="img"`/`aria-label` describing its
  content ("Ahmad Mohamed Kassa" or "Ahmad") for screen readers.
- Colour is never the only signal: the logo is legible as pure shape
  (gold-on-navy, navy-on-ivory, or white-on-navy all meet WCAG AA contrast
  at the sizes these assets are used).
- `safari-pinned-tab.svg` and `favicon.svg` remain legible as flat
  silhouettes at 16px — verify this again if the mark is ever redrawn.
- When embedding a logo file inline in HTML (not as an `<img>`), keep the
  `<title>` element intact rather than stripping it as "dead weight" —
  it's the accessible name.

## Regenerating these assets

These files were generated, not hand-drawn in an editor. The build
pipeline (HarfBuzz + fontTools shaping → composed SVG → resvg rasterization)
lives outside this repo's build step by design — regenerating brand assets
is a deliberate, reviewed action, not something that should run on every
`next build`. If the mark, wordmark, or palette ever changes, regenerate
deliberately and re-review every file in this directory, especially the
Arabic diacritics.
