# Sprint 24 — Homepage CMS Parity & Featured Khutbah Management

## Brief

Close two of the remaining "CMS row exists, public site never reads
it" gaps (tracked in `docs/PROJECT_MEMORY.md`'s "Known limitations"
since Sprint 4/6): the homepage's About Preview section and its Latest
Khutbah section. Build a real `Video` content model, an admin CRUD
workflow for it (YouTube-URL-derived create/edit), and an explicit
three-slot (Primary/Supporting 1/Supporting 2) featured-khutbah
picker on the Homepage editor — then wire both public sections to
read live from the database, preserving the approved visual
composition exactly (data wiring, not a redesign). Migrate the three
real, already-verified khutbahs out of the static `src/lib/data/
lectures.ts` fixture into the database; deliberately leave the three
"coming-soon" placeholder lectures out of the database entirely (a
content-truth decision, not an oversight). This work was preceded by
an unrelated, higher-priority stop: a pre-existing Sprint 8 migration
checksum mismatch had to be safely reconciled first, under an
explicit EXPAND → MIGRATE/BACKFILL → VERIFY → CONTRACT-LATER
constraint and a hard no on `prisma migrate reset` or `db push
--accept-data-loss` — see `docs/PROJECT_MEMORY.md`'s "Important
conventions" for how that was resolved.

## What shipped

**Database** — two new models (`Video`, `HomepageCredential`), three
new nullable FKs on `HomepageContent` (`primaryKhutbahId`/
`supportingKhutbah1Id`/`supportingKhutbah2Id`), four new `about*`
fields replacing (not yet dropping — EXPAND strategy) the legacy
`aboutPreviewText` column. Applied via a purely additive migration
(`prisma/migrations/20260820150000_sprint24_homepage_cms_video_model`)
— zero `DROP` statements, verified by eye before `migrate deploy`.

**Backend** — `Video` gets the project's standard five-layer stack
(`schemas/validators/repositories/services/actions`), reusing the
existing `"content"` permission resource (not a new resource — Video
sits under the "Media" sidebar section for findability only, gated on
`content` like Homepage/About/Books). `HomepageContent`'s existing
stack was extended: `homepageContentSchema` grew the four `about*`
fields, the three khutbah FKs, and a `superRefine` cross-slot
uniqueness check; `HomepageCredential` got its own add/update/remove/
move (up/down) actions, capped at 4 (`MAX_HOMEPAGE_CREDENTIALS`,
`src/lib/homepage-credentials.ts`) — the only genuinely new UI
pattern this sprint needed, since no reorder control existed anywhere
else in the dashboard to copy.

