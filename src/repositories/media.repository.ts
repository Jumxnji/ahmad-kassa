import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

const WITH_UPLOADER = { uploadedBy: { select: { id: true, name: true } } } as const;

type MediaWithUploader = Prisma.MediaGetPayload<{ include: typeof WITH_UPLOADER }>;

export const mediaRepository = {
  // Same "spread after include" TS-inference gap as bookRepository.findMany
  // — the explicit return type keeps callers seeing `uploadedBy`.
  findMany(args?: Prisma.MediaFindManyArgs) {
    return db.media.findMany({
      orderBy: { createdAt: "desc" },
      include: WITH_UPLOADER,
      ...args,
    }) as Promise<MediaWithUploader[]>;
  },

  findById(id: string) {
    return db.media.findUnique({ where: { id }, include: WITH_UPLOADER });
  },

  count(where?: Prisma.MediaWhereInput) {
    return db.media.count({ where });
  },

  create(data: Prisma.MediaUncheckedCreateInput) {
    return db.media.create({ data, include: WITH_UPLOADER });
  },

  update(id: string, data: Prisma.MediaUncheckedUpdateInput) {
    return db.media.update({ where: { id }, data, include: WITH_UPLOADER });
  },

  delete(id: string) {
    return db.media.delete({ where: { id } });
  },

  /**
   * Counts every place a Media row is currently referenced. Computed on
   * read rather than stored as a counter column — a stored count would
   * need to be kept in sync from six different write paths (book cover,
   * book gallery, two SEO image slots, homepage hero, site logo) and
   * would eventually drift; a live count never can.
   */
  async countUsages(id: string) {
    const [bookCover, bookGallery, seoOgImage, seoTwitterImage, homepageHero, siteLogo] =
      await Promise.all([
        db.book.count({ where: { coverImageId: id } }),
        db.book.count({ where: { gallery: { some: { id } } } }),
        db.seo.count({ where: { ogImageId: id } }),
        db.seo.count({ where: { twitterImageId: id } }),
        db.homepageContent.count({ where: { heroImageId: id } }),
        db.siteSettings.count({ where: { logoId: id } }),
      ]);

    return bookCover + bookGallery + seoOgImage + seoTwitterImage + homepageHero + siteLogo;
  },
};
