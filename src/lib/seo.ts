import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { hasConfirmedProfile } from "@/constants/site";

interface BuildMetadataOptions {
  title: string | { default: string; template: string };
  description: string;
  path?: string;
  noIndex?: boolean;
  /** Overrides the canonical/OG URL — for content with its own editor-set canonical (e.g. a book's SEO tab). */
  canonicalUrl?: string;
  ogImage?: string;
  /**
   * Omits an explicit OG/Twitter image so Next's file-convention
   * `opengraph-image.tsx` co-located with this route is picked up
   * automatically instead (Next only auto-detects it when the
   * metadata object doesn't already set `openGraph.images`). Set this
   * on routes that have one. If `ogImage` is also provided, the
   * explicit image still wins — this only omits the image when there
   * truly isn't one to show.
   */
  useRouteOgImage?: boolean;
}

/**
 * Central metadata builder so every route produces consistent
 * OpenGraph, Twitter, and canonical tags without repeating boilerplate.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
  canonicalUrl,
  ogImage,
  useRouteOgImage = false,
}: BuildMetadataOptions): Metadata {
  const url = canonicalUrl || new URL(path, siteConfig.url).toString();
  const image = ogImage || (useRouteOgImage ? undefined : siteConfig.ogImage);

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: siteConfig.name,
      ...(image ? { images: [{ url: image }] } : {}),
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * JSON-LD for Ahmad Kassa as a Person/author entity. Rendered on
 * pages where structured data helps search engines understand the
 * author relationship (home, about, articles).
 */
/**
 * A social link only counts as a "confirmed profile" if it points
 * somewhere more specific than the bare platform domain — several of
 * `siteConfig.socialLinks` are still generic placeholders
 * (`https://youtube.com`, not a real channel URL), and structured
 * data must never claim an unconfirmed profile as `sameAs`.
 */
function confirmedSocialUrls(): string[] {
  return siteConfig.socialLinks.filter(hasConfirmedProfile).map((link) => link.href);
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Islamic Teacher, Author & Khateeb",
    description: siteConfig.description,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of London",
    },
    // Mirrors the "Research interests" list already shown on /about —
    // never diverge from what's actually published on the page.
    knowsAbout: [
      "Aqeedah & classical theology",
      "Ruqyah & the unseen",
      "Islamic psychology",
      "Marriage & family fiqh",
      "Seerah & prophetic method",
      "Comparative religion",
    ],
    ...(confirmedSocialUrls().length > 0 ? { sameAs: confirmedSocialUrls() } : {}),
  };
}

/**
 * Represents the Ahmad Mohamed Kassa teaching platform as a brand
 * entity — distinct from the Person schema, so search engines can
 * associate the site itself (logo, socials) independently of Ahmad
 * as an individual.
 */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: new URL("/brand/exports/logo-mark-512.png", siteConfig.url).toString(),
    founder: {
      "@type": "Person",
      name: siteConfig.name,
    },
    ...(confirmedSocialUrls().length > 0 ? { sameAs: confirmedSocialUrls() } : {}),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
    },
    inLanguage: "en",
  };
}

interface BookJsonLdInput {
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  isbn?: string | null;
  language: string;
  publicationDate?: Date | null;
  status: "DRAFT" | "PUBLISHED" | "COMING_SOON" | "ARCHIVED";
  amazonUrl?: string | null;
  coverImageUrl?: string | null;
}

/** Generated automatically from live book fields — see `docs/sprints/SPRINT-06.md` for why there's no separate structured-data field to hand-edit. */
export function buildBookJsonLd(book: BookJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.excerpt,
    url: new URL(`/books/${book.slug}`, siteConfig.url).toString(),
    author: {
      "@type": "Person",
      name: book.authorName,
    },
    inLanguage: book.language,
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.publicationDate ? { datePublished: book.publicationDate.toISOString() } : {}),
    ...(book.coverImageUrl
      ? { image: new URL(book.coverImageUrl, siteConfig.url).toString() }
      : {}),
    ...(book.amazonUrl
      ? {
          offers: {
            "@type": "Offer",
            url: book.amazonUrl,
            availability:
              book.status === "PUBLISHED"
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
          },
        }
      : {}),
  };
}

interface ArticleJsonLdInput {
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  publishedAt?: string;
  coverImageUrl?: string | null;
}

/** For the static editorial catalog in src/lib/data/articles.ts — same shape works once articles move into the CMS. */
export function buildArticleJsonLd(article: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: new URL(`/articles/${article.slug}`, siteConfig.url).toString(),
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.coverImageUrl
      ? { image: new URL(article.coverImageUrl, siteConfig.url).toString() }
      : {}),
  };
}

export function buildAboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About — ${siteConfig.name}`,
    url: new URL("/about", siteConfig.url).toString(),
    about: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}

export function buildContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact — ${siteConfig.name}`,
    url: new URL("/contact", siteConfig.url).toString(),
  };
}

export interface BreadcrumbJsonLdItem {
  label: string;
  href?: string;
}

/** Pairs with the visible <PageBreadcrumbs> component — always include a real "Home" first item to match what's rendered. */
export function buildBreadcrumbJsonLd(items: readonly BreadcrumbJsonLdItem[]) {
  const allItems: BreadcrumbJsonLdItem[] = [{ label: "Home", href: "/" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, siteConfig.url).toString() } : {}),
    })),
  };
}
