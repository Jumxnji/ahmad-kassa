import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Pure data access — no validation, no permission checks, no business
 * rules. Services call these; nothing else should import `db` directly
 * for video data.
 */
export const videoRepository = {
  findMany(args?: Prisma.VideoFindManyArgs) {
    return db.video.findMany({
      orderBy: { createdAt: "desc" },
      ...args,
    });
  },

  findById(id: string) {
    return db.video.findUnique({ where: { id } });
  },

  findBySlug(slug: string) {
    return db.video.findUnique({ where: { slug } });
  },

  findByYoutubeId(youtubeId: string) {
    return db.video.findFirst({ where: { youtubeId } });
  },

  count(where?: Prisma.VideoWhereInput) {
    return db.video.count({ where });
  },

  create(data: Prisma.VideoUncheckedCreateInput) {
    return db.video.create({ data });
  },

  update(id: string, data: Prisma.VideoUncheckedUpdateInput) {
    return db.video.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.video.delete({ where: { id } });
  },
};
