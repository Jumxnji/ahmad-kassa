# Deployment

This file didn't exist before Sprint 8 — it's seeded here with what
Sprint 8's newsletter/campaign system and Sprint 9's launch-readiness
work need to actually work in production, not a full generic
deployment guide. Add to it as future sprints introduce their own
deployment-time requirements.

## Environment variables

See `.env.example` for the full, authoritative list with inline comments — this
table mirrors it, grouped by how load-bearing each variable actually is.

### Required in production

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (Prisma, via `@prisma/adapter-neon`'s WebSocket driver — see "Database: Neon over WebSocket" below). Use the **direct** (non-pooled) connection string; this project's Prisma config has no separate `directUrl`, so one value serves both the app and `prisma migrate deploy`. Nothing runs without this. |
| `AUTH_SECRET` | Auth.js v5 — signs/encrypts session JWTs and CSRF tokens. Generate with `openssl rand -base64 32`. Rotating it invalidates every active session (staff get logged out; not user-facing, since the public site has no accounts). |
| `RESEND_API_KEY` (Sprint 7) | Required for any email to actually send — newsletter, Ask Ahmad/Contact confirmations, password reset. Without it, `emailService.send()` fails gracefully (logs, returns `{success:false}`) rather than throwing — see `docs/PROJECT_MEMORY.md`'s Known limitations — but nothing is actually delivered. |
| `NEWSLETTER_TOKEN_SECRET` (Sprint 8) | Peppers confirmation-token hashes and derives unsubscribe tokens. Generate with `openssl rand -base64 32`. Rotating it invalidates every pending confirmation link and every previously-sent unsubscribe link. |

### Required only if the corresponding feature is actually used

| Variable | Purpose |
|---|---|
| `AUTH_TRUST_HOST` | Set `true` in any environment without a fixed canonical URL configured (local dev, preview deployments). Needed for Auth.js to trust the request's `Host` header rather than a hardcoded value. |
| `RESEND_WEBHOOK_SECRET` (Sprint 8) | Verifies `POST /api/webhooks/resend`'s signature. Required only for bounce/complaint suppression to work — copy from the webhook's "Signing Secret" in the Resend dashboard. Without it, the webhook route rejects every request (401/500), which is safe-by-default but means suppression silently doesn't happen if forgotten. |
| `RESEND_FROM_EMAIL` / `RESEND_REPLY_TO_EMAIL` (Sprint 8) | Default newsletter sender/reply-to — both are overridden by `/admin/newsletter/settings` once saved there, so these are really just first-boot defaults, not a hard requirement once the admin form is filled in. `RESEND_FROM_EMAIL` must be on a domain verified in Resend. |

### Optional

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL for **every** canonical/OG/sitemap/robots/confirmation/unsubscribe link (Sprint 9 extended this beyond just newsletter links). Falls back to the hardcoded `ahmadkassa.com` domain in `siteConfig.url` if unset — set explicitly once the real deployment URL differs (a preview deployment, or before the production domain is connected). |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` (Sprint 9) | Search Console / Bing Webmaster Tools ownership verification — the "content" value from each provider's HTML meta-tag method. Add once the production domain is connected and you're ready to verify it. |

### Reserved — future, inert scaffold (do not set in production yet)

These exist in `.env.example` because the schema/architecture is ready for the
feature, **not** because the feature is live. Setting one of these does not turn
anything on by itself — each also needs its feature flag flipped in
`src/features/flags.ts`, and in Stripe's case, real integration work that hasn't
started. Don't imply otherwise in any deployment runbook.

| Variable | Purpose |
|---|---|
| `CRON_SECRET` | Reserved for once `features.newsletterScheduling` ships — will protect a future `POST /api/cron/send-scheduled-campaigns` route from being triggered by anyone but Vercel Cron. No cron route exists yet. |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Reserved for `features.stripe`/`features.directBookSales` — currently disabled input fields in the Book editor only (see `docs/PROJECT_MEMORY.md`'s "Features intentionally postponed"). No Stripe SDK call, checkout session, or webhook handler exists anywhere in the codebase yet — this is a placeholder for future integration work, not a live payments path. |

`@vercel/analytics` (Sprint 9) needs no environment variable at all —
it's zero-config and activates automatically once deployed on Vercel.

## Database: Neon over WebSocket, not raw TCP

The app connects to Postgres via `@neondatabase/serverless` +
`@prisma/adapter-neon` (`src/db/client.ts`, both seed scripts) — a
WebSocket connection — rather than `@prisma/adapter-pg`'s plain TCP
connection. This is Prisma/Neon's own current recommended pattern for
serverless runtimes (Vercel Functions included), not a one-host
workaround: it lets many concurrent, short-lived function invocations
share Neon's built-in connection pooler instead of each opening a
fresh Postgres connection. Confirmed directly against the installed
`@prisma/adapter-neon` package's own README (v7.9.1), not just a blog
post.

On Vercel specifically, set the `DATABASE_URL` environment variable to
Neon's **pooled** connection string (the one with `-pooler` in the
hostname) — that's the string the running app actually queries with.

Consequence: this ties the app to Neon (its serverless driver only
proxies to Neon's own infrastructure) rather than "any managed Postgres
provider" — accepted deliberately, since Neon is the chosen production
database, not an oversight.

**Prisma Migrate is unaffected by, and unaware of, this adapter.** The
CLI (`prisma migrate deploy`, `prisma db seed` via `prisma.config.ts`)
has no concept of driver adapters at all — confirmed by reading
`@prisma/config`'s types and `prisma migrate deploy --help`, neither
mentions "adapter" anywhere. The CLI always connects directly using
the plain `DATABASE_URL` it's given. **Run migrations and seeding with
Neon's *direct* (unpooled, no `-pooler` in the hostname) connection
string, from local dev or CI** — never against the pooled string, and
never as part of the Vercel build/runtime itself. Vercel's build step
should run `prisma generate` (pure codegen, no DB connection needed)
but not `prisma migrate deploy`.

## Search engine setup (once the domain is connected)

1. Set `NEXT_PUBLIC_SITE_URL` to the real production URL.
2. Add the site in Google Search Console and Bing Webmaster Tools;
   set `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION` to each
   provider's verification value and redeploy.
3. Submit `https://<your-domain>/sitemap.xml` in both consoles.
4. Spot-check social sharing previews against the new dynamic OG
   images (`docs/SEO.md`) using Facebook's Sharing Debugger and
   Twitter's Card Validator — both re-fetch the page, so this also
   confirms the OG image routes resolve correctly from the public
   internet, not just localhost.

## Resend setup

1. **Verify a sending domain** in the Resend dashboard before setting
   `RESEND_FROM_EMAIL` to an address on it — an unverified domain's
   sends will fail or land in spam.
2. **Create a webhook** pointed at
   `https://<your-domain>/api/webhooks/resend`, subscribed to at least
   `email.bounced` and `email.complained` (the two events
   `src/app/api/webhooks/resend/route.ts` currently processes — see
   `docs/sprints/SPRINT-08.md` for why open/click events are
   intentionally not subscribed to). Copy the webhook's signing secret
   into `RESEND_WEBHOOK_SECRET`.
3. Confirm the webhook endpoint responds `200 {"received":true}` to a
   real test event from the Resend dashboard's "Send test event"
   button before relying on it.

## Newsletter scheduling (not yet built)

`features.newsletterScheduling` is off. To build it:

1. Add a Vercel Cron entry (via `vercel.ts` — see the project's Vercel
   plugin context for the current recommended config shape) hitting a
   new route (e.g. `POST /api/cron/send-scheduled-campaigns`) on
   whatever interval scheduled sends need (every few minutes is
   typical).
2. Protect that route by checking a `CRON_SECRET` bearer token/header
   Vercel Cron sends, matching an env var of the same name.
3. The route's job: find `Campaign` rows with `status = SCHEDULED` and
   `scheduledFor <= now()`, and call the same send logic
   `sendCampaignAction` uses (`campaignService.beginSending()` +
   the per-recipient send loop) — the idempotency guards already in
   place (conditional status transition, unique recipient rows) work
   identically whether triggered by a click or a cron tick.
4. Decide and document timezone handling explicitly — store
   `scheduledFor` as UTC (already the case, Prisma `DateTime` columns
   are UTC) and only convert for display in the campaign editor.
5. Flip `features.newsletterScheduling` to `true` and enable the
   "Schedule for later" control in `campaign-form.tsx` once the above
   is verified end-to-end against a real deployment (this can't be
   meaningfully tested in local dev, since Vercel Cron doesn't run
   locally).
