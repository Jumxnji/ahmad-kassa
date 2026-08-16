import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

export const newsletterRepository = {
  findMany(args?: Prisma.NewsletterSubscriberFindManyArgs) {
    return db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, ...args });
  },

  findById(id: string) {
    return db.newsletterSubscriber.findUnique({ where: { id } });
  },

  findByNormalizedEmail(normalizedEmail: string) {
    return db.newsletterSubscriber.findUnique({ where: { normalizedEmail } });
  },

  findByConfirmationTokenHash(hash: string) {
    return db.newsletterSubscriber.findFirst({ where: { confirmationTokenHash: hash } });
  },

  count(where?: Prisma.NewsletterSubscriberWhereInput) {
    return db.newsletterSubscriber.count({ where });
  },

  /** Confirmed + active subscribers, ordered oldest-first — the only audience a campaign send may ever read from. */
  findActiveForCampaign() {
    return db.newsletterSubscriber.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
    });
  },

  create(data: Prisma.NewsletterSubscriberUncheckedCreateInput) {
    return db.newsletterSubscriber.create({ data });
  },

  update(id: string, data: Prisma.NewsletterSubscriberUncheckedUpdateInput) {
    return db.newsletterSubscriber.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.newsletterSubscriber.delete({ where: { id } });
  },
};
