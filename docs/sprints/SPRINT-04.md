# Sprint 4 — Admin Dashboard Polish

Follows Sprints 1–3 (public website, branding, CMS/backend architecture).
Scope: elevate the `/admin` CMS from "functionally complete" to the
premium, handcrafted dashboard the brief called for — search/sort/pagination
everywhere, autosave, a live preview, rich text, CSV export, media
list/grid views, and a completed SEO surface — with **no changes to any
public page's design or content**.

## Files created

**Shared primitives**
- `src/lib/list-query.ts` — `parseListQuery`, `buildListHref`, `pageCount`: turns a page's `searchParams` into typed `{ q, sort, dir, page, pageSize, skip, take }`, and builds hrefs that preserve the other query params when one changes.
- `src/lib/csv.ts` — `toCsv(headers, rows)`, a dependency-free RFC-4180-ish CSV encoder.
- `src/lib/sanitize-rich-text.ts` — wraps `sanitize-html` with an allowlist (`p, strong, em, u, ul, ol, li, blockquote, h2, h3, br`) for content saved from the rich text editor.
- `src/hooks/use-autosave.ts` — debounced autosave hook (`idle | pending | saving | saved | error`), driven by a `useWatch()` snapshot; keeps `onSave` in a ref so callers don't need to memoize it.
- `src/dashboard/components/table-toolbar.tsx` — `TableSearchForm`, a plain GET-form search box (works with JS disabled, keeps list pages as Server Components).
- `src/dashboard/components/pagination-controls.tsx` — `PaginationControls`, prev/next + count, hidden when there's only one page.
- `src/dashboard/components/autosave-indicator.tsx` — renders the four autosave states as a small status pill.
- `src/dashboard/components/rich-text-editor.tsx` — Tiptap-based `RichTextEditor` (Bold/Italic/H2/H3/lists/quote/undo/redo), styled with the site's own type/colour tokens.
- `src/dashboard/components/export-csv-button.tsx` — client button that calls a server action and triggers a browser download via a Blob URL.
- `src/dashboard/components/media-actions-menu.tsx` — Rename (Dialog) + Delete (existing `ConfirmDialog`) actions, shared by the Media grid and list views.
- `src/dashboard/components/media-list-row.tsx` — the Media Library's list-view row.

**Migration**
- `prisma/migrations/20260731092020_sprint4_dashboard_upgrades/` — adds `ContentStatus` enum, `HomepageContent.status`, `Question.flagged`, `Seo.keywords`, `Seo.noindex`.

