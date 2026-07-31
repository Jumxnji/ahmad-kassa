import type { Book } from "@/types/content";
import { AHMAD } from "@/lib/data/authors";

/**
 * Placeholder catalog — no CMS or commerce backend yet. Shaped to
 * match `Book` exactly so the grid, detail page, and future Stripe
 * checkout can be built against real-looking data without rework.
 */
export const BOOKS: readonly Book[] = [
  {
    id: "book-great-debate",
    slug: "the-great-debate",
    title: "The Great Debate",
    excerpt:
      "A clear-eyed examination of the arguments for and against belief in God — weighing philosophy, revelation, and reason without flattening the difficulty of the question.",
    status: "published",
    author: AHMAD,
    format: "physical",
    formats: ["physical", "ebook"],
    priceCents: 1899,
    currency: "USD",
    pageCount: 248,
    isbn: "978-1-9999999-0-1",
    amazonUrl: "https://amazon.com",
    directPurchaseEnabled: false,
    featured: true,
    publishedAt: "2024-03-01",
    tableOfContents: [
      "Framing the Question",
      "The Case for a Creator",
      "Contingency and First Cause",
      "The Problem of Evil, Revisited",
      "Revelation as Evidence",
      "Living With Certainty",
    ],
    seo: {
      title: "The Great Debate — Ahmad Mohamed Kassa",
      description:
        "A clear-eyed examination of belief in God, weighing philosophy, revelation, and reason.",
    },
  },
  {
    id: "book-islamic-exorcism",
    slug: "islamic-exorcism-ruqyah-a-practical-guide",
    title: "Islamic Exorcism (Ruqyah): A Practical Guide",
    excerpt:
      "A grounded, text-based guide to Ruqyah — separating authentic practice from folk superstition, drawn from over a decade of direct experience.",
    status: "coming-soon",
    author: AHMAD,
    format: "physical",
    formats: ["physical", "ebook"],
    pageCount: 192,
    tableOfContents: [
      "What Ruqyah Is, and Isn't",
      "The Unseen in the Qur'an and Sunnah",
      "Signs and Symptoms",
      "A Practical Method",
      "Common Misconceptions",
    ],
    seo: {
      title: "Islamic Exorcism (Ruqyah): A Practical Guide — Ahmad Mohamed Kassa",
      description: "A grounded, text-based guide to Ruqyah, coming soon from Ahmad Mohamed Kassa.",
    },
  },
  {
    id: "book-shirk-in-this-ummah",
    slug: "shirk-in-this-ummah",
    title: "Shirk in This Ummah",
    excerpt:
      "An honest look at the forms of shirk that persist in Muslim communities today — named plainly, and addressed with evidence rather than accusation.",
    status: "coming-soon",
    author: AHMAD,
    format: "physical",
    formats: ["physical", "ebook"],
    pageCount: 176,
    seo: {
      title: "Shirk in This Ummah — Ahmad Mohamed Kassa",
      description: "An honest look at the forms of shirk that persist in Muslim communities today, coming soon.",
    },
  },
  {
    id: "book-hajj-and-umrah",
    slug: "hajj-and-umrah-step-by-step",
    title: "Hajj and Umrah: Step by Step",
    excerpt:
      "A practical field companion for Hajj and Umrah — every rite explained in sequence, written for the pilgrim rather than the specialist.",
    status: "draft",
    author: AHMAD,
    format: "ebook",
    formats: ["ebook", "physical"],
    pageCount: 140,
    seo: {
      title: "Hajj and Umrah: Step by Step — Ahmad Mohamed Kassa",
      description: "A practical field companion for Hajj and Umrah, available soon.",
    },
  },
] as const;

export function getAllBooks(): readonly Book[] {
  return BOOKS;
}

export function getFeaturedBook(): Book {
  return BOOKS.find((book) => book.featured) ?? BOOKS[0];
}

export function getBookBySlug(slug: string): Book | undefined {
  return BOOKS.find((book) => book.slug === slug);
}

export function getRelatedBooks(slug: string, limit = 3): readonly Book[] {
  return BOOKS.filter((book) => book.slug !== slug).slice(0, limit);
}
