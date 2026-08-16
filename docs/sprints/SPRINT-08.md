# Sprint 8 — Newsletter Subscriber Management & Announcement Campaigns

Follows Sprints 1–7. Scope: turn the Sprint 3 newsletter stub (a
single `email`/`language`/`subscribed` row, no confirmation step, a
permanently-disabled "New campaign" button) into a real, low-frequency
**announcement** system — confirmed opt-in, a proper unsubscribe flow,
and a full admin Campaigns feature that can actually send. No existing
public page was redesigned and no existing dashboard page was
regenerated from scratch; every existing form, page, and admin route
this sprint touches was extended in place, per the brief.

## Files created

**Database & tokens**
- `prisma/migrations/20260801120000_sprint8_newsletter_campaigns/` —
  see "Database changes" below.
- `src/lib/newsletter-token.ts` — `generateToken()`/`hashToken()` for
  single-use, expiring confirmation tokens; `unsubscribeToken()`/
  `verifyUnsubscribeToken()` for the deterministic, storage-free
  unsubscribe scheme (see "Architecture decisions").
- `src/lib/newsletter-urls.ts` — `confirmUrl()`/`unsubscribeUrl()`,
  kept out of the `"use server"` actions file since every top-level
  export there must itself be an async Server Action.
- `src/lib/normalize-email.ts` — extracted so it's testable without
  pulling in `"server-only"`-guarded service code.
- `src/lib/webhook-signature.ts` — hand-rolled Svix-compatible HMAC
  verification for the Resend webhook.

**Schemas, validators, repositories, services**
- `src/schemas/campaign.schema.ts`, `src/validators/campaign.validator.ts`
- `src/validators/newsletter-settings.validator.ts`
- `src/repositories/campaign.repository.ts`,
  `src/repositories/campaign-recipient.repository.ts`,
  `src/repositories/newsletter-settings.repository.ts`
- `src/services/campaign.service.ts`, `src/services/newsletter-settings.service.ts`
- `src/dashboard/newsletter-constants.ts` — shared status/source label
  + tone maps, used by Overview/Subscribers/detail/Campaigns.

**Actions**
- `src/actions/admin/campaign.actions.ts` — create/update/delete a
  draft, mark ready, render the real preview, send a rate-limited
  test, and `sendCampaignAction` (the real send).
- `src/actions/admin/newsletter-settings.actions.ts`

**Public pages & components**
- `src/app/(site)/newsletter/confirm/page.tsx`,
  `src/app/(site)/newsletter/unsubscribe/page.tsx`
- `src/components/forms/resend-confirmation-button.tsx`,
  `src/components/forms/unsubscribe-flow.tsx`
- `src/components/shared/state-card.tsx` — shared icon/heading/
  description card for both public pages' success/error states.

**Admin pages & components**
- `src/app/admin/(app)/newsletter/subscribers/page.tsx` +
  `[id]/page.tsx` — the Subscribers tab (existing table moved here,
  rebuilt on the new model) and a new individual-subscriber detail
  view.
- `src/app/admin/(app)/newsletter/campaigns/page.tsx` + `[id]/page.tsx`
- `src/app/admin/(app)/newsletter/templates/page.tsx`,
  `src/app/admin/(app)/newsletter/settings/page.tsx`
- `src/dashboard/components/newsletter-tabs.tsx` — the Overview/
  Subscribers/Campaigns/Email Templates/Settings sub-nav.
- `src/dashboard/components/campaign-form.tsx` — the campaign editor
  (Details/Content/Audience/Preview/Test Email/Review & Send tabs,
  autosaved, reusing the existing `RichTextEditor`/`TagsInput`/
  `ConfirmDialog`/`AutosaveIndicator`).
- `src/dashboard/components/new-campaign-dialog.tsx`,
  `src/dashboard/components/campaign-row-actions.tsx`,
  `src/dashboard/components/newsletter-settings-form.tsx`.

**Webhook**
- `src/app/api/webhooks/resend/route.ts`.

**Testing**
- `vitest.config.mts` + `tests/*.test.ts` (5 files, 35 tests) — the
  project's first test framework. See "Testing performed."

## Files substantially changed

- `prisma/schema.prisma`, `prisma/seed.ts` — see "Database changes."
- `src/schemas/newsletter.schema.ts`, `src/validators/newsletter.validator.ts`,
  `src/validators/public/newsletter-form.validator.ts`,
  `src/repositories/newsletter.repository.ts`,
  `src/services/newsletter.service.ts` — full rebuild for the new
  Subscriber model (status/source enums, tokens, confirm/unsubscribe/
  resubscribe state machine).