**New dependencies**
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm` — the rich text editor.
- `sanitize-html` (+ `@types/sanitize-html`) — server-side HTML sanitization.

## Files substantially changed

- `src/dashboard/components/data-table.tsx` — added optional `sortKey` per column + `sort`/`buildSortHref` props; clickable, `aria-sort`-correct headers with direction arrows.
- `src/dashboard/components/homepage-form.tsx` — rewritten: live preview panel (browser-chrome mockup of the Hero, driven by `useWatch`), Draft/Published segmented toggle, autosave wired through `useAutosave`.
- `src/dashboard/components/about-form.tsx` — Biography is now a `RichTextEditor`; autosave wired the same way as Homepage.
- `src/dashboard/components/seo-form.tsx` — added Keywords, OG image upload, Twitter image upload, a site-wide noindex toggle, and an informational (read-only) sitemap/robots block.
- `src/dashboard/components/book-form.tsx` — added an SEO card (meta title/description).
- `src/dashboard/components/question-detail-sheet.tsx` — added a Flag/unflag toggle.
- `src/dashboard/components/media-card.tsx` — now delegates actions to `MediaActionsMenu` instead of a single inline delete button.
- `src/dashboard/components/user-form-dialog.tsx` — added a line clarifying invites don't send a real email yet.
- `src/app/admin/{books,ask-ahmad,contact,newsletter,users}/page.tsx` — search + sortable columns + pagination, all server-driven via `searchParams`.
- `src/app/admin/newsletter/page.tsx` — added `ExportCsvButton` and a disabled "New campaign" button with a tooltip.
- `src/app/admin/media/page.tsx` — added a grid/list view toggle (`?view=`).
- `src/app/admin/page.tsx` (Overview) — added "Latest uploads" and "Future features" sections.
- `src/app/robots.ts` — now reads the SEO noindex flag and disallows everything when it's on.
- `src/services/{book,question,contact,newsletter,user}.service.ts` — added `listPaged()` (search/sort/pagination via Prisma `where`/`orderBy`/`skip`/`take`); existing unpaginated `list()` methods were left untouched so the homepage's book picker and the Overview's activity feed keep working exactly as before.
- `src/services/media.service.ts` — added `rename()` and `listRecent()`.
- `src/features/flags.ts` — added an `analytics` flag (the sidebar's "Analytics" item didn't have one yet).

## Architecture decisions

**Server-driven tables, not client-side state.** Search/sort/pagination are implemented as plain URL query params (`?q=&sort=&dir=&page=`), read in the page's Server Component, passed straight into a Prisma `where`/`orderBy`/`skip`/`take`. This was the only viable approach without breaking the existing pattern: `DataTable`'s `cell` renderers are JSX closures built in a Server Component (e.g. `<BookRowActions>`), and Server Components cannot pass functions across the boundary into a Client Component. Making `DataTable` itself a client component would have broken that. The upside is real: it works with JS disabled, needs no client bundle for the list pages, and matches the folder-filter pattern the Media page already used in Sprint 3.

**`listPaged()` alongside `list()`, not instead of it.** Two existing call sites — the homepage editor's "Featured book" picker and the Overview's recent-activity feed — depend on an unpaginated array. Rather than retrofit those, each service got a new `listPaged(query)` method returning `{ rows, total }`, used only by the corresponding `/admin/<x>` list page. Lower risk, and it's obvious at the call site which behaviour you're getting.

**Live preview is a mockup, not an iframe of the real site.** See "Technical debt" below — the public pages don't read from the CMS at all yet, so an iframe would just show the old static Hero regardless of what's typed. The preview panel is a small client component built from the same design tokens (colours, `font-display`, button variants) as the real `Hero`, driven by `useWatch()`. It's honest about being a preview, not a live window onto production.

**Draft/Published is a real, persisted field — with an explicit caveat.** `HomepageContent.status` is a genuine column, toggled immediately (not debounced) via its own action call. But — see below — nothing on the public site currently reads it. The toggle is labelled and scoped honestly as a content-record state, not "click to go live."

**Rich text only on Biography.** The About editor's other fields (intro text, mission, future vision) are short, single-paragraph marketing copy — a toolbar would be overhead, not help. Biography is the one field long/structured enough to benefit from headings, lists, and emphasis, so that's the only one that got the Tiptap treatment. Saved HTML is sanitized server-side in `about.service.ts` before it's written, even though only authenticated dashboard users can produce it.

## Reusable components worth knowing about

- `useAutosave` + `AutosaveIndicator` — generic; any form can adopt the same "watch → debounce → save → show status" pattern by passing `value` (a `useWatch()` snapshot) and an `onSave`.
- `parseListQuery` / `buildListHref` / `PaginationControls` / `TableSearchForm` — the whole search+sort+pagination kit is copy-paste-free: a new list page needs a `listPaged()` service method, a `parseListQuery(await searchParams, defaultSort)` call, and the three components.
- `RichTextEditor` — ready to attach to any other long-text field (e.g. a future Article body) without new plumbing; pair it with `sanitizeRichText()` in the service layer.
- `toCsv()` — generic enough for any future "export this list" button (Users, Questions, etc.), not just Newsletter.

## Technical debt / known gaps

- **The public site does not read from the CMS at all.** This was discovered mid-sprint, not introduced by it: `Hero`, `AboutPreviewSection`, the public `/about` page, etc. are 100% static/hardcoded — none of them import `homepageService`, `aboutService`, or `bookService`. Every editor built in Sprint 3 and polished in Sprint 4 (Homepage, About, Books, SEO) writes to real database rows that currently have **no effect on the live site**. This is the most important thing to know before demoing Draft/Publish or the live preview — they're honest about what they do (persist state, preview a mockup), but neither one changes what a visitor sees today.
- **Two pre-existing Prisma bugs found and fixed this sprint:** `homepageRepository` and `aboutRepository` both used `db.<model>.upsert({ create, update })`, which triggered "Unknown argument `heroImageId`" (etc.) at runtime — Prisma's checked/unchecked input validation didn't resolve to the `Unchecked*Input` variant used to build the mixed create+update payload, even though the same shape type-checked fine. Both singleton repositories were switched to a plain `.update()` (the row is guaranteed to exist after `prisma db seed`, so there's no create branch to disambiguate), matching the fix already applied to `SiteSettings` in Sprint 3. **Any future singleton-pattern repository should use `update()`, never `upsert()`, for this reason.**
- **CSV export is Newsletter-only.** `toCsv()` is generic; Users and Questions don't have an export button yet because the brief didn't ask for it there, but it would be a ten-minute add if wanted.
- **The `noindex` toggle relies on Next revalidating a route classified `○ Static` at build time** (`/robots.txt`). This works correctly via the `revalidatePath("/robots.txt")` call already wired into `updateDefaultSeoAction` (verified in dev), but it's worth a production smoke-test after the first real deploy, since static-route revalidation behaves slightly differently under different hosting targets.
- **Sort by `lastLoginAt` (Users)** — most rows have `null` here (no real auth yet), so its ordering will look arbitrary until Sprint 5's auth work populates it meaningfully.

## Recommendations for Sprint 5

1. **Wire the public site to the CMS.** This is the natural next step and arguably overdue: `HomePage`, `AboutPage`, and the book detail/list pages should read from `homepageService.get()` / `aboutService.get()` / `bookService.list()` instead of hardcoded constants, preserving the exact current markup/design (a data-wiring pass, not a redesign). Once that's done, Draft/Published and the live preview stop being "honest mockups" and become real controls — worth revisiting their copy at that point.
2. **Real authentication**, per the Sprint 3 brief's explicit deferral — `getCurrentUser()` is still a stub. This also unblocks meaningful `lastLoginAt` sorting and makes the "Invite user" flow real (send an actual email).
3. **A real invitation email** once Resend is wired to the invite action — the copy added this sprint ("They won't receive an email invite yet") should be removed at that point rather than left stale.
4. Consider **Users/Questions CSV export** if that turns out to be wanted in practice — the `toCsv()` utility already supports it.
