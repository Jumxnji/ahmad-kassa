# Sprint 5 — Authentication, Authorization & User Management

Follows Sprints 1–4 (public website, branding, backend/CMS
architecture, dashboard polish). Scope: make the Admin Dashboard
actually require login — real authentication, database-backed
role-based access control, a secure user-management flow, and the
audit/security architecture to support it — with **no changes to any
public page, and no redesign of the existing UI/design system**. The
public site remains fully open; only `/admin` requires authentication.

## Files created

**Database**
- `prisma/migrations/20260731110116_sprint5_auth/` — adds `passwordHash`
  to `User`; new models `Account`, `Session`, `VerificationToken`,
  `PasswordResetToken`, `AuditLog`.

**Core auth**
- `src/auth.ts` — Auth.js v5 config: Credentials provider, JWT session
  strategy, `@auth/prisma-adapter` attached for future OAuth readiness,
  custom `jwt`/`session` callbacks (role + id propagation, custom
  `token.exp` for "remember me").
- `src/app/api/auth/[...nextauth]/route.ts` — route handler
  (`export const { GET, POST } = handlers`).
- `src/proxy.ts` — Next.js 16's renamed `middleware.ts`. Authenticates
  every `/admin/*` request except the three public auth paths
  (`/admin/login`, `/admin/forgot-password`, `/admin/reset-password`),
  redirecting unauthenticated visitors to `/admin/login` with
  `callbackUrl` + `reason` query params; also does coarse JWT-role
  gating for `/admin/users` and `/admin/settings`.
- `src/types/next-auth.d.ts` — module augmentation for
  `Session.user.{id,role}`, `User.{role,remember}`, `JWT.{id,role}`.
- `src/permissions/current-user.ts` (rewritten) — `getCurrentUser()`
  now calls `auth()` and re-reads the user from Postgres on every call,
  replacing the Sprint 3 stub that always returned the seeded Owner.
- `src/permissions/require-page-access.ts` — `requirePageAccess(resource,
  action="read")`, the Server Component counterpart to the existing
  `requirePermission()` (Server Actions): redirects to `/admin/unauthorized`
  instead of throwing.

**Password & security**
- `src/lib/password.ts` — `hashPassword`, `verifyPassword` (bcryptjs,
  12 rounds), `generateSecurePassword(length=16)` (via `node:crypto`'s
  `randomInt`).
- `src/lib/rate-limit.ts` — `checkRateLimit(key)` / `resetRateLimit(key)`,
  in-memory, 10 attempts per 15-minute window.
- `src/schemas/auth.schema.ts` — `loginSchema`, `forgotPasswordSchema`,
  `passwordPolicy` (min 8 chars, at least one letter and one number),
  `resetPasswordSchema`.

**Actions & services**
- `src/actions/auth/login.ts`, `logout.ts`, `forgot-password.ts`,
  `reset-password.ts`.
- `src/repositories/password-reset-token.repository.ts` +
  `src/services/password-reset.service.ts`.
- `src/repositories/audit-log.repository.ts` +
  `src/services/audit-log.service.ts`.

**UI**
- `src/app/admin/(auth)/layout.tsx` — minimal centered branded layout
  for the auth pages (logo + manuscript divider), `force-dynamic`.
- `src/app/admin/(auth)/login/page.tsx`, `forgot-password/page.tsx`,
  `reset-password/page.tsx`.
- `src/app/admin/(app)/unauthorized/page.tsx` — branded empty state for
  signed-in-but-not-permitted visits.
- `src/components/auth/login-form.tsx`, `forgot-password-form.tsx`,
  `reset-password-form.tsx`.
- `src/dashboard/components/temporary-password-dialog.tsx` — shown once
  after a password is generated (new invite or admin-triggered reset),
  with copy-to-clipboard.

## Files substantially changed

- Route restructure: everything previously directly under
  `src/app/admin/` moved into `src/app/admin/(app)/`, alongside the new
  `src/app/admin/(auth)/` group — route groups don't affect URLs, so no
  existing links needed updating.
- `src/app/admin/(app)/layout.tsx` — added a defense-in-depth
  `if (!user) redirect("/admin/login")` before rendering the dashboard
  shell.
- `src/app/admin/(app)/users/page.tsx` — now calls
  `requirePageAccess("users")`, computes `canManage`/`canInvite` via
  `can()`, and conditionally renders the actions column and Invite
  button so read-only roles (Viewer) don't see controls that would only
  fail server-side. `seo/page.tsx` and `settings/page.tsx` got the same
  `requirePageAccess()` treatment.
