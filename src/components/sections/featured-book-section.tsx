import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { BookCover } from "@/components/media/book-cover";
import { bookService } from "@/services/book.service";
import { homepageService } from "@/services/homepage.service";
import { isFeatureEnabled } from "@/features/flags";

/**
 * Leads with whichever book the Homepage editor picked as "Featured" —
 * falling back to the newest published title if none is set (or the
 * picked one has since been unpublished), so this section never goes
 * empty as the catalog grows past one book.
 */
export async function FeaturedBookSection() {
  const homepage = await homepageService.get();
  const book = await bookService.resolveFeatured(homepage?.featuredBookId);

  if (!book) return null;

  const directBookSales = isFeatureEnabled("directBookSales");

  return (
    <Section tone="alt">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.7fr)_1fr] lg:gap-20">
        <BookCover
          title={book.title}
          size="lg"
          cover={book.coverImage}
          className="mx-auto max-w-[16rem] lg:max-w-none"
        />

        <div>
          <Eyebrow>Featured book</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl">{book.title}</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {book.excerpt}
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="gold" size="lg">
              <Link href={`/books/${book.slug}`}>Learn more</Link>
            </Button>
            {book.amazonUrl && (
              <Button asChild variant="outline" size="lg">
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                  Buy on Amazon
                </a>
              </Button>
            )}
            {directBookSales && book.directPurchaseUrl && (
              <Button asChild variant="ghost" size="lg">
                <a href={book.directPurchaseUrl} target="_blank" rel="noopener noreferrer">
                  Purchase direct
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
