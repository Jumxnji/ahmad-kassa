/**
 * Homepage's Latest Khutbah section always wants exactly one primary
 * slot and up to two supporting slots. The admin picks three explicit
 * videos (`HomepageContent.primaryKhutbahId`/`supportingKhutbah1Id`/
 * `supportingKhutbah2Id`), but any of those three can be missing or
 * unpublished at read time (deleted, unpublished, or never set) — the
 * caller resolves each slot to a real published video or `null` first,
 * then this pure function decides the final layout: compress the
 * nulls out and promote the next available slot forward, so the
 * section never shows a broken/empty card. Never invents content —
 * only reorders what's already real and published.
 */
export function resolveFeaturedKhutbahs<T>(
  primary: T | null,
  supporting1: T | null,
  supporting2: T | null
): { primary: T | null; secondary: readonly T[] } {
  const available = [primary, supporting1, supporting2].filter((video): video is T => video !== null);
  const [resolvedPrimary, ...rest] = available;
  return { primary: resolvedPrimary ?? null, secondary: rest.slice(0, 2) };
}
