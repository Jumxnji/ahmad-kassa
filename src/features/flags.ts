/**
 * Feature flags — the single switchboard for functionality that has
 * architecture prepared (or will) but isn't live in V1. A flag here
 * means "don't render the nav item / route / UI for this yet," not
 * "the code doesn't exist." Flip to `true` when a feature is ready to
 * ship; nothing else about how the feature was built should need to
 * change.
 *
 * Deliberately NOT modelled at all yet (no DB tables, no routes):
 * courses, articles, events, student portal, direct book sales,
 * Stripe, multilingual. Adding each follows the same
 * schema → validator → repository → service → action pattern used
 * throughout src/ — see README notes in each of those folders.
 */
export const features = {
  courses: false,
  articles: false,
  events: false,
  studentPortal: false,
  directBookSales: false,
  stripe: false,
  multilingual: false,
  analytics: false,
  // Sprint 8 — newsletter campaigns: drafting, preview, test-send, and
  // sending to the active list are all real and unflagged (gated by
  // the `campaigns` permission instead). Only the pieces that need
  // infrastructure this project doesn't have yet stay behind a flag —
  // see docs/sprints/SPRINT-08.md for what's blocking each one.
  newsletterScheduling: false, // needs a configured Vercel Cron job
  newsletterImports: false, // no legitimate list to import yet
  newsletterPreferences: false, // no granular preference-center UI built
  newsletterSegmentation: false, // V1 audience is always "all active"
  newsletterAnalytics: false, // open/click tracking left off by default
} as const;

export type FeatureFlag = keyof typeof features;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}
