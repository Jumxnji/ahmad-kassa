/**
 * Shared content shapes for future catalog entities.
 * No CMS or data layer is wired up yet — these types exist so that
 * cards, routes, and metadata can be built against a stable contract
 * before real content is introduced.
 */

export type ContentStatus = "draft" | "published" | "coming-soon";

export interface Author {
  readonly name: string;
  readonly slug: string;
  readonly avatarUrl?: string;
  readonly bio?: string;
}

export interface SeoFields {
  readonly title: string;
  readonly description: string;
  readonly ogImage?: string;
}

interface ContentBase {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly coverImageUrl?: string;
  readonly status: ContentStatus;
  readonly publishedAt?: string;
  readonly seo?: SeoFields;
}

export type BookFormat = "physical" | "ebook" | "audiobook";

export interface Book extends ContentBase {
  readonly author: Author;
  /** Primary format shown on cards; `formats` lists every edition available. */
  readonly format: BookFormat;
  readonly formats?: readonly BookFormat[];
  readonly priceCents?: number;
  readonly currency?: "USD" | "GBP" | "EUR";
  readonly pageCount?: number;
  readonly isbn?: string;
  readonly amazonUrl?: string;
  readonly directPurchaseEnabled?: boolean;
  readonly signedEditionAvailable?: boolean;
  readonly tableOfContents?: readonly string[];
  readonly featured?: boolean;
}

export type ArticleBlock =
  | { readonly type: "paragraph"; readonly text: string }
  | { readonly type: "heading"; readonly id: string; readonly text: string }
  | { readonly type: "quote"; readonly text: string; readonly attribution?: string };

export interface Article extends ContentBase {
  readonly author: Author;
  readonly readingTimeMinutes?: number;
  readonly category?: string;
  readonly tags?: readonly string[];
  readonly content?: readonly ArticleBlock[];
  readonly featured?: boolean;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseModule {
  readonly id: string;
  readonly title: string;
  readonly lessonCount: number;
}

/**
 * Courses are not launching yet, but the shape is defined now so the
 * catalog, cards, and checkout flow can be built against it later
 * without a breaking migration.
 */
export interface Course extends ContentBase {
  readonly instructor: Author;
  readonly level: CourseLevel;
  readonly modules: readonly CourseModule[];
  readonly priceCents?: number;
  readonly currency?: "USD" | "GBP" | "EUR";
  readonly durationHours?: number;
}

export interface Seminar extends ContentBase {
  readonly location: "online" | "in-person";
  readonly startsAt?: string;
  readonly endsAt?: string;
  readonly venue?: string;
}

export type LectureCategory =
  | "Weekly Khutbah"
  | "Lecture"
  | "Conference Talk"
  | "Seminar";

/**
 * Lecture cards render as YouTube embeds once real video IDs exist.
 * `youtubeId` is optional so a lecture can be listed before its
 * recording is published, falling back to a static thumbnail card.
 */
export interface Lecture extends ContentBase {
  readonly speaker: Author;
  readonly category: LectureCategory;
  readonly durationMinutes?: number;
  readonly youtubeId?: string;
}
