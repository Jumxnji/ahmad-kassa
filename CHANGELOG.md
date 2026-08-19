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

---

## v0.7.0 — Sprint 7

### Added

- A conversation-ready messaging architecture for Ask Ahmad: every
  question now gets a unique reference number (`AMK-2026-000023`,
  generated atomically per year), a `Conversation`, and a first
  `Message` — not just a status/answer pair. `Message.senderType`
  (USER/ADMIN), `attachments`, and `readAt` are all real columns
  already, alongside a separate staff-only `InternalNote` model and a
  `UserNotification` model reserved for future visitor-facing alerts.
  Nothing here requires a schema change to add admin replies, visitor
  replies, or attachments later.
- `QuestionStatus` expanded to a real workflow (New / In Review /
  Waiting / Answered / Closed / Archived), plus a `QuestionPriority`
  (Low/Normal/High/Urgent) — both editable from the new question
  detail page.
- A dedicated Ask Ahmad conversation detail page
  (`/admin/ask-ahmad/[id]`) — reference number, category/priority/
  status controls, a message timeline styled as a real conversation, a
  disabled "reply" panel (visibly reserved for the next sprint, not
  hidden), an internal notes panel, and Mark Read/Unread, Archive, and
  Delete actions.
- The Ask Ahmad inbox list gained an unread indicator, reference-number
  column, priority badges, and Status/Category/Unread-only filters on
  top of the existing search and pagination.
- A dashboard notification bell (topbar) showing unread question and
  contact-message counts with a quick-jump dropdown.
- The public Ask Ahmad form gained a required consent checkbox, a live
  character counter, a honeypot field, and an in-page **success
  screen** showing the visitor's reference number (copyable) instead
  of a toast-only confirmation.
- The public Contact form gained a required **Subject** field, a
  honeypot field, and the same in-page success-screen treatment.
- Branded HTML email templates (logo, brand colours, footer with
  contact details) for: question received (visitor confirmation,
  subject line includes the reference number), contact message
  received (visitor confirmation), and a shared admin-notification
  template used for both new-question and new-contact-message alerts.
- Resend wired up for real: a small `emailService` with a short
  retry-on-failure, sending both the visitor confirmation and the
  internal notification on every submission. Delivery failures are
  logged and never surface as a user-facing error — the question or
  message is already safely saved by that point.
- Spam protection: a honeypot field (silently "succeeds" without
  processing if triggered — never reveals it was caught), per-IP rate
  limiting reusing the existing limiter, and duplicate-submission
  prevention (an identical email+message within 2 minutes returns the
  original result instead of creating a second row).
- Contact Messages admin list gained a Subject column and an Unread/
  Read/Archived filter; the detail sheet now shows the subject as its
  heading.

### Fixed

- The public Contact page no longer prints the admin/notification
  email address in plain HTML (a `mailto:` icon link) — the form is
  the intended channel. Internal notification emails now read their
  recipient from the admin-configurable `SiteSettings.contactEmail`
  server-side, rather than always using the same constant that used to
  also appear on the public page.

### Notes

Admin replies, visitor replies, attachments, and a customer portal are
all deliberately not built this sprint — see
`docs/sprints/SPRINT-07.md` for exactly which fields/tables already
exist for each so implementing them later is a feature, not a
migration.

---

## v0.8.0 — Sprint 8

### Added

- A confirmed-opt-in newsletter subscriber model replacing the old
  single-step `email`/`language`/`subscribed` stub: `status`
  (Pending/Active/Unsubscribed/Suppressed/Bounced/Complained),
  `source` (Homepage/Footer/Newsletter Page/Book Page/Courses Coming
  Soon/Admin Import/Other), consent timestamp + version, confirmation
  token (hashed, single-use, expiring), and case-insensitive email
  matching via a normalized-email unique key.
- The full public opt-in flow: signup → branded confirmation email →
  `/newsletter/confirm` (success/expired/invalid states, with a
  resend-confirmation action for expired links) → active subscriber →
  short branded welcome email.
- Deterministic, storage-free unsubscribe links: every outgoing
  newsletter email embeds an HMAC-derived token computed from the
  subscriber's id, so a working unsubscribe link is reconstructible at
  any point in the future without ever having persisted a raw token.
  `/newsletter/unsubscribe` shows a masked-email confirm screen (never
  auto-unsubscribes on a bare link click/prefetch), then a resubscribe
  option that restarts a fresh confirmation cycle.
- The shared `<NewsletterForm>` (used at all 5 existing signup
  locations — homepage, footer, book detail, courses page, dedicated
  newsletter page) now records which of those locations a subscriber
  came from, gained an optional first-name field, a honeypot, and
  on-page consent copy.
- A full admin Newsletter section (`/admin/newsletter/*`) with five
  tabs: **Overview** (real subscriber/campaign counts and recent
  activity, no fabricated metrics), **Subscribers** (search/filter by
  status/source/language, individual detail view, manual unsubscribe/
  resubscribe/suppress/delete, CSV export), **Campaigns**, **Email
  Templates** (read-only reference rendering of the real branded
  templates), and **Settings** (sender identity, subject lines,
  compliance defaults, confirmation-token expiry, test-email
  allowlist).
- A real Campaign system: `Campaign` + `CampaignRecipient` models, a
  campaign editor (Details/Content/Audience/Preview/Test Email/
  Review & Send tabs) with autosave, a Tiptap-based content editor
  reused from the Books CMS, a real desktop/mobile/plain-text preview
  rendered through the actual email template, and rate-limited,
  audited test sends.
