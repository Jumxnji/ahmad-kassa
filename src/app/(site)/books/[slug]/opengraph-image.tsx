import { renderBrandedOgImage, ogImageSize, ogImageContentType } from "@/lib/og-image";
import { bookService } from "@/services/book.service";

export const size = ogImageSize;
export const contentType = ogImageContentType;

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: OgImageProps) {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);

  return renderBrandedOgImage({
    eyebrow: "Book",
    title: book?.title ?? "Ahmad Mohamed Kassa",
    subtitle: book ? `by ${book.authorName}` : undefined,
  });
}
