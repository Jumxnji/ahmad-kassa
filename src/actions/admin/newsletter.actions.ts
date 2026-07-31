"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/action-helpers";
import { requirePermission } from "@/permissions/require-permission";
import { newsletterService } from "@/services/newsletter.service";
import { toCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";

/** Returns the current (optionally search-filtered) subscriber list as CSV text. */
export async function exportNewsletterCsvAction(q?: string) {
  return runAction(async () => {
    await requirePermission("newsletter", "read");

    const subscribers = await newsletterService.listAll({ q: q?.trim() ?? "" });
    const csv = toCsv(
      ["Email", "Language", "Status", "Joined"],
      subscribers.map((s) => [
        s.email,
        s.language,
        s.subscribed ? "Subscribed" : "Unsubscribed",
        formatDate(s.createdAt.toISOString()),
      ])
    );

    return csv;
  }, "Export ready.");
}

export async function setSubscriberStatusAction(id: string, subscribed: boolean) {
  return runAction(async () => {
    await requirePermission("newsletter", "update");
    const subscriber = await newsletterService.setSubscribed(id, subscribed);
    revalidatePath("/admin/newsletter");
    return subscriber;
  }, subscribed ? "Subscriber restored." : "Subscriber unsubscribed.");
}

export async function deleteSubscriberAction(id: string) {
  return runAction(async () => {
    await requirePermission("newsletter", "delete");
    await newsletterService.remove(id);
    revalidatePath("/admin/newsletter");
    return { id };
  }, "Subscriber removed.");
}
