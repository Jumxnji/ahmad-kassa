"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { newsletterService } from "@/services/newsletter.service";
import { auditLogService } from "@/services/audit-log.service";
import { NEVER_AUTO_REACTIVATE_STATUSES } from "@/schemas/newsletter.schema";
import { toCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import type { $Enums } from "@/generated/prisma/client";

const BASE_PATH = "/admin/newsletter/subscribers";

/** Returns the current (optionally filtered) subscriber list as CSV text — token hashes and other internal fields are never included. */
export async function exportNewsletterCsvAction(filters: {
  q?: string;
  status?: $Enums.SubscriberStatus;
  source?: $Enums.SubscriberSource;
}) {
  return runAction(async () => {
    const actor = await requirePermission("newsletter", "read");

    const subscribers = await newsletterService.listAll({
      q: filters.q?.trim() ?? "",
      status: filters.status,
      source: filters.source,
    });
    const csv = toCsv(
      ["Email", "First name", "Status", "Preferred language", "Source", "Joined", "Confirmed", "Last email sent"],
      subscribers.map((s) => [
        s.email,
        s.firstName ?? "",
        s.status,
        s.preferredLanguage,
        s.source,
        formatDate(s.createdAt.toISOString()),
        s.confirmedAt ? formatDate(s.confirmedAt.toISOString()) : "",
        s.lastEmailSentAt ? formatDate(s.lastEmailSentAt.toISOString()) : "",
      ])
    );

    await auditLogService.record({
      userId: actor.id,
      action: "newsletter.csv_export",
      metadata: { count: subscribers.length, filters },
    });

    return csv;
  }, "Export ready.");
}

export async function unsubscribeSubscriberAction(id: string) {
  return runAction(async () => {
    await requirePermission("newsletter", "update");
    const existing = await newsletterService.get(id);
    if (!existing) throw new NotFoundError("Subscriber");

    const subscriber = await newsletterService.setStatus(id, "UNSUBSCRIBED");
    revalidatePath(BASE_PATH);
    revalidatePath(`${BASE_PATH}/${id}`);
    return subscriber;
  }, "Subscriber unsubscribed.");
}

/** Admin-triggered — only ever allowed from UNSUBSCRIBED, never from a suppressed/bounced/complained address. */
export async function resubscribeSubscriberAction(id: string) {
  return runAction(async () => {
    await requirePermission("newsletter", "update");
    const existing = await newsletterService.get(id);
    if (!existing) throw new NotFoundError("Subscriber");
    if (existing.status !== "UNSUBSCRIBED") {
      throw new ValidationError("Only unsubscribed addresses can be resubscribed this way.");
    }

    const subscriber = await newsletterService.setStatus(id, "ACTIVE");
    revalidatePath(BASE_PATH);
    revalidatePath(`${BASE_PATH}/${id}`);
    return subscriber;
  }, "Subscriber resubscribed.");
}

export async function suppressSubscriberAction(id: string) {
  return runAction(async () => {
    const actor = await requirePermission("newsletter", "update");
    const existing = await newsletterService.get(id);
    if (!existing) throw new NotFoundError("Subscriber");
    if (NEVER_AUTO_REACTIVATE_STATUSES.includes(existing.status as (typeof NEVER_AUTO_REACTIVATE_STATUSES)[number])) {
      throw new ValidationError("This address is already suppressed.");
    }

    const subscriber = await newsletterService.setStatus(id, "SUPPRESSED", "Manually suppressed by staff");
    await auditLogService.record({
      userId: actor.id,
      action: "newsletter.subscriber_suppressed",
      metadata: { subscriberId: id, email: existing.email },
    });
    revalidatePath(BASE_PATH);
    revalidatePath(`${BASE_PATH}/${id}`);
    return subscriber;
  }, "Subscriber suppressed.");
}

export async function deleteSubscriberAction(id: string) {
  return runAction(async () => {
    const actor = await requirePermission("newsletter", "delete");
    const existing = await newsletterService.get(id);
    if (!existing) throw new NotFoundError("Subscriber");

    await newsletterService.remove(id);
    await auditLogService.record({
      userId: actor.id,
      action: "newsletter.subscriber_deleted",
      metadata: { subscriberId: id, email: existing.email },
    });
    revalidatePath(BASE_PATH);
    return { id };
  }, "Subscriber removed.");
}
