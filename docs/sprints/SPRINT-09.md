# Sprint 9 — Launch Readiness: SEO, Structured Data, Accessibility, Performance, Analytics

Follows Sprints 1–8. Scope: bring the platform to "premium institution"
launch quality ahead of connecting the real domain — accurate,
non-duplicated metadata; real (not fabricated) structured data; a
working sitemap/robots; branded social sharing; privacy-conscious
analytics; accessibility fixes; performance hardening; and documented
(not necessarily fully built) multilingual/RTL readiness. No public
page was redesigned and no existing admin page was regenerated — every
change extends what Sprints 1–8 already built.

An audit pass (three parallel research sweeps covering SEO/metadata,
accessibility/RTL/fonts, and performance/caching/DB indexes) came
first and found the foundation more built than the brief assumed:
`src/lib/seo.ts` already had a mature `buildMetadata()` + JSON-LD
builders, `sitemap.ts`/`robots.ts` were already real and
privacy-correct, forms already used accessible shadcn primitives, and
Radix dialogs already handled focus trapping. This sprint closes the
specific, real gaps the audit found rather than rebuilding any of
that — see "Audit findings" in `docs/SEO.md`/`docs/ACCESSIBILITY.md`/
`docs/PERFORMANCE.md` for the full list.

## Files created

**SEO / structured data / OG images**
- `src/lib/og-image.tsx` — shared branded `ImageResponse` renderer
  (navy/gold/ivory, system-safe fonts) used by every dynamic OG image
  route below.
- `src/app/opengraph-image.tsx`,
  `src/app/(site)/about/opengraph-image.tsx`,
  `src/app/(site)/books/[slug]/opengraph-image.tsx`,
  `src/app/(site)/articles/[slug]/opengraph-image.tsx`,
  `src/app/(site)/courses/opengraph-image.tsx`.
- `src/dashboard/components/seo-fields.tsx` — the reusable "Search &
  sharing" admin fieldset (meta title/description with live character
  counters + length guidance, canonical URL, keywords, per-item
  noindex toggle), now used by the Book/Homepage/About editors and,
  for its `CharCount`/length constants only, the site-wide SEO form.

**Analytics**
- `src/lib/analytics.ts` — typed `trackEvent()` wrapping
  `@vercel/analytics`' `track()`, with a fixed union of the brief's
  named events.
- `src/components/shared/track-event-on-mount.tsx` — fires one event
  on mount, for outcomes a Server Component decides (e.g. a
  confirmation link landing on "confirmed").
- `src/components/shared/tracked-link.tsx` — a plain `<a>` that fires
  an event on click before navigating (composes with `Button asChild`
  the same way a bare anchor does).
- `src/components/cards/course-interest-link.tsx` — small client
  island for the "Notify me at launch" link's click tracking, kept
  separate so `CourseCard` itself can stay a Server Component (it
  receives a Lucide icon component as a prop, which can't cross a
  client boundary).

