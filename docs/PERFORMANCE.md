# Performance

Reference for caching/revalidation strategy, database indexing, and
what was and wasn't touched during the Sprint 9 performance audit.

## Caching & revalidation

Public content pages are **static/ISR-by-mutation**, not fully dynamic
on every request — there's no `force-dynamic`, no uncached `fetch`,
anywhere on the `(site)` route group:

- **Books listing** (`/books`) — statically rendered by default,
  invalidated via `revalidatePath("/books")` inside `book.actions.ts`
  whenever a book is created/updated/deleted.
- **Book detail** (`/books/[slug]`) — `generateStaticParams()`
  pre-renders every public slug at build time (SSG); an unknown slug
  falls back to on-demand render. Invalidated via
  `revalidatePath(`/books/${slug}`)` on update.
- **Homepage** (`/`) — static, invalidated via `revalidatePath("/")`
  in `homepage.actions.ts` and (for the site-wide SEO defaults)
  `seo.actions.ts`/`site-settings.actions.ts`.
- **About** (`/about`) — the *visible content* has zero DB/service
  calls (the bio/timeline/education copy is still hardcoded from
  Sprint 1, since expanded in Sprint 11's homepage redesign but never
  wired to the CMS — see `docs/ROADMAP.md`'s "Immediate priority").
  There **is** one real DB call on this page, easy to miss: Sprint 9's
  `generateMetadata()` calls `aboutService.get()` to read the real
  `Seo` row for meta title/description — metadata only, no effect on
  what a visitor sees, and no `revalidatePath()` call is needed for it
  since there's no cached-then-invalidated content on this route,
  unlike Books/Homepage above.

Admin routes explicitly opt out of this: both `admin/(app)/layout.tsx`
and `admin/(auth)/layout.tsx` set `export const dynamic =
"force-dynamic"`.

**Adding a new cached public page**: follow the existing pattern —
plain Server Component doing a direct Prisma/service call (no
`fetch`/`unstable_cache` needed), invalidated via a `revalidatePath()`
call in the relevant action after any mutation. Don't add time-based
ISR (`export const revalidate = N`) unless a page's data genuinely
changes on a schedule rather than via an admin action — none currently
do.

## Database indexes

Every model's current indexes are in `prisma/schema.prisma` — check
there before assuming a lookup is unindexed (Prisma auto-indexes any
`@unique`/`@id` field, so e.g. `Book.slug` and `User.email` are
already covered without an explicit `@@index`). Sprint 9 added two
composite/singular indexes for query patterns that were genuinely
unindexed:

- `Book`: `@@index([status, featured])` — matches
  `bookService.listPublic()`'s actual filter+sort (`status IN (...)`,
  `ORDER BY featured DESC, publicationDate DESC`).
- `ContactMessage`: `@@index([createdAt])` — the admin inbox's
  default sort.

**Adding a new index**: only add one for a genuinely common
filter/sort pattern (check the relevant `repository.ts`'s `findMany`
calls) — this project deliberately avoids premature indexing.

## N+1 queries

None found in the public book pages as of the Sprint 9 audit —
`bookRepository.findMany()` (used by the listing) always includes
`coverImage`/`seo` in one query; `findById`/`findBySlug` (book detail)
include `coverImage`/`gallery`/`seo` in one query. The book detail page
also fetches its related data (`aboutService.get()`,
`bookService.getRelated()`) via `Promise.all`, not sequentially. Keep
this pattern for any new detail page that needs multiple independent
pieces of data — parallel `Promise.all`, not a waterfall of
sequential `await`s, and `include` relations in the repository query
rather than fetching them separately per row.

## Images

`next.config.ts` now sets `images.formats: ["image/avif",
"image/webp"]` (Sprint 9) — no source-image changes needed, Next
transcodes on request. `next/image` is used consistently across the
public site; the one exception is a single raw `<img>` in the book
detail page's gallery grid (`books/[slug]/page.tsx`), a deliberate,
documented Sprint 6 choice (gallery images have variable aspect
ratios, and a plain grid tile was simplest) — left untouched.

## Client-side JS surface

The public site's shared client-side wrapping is intentionally small:
`TooltipProvider` + `Toaster` (root layout, shared with admin) and
`(site)/template.tsx`'s Framer Motion page-transition wrapper
(site-only, re-executes per navigation). No analytics/theme-provider
adds to this — `<Analytics />` (Sprint 9, `@vercel/analytics`) is a
tiny (~1KB), already-optimized script, not a heavy provider.

## Error boundaries & loading states

- `src/app/global-error.tsx` (Sprint 9) — last-resort fallback for an
  error thrown by the root layout itself (fonts, providers). Must stay
  self-contained (inline styles, no app imports, its own `<html>`/
  `<body>`) since if the root layout failed, nothing above it can be
  trusted — don't "improve" it by importing `Section`/`ErrorState`.
- `(site)/error.tsx`, `(site)/not-found.tsx`, `admin/(app)/error.tsx`
  — real branded boundaries, not Next.js defaults (Sprint 1–5).
- `admin/(app)/not-found.tsx` (Sprint 10) — a bad id on an admin
  detail route (`/admin/books/[id]` etc.) previously fell through to
  Next's unstyled default 404; now branded, mirroring the existing
  `error.tsx`/dashboard-shell pattern.
- `loading.tsx` exists once for the whole `(site)` group (rendering
  `LoadingScreen` — a quiet breathing mark, not a spinner) and
  per-route for most of `admin/`. Not adding more per-route public
  `loading.tsx` files — the pages that would benefit (Books listing,
  Book detail) are already static/SSG, so a loading state rarely
  triggers in practice.

## Deferred

- **A tuned Content-Security-Policy header** — not added this sprint.
  The baseline headers already in `next.config.ts` (`X-Content-Type-
  Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-
  Policy`, since Sprint 5) stay as-is. A real CSP needs careful
  per-directive tuning against Next's dev tooling, Radix's portals,
  and Tailwind's inline styles — risky to add without dedicated
  testing time. Starting point for Sprint 10:
  `default-src 'self'; img-src 'self' data: <media host>; script-src
  'self' 'unsafe-inline' va.vercel-scripts.com; style-src 'self'
  'unsafe-inline'; frame-src www.youtube.com` (adjust once real
  lecture videos and any external embeds are confirmed).
- **Lighthouse CI or axe automation** — not installed; see
  `docs/ACCESSIBILITY.md`'s testing section for the reasoning
  (manual verification has been this project's method throughout).
