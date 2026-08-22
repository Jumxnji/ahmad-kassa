import "server-only";
import { videoRepository } from "@/repositories/video.repository";
import { slugify } from "@/lib/utils";
import type { ParsedListQuery } from "@/lib/list-query";
import type { CreateVideoInput, UpdateVideoInput } from "@/validators/video.validator";
import type { Prisma } from "@/generated/prisma/client";

const SORTABLE_FIELDS = new Set(["title", "createdAt", "updatedAt", "publishedAt"]);

/** Appends -2, -3, ... until the slug is free (excluding the video being edited). */
async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = slugify(base) || "video";
  let attempt = 1;

  while (true) {
    const existing = await videoRepository.findBySlug(candidate);
    if (!existing || existing.id === excludeId) return candidate;
    attempt += 1;
    candidate = `${slugify(base)}-${attempt}`;
  }
}

export const videoService = {
  list: (opts?: { publishedOnly?: boolean }) =>
    videoRepository.findMany(
      opts?.publishedOnly ? { where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } } : undefined
    ),

  get: (id: string) => videoRepository.findById(id),

  getBySlug: (slug: string) => videoRepository.findBySlug(slug),

  getManyByIds: (ids: readonly string[]) =>
    videoRepository.findMany({ where: { id: { in: [...ids] } } }),

  async listPaged(query: ParsedListQuery) {
    const where: Prisma.VideoWhereInput = query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { slug: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy: Prisma.VideoOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      videoRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      videoRepository.count(where),
    ]);

    return { rows, total };
  },

  async create(input: CreateVideoInput) {
    const slug = await ensureUniqueSlug(input.slug || input.title);
    return videoRepository.create({ ...input, slug } as Prisma.VideoUncheckedCreateInput);
  },

  async update(id: string, input: UpdateVideoInput) {
    const data: Record<string, unknown> = { ...input };
    if (input.slug || input.title) {
      data.slug = await ensureUniqueSlug(input.slug || input.title || "", id);
    }
    return videoRepository.update(id, data as Prisma.VideoUncheckedUpdateInput);
  },

  setStatus: (id: string, status: "DRAFT" | "PUBLISHED") => videoRepository.update(id, { status }),

  remove: (id: string) => videoRepository.delete(id),

  count: () => videoRepository.count(),
  countPublished: () => videoRepository.count({ status: "PUBLISHED" }),
};
