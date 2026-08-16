# Ahmad Mohamed Kassa — Brand Asset System

This directory is the single source of truth for the Ahmad Mohamed Kassa
visual identity. Every production asset below is derived from one master:
the Arabic calligraphy mark **أَحْمَد** (Ahmad) set inside a teardrop/flame
emblem, commissioned from the client's designer.

**The professional mark is frozen and authoritative.** Its geometry is
never redrawn, reinterpreted, or approximated by AI — every asset in this
directory that shows the mark uses the exact same path data, only ever
recoloured or rescaled. If the mark itself ever needs to change, that's a
new commission from the client's designer, not a regeneration of anything
in this pipeline.

## Mark provenance

The emblem was delivered as a batch of raw designer files, now kept
**outside `public/`** in `/brand-source/` at the project root (they were
briefly, incorrectly, servable at `/brand/...` — moved out because a
designer's editable source and unreleased draft files have no reason to be
publicly downloadable):

- **`brand-source/AHMAD.ai`** — the Illustrator master. The actual
  authoritative source; everything else is exported from it.
- **`brand-source/AHMAD-06.svg`** — a clean vector export of the mark. This
  is what `logo-mark.svg` (and its colourways) copy their path data from.
- **`brand-source/just-logo.png`, `512x512.jpg`** — clean raster mark-only
  exports. Reference only, not used by the app.
- **`brand-source/AHMAD.jpg`, `New.jpg`** — designer presentation comps
  (two-tone panel, horizontal lockup mockup). Reference only.
- **`brand-source/1.png`, `2.jpg`** — Fiverr preview drafts. **Still
  carry a visible watermark.** Never reference these for anything; they're
  kept only as a paper trail for what was delivered.

No vector wordmark was ever supplied — only the mark. The Latin wordmark
("Ahmad Mohamed Kassa") has always been composed live in HTML/CSS, in
whichever layout is being built (see "Digital lockup policy" below), never
shipped as a flattened file.

## Directory contents (as of the current repair pass)

### Logo — vector (SVG)

| File | Contents | Use on |
| --- | --- | --- |
| `logo-mark.svg` | Calligraphy mark only, gold `#b8924a` | Light/ivory backgrounds |
| `logo-mark-white.svg` | Calligraphy mark only, paper `#faf8f3` | Navy / dark backgrounds |
| `logo-mark-dark.svg` | Calligraphy mark only, navy `#0f1e33` | Light backgrounds where gold can't be used (e.g. single-colour print) |
| `favicon.svg` | Mark only, gold, transparent | Browser tab icon |
| `safari-pinned-tab.svg` | Mark only, single-colour black silhouette | Safari pinned-tab mask icon (Safari recolours it at render time — see below) |

All five share identical path data (from `brand-source/AHMAD-06.svg`),
cropped to the same tight viewBox (`355 295 280 400`) — only the fill
colour and outer `<svg>` wrapper differ between them. **There is no
`logo-primary.svg` (flattened mark+wordmark lockup) file, deliberately —
see "Digital lockup policy."**

### Logo — raster (PNG), transparent background

`exports/logo-mark-{64,128,256,512,1024,2048}.png` — the mark alone, gold,
true RGBA alpha transparency, aspect ratio preserved (never stretched to a
forced square). Used wherever a raster (not SVG) mark is needed — currently
just the transactional/newsletter email header (`exports/logo-mark-256.png`).

### Favicons & platform icons

| File | Size | Background | Where it's used |
| --- | --- | --- | --- |
| `favicon.svg` | scalable | transparent | Modern browsers, `<link rel="icon" type="image/svg+xml">` |
| `favicon.ico` | 16/32/48 multi-res (embedded PNG frames) | transparent | Legacy fallback, `/favicon.ico` |
| `apple-touch-icon.png` | 180×180 | **opaque navy** | iOS/iPadOS home screen |
| `android-chrome-192x192.png` | 192×192 | **opaque navy** | Android home screen, PWA manifest |
| `android-chrome-512x512.png` | 512×512 | **opaque navy** | PWA splash/install, manifest |
| `mstile-150x150.png` | 150×150 | **opaque navy** | Windows Start tile |
| `safari-pinned-tab.svg` | scalable | n/a (single colour) | Safari pinned-tab mask icon |

