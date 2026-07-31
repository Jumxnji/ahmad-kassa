import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

const ABOUT_ID = "about";

export const aboutRepository = {
  get() {
    return db.aboutContent.findUnique({
      where: { id: ABOUT_ID },
      include: {
        seo: true,
        timeline: { orderBy: { order: "asc" } },
        education: { orderBy: { order: "asc" } },
      },
    });
  },

  /** Plain update — the singleton row is guaranteed to exist after `prisma db seed` (see homepage.repository.ts for why upsert is avoided here). */
  update(data: Prisma.AboutContentUncheckedUpdateInput) {
    return db.aboutContent.update({ where: { id: ABOUT_ID }, data });
  },

  // ---- Timeline items ----
  createTimelineItem(data: Omit<Prisma.TimelineItemUncheckedCreateInput, "aboutContentId">) {
    return db.timelineItem.create({ data: { ...data, aboutContentId: ABOUT_ID } });
  },

  updateTimelineItem(id: string, data: Prisma.TimelineItemUncheckedUpdateInput) {
    return db.timelineItem.update({ where: { id }, data });
  },

  deleteTimelineItem(id: string) {
    return db.timelineItem.delete({ where: { id } });
  },

  // ---- Education items ----
  createEducationItem(data: Omit<Prisma.EducationItemUncheckedCreateInput, "aboutContentId">) {
    return db.educationItem.create({ data: { ...data, aboutContentId: ABOUT_ID } });
  },

  updateEducationItem(id: string, data: Prisma.EducationItemUncheckedUpdateInput) {
    return db.educationItem.update({ where: { id }, data });
  },

  deleteEducationItem(id: string) {
    return db.educationItem.delete({ where: { id } });
  },
};
