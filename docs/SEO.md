# SEO

Reference for the metadata/structured-data/sitemap architecture
(mostly Sprint 3–7, extended in Sprint 9). Read this before adding a
new public page or changing how any existing one is discovered/shared.

## Metadata

Every public page sets metadata through `buildMetadata()`
(`src/lib/seo.ts`) — never hand-build a `Metadata` object. It
produces consistent `title`/`description`/canonical/OpenGraph/Twitter/
robots tags from a small set of options:

```ts
buildMetadata({
  title: "Page title",       // or { default, template } — root layout only
  description: "...",
  path: "/some-path",        // used to build the canonical URL
  noIndex: false,             // sets robots: {index:false, follow:false}
  canonicalUrl: "...",        // overrides the computed canonical (e.g. an editor-set value)
  ogImage: "...",             // explicit OG image URL — wins over everything
  useRouteOgImage: false,     // omit the images key so Next's file-convention opengraph-image.tsx is used
})
```

Dynamic routes (`books/[slug]`, `articles/[slug]`) use
`generateMetadata()` instead of a static `export const metadata`, so
they can read the CMS row's own `Seo` fields as a fallback layer over
the hardcoded default (see Homepage/About/Book for the pattern —
`row?.seo?.metaTitle || <default>`).

## Environment-aware URLs

`siteConfig.url` (from `SITE_URL` in `src/constants/site.ts`) prefers
`NEXT_PUBLIC_SITE_URL` and falls back to the real domain. Every
canonical/OG/sitemap/robots consumer reads through this one constant —
set the env var once per environment (a preview deployment, or before
the production domain is connected) rather than touching call sites.

## Structured data (JSON-LD)

Builders live in `src/lib/seo.ts`, rendered via
`<JsonLd data={...} />` (`src/components/shared/json-ld.tsx`):

| Builder | Used on |
|---|---|
| `buildPersonJsonLd()` | Home, About |
| `buildOrganizationJsonLd()` | Home |
| `buildWebsiteJsonLd()` | Home |
| `buildAboutPageJsonLd()` | About |
| `buildContactPageJsonLd()` | Contact |
| `buildBookJsonLd(book)` | Book detail |
| `buildArticleJsonLd(article)` | Article detail |
| `buildBreadcrumbJsonLd(items)` | Books/Articles detail, About, Ask Ahmad, Contact |

**Never add a schema type without real, visible content behind it.**
`VideoObject` is deliberately not implemented — every lecture in
`src/lib/data/lectures.ts` is a placeholder with no real `youtubeId`.
Add it once a real recording exists; `VideoCard`'s facade pattern
already supports that with zero markup changes.

**`sameAs` only includes confirmed profile URLs.**
`buildPersonJsonLd()`/`buildOrganizationJsonLd()` filter
`siteConfig.socialLinks` through `confirmedSocialUrls()` — a link only
counts if its path is more specific than the bare domain. Today all
three `SOCIAL_LINKS` entries in `src/constants/site.ts` are still
generic placeholders (`https://youtube.com`, etc.), so `sameAs` is
omitted entirely. It'll start appearing automatically once real
profile URLs are set — no code change needed.

## Breadcrumbs

`<PageBreadcrumbs items={[...]} />` (`src/components/navigation/
page-breadcrumbs.tsx`) always prepends "Home" — pass only the
remaining trail. Pair every visible breadcrumb with a matching
`buildBreadcrumbJsonLd()` call (it also prepends "Home" itself, so
pass the same `items` array to both).

## Open Graph images

Two layers:
1. **Static default** — `public/brand/og-image.png`, referenced by
   `siteConfig.ogImage`. Used by every page that doesn't set
   `useRouteOgImage`.
2. **Dynamic, branded, per-route** — `src/lib/og-image.tsx` exports
   `renderBrandedOgImage({eyebrow?, title, subtitle?})`, used by the
   `opengraph-image.tsx` file-convention routes at `/`, `/about`,
   `/books/[slug]`, `/articles/[slug]`, `/courses`. Deliberately uses
   Satori's built-in system serif/sans rather than fetching
   Newsreader/Manrope binaries over the network — a font fetch failing
   or being slow at OG-render time (when a social crawler requests the
   image) is a reliability risk not worth the typographic precision.

**Precedence when both could apply**: an explicit `ogImage` (a CMS
`Seo.ogImage`, or a book's cover image) always wins over the generated
route image — set `ogImage` *and* `useRouteOgImage: true` together (see
`books/[slug]/page.tsx`) so the generated card is only ever the
fallback when no real image exists.

**Why `useRouteOgImage` exists at all**: Next.js only auto-detects a
co-located `opengraph-image.tsx` when the page's metadata doesn't
already set `openGraph.images`. Since `buildMetadata()` always sets an
explicit image otherwise (falling back to the static default), a page
with a real OG image route needs this flag or its image is silently
ignored.

Adding a new dynamic OG image route: create
`your-route/opengraph-image.tsx` exporting `size`/`contentType` from
`og-image.tsx` and a default function calling `renderBrandedOgImage()`;
set `useRouteOgImage: true` on that page's `buildMetadata()` call.

## Sitemap & robots

`src/app/sitemap.ts` — static routes + published books
(`bookService.listPublic()`, filtered to `PUBLISHED`) + published
articles. Add a new indexable content type here the same way (fetch,
filter to public/published, map to a `MetadataRoute.Sitemap` entry).

`src/app/robots.ts` — allows `/`, disallows `/admin`/`/dashboard`/
`/academy`/`/login`; a site-wide `noindex` toggle
(`SiteSettings.defaultSeo.noindex`, editable at `/admin/seo`) switches
to a blanket disallow for staging. **Robots.txt is not a security
boundary** — private routes must stay authenticated/authorized
regardless of what's listed here.

## Admin SEO editing

`<SeoFields>` (`src/dashboard/components/seo-fields.tsx`) is the
shared "Search & sharing" fieldset — meta title (60-char guidance),
meta description (155-char guidance), canonical URL, keywords, and a
per-item noindex toggle. Used by the Book/Homepage/About editors,
which all nest their Seo object under a `seo.*` field path. The
site-wide defaults form (`/admin/seo`) has a different, root-level
shape (no `seo.` prefix) plus OG/Twitter image fields the shared
component doesn't cover, so it reuses just the exported `CharCount`/
`META_TITLE_MAX`/`META_DESCRIPTION_MAX` pieces rather than the whole
component — see `seo-fields.tsx` for both usage patterns.

## Search Console / Bing verification

Set `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION` (see
`.env.example`) — wired into the root layout's `metadata.verification`.
Both are optional and undefined-safe; nothing breaks if unset.

## Audit findings this sprint closed

See `docs/sprints/SPRINT-09.md` for the full list with reasoning —
summary: environment-aware `SITE_URL`; Homepage/About metadata wired
to the real `Seo` model (previously fully hardcoded); an SEO tab added
to the About editor (previously had none); JSON-LD expanded from
Person/Organization/Website/Book to also cover Article/AboutPage/
ContactPage/BreadcrumbList; the `sameAs` placeholder-URL bug; dynamic
OG images (previously one static PNG for every page); Search Console
verification support.
