import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  title: string | { default: string; template: string };
  description: string;
  path?: string;
  noIndex?: boolean;
  /** Overrides the canonical/OG URL — for content with its own editor-set canonical (e.g. a book's SEO tab). */
  canonicalUrl?: string;
  ogImage?: string;
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
}: BuildMetadataOptions): Metadata {
  const url = canonicalUrl || new URL(path, siteConfig.url).toString();
  const image = ogImage || siteConfig.ogImage;

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
      images: [{ url: image }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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
export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Islamic Teacher, Author & Khateeb",
    description: siteConfig.description,
    sameAs: siteConfig.socialLinks.map((link) => link.href),
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
    sameAs: siteConfig.socialLinks.map((link) => link.href),
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
