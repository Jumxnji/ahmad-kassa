import "server-only";
import { db } from "@/db/client";
import type { Prisma, $Enums } from "@/generated/prisma/client";

export const campaignRepository = {
  findMany(args?: Prisma.CampaignFindManyArgs) {
    return db.campaign.findMany({ orderBy: { createdAt: "desc" }, ...args });
  },

  findById(id: string) {
    return db.campaign.findUnique({ where: { id } });
  },

  count(where?: Prisma.CampaignWhereInput) {
    return db.campaign.count({ where });
  },

  create(data: Prisma.CampaignUncheckedCreateInput) {
    return db.campaign.create({ data });
  },

  update(id: string, data: Prisma.CampaignUncheckedUpdateInput) {
    return db.campaign.update({ where: { id }, data });
  },

  /**
   * Conditional status transition — only succeeds if the campaign is
   * currently in one of `fromStatuses`. This is the idempotency guard
   * against a double-submitted "Send now" click: a second concurrent
   * call finds zero matching rows and does nothing.
   */
  async transitionStatus(
    id: string,
    fromStatuses: $Enums.CampaignStatus[],
    data: Prisma.CampaignUncheckedUpdateInput
  ) {
    const result = await db.campaign.updateMany({
      where: { id, status: { in: fromStatuses } },
      data,
    });
    return result.count > 0;
  },

  delete(id: string) {
    return db.campaign.delete({ where: { id } });
  },
};
