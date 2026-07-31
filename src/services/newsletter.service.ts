import "server-only";
import { newsletterRepository } from "@/repositories/newsletter.repository";
import type { Prisma } from "@/generated/prisma/client";
import type { ParsedListQuery } from "@/lib/list-query";
import type { NewsletterFormValues } from "@/validators/public/newsletter-form.validator";

const SORTABLE_FIELDS = new Set(["email", "subscribed", "createdAt"]);

export const newsletterService = {
  list: (opts?: { subscribedOnly?: boolean }) =>
    newsletterRepository.findMany(opts?.subscribedOnly ? { where: { subscribed: true } } : undefined),

  count: () => newsletterRepository.count(),
  countSubscribed: () => newsletterRepository.count({ subscribed: true }),

  async listPaged(query: ParsedListQuery) {
    const where: Prisma.NewsletterSubscriberWhereInput = query.q
      ? { email: { contains: query.q, mode: "insensitive" } }
      : {};
    const orderBy: Prisma.NewsletterSubscriberOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      newsletterRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      newsletterRepository.count(where),
    ]);

    return { rows, total };
  },

  /** Unpaginated — used for CSV export so it isn't limited to one page. */
  listAll: (query: Pick<ParsedListQuery, "q">) => {
    const where: Prisma.NewsletterSubscriberWhereInput = query.q
      ? { email: { contains: query.q, mode: "insensitive" } }
      : {};
    return newsletterRepository.findMany({ where });
  },

  /** Called from the public Newsletter form (home, footer, courses, newsletter page). */
  subscribe: (input: NewsletterFormValues) =>
    newsletterRepository.upsertByEmail(input.email, {
      email: input.email,
      language: "en",
      subscribed: true,
    }),

  setSubscribed: (id: string, subscribed: boolean) =>
    newsletterRepository.update(id, { subscribed }),

  remove: (id: string) => newsletterRepository.delete(id),
};
