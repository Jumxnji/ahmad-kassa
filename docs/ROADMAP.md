# Roadmap

Living document — reflects where the project stands after the most
recently completed sprint. See `CHANGELOG.md` for the detailed history
and `docs/sprints/SPRINT-XX.md` for per-sprint detail.

## Completed

- **Sprint 1** — Public website pages (Home, About, Books, Book Detail,
  Courses, Articles, Article Detail) on the existing design system.
- **Sprint 2 / 2.5** — Full brand asset system around the supplied
  logo; Arabic diacritics correction.
- **Sprint 3** — Backend architecture (Prisma/Postgres, layered
  schemas/validators/repositories/services/actions), feature flags,
  permissions, and the full `/admin` CMS foundation: Overview, Books,
  Homepage/About editors, Ask Ahmad/Contact/Newsletter, Media Library,
  Users, SEO, Site Settings.
- **Sprint 4** — Dashboard polish: search/sort/pagination everywhere,
  autosave, Homepage live preview + Draft/Published, rich text on
  About's Biography, Media grid/list + rename, Newsletter CSV export,
  a completed SEO surface (keywords, OG/Twitter images, noindex →
  robots.txt), Overview roadmap section.
- **Sprint 5** — Real authentication and authorization for the Admin
  Dashboard: Auth.js v5 login/logout/forgot-password/reset-password,
  JWT sessions with "remember me," route protection via `proxy.ts`,
  two-tier RBAC (`proxy.ts` + `getCurrentUser()`), audit log
  architecture, rate limiting, security headers, and a
  temporary-password-on-invite flow. The public site remains fully
  open — only `/admin` requires login.
- **Sprint 6** — Premium Books Management System (General Info,
  Publishing/status, Media incl. gallery, Purchase Options, SEO,
  Preview tabs; Duplicate action; `BookStatus` enum), a reusable Media
  Picker, automatic image processing (dimensions/optimisation/
  thumbnails via `sharp`), Media Library folders/drag-and-drop/details
  dialog, and the public Books listing, Book Detail page, and
  Homepage's Featured Book section now reading live from the CMS.

## Immediate priority (Sprint 7 candidate)

1. **Finish wiring the public site to the CMS.** Sprint 6 closed this
   gap for books specifically; `Hero`, `AboutPreviewSection`, and the
   public `/about` page are still 100% hardcoded from Sprint 1. The fix
   is the same data-wiring pass, now proven out by the Books work (read
   from `homepageService.get()` / `aboutService.get()`), preserving the
   exact current markup/design — not a redesign.
2. **Real invite emails**, now that auth exists — wire Resend into the
   invite action so `userService.create()`'s temporary-password dialog
   becomes the fallback path (shown only if sending fails) rather than
   the only path.
3. **Move rate limiting to a shared store** (e.g. Upstash Redis) before
   any multi-instance/serverless-concurrent deployment — the current
   in-memory implementation only works correctly on a single instance.
4. **Populate `AuditLog.ipAddress`** once the real hosting target's
   client-IP header is confirmed (e.g. `x-forwarded-for` behind
   Vercel) — currently a schema placeholder only.
5. **In-browser cover/gallery cropping**, if uploading pre-cropped
   images turns out to be a real friction point in practice — deferred
   in Sprint 6, see `docs/PROJECT_MEMORY.md`.

## Planned (behind feature flags — architecture ready, not built)

These are deliberately unbuilt; each flag in `src/features/flags.ts`
flips on independently once its sprint arrives, following the same
schema → validator → repository → service → action pattern already
established:

- **Articles CMS** (`articles`) — the public articles pages exist and
  are static; this flag governs managing that content from the
  dashboard.
- **Courses** (`courses`) — structured lessons for the planned academy.
- **Events** (`events`) — a calendar for seminars and speaking
  engagements.
- **Student Portal** (`studentPortal`) — enrolled-student dashboard and
  progress tracking. Note: `/dashboard` is already reserved for this
  and must not be reused for the admin CMS (which lives at `/admin`).
- **Payments** (`stripe`) and **Direct Book Sales**
  (`directBookSales`) — Stripe-powered checkout, currently disabled
  input fields in the Book editor.
- **Multilingual** (`multilingual`) — Arabic/other language
  translations.
- **Analytics** (`analytics`) — traffic/engagement reporting inside the
  dashboard itself (distinct from the Google Analytics/Meta Pixel IDs
  already configurable in Site Settings, which just emit tracking
  scripts on the public site).

## Known constraints to respect in future sprints

- Never build routes/nav entries for the flagged features above until
  their flag flips to `true`.
- Never reuse `/dashboard` for admin CMS work — it's reserved.
- Singleton content rows (`HomepageContent`, `AboutContent`,
  `SiteSettings`) must use a plain `.update()`, never `.upsert()` — see
  `docs/PROJECT_MEMORY.md` for why.
- Any new list/table page should reuse the Sprint 4 kit
  (`parseListQuery`, `TableSearchForm`, `PaginationControls`, sortable
  `DataTable` columns) rather than rebuilding search/sort/pagination
  from scratch.
- Route protection lives in `src/proxy.ts` (Next.js 16's renamed
  `middleware.ts`), not `middleware.ts` — don't recreate the old file
  name.
- Any new protected admin route/resource needs both a coarse check in
  `proxy.ts` (if it's role-gated) *and* a `requirePageAccess()` /
  `requirePermission()` call in the actual page/action — the proxy
  check alone is UX-only, not the real security boundary.
- Never hand-roll a second password/session mechanism — extend the
  existing Auth.js config (`src/auth.ts`) for any future login method
  (e.g. OAuth for a student portal), since the Prisma adapter is
  already attached and ready for it.
- Prefer content-lifecycle states as a single enum (see `BookStatus`),
  never stacked booleans — the same reasoning applies to any future
  model that needs more than a simple published/unpublished flag.
- New image fields should use the Sprint 6 Media Picker
  (`MediaPickerField`/`MediaGalleryField`), not the older
  `ImageUploadField` — the latter stays only on fields it already
  powers (Homepage hero, Site Settings logo, SEO OG/Twitter images)
  until those are migrated.