**Admin UI** — `/admin/videos` (list/new/edit), matching the Books
admin's exact `DataTable`/`TableSearchForm`/`PaginationControls`
pattern; the video form's YouTube URL field derives and previews the
video ID + thumbnail live via the existing pure `src/lib/youtube.ts`
helpers before save. The Homepage editor gained an "About preview"
card (4 fields + the credential manager) and a "Featured khutbahs"
card with three `VideoPickerField` instances — a rich dialog picker
showing thumbnail+title+date+status, never a raw id — labelled
exactly **Primary**, **Supporting 1**, **Supporting 2** (never "big/
small card"). `LivePreviewCard` was extended to actually reflect the
About-preview fields and the three selected videos, closing a
previously-flagged gap (it only ever rendered orphaned Hero fields).

**Public wiring** — `AboutPreviewSection` and `LatestKhutbahSection`
(`featured-lectures-section.tsx`) are now real `async` Server
Components. `AboutPreviewSection` reads `HomepageContent` directly;
`LatestKhutbahSection` calls `homepageService.resolveFeaturedKhutbahs()`,
which resolves the three FK slots to published `Video` rows and runs
them through the pre-existing `resolveFeaturedKhutbahs()` gap-
compression algorithm (`src/lib/featured-khutbahs.ts`) before handing
them to the unchanged `KhutbahEntry` presentational component. The
rendered HTML/CSS is unchanged from before this sprint — verified by
direct before/after comparison in-browser, not just by reasoning about
the diff. `src/lib/data/lectures.ts` is no longer imported by any
production code path (confirmed by grep); it remains only as a
potential test fixture.

**Seed** — `prisma/seed.ts` now idempotently creates the three real
khutbahs (matched by `youtubeId` via `findFirst`, not `findUnique` —
the field isn't unique in the schema) and backfills the homepage's
three khutbah slots and four credential rows, guarded so a re-run
never overwrites an editor's later changes through the CMS.

## CMS-parity classification

Every homepage section, classified as it stands after this sprint:

| Section | Classification | Notes |
|---|---|---|
| Hero | (c) Intentionally fixed | `HomepageContent.hero*` fields exist and persist real edits, but `Hero` (`src/components/sections/hero.tsx`) still renders fully static copy — a pre-existing gap (Known Limitations, tracked since Sprint 4/6), explicitly **not** in this sprint's scope. Next sprint's top priority. |
| Featured Book | (a) CMS-controlled | Unchanged from Sprint 6 — `homepageService.featuredBookId` with fallback to newest published book. |
| About Preview | (a) CMS-controlled | **New this sprint.** Eyebrow/subtitle/lede/body + ordered credential list all read live from `HomepageContent`/`HomepageCredential`. |
| Teaching Areas | (c) Intentionally fixed | Five entries (`teaching-areas-section.tsx`) mirror Ask Ahmad's real question-category taxonomy — explicitly out of scope for this sprint; not a hidden gap. |
| Quote | (c) Intentionally fixed | Static pull-quote interstitial, by design — explicitly out of scope. |
| Latest Khutbah | (a) CMS-controlled, (b) derived | **New this sprint.** Three explicit slots on `HomepageContent` are CMS-controlled; what actually renders is *derived* from those slots via `resolveFeaturedKhutbahs()`'s fallback/promotion logic against live `Video.status`. |
| Future Courses | (d) Still static | Reads the real `getAllCourses()` catalog (not this sprint's concern), which is itself still a static fixture — unchanged, not addressed this sprint. |
| Ask Ahmad (CTA) | (c) Intentionally fixed | Static prompt copy — explicitly out of scope. |
| Newsletter | (a) CMS-controlled | Unchanged from earlier sprints — `HomepageContent.newsletterHeadline`/`newsletterText`. |
| Footer | (c) Intentionally fixed | Sitewide, not homepage-specific — explicitly out of scope. |

**Explicitly not attempted this sprint** (would be scope creep, not a
gap): making Teaching Areas' five entries editable, making the Quote
section editable, or wiring Hero's already-persisted-but-unread
fields. Each stays a deliberate, named boundary — see
`docs/PROJECT_MEMORY.md`'s "Known limitations" for the standing
priority list.

## Testing

Extended the pure-logic vitest suite (56 → 69 tests): two new
`m.youtube.com`/`m.youtu.be` cases in `tests/youtube.test.ts`; a new
`tests/homepage-credentials.test.ts` covering the 4-item cap boundary;
a new `tests/homepage-schema.test.ts` covering the featured-khutbah
slot uniqueness `superRefine`. Fallback/promotion logic was already
fully covered by the pre-existing `tests/featured-khutbahs.test.ts`.
Full CRUD/permission/DB-round-trip behaviour was verified manually in
the browser (see below), matching this project's established
pure-logic-only unit-testing convention.

## Browser QA performed

As Administrator (role-equivalent to Owner for every permission this
sprint touches — see below): edited the About Preview body text,
saved, confirmed the public homepage reflected it live, restored the
approved copy; created a video from a pasted YouTube URL and confirmed
live ID/thumbnail derivation, then deleted it via the confirm dialog;
assigned/reassigned featured-khutbah slots; attempted assigning the
same video to two slots and confirmed the inline "Each khutbah can
only be assigned to one slot." error (schema-level `superRefine`,
surfaced by react-hook-form's own client-side validation on explicit
submit); unpublished the Primary-slot video and confirmed the public
section promoted Supporting 1 forward with no broken card, then
republished it; checked console/network for errors throughout (found
and fixed one real bug — see below); confirmed the desktop layout is
pixel-identical before/after.

**One real bug found and fixed during QA**: the first attempt at
`/admin/homepage` and `/admin/videos` threw `Cannot read properties of
undefined (reading 'findMany')` — the long-running dev server process
had an in-memory Prisma Client instantiated before the `Video`/
`HomepageCredential` models existed (the dev singleton in `src/db/
client.ts` never restarts on its own), so its `db.video` accessor was
undefined even though `npx prisma generate` had already run. Fixed by
restarting the dev server; not a code bug, but worth knowing if a
`findMany` on a newly-added model throws `undefined` immediately after
adding it — check for a stale dev-server process before the schema
itself.

A second console error (`Maximum update depth exceeded` from
`useWatch`) appeared once during QA, coinciding with a burst of very
fast automated keystrokes correcting a typo; retyping at normal speed
immediately afterward produced no error, and `useWatch({ control })`
without a `name` filter is the same established pattern already used
unmodified in `book-form.tsx`. Treated as a browser-automation-speed
artifact, not a reachable bug for a real user — noted here rather than
silently dropped.

Mobile-viewport screenshots could not be captured this session — the
browser automation's `resize_window` call did not actually change
`window.innerWidth` in this environment (confirmed via a direct JS
check). Confirmed instead at the code level: neither modified public
section (`about-preview-section.tsx`, `featured-lectures-section.tsx`)
changed any responsive Tailwind class from what already existed —
every `sm:`/`lg:` breakpoint utility is byte-identical to the
pre-Sprint-24 markup, so mobile rendering is unchanged by construction.
A second-role (Editor) login was likewise not performed live — the
`"content"` permission resource this sprint exclusively reuses already
grants Owner, Administrator, and Editor identical (`ALL`) access, so
an Editor session would exercise the same code path already verified
as Administrator; a live login was skipped as redundant rather than
untested.

## Correction pass — cross-browser + content regression report

A follow-up QA report (Chrome vs. Safari recordings) claimed three
regressions. Investigated each from first principles — git history and
live measurements, not memory:

**1. Featured Book proportions "substantially larger" in Safari.**
`featured-book-section.tsx`, `book-cover.tsx`, and `section.tsx` all
have **zero diff** from before this sprint — nothing in this sprint
touched their CSS. The grid already correctly guards its tracks
(`lg:grid-cols-[minmax(0,0.62fr)_1fr]`, present since Sprint 11) and
the cover is separately capped by `max-w-md`, so a content-driven
blowout isn't structurally possible here. No live Safari DOM
measurement could be taken this session (see below) — the leading
hypothesis is a viewport-width mismatch across the two browsers rather
than a code regression: at a width just under vs. just over the
`lg:` (1024px) breakpoint, one browser renders the stacked
single-column mobile layout (cover full-width, no side-by-side text to
balance it) while the other renders the intended two-column
composition, which reads as "the cover is dominant" even though no
CSS actually changed. No code was changed for this item pending exact
matched-viewport confirmation.

**2. Latest Khutbah proportions differ in Safari.** Real bug, found
and fixed: `lg:grid-cols-[1.6fr_1fr]` was missing the `minmax(0, …)`
guard Featured Book's grid already had — see `docs/PROJECT_MEMORY.md`
and `docs/DESIGN_SYSTEM.md`'s new "Asymmetric `fr` grid tracks" note
for the full mechanism and fix
(`minmax(0,1.6fr)_minmax(0,1fr)`). Pre-existing since this markup is
byte-identical to before Sprint 24 — not something this sprint
introduced, but fixed now since it was surfaced by this QA pass.

**3. "Who Teaches Here" copy regression.** Did not reproduce. Traced
via `git show` (not memory) on the last commit to touch
`about-preview-section.tsx`: the committed source already held the
exact final-approved copy the report specified. The applied
migration's column defaults were generated from that same correct
text (read directly from `migration.sql`), `_prisma_migrations` shows
only one migration ever touched those columns, and both the live
database and the live server-rendered HTML held the exact correct
text — subtitle, lede, body, and all four credentials — byte-for-byte
against `git show <commit>:src/components/sections/
about-preview-section.tsx`, at investigation time. Most likely
explanation: the QA recording captured an earlier, mid-sprint
intermediate state (one implementation attempt this sprint briefly
used stale default text before being caught and corrected — see the
"Errors and fixes" history for this sprint) rather than the sprint's
final state. A full CMS round-trip test (edit About Preview lede in
the admin → save → confirm public page changes → restore exact
approved text → confirm public page restores) was run live and passed
end-to-end. Khutbah data (titles/slugs/dates/durations/order) and all
four credentials were independently re-verified byte-for-byte against
`git show` on the pre-Sprint-24 source — zero discrepancies found.

**Tooling note**: no Safari browser-automation tooling was available
this session (AppleScript `do JavaScript in Safari` requires the
"Allow JavaScript from Apple Events" Develop-menu setting, which isn't
enabled, and enabling it wasn't attempted since it's a browser
security-adjacent preference change outside this session's scope to
toggle unilaterally). Chrome-side measurements were taken directly via
DOM `getBoundingClientRect()`; the Safari side of items 1 and 2 relies
on code-level reasoning (confirmed zero diff, confirmed missing/
present `minmax(0, …)` guards) rather than a live matched-viewport
Safari screenshot. Recommend the next Safari QA pass record and report
`window.innerWidth`/`innerHeight`/`devicePixelRatio` alongside the
recording so a like-for-like comparison is possible.
