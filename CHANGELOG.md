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
