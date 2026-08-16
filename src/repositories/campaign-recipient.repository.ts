import "server-only";
import { db } from "@/db/client";

export const campaignRecipientRepository = {
  /** Idempotent snapshot — `skipDuplicates` means re-running against an already-populated campaign inserts nothing new. */
  createMany(campaignId: string, subscriberIds: string[]) {
    return db.campaignRecipient.createMany({
      data: subscriberIds.map((subscriberId) => ({ campaignId, subscriberId })),
      skipDuplicates: true,
    });
  },

  findPending(campaignId: string) {
    return db.campaignRecipient.findMany({
      where: { campaignId, status: "PENDING" },
      include: { subscriber: true },
    });
  },

  markSent(id: string, providerMessageId?: string) {
    return db.campaignRecipient.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date(), providerMessageId },
    });
  },

  markFailed(id: string, error: string) {
    return db.campaignRecipient.update({ where: { id }, data: { status: "FAILED", error } });
  },

  findByProviderMessageId(providerMessageId: string) {
    return db.campaignRecipient.findFirst({ where: { providerMessageId }, include: { subscriber: true } });
  },

  count(campaignId: string) {
    return db.campaignRecipient.count({ where: { campaignId } });
  },
};