- `src/actions/admin/user.actions.ts` — added audit-log calls to
  create/update/delete; added `resetUserPasswordAction(id)`;
  `createUserAction` now returns `{ user, temporaryPassword }`.
- `src/services/user.service.ts` — `create()` now generates and hashes
  a temporary password, returning it once; added `resetPassword(id)`.
- `src/dashboard/components/user-form-dialog.tsx` — shows
  `TemporaryPasswordDialog` after a successful create; button relabeled
  "Create user."
- `src/dashboard/components/user-row-actions.tsx` — added a "Reset
  password" action (available for every user, including Owner).
- `src/dashboard/nav-config.ts` / `sidebar-nav.tsx` — nav items now
  carry a `resource`, and the sidebar filters itself per the signed-in
  user's role via `can()`.
- `src/dashboard/components/dashboard-shell.tsx` — the topbar avatar is
  now a real `DropdownMenu` (name/email + "Log out," wired to
  `logoutAction()`), passes `role` down to both `SidebarNav` instances.
- `prisma/seed.ts` — rewritten to generate/hash a password for any
  seeded user missing one (including backfilling the pre-existing
  Owner row), printing each generated credential exactly once.
- `.env` / `.env.example` — added `AUTH_SECRET`, `AUTH_TRUST_HOST`.
- `next.config.ts` — added a `headers()` function with baseline
  security headers, with an inline comment explaining why CSRF needed
  no custom middleware (see below).

## Architecture decisions

**JWT-only sessions — not a choice, a constraint.** Auth.js's
Credentials provider does not support database sessions, so the
session strategy is JWT throughout. The `Session` model and
`@auth/prisma-adapter` are still wired in, purely so a future OAuth
provider (e.g. for a student portal) can be added later without
re-architecting the session layer.

**Two-tier authorization, by design.** The Sprint 5 brief explicitly
asked for "Middleware should enforce permissions," but middleware-only
enforcement would mean trusting a JWT claim that can go stale between
token refreshes (a suspended account, a demoted role). The resolution:
`src/proxy.ts` does fast, JWT-only role gating for the two most
sensitive routes (`/admin/users`, `/admin/settings`) purely to avoid a
page flash for obviously-unauthorized roles; the actual security
boundary is `getCurrentUser()`, which always re-reads Postgres, used by
`requirePageAccess()` (pages) and `requirePermission()` (actions). Any
future protected route should follow the same pairing, not rely on the
proxy check alone.

**Next.js 16's `proxy.ts`, not `middleware.ts`.** Confirmed via
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
per this project's standing instruction to check the installed docs
before writing code against an unfamiliar API. The practical
consequence: Proxy defaults to the Node.js runtime in Next 16 (unlike
historical middleware, which defaulted to Edge), so the full `auth()`
config — including the Prisma adapter — can be used directly inside
`proxy.ts` without an edge/node config split. Setting an explicit
`export const runtime` in a proxy file throws in Next 16, so none is
set.

**`/admin/*` protected, not `/dashboard/*`.** The Sprint 5 brief
literally said "Protect: /dashboard, /dashboard/*," but
`docs/PROJECT_MEMORY.md` (read first, per the project's own standing
convention) already documents `/dashboard` as reserved for a future
student portal, distinct from the `/admin` CMS. Protected `/admin/*`
instead, and built the new login experience at `/admin/login` — not
`/login`, since the public `/(site)/login` page already exists
untouched as a "student accounts aren't open yet" placeholder. Noted
here for transparency rather than raised as a blocking question, since
the correct interpretation was unambiguous from the project's own
documented conventions.

**"Remember me" via a custom `token.exp` claim.** A JWT strategy only
supports one fixed `session.maxAge`. Rather than pick a single global
session length, the `jwt` callback sets `token.exp` directly at
sign-in: 8 hours by default, 30 days if "remember me" was checked.

**Temporary-password-on-invite, not a real invite email.** Real invite
emails are still postponed (Resend isn't wired in yet — see
`docs/PROJECT_MEMORY.md`). Without a password-setting mechanism,
however, an invited user could never actually log in — the
`authorize()` callback rejects any user with no `passwordHash`. The
fix: `userService.create()` generates a secure random password, hashes
it for storage, and returns the plaintext once, shown to the
inviting Owner/Administrator in a `TemporaryPasswordDialog` for them to
relay manually. The same generation mechanism backs a standalone
"Reset password" action for existing users. This is designed as the
permanent fallback path once real invite emails ship (shown only if
sending fails), not a stopgap to be torn out.

