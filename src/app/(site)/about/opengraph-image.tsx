import { renderBrandedOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "About Ahmad Mohamed Kassa";

export default function Image() {
  return renderBrandedOgImage({ eyebrow: "About", title: "Ahmad Mohamed Kassa" });
}
