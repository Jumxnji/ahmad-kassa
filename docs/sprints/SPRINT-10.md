# Sprint 10 — QA & Release-Candidate Hardening

Follows Sprints 1–9. Explicit scope per the client's brief: **a QA and
release-candidate sprint, not a feature sprint.** "Do NOT regenerate
pages. Do NOT redesign components. Do NOT introduce major
architectural changes unless they are required to fix genuine issues
discovered during this sprint." "Do not mark something as complete
unless it has actually been tested."

## Audit methodology

Three parallel research passes ran before any code changed:

1. **Permission/security audit** — every exported function in
   `src/actions/admin/*.ts` and `src/actions/public/*.ts`, checked
   against `src/permissions/permissions.ts`'s `can(role, resource,
   action)` table; `src/proxy.ts`'s route-protection list cross-checked
   against every actual admin route; every `[id]` detail page checked
   for a `notFound()` guard.
2. **Responsive/layout/empty-state/error-state audit** — every
   `w-[...]`/`min-w-...` Tailwind utility for fixed-width overflow
   risk; every `<table>`/`<Table>` usage for a scroll wrapper; every
   `Dialog`/`AlertDialog`/`Sheet` for mobile-safe width; every admin
   list page for a real empty state; every route group for branded
   404/500 boundaries; every `<Image>` for layout-shift-safe props.
3. **Dead-code/duplication/code-quality audit** — orphaned files (zero
   imports anywhere), duplicated status-label/tone constants across
   pages, `TODO`/commented-out code, unused exported functions, `>500`
   line components, stray `console.log`, unused npm dependencies.

Baseline before any fix: `tsc --noEmit`, `eslint --max-warnings=0`,
and `vitest run` all already passed cleanly.

**The overwhelming majority of both audits' checklists came back
"already correct, reuses an established pattern"** — a genuinely good
sign for a five-sprint-old codebase, and the reason this sprint's fix
list is short and precise rather than sprawling. Specifically
confirmed already solid, not touched this sprint: every other admin
Server Action's `requirePermission` call; `proxy.ts`'s route list;
every admin page's access check; all four `[id]` pages' 404 handling;
every public form's honeypot + rate limiting; zero fixed-width
overflow risk anywhere; every admin table via `DataTable`'s
`overflow-x-auto` wrapper; every admin list page's `EmptyState`;
`Dialog`/`Sheet` mobile-safety; every `<Image>`'s layout-shift props;
zero unused npm dependencies; zero `TODO`/dead comment blocks; zero
unused imports/locals.

## What was found and fixed

### Security (High priority)

**`resetUserPasswordAction` privilege escalation.**
`src/actions/admin/user.actions.ts` — unlike its siblings
`updateUserAction` and `deleteUserAction` in the same file, this
action had no guard against targeting the Owner account.
`ADMINISTRATOR` holds `users:update` (but not `ownership`), so an
Administrator could call this against the Owner's user id and receive
the plaintext temporary password back in the action result — a full
account-takeover path. Fixed by adding the same guard
`updateUserAction` already used:

```ts
if (existing.role === "OWNER") {
  await requirePermission("ownership", "update");
}
```

**Live-tested, not just reasoned about:** logged in as the seeded
Administrator (`jimmy@ahmadkassa.com`), attempted to reset the seeded
Owner's (`hello@ahmadkassa.com`) password from `/admin/users` — got
"You don't have permission to do that." (confirmed via both the UI
toast and the dev server's `PERMISSION_DENIED` log). Confirmed
Administrator can still reset a non-Owner (Editor) user's password —
unchanged, correct behavior.

### Error/empty/responsive states

- **Admin 404 gap.** No `not-found.tsx` existed under
  `src/app/admin/(app)/`, so a bad id on `/admin/books/[id]`,
  `/admin/ask-ahmad/[id]`, `/admin/newsletter/subscribers/[id]`, or
  `/admin/newsletter/campaigns/[id]` (all of which correctly call
  `notFound()`) fell through to Next's unstyled default 404. Added
  `src/app/admin/(app)/not-found.tsx`, reusing the existing
  `ErrorState` component (same visual language as `error.tsx`) with a
  "Back to dashboard" link. **Live-tested**: navigated to
  `/admin/books/does-not-exist-123`, confirmed the branded page
  renders.
- **`AlertDialogContent` mobile margin.** Lacked the
  `max-w-[calc(100%-2rem)]` base cap `DialogContent` already had —
  the unconditional (non-breakpoint-gated) `max-w-xs`/`max-w-sm` size
  variants meant a 320px viewport rendered the dialog edge-to-edge
  with zero margin. Used everywhere via the shared `ConfirmDialog`
  (delete-book, remove-user, etc. confirms). Fixed by moving the size
  differentiation behind `sm:` and giving the base class the same
  `calc(100%-2rem)` cap `Dialog` uses. **Verified**: confirmed the
  fix compiled and applies correctly at the `sm:`+ breakpoint (384px
  computed width matches `sm:data-[size=default]:max-w-sm`) via a
  direct `getComputedStyle` check in the live browser session; the
  sub-640px branch is straightforward CSS arithmetic
  (`calc(100% - 2rem)`) rather than independently re-verified,
  because the browser automation tool's `resize_window` did not
  reliably resize the actual rendering viewport in this environment
  (confirmed via `window.innerWidth` staying unchanged across several
  resize attempts) — a tool limitation, not an app bug, consistent
  with a similar automation-tool quirk noted in Sprint 9's session.

### Robustness (Low priority, no security implication)

`deleteContactMessageAction`, `deleteQuestionAction`, and
`markQuestionReadAction` were the only three mutating actions in their
respective files that skipped the existence check every sibling
action already performs (`const existing = await xService.get(id); if
(!existing) throw new NotFoundError(...)`). Not a security issue —
Prisma already throws on a missing row regardless — just inconsistent
error UX. Added for consistency.

### Defense-in-depth

The three token-based public newsletter actions
(`confirmNewsletterSubscription`, `unsubscribeFromNewsletter`,
`resubscribeToNewsletter`) were the only public write paths with no
`checkFormRateLimit` call. Token verification itself was already
sound (HMAC/hash comparison via `verifyUnsubscribeToken` and hashed
confirmation tokens), so this wasn't a real vulnerability — added the
same rate limit the sibling `subscribeToNewsletter` already has, for
defense-in-depth against token-guessing floods. On a rate-limit hit,
each action now returns its existing `{ outcome: "invalid" }` variant
rather than a new error shape, so no page/type change was needed.
**Live-tested end-to-end**: submitted a real newsletter signup,
confirmed the confirmation email rendered (dev-preview log), and
exercised the confirm link.

### Email dark-mode rendering

`renderEmailLayout()` (`src/lib/email/layout.ts`) gained `<meta
name="color-scheme" content="light">` and `<meta
name="supported-color-schemes" content="light">` — the standard,
zero-risk way to tell a dark-mode email client this is an
intentionally light navy/gold/paper design rather than something to
auto-invert. The template already used explicit inline
`bgcolor`/`color` throughout (the established Sprint 7 pattern for
Outlook-safety), so this was very unlikely to already be broken, but
the meta tags are the correct explicit signal.

**Honestly scoped**: verified the meta tags render correctly in the
generated HTML (direct template function call, confirmed both tags
present) and that a real send still works end-to-end in dev-preview
mode. **Not independently verifiable in this environment**: actual
rendering inside Gmail/Outlook/Apple Mail's real dark-mode engines,
since that requires a live mailbox and `RESEND_API_KEY` isn't
configured locally (documented as a pre-existing, intentional local
constraint — see `docs/PROJECT_MEMORY.md`'s "Known limitations").

## Code-quality cleanup

- **8 dead files deleted** (zero imports anywhere in `src/`):
  `src/components/sections/pillars-section.tsx`,
  `src/components/cards/pillar-card.tsx`,
  `src/components/cards/pillar-card-skeleton.tsx`,
  `src/components/shared/success-state.tsx`,
  `src/components/ui/navigation-menu.tsx`,
  `src/components/ui/accordion.tsx`, `src/features/feature-gate.tsx`
  (`<FeatureGate>` was never used — every call site checks
  `isFeatureEnabled()` directly, which stays untouched),
  `src/validators/newsletter.validator.ts` (superseded — the real
  subscriber-status actions never adopted it).
- **3 dead exports removed**: `formatPrice` (`src/lib/format.ts`),
  `htmlToPlainText` (`src/lib/sanitize-rich-text.ts`),
  `getCourseBySlug` (`src/lib/data/courses.ts`).
- **Duplicated status-label/tone constants consolidated.** Six call
  sites across `books/page.tsx`, `ask-ahmad/page.tsx`,
  `ask-ahmad/[id]/page.tsx`, `contact/page.tsx`, and
  `contact-detail-sheet.tsx` locally redefined the same kind of
  `STATUS_LABEL`/`STATUS_TONE`/category-label maps instead of reusing
  a shared file — the pattern `newsletter-constants.ts` already
  established. Extracted into `src/dashboard/books-constants.ts`,
  `ask-ahmad-constants.ts`, `contact-constants.ts`. Pure extraction,
  no behavior change — verified via a live round-trip (submitted a
  real Ask Ahmad question, confirmed its category/status badges
  render correctly on both the list and detail pages using the new
  shared constants).
- `tsc --noEmit`, `eslint --max-warnings=0`, `vitest run`, and `next
  build` were all re-run after every deletion, not just once at the
  end, to catch any reference a grep-based dead-code search might have
  missed.

## Explicitly not done this sprint (deliberate, with reasoning)

Per the brief's own "no major architectural changes unless required
to fix a genuine issue" instruction:

- **Moving rate limiting to a shared store.** Already a documented,
  deliberate single-instance limitation (`docs/PROJECT_MEMORY.md`),
  not a bug discovered this sprint — a real infrastructure change
  (e.g. Upstash Redis), not a QA fix.
- **A full RTL/logical-property conversion.** Already documented and
  deferred in Sprint 9 until real multilingual content work starts —
  unchanged this sprint.
- **Splitting `book-form.tsx` (657 lines) / `campaign-form.tsx` (514
  lines).** Large but not tangled or duplicated internally; a
  mechanical split risks introducing regressions in two of the most
  complex forms in the app for a cosmetic benefit, which doesn't meet
  the "required to fix a genuine issue" bar.
- **A shared, multi-param `buildListHref` covering the four admin
  pages that currently hand-roll their own query-preserving URL
  builder** (`ask-ahmad`, `contact`, `media`, `newsletter/
  subscribers`). Each page's actual filter-param shape genuinely
  differs enough (`status`/`category`/`unread` vs. `folder`/`view`)
  that forcing a shared abstraction now would be premature
  generalization, not a fix.
- **Disabling mutating controls (New/Save/Archive/Delete buttons,
  editable fields) in the admin UI for read-only roles.** Confirmed
  live that `VIEWER` can open a full book-edit form or a question's
  detail page and interact with every control, but every underlying
  Server Action correctly rejects the write server-side (`"You don't
  have permission to do that"`) — so this is a real UX rough edge, not
  a security gap. Fixing it properly means a `readOnly`-aware pass
  across every admin form component, which is a cross-cutting UI
  change larger than this sprint's fix-only scope. Recorded in
  `docs/PROJECT_MEMORY.md` as a flagged follow-up.