Platform icons are intentionally **opaque** (navy background, mark
centred at roughly 55% of the icon's height, leaving a safe-zone margin)
rather than transparent — iOS, Android, and Windows all composite these
against their own chrome, and a transparent icon renders as a broken/black
square on several of them. `favicon.svg` and `favicon.ico` are the
exception: browser tabs already provide their own background, so
transparency is correct there.

`safari-pinned-tab.svg` is a **single-colour silhouette** (pure black
fill) — a hard Safari requirement. Safari recolours it at render time using
the `color` attribute on the `<link rel="mask-icon">` tag (set to the brand
navy in `src/app/layout.tsx`), not the fill in the file itself.

`favicon.ico` is hand-assembled (a small Node script using `sharp` to
rasterize `logo-mark.svg` at 16/32/48px, then a ~20-line hand-written
ICO-container writer — modern `.ico` files can embed PNG frames directly,
no BMP encoding needed) rather than via a new npm dependency, consistent
with this project's "no unnecessary dependencies" convention.

### Social sharing

| File | Size | Notes |
| --- | --- | --- |
| `og-image.png` | 1200×630 | Open Graph fallback — used by `buildMetadata()` for any page that doesn't opt into its own dynamic `opengraph-image` route |
| `twitter-card.png` | 1200×630 | Identical file to `og-image.png`, served for `twitter:image` |

**These are rendered through the same shared component every per-page
dynamic OG image already uses** — `renderBrandedOgImage()` in
`src/lib/og-image.tsx` (a `next/og`/Satori composition: navy background,
eyebrow, title, the site wordmark). This replaces the old approach (a
hand-edited `og-source.svg` with the wordmark shaped into vector outlines)
— that technique depended on a HarfBuzz text-shaping pipeline this project
doesn't have access to; reusing the real, already-in-production renderer
is both more reliable and more visually consistent with every other OG
image on the site than a bespoke one-off composition would be. There is no
separate "source" file to edit — regenerate by calling
`renderBrandedOgImage()` with new props (see "Regenerating these assets").

### App manifest

`manifest.webmanifest` — name, short name, theme/background colour, and
icons for PWA installability. References `android-chrome-192x192.png` and
`android-chrome-512x512.png` above.

## Digital lockup policy

The identity is frozen: **the professional emblem is the primary brand
mark**, and it is never edited. Where the site needs the mark *and* the
name together, it composes them live — mark image/SVG + real HTML text in
the site's own type (Newsreader on the web, an email-safe Georgia stack in
transactional email) — rather than shipping a second, flattened
"logo-with-text-baked-in" file.

**This is a deliberate distinction, not a shortcut:** a flattened lockup
file can't adapt its type size, can't respect the surrounding layout's
responsive behaviour, and — concretely, in this project — can't be
regenerated at all without the original text-shaping pipeline once it's
lost, exactly what happened to the old `logo-primary.svg` family. A live
digital lockup has none of these problems and is not a "replacement logo"
— it's a website-specific *composition* using the one official, unedited
mark.

**Current state of this policy across the codebase:**

- **Transactional/newsletter email** (`src/lib/email/layout.ts`) —
  implements the digital lockup today: `exports/logo-mark-256.png` at 28px
  next to `siteConfig.name` ("Ahmad Mohamed Kassa," the full name, never
  shortened) in the email's Georgia display stack.
- **Site header** (`src/components/shared/logo.tsx`) — currently shows the
  mark plus `siteConfig.shortName` ("AMK"), predating this policy.
  Updating it to the full-name digital lockup (with real optical-alignment
  tuning, not just a text swap) is explicitly reserved for the upcoming
  Editorial Refinement 2 sprint ("Typography & Hero") — not done in this
  repair pass, which fixes broken assets rather than adjusting layout.
  **Do not shorten to "Ahmad Kassa"** when that work happens — full name
  only, per the client's explicit instruction, unless a specific content
  reason (e.g. a genuinely tiny UI chrome element) calls for an
  abbreviation.
- **Footer** (`site-footer.tsx`) — same `Logo` component, inverted
  colourway, same "AMK" caveat as the header.

## Brand asset manifest

The canonical list of every production brand asset, to prevent a future
session from deleting or replacing something still in use. If you're about
to delete a file in this directory, check it against this table first.

| Path | Purpose | Source / master | Light/dark | Generated or supplied | Used in |
| --- | --- | --- | --- | --- | --- |
| `logo-mark.svg` | Primary on-site mark, light backgrounds | `brand-source/AHMAD-06.svg` path data, gold fill | Light | Generated (recoloured export) | `Logo` (header, footer default tone), `HeroEmblem`, `ManuscriptDivider`'s mark variant, `TeachingAreasSection`-adjacent uses |
| `logo-mark-white.svg` | Mark on navy/dark backgrounds | Same path data, paper fill | Dark | Generated | `Logo` (`tone="inverted"` — footer), `QuoteSection`/`NewsletterSection` watermark |
| `logo-mark-dark.svg` | Mark for single-colour/print contexts | Same path data, navy fill | Light | Generated | Not currently wired into a component; kept for parity with the light/white pair and any future print use |
| `favicon.svg` | Browser tab icon | Same path data, gold, transparent | — | Generated | `src/app/layout.tsx` metadata |
| `favicon.ico` | Legacy browser tab icon | Same path data, rasterized 16/32/48 | — | Generated | `src/app/layout.tsx` metadata |
| `apple-touch-icon.png` | iOS home-screen icon | Same path data, opaque navy 180×180 | Dark bg | Generated | `src/app/layout.tsx` metadata |
| `android-chrome-192x192.png` / `-512x512.png` | Android/PWA icons | Same path data, opaque navy | Dark bg | Generated | `manifest.webmanifest` |
| `mstile-150x150.png` | Windows tile icon | Same path data, opaque navy | Dark bg | Generated | `src/app/layout.tsx` metadata |
| `safari-pinned-tab.svg` | Safari pinned-tab mask | Same path data, black silhouette | — (recoloured by Safari) | Generated | `src/app/layout.tsx` metadata |
| `og-image.png` / `twitter-card.png` | Social-share fallback image | `renderBrandedOgImage()` (`src/lib/og-image.tsx`), real text via Satori | Dark card | Generated | `src/config/site.ts`'s `ogImage`/`twitterImage`, consumed by `buildMetadata()` |
| `exports/logo-mark-*.png` | Raster mark ladder | Same path data | Light (gold) | Generated | Email header (`logo-mark-256.png`) |
| `manifest.webmanifest` | PWA manifest | Hand-written JSON | — | Supplied/hand-written | `src/app/layout.tsx` metadata |
| `brand-source/AHMAD.ai` | Master source | Designer-commissioned | — | Supplied (authoritative) | Never referenced by app code — regeneration source only |
| `brand-source/AHMAD-06.svg` | Clean vector export | Designer-commissioned | — | Supplied | Source for every `logo-mark*.svg`/raster export above |

