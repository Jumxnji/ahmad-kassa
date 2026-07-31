import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Book } from "@/types/content";
import { BookCover } from "@/components/media/book-cover";
import { Badge } from "@/components/ui/badge";

const FORMAT_LABELS: Record<Book["format"], string> = {
  physical: "Physical",
  ebook: "Ebook",
  audiobook: "Audiobook",
};

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const formats = book.formats ?? [book.format];

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group/book flex flex-col"
      aria-label={book.title}
    >
      <div className="relative">
        <BookCover title={book.title} />
        {book.status === "coming-soon" && (
          <Badge className="absolute right-3 top-3 border-none bg-navy-950/90 text-eyebrow text-gold-300">
            Coming soon
          </Badge>
        )}
        {book.status === "draft" && (
          <Badge className="absolute right-3 top-3 border-none bg-navy-950/90 text-eyebrow text-gold-300">
            Available soon
          </Badge>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex flex-wrap gap-1.5">
          {formats.map((format) => (
            <Badge
              key={format}
              variant="secondary"
              className="border-none bg-paper-100 text-[0.65rem] text-stone-600"
            >
              {FORMAT_LABELS[format]}
            </Badge>
          ))}
        </div>
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
