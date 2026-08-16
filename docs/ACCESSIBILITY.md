# Accessibility

Reference for the accessibility patterns already in place and the
known gaps not yet closed. Read this before adding a new interactive
component or a new animation.

## What's already solid — reuse, don't reinvent

- **Skip link** — `src/app/layout.tsx` renders one `<a href="#main-
  content">`, and both `(site)/layout.tsx` and the admin
  `dashboard-shell.tsx` render `<main id="main-content">`. Covers both
  the public site and the dashboard from one place.
- **Form primitives** (`src/components/ui/form.tsx`) already wire
  `FormLabel`'s `htmlFor`, `FormControl`'s `aria-invalid`/
  `aria-describedby`, and (since Sprint 9) `FormMessage`'s
  `role="alert"` when showing a validation error. Use `FormField`/
  `FormLabel`/`FormControl`/`FormMessage` for any new form field —
  don't hand-roll label/input association.
- **Radix-based `Dialog`/`AlertDialog`/`Sheet`** handle focus trap,
  return-to-trigger, and Escape-to-close natively — don't add custom
  focus-management logic on top of them.
- **Public nav landmarks** are correctly labeled
  (`aria-label="Primary"` desktop, `"Mobile"` in the sheet) — the
  admin dashboard's `SidebarNav`/`<aside>` match this as of Sprint 9.
- **One `<h1>` per route** — every page (public and admin) follows
  this; keep it that way. `StateCard` (used by the newsletter confirm/
  unsubscribe pages) renders an `<h1>` unconditionally — only compose
  it into a page that has no other heading competing for that role.
- **Reduced motion** — `globals.css` has a global CSS fallback
  (zeroes `animation-duration`/`transition-duration` for
  `prefers-reduced-motion: reduce`), which covers CSS transitions but
  not Framer Motion's JS-driven animations. Every Framer Motion usage
  must call `useReducedMotion()` and provide an equivalent static
  state — see `(site)/template.tsx`, `hero.tsx`, `loading-screen.tsx`,
  and `reading-progress-bar.tsx` for the pattern (skip the animated
  `initial`, or skip the spring/`repeat`, when `shouldReduceMotion` is
  true).
- **`ScrollReveal`** (`src/components/shared/scroll-reveal.tsx`, Sprint
  11) — the same `useReducedMotion()` guard, packaged as a small client
  island so an `async` Server Component section (data-fetching,
  server-only) can still get a scroll-triggered fade-up without itself
  becoming a Client Component. Currently wraps the homepage's About
  Preview, Featured Book, Teaching Areas, and CTA sections (`page.tsx`
  section components) — use this instead of hand-rolling a new
  `whileInView` + `useReducedMotion` pair in any future Server
  Component section.

## RTL / logical properties

`src/config/i18n.ts`'s `isRtl()`/`rtlLocales` are real but currently
always resolve to `false`/`"ltr"` (`defaultLocale = "en"`,
`features.multilingual = false`). The root layout's `<html dir=...>`
is wired to them (Sprint 9), so the mechanism is genuine — it just has
nothing to flip yet.

**Use logical Tailwind utilities in any new component**: `ps-*`/`pe-*`
(padding-inline-start/end) instead of `pl-*`/`pr-*`, `ms-*`/`me-*`
instead of `ml-*`/`mr-*`, `text-start`/`text-end` instead of
`text-left`/`text-right`. Symmetric utilities (`px-*`, `py-*`, `mx-*`)
need no change — they're already direction-agnostic. `Button`'s icon
slots (`src/components/ui/button.tsx`) are the reference example: named
`data-icon="inline-start"/"inline-end"` but were implemented with
physical `pl-*`/`pr-*` until Sprint 9 fixed them to `ps-*`/`pe-*` —
renders identically in LTR, but is now actually correct if the page is
ever rendered RTL.

**Remaining physical-utility hotspots** — deferred, same reasoning as
above: real conversion work, held until `features.multilingual` is
actually being built, not "prepare architecture only." This section
used to pin exact counts from the Sprint 9 audit (e.g. "`left-*`
(23)"), but every sprint since has added components, and Sprint 11
alone added several new sections — a hardcoded count goes stale within
a sprint or two and becomes actively misleading (a future session
trusting a two-sprint-old number instead of checking reality). Use
this reproducible command instead of a stored count whenever the real
number matters:

```sh
rg -o --no-filename '\b(left|right|pl|pr|ml|mr)-[a-z0-9.\[\]/]+' src/components src/app \
  | sort | uniq -c | sort -rn
# or, for the two text-alignment utilities:
rg -o --no-filename '\btext-(left|right)\b' src/components src/app | sort | uniq -c
```

These are spread across shadcn `ui/` primitives (`accordion.tsx`,
`table.tsx`, `alert-dialog.tsx`, `alert.tsx`, and others) and feature
components with icon/badge layouts, as of the Sprint 9 audit — spot
check that's still roughly where they cluster before starting a
conversion pass, don't assume. When multilingual work actually starts:
run the command above, convert file by file alongside adding real
translated content — don't do a mechanical global find-replace, since
some `left-*`/`right-*` usage is genuinely positional (e.g. an
absolutely-positioned decorative element) rather than
reading-direction-dependent, and those should stay physical.

## Forms — `autoComplete`

Real user-identity fields (name, email) should set `autoComplete`
(WCAG 1.3.5 Identify Input Purpose) — `"name"`, `"email"`,
`"given-name"`, `"current-password"`, `"new-password"` as
appropriate. All public forms (Ask Ahmad, Contact, Newsletter) and all
auth forms (login, forgot/reset password) do this as of Sprint 9 —
match it on any new form field that maps to one of the [WHATWG
autofill field names](https://html.spec.whatwg.org/multipage/
form-control-infrastructure.html#autofill-detail-tokens). Honeypot
fields should set `autoComplete="off"` (see `ask-form.validator.ts`'s
`company` field for the pattern) so browsers never try to fill them.

## Color contrast

Design tokens live in `src/app/globals.css` (`:root` CSS variables) —
`src/config/brand.ts` mirrors the same palette (reconciled to match in
Sprint 9) for `theme-color`/manifest/favicon metadata specifically.
Key combinations already hand-verified: `.text-eyebrow` uses
`gold-700` (not `gold-600`) specifically because it meets WCAG AA
4.5:1 against paper backgrounds at that size — see the inline comment
on that utility before changing it. Any new gold-on-paper or
stone-on-navy text combination should be checked the same way.

## Testing approach

No automated accessibility testing tool (axe, pa11y, Lighthouse CI) is
installed — this project's verification method throughout has been
manual: keyboard-only navigation, OS-level reduced-motion toggling,
and screen-reader spot checks via the live browser, alongside
`tsc`/`eslint`/`vitest`/`next build`. Adding `@axe-core/react` or
similar is a reasonable Sprint 10+ addition if a dedicated a11y pass is
ever prioritized — don't add a large testing dependency purely to
generate a score, per this project's general "don't add unnecessary
dependencies" convention.
