import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BookCover } from "@/components/media/book-cover";
import type { Book, Media } from "@/generated/prisma/client";

export interface PublicationEntryData
  extends Pick<Book, "id" | "slug" | "title" | "excerpt" | "authorName" | "status" | "category"> {
  coverImage: Media | null;
}

interface PublicationEntryProps {
  book: PublicationEntryData;
  /** 1-based position in the published catalogue — the archival "01 /" label, not a claim about how many titles exist. */
  index: number;
}

const STATUS_LABELS: Partial<Record<Book["status"], string>> = {
  PUBLISHED: "Published",
  COMING_SOON: "Coming soon",
};

/**
 * The `/books` index's own single-publication editorial spread — a
 * numbered archival entry with a dominant cover and a narrow, restrained
 * information column. Deliberately not `BookCard`: that component's
 * badge/`line-clamp`/grid-cell treatment is correct for a multi-item
 * grid (still used for "Related" on the book detail page), but this
 * page needed its own identity, not a card sized down to fit one slot.
 * A future second or third title extends this same numbered pattern —
 * `PublicationIndex` maps it, so nothing here assumes there's only one.
 */
export function PublicationEntry({ book, index }: PublicationEntryProps) {
  const statusLabel = STATUS_LABELS[book.status] ?? book.status;

  return (
    <article>
      <div className="flex items-baseline gap-3 border-b border-border pb-3">
        <span className="font-mono text-[11px] tracking-[0.08em] text-stone-500 uppercase">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-mono text-[11px] tracking-[0.08em] text-stone-400 uppercase">
          / {statusLabel}
        </span>
        {book.category && (
          <span className="ml-auto font-mono text-[11px] tracking-[0.08em] text-stone-400 uppercase">
            {book.category}
          </span>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-10 lg:gap-16">
        <div className="mx-auto w-full max-w-[13rem] shrink-0 sm:mx-0 sm:max-w-[15rem] lg:max-w-[17rem]">
          <BookCover title={book.title} cover={book.coverImage} size="lg" />
        </div>

        <div className="max-w-lg pt-1">
          <h2 className="font-display text-4xl leading-tight text-balance sm:text-5xl">
            {book.title}
          </h2>
          <p className="mt-5 font-display text-2xl leading-relaxed text-muted-foreground text-balance">
            {book.excerpt}
          </p>
          <p className="mt-5 text-sm text-stone-600">By {book.authorName}</p>

          <Link
            href={`/books/${book.slug}`}
            className="group/entry mt-9 inline-flex items-center gap-1 text-sm font-medium text-navy-800 transition-colors hover:text-gold-600"
          >
            Read about the book
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/entry:translate-x-0.5 group-hover/entry:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
