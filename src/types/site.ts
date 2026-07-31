export interface SocialLink {
  readonly platform: "youtube" | "instagram" | "tiktok" | "x" | "facebook";
  readonly label: string;
  readonly href: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly shortName: string;
  readonly tagline: string;
  readonly description: string;
  readonly url: string;
  readonly ogImage: string;
  readonly twitterImage: string;
  readonly contactEmail: string;
  readonly socialLinks: readonly SocialLink[];
}
