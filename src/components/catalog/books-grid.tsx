"use client";

import { useState } from "react";
import type { Book, BookFormat } from "@/types/content";
import { BookCard } from "@/components/cards/book-card";
import { cn } from "@/lib/utils";

const FILTERS: { value: "all" | BookFormat; label: string }[] = [
  { value: "all", label: "All formats" },
  { value: "physical", label: "Physical" },
  { value: "ebook", label: "Ebook" },
  { value: "audiobook", label: "Audiobook" },
];

interface BooksGridProps {
  books: readonly Book[];
}

export function BooksGrid({ books }: BooksGridProps) {
  const [filter, setFilter] = useState<"all" | BookFormat>("all");

  const visible = books.filter((book) => {
    if (filter === "all") return true;
    return (book.formats ?? [book.format]).includes(filter);
  });

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter by format"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={filter === option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              filter === option.value
                ? "border-navy-900 bg-navy-900 text-paper-50"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No titles in this format yet.
        </p>
      )}
    </div>
  );
}
