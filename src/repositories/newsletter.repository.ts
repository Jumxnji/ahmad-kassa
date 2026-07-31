import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

export const newsletterRepository = {
  findMany(args?: Prisma.NewsletterSubscriberFindManyArgs) {
    return db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, ...args });
  },

  findByEmail(email: string) {
    return db.newsletterSubscriber.findUnique({ where: { email } });
  },

  count(where?: Prisma.NewsletterSubscriberWhereInput) {
    return db.newsletterSubscriber.count({ where });
  },

  upsertByEmail(email: string, data: Prisma.NewsletterSubscriberUncheckedCreateInput) {
    return db.newsletterSubscriber.upsert({
      where: { email },
      create: data,
      update: { subscribed: true, language: data.language },
    });
  },

  update(id: string, data: Prisma.NewsletterSubscriberUncheckedUpdateInput) {
    return db.newsletterSubscriber.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.newsletterSubscriber.delete({ where: { id } });
  },
};
