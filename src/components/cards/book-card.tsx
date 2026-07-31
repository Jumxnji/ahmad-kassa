import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BookCover } from "@/components/media/book-cover";
import { Badge } from "@/components/ui/badge";
import type { Book, Media } from "@/generated/prisma/client";

export interface BookCardData extends Pick<Book, "id" | "slug" | "title" | "excerpt" | "status" | "category"> {
  coverImage: Media | null;
}

export function BookCard({ book }: { book: BookCardData }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group/book flex flex-col"
      aria-label={book.title}
    >
      <div className="relative">
        <BookCover title={book.title} cover={book.coverImage} />
        {book.status === "COMING_SOON" && (
          <Badge className="absolute right-3 top-3 border-none bg-navy-950/90 text-eyebrow text-gold-300">
            Coming soon
          </Badge>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        {book.category && (
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="border-none bg-paper-100 text-[0.65rem] text-stone-600">
              {book.category}
            </Badge>
          </div>
        )}
        <h3 className="mt-3 font-display text-xl leading-snug text-foreground transition-colors group-hover/book:text-gold-600">
          {book.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {book.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-800 transition-transform duration-300 group-hover/book:translate-x-0.5">
          Learn more
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
