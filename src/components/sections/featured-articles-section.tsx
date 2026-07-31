import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ArticleCard } from "@/components/cards/article-card";
import { getFeaturedArticles } from "@/lib/data/articles";

export function FeaturedArticlesSection() {
  const articles = getFeaturedArticles(4);

  return (
    <Section tone="alt">
      <div className="max-w-xl">
        <Eyebrow>Writing</Eyebrow>
        <h2 className="mt-3 text-3xl sm:text-4xl">Recent articles</h2>
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-8 lg:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/articles">View all articles</Link>
        </Button>
      </div>
    </Section>
  );
}
