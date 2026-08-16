# Architecture

This file didn't exist before Sprint 9 — it's seeded here with the
launch-readiness architecture that sprint introduced (metadata,
structured data, OG images, analytics). It's an overview of how those
pieces fit together; for the full layered backend pattern (schemas →
validators → repositories → services → actions) and every other
architectural decision made since Sprint 1, see
`docs/PROJECT_MEMORY.md`, which remains the primary source of truth.
Add to this file as future sprints introduce their own cross-cutting
architecture, rather than duplicating what's already in
PROJECT_MEMORY.

## Metadata & discovery pipeline

```
siteConfig.url (env-aware, src/constants/site.ts)
        │
        ├─▶ buildMetadata()          (src/lib/seo.ts)   ── every page's <title>/canonical/OG/Twitter/robots
        ├─▶ buildXJsonLd() builders  (src/lib/seo.ts)   ── structured data, rendered via <JsonLd>
        ├─▶ sitemap.ts / robots.ts   (src/app/)          ── discovery + crawl rules
        └─▶ opengraph-image.tsx      (per route)          ── social-share cards, via src/lib/og-image.tsx
```

Every one of these reads `siteConfig.url` as its base — set
`NEXT_PUBLIC_SITE_URL` once per environment and the whole pipeline
follows. See `docs/SEO.md` for the full reference on using/extending
each piece.

**CMS-backed metadata fallback chain**: for content with an editable
`Seo` row (Homepage, About, Books, Articles), `generateMetadata()`
prefers the editor-set `metaTitle`/`metaDescription`, falling back to
a hardcoded default only when unset. The site-wide default `Seo` row
(`/admin/seo`) is a *separate*, lower-priority layer that's
currently only consumed for its `noindex` toggle — see
`docs/sprints/SPRINT-09.md`'s "Architecture decisions" for why its
other fields aren't wired into the root layout.

## Analytics

```
trackEvent(event)          (src/lib/analytics.ts, typed, client-only)
        │
        ▼
@vercel/analytics's track()
        │
        ▼
Vercel dashboard (cookieless, no PII)
```

One typed union (`AnalyticsEvent`) is the single source of truth for
which events exist — every call site imports `trackEvent` rather than
calling the provider directly, so swapping/adding a provider later
touches one file, not every component that currently tracks something.
Two small helper components exist for the two cases a direct
`onClick`/`useEffect` call site can't cover:

- **`<TrackedLink event={...} />`** (`src/components/shared/
  tracked-link.tsx`) — a click-tracked `<a>`, composes with `Button
  asChild`.
- **`<TrackEventOnMount event={...} />`** (`src/components/shared/
  track-event-on-mount.tsx`) — fires once on mount, for an outcome a
  Server Component already decided (e.g. the newsletter confirm page
  landing on "confirmed").

`SiteSettings.analyticsIds` (GA4/Meta Pixel IDs) is a separate,
currently-inert data capture — see `docs/sprints/SPRINT-09.md` for why
it isn't wired to inject live scripts yet.

## Branded Open Graph images

```
renderBrandedOgImage({eyebrow?, title, subtitle?})   (src/lib/og-image.tsx)
        │
        ▼  (Next's ImageResponse / Satori)
per-route opengraph-image.tsx files
        │
        ▼
buildMetadata({ useRouteOgImage: true, ogImage?: <real image if one exists> })
```

One shared renderer, thin per-route files. `useRouteOgImage` is the
flag that lets Next's file-convention auto-detection win when no
explicit image exists — see `docs/SEO.md`'s "Open Graph images"
section for the full precedence rules and how to add a new route.

## Homepage redesign cross-cutting patterns (Sprint 11)

Design rationale for all of this lives in `docs/DESIGN_SYSTEM.md` (Section 10, "The
Mark as a Design Language") — this section covers only the engineering shape, so it
doesn't get duplicated here.

**`ScrollReveal` — a client island for scroll-triggered motion on Server Component
sections.** `src/components/shared/scroll-reveal.tsx` wraps `children` in a
`motion.div` with `whileInView`/`useReducedMotion()`, so an `async` Server Component
section (`FeaturedBookSection`, `AboutPreviewSection`, `TeachingAreasSection`,
`CtaSection` — each doing its own data fetch or staying a plain server component)
can get the same scroll-reveal treatment `hero.tsx` gets, without converting the
whole section to `"use client"` (which would force its data-fetching to move
elsewhere). This is the same category of problem Sprint 9's `CourseCard`/
`CourseInterestLink` split solved (see `docs/PROJECT_MEMORY.md`) — extract only the
interactive/animated leaf into a client island, keep the data-fetching parent on the
server. Reuse `ScrollReveal` for any new Server Component section that needs a
scroll reveal; don't hand-roll another `useReducedMotion` + `whileInView` pair.

**Section background texture.** `.manuscript-texture`/`.manuscript-texture-navy`
(`src/app/globals.css`) is applied via `Section`'s `texture` boolean prop
(`src/components/shared/section.tsx`) — a cross-cutting, opt-in visual layer, not a
default, currently used on Hero and the two navy sections (Quote, Newsletter).

**Naming gotcha: never prefix a custom non-color utility with `bg-`.** The texture
utility above was originally named `bg-manuscript-texture-navy` and silently broke
the navy background it was meant to layer on top of: `tailwind-merge` (used by this
project's `cn()` helper, `src/lib/utils.ts`) groups classes into conflict buckets by
*name pattern*, not by what they actually do — anything matching `bg-*` gets bucketed
as "background colour," so `bg-manuscript-texture-navy` and `bg-navy-950` were
treated as conflicting background-colour utilities, and whichever one appeared later
in the class string silently won, dropping the other. The fix was renaming to
`manuscript-texture-navy` (no `bg-` prefix). **Any future custom Tailwind utility
that's meant to layer alongside a real `bg-*`/`text-*`/`border-*` color class must
avoid that same prefix**, or `cn()`/`tailwind-merge` will silently drop one of them
with no build error or warning — this is the kind of bug that only shows up visually,
so it's easy to ship unnoticed.

## RTL readiness

`src/config/i18n.ts` is the single source of truth for locale
config (`locales`, `defaultLocale`, `rtlLocales`, `isRtl()`). The root
layout's `<html dir={isRtl(defaultLocale) ? "rtl" : "ltr"}>` is real
and reads from it — it just has nothing to flip yet
(`features.multilingual = false`). See `docs/ACCESSIBILITY.md` for the
logical-vs-physical Tailwind utility convention and the current
conversion status.
