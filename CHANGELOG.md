# Changelog

All notable changes to this project are documented in this file, in the
order they happened. Entries are appended, never rewritten — this file is
a history, not a snapshot.

Versioning follows `MAJOR.MINOR.PATCH`: a minor bump per feature sprint,
a patch bump for a small corrective pass within a sprint.

---

## v0.1.0 — Sprint 1

### Added

- Public-facing pages built out on the existing design system: Home
  (hero, about preview, featured book, future courses, featured
  articles, quote, featured lectures, CTA, newsletter sections), About,
  Books, Book Detail, Courses, Articles, Article Detail.

### Notes

Used the design system and components already in place — no
architecture or component regeneration.

---

## v0.2.0 — Sprint 2

### Added

- Complete brand asset system built around the supplied logo: SVG/PNG
  exports, favicons, OG/Twitter card images, web manifest, brand README.
- `src/config/brand.ts` — single source of truth for brand tokens.
- Next.js metadata wiring (`generateMetadata`, OG/Twitter tags) across
  public pages.

### Notes

The logo itself was not redesigned — this sprint built a professional
system *around* the supplied mark.

---

## v0.2.1 — Sprint 2.5

### Fixed

- Incorrect Arabic diacritics (harakat) on the calligraphy mark,
  corrected per direct client feedback.

### Notes

Small corrective pass on top of Sprint 2's brand system; no new
surface area.

---

## v0.3.0 — Sprint 3

### Added

- Full backend architecture: Prisma ORM (v7, driver adapter) + local
  PostgreSQL, layered `schemas → validators → repositories → services →
  actions` pattern, reusable `Media` and `Seo` tables, singleton content
  rows (`HomepageContent`, `AboutContent`, `SiteSettings`) with a fixed
  well-known id.
- Feature flag system (`src/features/flags.ts`) and a resource+action
  permission system (`src/permissions/`) with four roles: Owner,
  Administrator, Editor, Viewer.
- Storage service abstraction for media uploads (local filesystem, swap
  target for Vercel Blob later).
- Admin dashboard shell at `/admin` (not `/dashboard` — that path stays
  reserved for a future student portal): sidebar, mobile drawer, topbar.
- Overview page with live stats (published books, pending questions,
  unread messages, subscribers) and a recent-activity feed.
- Books CRUD (unlimited titles, cover upload, Amazon/direct-purchase
  links, published/coming-soon/featured status).
- Homepage and About content editors, including a Timeline and
  Education manager.
- Ask Ahmad, Contact Messages, and Newsletter inbox-style tables with
  detail sheets/dialogs.
- Media Library (grid view, folder filter, search, upload, delete).
- Users, SEO, and Site Settings pages.
- Error boundaries, empty states, and loading skeletons across every
  admin route.

### Fixed

- A systemic shadcn/Radix bug across the whole project: several
  components used bare Tailwind data-attribute selectors
  (`data-open:`, `data-checked:`, etc.) where Radix actually emits
  value-based attributes (`data-state="open"`, `data-state="checked"`)
  — this silently broke Switch/Checkbox visual state, Tabs, Dialog,
  AlertDialog, DropdownMenu, NavigationMenu, Popover, Select, Sheet,
  Separator, Accordion, and Tooltip. Fixed by switching to
  `data-[state=open]:` / `data-[state=checked]:` syntax throughout.

### Notes

This sprint intentionally did **not** build authentication, Stripe,
student accounts, Articles/Courses/Events CMS, or expose any hidden
feature — all of that stays behind feature flags for a future sprint.

---

## v0.4.0 — Sprint 4

### Added

- Server-driven search, sort, and pagination on every admin list page
  (Books, Ask Ahmad, Contact Messages, Newsletter, Users), via a
  reusable `parseListQuery` / `TableSearchForm` / `PaginationControls`
  kit and sortable `DataTable` column headers.
- Debounced autosave (`useAutosave` + `AutosaveIndicator`) on the
  Homepage and About editors.
