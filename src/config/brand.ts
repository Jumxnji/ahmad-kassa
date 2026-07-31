export const brand = {
  name: "Ahmad Mohamed Kassa",
  shortName: "AMK",
  domain: "https://ahmadkassa.com",

  colors: {
    primary: "#0B1F36",
    accent: "#C6A15B",
    background: "#FAFAF8",
    text: "#111111",
    muted: "#6B7280",
  },

  social: {
    youtube: "",
    instagram: "",
    tiktok: "",
  },

  logo: {
    primary: "/brand/logo-primary.svg",
    mark: "/brand/logo-mark.svg",
    favicon: "/brand/favicon.svg",
  },
} as const;

export type Brand = typeof brand;
