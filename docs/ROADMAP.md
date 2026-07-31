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

## Immediate priority (Sprint 5 candidate)

1. **Wire the public site to the CMS.** This is the single most
   important gap in the project right now. `HomePage`, the public
   `/about` page, and the book pages are still 100% hardcoded from
   Sprint 1 — none of the content editors built in Sprints 3–4 affect
   what a visitor actually sees. The fix is a data-wiring pass only
   (read from `homepageService.get()`, `aboutService.get()`,
   `bookService.list()` etc.), preserving the exact current
   markup/design — not a redesign.
2. **Real authentication.** `getCurrentUser()` is still a stub
   returning the seeded Owner. Needed before the dashboard can be used
   by more than one trusted person, before `lastLoginAt` sorting means
   anything, and before user invites can send a real email.
3. **Real invite emails**, once auth exists and Resend is wired to the
   invite action.

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
