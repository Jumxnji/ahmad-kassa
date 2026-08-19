import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { BookCover } from "@/components/media/book-cover";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { bookService } from "@/services/book.service";
import { homepageService } from "@/services/homepage.service";
import { isFeatureEnabled } from "@/features/flags";

/**
 * Leads with whichever book the Homepage editor picked as "Featured" —
 * falling back to the newest published title if none is set (or the
 * picked one has since been unpublished), so this section never goes
 * empty as the catalog grows past one book. Given the luxury-publication
 * treatment and promoted to right after the hero — this is the site's
 * strongest real asset.
 */
export async function FeaturedBookSection() {
  const homepage = await homepageService.get();
  const book = await bookService.resolveFeatured(homepage?.featuredBookId);

  if (!book) return null;

  const directBookSales = isFeatureEnabled("directBookSales");

  const publicationYear = book.publicationDate
    ? new Date(book.publicationDate).getFullYear()
    : null;
  const caption = [book.category, publicationYear].filter(Boolean).join(" · ");

  return (
    <Section tone="alt" size="lg">
      <ScrollReveal className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.62fr)_1fr] lg:gap-24">
        <div className="mx-auto w-full max-w-xs lg:max-w-md">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-110 rounded-full opacity-70"
              style={{
                backgroundImage:
                  "radial-gradient(60% 60% at 50% 45%, var(--gold-50) 0%, transparent 75%)",
              }}
            />
            <BookCover title={book.title} size="lg" cover={book.coverImage} />
          </div>
          {caption && (
            <p className="mt-4 text-center text-xs tracking-[0.14em] text-stone-500 uppercase lg:text-left">
              {caption}
            </p>
          )}
        </div>

        <div className="text-center lg:text-left">
          <Eyebrow>The featured book</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-lg text-4xl sm:text-5xl lg:mx-0">
            {book.title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-stone-600 lg:mx-0">
            By {book.authorName}
          </p>
          <p className="mx-auto mt-6 max-w-lg font-display text-xl italic leading-relaxed text-muted-foreground text-balance lg:mx-0">
            {book.excerpt}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
            <Button asChild variant="gold" size="xl">
              <Link href={`/books/${book.slug}`}>Learn more</Link>
            </Button>
            {book.amazonUrl && (
              <Button asChild variant="outline" size="xl">
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                  Buy on Amazon
                </a>
              </Button>
            )}
            {directBookSales && book.directPurchaseUrl && (
              <Button asChild variant="ghost" size="xl">
                <a href={book.directPurchaseUrl} target="_blank" rel="noopener noreferrer">
                  Purchase direct
                </a>
              </Button>
            )}
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}
