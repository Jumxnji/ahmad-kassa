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
- **Question ≠ its message text (Sprint 7).** `Question` is the case
  file (reference number, category, status, priority, who it's from);
  the actual exchange lives in `Conversation` → `Message[]`, a genuine
  1-to-many from day one even though V1 only ever creates a single
  USER message. `Question.initialMessage` duplicates that first
  message's text purely so list views and search don't need a join for
  the common case — the canonical, growable record is always the
  Conversation. Admin replies, visitor replies, and a threaded history
  are all "add a Message row," never a migration. Never inline a
  question's answer back onto the `Question` row (the old `answer`/
  `answeredAt` columns were removed this sprint for exactly this
  reason) — an answer is an ADMIN `Message`.
- **`InternalNote` is a separate table from `Message`, not a third
  `senderType`.** Internal notes must never be able to leak into a
  future customer-facing conversation view by a filtering bug — putting
  them in a genuinely different table makes that structurally
  impossible rather than policy-enforced.
- **Reference numbers (`AMK-2026-000023`) use a generic
  `ReferenceCounter` table** (`key` → `value`, atomically incremented
  via Postgres `ON CONFLICT DO UPDATE SET value = value + 1`), keyed
  `"question-2026"` today. Any future entity needing sequential
  human-facing numbers (contact enquiries, bookings, invoices) reuses
  this counter with a different key prefix rather than inventing a new
  mechanism — see `src/services/reference-number.service.ts`.
- **Read-tracking (`readAt`) is deliberately separate from workflow
  `status`.** "Has staff looked at this" and "where this stands in the
  process" are different questions — conflating them (e.g. treating
  `status=NEW` as "unread") would break the moment a question needs to
  go back to New after being reopened. Both `Question.readAt` and
  `Message.readAt` follow this same pattern.
- **Notifications are two unrelated things, not one feature.** The
  dashboard bell (staff-facing, "you have new questions") is a live
  computed count from existing tables — no stored notifications, see
  `src/services/notification.service.ts`. `UserNotification` (visitor-
  facing, "your question was answered") is a real but currently-unused
  table, populated honestly (`emailSent` flips true right after the
  confirmation email send actually succeeds) so it's trustworthy data
  whenever a future portal starts reading it, not a stub someone has to
  remember to wire up correctly later.