## Usage in code

```ts
import { brand } from "@/config/brand";

brand.logo.mark;      // "/brand/logo-mark.svg"
brand.logo.favicon;   // "/brand/favicon.svg"
brand.colors.primary; // "#0f1e33"
brand.colors.accent;  // "#b8924a"
```

Next.js metadata (icons, Open Graph, Twitter, manifest, theme colour) is
wired centrally in `src/lib/seo.ts` and `src/app/layout.tsx` — every page
inherits it automatically via `buildMetadata()`. Don't hand-roll
`<link rel="icon">` tags on individual pages.

## Brand colours

| Token | Hex | Role |
| --- | --- | --- |
| Primary (Deep Navy) | `#0f1e33` | Backgrounds, primary text on light, theme colour |
| Accent (Gold) | `#b8924a` | The mark, dividers, small emphasis — **accent only, never a fill colour for large areas** |
| Background (Soft Ivory) | `#faf8f3` | Light-mode background |
| Text (Near Black) | `#17181c` | Body copy on light backgrounds |
| Muted (Warm Stone) | `#706c63` | Secondary text, captions |

These five tokens live in `src/config/brand.ts` and match the real
on-page design tokens in `src/app/globals.css` (`--navy-900`, `--gold-500`,
`--paper-50`, `--ink-900`, `--stone-600`) — used for theme-color/manifest/
favicon metadata, which must reflect the actual site rather than an
earlier approximation. See `docs/CREATIVE_DIRECTION.md` for the reasoning
behind the palette and `docs/DESIGN_SYSTEM.md` for the full token system.

**Gold is an accent, not a fill.** Every asset in this system uses gold for
the mark and hairline details only — never as a large background field.
Backgrounds are navy or ivory; gold appears only where it does work.

## Typography

- **Arabic mark** — a commissioned illustrated calligraphy mark (see "Mark
  provenance" above), not set in a font. The diacritics were reviewed on
  delivery — if they ever look wrong, that's a question for whoever
  produced `brand-source/AHMAD.ai`, not a font substitution.
- **Latin wordmark** — Newsreader on the web (the same serif used
  site-wide for display type); an email-safe Georgia stack in
  transactional email (see "Digital lockup policy"). Both are live text,
  never a flattened image.

## Accessibility

- Every SVG has a `<title>` and `role="img"`/`aria-label` describing its
  content ("Ahmad" for the mark-only files) for screen readers.
- Colour is never the only signal: the mark is legible as pure shape
  (gold-on-ivory, white-on-navy, navy-on-ivory all meet WCAG AA contrast
  at the sizes these assets are used).
- `safari-pinned-tab.svg` and `favicon.svg` remain legible as flat
  silhouettes at 16px — verify this again if the mark is ever redrawn.
- When embedding a logo file inline in HTML (not as an `<img>`), keep the
  `<title>` element intact rather than stripping it as "dead weight" —
  it's the accessible name.

## Regenerating these assets

Every generated file in this directory derives from the same source of
truth (`logo-mark.svg`'s path data, itself copied from
`brand-source/AHMAD-06.svg`) via a short, disposable Node script (using
`sharp`, already a project dependency, plus a ~20-line hand-rolled ICO
writer for `favicon.ico` and a direct call to `renderBrandedOgImage()` for
the social-share fallback) — not a checked-in build tool, and not
something that runs on `next build`. If the mark's geometry is ever
formally updated (a new commission, not a redraw), regenerate deliberately
in this same way and re-review every file, especially the accessibility
notes above.

**Never regenerate by asking an AI to redraw or approximate the mark** —
every step here is a mechanical recolour/rescale/rasterize of the exact
same path data, never an interpretation of it.