- `src/actions/public/newsletter.ts` — full rewrite: honeypot → rate
  limit → status-branching subscribe, plus confirm/resend/unsubscribe/
  resubscribe actions.
- `src/actions/admin/newsletter.actions.ts` — rewritten for the new
  status model (unsubscribe/resubscribe/suppress/delete, extended CSV
  export, audit logging).
- `src/components/forms/newsletter-form.tsx` — optional first name,
  honeypot, required `source` prop, on-page consent copy.
- `src/components/sections/newsletter-section.tsx`,
  `src/components/layout/site-footer.tsx`,
  `src/app/(site)/page.tsx`, `src/app/(site)/books/[slug]/page.tsx`,
  `src/app/(site)/courses/page.tsx`, `src/app/(site)/newsletter/page.tsx`
  — each of the 5 existing signup locations now passes its own
  `source`.
- `src/app/admin/(app)/newsletter/page.tsx` — was the Subscribers
  table (moved to `/subscribers`), now the Overview tab.
- `src/app/admin/(app)/page.tsx` — `newsletterService.countSubscribed()`
  → `countActive()`; also fixed three pre-existing implicit-`any`
  callback params surfaced while touching this file (unrelated to
  newsletter, left the fix in since it blocked a clean `tsc`).
- `src/dashboard/components/subscriber-row-actions.tsx`,
  `src/dashboard/components/export-csv-button.tsx` — rebuilt for the
  new status model.
- `src/permissions/permissions.ts` — new `campaigns` resource, new
  `send` action.
- `src/features/flags.ts` — five new flags (see "Deferred features").
- `src/services/email.service.ts` — optional `from`/`text`, returns
  the Resend message id, and a dev-only console preview (subject +
  first link) when Resend isn't configured, so the confirm/unsubscribe
  flow is manually testable without a real API key.
- `src/lib/email/layout.ts` — optional `footerNote` override.
- `src/lib/email/templates.ts` — added `subscriptionConfirmationEmail`,
  `welcomeEmail`, `campaignEmail`, `campaignPlainText`.
- `src/lib/sanitize-rich-text.ts` — added `htmlToPlainText()`.
- `src/lib/format.ts` — added `maskEmail()`.
- `.env.example` — see "Environment variables."

## Database changes

**`NewsletterSubscriber`** (table name unchanged) gained:
`normalizedEmail` (unique), `firstName`, `preferredLanguage`, `status`
(`SubscriberStatus`), `source` (`SubscriberSource`),
`consentTextVersion`, `consentedAt`, `unsubscribedAt`, `updatedAt`,
`lastEmailSentAt`, `emailFailureCount`, `suppressionReason`,
`confirmationTokenHash`, `confirmationTokenExpiresAt`, `metadata`.
`language`/`subscribed` were dropped. No unsubscribe-token column
exists — see "Architecture decisions."

**New `Campaign`**, **`CampaignRecipient`** (per-subscriber delivery
tracking, `@@unique([campaignId, subscriberId])`), and
**`NewsletterSettings`** (singleton, same fixed-id/`.update()`-only
pattern as `SiteSettings`/`HomepageContent`).

