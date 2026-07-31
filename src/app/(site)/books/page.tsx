import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { BooksGrid } from "@/components/catalog/books-grid";
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
    <Section containerWidth="wide">
      <PageHeader
        eyebrow="Books"
        title="The catalog"
        description="Long-form works on belief, practice, and the life of the Prophet, peace be upon him — written to build real understanding."
      />
      <div className="mt-12">
        <BooksGrid books={books} />
      </div>
    </Section>
  );
}
