import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/shared/section";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { Eyebrow } from "@/components/shared/eyebrow";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/media/book-cover";
import { BookCard } from "@/components/cards/book-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { JsonLd } from "@/components/shared/json-ld";
import { TrackedLink } from "@/components/shared/tracked-link";
import { TrackEventOnMount } from "@/components/shared/track-event-on-mount";
import { bookService } from "@/services/book.service";
import { aboutService } from "@/services/about.service";
import { isFeatureEnabled } from "@/features/flags";
import { formatDate } from "@/lib/format";
import { buildBookJsonLd, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Star } from "lucide-react";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const books = await bookService.listPublic();
  return books.map((book) => ({ slug: book.slug }));
}

function isPubliclyVisible(status: string) {
  return status === "PUBLISHED" || status === "COMING_SOON";
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);

  if (!book || !isPubliclyVisible(book.status)) {
    return buildMetadata({
      title: slug,
      description: "This title is not yet published.",
      path: `/books/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: book.seo?.metaTitle || book.title,
    description: book.seo?.metaDescription || book.excerpt,
    path: `/books/${book.slug}`,
    canonicalUrl: book.seo?.canonicalUrl || undefined,
    ogImage: book.seo?.ogImage?.url || book.coverImage?.url || undefined,
    // Falls back to the generated branded card (opengraph-image.tsx,
    // co-located with this route) only when neither an editor-set OG
    // image nor a cover image exists — either real image always wins.
    useRouteOgImage: true,
    noIndex: book.status !== "PUBLISHED",
  });
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await bookService.getBySlug(slug);

  if (!book || !isPubliclyVisible(book.status)) {
    notFound();
  }

  const directBookSales = isFeatureEnabled("directBookSales");
  const [about, relatedBooks] = await Promise.all([
    aboutService.get(),
    bookService.getRelated(book.id, 3),
  ]);
  const pageUrl = new URL(`/books/${book.slug}`, siteConfig.url).toString();

  return (
    <>
      <JsonLd
        data={buildBookJsonLd({
          title: book.title,
          excerpt: book.excerpt,
          slug: book.slug,
          authorName: book.authorName,
          isbn: book.isbn,
          language: book.language,
          publicationDate: book.publicationDate,
          status: book.status,
          amazonUrl: book.amazonUrl,
          coverImageUrl: book.coverImage?.url,
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd([{ label: "Books", href: "/books" }, { label: book.title }])} />
      <TrackEventOnMount event={{ name: "book_detail_view", props: { bookSlug: book.slug } }} />
      <Section containerWidth="wide">
        <PageBreadcrumbs items={[{ label: "Books", href: "/books" }, { label: book.title }]} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_1fr] lg:gap-16">
          <BookCover
            title={book.title}
            size="lg"
            cover={book.coverImage}
            className="mx-auto max-w-[18rem] lg:max-w-none"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {book.status === "COMING_SOON" && (
                <Badge className="border-none bg-navy-900 text-gold-300">Coming soon</Badge>
              )}
              {book.category && (
                <Badge variant="secondary" className="border-none bg-gold-100 text-gold-700">
                  {book.category}
                </Badge>
              )}
            </div>

            <h1 className="mt-4 text-4xl leading-tight text-balance sm:text-5xl">{book.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              By{" "}
              <Link href="/about" className="underline underline-offset-4 hover:text-gold-600">
                {book.authorName}
              </Link>
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {book.excerpt}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-600">
              {book.publicationDate && (
                <div className="flex gap-1.5">
                  <dt className="text-stone-500">Published</dt>
                  <dd className="font-medium">{formatDate(book.publicationDate.toISOString())}</dd>
                </div>
              )}
              {book.isbn && (
                <div className="flex gap-1.5">
                  <dt className="text-stone-500">ISBN</dt>
                  <dd className="font-medium">{book.isbn}</dd>
                </div>
              )}
              <div className="flex gap-1.5">
                <dt className="text-stone-500">Language</dt>
                <dd className="font-medium">{book.language}</dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {book.amazonUrl ? (
                <Button asChild variant="gold" size="xl">
                  <TrackedLink
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    event={{ name: "amazon_link_click", props: { bookSlug: book.slug } }}
                  >
                    Buy on Amazon
                  </TrackedLink>
                </Button>
              ) : (
                <Button variant="gold" size="xl" disabled title="Coming soon">
                  Buy on Amazon
                </Button>
              )}
              {directBookSales && book.directPurchaseUrl && (
                <Button asChild variant="outline" size="xl">
                  <a href={book.directPurchaseUrl} target="_blank" rel="noopener noreferrer">
                    Purchase direct
                  </a>
                </Button>
              )}
              {directBookSales && book.ebookUrl && (
                <Button asChild variant="outline" size="xl">
                  <a href={book.ebookUrl} target="_blank" rel="noopener noreferrer">
                    eBook
                  </a>
                </Button>
              )}
              {directBookSales && book.audiobookUrl && (
                <Button asChild variant="outline" size="xl">
                  <a href={book.audiobookUrl} target="_blank" rel="noopener noreferrer">
                    Audiobook
                  </a>
                </Button>
              )}
              {directBookSales && book.signedCopyAvailable && (
                <Button variant="ghost" size="xl">
                  Signed edition
                </Button>
              )}
            </div>

            <div className="mt-6">
              <ShareButtons title={book.title} url={pageUrl} />
            </div>
          </div>
        </div>
      </Section>

      {book.description && (
        <Section tone="alt" containerWidth="content">
          <Eyebrow>Description</Eyebrow>
          <h2 className="mt-3 text-3xl">About this book</h2>
          <div
            className="prose-book mt-8 max-w-none text-base leading-relaxed text-foreground/90 [&_blockquote]:border-l-2 [&_blockquote]:border-gold-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h3]:mt-5 [&_h3]:font-display [&_h3]:text-lg [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: book.description }}
          />
        </Section>
      )}

      {book.gallery.length > 0 && (
        <Section containerWidth="wide">
          <Eyebrow>Gallery</Eyebrow>
          <h2 className="mt-3 text-3xl">Inside the book</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {book.gallery.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element -- gallery images vary in aspect ratio; a plain grid tile is simplest here
              <img
                key={image.id}
                src={image.thumbnailUrl || image.url}
                alt={image.altText ?? ""}
                className="aspect-square w-full rounded-md object-cover ring-1 ring-black/10"
              />
            ))}
          </div>
        </Section>
      )}

      <Section tone="alt" containerWidth="content">
        <Eyebrow>About the author</Eyebrow>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-xl italic text-gold-300">
            {book.authorName
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div>
            <p className="font-display text-xl text-foreground">{book.authorName}</p>
            <p className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">
              {about?.introText ??
                "Islamic teacher, author, and Khateeb, actively involved in Islamic education and practice."}
            </p>
            <Button asChild variant="link" className="mt-2 h-auto p-0 text-navy-800">
              <Link href="/about">Read the full biography →</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section containerWidth="content">
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

      <NewsletterSection source="BOOK_PAGE" />
    </>
  );
}
