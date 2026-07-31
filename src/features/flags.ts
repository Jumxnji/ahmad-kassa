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
} as const;

export type FeatureFlag = keyof typeof features;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}
