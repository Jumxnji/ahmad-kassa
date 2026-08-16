# Sprint 12 — Creative Direction & Design System

*Written retrospectively during Sprint 13's documentation reconciliation. This
sprint happened before Sprint 13, immediately after Sprint 11 — nothing here was
performed during the reconciliation pass.*

Following Sprint 11's homepage redesign, the client stopped further visual work to
establish permanent creative governance first: *"Stop. Do not redesign the homepage
yet... I want to establish a permanent creative direction for the entire website...
This sprint is documentation, thinking and visual direction only. Do NOT write code
yet."*

## Scope

Documentation and governance only. No code changed in this sprint.

## What was decided

The project already had `docs/DESIGN_SYSTEM.md`, `docs/BRAND_USAGE.md`, and
`docs/UX_ARCHITECTURE.md` before this sprint. Rather than add a fourth,
possibly-overlapping `BRAND_SYSTEM.md` document, the client chose a two-document
split with a single, explicit rule for where a given piece of guidance belongs:

> CREATIVE_DIRECTION.md explains WHY decisions are made. DESIGN_SYSTEM.md explains
> HOW those decisions are implemented... There should only ever be one source of
> truth for implementation details.

## Deliverables

- **`docs/CREATIVE_DIRECTION.md`** (new, ~440 lines) — the permanent WHY: voice and
  positioning (editorial, clean, warm, quiet luxury, timeless; Ahmad Mohamed Kassa
  perceived as a respected, knowledgeable man, never branded "Scholar" or "Sheikh"),
  audience (a general Muslim audience seeking knowledge), colour philosophy (deep
  navy, warm gold, ivory — no additional accent colour), motion philosophy (mostly
  subtle appearance/reveal, selective interactive detail only where it genuinely
  improves the experience), and the explicit framing that the professional emblem
  "is not an illustration" — it's the core visual language of the brand, and every
  spacing/line-break/alignment/divider/transition decision should feel intentional
  in light of that.
- **`docs/DESIGN_SYSTEM.md`** (revised in place) — established as the single
  implementation source of truth: the full token system, typography rules (including
  Quote/Emphasis treatment), "The Mark as a Design Language" (Section 10 — an
  implementation table of every real mark placement across the site, plus the
  `tailwind-merge` `bg-` prefix gotcha discovered in Sprint 11), and a Motion
  implementation note (Section 11) cross-referencing `docs/ACCESSIBILITY.md` and
  `docs/ARCHITECTURE.md` rather than duplicating their content.

## Governance rule this sprint established, and that Sprint 13 preserved

One source of truth per rule, no duplicated guidance between the two documents — the
philosophy behind a decision lives in `CREATIVE_DIRECTION.md`, the implementation
detail lives in `DESIGN_SYSTEM.md`, and cross-references connect them rather than
repeating content. No third brand document. This split is treated as a fixed
constraint by every sprint since, including Sprint 13's reconciliation work, which
reviewed both documents for contradictions but made no unforced changes to either.