- **Real Gmail/Outlook/Apple Mail dark-mode rendering verification**
  and a **full 10-breakpoint × every-page responsive sweep.** Neither
  is achievable in this local, no-mailbox, browser-automation-viewport-
  limited environment — see the honesty notes above and below. The
  static audit (zero fixed-width risk found anywhere) plus the
  narrower live checks that were achievable are the actual evidence
  this sprint has for responsive/email correctness, not a claim of
  exhaustive coverage.

## What was live-browser-tested vs. code-reviewed only

**Live-tested** (via `mcp__claude-in-chrome__*` against a running
`next dev` instance, using the seeded Owner/Administrator/Editor/
Viewer accounts):
- The `resetUserPasswordAction` fix, both the blocked case
  (Administrator → Owner) and the still-allowed case (Administrator →
  Editor).
- Role-boundary enforcement: Editor blocked from `/admin/users` and
  `/admin/settings` with the branded "Permission denied" page; a
  Viewer's book-creation attempt correctly rejected server-side
  despite the form being fully interactive.
- The new admin 404 page.
- The `AlertDialogContent` fix's compiled CSS at the `sm:`+ breakpoint.
- Ask Ahmad form: empty-submit validation errors, full submission
  (loading state → success state with reference number), and the
  admin list/detail pages rendering the newly-consolidated status
  constants correctly.
