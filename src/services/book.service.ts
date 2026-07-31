import "server-only";
import { bookRepository } from "@/repositories/book.repository";
import { seoService } from "@/services/seo.service";
import { slugify } from "@/lib/utils";
import type { ParsedListQuery } from "@/lib/list-query";
import type { CreateBookInput, UpdateBookInput } from "@/validators/book.validator";
import type { Prisma } from "@/generated/prisma/client";

const SORTABLE_FIELDS = new Set(["title", "createdAt"]);

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

export const bookService = {
  list: (opts?: { publishedOnly?: boolean }) =>
    bookRepository.findMany(opts?.publishedOnly ? { where: { published: true } } : undefined),

  get: (id: string) => bookRepository.findById(id),

  getBySlug: (slug: string) => bookRepository.findBySlug(slug),

  count: () => bookRepository.count(),
  countPublished: () => bookRepository.count({ published: true }),

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
    const { seo, ...rest } = input;
    const slug = await ensureUniqueSlug(input.slug || input.title);
    const seoRow = seo && Object.keys(seo).length > 0 ? await seoService.save(null, seo) : null;

    return bookRepository.create({ ...rest, slug, seoId: seoRow?.id ?? null });
  },

  async update(id: string, input: UpdateBookInput) {
    const { seo, ...rest } = input;
    const data: typeof rest & { slug?: string; seoId?: string | null } = { ...rest };

    if (input.slug || input.title) {
      data.slug = await ensureUniqueSlug(input.slug || input.title || "", id);
    }

    if (seo && Object.keys(seo).length > 0) {
      const existing = await bookRepository.findById(id);
      const seoRow = await seoService.save(existing?.seoId ?? null, seo);
      data.seoId = seoRow.id;
    }

    return bookRepository.update(id, data);
  },

  remove: (id: string) => bookRepository.delete(id),
};
