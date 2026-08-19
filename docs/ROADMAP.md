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
- **Sprint 7** — A conversation-ready communication system: Question/
  Conversation/Message/InternalNote/UserNotification architecture with
  atomic per-year reference numbers (`AMK-2026-000023`), a real Ask
  Ahmad status workflow + priority, a new question conversation detail
  page (`/admin/ask-ahmad/[id]`) with a timeline and a visibly-disabled
  future reply panel, a dashboard notification bell, branded HTML email
  templates + Resend wired up with retry, and spam protection
  (honeypot, rate limiting, duplicate-submission prevention) on both
  public forms.
- **Sprint 8** — A confirmed-opt-in newsletter subscriber system
  (Pending/Active/Unsubscribed/Suppressed/Bounced/Complained, source
  tracking, deterministic HMAC-derived unsubscribe links) and a real
  admin Campaigns feature: a full `/admin/newsletter` section
  (Overview/Subscribers/Campaigns/Email Templates/Settings), a
  campaign editor with autosave/real preview/rate-limited test sends,
  and a `sendCampaignAction` that actually sends to the active list
  with idempotency guards and per-recipient delivery tracking. A
  Resend delivery-events webhook suppresses bounced/complained
  addresses. Cron-based scheduling, CSV import, granular preferences,
  segmentation, and open/click analytics are all deliberately deferred
  behind feature flags — see `docs/sprints/SPRINT-08.md`. Also added
  the project's first test framework (`vitest`, pure-logic unit tests
  only).
- **Sprint 9** — Launch-readiness pass: environment-aware `SITE_URL`;
  Homepage/About metadata wired to the real `Seo` model (About editor
  gained a "Search & sharing" tab it never had); a shared `<SeoFields>`
  admin fieldset with character-length guidance and a per-item
  noindex toggle; structured data expanded to Article/AboutPage/
  ContactPage/BreadcrumbList and a `sameAs` accuracy fix; dynamic
  branded Open Graph images (home/about/books/articles/courses);
  privacy-conscious analytics (`@vercel/analytics` + a typed
  `trackEvent()` abstraction); several accessibility fixes (live-region
  form errors, `autoComplete`, admin nav landmark labels,
  reduced-motion on 3 more animations); real `dir` attribute plumbing
  plus one demonstrated RTL/logical-property fix (`Button`'s icon
  spacing); two new DB indexes; AVIF/WebP image negotiation; a root
  `global-error.tsx` safety net. New reference docs: `docs/SEO.md`,
  `docs/ACCESSIBILITY.md`, `docs/PERFORMANCE.md`, `docs/ARCHITECTURE.md`.
- **Sprint 10** — QA/release-candidate hardening pass: fixed a real
  privilege-escalation bug (`resetUserPasswordAction` had no Owner
  guard); added a branded admin 404 boundary; fixed a mobile-viewport
  margin gap on the shared destructive-action confirm dialog; deleted
  8 files and 3 exports with zero remaining references; consolidated
  4 admin pages' duplicated status-label/tone constants into shared
  files; added defense-in-depth rate limiting to 3 token-based public
  actions; added dark-mode-safe meta tags to the email layout. Three
  systematic audits (permissions across every Server Action,
  responsive/empty/error-state coverage, dead-code/duplication) came
  back mostly "already correct" — this was a small, precise fix list,
  not a rewrite, consistent with the sprint's explicit QA-not-features
  scope. Full detail in `docs/sprints/SPRINT-10.md`.
