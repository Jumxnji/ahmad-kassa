# Sprint 7 — Communication System (Ask Ahmad, Contact, Email)

Follows Sprints 1–6. Scope: turn the already-functional Ask Ahmad and
Contact features from Sprint 3 into a professional, conversation-ready
communication system — real email delivery via Resend, spam
protection, a proper support-desk-style inbox, and a database
architecture that can grow into two-way conversations, attachments,
and a customer portal without a future migration. No public page was
redesigned and no existing dashboard page was regenerated from
scratch; this sprint is additive, per the brief.

## Files created

**Database & core services**
- `prisma/migrations/20260801041200_sprint7_communication/` — see
  "Database changes" below.
- `src/repositories/reference-counter.repository.ts` +
  `src/services/reference-number.service.ts` — atomic
  `AMK-{year}-{000023}` generation.
- `src/services/notification.service.ts` — dashboard bell data
  (computed counts, no new table).
- `src/lib/request-ip.ts` — shared best-effort caller-IP helper
  (extracted for the new spam-protection call sites; `src/actions/auth
  /login.ts`'s existing inline version was left as-is).
- `src/lib/spam-protection.ts` — honeypot check, per-form-per-IP rate
  limiting, and the shared "how recent counts as a duplicate" window.

**Email**
- `src/lib/email/layout.ts` — the shared branded HTML shell (logo,
  brand colours, footer) every template renders through.
- `src/lib/email/templates.ts` — `questionReceivedEmail`,
  `contactReceivedEmail`, `adminNewQuestionEmail`,
  `adminNewContactEmail`.
- `src/services/email.service.ts` — wraps Resend: resolves the admin
  recipient from `SiteSettings.contactEmail`, sends with a short retry,
  never throws.

**Admin — Ask Ahmad**
- `src/app/admin/(app)/ask-ahmad/[id]/page.tsx` — the new conversation
  detail page (replaces the old `question-detail-sheet.tsx`, which was
  deleted).
- `src/dashboard/components/question-meta-controls.tsx` — status/
  priority selects, mark read/unread, flag, archive, delete.
- `src/dashboard/components/internal-notes-panel.tsx` — staff-only
  notes list + add form.
- `src/dashboard/components/notification-bell.tsx` — topbar bell +
  dropdown.

## Files substantially changed

- `prisma/schema.prisma` — see "Database changes."
- `src/schemas/question.schema.ts` / `src/validators/question.validator.ts`
  — new status/priority enums, `addInternalNoteSchema`.
- `src/repositories/question.repository.ts` / `src/services/question.service.ts`
  — `createWithConversation()` (Question + Conversation + first Message
  + UserNotification in one write), `findByIdWithDetail()`, read-
  tracking, internal notes, duplicate-detection query, search extended
  to `subject`/`referenceNumber`.
- `src/repositories/contact.repository.ts` / `src/services/contact.service.ts`
  — `subject` field, duplicate-detection query, status filter support
  in `listPaged()`.
- `src/actions/public/ask.ts` / `src/actions/public/contact.ts` — full
  rewrite: honeypot → rate limit → duplicate check → save → send both
  emails → (Ask Ahmad only) mark the notification sent.
- `src/actions/admin/question.actions.ts` — rewritten for the new
  fields; added `archiveQuestionAction`, `markQuestionReadAction`/
  `markQuestionUnreadAction`, `addInternalNoteAction`.
- `src/validators/public/ask-form.validator.ts` /
  `src/validators/public/contact-form.validator.ts` — added `subject`
  (Ask Ahmad: optional; Contact: required), `consent` (Ask Ahmad only,
  required-true), `company` (honeypot, both).
- `src/components/forms/ask-ahmad-form.tsx` — consent checkbox,
  character counter, honeypot, in-page success screen with a copyable
  reference number.
- `src/components/forms/contact-form.tsx` — Subject field, honeypot,
  in-page success screen.
- `src/app/(site)/contact/page.tsx` — removed the `mailto:` icon that
  printed the admin/notification address in plain HTML.
- `src/app/admin/(app)/ask-ahmad/page.tsx` — unread indicator, reference
  number column, priority badge, Status/Category/Unread-only filters.
- `src/app/admin/(app)/contact/page.tsx` — Subject column,
  Unread/Read/Archived filter.
- `src/dashboard/components/contact-detail-sheet.tsx` — shows subject
  as the sheet's heading.
- `src/app/admin/(app)/layout.tsx` — fetches `notificationService
  .getSummary()` and passes it into `DashboardShell`.
- `src/dashboard/components/dashboard-shell.tsx` — renders the new
  `NotificationBell` in the topbar.
- `src/app/admin/(app)/page.tsx` — `questionService.countPending()` /
  `status: "PENDING"` updated to the new API (`countByStatus("NEW")` /
  `status: "NEW"`).
- `prisma/seed.ts` — seed question updated to the new shape (reference
  number, `initialMessage`, nested Conversation/Message creation,
  matching `reference_counters` seed row); seed contact message gained
  a subject.

## Files removed

- `src/dashboard/components/question-detail-sheet.tsx` — fully
  superseded by the new `/admin/ask-ahmad/[id]` conversation page,
  which needed a two-column, spacious layout a side Sheet couldn't give
  it.

## Database changes

**`Question`** gained: `referenceNumber` (unique, required),
`subject` (optional), `priority` (`QuestionPriority`), `readAt`,
`assignedToId` (→ `User`, nullable), `updatedAt`. `question` was
renamed to `initialMessage`. `answer`/`answeredAt` were **dropped** —
superseded by Conversation/Message (see Architecture decisions).
`QuestionStatus` gained three real workflow states
(`IN_REVIEW`/`WAITING`/`CLOSED`) alongside a rename (`PENDING` → `NEW`).

**New models**: `Conversation` (1:1 with `Question` today, ready for
more), `Message` (`senderType` USER/ADMIN, `attachments` Json,
`readAt`), `InternalNote` (staff-only, separate table — see below),
`UserNotification` (visitor-facing notification tracking, reserved),
`ReferenceCounter` (generic atomic counter, key → value).

**`ContactMessage`** gained `subject` (required going forward,
`@default("")` at the DB level so the migration didn't need a painful
backfill).

**Migration note**: the migration file originally had a bug (a window
function directly inside an `UPDATE ... SET`, which Postgres rejects)
that failed partway through applying. The DDL that had already run
before the failure was left in place; the fix (moving the window
function into a `WITH` CTE) was applied by hand against the dev
database to complete the migration, the corrected SQL was written back
into the migration file, and the migration was marked resolved via
`prisma migrate resolve --applied` so the tracked history matches what
actually ran. Verified afterwards: the pre-existing seed question kept
its data, got a real backfilled reference number
(`AMK-2026-000001`), and gained its own Conversation + initial Message.

## Architecture decisions

**Question is the case file; Conversation/Message is the exchange.**
This is the core decision the brief asked for by name. `Question`
holds everything that's true about the *ticket* (who, what category,
what priority, what status, when) — it deliberately does not hold the
answer. The actual back-and-forth lives in `Conversation.messages`, a
real 1-to-many from the first migration, even though V1 only ever
creates one `USER` message per question. Building an admin-reply
feature later means writing a Server Action that creates an `ADMIN`
`Message` and an email — not touching the schema at all.