- Newsletter signup: submission → success toast → dev-preview
  confirmation email logged → confirm-link flow (including the
  branded "This link isn't valid" state, triggered honestly by the
  test token having already been consumed once during testing).
- Login flow's disabled/loading button state ("Signing in…").
- `scrollWidth` vs. `innerWidth` overflow checks (no horizontal
  overflow) on the homepage, Books listing, a book detail page, and
  two admin pages at the narrowest viewport width the automation
  environment actually rendered at (606px — see the honesty note on
  `resize_window` above).

**Code-reviewed / verified via direct function calls, not a live
mailbox or literal narrow-viewport screenshot:**
- The two email dark-mode meta tags (confirmed present in generated
  HTML via a direct `subscriptionConfirmationEmail()` call).
- Sub-640px `AlertDialogContent` rendering (CSS arithmetic, not a
  rendered screenshot at exactly 320px).
- The full 10-breakpoint list from the brief (320/375/390/414/768/
  1024/1280/1440/1920/ultra-wide) — only a subset was achievable live;
  the static fixed-width audit is the actual coverage for the rest.

## Self-review checklist

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Clean, before and after every change |
| `npx eslint src prisma --max-warnings=0` | Clean, before and after every change |
| `npx vitest run` | 35/35 passing, before and after every change |
| `next build` | Clean production build, no new/unexpected routes, admin 404 boundary present |
| Live-browser role-boundary testing | Done — see above |
| Live-browser form testing | Done for Ask Ahmad and Newsletter (representative of the shared form/validation/loading/success pattern used by Contact too) |
| Lighthouse / bundle-size audit | Not run — no Lighthouse CLI available in this environment and no production deployment to point it at; the existing `docs/PERFORMANCE.md` caching/indexing/image-negotiation review from Sprint 9 stands unchanged |
| Accessibility audit | Not re-run in full — Sprint 9's pass (`docs/ACCESSIBILITY.md`) stands; this sprint's UI changes (404 page, dialog margin) reuse already-audited components (`ErrorState`, `Dialog`'s pattern) rather than introducing new ones |

## Files changed

**Fixed:** `src/actions/admin/user.actions.ts`,
`src/actions/admin/contact.actions.ts`,
`src/actions/admin/question.actions.ts`,
`src/actions/public/newsletter.ts`, `src/components/ui/alert-dialog.tsx`,
`src/lib/email/layout.ts`.

**Added:** `src/app/admin/(app)/not-found.tsx`,
`src/dashboard/books-constants.ts`, `src/dashboard/ask-ahmad-constants.ts`,
`src/dashboard/contact-constants.ts`.

**Updated (constants consolidation):**
`src/app/admin/(app)/books/page.tsx`,
`src/app/admin/(app)/ask-ahmad/page.tsx`,
`src/app/admin/(app)/ask-ahmad/[id]/page.tsx`,
`src/app/admin/(app)/contact/page.tsx`,
`src/dashboard/components/contact-detail-sheet.tsx`.

**Deleted:** `src/components/sections/pillars-section.tsx`,
`src/components/cards/pillar-card.tsx`,
`src/components/cards/pillar-card-skeleton.tsx`,
`src/components/shared/success-state.tsx`,
`src/components/ui/navigation-menu.tsx`,
`src/components/ui/accordion.tsx`, `src/features/feature-gate.tsx`,
`src/validators/newsletter.validator.ts`.

**Documentation:** `CHANGELOG.md`, `docs/PROJECT_MEMORY.md`,
`docs/ROADMAP.md`, this file.