- **Sending to the full active list is implemented for real**, not
  mocked: a `sendCampaignAction` that atomically transitions the
  campaign into `SENDING` (the idempotency guard against a duplicate
  "Send now" click), snapshots the confirmed-active audience into
  `CampaignRecipient` rows, sends in small concurrent chunks, and
  records per-recipient success/failure — ending in `SENT` or
  `PARTIALLY_FAILED`. Never sends to Pending/Unsubscribed/Suppressed/
  Bounced/Complained.
- A Resend delivery-events webhook (`POST /api/webhooks/resend`) with
  hand-verified Svix-compatible HMAC signatures — bounce/complaint
  events suppress the matching subscriber and mark the matching
  `CampaignRecipient` as failed.
- A new `campaigns` permission resource (mirroring the `ownership`
  resource's precedent of a dedicated resource for one especially
  sensitive capability) and a new `send` action — Owner/Administrator
  can send to the full list, Editor can draft/edit/preview/test-send
  but not send, Viewer is read-only.
- Five new feature flags for the pieces deliberately deferred this
  sprint: `newsletterScheduling`, `newsletterImports`,
  `newsletterPreferences`, `newsletterSegmentation`,
  `newsletterAnalytics` — see Notes below.
- A minimal `vitest` setup (the project's first test framework) with
  35 pure-logic unit tests: email normalization, token generation/
  hashing/expiry, unsubscribe-token verification, webhook signature
  verification, `can()` for the new campaigns resource, CSV escaping,
  and campaign/subscriber status-transition rules.

### Changed

- `emailService.send()` gained optional `from`/`text` parameters (used
  by newsletter mail, whose sender identity is admin-configurable) and
  now returns the Resend message id, used to correlate a later
  webhook event back to the send that produced it.
- `src/lib/email/layout.ts`'s shared shell gained an optional
  `footerNote` override, used by newsletter/campaign templates to show
  the unsubscribe link and business address in place of the default
  transactional-message line.

### Notes

**Deferred, with documented blockers** (per this sprint's own brief,
which explicitly allows this): cron-based **scheduling** (the
`scheduledFor` column and a disabled "Schedule for later" control
exist; no cron infrastructure is wired up — see
`docs/DEPLOYMENT.md`); **CSV import** (no legitimate list exists yet
to import, and the brief explicitly prohibits importing purchased/
scraped lists); granular **email preferences** (V1 is a single
subscribed/unsubscribed state); audience **segmentation** (V1 always
sends to "all active"); open/click **analytics** (left off by
default — no fabricated engagement numbers anywhere in the UI).

Delivery uses controlled-concurrency individual sends
(`emailService.send()` per recipient, in chunks of 20) rather than
Resend's `batch.send()` endpoint — evaluated and rejected because its
permissive-validation partial-failure reporting doesn't cleanly
correlate back to which recipient failed, which this sprint's
per-recipient `CampaignRecipient` tracking needs. See
`docs/sprints/SPRINT-08.md` for the full reasoning.

A pre-existing subscriber row from before this sprint's migration is
grandfathered in as already-confirmed, with no working unsubscribe
history-token (unsubscribe tokens are now derived from the subscriber
id rather than stored, so this is moot going forward) — see
`docs/sprints/SPRINT-08.md`.

---

## v0.9.0 — Sprint 9

### Added

- Environment-aware `SITE_URL` (`NEXT_PUBLIC_SITE_URL` override) — the
  single source every canonical/OG/sitemap/robots consumer reads
  through, so localhost, preview deployments, and the not-yet-connected
  production domain all resolve correctly without touching call sites.
- Homepage and About public metadata now read the real, editor-set
  `Seo` row instead of a fully hardcoded title/description; the About
  editor gained a "Search & sharing" tab (it previously had none, even
  though the underlying `seo` relation already existed).
- A reusable `<SeoFields>` admin fieldset — meta title/description
  with live character-length guidance (60/155 chars), canonical URL,
  keywords, and a per-item noindex toggle — now shared by the Book,
  Homepage, and About editors instead of each hand-rolling the same
  4–5 fields.
- Structured data expanded from Person/Organization/Website/Book to
  also cover `Article` (article detail), `AboutPage` (About),
  `ContactPage` (Contact), and `BreadcrumbList` everywhere a visible
  breadcrumb trail is shown (Books/Articles detail, About, Ask Ahmad,
  Contact).
- Dynamic, branded Open Graph images (navy/gold/ivory, via a shared
  `ImageResponse` renderer) for the homepage, About, Books, Articles,
  and Courses — replacing one static PNG reused everywhere. A book's
  own cover image or an editor-set OG image always wins over the
  generated card when one exists.
- Privacy-conscious analytics: `@vercel/analytics` (cookieless, no
  consent banner needed) plus a typed `trackEvent()` abstraction
  wired into newsletter/Ask Ahmad/contact submissions, newsletter
  confirmation, the Amazon purchase link, book detail views, external
  video clicks, and course-interest clicks.
- Search Console / Bing ownership verification support
  (`GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION`).
- Accessibility fixes: `FormMessage` now announces validation errors
  (`role="alert"`); real name/email form fields gained `autoComplete`;
  the admin dashboard's sidebar/mobile nav landmarks gained distinct
  `aria-label`s (previously ambiguous, unlike the public site's);
  three more Framer Motion components (hero entrance, loading-screen
  pulse, reading-progress bar) now respect `prefers-reduced-motion`,
  joining the one that already did.
- `<html dir>` is now genuinely wired to `isRtl(defaultLocale)`
  (`src/config/i18n.ts`) rather than hardcoded — still resolves to
  `"ltr"` today, but the mechanism is real. `Button`'s icon-spacing
  slots, named `inline-start`/`inline-end` but implemented with
  physical `pl-*`/`pr-*`, were switched to logical `ps-*`/`pe-*`.
- Two new database indexes for previously-unindexed common query
  patterns: `Book(status, featured)`, `ContactMessage(createdAt)`.
- `next.config.ts` now negotiates AVIF/WebP for every `next/image`.
- `src/app/global-error.tsx` — a minimal, self-contained fallback for
  an error thrown by the root layout itself (previously fell through
  to Next's unstyled default).
- New reference docs: `docs/SEO.md`, `docs/ACCESSIBILITY.md`,
  `docs/PERFORMANCE.md`, `docs/ARCHITECTURE.md` (none existed before
  this sprint).

### Fixed

- `buildPersonJsonLd()`/`buildOrganizationJsonLd()` no longer claim
  `siteConfig.socialLinks`' still-generic placeholder domains
  (`https://youtube.com`, etc.) as confirmed social profiles in
  structured data — `sameAs` is correctly omitted until real profile
  URLs are set.
- `src/config/brand.ts`'s palette (used for `theme-color`/manifest/
  favicon metadata) now matches the real on-page design tokens in
  `globals.css`, rather than a stale earlier approximation.

### Notes

Deliberately deferred this sprint, each with reasoning recorded in
`docs/sprints/SPRINT-09.md`: a tuned Content-Security-Policy header;
live GA4/Meta Pixel script injection (needs a consent banner first —
the existing admin-captured IDs are untouched, just not wired to
render anything); a full RTL/logical-property rewrite (~114 remaining
physical-utility instances catalogued in `docs/ACCESSIBILITY.md` for
whenever multilingual work actually starts); `VideoObject` structured
data (no real configured lecture video exists yet).

---

## v0.9.1 — Sprint 10

### Fixed

- **Privilege escalation (security):** `resetUserPasswordAction` had
  no Owner guard, unlike its sibling `updateUserAction`/
  `deleteUserAction` — an Administrator could reset the Owner's
  password and receive the plaintext temporary password back, a full
  account-takeover path. Now requires the `ownership` permission
  (Owner-only) before resetting a target whose role is `OWNER`,
  matching the existing pattern elsewhere in the same file.
- A bad id on an admin detail route (`/admin/books/[id]`,
  `/admin/ask-ahmad/[id]`, `/admin/newsletter/subscribers/[id]`,
  `/admin/newsletter/campaigns/[id]`) previously fell through to
  Next's unstyled default 404 instead of a branded one — added
  `src/app/admin/(app)/not-found.tsx`, mirroring the existing
  `error.tsx`/dashboard-shell pattern.
- `AlertDialogContent` (used everywhere via the shared `ConfirmDialog`
  for destructive-action confirms) lacked the mobile-safe
  `max-w-[calc(100%-2rem)]` margin `DialogContent` already had —
  rendered edge-to-edge at exactly 320px viewports.
- `deleteContactMessageAction`, `deleteQuestionAction`, and
  `markQuestionReadAction` now check the record exists before
  mutating, matching every sibling action in the same files
  (robustness/consistent error UX, not a security fix — Prisma
  already threw on a missing row).
- Three token-based public newsletter actions
  (`confirmNewsletterSubscription`, `unsubscribeFromNewsletter`,
  `resubscribeToNewsletter`) now share the same per-IP rate limit
  every other public write path already has, as defense-in-depth
  against token-guessing (token verification itself was already
  sound).

### Changed

- Deleted 8 files with zero remaining references: 4 orphaned public
  components (`PillarsSection`/`PillarCard`/`PillarCardSkeleton`,
  `SuccessState`), 2 unused shadcn primitives
  (`NavigationMenu`/`Accordion`), the unused `<FeatureGate>` wrapper
  (every call site already checks `isFeatureEnabled()` directly), and
  `src/validators/newsletter.validator.ts` (superseded — the real
  subscriber-status actions never adopted it).
- Removed 3 unused exported functions: `formatPrice`,
  `htmlToPlainText`, `getCourseBySlug`.
- Consolidated four admin list/detail pages' locally-duplicated
  `STATUS_LABEL`/`STATUS_TONE`/category-label constant objects into
  shared files (`src/dashboard/books-constants.ts`,
  `ask-ahmad-constants.ts`, `contact-constants.ts`), following the
  precedent `newsletter-constants.ts` already set.
- `renderEmailLayout()` now sets `color-scheme`/
  `supported-color-schemes` meta tags to `light`, so dark-mode email
  clients don't auto-invert the intentionally light navy/gold/paper
  design.

### Notes

This was a QA/release-candidate sprint per the client's brief, not a
feature sprint — no pages regenerated, no components redesigned, no
architectural changes beyond the one genuine security fix above. Full
findings (including the "everything's already correct" results from
the audit) are in `docs/sprints/SPRINT-10.md`, along with what was
live-browser-tested versus code-reviewed only.

---

## v0.10.0 — Sprint 11: Homepage Redesign & Brand Identity Integration

*Recorded retrospectively during Sprint 13's documentation reconciliation — this
work happened in its own prior sprint, not during Sprint 13.*

### Added

- A new, professionally-commissioned logo emblem (Arabic calligraphy "Ahmad" inside
  a teardrop/flame mark), replacing the Sprint 2 font-glyph-derived mark at the same
  file paths (`public/brand/logo-mark.svg` + white/dark colourways) — every existing
  consumer picked it up automatically.
- A full homepage rebuild around the new mark: `Hero` rebuilt with a Mode A/B visual
  slot (`HERO_VISUAL: "emblem" | "portrait"` — `hero-emblem.tsx` live, `hero-portrait.tsx`
  built and ready for a future photograph); a new `TeachingAreasSection`; the
  Featured Book section promoted and given a "luxury publication" treatment; the
  `ScrollReveal` client-island pattern for scroll-triggered motion on Server
  Component sections; the `.manuscript-texture`/`.manuscript-texture-navy` background
  utility.
- Subtle recurring mark usage: the hero "seal" treatment, a 5%-opacity watermark on
  navy sections (Quote, Newsletter), and an optional mark-glyph variant on
  `ManuscriptDivider`.
- Real section order on `/`: Hero → Featured Book → About Preview → Teaching Areas →
  Quote → Latest Khutbah → Future Courses → CTA → Newsletter.

### Changed

- `FeaturedArticlesSection` removed from the homepage (Articles' own page/nav
  untouched — just no longer promoted on `/`).

### Fixed

- N/A — this was a design/redesign sprint, not a bug-fix sprint.

### Notes

A genuine one-time redesign, not the start of an ongoing "redesign whenever" norm —
Sprint 12 immediately followed to turn the decisions made here into permanent,
documented creative governance so future sessions don't need to reverse-engineer
intent from the diff.

---

## v0.11.0 — Sprint 12: Creative Direction & Design System

*Recorded retrospectively during Sprint 13's documentation reconciliation.*

### Added

- `docs/CREATIVE_DIRECTION.md` (new) — the permanent WHY: voice, audience, palette
  and motion philosophy, and the explicit "the professional emblem is not an
  illustration" framing for how the mark should and shouldn't be used.
- A revised `docs/DESIGN_SYSTEM.md` — the permanent HOW, established as the single
  implementation source of truth (including "The Mark as a Design Language" and the
  `tailwind-merge` `bg-` prefix naming gotcha found during Sprint 11).

### Notes

Documentation and governance only — no code changed. Establishes a permanent split
followed by every sprint since: philosophy belongs in `CREATIVE_DIRECTION.md`,
implementation detail in `DESIGN_SYSTEM.md`, no duplicated guidance between them,
and (per the client's explicit direction) no third `BRAND_SYSTEM.md` document.

---

## v0.11.1 — Sprint 13: Baseline Recovery & Documentation Reconciliation

### Fixed

- **A live brand-asset break** — several production brand files (favicons, platform
  icons, OG/social fallback images, the transactional-email logo, and a raster
  export ladder) had been deleted or gone stale relative to the Sprint 11 mark.
  Every asset was regenerated from the same frozen mark geometry
  (`brand-source/AHMAD-06.svg`), never redrawn or reinterpreted. A hand-rolled,
  dependency-free `favicon.ico` writer and a corrected (previously would-have-been
  upside-down) `safari-pinned-tab.svg` transform were part of this fix.
- The transactional/newsletter email header now uses a live digital lockup (mark
  image + real `siteConfig.name` text) instead of a reference to a deleted
  flattened logo file (`src/lib/email/layout.ts`).
- The static Open Graph/Twitter fallback images are now generated through the same
  shared `renderBrandedOgImage()` renderer every dynamic per-page OG image already
  used, rather than depending on a hand-shaped-text source file that couldn't be
  faithfully regenerated.

### Changed

- Designer source files (`AHMAD.ai`, raw exports, two still-watermarked draft
  files) moved from `public/brand/` (publicly downloadable) to `brand-source/` at
  the project root (not publicly servable).
- `src/config/brand.ts`'s dead `logo.primary` field removed (zero references,
  superseded by the digital-lockup approach).
- Reconciled documentation with what Sprints 11–12 actually shipped: this file,
  `docs/PROJECT_MEMORY.md`, `docs/ROADMAP.md`, `docs/UX_ARCHITECTURE.md` (restructured
  into current/planned/future-aspirational), `docs/BRAND_USAGE.md`, `docs/PERFORMANCE.md`,
  `docs/ACCESSIBILITY.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, and
  `public/brand/README.md` (now includes a canonical per-asset manifest).
- Added the proposed, not-started "Editorial Refinement" sequence to
  `docs/ROADMAP.md`, documented only, per the client's explicit "document, do not
  execute" instruction.

### Notes

A repair-and-reconcile sprint, not a redesign — no visual direction changed, no new
features shipped. Full detail in `docs/sprints/SPRINT-13.md`.

---

## v0.11.2 — Sprint 13 checkpoint: root 404 + Git history

### Fixed

- **A genuinely unmatched public URL** (a typo, a dead link) fell through to
  Next's plain default 404 instead of the branded one — `(site)/not-found.tsx`
  only ever renders for a `notFound()` call from *within* a matched route (e.g.
  an invalid book slug); a completely unmatched path needs a root-level
  `not-found.tsx`, which didn't exist. Added `src/app/not-found.tsx`, reusing
  `SiteHeader`/`SiteFooter` directly (mirroring `(site)/layout.tsx`) so a
  mistyped URL still lands on something that looks like this site. The 404
  content itself was extracted into a shared `NotFoundContent` component
  (`src/components/shared/not-found-content.tsx`) so both the root and scoped
  `not-found.tsx` render identical content from one implementation — and now
  includes the official mark (`ManuscriptDivider`'s `mark` variant), which the
  page previously lacked.
- `.gitignore`'s `.env*` pattern was accidentally also ignoring `.env.example`
  (a template with no real secrets, meant to be a shared reference) — added a
  `!.env.example` exception.

### Changed

- **Established the first Git checkpoint since Sprint 6.** Sprints 7 through
  13 existed only as uncommitted working-tree changes; organised into a small
  number of truthful commits (not a fabricated per-sprint history — see
  `docs/sprints/SPRINT-13.md` for the full commit plan and reasoning, and
  `git log` for the actual result).
- `brand-source/`'s two authoritative files (`AHMAD.ai`, `AHMAD-06.svg`) are
  now tracked; the watermarked drafts and non-essential reference comps in the
  same directory are gitignored rather than committed.

### Notes

Per the client's explicit instruction, no visual redesign, no new features —
this closes out the two remaining items from Sprint 13's baseline recovery
report before Editorial Refinement begins.

---

## v0.12.0 — Sprint 14: Editorial Refinement 1 & 2 (homepage audit + Tier 1)

### Added

- `docs/HOMEPAGE_EDITORIAL_AUDIT.md` — a full critique of the live homepage
  (Editorial Refinement 1), studied in-browser and cross-checked against the
  creative-direction and design-system documents. Three proposed hero
  directions, a section-by-section audit, and a tiered recommendation list.
- `TeachingAreaRow` (`src/components/cards/teaching-area-card.tsx`) — a
  numbered editorial index row, replacing the icon-in-circle card grid.
- `hasConfirmedProfile()` (`src/constants/site.ts`) — shared logic for
  "is this a real social profile URL or a placeholder domain," now used by
  both the footer's social icon row and `src/lib/seo.ts`'s structured-data
  `sameAs` filtering, which previously duplicated the same check.

### Changed

Editorial Refinement 2 — the audit's Tier 1 recommendations only, per the
client's explicit scope:

- Header/footer (`Logo`): full name ("Ahmad Mohamed Kassa") restored, mark
  enlarged and re-aligned — both surfaces share one component, so one fix
  covered both.
- Hero: genuinely asymmetric column ratio (`2fr`/`3fr`, not the prior
  near-even `1.05fr`/`0.95fr`); the name now sets on one line at common
  desktop widths; the emblem's bounding box widened to read as a
  counterweight; the redundant trust line removed in favour of an
  overline + role-line pair; body copy tightened.
- Teaching Areas: icon-in-circle cards replaced with `TeachingAreaRow`.
- About: the `AK` initials placeholder replaced with the brand mark
  (`PortraitFrame`, shared with the dormant Hero Mode B slot); layout
  widened to a genuine asymmetric split; the bulleted credentials list
  replaced with one flowing typographic line.
- Featured Book: the "Featured" corner badge removed (redundant with the
  section's own eyebrow).
- Future Courses / `/courses`: module/lesson-count metadata removed from
  `CourseCard`.
- Footer: a standalone mission-statement line added above the link grid;
  social icons now render only for confirmed profile URLs (currently none,
  so the row doesn't render at all rather than showing placeholder icons).
- Homepage rhythm: Latest Khutbah promoted to `size="lg"`, breaking a
  three-consecutive-default-size run between Quote and Newsletter.
- `docs/DESIGN_SYSTEM.md` — one row added to the existing mark-touchpoint
  table for the new `PortraitFrame` placement.

### Notes

Tier 1 only, per the client's explicit "do not begin Tier 2 refinements."
Full before/after reasoning, what was deliberately not implemented, and
remaining gaps toward a 9.7+ homepage: `docs/sprints/SPRINT-14.md` and
`docs/HOMEPAGE_EDITORIAL_AUDIT.md`'s Implementation Outcome section.

---

## v0.13.0 — Sprint 15: Editorial Refinement 3 (About profile + Featured Book)

### Changed

A new, narrowly-scoped client brief covering exactly two homepage sections —
header, hero, Teaching Areas, and footer explicitly untouched:

- About preview (`about-preview-section.tsx`): rebuilt as a text-dominant
  editorial profile — a narrow sticky `PortraitFrame` column beside a wide
  text column carrying an unquoted editorial lede statement (the section's
  "one strong typographic moment," deliberately not quotation-marked, since
  no genuine direct quote exists to attribute), the full biography, and a
  restrained four-line marginal index, replacing Sprint 14's flowing
  credential sentence.
- Featured Book (`featured-book-section.tsx`): cover column and cap both
  widened so the cover reads as the largest single visual element on the
  homepage; an honest, conditionally rendered publication caption
  (category/year, only when the CMS data actually has them) and a plain
  "By {authorName}" line added. CTA structure and the `directBookSales`
  flag gate left untouched.

### Notes

Neither section's emblem placement changed — About's `PortraitFrame`
already accepts a future portrait with no architectural change, and the
Featured Book section deliberately does not add a second mark, since the
brief warns against stamping it in "simply because it exists." Full
reasoning, directions considered, and remaining gaps:
`docs/sprints/SPRINT-15.md` and `docs/HOMEPAGE_EDITORIAL_AUDIT.md`'s
Editorial Refinement 3 Implementation Outcome section.

---

## v0.14.0 — Sprint 16: Editorial Refinement 4 (full homepage creative director pass)

### Changed

A full-page micro-polish pass — the homepage architecture from ER1–ER3
treated as stable; no sections, features, colours, fonts, or logo geometry
added or changed:

- `Logo`: removed the header/footer mark's hover scale transform, leaving
  an opacity-only dim — closes a Tier 3 deviation from the design system's
  "never scale on hover" rule flagged since Sprint 14's audit.
- `SiteHeader`: the persistent nav "Newsletter" button demoted from gold to
  outline, so it stops competing with each page's own primary CTA for
  gold's "single most important action" meaning.
- `AboutPreviewSection`: the marginal index restyled to the site's existing
  mono/tracked archival-label idiom, reading as editorial notation rather
  than smaller body text.
- `HeroEmblem`/`HeroPortrait`: mobile width capped at `260px` (previously
  unconstrained, filling nearly the full mobile viewport) — desktop
  unchanged.
- `SiteFooter`: removed the footer's duplicate inline newsletter form (a
  third signup touchpoint stacked directly beneath the dedicated Newsletter
  section); the link grid now sits compactly under the mission line instead
  of stretching full-width.

### Notes

Several changes were considered and explicitly rejected rather than
shipped — softening the paper/navy tone transitions with additional
mark-dividers, demoting Featured Book's CTA, converting Future Courses to
a list, and adjusting watermark opacity — each judged to either dilute an
already-correct restraint or fix a problem that live inspection didn't
actually confirm. Full reasoning: `docs/sprints/SPRINT-16.md` and `docs/
HOMEPAGE_EDITORIAL_AUDIT.md`'s Editorial Refinement 4 Implementation
Outcome section.

---

## v0.15.0 — Sprint 17: Editorial Refinement 5 (professional portrait integration)

### Added

- The first approved professional photograph of Ahmad Mohamed Kassa,
  activating the Hero Mode A/B architecture built in Sprint 11 for
  exactly this moment. The original is preserved byte-for-byte at
  `portrait-source/ahmad-mohamed-kassa-headshot-original.png`
  (mirroring `brand-source/`'s provenance convention); two derived
  crops live in `public/portraits/` — a tighter 880×880 square for
  Hero (`priority`-loaded), a fuller 1122×1402 frame for About
  (lazy-loaded). No retouching, no AI reconstruction.
- `PortraitFrame` now branches on an optional `src` prop — a real
  photograph when supplied, the original emblem placeholder when not
  — so any future call site without a photo yet still gets the same
  "no photo yet" convention.

### Changed

- `HERO_VISUAL` flipped to `"portrait"`; `HeroEmblem` (Mode A) stays in
  the codebase, unchanged, as the documented fallback.
- `AboutPreviewSection` now renders the real portrait in place of the
  emblem, in its existing sticky media column.

### Notes

No new mark/watermark placement was added to either section — the
header/footer `Logo` and Mode A's continued presence in the codebase
were judged sufficient supporting brand language, per the brief's
explicit warning against stacking "portrait + logo + watermark +
divider logo" all at once. No mobile reordering, no retouching, no new
placements elsewhere on the site. Full reasoning: `docs/sprints/
SPRINT-17.md`, `docs/BRAND_USAGE.md`'s new "The Portrait" section.

---

## v0.16.0 — Sprint 18: Real Khutbah Integration

### Added

- Two real, verified khutbah recordings from Masjid Al-Noor replace the
  fictional "Weight of Gratitude" placeholder — title, publish date,
  duration, and thumbnail all confirmed directly against YouTube (oEmbed
  + the watch page's own structured data), nothing invented. The newest
  ("Domestic Violence: In Light of the Qur'an and Sunnah," 2024-10-21)
  leads with full editorial prominence; the next-most-recent ("Parental
  Conflicts: Impact on Child Mental Health," 2024-09-28) appears as a
  quieter secondary entry — genuine chronology, not URL order.
- `KhutbahEntry` — a new presentational component pairing the extended
  `VideoThumbnail` with editorial typography for this primary/secondary
  layout, without the badge/excerpt chrome of the existing `VideoCard`.

### Changed

- `VideoThumbnail`: now renders a real thumbnail image + play affordance
  when given one, falling back to the original placeholder facade when
  it isn't — one component, not a parallel system.
- `next.config.ts`: added `i.ytimg.com` to `images.remotePatterns`
  (HTTPS-only, single hostname, no wildcard) so real YouTube thumbnails
  can be served through `next/image`'s optimisation pipeline.

### Notes

The homepage design is now formally **frozen — content-driven changes
only**. This sprint replaced placeholder content inside the existing,
already-approved Latest Khutbah architecture without touching hero,
typography, colour, section order, or any decorative motif. Full
reasoning: `docs/sprints/SPRINT-18.md`.

---

## v0.16.1 — Sprint 18 correction: three-khutbah editorial layout

### Added

- A third real, verified khutbah ("Lessons from the Prophet's Farewell
  Sermon Part 2," 2023-07-21) — the oldest of the three, so it lands in
  the least prominent slot under genuine chronological sort with no
  manual override needed.

### Changed

- `LatestKhutbahSection`: the 1-primary + 1-secondary layout left a large
  empty area beside the lone secondary item once real content existed —
  a genuine, in-browser-confirmed composition problem. Corrected to 1
  primary + 2 secondary (grid ratio `1.6fr/1fr`, ~62/38), with the
  secondary column stretching to match the primary's height and a
  hairline divider between its two entries, reading as a curated
  editorial sidebar rather than an empty quadrant or a third generic
  card.
- The bottom action reworded from centred "Watch more on YouTube"
  (`variant="outline"`) to left-aligned "More khutbahs on YouTube →"
  (`variant="link"`, the design system's own documented but
  previously-unused "Text" role) — connects it to the composition instead
  of floating in empty space, and accurately names the real destination
  (the full channel, not an Ahmad-only playlist).

### Notes

The third video's real title includes a channel-appended " | Ustadh Ahmad
Mohamed Kassa" byline, dropped from display per this site's explicit rule
never to call him "Ustadh" (`docs/BRAND_USAGE.md`) — the words of the
actual talk title are unchanged. This remains a content-driven layout
correction under the existing design freeze, not a new design sprint —
no section outside Latest Khutbah changed. Full reasoning: `docs/sprints/
SPRINT-18.md`'s "Correction — Three-Khutbah Editorial Layout" addendum.

---

## v0.17.0 — Sprint 19: Future Courses editorial cards

### Added

- `Course.featured?: boolean` (`src/types/content.ts`), mirroring the
  existing `Article.featured` convention — marks the 4 courses (of 5)
  shown on the homepage teaser: Psychology in Islam, Marriage in Islam,
  Foundations of Ruqyah, Understanding Aqeedah. Islamic Family Guidance
  is held back only because it and Marriage in Islam both sit under
  "Marriage & Family," not for weaker content — it remains a genuine,
  undeleted course, fully visible on `/courses`.
- `FutureCourseCard` — a new homepage-only card. No thumbnail, icon, or
  illustration; a mono/tracked "Coming soon · {Level}" label, title,
  excerpt, hairline divider, and the existing "Notify me at launch"
  link carry the whole card. Deliberately separate from the existing
  `CourseCard`, which `/courses` continues to use unmodified.

### Changed

- `FutureCoursesSection`: now filters `getAllCourses()` by `.featured`
  and renders `FutureCourseCard`. With exactly 4 curated courses, the
  existing grid (`sm:grid-cols-2 lg:grid-cols-4`) produces a clean
  1 → 2×2 → 4 responsive flow with no orphaned fifth card. Section
  header copy and the "View the academy" action are unchanged.

### Notes

Card hover/keyboard-focus treatment (`-translate-y-1` + a gold border
tint, 300ms, `focus-within:` parity) reuses the same subtle-editorial
interaction language already established elsewhere on the homepage —
no scale, shadow, or glow. This was a local, content-driven refinement
of one section under the existing homepage design freeze (Sprint 18) —
no other section changed. Full reasoning: `docs/sprints/SPRINT-19.md`.

---

## v0.18.0 — Sprint 20: Books index, publication archetype

### Added

- `PublicationEntry`/`PublicationIndex` — a numbered editorial spread
  for `/books` (archival "01 / Published" label, a dominant real-
  aspect-ratio cover, a narrow restrained text column, an understated
  "Read about the book" link). Renders the same way at one title or
  several — a future second or third book becomes entry 02/03 in the
  same list, not a redesign.

### Fixed

- **Content truth**: "The Great Debate"'s `excerpt`/`description` were
  seed-time placeholder copy about general theism apologetics, written
  before a real cover existed and never reconciled once one was
  uploaded through the admin Media Library. The real cover's own
  printed subtitle — "Is It Permissible to Use Jinn in Islamic Exorcism
  (Ruqyah)?" — shows the book's actual subject, corroborated
  independently by its own Amazon listing URL. Corrected via a guarded
  `prisma/seed.ts` backfill (same shape as the existing Amazon-URL
  backfill) using only the book's own real, verbatim cover text — no
  invented marketing copy. Because `excerpt` also feeds the book detail
  page, its meta description, its JSON-LD, and the homepage's Featured
  Book section, this single data correction fixed the same wrong copy
  everywhere it appeared, including the frozen homepage (a content
  change, not a design one — permitted under the existing freeze).

### Changed

- `/books`: replaced the 3-column `BooksGrid`/`BookCard` treatment with
  `PublicationIndex`; header copy changed from "The catalog" (implied
  more items should follow) to "Published works"; `Section` given
  `size="lg"` so the page-ending gap before the footer closes
  compositionally, without filler copy.

### Notes

`BookCard`/`BooksGrid` are untouched and still used by Book Detail's
"Related" section, a genuine multi-item grid where a card treatment
remains correct. Full reasoning: `docs/sprints/SPRINT-20.md`.

---

## v0.18.1 — Sprint 20 correction: proportion, pacing & hierarchy

### Changed

- `/books`: the opening's `Section size="lg"` (applied symmetrically
  top and bottom) inflated the space before the publication as much as
  it fixed the space after it — split into asymmetric `pt-14 sm:pt-16
  pb-28 sm:pb-36`, keeping the generous bottom that already solved the
  footer transition while tightening the top so the publication now
  appears within the first viewport at normal desktop widths.
- `PublicationEntry`: cover max-width reduced roughly 20% (17rem→13rem
  range across breakpoints) — clearly dominant without being
  poster-sized. Text column widened (`max-w-md`→`max-w-lg`) and given
  larger type (title `text-4xl/5xl`, subtitle `text-2xl`) so it earns
  real visual weight next to the smaller cover, while the composition
  stays asymmetric rather than 50/50.
- The invented intro paragraph ("Long-form writing on belief and
  practice... not released on a schedule") was removed rather than
  replaced — it existed nowhere else as approved copy.

### Notes

The concept from the original Sprint 20 pass — the numbered publication
entry, `PublicationIndex`'s scalability, no ecommerce grid, the internal
"Read about the book" CTA with Amazon reserved for the detail page, and
Sprint 20's content-truth correction — are all unchanged — this is a
proportion correction to the same architecture, not a new direction.
Full reasoning: `docs/sprints/SPRINT-20.md`'s "Correction — Proportion,
Pacing & Hierarchy."

---

## v0.19.0 — Sprint 21: About, full editorial rebuild

### Added

- `/about` now uses the real, previously-approved portrait
  (`CURRENT_PORTRAIT.about`, the same crop the homepage's About Preview
  has used since Sprint 17) in place of the "no photo yet" emblem
  placeholder it had been showing for four sprints. The opening is
  rebuilt around it as a fuller version of that same homepage preview's
  proven composition, since `/about` is literally its link destination.

### Changed

- Gold pill credential badges (Khateeb / Author / Islamic Speaker /
  Ruqyah since 2009) and the Research Interests tag badges are gone —
  reinterpreted as mono/archival index text, the idiom already
  established elsewhere on the site (About Preview's margin index,
  Future Courses, Latest Khutbah).
- The dotted/connected Timeline section is removed outright, not
  reskinned — every one of its 8 entries duplicated a fact already
  stated in Education, Academia, Teaching & Speaking, Books, or the
  credential index; it was a second restatement of the same biography,
  not new information.
- Education and Professional background merged into one asymmetric
  spread; Islamic Teaching and Public Speaking merged under one shared
  eyebrow with two mono-labeled sub-blocks — reducing repeated
  eyebrow → heading → paragraph blocks to a handful of varied
  compositions.
- The opening lede replaced with the same factual framing the homepage
  About Preview already uses (trained in Kuwait, academia/consultancy
  career) — the previous "committed to grounded scholarship... clarity
  today's seeker needs" was unsourced positioning language, not present
  anywhere else in the site's approved copy.
- The Books section's description updated to match Sprint 20's
  corrected book excerpt — this page had been quietly carrying the same
  stale placeholder text.

### Notes

Exactly one portrait treatment appears on the page; the brand mark
remains the site's only repeated identity device via header/footer.
Full reasoning: `docs/sprints/SPRINT-21.md`.

---

## v0.20.0 — Sprint 22: Courses, editorial programme index

### Added

- `ProgrammeEntry`/`ProgrammeIndex` (`src/components/catalog/`) — all
  five real courses now render as five numbered editorial entries
  (fixed-width number/level column beside title/excerpt/action,
  hairline dividers), reading the same at five as it would at six or
  seven. No icons, no illustration panels, no repeated "Coming soon"
  pills — a single page-level "Five programmes are currently in
  development" line replaces five repeated ones.

### Fixed

- **Content truth**: the opening copy claimed "a sequenced academy in
  Aqeedah, Fiqh, and Arabic" — only Aqeedah matches any of the five
  real courses. Replaced with the homepage's own already-approved
  Future Courses framing, not invented copy. `Course` has no
  `category` field in its schema; the entry composition omits category
  entirely rather than inventing one. The Beginner/Intermediate level
  labels' provenance is undocumented but non-uniform across the five
  courses, classified "Supported, not Verified" and kept as quiet
  metadata on that basis.
- A stray, self-referencing symlink accidentally left in the
  gitignored `src/generated/prisma/` directory (debris from an earlier
  session's `git worktree` verification step) was crashing Turbopack's
  CSS build pipeline on a cold start, silently preventing new utility
  classes from compiling. Removed.
- **Content truth, opening correction**: the page's own eyebrow, "The
  academy," silently dropped the honesty qualifier from the homepage's
  real, approved eyebrow ("The academy — coming soon"), implying an
  operating academy already exists. The heading, "Structured study, in
  depth," was a near-paraphrase of the homepage's real heading, not
  itself approved copy. Both replaced — see Changed, below.

### Changed

- `/courses`: replaced the 4-column `CourseCard`/`CourseIllustration`/
  `COURSE_ICONS` grid treatment with `ProgrammeIndex`; opening
  compressed with the same asymmetric section padding used for Books'
  proportion correction; the page-end newsletter CTA block removed
  (every entry already links to `/newsletter` via its own "Notify me
  at launch," making a sixth mention pure repetition) — the page now
  concludes after entry 05 and flows into the footer.
- Opening copy corrected to eyebrow "Courses," heading "Five
  programmes in development" (states what/how-many/status in one
  factual line, no invented claims), the same already-approved
  supporting line. A new page-level "catalogue register" — a mono
  "Programmes ⋯ 01–05" row with a hairline rule, reusing Books'
  own archival-label idiom — now marks the visual break between the
  introduction and where the entries begin, which the two previously
  ran together without.

### Notes

`CourseCard`/`CourseIllustration`/`COURSE_ICONS` are now fully
unreferenced anywhere in `src/` (the homepage moved off `CourseCard`
in Sprint 19) but were left in place, not deleted — flagged as a safe
future cleanup, not part of this sprint's scope. Full reasoning:
`docs/sprints/SPRINT-22.md`.

---

## v0.21.0 — Sprint 23: Header lockup, homepage transitions, footer composition

### Fixed

- `Logo`: the emblem/wordmark relationship was mathematically centered
  but optically misaligned — the droplet mark's visual weight sits low
  in its own box while the descender-free wordmark's ink sits high in
  its line-box. Mark resized `h-9`→`h-8`, gap tightened to `gap-2.5` at
  `sm:`, and the mark given a `-translate-y-0.5` (-2px) correction,
  tuned live in-browser rather than applied blind. No SVG geometry
  touched; fix applies identically in both the header (`tone="default"`)
  and footer (`tone="inverted"`) contexts.
- `TeachingAreasSection`: the combined gap after `AboutPreviewSection`
  (256px at desktop) read as excessive rather than deliberate. Reduced
  the section's own top padding only (`pt-16 sm:pt-20`, a ~25%
  reduction) — `AboutPreviewSection` untouched.
- `CtaSection` (Ask Ahmad): the combined gap after `FutureCoursesSection`
  (192px before its own divider) made the divider read as floating
  rather than as the section's opener. Reduced the section's own top
  padding (`pt-12`, flat across breakpoints) — `FutureCoursesSection`
  and Ask Ahmad's own centred composition/copy are unchanged.

### Changed

- `SiteFooter`: opening row restructured from a split logo-left/
  tagline-right layout into two zones at `lg` (1024px)+ — brand lockup
  with the tagline stacked directly beneath it on the left (~38%),
  Explore/Connect balanced on the right (~52%), closing the large
  unused field on wide desktop and giving the tagline a visible home
  next to the mark it belongs to. Below `lg`, both zones stack in one
  column in source order, matching the mobile layout's already-good
  behavior. Mission wording, `hasConfirmedProfile()` gating, legal
  row, and language selector are unchanged.

### Notes

Exactly four component files touched, no content/copy/colour/font/nav
change anywhere. Three stale footer descriptions were reconciled: two
in `docs/UX_ARCHITECTURE.md` (a pre-Sprint-16 newsletter-column
wireframe and a pre-Sprint-14 four-column-accordion mobile plan), and
one in `docs/DESIGN_SYSTEM.md` Section 9 (still specified "mission
statement above a four-column grid," predating even the Sprint 14
mission-line change this footer already had before this sprint). All
three now describe the two-zone layout as it actually ships. Full
reasoning: `docs/sprints/SPRINT-23.md`.