**Migration note**: the migration was hand-ordered (like Sprint 7's)
so the new NOT NULL/UNIQUE `normalizedEmail` column could be backfilled
against the one pre-existing seed row before the constraint was
enforced — `lower(trim(email))`, `status` mapped from the old
`subscribed` boolean, `confirmedAt` backfilled to `createdAt`
(grandfathered in as already-confirmed, since they subscribed under
the old single-step form). The migration originally also minted a
placeholder SHA-256 hash for a since-removed `unsubscribeTokenHash`
column; that design was replaced mid-sprint (see below) before the
migration was ever applied to a shared database, so the final
migration file has no trace of it.

## Architecture decisions

**Unsubscribe tokens are derived, not stored.** The first design
generated a random unsubscribe token once at signup, storing only its
hash — mirroring the confirmation-token pattern. That's wrong for this
use case: the raw token is needed to build a working unsubscribe link
in *every future email* (the welcome email, every campaign), but a
hash-only design means the raw value is gone the moment it's
generated, and no later email could ever construct a valid link again.
The fix: `unsubscribeToken(subscriberId) = HMAC-SHA256(subscriberId)`,
keyed by `NEWSLETTER_TOKEN_SECRET`, recomputed and compared
(`timingSafeEqual`) on every click. Nothing is persisted; the link is
valid for a subscriber's entire lifetime and needs no migration
backfill for existing rows — a strictly better design than the
random-token-plus-hash approach, discovered and corrected before the
schema was applied anywhere shared (see migration note above).

**Delivery is controlled-concurrency individual sends, not
`resend.batch.send()`.** The installed SDK's batch endpoint was
reviewed. It was rejected for the real send path because its
permissive-validation mode returns successes in `data[]` and failures
in a separate `errors[]` keyed by original array index — correlating
that back to *which specific subscriber* failed (needed to mark the
right `CampaignRecipient` row and increment the right subscriber's
`emailFailureCount`) is unreliable once any entries are skipped.
Per-recipient calls through the existing `emailService.send()` (retry
already built in), run in `Promise.all` chunks of 20, give a clean 1:1
result-to-recipient mapping and reuse a code path that's already
tested, at the cost of more HTTP round-trips than one batch call.

**Confirmation tokens stay random + hashed (unlike unsubscribe
tokens).** They must become permanently invalid after one use or after
expiry — a property a deterministic derive-and-compare scheme can't
give you without also persisting a "consumed" flag, at which point
you're storing state anyway. Random generation + a stored hash +
`confirmationTokenExpiresAt`, cleared to `null` on successful confirm,
is the right tool specifically because single-use matters here and
doesn't for the unsubscribe link.

**Send idempotency is two independent guards.** `beginSending()` is a
conditional `UPDATE ... WHERE status IN (DRAFT, READY)` — only one
concurrent "Send now" click can ever flip a given campaign into
`SENDING`; a second click (double-submit, a second browser tab) finds
zero matching rows and fails cleanly with "already sending." Separately,
`CampaignRecipient` rows are snapshotted with a unique
`(campaignId, subscriberId)` constraint before any sending starts, so
even a crash-and-retry of the send loop itself can't double-insert or
double-send — only rows still `PENDING` are ever processed. A `try/catch`
around the send loop finalizes the campaign as `PARTIALLY_FAILED`
(with whatever counts were reached) on any unexpected error, so a
crash never leaves a campaign stuck in `SENDING` with no way to
retry via the UI.

**`campaigns` is its own permission resource, mirroring `ownership`.**
The brief's Editor/Administrator distinction (can prepare and test-send
a campaign, cannot send to the full list) doesn't fit inside the
existing `newsletter` resource, which continues to govern subscriber
management unchanged. A new resource plus a new `send` action, gated
the same way every other `(resource, action)` pair in the codebase is,
avoids a bespoke permission check that would break from the
established `can(role, resource, action)` convention.

**Webhook verification is hand-rolled, not the `svix` package.**
Resend's webhook signing is Svix-compatible (`svix-id`/`svix-timestamp`/
`svix-signature`, HMAC-SHA256 over `${id}.${timestamp}.${body}`, base64
secret after its `whsec_` prefix) — a few lines of `node:crypto`,
matching this project's established preference for small hand-written
utilities (`src/lib/csv.ts`) over a dependency for something this
size.

**No separate processed-webhook-event-id table.** Applying a bounce/
complaint event twice (setting an already-`SUPPRESSED` subscriber to
`SUPPRESSED` again, marking an already-`FAILED` recipient `FAILED`
again) is a no-op end state. Idempotent processing was achieved by
writes that are naturally idempotent, not by tracking which event ids
have already been seen.

## Deferred features (flagged off, with why)

Per the brief's own explicit allowance to defer the highest-risk/
lowest-value pieces behind documented, disabled UI:

- **`newsletterScheduling`** — `Campaign.scheduledFor` exists and the
  editor shows a disabled "Schedule for later" control with a tooltip.
  Building it for real needs a Vercel Cron route + `CRON_SECRET`,
  which needs a real deployment target to configure and verify — see
  `docs/DEPLOYMENT.md`.
- **`newsletterImports`** — no CSV import UI. There's no legitimate,
  consented list to import yet, and the brief explicitly prohibits
  importing purchased/scraped lists. Intended architecture (preview →
  column mapping → validation → dedup → explicit consent confirmation
  → import summary/rejection report → audit log) is documented here,
  not built.
- **`newsletterPreferences`** — no granular preference center; V1 has
  one binary subscribed/unsubscribed state, matching what the existing
  UI can cleanly support.
