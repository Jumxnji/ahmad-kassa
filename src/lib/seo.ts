import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Book } from "@/types/content";

interface BuildMetadataOptions {
  title: string | { default: string; template: string };
  description: string;
  path?: string;
  noIndex?: boolean;
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
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString();

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
      images: [{ url: siteConfig.ogImage }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.twitterImage],
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

export function buildBookJsonLd(book: Book) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.excerpt,
    url: new URL(`/books/${book.slug}`, siteConfig.url).toString(),
    author: {
      "@type": "Person",
      name: book.author.name,
    },
    bookFormat:
      book.format === "physical"
        ? "https://schema.org/Paperback"
        : book.format === "ebook"
          ? "https://schema.org/EBook"
          : "https://schema.org/AudiobookFormat",
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.pageCount ? { numberOfPages: book.pageCount } : {}),
    ...(book.priceCents != null
      ? {
          offers: {
            "@type": "Offer",
            price: (book.priceCents / 100).toFixed(2),
            priceCurrency: book.currency ?? "USD",
            availability:
              book.status === "published"
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
          },
        }
      : {}),
  };
}
