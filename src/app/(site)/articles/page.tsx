import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { ArticleCard } from "@/components/cards/article-card";
import { Pagination } from "@/components/navigation/pagination";
import { getArticlesPage } from "@/lib/data/articles";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Articles",
  description: "Writing from Ahmad Mohamed Kassa on belief, practice, and daily life.",
  path: "/articles",
});

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { page } = await searchParams;
  const { items, currentPage, totalPages } = getArticlesPage(Number(page) || 1);

  return (
    <Section containerWidth="content">
      <PageHeader
        eyebrow="Articles"
        title="Writing"
        description="Shorter reflections on belief, practice, and the questions that come up in ordinary life."
      />
      {items.length > 0 ? (
        <div className="mt-14 space-y-10">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No articles published yet — new writing will appear here as it&apos;s ready.
        </p>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/articles" />
    </Section>
  );
}
