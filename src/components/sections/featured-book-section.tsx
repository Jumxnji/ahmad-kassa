import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { BookCover } from "@/components/media/book-cover";
import { getFeaturedBook } from "@/lib/data/books";

export function FeaturedBookSection() {
  const book = getFeaturedBook();

  return (
    <Section tone="alt">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.7fr)_1fr] lg:gap-20">
        <BookCover title={book.title} size="lg" className="mx-auto max-w-[16rem] lg:max-w-none" />

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
            <Button variant="ghost" size="lg" disabled title="Coming soon">
              Purchase direct
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