- **Email templates are hand-written HTML strings, not a React Email
  dependency.** All styling is inlined (not a `<style>` block — Outlook
  desktop strips/mishandles those), and no web fonts are loaded (email
  clients don't reliably fetch them); `src/lib/email/layout.ts`'s
  `DISPLAY_FONT`/`BODY_FONT` stacks are the closest email-safe
  approximation of Newsreader/Manrope. Every template shares one layout
  function, so a future template (newsletter, course receipt) is a new
  content function, not new chrome.
- **The admin notification recipient is read from
  `SiteSettings.contactEmail` server-side**, not the `CONTACT_EMAIL`
  constant that's also shown on the public site — see
  `emailService.getAdminRecipient()`. Decouples "address shown
  publicly" from "address internal alerts actually go to," which is
  also how the brief's "never expose the admin email publicly"
  requirement got satisfied (the public Contact page's old `mailto:`
  icon was removed this sprint for the same reason).
- **Spam protection layers**: a honeypot field (name `company`,
  off-screen via CSS positioning rather than `display:none`, which some
  bots specifically check for and skip) that silently "succeeds"
  without processing if filled in; per-IP rate limiting reusing the
  existing `checkRateLimit` from Sprint 5
  (`src/lib/spam-protection.ts`'s `checkFormRateLimit`, keyed per form
  name so a flood on Ask Ahmad can't lock out Contact); and
  duplicate-submission prevention (same email + same message text
  within 2 minutes returns the original record instead of creating a
  second one — handles double-clicks and flaky-network retries, not
  just bots).

- **Newsletter subscribers require confirmed opt-in (Sprint 8) — never
  add an address to a sendable audience on submit alone.** Signup
  creates a `PENDING` row; only clicking the emailed confirmation link
  flips it to `ACTIVE`. A campaign send's audience query filters on
  `status: "ACTIVE"` and nothing else — see
  `newsletterRepository.findActiveForCampaign()` and the pure
  `canReceiveCampaign()` predicate in `src/schemas/newsletter.schema.ts`
  (kept outside any `"server-only"`-guarded file specifically so it's
  unit-testable). `SUPPRESSED`/`BOUNCED`/`COMPLAINED` can never be
  reactivated by a public resubmit or an admin "resubscribe" click —
  only `UNSUBSCRIBED` is eligible for that.
- **Unsubscribe tokens are computed, not stored (Sprint 8).**
  `unsubscribeToken(subscriberId) = HMAC-SHA256(subscriberId)`, keyed
  by `NEWSLETTER_TOKEN_SECRET` — recomputed and compared
  (`timingSafeEqual`) on every click, nothing persisted. This was a
  correction mid-sprint from an initial random-token-plus-stored-hash
  design (mirroring confirmation tokens), which turned out to be wrong
  for this use case: a raw token generated once at signup and then
  discarded (per "never store raw tokens") can never be reconstructed
  for a *later* email (the welcome email, any campaign). Confirmation
  tokens correctly keep the random+hashed+expiring pattern, since they
  must become invalid after one use — a property the derived scheme
  can't give without also persisting a "consumed" flag. See
  `src/lib/newsletter-token.ts` and `docs/sprints/SPRINT-08.md`.
- **Campaign sends are per-recipient concurrent calls through the
  existing `emailService.send()`, not `resend.batch.send()` (Sprint
  8).** The batch endpoint was reviewed and rejected: its
  permissive-validation partial-failure reporting doesn't reliably
  correlate back to *which* recipient failed once any entries are
  skipped, which this sprint's per-recipient `CampaignRecipient`
  status tracking needs. `Promise.all` chunks of 20 give a clean 1:1
  result mapping and reuse the already-tested retry logic instead.
- **Campaign-send idempotency is two independent DB-level guards, not
  a client-side disable.** `campaignService.beginSending()` is a
  conditional `UPDATE ... WHERE status IN (DRAFT, READY)` — only one
  concurrent trigger can ever win. `CampaignRecipient` rows carry a
  unique `(campaignId, subscriberId)` constraint, so even a crash-and-
  retry of the send loop can't double-send. See `sendCampaignAction`
  in `src/actions/admin/campaign.actions.ts`.
- **`campaigns` is its own permission resource (Sprint 8), mirroring
  the `ownership` resource's precedent** — a dedicated resource for one
  especially sensitive capability (`send`), separate from `newsletter`
  (subscriber management, unchanged this sprint). Editor can create/
  update/delete a draft and send test emails (gated on `campaigns:update`)
  but not `campaigns:send`. Follow this same pattern — a new resource,
  not a bespoke check — for any future capability that needs a
  narrower permission than an existing resource's `update` already
  grants.
- **The Resend delivery webhook (`/api/webhooks/resend`, Sprint 8)
  verifies signatures by hand** (Svix-compatible HMAC, see
  `src/lib/webhook-signature.ts`) rather than adding the `svix`
  package — consistent with the `toCsv()` precedent of a small
  hand-written utility over a dependency for something this size.
  Bounce/complaint processing needs no processed-event-id table: the
  writes it performs (suppress a subscriber, mark a recipient failed)
  are naturally idempotent end states.

- **`SITE_URL` is environment-aware (Sprint 9), and every discovery
  surface reads through it.** `src/constants/site.ts`'s `SITE_URL`
  prefers `NEXT_PUBLIC_SITE_URL`, falling back to the hardcoded real
  domain — the same pattern Sprint 8's `newsletter-urls.ts` already
  established. `buildMetadata()`, `sitemap.ts`, `robots.ts`, and every
  dynamic OG image route all resolve through `siteConfig.url`, so this
  one env var fixes canonical/OG/sitemap/robots consistently across
  local dev, preview deployments, and a not-yet-connected production
  domain — never hardcode a URL in a new discovery-related file.
- **CMS-backed metadata prefers the editor-set `Seo` row, with a
  hardcoded fallback (Sprint 9).** Homepage and About's
  `generateMetadata()` read `homepageService.get()`/`aboutService.get()`'s
  `seo.metaTitle`/`seo.metaDescription`, falling back to a constant
  only when unset — mirroring the pattern Books already had. The
  site-wide default `Seo` row (`/admin/seo`) is deliberately **not**
  wired as a further fallback into the root layout: every page already
  sets its own explicit metadata, so the site-wide defaults would
  never actually be visible, and converting the root layout to
  `generateMetadata()` for an invisible fallback would add a DB call
  to every single request (admin included). Only that form's
  `noindex` toggle is consumed (via `robots.ts`).
- **`<SeoFields>` is the one place meta-title/description length
  guidance and the per-item noindex toggle live (Sprint 9).**
  `src/dashboard/components/seo-fields.tsx` is a generic
  `<T extends FieldValues>` component reused by the Book/Homepage/
  About editors, all of which nest their Seo object under the same
  `seo.*` field path. The site-wide SEO form has a different,
  root-level shape (no `seo.` prefix) plus OG/Twitter fields the
  shared component doesn't cover — it reuses just the exported
  `CharCount`/length constants rather than the whole component. Any
  future content type with an editable `Seo` relation should render
  `<SeoFields control={form.control} />`, not duplicate the fields
  again.
- **Dynamic OG images need `useRouteOgImage: true` to actually take
  effect (Sprint 9).** Next only auto-detects a co-located
  `opengraph-image.tsx` when the page's metadata doesn't already set
  `openGraph.images` — and `buildMetadata()` always sets one (the
  static default) unless told not to. `useRouteOgImage: true` omits
  the image key so the file convention wins; pass an explicit
  `ogImage` alongside it when a real per-item image should still take
  priority over the generated card (see `books/[slug]/page.tsx`). See
  `docs/SEO.md` for the full pattern and how to add a new route.
- **Structured data `sameAs` only includes confirmed social profile
  URLs (Sprint 9).** `siteConfig.socialLinks` still contains generic
  placeholder domains (`https://youtube.com`, not a real channel URL)
  — `confirmedSocialUrls()` in `src/lib/seo.ts` filters these out
  before they reach `buildPersonJsonLd()`/`buildOrganizationJsonLd()`,
  since presenting an unconfirmed URL as a "confirmed profile" in
  structured data is exactly what the client's brief warned against.
  `sameAs` is correctly absent from both schemas until real profile
  URLs are set — no code change needed once they are, just update
  `SOCIAL_LINKS`.
- **Analytics is a typed abstraction over `@vercel/analytics`, not
  scattered provider calls (Sprint 9).** `trackEvent()`
  (`src/lib/analytics.ts`) is the only way any component fires an
  event; the fixed `AnalyticsEvent` union is the single source of
  truth for what's tracked. `<TrackedLink>`/`<TrackEventOnMount>`
  exist specifically for the two cases a direct call site can't cover
  (a click that also needs to navigate; an outcome a Server Component
  already decided). Vercel Web Analytics was chosen over GA4/Meta
  Pixel as the *live* default specifically because it's cookieless —
  the existing `SiteSettings.analyticsIds` (GA4/Meta Pixel) capture
  stays intentionally unwired until a consent banner exists, since
  either would need one. Never call `@vercel/analytics`'s `track()`
  directly from a component — always go through `trackEvent()`.
- **A Client Component can't receive a Lucide icon component as a
  prop (Sprint 9, real regression caught and fixed).** `CourseCard` is
  a Server Component specifically because `(site)/courses/page.tsx`
  passes it a `LucideIcon` reference — converting it to `"use client"`
  (attempted mid-Sprint-9, for click tracking) broke that
  serialization boundary immediately. The fix was a small client
  island (`CourseInterestLink`) receiving only a string prop, with
  `CourseCard` staying server-rendered. Any future component that
  receives an icon/function prop from a Server Component must extract
  only the interactive *leaf* into a client island, not convert the
  whole component.
- **Real privilege-escalation bug found and fixed (Sprint 10):**
  `resetUserPasswordAction` (`src/actions/admin/user.actions.ts`) was
  missing the Owner guard its siblings `updateUserAction`/
  `deleteUserAction` already had — an Administrator (who holds
  `users:update`) could reset the Owner's password and receive the
  plaintext temporary password in the action result, a full
  account-takeover path. Fixed by adding the same
  `requirePermission("ownership", "update")` check when the target's
  `role === "OWNER"`. **Any new action that mutates a `User` row must
  be checked against this same pattern** — `users:update`/
  `users:delete` alone are not sufficient when the target could be the
  Owner; always add the ownership check too, mirroring
  `updateUserAction`.
- **Admin list/detail pages needing a status-label or status-tone map
  should live in a shared `src/dashboard/<feature>-constants.ts` file
  (Sprint 10), not be redefined per page.** `newsletter-constants.ts`
  was the first instance of this pattern (Sprint 8); Sprint 10 found
  the same map duplicated verbatim across `books/page.tsx`,
  `ask-ahmad/page.tsx`, `ask-ahmad/[id]/page.tsx`,
  `contact/page.tsx`, and `contact-detail-sheet.tsx`, and
  consolidated them into `books-constants.ts`/`ask-ahmad-constants.ts`/
  `contact-constants.ts`. Any new resource with an enum-backed status
  shown via `StatusBadge` in more than one place should get its own
  constants file from the start.
- **The admin dashboard intentionally does not hide or disable
  mutating controls (New/Save/Archive/Delete buttons, editable form
  fields) for read-only roles (Sprint 10 finding, not changed).**
  A `VIEWER` can open `/admin/books/new` or a question's detail page
  and interact with every field/button exactly like an Editor; the
  action is only actually blocked when the underlying Server Action's
  `requirePermission()` call rejects it server-side (confirmed live —
  Viewer gets a "You don't have permission to do that" toast and
  nothing persists). This is a real UX rough edge (worth a future
  "read-only mode" pass disabling controls per-role) but not a
  security gap, since the server-side check is the actual boundary in
  every case audited. Documented here rather than fixed this sprint,
  since disabling controls per-role across every admin form is a
  cross-cutting UI change larger than this QA sprint's fix-only scope
  — see `docs/sprints/SPRINT-10.md`.

## Design decisions

- Public site used the design system established in Sprint 1 ("Prompt
  #1") — navy/gold/paper palette, `font-display` for headings, the
  manuscript-divider motif — as an unchanged baseline through Sprint
  10. **Sprint 11 (Homepage Redesign & Brand Identity Integration)**
  deliberately broke that "never redesign" constraint, at the
  client's explicit direction, once a new professionally-commissioned
  logo emblem made the Sprint 1 homepage layout obsolete. **Sprint 12
  (Creative Direction & Design System)** then formalised the result as
  permanent governance: `docs/CREATIVE_DIRECTION.md` (the WHY — voice,
  audience, palette philosophy, motion philosophy) and
  `docs/DESIGN_SYSTEM.md` (the HOW — the single implementation source
  of truth, superseding this bullet). **Read those two documents, not
  this one, for current visual-direction rules** — this file only
  records that the change happened and why. The navy/gold/paper
  palette itself did not change in Sprint 11; what changed was the
  section composition, motion language, and the mark's role as a
  recurring design element (see below).
- The brand system (Sprint 2) was built **around** a supplied logo —
  the logo itself was never redesigned, only packaged (favicons, OG
  images, manifest, brand.ts tokens). **That Sprint 2 mark (a
  font-glyph-derived Arabic calligraphy outline) was superseded in
  Sprint 11** by a new mark commissioned directly from the client's
  designer (a calligraphic "Ahmad" set inside a teardrop/flame
  emblem), delivered as `brand-source/AHMAD-06.svg` and exported as
  `public/brand/logo-mark.svg` (+ white/dark colourway variants) at
  the same file paths, so every existing consumer picked up the new
  mark with no consumer-side changes. As with Sprint 2, **the new mark
  is frozen and not redrawn or reinterpreted by this project** — see
  `public/brand/README.md`'s asset manifest and
  `docs/CREATIVE_DIRECTION.md`'s "the professional emblem is not an
  illustration" framing. The prior mark's files (`logo-mark*.svg`) were
  overwritten in place with the new mark's path data, not kept
  side-by-side.
- **Sprint 11 also redesigned the homepage** (`src/app/(site)/page.tsx`)
  around the new mark. Current real section order: Hero →
  FeaturedBookSection → AboutPreviewSection → TeachingAreasSection →
  QuoteSection → LatestKhutbahSection → FutureCoursesSection →
  CtaSection → NewsletterSection. `FeaturedArticlesSection` was removed
  from the homepage itself (the `/articles` page and its nav link are
  untouched — Articles just isn't promoted on the homepage anymore).
  The hero uses a **Mode A/B switch**
  (`HERO_VISUAL: "emblem" | "portrait"` in
  `src/components/sections/hero.tsx`) — Mode A (the emblem as the
  hero's visual anchor, `hero-emblem.tsx`) is live today; Mode B
  (`hero-portrait.tsx`, a professional photograph in the same
  composition slot) is built but unwired, ready for a one-line
  constant swap once a portrait exists. Per
  `docs/CREATIVE_DIRECTION.md`, the emblem should remain part of the
  hero composition even after Mode B ships, not be fully replaced by
  the photo.
- **Sprint 14 (Editorial Refinement 1 & 2) refined — did not replace —
  Sprint 11's homepage.** ER1 was a critique-only audit
  (`docs/HOMEPAGE_EDITORIAL_AUDIT.md`); ER2 implemented that audit's
  highest-confidence findings only. Durable decisions from this pass:
  the header/footer `Logo` component always renders the full name
  (`siteConfig.name`), never the shortened form, matching the
  client's standing policy — the mark and wordmark are composed live
  (the digital-lockup approach `public/brand/README.md` already
  documented, now actually applied to the header, not just email).
  The hero's `lg:grid-cols-[2fr_3fr]` asymmetric ratio and its
  single-line "Ahmad Mohamed *Kassa*" headline treatment (surname
  only in italic gold, not the full "Mohamed Kassa") are the current
  baseline — any future hero work should treat *this* as the starting
  point, not the original Sprint 11 near-even split. Teaching Areas
  (`TeachingAreaRow`) and the "no photo yet" placeholder convention
  (`PortraitFrame`, now emblem-based, shared by About and the dormant
  Hero Mode B slot) are both now-established patterns — reuse them
  rather than reintroducing a card/icon grid or a generic initials
  monogram elsewhere on the site. Full reasoning and what's still
  open: `docs/sprints/SPRINT-14.md`.
- **Sprint 15 (Editorial Refinement 3) rebuilt About and Featured Book
  only** — header, hero, Teaching Areas, and footer were explicitly
  out of scope. About Preview is now text-dominant: a narrow sticky
  `PortraitFrame` column (`lg:grid-cols-[0.55fr_1.45fr]`) beside a wide
  text column with an unquoted editorial lede statement above the full
  biography and a four-line marginal index — this replaced Sprint 14's
  flowing single-line credential sentence, which itself replaced
  Sprint 11's bulleted list. **Convention going forward: never
  quotation-mark editorial copy in About unless it is a genuine direct
  quote supplied by the client** — the lede is deliberately unquoted
  for this reason, and any future editorial "pull quote" moment must
  hold to the same rule. Featured Book's cover column and cap were
  both widened (`lg:grid-cols-[minmax(0,0.62fr)_1fr]`,
  `lg:max-w-md`) so the cover is the largest single visual element on
  the homepage; a conditionally-rendered publication caption
  (`book.category`/`publicationDate` year, only real schema fields,
  never fabricated) and a plain "By {authorName}" line were added.
  **Convention going forward: the Featured Book section does not
  carry the brand emblem** — a deliberate, repeated decision (also
  true of Sprint 14) reasoning that a second mark would compete with
  the cover, which is the section's own visual anchor. Full reasoning
  and what's still open: `docs/sprints/SPRINT-15.md`.
- **Sprint 16 (Editorial Refinement 4) was a full-page creative-director
  polish pass, not a redesign** — the ER1–ER3 architecture (section order,
  About/Featured Book composition, hero, Teaching Areas, footer structure)
  was treated as the stable baseline and left alone; only small, low-risk
  refinements shipped. **Conventions going forward:** (1) gold (`variant
  ="gold"`) is reserved for a page's own genuine primary CTA — persistent
  chrome (the header nav) should not use it, since it competes with
  whatever section-level gold CTA is also on screen; the header's
  "Newsletter" nav button is now `variant="outline"` for this reason. (2)
  Logo/mark hover anywhere on the site is opacity-only, never a scale
  transform — the header/footer `Logo`'s `group-hover:scale-105` was
  removed in this pass as the last remaining instance of this rule not
  being followed. (3) Marginal/archival index-style content (About's
  credential list is the current example) uses the site's mono/tracked
  `text-eyebrow`-family treatment, not plain small body text, to read as
  editorial notation. (4) The homepage's newsletter CTA should appear at
  most twice in one scroll — the dedicated `NewsletterSection` plus one
  link elsewhere (footer's "Connect" column) — a third inline form (the
  footer previously had its own) reads as insistent, not restrained; the
  footer's own form was removed for this reason. Full reasoning, what was
  considered and rejected, and remaining gaps: `docs/sprints/SPRINT-16.md`.
- **Sprint 17 (Editorial Refinement 5) activated Hero Mode B and replaced
  About's emblem placeholder with the first approved professional
  photograph of Ahmad Mohamed Kassa.** The Mode A/B architecture built in
  Sprint 11 needed zero layout changes to do this — `HERO_VISUAL` in
  `hero.tsx` is now `"portrait"`, and `HeroEmblem` (Mode A) stays in the
  codebase as the "no photo yet" fallback, not deleted. **Durable
  conventions:** the canonical current portrait — source file and every
  derived crop — lives in exactly one place, `src/config/portrait.ts`'s
  `CURRENT_PORTRAIT` constant; swapping in a future approved photograph is
  editing that one file, not touching `Hero`/`AboutPreviewSection`/
  `PortraitFrame`. The untouched original is preserved outside `public/`
  at `portrait-source/`, mirroring the `brand-source/` convention for
  exactly the same reason (a delivered master has no reason to be publicly
  servable at full resolution). `PortraitFrame` itself now branches on
  whether a `src` prop is supplied — real photograph if so, the original
  emblem placeholder if not — so any future call site without a photo yet
  automatically gets the same "no photo yet" convention, not a new one.
  **The portrait is deliberately used in exactly two places (Hero, About)
  and nowhere else** — footer, header, loading screen, book sections,
  Newsletter, and the Ask Ahmad CTA all continue using the mark, which
  remains the site's *repeated* identity device; keep it that way rather
  than adding the photo to new surfaces "since it's now available." Full
  reasoning: `docs/sprints/SPRINT-17.md`, `docs/BRAND_USAGE.md`'s "The
  Portrait" section.
- **Sprint 18 (Real Khutbah Integration) replaced the Latest Khutbah
  section's placeholder with two real, verified khutbahs, and formally
  froze the homepage design.** `src/lib/data/lectures.ts`'s `Lecture` type
  already had everything needed (`youtubeId`, `publishedAt`,
  `durationMinutes`, `coverImageUrl`) — no CMS/database model or new field
  was introduced; the fictional "Weight of Gratitude" entry was replaced,
  not kept alongside real content. **Durable conventions:** (1)
  `LatestKhutbahSection` selects by genuine `publishedAt` recency, never
  array/URL order — the newest published khutbah is always primary. (2)
  `VideoThumbnail` renders a real image when given `thumbnailUrl`, the
  original placeholder facade when not — extend this one component for
  any future real-media need rather than building a parallel thumbnail
  system. (3) YouTube thumbnails are hotlinked from `i.ytimg.com` (now
  allow-listed in `next.config.ts`), never downloaded into the repo —
  unlike Ahmad's own commissioned portrait, a third party's video
  thumbnail isn't an asset this project owns a source copy of. (4) Coming
  soon lecture placeholders (`status: "coming-soon"`, no `youtubeId`) are
  legitimate — they represent real planned future talks, not fake content
  — but must never be presented as if a recording exists once real
  content is available for that slot. **The homepage is now formally
  `DESIGN FROZEN — CONTENT-DRIVEN CHANGES ONLY`** (see `docs/ROADMAP.md`
  for what that does and doesn't permit going forward). Full reasoning:
  `docs/sprints/SPRINT-18.md`.
- **Sprint 20 rebuilt `/books`'s index around a "numbered publication
  entry" (`src/components/catalog/publication-entry.tsx`) instead of the
  multi-item book-card grid** — for a genuinely short catalogue, a
  vertical list of full-width editorial spreads (archival "0X /
  {status}" label, dominant fixed-width cover, narrow text column) reads
  as intentional at any item count, where a grid built for many items
  reads as sparse with few. `BookCard`/`BooksGrid` were left untouched —
  Book Detail's "Related" section is a genuine multi-item grid, where a
  card treatment is still the correct choice; the two patterns coexist
  by design (see `docs/DESIGN_SYSTEM.md` Section 8 for when to use
  which). The same sprint also found and fixed a real content-truth bug
  discovered mid-investigation: "The Great Debate"'s `excerpt`/
  `description` described a different book than its real, later-uploaded
  cover — corrected via a guarded `prisma/seed.ts` backfill (same
  pattern as the pre-existing Amazon-URL backfill) using only the book's
  own verbatim cover text, which also silently fixed the same wrong copy
  on the frozen homepage's Featured Book section (a content correction,
  not a design change — see the "Content truth" convention above).
  **Corrected in the same sprint, post-review:** the first pass's
  proportions were wrong — opening whitespace too generous, cover
  grown poster-sized, text column stranded. Fixed by splitting the
  `Section`'s padding asymmetrically (tight `pt`, the same generous
  `pb` that already solved the footer transition) instead of one
  blanket `size` token, and rebalancing cover/text sizing — the
  underlying architecture didn't change. Full reasoning: `docs/sprints/
  SPRINT-20.md`.
- **Sprint 21 replaced `/about`'s emblem placeholder with the real
  portrait, three sprints after that portrait had already been live on
  the homepage.** `/about` had been calling `PortraitFrame` with no
  `src` this whole time — a real gap, not a deliberate choice. Fixed by
  passing `CURRENT_PORTRAIT.about` (the same crop the homepage About
  Preview already uses) and rebuilding the opening as a fuller version
  of that same preview's own composition, since `/about` is that
  preview's own link destination. **Durable convention:** when a
  homepage preview section already establishes an approved composition
  for the full page it links to, extend that same composition on the
  full page rather than inventing a new one for the same subject —
  applied here, and worth checking before any future "read more" /
  detail-page composition decision. Gold credential-pill badges and the
  Research Interests tag badges were replaced with the site's existing
  mono/archival index idiom (not a new pattern). The dotted/connected
  Timeline section was first rebuilt as a hairline-divided era-list,
  then removed outright in review once every one of its 8 entries
  turned out to duplicate a fact already stated in Education, Academia,
  Teaching & Speaking, Books, or the credential index — a second
  restatement of the same biography, not new information. **Durable
  convention:** a standalone chronological/"journey" section is
  avoided site-wide, not because of the dots-and-connectors styling
  specifically, but because it tends to restate facts that belong
  inside the section they're actually relevant to (see
  `docs/DESIGN_SYSTEM.md` Section 8). Full reasoning: `docs/sprints/
  SPRINT-21.md`.
- **Sprint 22 replaced `/courses`'s icon-card grid with a numbered
  editorial index** (`ProgrammeEntry`/`ProgrammeIndex`,
  `src/components/catalog/`) — the same "numbered index, not a grid"
  family as Books' `PublicationEntry`/`PublicationIndex`, its own
  dedicated component rather than a reuse of the homepage's
  `FutureCourseCard` or the now-fully-unreferenced `CourseCard`.
  **Durable convention:** when a content type has no real `category`
  field (or any other schema gap a design brief assumes exists),
  omit that metadata rather than inventing a taxonomy that isn't in
  the data model — `Course` has no `category`, so `/courses`'s entries
  show level only, not a fabricated category label.
  **Correction, after client review:** the opening ("The academy" /
  "Structured study, in depth") had silently dropped the honesty
  qualifier from the homepage's real eyebrow ("The academy — coming
  soon") and paraphrased its heading rather than reusing approved
  copy — a reminder that reusing *part* of an approved sentence isn't
  the same as reusing the approved copy; the qualifying half matters
  as much as the polished half. Corrected to "Courses" / "Five
  programmes in development." A page-level "catalogue register" (a
  mono `label ⋯ 01–0N` row + hairline rule, between an index page's
  intro and its first entry) is a new, genuinely reusable pattern —
  see `docs/DESIGN_SYSTEM.md`. Full reasoning: `docs/sprints/
  SPRINT-22.md`.
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
- Admin replies / two-way conversation (Sprint 7's Reply panel is
  visibly present but disabled — the schema is ready, the Server
  Action and UI-enable is not built)
- Visitor replies, a customer portal (account, view submitted
  questions/replies, upload/download attachments, book consultations),
  and email-reply synchronisation — all explicitly named as future
  scope in the Sprint 7 brief; the schema supports every one without a
  redesign, none of the UI/inbound-email plumbing exists
- Message attachments (the `Message.attachments` Json column exists,
  nothing writes to it yet)
- Question assignment (`Question.assignedToId`/`assignedTo` exist in
  the schema; no UI control to set it yet)
- Consultation booking, student messaging, message search-across-
  everything, and conversation analytics (all named as future
  preparation in the Sprint 7 brief, none modelled beyond what the
  Conversation/Message shape already naturally supports)
- Newsletter cron-based scheduling (`features.newsletterScheduling`) —
  `Campaign.scheduledFor` and a disabled "Schedule for later" control
  exist; needs a real deployment target to wire up Vercel Cron
  against, see `docs/DEPLOYMENT.md`
- Newsletter CSV import (`features.newsletterImports`) — no legitimate
  consented list exists to import yet; architecture documented in
  `docs/sprints/SPRINT-08.md`
- Granular newsletter email preferences and audience segmentation
  (`features.newsletterPreferences`/`newsletterSegmentation`) — V1 is
  a single subscribed/unsubscribed state sent to "all active"
- Newsletter open/click analytics (`features.newsletterAnalytics`) —
  left off by default; no engagement numbers shown anywhere
- A tuned Content-Security-Policy header (Sprint 9) — not explicitly
  requested, and real risk of breaking Next dev tooling/Radix/Tailwind
  without careful per-directive tuning; starting-point directive list
  in `docs/PERFORMANCE.md`
- Live GA4/Meta Pixel script injection (Sprint 9) — the admin-captured
  `SiteSettings.analyticsIds` stays inert until a consent banner
  exists, since both are cookie-based tracking
- A full RTL/logical-property conversion (Sprint 9) — ~114 remaining
  physical-utility instances catalogued by file in
  `docs/ACCESSIBILITY.md`; convert incrementally alongside real
  translated content once multilingual work actually starts, not as a
  standalone mechanical pass
- `VideoObject` structured data (Sprint 9) — no real configured
  lecture video exists yet (every `Lecture` in
  `src/lib/data/lectures.ts` is `status: "coming-soon"`); add once one
  does, `VideoCard`'s facade pattern needs no markup changes

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
- **Email sending requires `RESEND_API_KEY` to be set** (`.env`) — it's
  not set in local dev by default, so `emailService.send()` fails
  gracefully (logs, returns `{success:false}`) and both the Ask Ahmad
  and Contact forms still complete normally, since the record is
  already saved before mail is attempted. Set the key to actually test
  email delivery.
- **Dashboard notification bell counts are computed on every request**
  (no caching) — fine at current volume; if the inbox grows into the
  thousands the brief anticipates, revisit with a cheap cached count
  rather than re-querying on every dashboard page load.
- The SEO `noindex` toggle's effect on `/robots.txt` relies on Next
  revalidating a build-time-static route via `revalidatePath` — verified
  working in dev; worth a smoke test after the first production deploy.
- **Newsletter/campaign email sending requires `NEWSLETTER_TOKEN_SECRET`,
  `RESEND_WEBHOOK_SECRET`, and (still, since Sprint 7) `RESEND_API_KEY`
  in production** — none are set in local dev by default. Confirmation/
  welcome/campaign sends fail gracefully without `RESEND_API_KEY`
  (same pattern as Ask Ahmad/Contact), logging a dev-only preview line
  (`[email:dev-preview]`, subject + first link) so the golden path is
  still manually testable locally. Token hashes are unpeppered without
  `NEWSLETTER_TOKEN_SECRET` — fine in dev, logged as an error if
  missing in production.
- **A pre-Sprint-8 subscriber row is grandfathered in as
  already-confirmed** by the migration's backfill, with no usable
  historical unsubscribe link (moot going forward, since unsubscribe
  tokens are now derived from the subscriber id rather than stored —
  see "Major architectural decisions").
- **`SOCIAL_LINKS` (`src/constants/site.ts`) are still generic
  placeholder domains**, not real profile URLs — structured data
  correctly omits `sameAs` until the client supplies real YouTube/
  Instagram/TikTok URLs (Sprint 9). The public footer's social icons
  still render and link to these placeholders, since they aren't
  technically empty — worth revisiting once real URLs exist.
- **The About page's visible content is still 100% hardcoded**
  (Sprint 1) — Sprint 9 only wired its *metadata* to the real `Seo`
  row. Unchanged, still the top `docs/ROADMAP.md` priority.
- A systemic Radix/Tailwind bug was found and fixed project-wide in
  Sprint 3: several shadcn components used bare `data-open:`/
  `data-checked:` selectors where Radix actually emits `data-state="open"`
  /`data-state="checked"`. If a *new* shadcn component is added later,
  check its generated data-attribute selectors against the actual Radix
  primitive's source before trusting them — the shadcn CLI's default
  output for this project's style preset (`radix-nova`) got this wrong
  in multiple components.
- **Deferred (Sprint 20): the footer's vertical proportion should be
  reassessed during the eventual cross-site editorial polish pass.** Its
  apparent oversized feel on `/books` pre-Sprint-20 was, on inspection,
  mostly amplified by the weak/sparse composition immediately above it,
  not the footer's own sizing — so it was deliberately left unchanged in
  Sprint 20. Worth a real look once every secondary page has its own
  intentional composition and the footer's proportion can be judged
  against a page that isn't itself the problem.

## Things discussed with the client

- Asked about switching to Neon DB mid-Sprint-3; clarified they were
  fine continuing with local Postgres via Prisma, since switching later
  is trivial. (See "Major architectural decisions" above.)
- Explicitly corrected the calligraphy mark's Arabic diacritics:
  *"i dont want any dhammahs"* (Sprint 2.5, on the original Sprint 2
  mark) — verify any future Arabic typography work against this
  preference before shipping. The Sprint 11 mark replacement was a
  fresh professional commission, not typeset in-house, so this
  specific correction doesn't apply retroactively to it — but the
  underlying preference should still guide review of any new Arabic
  typography.
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
- Any content model with an editable `Seo` relation: render
  `<SeoFields control={form.control} />`
  (`src/dashboard/components/seo-fields.tsx`) for its admin form, not
  a hand-rolled meta title/description/canonical/keywords/noindex set
  — see `docs/SEO.md`.
- Any new trackable user action: add it to the `AnalyticsEvent` union
  in `src/lib/analytics.ts` and call `trackEvent()` — never call
  `@vercel/analytics` directly from a component. Never include email
  addresses, message/question text, or names as an event property.
- `npm` installs on this machine need
  `--cache <scratchpad>/npm-cache` (or `npm_config_cache` env var)
  because the default `~/.npm` cache is root-owned; new native-binary
  install scripts need `npm approve-scripts <pkg>` before they'll run.
- **`vitest` (Sprint 8) is the project's test framework, scoped to
  pure-logic unit tests only** — `tests/*.test.ts`, run via `npm test`.
  Anything that needs Prisma, Next.js request context, or a running
  server is still verified manually (browser + direct HTTP/DB checks),
  matching every prior sprint's actual verification method. A function
  needs to be testable this way to get a test — if it's genuinely pure
  logic worth covering but currently lives inside a `"server-only"`-
  guarded file, extract it to a plain module first (see
  `src/lib/normalize-email.ts`, `src/schemas/newsletter.schema.ts`'s
  `canReceiveCampaign()`) rather than skipping the test.
- **Content truth: placeholder/draft editorial content must never be
  presented publicly as genuine authored/published material.** A
  content-truth correction found the `/articles` catalog's ten entries
  — fully-written but explicitly commented `"Placeholder editorial
  catalog"`, with a `features.articles` flag that already said "don't
  render this yet" but was never actually checked anywhere — publicly
  live with fabricated `status: "published"` and `publishedAt` dates,
  submitted to the sitemap and emitting real `Article` JSON-LD. Fixed
  by correcting `status` to `"draft"` (the `ContentStatus` type already
  had this value; it just wasn't being used) and filtering every
  getter in `src/lib/data/articles.ts` through `getAllArticles()`,
  which now excludes non-published entries — the single choke point
  every consumer (index, detail route, sitemap, related-reading) reads
  through. Draft content is preserved in the data file, not deleted;
  only its public reachability is gated on `status`. A dynamic route
  whose valid slugs are fully known at build time (backed by static
  data, not a live CMS) should also set `export const dynamicParams =
  false` — without it, `notFound()` still renders correctly but can
  ship as a "soft 404" (real 404 content, HTTP 200 status) because
  Next.js's streaming can flush the response shell before the dynamic
  `notFound()` determination resolves; `dynamicParams = false` resolves
  it at the routing layer instead, before any streaming starts, giving
  a genuine 404 status. Separately, `/contact` was found rendering all
  three `SOCIAL_LINKS` unconditionally instead of filtering through the
  already-correct `hasConfirmedProfile()` gate the footer uses — fixed
  to use the same filter, so an unconfirmed placeholder profile never
  displays on any page, not just the footer.
- **A stray symlink inside `src/generated/prisma/` will crash
  Turbopack's CSS build on a cold start.** Found in Sprint 22: `src/
  generated/prisma/prisma` had somehow become a symlink pointing back
  to its own parent directory (`src/generated/prisma → src/generated/
  prisma`), almost certainly created by accident during an earlier
  session's `git worktree`-based commit verification (a command meant
  to symlink Prisma's generated client *into* a temporary worktree ran
  from the real project directory instead). The whole directory is
  gitignored, so this kind of debris won't show up in `git status` —
  if a fresh `next dev`/`next build` ever panics with `"is a symlink
  causes that causes an infinite loop"`, check `src/generated/prisma/`
  for a self-referencing symlink first, not the Tailwind config.
- **Overriding a `Section`'s `py-*` on just one side needs the same
  responsive prefixes as what it's overriding, or the override silently
  loses at that breakpoint.** Found in Sprint 23: `<Section
  className="pt-12">` looked correct (the class was present in the DOM)
  but `getComputedStyle` showed the original `sm:py-28`'s top value
  still winning at `sm:` and above — `pt-12` (unprefixed) and `sm:py-28`
  are different Tailwind utilities to `tailwind-merge`, so it doesn't
  dedupe them, and the `sm:` media query wins the cascade regardless of
  source order. The fix is always to mirror every breakpoint being
  overridden (`pt-16 sm:pt-20`, not just `pt-16`) — and to verify with
  `getComputedStyle(el).paddingTop` at the actual target width, not by
  trusting that the className string looks right.
- **A lockup that's mathematically centered can still read as visually
  misaligned, and the fix is optical, not arithmetic.** Found in Sprint
  23 auditing the header: `Logo`'s emblem and wordmark were correctly
  centered against each other by `items-center`, but the droplet mark's
  own ink sits low in its box while the descender-free wordmark's ink
  sits high in its line-box, so two "correct" centerings still visually
  disagreed. When a lockup or icon+label pairing looks subtly "off" but
  the alignment CSS is provably centered, check whether either element's
  visual weight is asymmetric within its own box before assuming the
  layout math is wrong — the fix is usually a small manual optical
  offset (a `-translate-y` nudge), tuned by eye/zoom screenshot
  comparison, not a bigger box-model change.

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
- **`featured?: boolean` is this project's convention for "curated
  subset shown on the homepage, full set shown on the dedicated page"**
  — first established on `Article`, reused identically on `Course` in
  Sprint 19. When a homepage teaser needs to show fewer items than its
  full catalog, add this boolean to the content type and filter in the
  homepage section rather than hard-coding array positions/slicing or
  duplicating data — the dedicated page (`/articles`, `/courses`) should
  always call the unfiltered `getAll*()` so nothing is ever hidden, only
  de-prioritised for one promoted slot.
- **A homepage section that needs a different visual treatment than the
  shared page it also appears on gets its own small presentational
  component, not a prop-driven variant of the shared one** —
  `VideoCard`/`KhutbahEntry` (Sprint 18) and `CourseCard`/
  `FutureCourseCard` (Sprint 19) are the two instances of this pattern.
  Keeps the homepage's own editorial refinements from becoming implicit
  regressions on `/articles`, `/courses`, etc.
