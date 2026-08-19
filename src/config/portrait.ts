/**
 * The canonical, currently-approved professional portrait of Ahmad
 * Mohamed Kassa (Sprint 17). Update this one constant to swap in a future
 * approved photograph — every call site (`PortraitFrame` and its
 * consumers, `HeroPortrait`/Mode B, `AboutPreviewSection`) reads from
 * here rather than hardcoding a path, so nothing else needs to change.
 *
 * Source: `portrait-source/ahmad-mohamed-kassa-headshot-original.png`
 * (untouched original, kept outside `public/` — same provenance
 * convention as `brand-source/`). `hero`/`about` below are crops derived
 * from that one source, not independently commissioned photographs.
 */
export const CURRENT_PORTRAIT = {
  hero: {
    src: "/portraits/ahmad-mohamed-kassa-hero.jpg",
    width: 880,
    height: 880,
  },
  about: {
    src: "/portraits/ahmad-mohamed-kassa-about.jpg",
    width: 1122,
    height: 1402,
  },
  alt: "Portrait of Ahmad Mohamed Kassa",
} as const;
