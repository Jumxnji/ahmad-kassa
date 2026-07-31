# Sprint 6 — Books Management System & Media Library

Follows Sprints 1–5 (public website, branding, backend/CMS architecture,
dashboard polish, authentication). Scope: turn the existing, functional
Books CRUD from Sprint 3 into a premium publishing-platform editing
experience, extend the Media Library into a real asset management
system, and — the item every prior sprint's retrospective flagged as
the top gap — wire the public Books/Book Detail/Featured Book surfaces
to read live from the CMS instead of hardcoded placeholder data. No
public page was redesigned and no existing dashboard page was
regenerated from scratch; this sprint is additive, per the brief.

## Files created

**Database**
- `prisma/migrations/20260731192010_sprint6_books_media/` — `BookStatus`
  enum; new `Book` columns (`authorName`, `publicationDate`, `isbn`,
  `language`, `category`, `tags`, `signedCopyAvailable`, `ebookUrl`,
  `audiobookUrl`, `status`); `Media.thumbnailUrl`; `MediaFolder` enum
  renamed `PDFS` → `DOCUMENTS` (via `ALTER TYPE ... RENAME VALUE`, not a
  drop/recreate) plus new `GALLERY`/`DOWNLOADS` values. Data migration
  step folds the old `published`/`comingSoon` booleans into `status`
  before dropping them, so the existing seeded book kept its state.

**Admin — Books**
- `src/dashboard/components/tags-input.tsx` — small chip-style tag
  editor (type + Enter/comma to add, backspace to remove last).
- `src/dashboard/components/media-picker.tsx` — `MediaPickerField`
  (single-select) and `MediaGalleryField` (multi-select), both backed
  by a shared internal dialog: folder filter, search, existing-media
  grid, inline upload. The reusable "Media Picker" the brief asked for.

**Admin — Media**
- `src/dashboard/components/media-dropzone.tsx` — wraps the Media
  Library grid/list; drag-and-drop upload to the currently active
  folder, on top of the existing upload button.
- Rewrote `src/dashboard/components/media-actions-menu.tsx`'s rename
  dialog into a full "Details" dialog: editable filename + alt text,
  plus read-only dimensions/size/upload date/uploader/usage count.

**Public site**
- `src/components/shared/share-buttons.tsx` — copy-link + native
  Web Share API button, used on the Book Detail page.

## Files substantially changed

- `prisma/schema.prisma` — `Book` model reshaped (see below); `Media`
  gained `thumbnailUrl`; `MediaFolder` retaxonomised.
- `src/schemas/book.schema.ts` / `src/validators/book.validator.ts` —
  full new field set; `.default()` calls removed after they broke
  `zodResolver`'s inferred form type (see Errors below) in favour of
  explicit `defaultValues` in the form itself.
- `src/repositories/book.repository.ts` — added `findLatestPublished()`
  for the homepage fallback; `findMany()`'s return type pinned
  explicitly (see Errors below).
- `src/services/book.service.ts` — `listPublic()`, `resolveFeatured()`,
  `getRelated()`, `duplicate()`; gallery relation writes (`connect` on
  create, `set` on update) split out from scalar field handling.
- `src/actions/admin/book.actions.ts` — added `duplicateBookAction`.
- `src/services/storage.ts` — full rewrite around `sharp`: dimension
  probing, capped-size re-encode, thumbnail generation for
  JPEG/PNG/WEBP; SVGs and non-images pass through untouched.
  `remove()` now cleans up a thumbnail file alongside the main one.
- `src/repositories/media.repository.ts` — `findMany`/`findById` now
  include the uploader (`{ id, name }`); added `countUsages()`.
- `src/services/media.service.ts` — wires the new storage fields
  through; added `updateDetails()` and `countUsages()`.
- `src/actions/admin/media.actions.ts` — added `updateMediaDetailsAction`,
  `getMediaUsageCountAction`, and `listMediaAction` (backs the Media
  Picker).
- `src/dashboard/components/book-form.tsx` — full rewrite: six tabs
  (General, Publishing, Media, Purchase options, SEO, Preview),
  `RichTextEditor` for the full description, `TagsInput`, the Media
  Picker for cover + gallery, autosave (existing books only — a new
  book has nothing to autosave against until first created), a
  `beforeunload` unsaved-changes guard, and a confirm-on-cancel-if-dirty
  check.
