import "server-only";
import { campaignRepository } from "@/repositories/campaign.repository";
import type { Prisma, $Enums } from "@/generated/prisma/client";
import type { ParsedListQuery } from "@/lib/list-query";

const SORTABLE_FIELDS = new Set(["internalName", "subject", "status", "createdAt", "sentAt"]);

export const campaignService = {
  async listPaged(query: ParsedListQuery, filters: { status?: $Enums.CampaignStatus }) {
    const where: Prisma.CampaignWhereInput = {
      ...(query.q
        ? {
            OR: [
              { internalName: { contains: query.q, mode: "insensitive" } },
              { subject: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };
    const orderBy: Prisma.CampaignOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      campaignRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      campaignRepository.count(where),
    ]);

    return { rows, total };
  },

  recent: (limit: number) => campaignRepository.findMany({ take: limit }),

  get: (id: string) => campaignRepository.findById(id),

  create: (data: Prisma.CampaignUncheckedCreateInput) => campaignRepository.create(data),

  update: (id: string, data: Prisma.CampaignUncheckedUpdateInput) => campaignRepository.update(id, data),

  remove: (id: string) => campaignRepository.delete(id),

  /**
   * Atomic status transition into SENDING — this conditional update
   * (only matches rows currently DRAFT/READY) is the idempotency guard
   * against a double-submitted "Send now" click: a second concurrent
   * call finds zero matching rows and returns false, doing nothing.
   */
  beginSending: (id: string) => campaignRepository.transitionStatus(id, ["DRAFT", "READY"], { status: "SENDING" }),

  finalize: (
    id: string,
    data: { status: $Enums.CampaignStatus; recipientCount: number; successCount: number; failureCount: number }
  ) => campaignRepository.update(id, { ...data, sentAt: new Date() }),
};
