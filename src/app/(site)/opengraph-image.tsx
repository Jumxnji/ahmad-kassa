import { renderBrandedOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";
import { siteConfig } from "@/config/site";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = siteConfig.name;

export default function Image() {
  return renderBrandedOgImage({ eyebrow: siteConfig.tagline, title: siteConfig.name });
}