**Accessibility / RTL**
- No new files — fixes were made in place (see "Files substantially
  changed").

**Docs**
- `docs/SEO.md`, `docs/ACCESSIBILITY.md`, `docs/PERFORMANCE.md`,
  `docs/ARCHITECTURE.md` (didn't exist before this sprint).

**Database**
- `prisma/migrations/20260802090000_sprint9_indexes/`.

## Files substantially changed

- `src/lib/seo.ts` — `buildMetadata()` gained `useRouteOgImage`
  (lets Next's file-convention `opengraph-image.tsx` win when no
  explicit image is set) and `verification` wiring in the root layout;
  added `buildArticleJsonLd`, `buildAboutPageJsonLd`,
  `buildContactPageJsonLd`, `buildBreadcrumbJsonLd`; fixed
  `buildPersonJsonLd`/`buildOrganizationJsonLd`'s `sameAs` to exclude
  unconfirmed placeholder social URLs (see "Content-quality fix"
  below); `buildPersonJsonLd` gained accurate `alumniOf`/`knowsAbout`
  from the verified biographical info in this sprint's brief.
- `src/app/layout.tsx` — Search Console/Bing `verification`, `dir`
  attribute (computed from `isRtl(defaultLocale)`), `<Analytics />`.
- `src/app/(site)/page.tsx`, `src/app/(site)/about/page.tsx` —
  `generateMetadata()` now reads the real `Seo` row
  (`homepageService.get()`/`aboutService.get()`) instead of a fully
  hardcoded title/description.
- `src/app/(site)/books/[slug]/page.tsx`,
  `src/app/(site)/articles/[slug]/page.tsx`,
  `src/app/(site)/contact/page.tsx`, `src/app/(site)/ask/page.tsx` —
  added visible breadcrumbs (books/articles already had them; ask/
  contact didn't) with matching `BreadcrumbList` JSON-LD, and
  page-specific JSON-LD (`Article`/`ContactPage`/`AboutPage`).
- `src/schemas/about.schema.ts`, `src/services/about.service.ts` —
  `AboutContent` gained the same `seo` destructure-and-save pattern
  `homepageService.update()` already had (it previously didn't touch
  `seo` at all).
- `src/dashboard/components/about-form.tsx`,
  `src/dashboard/components/homepage-form.tsx`,
  `src/dashboard/components/book-form.tsx` — now render `<SeoFields>`
  instead of a hand-rolled, duplicated set of the same 4–5 fields.
- `src/dashboard/components/seo-form.tsx` — added the same
  character-count guidance to its (structurally different, root-level
  rather than nested) metaTitle/metaDescription fields; it already had
  a noindex toggle and OG/Twitter image fields the shared component
  doesn't cover, so it wasn't switched to `<SeoFields>` itself.
- `src/constants/site.ts` — `SITE_URL` is now environment-aware
  (`NEXT_PUBLIC_SITE_URL` override), matching the pattern
  `newsletter-urls.ts` already established in Sprint 8. Every
  canonical/OG/sitemap/robots consumer reads through `siteConfig.url`,
  so this one change propagates everywhere.
- `src/config/brand.ts` — palette reconciled to the real
  `globals.css` design tokens (was using a stale approximation for
  `theme-color`/manifest/favicon metadata).
- `src/components/ui/form.tsx` — `FormMessage` gets `role="alert"`
  when showing a validation error, so it's proactively announced.
- `src/components/ui/button.tsx` — the existing `data-icon=
  "inline-start"/"inline-end"` slots were implemented with physical
  `pl-*`/`pr-*`; switched to logical `ps-*`/`pe-*` so icon spacing is
  actually correct if the page is ever rendered RTL (identical output
  in LTR — see "RTL/multilingual readiness" below).
- `src/dashboard/components/sidebar-nav.tsx`,
  `src/dashboard/components/dashboard-shell.tsx` — the two admin
  `<nav>` landmarks (desktop sidebar, mobile sheet) and the `<aside>`
  now have distinct `aria-label`s, matching the public site's
  already-correct `aria-label="Primary"`/`"Mobile"` pattern.
- `src/components/sections/hero.tsx`,
  `src/components/shared/loading-screen.tsx`,
  `src/components/articles/reading-progress-bar.tsx` — added
  `useReducedMotion()` guards with an equivalent static state, joining
  `(site)/template.tsx` as the only Framer Motion usages that respect
  it (previously 1 of 4).
- `src/components/forms/ask-ahmad-form.tsx`,
  `src/components/forms/contact-form.tsx`,
  `src/components/forms/newsletter-form.tsx` — added `autoComplete`
  to the real name/email fields (only the honeypot had one before);
  also wired `trackEvent()` into each form's success path.
- `src/components/cards/video-card.tsx` — wired `trackEvent()` into
  the existing play-click handler (fires only once a lecture has a
  real `youtubeId` — none do yet, so this is architecture-ready, not
  active).
- `src/app/(site)/books/[slug]/page.tsx` — wired `trackEvent()` into
  the Amazon link (via `TrackedLink`) and added a `book_detail_view`
  mount tracker.
- `next.config.ts` — `images.formats: ["image/avif", "image/webp"]`.
- `prisma/schema.prisma` — see "Database changes."
- `.env.example` — `NEXT_PUBLIC_SITE_URL`'s comment extended beyond
  newsletter links to cover SEO/canonical use; added
  `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION`.
- `docs/DEPLOYMENT.md`, `docs/PROJECT_MEMORY.md`, `docs/ROADMAP.md`,
  `CHANGELOG.md` — see those files directly.

## Database changes

Two new indexes, no schema/model changes: `Book` gained
`@@index([status, featured])` (matches `bookService.listPublic()`'s
actual filter+sort — `status IN (...)`, `ORDER BY featured DESC,
publicationDate DESC`); `ContactMessage` gained `@@index([createdAt])`
(the admin inbox's default sort). Purely additive — no backfill, no
existing-data concerns, applied the same way as every prior sprint's
migration.

## Architecture decisions

**Unsubscribe-style problem, this time for OG images: file-convention
vs. explicit metadata.** Next.js only auto-picks-up a co-located
`opengraph-image.tsx` route when the page's own `generateMetadata()`
doesn't already set `openGraph.images`. Since `buildMetadata()`
previously always set an explicit image (falling back to the static
`public/brand/og-image.png`), the new dynamic OG routes would have
been silently ignored. Fixed by adding a `useRouteOgImage` option:
when true and no explicit `ogImage` is supplied, `buildMetadata()`
omits the images key entirely so Next's file convention wins. For
books specifically, this composes correctly with the *existing*
per-book override chain (`book.seo?.ogImage?.url || book.coverImage
?.url`) — a real cover image or an editor-set OG image always wins;
the generated branded card is only ever the fallback when neither
exists. Verified live: `the-great-debate` (which has a real cover)
still uses its cover image; `understanding-tawakkul` (an article, no
override mechanism) correctly gets the generated card.

**Structured data must never claim an unconfirmed social profile.**
`buildPersonJsonLd()`/`buildOrganizationJsonLd()` previously put every
`siteConfig.socialLinks` URL into `sameAs` unconditionally — but those
three URLs (`https://youtube.com`, `https://instagram.com`,
`https://tiktok.com`) are still generic placeholder domains, not real
channel/profile URLs, which directly violates the brief's "do not add
unfinished or nonexistent social-media URLs" instruction. Fixed with a
filter (`confirmedSocialUrls()`) that only includes a link whose path
is more specific than the bare domain; `sameAs` is omitted entirely
until real URLs exist. **The client needs to supply real YouTube/
Instagram/TikTok profile URLs before this shows anything** — see
"Unresolved issues" below.

**RTL is plumbed and demonstrated, not fully rewritten.** The audit
found roughly 114 physical-direction Tailwind class instances
(`left-*`, `right-*`, `ml-*`, `pl-*`, `pr-*`, `text-left`,
`text-right`) across the codebase and zero logical-property adoption,
despite `isRtl()`/`rtlLocales` already existing in `src/config/i18n.ts`
completely unused. Converting all ~114 instances is a large, risky
diff for a sprint that explicitly keeps English as the only enabled
language ("do not translate," "do not damage the current English
design") — so the scope here is: (1) real `dir` attribute plumbing on
`<html>`, computed from `isRtl(defaultLocale)` (always resolves to
`"ltr"` today, but the mechanism now genuinely exists); (2) one
concrete, high-leverage, zero-visual-risk fix — `Button`'s
`data-icon="inline-start"/"inline-end"` slots were *named*
RTL-correctly but implemented with physical `pl-*`/`pr-*`, so icon
spacing would have been backwards in RTL despite the semantic naming;
switched to `ps-*`/`pe-*` (logical padding-inline-start/end), which
render identically in LTR — verified live, no visual change; (3) the
remaining hotspots are catalogued by file/count in
`docs/ACCESSIBILITY.md` for whenever `features.multilingual` actually
ships, per the brief's own "document components requiring future
manual review" allowance.

**Analytics: Vercel Web Analytics live by default; GA4/Meta Pixel
stay dormant.** `@vercel/analytics` is cookieless and collects no PII,
so it satisfies "if the analytics solution doesn't require
non-essential cookies, don't show an intrusive cookie banner" without
any consent UI. `SiteSettings.analyticsIds` (GA4/Meta Pixel IDs,
captured by the admin Site Settings form since an earlier sprint) is
deliberately left exactly as-is — not wired to inject live tracking
scripts. Both are cookie-based; rendering them the moment an admin
fills in an ID, with no consent mechanism, would violate the brief's
own conditional consent instruction. Building a consent banner first
is a Sprint 10 candidate, not bundled in here to avoid shipping
half-considered consent UX under time pressure.

**Root layout's site-wide default `Seo` fields deliberately not
wired as a fallback.** The site-wide SEO form (`/admin/seo`)'s
`metaTitle`/`metaDescription`/`canonicalUrl`/`ogImage` fields are
saved to the DB but not read by the root layout's static
`export const metadata`. Wiring them would require converting the
root layout to `generateMetadata()` — an async DB call on *every*
single request across the whole app, admin included — for a fallback
that's already shadowed by every current page's own explicit
metadata (every page calls `buildMetadata()` with its own title/
description). Not worth the added round-trip for a value that would
never actually be visible today; only the form's `noindex` toggle is
wired (via `robots.ts`, already true before this sprint).

## Content-quality fix

Per the brief's "do not add unfinished or nonexistent social-media
URLs" and "review public copy... no duplicated placeholder copy"
instructions: `buildPersonJsonLd()` now includes real, verified
`alumniOf` (University of London) and `knowsAbout` (mirroring the
"Research interests" already shown on `/about` — Aqeedah & classical
theology, Ruqyah & the unseen, Islamic psychology, Marriage & family
fiqh, Seerah & prophetic method, Comparative religion) rather than a
generic `jobTitle` string alone. No visible page copy was rewritten —
the About page's biography, mission, and timeline text are all
unchanged from Sprint 1.

## Deferred (with why)

- **A Content-Security-Policy header** — not explicitly named in this
  sprint's brief (unlike the baseline headers already shipped in
  Sprint 5), and a real risk of breaking Next dev tooling/Radix/
  Tailwind without careful per-directive tuning. Documented as a
  Sprint 10 recommendation in `docs/PERFORMANCE.md`.
- **Live GA4/Meta Pixel script injection** — needs a consent banner
  first (see "Architecture decisions" above).
- **A full RTL/logical-property rewrite** — documented + one
  high-leverage demonstration fix instead (see above).
- **`VideoObject` schema** — every lecture in `src/lib/data/lectures.ts`
  is `status: "coming-soon"` with no real `youtubeId`; there's no real
  configured video to describe yet. `VideoCard`'s architecture already
  supports one with zero markup changes once a real recording exists.
- **More per-route `loading.tsx` files** — the public pages that would
  benefit (Books listing, Book detail) are already static/SSG, so a
  loading state rarely triggers in practice; not worth the added files
  for a state visitors will almost never see.
- **Converting the book gallery's one raw `<img>` to `next/image`** —
  already a deliberate, documented Sprint 6 exception (variable
  aspect-ratio gallery tiles); left untouched per "do not damage
  current... functionality."

## Testing performed

- `npx tsc --noEmit`, `npx eslint src prisma --max-warnings=0`,
  `npx vitest run` (unchanged from Sprint 8 — no new unit tests this
  sprint; every change here is either metadata/markup or a UI
  behavior best verified live), and `next build` all clean —
  verified after every task, not just once at the end.
- Live-browser verification: fetched and JSON-parsed every new
  `<script type="application/ld+json">` on `/about`, `/ask`,
  `/contact`, `/articles/understanding-tawakkul`, and
  `/books/the-great-debate` — all valid, all matching the expected
  `@type` (`AboutPage`+`Person`+`BreadcrumbList`, `BreadcrumbList`,
  `ContactPage`+`BreadcrumbList`, `Article`+`BreadcrumbList`,
  `Book`+`BreadcrumbList`); confirmed `sameAs` is correctly *absent*
  from Person/Organization JSON-LD today (no confirmed social URLs
  exist yet). Fetched all 5 new `opengraph-image` routes directly and
  visually reviewed the rendered PNGs (navy/gold/ivory, correct
  page-specific title, 1200×630). Confirmed the book detail page's OG
  image still resolves to the real cover photo (override chain
  working as designed). Visually confirmed the About editor's new
  "Search & sharing" card (live character counters, hint text,
  noindex toggle). Visually confirmed the `Button` icon-spacing fix
  produces no visual change in the (default, LTR) UI. Caught and fixed
  a real regression during this sprint: converting `CourseCard` to a
  Client Component (for click tracking) broke passing a Lucide icon
  component as a prop from the Server Component courses page —
  extracted the click handler into a small `CourseInterestLink`
  client island instead, verified fixed via a clean `next build`.

## Unresolved issues / manual steps once the domain connects

- **Real social profile URLs are needed** from the client before
  `sameAs` shows anything in Person/Organization structured data —
  `SOCIAL_LINKS` in `src/constants/site.ts` are still generic
  placeholder domains.
- Set `NEXT_PUBLIC_SITE_URL` to the real production URL once the
  domain is connected (falls back to the hardcoded `ahmadkassa.com`
  otherwise, which is fine pre-launch but should be set explicitly
  once real).
- Add `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION` once
  verifying the domain in each console (both optional, undefined-safe
  until then).
- `@vercel/analytics` needs no setup beyond the deploy itself — it's
  zero-config and activates automatically on Vercel. Verify events are
  arriving in the Vercel dashboard's Analytics tab after the first
  real deploy.
- Legal review of the on-page consent copy and compliance footer text
  is still outstanding from Sprint 8 — unchanged this sprint.

## Recommendations for Sprint 10

1. **A real, tuned Content-Security-Policy header** — see
   `docs/PERFORMANCE.md` for the starting-point directive list.
2. **A consent banner**, then wire `SiteSettings.analyticsIds` (GA4/
   Meta Pixel) to actually inject scripts once one exists.
3. **Real social profile URLs** from the client, so structured data's
   `sameAs` (already correctly filtered) has something real to show.
4. Continue the RTL conversion incrementally as `features.multilingual`
   approaches — `docs/ACCESSIBILITY.md` has the file-by-file hotspot
   list to work through.
5. Once the domain is connected: verify in Search Console/Bing, submit
   `/sitemap.xml`, and spot-check social sharing previews (Facebook
   Sharing Debugger, Twitter Card Validator) against the new dynamic
   OG images.
