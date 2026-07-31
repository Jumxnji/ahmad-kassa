import "server-only";
import { bookRepository } from "@/repositories/book.repository";
import { seoService } from "@/services/seo.service";
import { sanitizeRichText } from "@/lib/sanitize-rich-text";
import { slugify } from "@/lib/utils";
import type { ParsedListQuery } from "@/lib/list-query";
import type { CreateBookInput, UpdateBookInput } from "@/validators/book.validator";
import type { Prisma } from "@/generated/prisma/client";

const SORTABLE_FIELDS = new Set(["title", "createdAt", "updatedAt", "publicationDate"]);

/** Appends -2, -3, ... until the slug is free (excluding the book being edited). */
async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = slugify(base) || "book";
  let attempt = 1;

  while (true) {
    const existing = await bookRepository.findBySlug(candidate);
    if (!existing || existing.id === excludeId) return candidate;
    attempt += 1;
    candidate = `${slugify(base)}-${attempt}`;
  }
}

/** Strips the request-only `seo`/`galleryIds` fields, leaving pure Book scalars. */
function toScalarData(input: CreateBookInput | UpdateBookInput) {
  const { seo: _seo, galleryIds: _galleryIds, description, ...rest } = input;
  void _seo;
  void _galleryIds;
  return {
    ...rest,
    ...(description != null ? { description: sanitizeRichText(description) } : {}),
  };
}

export const bookService = {
  list: (opts?: { publishedOnly?: boolean }) =>
    bookRepository.findMany(
      opts?.publishedOnly ? { where: { status: "PUBLISHED" } } : undefined
    ),

  /** Books visible on the public site — published or openly announced as coming soon. Never drafts or archived titles. */
  listPublic: () =>
    bookRepository.findMany({
      where: { status: { in: ["PUBLISHED", "COMING_SOON"] } },
      orderBy: [{ featured: "desc" }, { publicationDate: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    }),

  get: (id: string) => bookRepository.findById(id),

  getBySlug: (slug: string) => bookRepository.findBySlug(slug),

  /** The book to lead the homepage with: the editor's explicit pick if it's still published, otherwise the newest published title. */
  async resolveFeatured(featuredBookId: string | null | undefined) {
    if (featuredBookId) {
      const chosen = await bookRepository.findById(featuredBookId);
      if (chosen && chosen.status === "PUBLISHED") return chosen;
    }
    return bookRepository.findLatestPublished();
  },

  getRelated: async (id: string, limit = 3) => {
    const rows = await bookRepository.findMany({
      where: { status: { in: ["PUBLISHED", "COMING_SOON"] }, id: { not: id } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return rows;
  },

  count: () => bookRepository.count(),
  countPublished: () => bookRepository.count({ status: "PUBLISHED" }),

  async listPaged(query: ParsedListQuery) {
    const where: Prisma.BookWhereInput = query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { slug: { contains: query.q, mode: "insensitive" } },
            { excerpt: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy: Prisma.BookOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      bookRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      bookRepository.count(where),
    ]);

    return { rows, total };
  },

  async create(input: CreateBookInput) {
    const { seo, galleryIds } = input;
    const slug = await ensureUniqueSlug(input.slug || input.title);
    const seoRow = seo && Object.keys(seo).length > 0 ? await seoService.save(null, seo) : null;
    const data = toScalarData(input);

    return bookRepository.create({
      ...data,
      slug,
      seoId: seoRow?.id ?? null,
      ...(galleryIds && galleryIds.length > 0
        ? { gallery: { connect: galleryIds.map((galleryId) => ({ id: galleryId })) } }
        : {}),
    } as Prisma.BookUncheckedCreateInput);
  },

  async update(id: string, input: UpdateBookInput) {
    const { seo, galleryIds } = input;
    const data: Record<string, unknown> = toScalarData(input);

    if (input.slug || input.title) {
      data.slug = await ensureUniqueSlug(input.slug || input.title || "", id);
    }

    if (seo && Object.keys(seo).length > 0) {
      const existing = await bookRepository.findById(id);
      const seoRow = await seoService.save(existing?.seoId ?? null, seo);
      data.seoId = seoRow.id;
    }

    if (galleryIds) {
      data.gallery = { set: galleryIds.map((galleryId) => ({ id: galleryId })) };
    }

    return bookRepository.update(id, data as Prisma.BookUncheckedUpdateInput);
  },

  /**
   * Creates a Draft, unfeatured copy of a book — title suffixed, slug
   * regenerated. Cover and gallery images are NOT copied: `coverImageId`
   * is a 1:1 relation (one Media row can only be one book's cover), and
   * gallery images belong to their original book — carrying either over
   * would silently steal the image from the source book. The new title
   * needs its own cover uploaded, same as any new book.
   */
  async duplicate(id: string) {
    const source = await bookRepository.findById(id);
    if (!source) return null;

    const title = `${source.title} (Copy)`;
    const slug = await ensureUniqueSlug(title);

    let seoId: string | null = null;
    if (source.seo) {
      const clonedSeo = await seoService.save(null, {
        metaTitle: source.seo.metaTitle ?? undefined,
        metaDescription: source.seo.metaDescription ?? undefined,
        keywords: source.seo.keywords ?? undefined,
      });
      seoId = clonedSeo.id;
    }

    return bookRepository.create({
      title,
      slug,
      description: source.description,
      excerpt: source.excerpt,
      authorName: source.authorName,
      publicationDate: source.publicationDate,
      isbn: source.isbn,
      language: source.language,
      category: source.category,
      tags: source.tags,
      amazonUrl: source.amazonUrl,
      directPurchaseUrl: source.directPurchaseUrl,
      signedCopyAvailable: source.signedCopyAvailable,
      ebookUrl: source.ebookUrl,
      audiobookUrl: source.audiobookUrl,
      status: "DRAFT",
      featured: false,
      seoId,
    });
  },

  remove: (id: string) => bookRepository.delete(id),
};
