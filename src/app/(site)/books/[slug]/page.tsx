import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Section } from "@/components/shared/section";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { Eyebrow } from "@/components/shared/eyebrow";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/media/book-cover";
import { BookCard } from "@/components/cards/book-card";
import { JsonLd } from "@/components/shared/json-ld";
import { getAllBooks, getBookBySlug, getRelatedBooks } from "@/lib/data/books";
import { formatPrice } from "@/lib/format";
import { buildBookJsonLd, buildMetadata } from "@/lib/seo";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBooks().map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return buildMetadata({
      title: slug,
      description: "This title is not yet published.",
      path: `/books/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: book.seo?.title ?? book.title,
    description: book.seo?.description ?? book.excerpt,
    path: `/books/${book.slug}`,
    noIndex: book.status !== "published",
  });
}

const FORMAT_LABELS: Record<string, string> = {
  physical: "Physical",
  ebook: "Ebook",
  audiobook: "Audiobook",
};

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const formats = book.formats ?? [book.format];
  const relatedBooks = getRelatedBooks(book.slug);

  return (
    <>
      <JsonLd data={buildBookJsonLd(book)} />
      <Section containerWidth="wide">
        <PageBreadcrumbs
          items={[{ label: "Books", href: "/books" }, { label: book.title }]}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_1fr] lg:gap-16">
          <BookCover
            title={book.title}
            size="lg"
            className="mx-auto max-w-[18rem] lg:max-w-none"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {book.status === "coming-soon" && (
                <Badge className="border-none bg-navy-900 text-gold-300">
                  Coming soon
                </Badge>
              )}
              {book.status === "draft" && (
                <Badge variant="secondary" className="border-none bg-paper-100 text-stone-600">
                  Available soon
                </Badge>
              )}
              {formats.map((format) => (
                <Badge
                  key={format}
                  variant="secondary"
                  className="border-none bg-gold-100 text-gold-700"
                >
                  {FORMAT_LABELS[format]}
                </Badge>
              ))}
            </div>

            <h1 className="mt-4 text-4xl leading-tight text-balance sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              By{" "}
              <Link href="/about" className="underline underline-offset-4 hover:text-gold-600">
                {book.author.name}
              </Link>
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {book.excerpt}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-600">
              {book.pageCount && (
                <div className="flex gap-1.5">
                  <dt className="text-stone-500">Pages</dt>
                  <dd className="font-medium">{book.pageCount}</dd>
                </div>
              )}
              {book.isbn && (
                <div className="flex gap-1.5">
                  <dt className="text-stone-500">ISBN</dt>
                  <dd className="font-medium">{book.isbn}</dd>
                </div>
              )}
              {book.priceCents != null && (
                <div className="flex gap-1.5">
                  <dt className="text-stone-500">Price</dt>
                  <dd className="font-medium">
                    {formatPrice(book.priceCents, book.currency)}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {book.amazonUrl ? (
                <Button asChild variant="gold" size="xl">
                  <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                    Buy on Amazon
                  </a>
                </Button>
              ) : (
                <Button variant="gold" size="xl" disabled title="Coming soon">
                  Buy on Amazon
                </Button>
              )}
              <Button variant="outline" size="xl" disabled title="Coming soon">
                Purchase direct
              </Button>
              <Button
                variant="ghost"
                size="xl"
                disabled={!book.signedEditionAvailable}
                title={book.signedEditionAvailable ? undefined : "Coming soon"}
              >
                Signed edition
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="alt" containerWidth="content">
        <Eyebrow>Table of contents</Eyebrow>
        <h2 className="mt-3 text-3xl">Inside the book</h2>
        {book.tableOfContents?.length ? (
          <ol className="mt-8 divide-y divide-border">
            {book.tableOfContents.map((chapter, index) => (
              <li key={chapter} className="flex items-baseline gap-4 py-3.5">
                <span className="font-mono text-sm text-gold-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-foreground/90">{chapter}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            The full chapter list will appear here closer to release.
          </p>
        )}
      </Section>

      <Section containerWidth="content">
        <Eyebrow>About the author</Eyebrow>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-xl italic text-gold-300">
            AK
          </span>
          <div>
            <p className="font-display text-xl text-foreground">{book.author.name}</p>
            <p className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">
              {book.author.bio}
            </p>
            <Button asChild variant="link" className="mt-2 h-auto p-0 text-navy-800">
              <Link href="/about">Read the full biography →</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section tone="alt" containerWidth="content">
        <Eyebrow>Reviews</Eyebrow>
        <h2 className="mt-3 text-3xl">What readers say</h2>
        <div className="mt-8">
          <EmptyState
            icon={Star}
            title="Reviews aren't open yet"
            description="Reader reviews will appear here once the book is available for purchase."
          />
        </div>
      </Section>

      {relatedBooks.length > 0 && (
        <Section containerWidth="wide">
          <Eyebrow>Related</Eyebrow>
          <h2 className="mt-3 text-3xl">More from the catalog</h2>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {relatedBooks.map((related) => (
              <BookCard key={related.id} book={related} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
