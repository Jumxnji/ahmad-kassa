import { PublicationEntry, type PublicationEntryData } from "@/components/catalog/publication-entry";

interface PublicationIndexProps {
  books: readonly PublicationEntryData[];
}

/**
 * A vertical, numbered list of editorial spreads — reads the same at one
 * title or several, with hairline dividers doing the separating instead
 * of a grid that needs a multiple of 3 to look finished.
 */
export function PublicationIndex({ books }: PublicationIndexProps) {
  if (books.length === 0) {
    return (
      <p className="mt-16 text-sm text-muted-foreground">
        No titles published yet — check back soon.
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-20 lg:mt-12 lg:space-y-28">
      {books.map((book, i) => (
        <PublicationEntry key={book.id} book={book} index={i + 1} />
      ))}
    </div>
  );
}
