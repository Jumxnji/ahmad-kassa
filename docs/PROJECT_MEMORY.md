# Project Memory

Long-term memory for this project. Read this before starting any new
sprint, and keep new work consistent with what's recorded here unless
the client explicitly directs otherwise. Update it after every
completed sprint with anything future work needs to know.

---

## Who / what this project is

A Next.js site for **Ahmad Mohamed Kassa** — Islamic teacher, author,
and Khateeb (Masjid Al-Noor, East London). The public site presents his
biography, books, and ways to get in touch; the `/admin` area is a
custom CMS built specifically for him to manage that content, sized and
scoped like a bespoke platform rather than a generic template.

## Major architectural decisions

- **Next.js 16 App Router**, route groups: `(site)` for the public
  site, `(portal)` reserved for a future student dashboard. `/admin` is
  the CMS — deliberately **not** `/dashboard`, because `/dashboard`
  already existed as a placeholder for the future student portal from
  Sprint 1. Never collapse these two.
- **Prisma ORM v7 with an explicit driver adapter** (`@prisma/adapter-pg`
  + `pg`) against local PostgreSQL — Prisma 7 requires a driver adapter,
  unlike v5/v6. Config lives in `prisma.config.ts` (not
  `package.json#prisma`). Generated client output is customised to
  `src/generated/prisma` rather than the default `@prisma/client`
  location.
- **Local Postgres now, Neon-ready later.** The client asked about using
  Neon DB mid-Sprint-3; the decision was to continue with local Postgres
  because Prisma is DB-agnostic — switching to Neon later is a one-line
  `DATABASE_URL` change, no architecture impact. Revisit this only if
  the client raises it again; don't proactively migrate.
- **Layered backend pattern**, strictly one-directional:
  `schemas/` (canonical Zod shapes mirroring Prisma) →
  `validators/` (form/action-specific derived schemas — public-facing
  ones live in `validators/public/` to avoid name collisions with admin
  validators for the same entity) →
  `repositories/` (thin Prisma wrappers, arbitrary `FindManyArgs` in,
  no validation/permission logic) →
  `services/` (business logic — slug generation, SEO row
  upserting, cross-repository orchestration) →
  `actions/` (Server Actions — permission check, Zod validation,
  `revalidatePath`, wrapped in `runAction()` for consistent
  `ActionResult` shape). Nothing above should import `db` directly
  except repositories.
- **Singleton content rows use a plain `.update()`, never `.upsert()`.**
  `HomepageContent`, `AboutContent`, and `SiteSettings` all use a fixed,
  well-known `id` and are guaranteed to exist after `prisma db seed`.
  Using `db.<model>.upsert({ create, update })` on these repeatedly
  caused runtime "Unknown argument" errors — Prisma's checked/unchecked
  input-shape resolution didn't reliably match the TypeScript-checked
  `Unchecked*Input` type used to build the mixed payload, even though it
  compiled cleanly. Found and fixed three times now (SiteSettings in
  Sprint 3; Homepage and About in Sprint 4). **If a fourth singleton
  table is ever added, give it a plain `update()` from the start.**
- **`Media` and `Seo` are reusable, standalone tables**, not duplicated
  per feature. `Seo` attaches 1:1 to whatever needs it (Book, Homepage,
  About, SiteSettings) via an optional FK; services orchestrate
  create-or-update of the linked `Seo` row transparently when a form
  submits a nested `seo` object.
- **Feature flags are the only gate for unbuilt functionality**
  (`src/features/flags.ts`). A flag being `false` means "don't render
  the nav item / route / UI yet," not "the code doesn't exist" — when a
  feature ships, flip the flag; nothing about how it was built should
  need to change.
- **Permission system** is resource+action tuples (`can(role, resource,
  action)`), four roles: Owner (everything, including ownership
  transfer), Administrator (content/questions/newsletter, not
  ownership), Editor (content only), Viewer (read-only).
  `getCurrentUser()` (Sprint 5) is real: it calls `auth()` and re-reads
  the user from Postgres on every call, so a role change or a
  suspension takes effect on the very next request — no stale session
  data. Unchanged from Sprint 3: this is still the single source of
  truth, now also driving sidebar nav filtering.
- **Real authentication (Sprint 5): Auth.js v5, Credentials provider,
  JWT sessions only.** JWT was required (not a choice) because the
  Credentials provider doesn't support database sessions. The
  `@auth/prisma-adapter` is still attached to the config for future
  OAuth-provider readiness even though it isn't exercised by Credentials
  login today.
