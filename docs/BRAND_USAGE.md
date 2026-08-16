# Ahmad Mohamed Kassa Brand Usage

Quick-reference rules for where and how the mark and wordmark appear. For the full
manifest (every production file, its source, and every consumer) see
`public/brand/README.md`. For the reasoning behind these rules see
`docs/CREATIVE_DIRECTION.md`; for implementation detail see `docs/DESIGN_SYSTEM.md`.

**There is no flattened "Primary Logo" or "Secondary Logo" file.** No horizontal
lockup, no vertical lockup — neither exists as a production asset, and neither is
planned. The identity is one frozen mark (below) plus live wordmark text, composed
per-context. Treat any reference elsewhere to `logo-primary.svg`, a horizontal
lockup, or a vertical lockup as stale.

---

## The Brand Mark

Arabic calligraphy "Ahmad" inside a teardrop/flame emblem. Commissioned, frozen —
never redrawn, reinterpreted, or AI-approximated. Source: `brand-source/AHMAD.ai`
(Illustrator master) and `brand-source/AHMAD-06.svg` (clean vector export); every
production file (`public/brand/logo-mark*.svg`, favicons, platform icons, OG images,
email mark) is a mechanical recolour/rescale of that same path data.

**Confirmed live today:**

- Loading screen (`src/components/shared/loading-screen.tsx`) — the mark, gentle
  breathing opacity/scale pulse
- Favicon, browser tab, platform icons (Section: Favicons in `public/brand/README.md`)
- Watermark — `QuoteSection` and `NewsletterSection`, full-bleed behind the text at
  5% opacity
- Section dividers — `ManuscriptDivider`'s optional `mark` prop (used on the
  homepage `CtaSection`; not applied to `not-found.tsx`'s divider today, which is
  plain)
- Footer emblem — inverted-colourway mark next to the wordmark, `SiteFooter`
- Header — mark next to the wordmark, `Logo` component
- Newsletter/transactional email — mark PNG next to live wordmark text (the digital
  lockup, `src/lib/email/layout.ts`)

**Not confirmed as a current production placement — remove from this list if a
future audit still finds nothing, or wire up if genuinely wanted:**

- 404 page — `src/app/(site)/not-found.tsx` does not currently render the mark
  (plain `ManuscriptDivider`, no `mark` prop set)
- Social avatar — no dedicated social-profile-avatar asset has been generated; the
  raster mark ladder (`public/brand/exports/logo-mark-512.png`) could serve this
  purpose if/when real social profiles are set up (see `SOCIAL_LINKS` in
  `src/constants/site.ts`, still placeholder URLs)
- Admin login — not verified in this pass; note that the public `/login` route is
  the *student*-portal placeholder ("Student accounts aren't open yet"), not the
  staff admin login — don't confuse the two when checking this
- Academy portal (`/academy`) — currently a bare placeholder route, not confirmed to
  feature the mark

---

## Background Watermark

Maximum opacity: **5%** (confirmed live: `QuoteSection`/`NewsletterSection` both use
exactly `opacity-[0.05]`). Never exceed 8%.

---

## Colours

Gold (`#b8924a`), Navy (`#0f1e33`), Ivory (`#faf8f3`) — see `src/config/brand.ts` and
`docs/DESIGN_SYSTEM.md` for the full token system, including text/muted tones. Gold
is an accent, never a large fill — see `docs/CREATIVE_DIRECTION.md`.

---

## Digital Lockup Policy

Where the mark and the wordmark ("Ahmad Mohamed Kassa," never shortened to "Ahmad
Kassa" without a specific content reason) need to appear together, compose them live
— mark image/SVG + real text in the surrounding type — rather than shipping a new
flattened logo-with-text file. Live today: header, footer, transactional/newsletter
email. See `public/brand/README.md`'s "Digital lockup policy" section for the full
reasoning and current status of each surface.

---

## Never

- Never stretch, rotate, add effects, or add shadows to the mark.
- Never recreate, redraw, or reinterpret the mark's geometry.
- Never generate an AI approximation of the mark.
- Never regenerate a production asset from anything other than the frozen path data
  in `brand-source/AHMAD-06.svg` / `public/brand/logo-mark.svg`.

`brand-source/AHMAD.ai` (the supplied Illustrator file) is the single source of
truth — kept outside `public/`, not publicly servable. See `public/brand/README.md`.