**`InternalNote` is its own table, not a third `Message.senderType`.**
The brief is explicit that internal notes must never be visible to a
visitor, now or in a future portal. Modelling them as a genuinely
separate table makes "internal notes leaking into a conversation view"
structurally impossible rather than a filtering rule that could be
gotten wrong once, later, under time pressure.

**Reference numbers via a generic atomic counter, not a sequence per
entity.** `ReferenceCounter` is a plain `key → value` table,
incremented with Postgres `INSERT ... ON CONFLICT DO UPDATE SET
value = value + 1` — safe under concurrent submissions, and reusable
for any future entity (contact enquiries, bookings) by just using a
different key prefix, rather than a bespoke `nextval()` sequence per
entity type.

**`readAt` is not `status`.** Whether staff have looked at a question
and where it stands in the workflow are different facts. Conflating
them (treating `status = NEW` as "unread") would have broken the
moment a question needed to move back to an earlier status after being
reopened. Both live as independent columns on `Question`.

**Two different "notifications."** The dashboard bell (staff-facing)
needed no new table at all — it's `questionService.countUnread()` +
`contactService.countUnread()` plus a couple of `list()` calls, always
correct because it's never stored. `UserNotification` (visitor-facing,
reserved for "your question was answered") is a real table that *is*
already written to honestly: `emailSent` flips `true` right after the
confirmation email genuinely sends, not as a placeholder someone has
to remember to wire up when the actual feature ships.

**Hand-written HTML email templates, not a templating dependency.**
React Email (or similar) would have been a reasonable choice, but the
four templates needed here don't justify a new rendering pipeline —
plain functions returning an HTML string, sharing one layout function,
satisfy "reusable branded templates" without a new dependency. Every
style is inlined (Outlook desktop strips `<style>` blocks) and no web
fonts are loaded (unreliable in email clients); the font stacks in
`layout.ts` are the closest email-safe approximation of the site's
actual Newsreader/Manrope pairing.

**Admin notification recipient resolved server-side from
`SiteSettings.contactEmail`.** Previously, the same `CONTACT_EMAIL`
constant was both the internal notification target *and* printed in
plain HTML on the public Contact page — directly at odds with the
brief's "never expose admin email publicly." Decoupling them (real
notifications go to the admin-configurable Site Settings value; the
public page no longer prints any raw address at all) satisfies the
requirement without removing the constant's other legitimate uses
(structured data, metadata).

**Spam protection is three independent layers, not one.** A honeypot
(`company` field, off-screen via CSS position rather than
`display:none`, since some bots specifically check for and skip the
latter) catches unsophisticated bots; per-IP rate limiting (reusing
Sprint 5's `checkRateLimit`, keyed per form so a flood on one form
can't lock out the other) catches floods; duplicate-submission
detection (same email + same message text within 2 minutes) catches
double-clicks and flaky-network retries, which aren't spam at all but
produce the same symptom — a second, unwanted row.

**The Reply panel is visibly disabled, not hidden.** The brief asks
for a "Future Reply Panel (disabled)" and a "Future Reply Button
(disabled)" specifically — showing them, greyed out, with an
explanatory caption, signals to Ahmad/Jimmy that two-way replies are
coming rather than making the feature invisible until it ships.

## Testing performed

- Verified the migration against the pre-existing seed question:
  correct backfilled reference number, correct new Conversation +
  Message, `reference_counters` seeded to match.
- `npx tsc --noEmit` and `npx eslint src prisma --max-warnings=0` both
  clean across the full change set.

## Recommendations for Sprint 8

1. **Admin replies** — the highest-leverage next step; schema, UI
   shell, and email plumbing are all already in place (see
   `docs/ROADMAP.md`).
2. **Real invite emails**, reusing this sprint's `emailService`/
   template pattern directly.
3. **Finish wiring the public site to the CMS** (`Hero`,
   `AboutPreviewSection`, public `/about`) — still open since Sprint 6.
4. **Shared-store rate limiting** before any multi-instance deployment
   — now used by both auth and the two public forms.
5. Set `RESEND_API_KEY` in the production environment before relying
   on any of this sprint's email delivery.