- A live preview panel on the Homepage editor — a browser-chrome
  mockup of the Hero, updating as you type.
- A Draft/Published toggle on Homepage content.
- Rich text editing (Tiptap) on the About page's Biography field,
  sanitized server-side before saving.
- A Flag/unflag action on Ask Ahmad questions, with a table indicator.
- CSV export on the Newsletter subscriber list (respects the active
  search filter), plus a disabled "New campaign" button for the
  upcoming campaigns feature.
- A grid/list view toggle and a Rename action on the Media Library.
- SEO completion: Keywords field, OpenGraph image upload, Twitter
  image upload, a site-wide "discourage indexing" toggle wired into
  `/robots.txt`, and an informational sitemap/robots block.
- An SEO card on the Book editor (meta title/description).
- "Latest uploads" and "Future features" sections on the dashboard
  Overview page.
- An `analytics` feature flag, matching the sidebar's hidden "Analytics"
  item.

### Fixed

- Two pre-existing bugs in the Homepage and About content repositories:
  both used `db.<model>.upsert({ create, update })` for a singleton
  row, which threw "Unknown argument" errors at runtime because
  Prisma's checked/unchecked input resolution didn't match the
  TypeScript-checked shape. Both now use a plain `.update()` — the same
  fix already applied to `SiteSettings` in Sprint 3.

### Improved

- Autosave failures now surface the actual server error via toast,
  instead of a generic "check your connection" message.
- The "Invite user" dialog now tells the inviter that no email is sent
  yet, instead of implying one is.

### Notes

Discovered mid-sprint: the public site does not read from the CMS at
all — `Hero`, the public About page, etc. are still fully static from
Sprint 1. Every editor built in Sprints 3–4 persists real data with no
effect on the live site yet. Scoped this sprint's Draft/Publish and
live preview features honestly around that gap (see
`docs/PROJECT_MEMORY.md` and `docs/sprints/SPRINT-04.md` for detail);
wiring the public site to the CMS is the top recommendation for
Sprint 5.

---

## v0.5.0 — Sprint 5

### Added

- Real authentication for the Admin Dashboard via Auth.js v5
  (Credentials provider, JWT sessions): secure login, logout, "remember
  me" (8-hour session by default, 30 days when checked), and a full
  forgot-password / reset-password flow with enumeration-safe
  responses.
- New Prisma models: `Account`, `Session`, `VerificationToken`,
  `PasswordResetToken`, `AuditLog`, plus `passwordHash` on `User`.
- Route-level protection for the whole `/admin` area (except the new
  auth pages) via `src/proxy.ts` — Next.js 16's renamed
  `middleware.ts` — redirecting unauthenticated visitors to
  `/admin/login` with the page they were trying to reach preserved as
  `callbackUrl`.
- A premium, on-brand login page at `/admin/login` (new `(auth)` route
  group), plus `/admin/forgot-password` and `/admin/reset-password`.
- Two-tier role-based access control: fast JWT-based gating in
  `proxy.ts` for UX, backed by an always-fresh, DB-backed check
  (`getCurrentUser()` → `requirePageAccess()` / `requirePermission()`)
  as the real security boundary — so a role change or a suspension
  takes effect on the very next request, not just the next login.
- A branded Unauthorized page, shown when a signed-in user without
  permission reaches a protected page.
- Secure password generation and hashing (bcryptjs) for seeded and
  newly-invited users; a "temporary password" dialog shown once on
  user creation and on a new admin-triggered "Reset password" action.
- Audit log architecture (`AuditLog` model + service) recording who did
  what and when, wired into login, logout, and all user-management
  actions — an IP-address field exists on the model for a future pass
  once the hosting target's real-client-IP header is confirmed.
- In-memory rate limiting on login and forgot-password attempts (10
  per 15 minutes per key), with the multi-instance caveat documented
  for a future move to a shared store (e.g. Upstash Redis).