- **Two-tier authorization, deliberately not one.** `src/proxy.ts` does
  coarse, fast, JWT-only role gating (no DB hit) for
  `/admin/users`/`/admin/settings` — this satisfies the brief's
  "Middleware should enforce permissions" instruction and avoids a
  page-flash for obviously-unauthorized roles. The actual security
  boundary is always `getCurrentUser()` (DB-backed), used by
  `requirePageAccess()` (Server Components, redirects) and
  `requirePermission()` (Server Actions, throws). Never treat the
  `proxy.ts` check as sufficient on its own when adding a new protected
  route or resource — always pair it with a `requirePageAccess`/
  `requirePermission` call in the actual page/action.
- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** (exported
  function named `proxy`, default export). It defaults to the Node.js
  runtime — unlike historical Next.js middleware, which defaulted to
  Edge — so the full `auth()` config (including the Prisma adapter) can
  be used directly in `proxy.ts` with no edge/node split. Setting an
  explicit `export const runtime` in a proxy file throws in Next 16;
  don't add one.
- **"Remember me" is a custom `token.exp` claim**, not a second
  `session.maxAge` — a JWT strategy only supports one fixed `maxAge`,
  so the `jwt` callback manually sets `token.exp` at sign-in time (8
  hours normally, 30 days if "remember me" was checked) instead.
- **Temporary-password-on-invite, not an email invite.** Since real
  invite emails are still postponed (see below), `userService.create()`
  generates a secure random password, hashes it, and returns the plain
  value *once* for the Owner/Administrator to relay manually via a
  `TemporaryPasswordDialog`. The same mechanism backs a new
  admin-triggered "Reset password" action for existing users. This was
  chosen deliberately so the whole onboarding flow works today, without
  waiting on Resend integration — when real invite emails ship, this
  becomes the fallback path shown only if sending fails, not a redesign.
- **Audit log is a generic, non-throwing side effect**, not a
  hard dependency of the actions it observes: `action: string` +
  `metadata: Json` on the `AuditLog` model, written by a service call
  that never blocks or fails the parent operation. The IP-address field
  exists on the model now but isn't populated yet — see "Known
  limitations."
- **CSRF relies on framework defaults, not custom middleware.** Next.js
  Server Actions already verify the request Origin header, and Auth.js
  has its own CSRF protection for its routes — a bespoke CSRF token
  system would duplicate both. Documented inline in `next.config.ts`.
- **Rate limiting is in-memory, single-instance, and documented as
  such.** Fine for the current single-instance deployment target;
  flagged in code and here as needing a shared store (e.g. Upstash
  Redis) before any multi-instance/serverless-concurrent deployment.
- **Server-driven tables, not client-side state**, for search/sort/
  pagination (Sprint 4). `DataTable`'s row-cell renderers are JSX
  closures built in a Server Component page — making `DataTable` itself
  a Client Component would break that (functions can't cross the
  Server→Client boundary as props). So search/sort/page are plain URL
  query params, parsed server-side, fed straight into Prisma
  `where`/`orderBy`/`skip`/`take`. Reuse this pattern
  (`parseListQuery`/`TableSearchForm`/`PaginationControls`) for any new
  list page rather than reinventing client-side filtering.
