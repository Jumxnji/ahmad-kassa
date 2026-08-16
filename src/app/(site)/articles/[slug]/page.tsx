import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/shared/section";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ArticleBody } from "@/components/articles/article-body";
import { TableOfContents } from "@/components/articles/table-of-contents";
import { ShareButtons } from "@/components/articles/share-buttons";
import { ReadingProgressBar } from "@/components/articles/reading-progress-bar";
import { ArticleCard } from "@/components/cards/article-card";
import { Eyebrow } from "@/components/shared/eyebrow";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { buildMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/config/site";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return buildMetadata({
      title: slug,
      description: "This article is not yet published.",
      path: `/articles/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt,
    path: `/articles/${article.slug}`,
    ogImage: article.seo?.ogImage,
    useRouteOgImage: true,
  });
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const headings = (article.content ?? []).filter(
    (block) => block.type === "heading"
  );
  const url = new URL(`/articles/${article.slug}`, siteConfig.url).toString();
  const relatedArticles = getRelatedArticles(article.slug);

  return (
    <>
      <JsonLd
        data={buildArticleJsonLd({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          authorName: article.author.name,
          publishedAt: article.publishedAt,
          coverImageUrl: article.coverImageUrl,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([{ label: "Articles", href: "/articles" }, { label: article.title }])}
      />
      <ReadingProgressBar />

      <Section containerWidth="wide">
        <PageBreadcrumbs
          items={[{ label: "Articles", href: "/articles" }, { label: article.title }]}
        />

        <div className="mx-auto mt-10 max-w-2xl text-center">
          {article.category && (
            <Badge variant="secondary" className="border-none bg-gold-100 text-gold-700">
              {article.category}
            </Badge>
          )}
          <h1 className="mt-4 text-4xl leading-tight text-balance sm:text-5xl">
            {article.title}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{article.author.name}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.readingTimeMinutes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.readingTimeMinutes} min read</span>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-12 lg:grid-cols-[1fr_14rem]">
          <article>
            {article.content?.length ? (
              <ArticleBody blocks={article.content} />
            ) : (
              <p className="text-lg leading-relaxed text-muted-foreground">
                The full piece is being prepared and will appear here soon.
              </p>
            )}

            <ShareButtons url={url} title={article.title} className="mt-14 border-t border-border pt-8" />
          </article>

          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents items={headings} />
              </div>
            </aside>
          )}
        </div>
      </Section>

      {relatedArticles.length > 0 && (
        <Section tone="alt" containerWidth="content">
          <Eyebrow>Related reading</Eyebrow>
          <h2 className="mt-3 text-3xl">More to explore</h2>
          <div className="mt-10 space-y-10">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
