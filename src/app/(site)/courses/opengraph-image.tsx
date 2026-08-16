import { renderBrandedOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Courses — Ahmad Mohamed Kassa";

export default function Image() {
  return renderBrandedOgImage({
    eyebrow: "Courses",
    title: "Coming soon",
    subtitle: "Structured lessons from Ahmad Mohamed Kassa, in active development.",
  });
}