- **`listPaged()` methods sit alongside existing `list()` methods**,
  not replacing them — two call sites (the homepage's featured-book
  picker, the Overview's activity feed) depend on a plain unpaginated
  array, so paginated variants were added as new methods rather than
  changing `list()`'s signature.
- **`BookStatus` enum, not booleans (Sprint 6).** `published`/
  `comingSoon` booleans were replaced with a single `status` enum
  (`DRAFT`/`PUBLISHED`/`COMING_SOON`/`ARCHIVED`) — the boolean pair
  allowed nonsensical states (both true at once) and couldn't express
  "was published, now taken down" (Archived) at all. `featured` stays
  a separate boolean since it's orthogonal to lifecycle status. If any
  other content model ever needs a similar lifecycle, prefer an enum
  over stacked booleans from the start.
- **Book cover/gallery images can't be copied between books.**
  `Book.coverImageId` is a 1:1 relation (`Media.bookCoverOf`) and
  gallery images belong to exactly one book (`Media.bookGalleryId`) —
  so `bookService.duplicate()` clones every scalar field but leaves the
  new copy's cover/gallery empty rather than "stealing" the source
  book's images. Any future "duplicate" action on a model with a
  1:1/owned-image relation should follow the same rule.
- **Media usage count is computed on read, never stored.** A stored
  counter would need six write paths (book cover, book gallery, two SEO
  image slots, homepage hero, site logo) kept in sync and would
  eventually drift; `mediaRepository.countUsages()` just queries all
  six relations live. Follow this pattern for any future "where is this
  used" feature rather than adding a counter column.
- **Image processing uses `sharp` (Sprint 6), added deliberately.**
  Dimension probing, resizing to a max 2400px edge, and thumbnail
  generation all genuinely require real image-codec work — this isn't
  a "just in case" dependency. SVGs bypass processing entirely (vector,
  no meaningful raster thumbnail). See `src/services/storage.ts`.
- **The reusable Media Picker (Sprint 6) is the second selection
  pattern for images**, alongside the older single-upload
  `ImageUploadField` (still used by Homepage hero, Site Settings logo,
  SEO OG/Twitter images — untouched this sprint). `MediaPickerField`/
  `MediaGalleryField` let an editor choose an *existing* library image,
  not just upload a new one. New image fields going forward should use
  the Media Picker, not `ImageUploadField` — the older component was
  left in place only because migrating it wasn't in this sprint's scope,
  not because it's still the preferred pattern.
- **Media folders**: `IMAGES`, `BOOK_COVERS`, `GALLERY`, `DOCUMENTS`,
  `DOWNLOADS`, `VIDEOS` (Sprint 6 renamed `PDFS` → `DOCUMENTS` and added
  `GALLERY`/`DOWNLOADS` via `ALTER TYPE ... RENAME VALUE`, not a
  destructive drop/recreate — check `prisma/migrations/
  20260731192010_sprint6_books_media/migration.sql` before adding
  another folder value the same way).

## Design decisions

- Public site uses the design system established in Sprint 1 ("Prompt
  #1") — navy/gold/paper palette, `font-display` for headings, the
  manuscript-divider motif. **Never regenerate or redesign this** —
  every sprint since has been additive (branding, backend, dashboard),
  and that constraint has been repeated explicitly by the client each
  time.
- The brand system (Sprint 2) was built **around** a supplied logo —
  the logo itself was never redesigned, only packaged (favicons, OG
  images, manifest, brand.ts tokens).
- The `/admin` dashboard deliberately echoes the public site's design
  language (same palette/typography) rather than looking like a
  generic admin template (explicitly: "Not WordPress. Not Bootstrap.
  Not generic admin templates." — aiming for a Payload/Linear/Notion/
  Vercel feel).
- Rich text editing was added **only** to About's Biography field, not
  every text field — the other About fields (intro, mission, future
  vision) are short single-paragraph copy where a toolbar would be
  overhead rather than help. Apply the same judgment to future fields:
  reach for `RichTextEditor` only where content is genuinely long-form.
- The Homepage editor's "live preview" is an in-dashboard mockup built
  from the same design tokens as the real `Hero`, not an iframe of the
  live site — see "Known limitation" below for why, and don't present
  it as more than a preview in any future copy changes.
- **Cover/gallery image cropping was deliberately cut from Sprint 6's
  scope.** Uploads are expected pre-cropped to a 2:3 cover ratio;
  automatic resize/thumbnail happens server-side, but there's no
  in-browser crop UI. Documented as a real gap (see Known limitations),
  not silently dropped.

## Features intentionally postponed

Explicitly deferred by the client's own instructions at various
sprints — do not build these without being asked again:

- Stripe / payments / direct book sales checkout
- Student accounts / student portal
- Articles CMS, Courses, Events (public pages for Articles/Courses
  exist and are static; managing them from the dashboard is what's
  deferred)
- Multilingual support
- Real invitation emails (the invite dialog creates a real `User` row
  with status `INVITED` but sends nothing — the dialog copy says so
  explicitly since Sprint 4)
- In-dashboard analytics/reporting (distinct from the GA/Meta Pixel ID
  fields already in Site Settings, which just emit public tracking
  scripts)

## Known limitations

- **The public site's CMS wiring is now partial, not zero.** Discovered
  mid-Sprint-4, closed for books in Sprint 6: the Books listing, Book
  Detail page, and the Homepage's Featured Book section now read live
  from `bookService`/`homepageService.featuredBookId`, with a fallback
  to the newest published book when no title is explicitly featured.
  **`Hero`, `AboutPreviewSection`, and the public `/about` page are
  still fully hardcoded** — the Homepage/About editors persist real
  rows with **zero effect** on those specific sections. Draft/Published
  on Homepage is still a real, persisted flag with no live-site
  consequence yet outside the Featured Book section; the Homepage
  editor's live preview is still an honest mockup, not a window onto
  production. **Top priority for the next sprint** is wiring `Hero`,
  `AboutPreviewSection`, and the public About page the same way books
  were wired this sprint — see `docs/ROADMAP.md`.
- **Articles, Courses, and Events remain entirely unmodelled** (no
  Prisma tables) — Sprint 6 only extended the already-real `Book`
  model; it didn't add new content types. This is unchanged from
  earlier sprints, not a new gap.
- `User.lastLoginAt` now populates for real on every successful login
  (Sprint 5) — sorting by it is meaningful going forward, though rows
  created before Sprint 5 (or never logged into) still show `Never`.
- **Rate limiting (login, forgot-password) is in-memory and
  single-instance.** Fine for the current deployment target; must move
  to a shared store (e.g. Upstash Redis) before any multi-instance or
  serverless-concurrent deployment, or limits can be trivially bypassed
  by hitting different instances.
- **`AuditLog.ipAddress` is a schema placeholder, not populated yet.**
  The architecture (model + service) is in place per the Sprint 5
  brief, but no request actually writes a real IP today — wire this up
  once the hosting target's real-client-IP header (e.g.
  `x-forwarded-for` behind Vercel) is confirmed, rather than guessing
  now and getting it wrong for the eventual host.
- **No in-browser image cropping (Sprint 6).** Book covers/gallery
  images are expected to be uploaded already at a sensible aspect ratio
  (2:3 for covers); the upload pipeline resizes/thumbnails but never
  crops. A real crop UI (e.g. `react-easy-crop`) is the natural next
  step if this becomes a recurring friction point for whoever uploads
  covers.
- The SEO `noindex` toggle's effect on `/robots.txt` relies on Next
  revalidating a build-time-static route via `revalidatePath` — verified
  working in dev; worth a smoke test after the first production deploy.
- A systemic Radix/Tailwind bug was found and fixed project-wide in
  Sprint 3: several shadcn components used bare `data-open:`/
  `data-checked:` selectors where Radix actually emits `data-state="open"`
  /`data-state="checked"`. If a *new* shadcn component is added later,
  check its generated data-attribute selectors against the actual Radix
  primitive's source before trusting them — the shadcn CLI's default
  output for this project's style preset (`radix-nova`) got this wrong
  in multiple components.

## Things discussed with the client

- Asked about switching to Neon DB mid-Sprint-3; clarified they were
  fine continuing with local Postgres via Prisma, since switching later
  is trivial. (See "Major architectural decisions" above.)
- Explicitly corrected the calligraphy mark's Arabic diacritics:
  *"i dont want any dhammahs"* — verify any future Arabic typography
  work against this preference before shipping.
- Recurring explicit instruction across every sprint since Sprint 1:
  do not regenerate existing pages, do not redesign the UI/design
  system, do not duplicate components. Every sprint's brief has been
  scoped as additive for this reason.

## Important conventions

- Folder structure under `src/`: `schemas/, validators/, repositories/,
  services/, actions/, permissions/, features/, dashboard/, lib/, db/,
  hooks/, generated/`. Public-facing form validators live in
  `validators/public/` specifically to avoid collisions with
  admin-side validators for the same entity (e.g. a public contact-form
  validator vs. an admin contact-message-status validator).
- Every server action returns `ActionResult` / `ActionResultWithData<T>`
  via the shared `runAction()` wrapper — don't hand-roll try/catch in a
  new action.
- Every list page that needs search/sort/pagination should use the
  Sprint 4 kit (`src/lib/list-query.ts`,
  `src/dashboard/components/table-toolbar.tsx`,
  `src/dashboard/components/pagination-controls.tsx`, and `DataTable`'s
  `sortKey`/`sort`/`buildSortHref` props) rather than a bespoke
  implementation.
- Autosave on a form: use `useAutosave` + `AutosaveIndicator`
  (`src/hooks/use-autosave.ts`) driven by `useWatch({ control })` —
  don't build a second debounce mechanism.
- `npm` installs on this machine need
  `--cache <scratchpad>/npm-cache` (or `npm_config_cache` env var)
  because the default `~/.npm` cache is root-owned; new native-binary
  install scripts need `npm approve-scripts <pkg>` before they'll run.

## Reasons behind technical choices

- Driver-adapter Prisma (not the pre-v6 default) — required by Prisma 7,
  not optional.
- `Unchecked*Input` types throughout repositories, not nested
  relation-connect syntax — lets services pass raw scalar FK ids
  (`coverImageId`, `seoId`, etc.) directly, which is what every form in
  this codebase collects, without needing connect/disconnect
  boilerplate at every call site.
- CSV export implemented as a hand-rolled `toCsv()` utility rather than
  a dependency (e.g. `papaparse`) — the format needed is simple enough
  that a ~10-line RFC-4180-ish encoder avoids an extra dependency for
  one button.
- Tiptap chosen for rich text over a heavier alternative — minimal
  footprint (`@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/pm`),
  and only one field in the whole project currently needs it.
