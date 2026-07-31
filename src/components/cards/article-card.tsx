import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group/article flex flex-col border-b border-border pb-8 last:border-none last:pb-0"
    >
      <div className="flex items-center gap-3">
        {article.category && (
          <Badge variant="secondary" className="border-none bg-gold-100 text-gold-700">
            {article.category}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {formatDate(article.publishedAt)}
          {article.readingTimeMinutes && ` · ${article.readingTimeMinutes} min read`}
        </span>
      </div>

      <h3 className="mt-4 max-w-xl font-display text-2xl leading-snug text-foreground transition-colors group-hover/article:text-gold-600 sm:text-3xl">
        {article.title}
      </h3>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
        {article.excerpt}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-800 transition-transform duration-300 group-hover/article:translate-x-0.5">
        Read the piece
        <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  );
}
