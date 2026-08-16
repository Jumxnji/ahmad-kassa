import { renderBrandedOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";
import { getArticleBySlug } from "@/lib/data/articles";

export const size = ogImageSize;
export const contentType = ogImageContentType;

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: OgImageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return renderBrandedOgImage({
    eyebrow: "Article",
    title: article?.title ?? "Ahmad Mohamed Kassa",
  });
}