**Audit log as a generic, non-throwing side effect.** `AuditLog` has a
deliberately generic shape — `action: string`, `metadata: Json` — so
any future action can log without a schema migration. The service call
never throws or blocks its parent operation; an audit-log write
failure should never be the reason a login or user edit fails.

**CSRF via framework defaults, not custom middleware.** Next.js Server
Actions already verify the request's Origin header, and Auth.js has its
own CSRF protection for its own routes. A bespoke CSRF token system
would duplicate both without adding real protection — documented
inline in `next.config.ts` so a future contributor doesn't wonder why
there's no explicit CSRF middleware.

## Reusable components worth knowing about

- `getCurrentUser()` / `requirePageAccess()` / `requirePermission()` —
  the only sanctioned way to gate a page or action; never re-check
  `auth()` directly in new code.
- `TemporaryPasswordDialog` — generic enough to reuse for any future
  "show a secret exactly once" UI, not just passwords.
- `checkRateLimit(key)` — generic keyed rate limiter; reusable for any
  future endpoint that needs the same protection (e.g. the contact
  form), not just login/forgot-password.
- `hashPassword` / `verifyPassword` / `generateSecurePassword` — the
  only sanctioned password utilities; never hash or generate a password
  ad hoc elsewhere.

## Technical debt / known gaps

- **Rate limiting is in-memory and single-instance.** Correct for the
  current deployment target, but must move to a shared store (e.g.
  Upstash Redis) before any multi-instance or serverless-concurrent
  deployment, or the limit can be bypassed by landing on a different
  instance.
- **`AuditLog.ipAddress` is a placeholder, not populated.** The
  architecture is ready (model + service accept it), but no caller
  passes a real IP yet — this needs the real hosting target's
  client-IP header confirmed first (e.g. `x-forwarded-for` behind
  Vercel) rather than guessing now.
- **Real invite emails are still not sent** — see
  `docs/PROJECT_MEMORY.md`'s "Features intentionally postponed." The
  temporary-password dialog is the full onboarding path today.
- **The public site still doesn't read from the CMS** — unrelated to
  this sprint's scope, but still the single largest gap in the project;
  see `docs/ROADMAP.md`.

## Testing performed

- Protected routes: confirmed an unauthenticated visit to `/admin/books`
  redirects to `/admin/login?callbackUrl=%2Fadmin%2Fbooks&reason=unauthenticated`,
  and that signing in as Owner lands back on `/admin/books` (the
  originally-requested page), not the generic `/admin` — this
  specifically validates a redirect-priority bug found and fixed during
  QA (see below).
- Role permissions: verified as Viewer that Invite/Edit/Reset/Delete
  controls are hidden on the Users page, and that suspending/restoring
  a user's status via the Owner's Edit dialog is correctly reflected
  in the next login attempt (a suspended account gets the same generic
  "Incorrect email or password" message as a wrong password, so account
  status is never leaked).
- Login/logout: verified sign-in, sign-out via the topbar dropdown, and
  that a expired/invalidated session correctly bounces back to login.
- Password reset: exercised the full forgot-password → reset-password
  flow for a seeded user, confirming the old password stops working
  and the new one succeeds.

### Bug found and fixed during QA

`src/components/auth/login-form.tsx` never actually honored
`callbackUrl` — it read
`router.push(result.data.redirectTo ?? callbackUrl)`, and since
`loginAction`'s `redirectTo` is always truthy, `callbackUrl` was
unreachable dead code. A user redirected to login from, say,
`/admin/books` would always land on the generic `/admin` after signing
in. Fixed by flipping the priority to
`router.push(callbackUrl || result.data.redirectTo)`, and re-verified
live in the browser per the "Testing performed" section above.

## Recommendations for Sprint 6

1. **Wire the public site to the CMS** — carried over from Sprint 4's
   recommendation and now the clear #1 priority; see
   `docs/ROADMAP.md`.
2. **Real invite emails** via Resend, now that the account/password
   plumbing they depend on is in place.
3. **Move rate limiting to a shared store** before any multi-instance
   deployment.
4. **Populate `AuditLog.ipAddress`** once the hosting target is
   confirmed.
