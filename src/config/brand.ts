export const brand = {
  name: "Ahmad Mohamed Kassa",
  shortName: "AMK",
  domain: "https://ahmadkassa.com",

  // Matches the real on-page design tokens in src/app/globals.css
  // (--navy-900, --gold-500, --paper-50, --ink-900, --stone-600) —
  // used for theme-color/manifest/favicon metadata, which must
  // reflect the actual site, not an earlier approximation.
  colors: {
    primary: "#0f1e33",
    accent: "#b8924a",
    background: "#faf8f3",
    text: "#17181c",
    muted: "#706c63",
  },

  social: {
    youtube: "",
    instagram: "",
    tiktok: "",
  },

  // No `primary` (flattened lockup) entry — deliberately removed. The
  // site composes the mark + wordmark live (see `Logo`,
  // `public/brand/README.md`'s "digital lockup" policy) rather than
  // shipping a single flattened lockup file.
  logo: {
    mark: "/brand/logo-mark.svg",
    favicon: "/brand/favicon.svg",
  },
} as const;

export type Brand = typeof brand;
