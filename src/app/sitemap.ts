import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllBooks } from "@/lib/data/books";
import { getAllArticles } from "@/lib/data/articles";

const STATIC_ROUTES = [
  "",
  "/about",
  "/books",
  "/courses",
  "/articles",
  "/contact",
  "/ask",
  "/newsletter",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  const bookEntries: MetadataRoute.Sitemap = getAllBooks()
    .filter((book) => book.status === "published")
    .map((book) => ({
      url: `${siteConfig.url}/books/${book.slug}`,
      lastModified: book.publishedAt ? new Date(book.publishedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const articleEntries: MetadataRoute.Sitemap = getAllArticles()
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: `${siteConfig.url}/articles/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...bookEntries, ...articleEntries];
}
