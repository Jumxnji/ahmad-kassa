import "server-only";
import { contactRepository } from "@/repositories/contact.repository";
import type { $Enums, Prisma } from "@/generated/prisma/client";
import type { ParsedListQuery } from "@/lib/list-query";
import type { ContactFormValues } from "@/validators/public/contact-form.validator";
import type { UpdateContactMessageInput } from "@/validators/contact.validator";

const SORTABLE_FIELDS = new Set(["name", "reason", "status", "createdAt"]);

const REASON_MAP: Record<ContactFormValues["reason"], $Enums.ContactReason> = {
  speaking: "SPEAKING",
  seminars: "SEMINARS",
  general: "GENERAL",
  books: "BOOKS",
  media: "MEDIA",
};

export const contactService = {
  list: (opts?: { status?: "NEW" | "READ" | "ARCHIVED" }) =>
    contactRepository.findMany(opts?.status ? { where: { status: opts.status } } : undefined),

  get: (id: string) => contactRepository.findById(id),

  count: () => contactRepository.count(),
  countUnread: () => contactRepository.count({ status: "NEW" }),

  async listPaged(query: ParsedListQuery) {
    const where: Prisma.ContactMessageWhereInput = query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { email: { contains: query.q, mode: "insensitive" } },
            { message: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy: Prisma.ContactMessageOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      contactRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      contactRepository.count(where),
    ]);

    return { rows, total };
  },

  /** Called from the public Contact form. */
  submit: (input: ContactFormValues) =>
    contactRepository.create({
      name: input.name,
      email: input.email,
      reason: REASON_MAP[input.reason],
      message: input.message,
      status: "NEW",
    }),

  update: (id: string, input: UpdateContactMessageInput) => contactRepository.update(id, input),

  remove: (id: string) => contactRepository.delete(id),
};