- **Sprint 11 — Homepage Redesign & Brand Identity Integration.** The
  client supplied a new, professionally-commissioned logo emblem
  (replacing the Sprint 2 mark) and directed a full homepage rebuild
  around it. Delivered: the new mark integrated at every existing
  brand touchpoint (header, footer, favicons, OG images, email); a
  rebuilt `Hero` with a Mode A/B visual-slot mechanism
  (`HERO_VISUAL: "emblem" | "portrait"` — the emblem live today, a
  professional-portrait mode built and ready for a one-line swap); a
  new `TeachingAreasSection`; the Featured Book section promoted and
  restyled; a reusable `ScrollReveal` scroll-triggered-motion pattern
  for Server Component sections; subtle recurring mark usage (hero
  seal, low-opacity watermark on navy sections, divider glyph); and a
  reordered homepage flow with `FeaturedArticlesSection` removed from
  the homepage (Articles' own page/nav untouched). This was a genuine
  one-time redesign sprint, not the start of a new "redesign whenever"
  norm — see Sprint 12 below for why.
- **Sprint 12 — Creative Direction & Design System.** Documentation-
  and-governance-only (no code): `docs/CREATIVE_DIRECTION.md` (new —
  the WHY: voice, audience, palette/motion philosophy, the emblem's
  role as "not an illustration") and a revised `docs/DESIGN_SYSTEM.md`
  (the HOW — single implementation source of truth, including the
  mark-as-design-language table and the tailwind-merge `bg-` prefix
  gotcha). Establishes the project's permanent split: philosophy in
  `CREATIVE_DIRECTION.md`, implementation detail in `DESIGN_SYSTEM.md`,
  no duplication between them. Read both before any future visual
  work.
- **Sprint 13 — Baseline Recovery & Documentation Reconciliation.**
  Repaired a live brand-asset break (several production files —
  favicons, platform icons, OG/social images, the transactional-email
  logo — had been deleted or gone stale relative to the Sprint 11
  mark) by regenerating every asset from the same frozen mark
  geometry, moved designer source files out of the publicly-servable
  `public/` tree into `brand-source/`, and reconciled this
  documentation set with what Sprints 11–12 actually shipped (this
  file, `PROJECT_MEMORY.md`, `UX_ARCHITECTURE.md`, `BRAND_USAGE.md`,
  `PERFORMANCE.md`, `ACCESSIBILITY.md`, `ARCHITECTURE.md`,
  `DEPLOYMENT.md`, `public/brand/README.md`). No visual redesign, no
  new features — a repair-and-reconcile pass. Full detail in
  `docs/sprints/SPRINT-13.md`.
- **Sprint 14 — Editorial Refinement 1 & 2.** ER1: an in-browser,
  critique-only homepage audit against the creative-direction/design-system
  documents (`docs/HOMEPAGE_EDITORIAL_AUDIT.md`). ER2: implemented the
  audit's Tier 1 findings only — the header/footer digital lockup restored
  to the full name with corrected optical alignment; the hero rebuilt with
  a genuinely asymmetric column split and a unified single-line name
  treatment; Teaching Areas' icon-grid replaced with a numbered editorial
  index; About's placeholder switched from generic initials to the emblem;
  the Featured Book badge and Future Courses' fake module/lesson metadata
  removed; the footer given a standalone mission-statement line and
  confirmed-only social icons; one section promoted to break a flat rhythm
  run. No Tier 2/3 changes, no new pages, no logo redesign. Full detail in
  `docs/sprints/SPRINT-14.md`.

## Immediate priority

1. **Finish wiring the public site to the CMS.** Still open since
   Sprint 6 flagged it: `Hero`, `AboutPreviewSection`, and the public
   `/about` page remain 100% hardcoded from Sprint 1. Same data-wiring
   pass as Books, preserving the exact current markup/design.
2. **Admin replies** — the single highest-value follow-up to Sprint 7.
   The schema (`Message.senderType = ADMIN`), the UI (the Reply panel
   on the question detail page, currently disabled), and the email
   template shell all already exist; this is "enable it," not "build
   it from scratch." Needs: a Server Action to create an ADMIN message
   + flip status, and a "your question was answered" email to the
   visitor (the `UserNotification` row is already there to track it).
3. **Real invite emails**, now that auth exists — wire Resend into the
   invite action so `userService.create()`'s temporary-password dialog
   becomes the fallback path (shown only if sending fails) rather than
   the only path. Sprint 7's `emailService`/template pattern is ready
   to reuse directly for this.
4. **Move rate limiting to a shared store** (e.g. Upstash Redis) before
   any multi-instance/serverless-concurrent deployment — both the auth
   limiter and Sprint 7's form-submission limiter share the same
   in-memory implementation, so this one swap fixes both.
5. **Populate `AuditLog.ipAddress`** once the real hosting target's
   client-IP header is confirmed (e.g. `x-forwarded-for` behind
   Vercel) — currently a schema placeholder only.
6. **In-browser cover/gallery cropping**, if uploading pre-cropped
   images turns out to be a real friction point in practice — deferred
   in Sprint 6, see `docs/PROJECT_MEMORY.md`.
7. **Set `RESEND_API_KEY`, `NEWSLETTER_TOKEN_SECRET`, and
   `RESEND_WEBHOOK_SECRET` in production** before relying on Sprint
   7/8's email sending, token hashing, and delivery-event suppression
   — they fail gracefully without these, but silently (or, for the
   webhook, simply reject every request with 401/500).
8. **Vercel Cron + scheduled campaign sending** — the highest-leverage
   Sprint 8 follow-up now that campaigns can actually send;
   `Campaign.scheduledFor` and the disabled "Schedule for later" UI
   are already in place, see `docs/DEPLOYMENT.md`.
9. **Newsletter CSV import**, once there's a real, consented list to
   bring in — architecture documented in `docs/sprints/SPRINT-08.md`.
10. **A tuned Content-Security-Policy header** — deferred in Sprint 9;
    starting-point directive list in `docs/PERFORMANCE.md`.
11. **A cookie-consent banner, then wire `SiteSettings.analyticsIds`**
    (GA4/Meta Pixel) to actually inject live scripts — currently
    captured but inert, see `docs/sprints/SPRINT-09.md`.
12. **Real social profile URLs from the client** — `SOCIAL_LINKS` in
    `src/constants/site.ts` are still generic placeholder domains, so
    structured data's `sameAs` (correctly) shows nothing yet.
13. Once the real domain is connected: set `NEXT_PUBLIC_SITE_URL`,
    verify in Search Console/Bing (`GOOGLE_SITE_VERIFICATION`/
    `BING_SITE_VERIFICATION`), and spot-check social sharing previews
    against the new dynamic OG images.

## Homepage design status: FROZEN — content-driven changes only

As of Sprint 18 (Real Khutbah Integration), the homepage is formally
**DESIGN FROZEN — CONTENT-DRIVEN CHANGES ONLY**. The client directed five
Editorial Refinement stages in sequence (Sprints 14–17: audit + Tier 1,
About/Featured Book, a full creative-director polish pass, professional
portrait integration) followed by this content-integration sprint, each
confirming the previous stage's decisions rather than reopening them. Full
detail lives in `docs/PROJECT_MEMORY.md`'s Sprint 14–18 entries and each
`docs/sprints/SPRINT-1{4,5,6,7,8}.md`.

**Allowed without further design review:** real content replacement (new
books, courses, articles, khutbahs, portraits using the established
patterns), accessibility fixes, bug fixes, content-driven layout
corrections (e.g. a genuinely long title needing a wrap fix), and
adding real content through existing data/CMS architecture.

**Not allowed without explicit client-directed design review:** a hero
redesign, a new typography system, a new colour palette, arbitrary
section reordering, new decorative motifs, or another "make it more
premium" pass. If real content ever exposes an actual defect (not just an
opportunity to improve), fix that defect locally and document why —
don't use it as licence to reopen the whole section.