- Baseline security headers (`next.config.ts`) — `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, etc.
- Sidebar navigation now filters itself per the signed-in user's role,
  using the same `can()` permission check as the pages themselves.
- The Users page now hides Invite/Edit/Reset/Delete controls entirely
  for roles that can't use them (Viewer), instead of showing
  controls that would just fail server-side.

### Fixed

- Newly-invited users previously had no way to ever log in — nothing
  set a password on creation. `userService.create()` now generates and
  hashes a temporary password and returns it once for the Owner to
  relay; the pre-existing Owner row (seeded in an earlier sprint with
  no password) is backfilled the same way by the seed script.

### Notes

`/dashboard` remains untouched and unprotected — it's still the
placeholder for a future student portal, not the CMS. Only `/admin` and
its subroutes required authentication, per `docs/PROJECT_MEMORY.md`'s
existing convention. Full detail, including the database and security
decisions behind this sprint, is in `docs/sprints/SPRINT-05.md`.

---

## v0.6.0 — Sprint 6

### Added

- A full Books Management System: General Information (title, slug,
  short/full description, author, publication date, ISBN, language,
  category, tags), Publishing (Draft / Published / Coming Soon /
  Archived + Featured), Media (cover + multi-image gallery), Purchase
  Options (Amazon live; direct website purchase, signed copies, eBook,
  and audiobook modelled and feature-flagged for later), and SEO (meta
  title/description, canonical URL, keywords) — organised as tabs in a
  single book editor.
- `BookStatus` enum (`DRAFT` / `PUBLISHED` / `COMING_SOON` / `ARCHIVED`)
  replacing the old `published`/`comingSoon` booleans, which allowed
  nonsensical combinations.
- A "Duplicate" action on the Books list — clones a book as an
  unfeatured Draft (title suffixed "(Copy)") for reusing an existing
  title as a starting point.
- Automatic image processing on every upload: dimension probing, a
  resized/optimised main image, and a generated thumbnail (JPEG, PNG,
  WebP; SVGs pass through untouched, being vector).
- A reusable Media Picker (single-select and multi-select/gallery
  variants) for choosing an existing library image or uploading a new
  one inline — built to be adopted by Homepage, Articles, Courses,
  Authors, and SEO image fields as those are built.
- Media Library folders reorganised to Images, Book Covers, Gallery,
  Documents, Downloads, and Videos; a details dialog per file (editable
  alt text, plus read-only dimensions/size/uploader/usage-count); a
  drag-and-drop upload zone over the library grid, alongside the
  existing upload button.
- The public site now reads books from the CMS instead of hardcoded
  placeholder data: the Books listing, Book Detail page, and the
  Homepage's Featured Book section are all live. Featured Book falls
  back to the newest published title when none is explicitly picked.
- Automatically generated `Book` JSON-LD structured data on every book
  page — no separate field to hand-maintain.
- Share buttons (copy link / native share) and an image gallery section
  on the Book Detail page; "About the author" now pulls from the real
  About page content instead of a hardcoded bio.

### Fixed

- The Books, Book Detail, and Homepage Featured Book section no longer
  read from `src/lib/data/books.ts` — the single largest known gap
  flagged at the end of Sprints 4 and 5 is now closed for books
  specifically (Articles remain the one content type still unwired).

### Removed

- `src/lib/data/books.ts` (the placeholder catalog) and the `Book`/
  `BookFormat` shapes in `src/types/content.ts` — both fully superseded
  by the real `Book` Prisma model. `Author`/`Article`/`Course`/
  `Seminar`/`Lecture` placeholders are untouched.

### Notes

Cropping was deliberately left out of the cover/gallery upload flow
this sprint — uploads are expected pre-cropped to a 2:3 cover ratio for
now; automatic resizing/thumbnailing is handled server-side. See
`docs/sprints/SPRINT-06.md` for the full reasoning and what's
recommended for Sprint 7.
