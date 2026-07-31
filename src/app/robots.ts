import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { siteSettingsService } from "@/services/site-settings.service";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await siteSettingsService.get();

  if (settings?.defaultSeo?.noindex) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${siteConfig.url}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/academy", "/login"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