**Note on the ER1–ER8 numbering below:** this section predates the
client's own sequential Editorial Refinement briefs and uses a different
internal numbering than what was actually executed (the client's "ER3"
became Sprint 15, their "ER4" Sprint 16, their "ER5" Sprint 17 — none map
one-to-one onto the ER3–ER8 items below). Treat everything below as
historical planning context, already superseded by the Sprint 14–18
record above, not a literal remaining to-do list — see each numbered
item's own "(partially done)"/"(done)" annotation for what's still real.

## Editorial Refinement

**ER1 and ER2 are complete (Sprint 14) — everything below ER2 is still
document-only, nothing executed.** ER1 (the homepage audit) and ER2 (as
actually directed by the client) ran back to back; ER2 turned out to be
broader than this section originally scoped it — rather than "Typography &
Hero" alone, the client's brief bundled the audit's highest-confidence
("Tier 1") findings across the header, hero, Teaching Areas, About, Featured
Book, Future Courses, and the footer into one implementation pass. See
`docs/HOMEPAGE_EDITORIAL_AUDIT.md` (the audit, plus its Implementation
Outcome section) and `docs/sprints/SPRINT-14.md` for what shipped. Because
ER2 already covered pieces of what ER3/ER4/ER5 below originally described
(About's placeholder, Teaching Areas' card treatment, the footer mission
line), **the numbered stages below need re-scoping against what's already
done before any of them starts** — treat the descriptions below as the
original intent, not a literal remaining to-do list. Each future stage still
follows the project's permanent design process
(`docs/CREATIVE_DIRECTION.md`'s closing rule): study the existing
implementation, critique it, propose alternatives with reasoning, get
direction confirmed, *then* implement — never code first. Per the client's
explicit instruction after ER2: do not begin further stages without review.

1. ~~**ER1 — Homepage Design Audit.**~~ Done — `docs/HOMEPAGE_EDITORIAL_AUDIT.md`.
2. ~~**ER2 — Tier 1 implementation.**~~ Done — see above. The original
   "Typography & Hero" scope below is **mostly complete**: the header digital
   lockup now uses the full name with corrected optical alignment; the hero's
   asymmetric composition, unified name typography, and identity copy
   ("Arabic & Islamic Studies" / "Author · Teacher · Khateeb," never
   "Scholar") all shipped. Not yet done from the original ER2 scope: three
   distinct hero *composition* directions were proposed and one recommended
   in the audit, but only the recommended direction (Editorial Split) was
   implemented — the other two remain document-only concepts if a future
   session wants to revisit the choice.
3. **ER3 — Section Hierarchy & About (partially done).** About's placeholder
   now uses the emblem and the credentials read as one line instead of a
   bulleted list (Sprint 14) — the fuller "editorial profile" composition
   (a real pull quote, asymmetric spread, restrained timeline treatment; the
   current `/about` page's 8-step numbered timeline may still be more literal
   than "restrained" calls for, see `docs/UX_ARCHITECTURE.md` Section 10) is
   still open. Don't manufacture facts not already established.
4. **ER4 — Premium Component Language (partially done).** Teaching-area cards
   were replaced with a numbered typographic index and Future Courses'
   fake-precision module/lesson metadata was removed (Sprint 14) — book
   presentation, CTAs, buttons, dividers, and section labels are still
   untouched. Whitespace over borders, hierarchy over decoration, typography
   over icons, restraint over effects — per `docs/CREATIVE_DIRECTION.md`
   Section 11.
5. **ER5 — Footer (partially done).** A standalone mission-statement line
   now sits above the link grid, and social icons only render for confirmed
   profile URLs — currently none, so the row doesn't render at all rather
   than showing placeholder icons (`hasConfirmedProfile()`,
   `src/constants/site.ts`; Sprint 14). Still open: a more considered
   emblem/watermark treatment, and revisiting navigation/contact grouping.
   Don't "enrich" the footer by adding more things — the current layout
   (Section 4 of `docs/UX_ARCHITECTURE.md`, now updated by Sprint 14) is the
   real baseline to critique next, not the original pre-Sprint-11 plan.
6. **ER6 — Brand Language Audit.** Audit every legitimate emblem touchpoint against
   `docs/CREATIVE_DIRECTION.md` Section 6's "never more than two per page" rule:
   hero, watermark, dividers, loading screen, newsletter, footer, book/article
   headers, selected empty states, the 404 page (currently does *not* show the
   mark — see `docs/BRAND_USAGE.md`), and future academy surfaces. Never stamp the
   logo everywhere just because it's now easy to place.
7. **ER7 — Micro-Polish.** Optical alignment, spacing, vertical rhythm, icon
   sizing, button balance, hover states, motion/transition timing, texture
   opacity, responsive/ultra-wide composition, reduced motion. Explicitly not a
   redesign — refinement of what ER1–ER6 approved.
8. **ER8 — Final Creative Director Review.** An in-browser walkthrough against a
   checklist: editorial, not SaaS; warm, not sterile; luxurious, not ostentatious;
   authority from presentation, not titles; emblem recognisable, not overused;
   tasteful in ten years; mobile designed, not collapsed; nothing that looks
   AI-generated; nothing that exists merely to fill space. Anything that fails →
   back to the relevant earlier stage, not a quick patch.

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
- **Newsletter scheduling** (`newsletterScheduling`) — `Campaign
  .scheduledFor` and a disabled "Schedule for later" control exist;
  needs a Vercel Cron job wired up against a real deployment.
- **Newsletter CSV import** (`newsletterImports`) — architecture
  documented in `docs/sprints/SPRINT-08.md`; no legitimate consented
  list exists yet to import.
- **Newsletter email preferences** (`newsletterPreferences`) — a
  granular preference center beyond the current binary subscribed/
  unsubscribed state.
- **Newsletter audience segmentation** (`newsletterSegmentation`) — by
  language, source, subscription date, interest category, etc.; V1
  only ever sends to "all active."
- **Newsletter analytics** (`newsletterAnalytics`) — open/click
  tracking, left off by default for privacy/accuracy reasons.

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
- Never inline a reply/answer directly onto `Question` — it's an ADMIN
  `Message` in its `Conversation`, always. See
  `docs/PROJECT_MEMORY.md`'s Sprint 7 notes for why this was corrected
  away from the old `answer`/`answeredAt` columns.
- Internal/staff-only content on any future model should be its own
  table (see `InternalNote`), never a variant/flag on the same
  structure used for visitor-facing content — never rely on a filter
  to keep private data private.
- Any future sequential human-facing number (bookings, invoices, a
  second entity's reference numbers) should reuse `ReferenceCounter`
  with a new key prefix, not a new counter table.
- New transactional emails should use `src/lib/email/layout.ts`'s
  shared shell and `emailService.send()` (retry + graceful-failure
  built in) rather than calling Resend directly from an action.
- A permission narrower than an existing resource's `update` (Sprint
  8's `campaigns:send`) should be a new resource + action pair through
  `can()`, mirroring `ownership`/`campaigns` — never a bespoke
  permission check that breaks from the established
  `can(role, resource, action)` convention.
- A token that must keep working in *future*, not-yet-generated emails
  (Sprint 8's unsubscribe links) should be deterministically derived
  (HMAC over a stable id) and never stored — a raw-token-plus-hash
  design only works for single-use tokens verified once, shortly after
  issuance (e.g. confirmation links). See
  `docs/sprints/SPRINT-08.md`'s "Architecture decisions."
- New pure-logic utilities worth unit-testing should live outside any
  `"server-only"`-guarded file (see `src/lib/normalize-email.ts`) so
  `tests/*.test.ts` (vitest) can import them directly.
- Any new public page's metadata must go through `buildMetadata()`
  (`src/lib/seo.ts`) — never hand-build a `Metadata` object. Any
  content type with an editable `Seo` relation should render
  `<SeoFields>` for its admin form. See `docs/SEO.md`.
- Never call `@vercel/analytics` directly — always go through
  `trackEvent()` (`src/lib/analytics.ts`), and never pass an event
  property that could identify someone.
- New directional Tailwind spacing on a component should use logical
  utilities (`ps-*`/`pe-*`/`ms-*`/`me-*`/`text-start`/`text-end`), not
  physical ones — see `docs/ACCESSIBILITY.md` for the reasoning and
  the current conversion status.
- A Server Component passing a function/icon-component prop (e.g. a
  `LucideIcon`) to a child can never have that child become a Client
  Component — extract only the interactive leaf into a small client
  island instead. See `docs/PROJECT_MEMORY.md`'s Sprint 9 notes for
  the real regression this caused with `CourseCard`.
- **The Sprint 11 logo emblem is frozen** — never redrawn,
  reinterpreted, or AI-approximated. Where the mark and the wordmark
  need to appear together, compose them live (mark image/SVG + real
  text) as a "digital lockup," never as a new flattened logo-with-text
  file — see `public/brand/README.md`'s asset manifest and
  `docs/CREATIVE_DIRECTION.md`. Designer source files live in
  `brand-source/` at the project root, outside `public/` — never move
  them back into a publicly-servable path.
- **Do not begin the next visual-design sprint (typography/hero/
  section/footer redesign, new animation) without checking
  `docs/ROADMAP.md`'s Editorial Refinement sequence and
  `docs/CREATIVE_DIRECTION.md` first** — visual work on this project
  follows a deliberate critique-then-implement process, not ad hoc
  changes. See "Editorial Refinement (proposed, not started)" below.