- **`newsletterSegmentation`** — the Audience tab's segment dropdown
  is visible but disabled; V1 only ever sends to "all active."
- **`newsletterAnalytics`** — Resend open/click tracking is off by
  default; no engagement numbers are shown anywhere.

## Testing performed

- `npx tsc --noEmit` and `npx eslint src prisma --max-warnings=0` both
  clean across the full change set.
- `npx vitest run` — 35 tests across 5 files, all passing: email
  normalization, token generation/hashing/expiry, unsubscribe-token
  derivation and verification (including rejecting a token issued for
  a different subscriber and garbage input), webhook signature
  verification (valid, tampered payload, wrong secret, garbage header,
  multi-signature rotation), `can()` for the new `campaigns` resource
  across all four roles, CSV cell escaping, and campaign/subscriber
  status-transition membership rules.
- Manual, live-browser (and direct HTTP/DB) verification of the full
  golden path: signup with a first name and source-tagged form →
  confirmation email logged via the new dev-preview line (no
  `RESEND_API_KEY` locally, same graceful-failure pattern as Ask
  Ahmad/Contact) → clicked confirm link → `ACTIVE` + welcome email
  logged → unsubscribe link → masked-email confirm screen → confirmed
  unsubscribe → admin-side resubscribe (toast + live row update) →
  admin Subscribers table filters/CSV/status actions → created a
  campaign → autosave confirmed ("All changes saved") → rich-text
  content + "Generate from content" plain-text button → Preview tab
  rendered the real branded template (logo, heading, CTA, footer,
  unsubscribe link, plain-text version) at desktop width → Review &
  Send showed the real live subscriber count → sent for real against
  the seeded subscriber (no `RESEND_API_KEY`, so it landed correctly
  in `PARTIALLY_FAILED` with `CampaignRecipient.status = FAILED`,
  `subscriber.emailFailureCount` incremented, and the editor correctly
  became read-only) → Resend webhook endpoint tested directly with a
  hand-signed request against a synthetic `CampaignRecipient`, verified
  it flips to `FAILED`/subscriber to `BOUNCED`, and verified an invalid
  signature is rejected with 401. Test rows were cleaned up afterward.

## Manual setup required before this goes live

- Set `RESEND_API_KEY` in production (still outstanding since Sprint
  7 — nothing here sends without it).
- Set `NEWSLETTER_TOKEN_SECRET` (required — peppers every confirmation
  token hash and every unsubscribe token; generate with
  `openssl rand -base64 32`).
- Set `RESEND_WEBHOOK_SECRET` after creating the webhook in the Resend
  dashboard pointed at `POST /api/webhooks/resend` (subscribe to
  `email.bounced` and `email.complained` at minimum) — see
  `docs/DEPLOYMENT.md`.
- Verify the sending domain in Resend and set `RESEND_FROM_EMAIL`/
  `RESEND_REPLY_TO_EMAIL` (or edit sender identity directly from
  `/admin/newsletter/settings` after first deploy).
- Set `NEXT_PUBLIC_SITE_URL` if the deployment's real URL differs from
  the hardcoded `siteConfig.url` constant (e.g. a preview deployment).
- Have legal review the on-page consent copy
  (`src/components/forms/newsletter-form.tsx`) and the compliance
  footer text before this is genuinely relied on for UK GDPR/PECR
  purposes — this sprint implements the *architecture* (confirmed
  opt-in, consent versioning, unsubscribe-everywhere, suppression) but
  the actual wording hasn't had a legal pass.

## Recommendations for Sprint 9

1. **Vercel Cron + scheduled sending** — the highest-leverage next
   step now that campaigns can actually send; `scheduledFor` and the
   disabled UI are already in place.
2. **CSV import**, once there's a real, consented list to bring in —
   architecture is documented above.
3. **Shared-store rate limiting** (Sprint 7's outstanding item) —
   now used by newsletter signup/resend/test-send too, on top of auth
   and the two public forms.
4. Consider whether `resend.batch.send()` is worth revisiting once
   list sizes grow large enough that per-recipient HTTP round-trips
   become the bottleneck — the correlation problem documented above
   would need a different tracking approach (e.g. matching by a
   client-supplied idempotency key per batch entry, if Resend exposes
   one) rather than relying on response-array position.
5. Set `RESEND_API_KEY`/`RESEND_WEBHOOK_SECRET`/`NEWSLETTER_TOKEN_SECRET`
   in production — see "Manual setup required" above.
