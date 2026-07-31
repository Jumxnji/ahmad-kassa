import { BookCard, type BookCardData } from "@/components/cards/book-card";

interface BooksGridProps {
  books: readonly BookCardData[];
}

/** Same grid at 1 title or 100 — no rebuild needed as the catalog grows. */
export function BooksGrid({ books }: BooksGridProps) {
  if (books.length === 0) {
    return (
      <p className="mt-16 text-center text-sm text-muted-foreground">
        No titles published yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
