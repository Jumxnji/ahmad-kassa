import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { PublicationIndex } from "@/components/catalog/publication-index";
import { bookService } from "@/services/book.service";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Books",
  description: "Books by Ahmad Mohamed Kassa on Aqeedah, Fiqh, and the Seerah.",
  path: "/books",
});

export default async function BooksPage() {
  const books = await bookService.listPublic();

  return (
    <Section containerWidth="wide" className="pt-14 pb-28 sm:pt-16 sm:pb-36">
      <PageHeader eyebrow="Books" title="Published works" />
      <PublicationIndex books={books} />
    </Section>
  );
}