- `src/app/admin/(app)/books/page.tsx` — cover thumbnail column, new
  status badges (Draft/Published/Coming soon/Archived), a separate
  Featured column, and expanded row actions.
- `src/dashboard/components/book-row-actions.tsx` — added View (opens
  the live page, only shown once a book is publicly visible) and
  Duplicate, alongside the existing Edit/Delete.
- `src/app/admin/(app)/media/page.tsx` — new folder chips, wrapped in
  `MediaDropzone`.
- `src/components/media/book-cover.tsx` — now renders a real uploaded
  cover via `next/image` when one exists, falling back to the existing
  manuscript-styled placeholder when it doesn't — no code path changes
  when a cover is later uploaded, only data.
- `src/components/cards/book-card.tsx`, `src/components/catalog/books-grid.tsx`
  — rebuilt against the real `Book`/`Media` shape; the grid's fake
  format-filter tabs (built against an invented "format" field that
  doesn't exist in the real schema) were dropped rather than
  synthesised from real data that doesn't distinguish formats yet.
- `src/app/(site)/books/page.tsx`, `src/app/(site)/books/[slug]/page.tsx`
  — rebuilt to fetch from `bookService` instead of
  `src/lib/data/books.ts`; the detail page adds a gallery section,
  share buttons, and pulls "About the author" from the real
  `aboutService.get()` content instead of a hardcoded bio.
- `src/components/sections/featured-book-section.tsx` — now an async
  Server Component reading `homepageService.get().featuredBookId`,
  falling back to `bookService.resolveFeatured()`'s newest-published
  logic.
- `src/lib/seo.ts` — `buildBookJsonLd()` rewritten against the real
  `Book` shape; `buildMetadata()` gained optional `canonicalUrl`/
  `ogImage` overrides so a book's own SEO fields can take precedence.
- `src/app/sitemap.ts` — now async, reads published books from
  `bookService.listPublic()` instead of the static catalog.
- `prisma/seed.ts` — backfills the real Amazon URL onto the existing
  seeded book only if it's still missing or the old placeholder value
  (never overwrites a link an editor has since changed via the CMS).

## Files removed

- `src/lib/data/books.ts` — the placeholder catalog, fully superseded.
- `Book`/`BookFormat` from `src/types/content.ts` — the real `Book`
  Prisma model replaces this shape. `Author`/`Article`/`Course`/
  `Seminar`/`Lecture` in the same file are untouched — they're still
  legitimate placeholders for unbuilt content types.

## Architecture decisions

**`BookStatus` enum instead of `published`/`comingSoon` booleans.** The
old pair allowed nonsensical combinations (both `true` at once) and had
no way to express "was published, later taken down" — `ARCHIVED` needed
a real state, not a third boolean. `featured` stays a separate boolean
since it's genuinely orthogonal to lifecycle (a draft could, in
principle, be flagged featured-when-published).

**Duplicate never copies cover/gallery images.** `coverImageId` is a
1:1 relation (`Media.bookCoverOf`) and gallery images belong to exactly
one book via `Media.bookGalleryId` — copying either onto a duplicate
would silently move the image away from the source book. `duplicate()`
clones every scalar field, forces `status: DRAFT` and `featured: false`,
and leaves cover/gallery empty for the new title to get its own images.

**Media usage count is computed on read, not stored.** A stored counter
would need six write paths (book cover, book gallery, both SEO image
slots, homepage hero, site logo) kept in sync, and would eventually
drift. `mediaRepository.countUsages()` runs six small `count()` queries
in parallel instead — always correct, cheap enough for an on-demand
details dialog.

**Image processing added `sharp` as a genuine, justified dependency.**
"Automatically optimise uploads, generate thumbnails" isn't achievable
without real image-codec work — this isn't a "just in case" addition.
Processing is scoped to JPEG/PNG/WEBP (resize to a 2400px max edge,
generate a 480px-wide thumbnail); SVGs and non-images (PDFs) pass
through unprocessed, since a vector format has no meaningful raster
thumbnail and rasterizing it would be actively worse.

**Reusable Media Picker, not a rebuild of every image field.** The
brief asked for a picker "used later by Homepage, Articles, Courses,
Authors, SEO" — built now (`MediaPickerField`/`MediaGalleryField`),
adopted this sprint only by the Book editor's cover and new gallery
field. The older single-upload `ImageUploadField` was deliberately
**left in place** on Homepage hero / Site Settings logo / SEO OG &
Twitter image fields — migrating those wasn't in scope, and a
half-migrated pattern would be worse than a clearly-documented "not yet
migrated" state (see `docs/PROJECT_MEMORY.md`).

**No in-browser cropping.** A real crop UI is a meaningful chunk of
scope (a new dependency like `react-easy-crop`, a crop-then-upload
flow) that the brief's other 30-odd requirements didn't leave room for
this sprint. Covers/gallery images are expected pre-cropped to a
sensible ratio (2:3 for covers); the automatic resize/thumbnail
pipeline still runs regardless. Flagged explicitly as deferred, not
silently dropped — see Recommendations below.

**Format-filter tabs on the public Books grid were dropped, not
ported.** The placeholder catalog invented a `format` field
(physical/ebook/audiobook) with filter tabs above the grid. The real
`Book` model doesn't model "format" as a first-class field — it has
purchase *links* (Amazon, direct, ebook, audiobook) instead, which
isn't the same axis. Rather than synthesise a fake format list from
which links happen to be filled in, the grid was simplified to a plain
responsive grid. If format filtering is genuinely wanted later, it
should be a real schema decision (e.g. a `formats: BookFormat[]`
column), not client-side guesswork.

**"About the author" on the Book Detail page now reads from
`aboutService.get().introText`** instead of a hardcoded bio string —
one CMS-editable source of truth for Ahmad's bio, reused across the
About page and every book page, rather than a copy that could drift.

## Errors and fixes

- **`zodResolver` typing broke once `bookSchema` used `.default(...)`
  on several fields.** `z.infer` resolves to Zod's *output* type (post-
  default), which doesn't match the *input* shape `useForm`'s
  `defaultValues` actually provides pre-submission — this produced a
  cascade of "two different types... but they are unrelated" errors
  across every `FormField`. Fixed by removing `.default()` from
  `bookSchema` entirely (the form always supplies every field via
  explicit `defaultValues`, and the DB columns already carry their own
  defaults) and letting `useForm`'s generic be inferred from
  `zodResolver(schema)` rather than pinned explicitly. No other schema
  in the project uses `.default()` for exactly this reason — don't
  reintroduce it on a form-facing schema.
- **`bookRepository.findMany()`'s inferred return type silently
  dropped `coverImage`/`seo`**, even though the include is present at
  runtime — spreading `...args` after a literal `include` widens
  Prisma's return-type inference to "maybe no include at all," since
  the generic `args` parameter could theoretically override it. Fixed
  with an explicit `Prisma.BookGetPayload<...>` return type + cast,
  documented inline. The same fix was applied proactively to
  `mediaRepository.findMany()` for the same underlying reason (both
  spread `args` after a literal `include`). `findById`/`findBySlug`
  were never affected, since they don't take a generic `args` param.
- **A `Date` value from the form (`publicationDate`) failed a `new
  Date(field.value)` type check** because react-hook-form's inferred
  field type wasn't narrowed enough. Fixed with a small
  `dateInputValue()` helper that safely handles `Date | string |
  null | undefined` and returns an `<input type="date">`-compatible
  string.

## Testing performed

- Verified the Sprint 6 migration against the existing seeded book: the
  data-migration step correctly converted `published: true,
  comingSoon: false` into `status: PUBLISHED`, confirmed via direct
  `psql` query before touching the seed script.
- Ran the seed script twice: once confirming it backfilled the real
  Amazon URL onto the placeholder value, and once confirming a second
  run is a no-op (doesn't re-touch a since-changed link).
- `npx tsc --noEmit` and `npx eslint` both clean across the full
  change set.

## Recommendations for Sprint 7

1. **Finish wiring the public site to the CMS** — `Hero`,
   `AboutPreviewSection`, and the public `/about` page are still
   hardcoded. This sprint proved out the pattern on Books; the same
   approach (read from the existing `homepageService`/`aboutService`,
   preserve markup exactly) applies directly.
2. **Migrate `ImageUploadField` call sites to the Media Picker** —
   Homepage hero, Site Settings logo, SEO OG/Twitter images — once
   there's a reason to touch those editors anyway, so the codebase
   isn't carrying two image-selection patterns indefinitely.
3. **In-browser cover/gallery cropping**, if pre-cropped uploads prove
   to be real friction in practice.
4. Real invite emails, shared-store rate limiting, and `AuditLog.ipAddress`
   — carried over from Sprint 5's recommendations, still open.
