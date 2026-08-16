"use server";

import { revalidatePath } from "next/cache";
import { runAction, fieldErrorsFromZod } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { checkRateLimit } from "@/lib/rate-limit";
import { campaignService } from "@/services/campaign.service";
import { newsletterService } from "@/services/newsletter.service";
import { newsletterSettingsService } from "@/services/newsletter-settings.service";
import { emailService } from "@/services/email.service";
import { campaignRecipientRepository } from "@/repositories/campaign-recipient.repository";
import { campaignEmail, campaignPlainText } from "@/lib/email/templates";
import { auditLogService } from "@/services/audit-log.service";
import { sanitizeRichText } from "@/lib/sanitize-rich-text";
import { unsubscribeUrl } from "@/lib/newsletter-urls";
import { EDITABLE_CAMPAIGN_STATUSES } from "@/schemas/campaign.schema";
import { createCampaignSchema, updateCampaignSchema, sendTestEmailSchema } from "@/validators/campaign.validator";

/** Recipients are processed in small concurrent chunks — enough throughput without one giant blocking loop or risking a provider rate-limit burst. */
const SEND_CHUNK_SIZE = 20;

const BASE_PATH = "/admin/newsletter/campaigns";

function assertEditable(status: string) {
  if (!EDITABLE_CAMPAIGN_STATUSES.includes(status as (typeof EDITABLE_CAMPAIGN_STATUSES)[number])) {
    throw new ValidationError("This campaign has already started sending and can no longer be edited.");
  }
}

export async function createCampaignAction(values: unknown) {
  return runAction(async () => {
    const actor = await requirePermission("campaigns", "create");

    const parsed = createCampaignSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Give this campaign an internal name.", fieldErrorsFromZod(parsed.error));
    }

    const settings = await newsletterSettingsService.get();
    const campaign = await campaignService.create({
      internalName: parsed.data.internalName,
      title: "",
      subject: "",
      content: "",
      plainTextContent: "",
      language: settings.defaultLanguage,
      createdById: actor.id,
      updatedById: actor.id,
    });

    revalidatePath(BASE_PATH);
    return campaign;
  }, "Campaign created.");
}

export async function updateCampaignAction(id: string, values: unknown) {
  return runAction(async () => {
    const actor = await requirePermission("campaigns", "update");

    const existing = await campaignService.get(id);
    if (!existing) throw new NotFoundError("Campaign");
    assertEditable(existing.status);

    const parsed = updateCampaignSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const { content, ...rest } = parsed.data;
    const campaign = await campaignService.update(id, {
      ...rest,
      ...(content !== undefined ? { content: sanitizeRichText(content) } : {}),
      updatedById: actor.id,
    });

    revalidatePath(`${BASE_PATH}/${id}`);
    return campaign;
  }, "Campaign saved.");
}

export async function markCampaignStatusAction(id: string, status: "DRAFT" | "READY") {
  return runAction(async () => {
    const actor = await requirePermission("campaigns", "update");
    const existing = await campaignService.get(id);
    if (!existing) throw new NotFoundError("Campaign");
    assertEditable(existing.status);

    const campaign = await campaignService.update(id, { status, updatedById: actor.id });
    revalidatePath(`${BASE_PATH}/${id}`);
    return campaign;
  }, "Campaign updated.");
}

export async function deleteCampaignAction(id: string) {
  return runAction(async () => {
    await requirePermission("campaigns", "delete");
    const existing = await campaignService.get(id);
    if (!existing) throw new NotFoundError("Campaign");
    assertEditable(existing.status);

    await campaignService.remove(id);
    revalidatePath(BASE_PATH);
    return { id };
  }, "Campaign deleted.");
}

/** Renders the campaign's current draft content through the real template — used by the Preview tab, not a mockup. */
export async function previewCampaignEmailAction(id: string) {
  return runAction(async () => {
    await requirePermission("campaigns", "read");
    const campaign = await campaignService.get(id);
    if (!campaign) throw new NotFoundError("Campaign");

    const settings = await newsletterSettingsService.get();
    // A stable placeholder id keeps the preview's unsubscribe link
    // deterministic without depending on a real subscriber existing.
    const sampleUnsubscribeUrl = unsubscribeUrl("preview");

    const { html } = campaignEmail({
      title: campaign.title || "(No heading yet)",
      contentHtml: campaign.content || "<p>(No content yet)</p>",
      ctaLabel: campaign.ctaLabel,
      ctaUrl: campaign.ctaUrl,
      secondaryContentHtml: campaign.secondaryContent,
      unsubscribeUrl: sampleUnsubscribeUrl,
      businessAddress: settings.businessAddress,
    });
    const text = campaignPlainText({
      title: campaign.title || "(No heading yet)",
      plainTextContent: campaign.plainTextContent || "(No content yet)",
      ctaLabel: campaign.ctaLabel,
      ctaUrl: campaign.ctaUrl,
      unsubscribeUrl: sampleUnsubscribeUrl,
    });

    return { html, text };
  }, "Preview ready.");
}

/**
 * Sends to explicitly entered addresses only — never touches
 * recipientCount, never changes campaign status, and is logged with
 * who sent it and when.
 */
export async function sendTestCampaignEmailAction(id: string, values: unknown) {
  return runAction(async () => {
    const actor = await requirePermission("campaigns", "update");

    const parsed = sendTestEmailSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Add at least one valid email address.", fieldErrorsFromZod(parsed.error));
    }

    const rateLimit = checkRateLimit(`newsletter-test:${actor.id}`);
    if (!rateLimit.allowed) {
      throw new ValidationError("Too many test sends — please wait a few minutes.");
    }

    const campaign = await campaignService.get(id);
    if (!campaign) throw new NotFoundError("Campaign");

    const [settings, from] = await Promise.all([
      newsletterSettingsService.get(),
      newsletterSettingsService.resolveFromAddress(),
    ]);
    const sampleUnsubscribeUrl = unsubscribeUrl("preview");
    const { html } = campaignEmail({
      title: campaign.title,
      contentHtml: campaign.content,
      ctaLabel: campaign.ctaLabel,
      ctaUrl: campaign.ctaUrl,
      secondaryContentHtml: campaign.secondaryContent,
      unsubscribeUrl: sampleUnsubscribeUrl,
      businessAddress: settings.businessAddress,
    });
    const text = campaignPlainText({
      title: campaign.title,
      plainTextContent: campaign.plainTextContent,
      ctaLabel: campaign.ctaLabel,
      ctaUrl: campaign.ctaUrl,
      unsubscribeUrl: sampleUnsubscribeUrl,
    });

    const results = await Promise.all(
      parsed.data.emails.map((to) =>
        emailService.send({
          to,
          from,
          subject: `[TEST] ${campaign.subject || "(No subject yet)"}`,
          html,
          text,
          ...(settings.replyToEmail ? { replyTo: settings.replyToEmail } : {}),
        })
      )
    );

    await auditLogService.record({
      userId: actor.id,
      action: "newsletter.test_send",
      metadata: { campaignId: id, recipients: parsed.data.emails },
    });

    const failureCount = results.filter((r) => !r.success).length;
    return { sent: results.length - failureCount, failed: failureCount };
  }, "Test email sent.");
}

/**
 * Sends to every confirmed, active subscriber. Safe against duplicate
 * triggers two ways: `beginSending` is a conditional DB update that
 * only one concurrent call can win, and `CampaignRecipient` rows are
 * snapshotted with a unique (campaignId, subscriberId) constraint, so
 * re-running the recipient loop after a crash never double-inserts or
 * double-sends to a row already marked SENT/FAILED (only PENDING rows
 * are processed).
 */
export async function sendCampaignAction(id: string) {
  return runAction(async () => {
    const actor = await requirePermission("campaigns", "send");

    const campaign = await campaignService.get(id);
    if (!campaign) throw new NotFoundError("Campaign");
    if (!campaign.subject.trim() || !campaign.content.trim()) {
      throw new ValidationError("Add a subject and content before sending.");
    }

    const started = await campaignService.beginSending(id);
    if (!started) {
      throw new ValidationError("This campaign is already sending or has already been sent.");
    }

    await auditLogService.record({
      userId: actor.id,
      action: "newsletter.campaign_send_started",
      metadata: { campaignId: id },
    });

    const [audience, settings, from] = await Promise.all([
      newsletterService.listActiveForCampaign(),
      newsletterSettingsService.get(),
      newsletterSettingsService.resolveFromAddress(),
    ]);

    await campaignRecipientRepository.createMany(
      id,
      audience.map((s) => s.id)
    );
    const pending = await campaignRecipientRepository.findPending(id);

    let successCount = 0;
    let failureCount = 0;

    // Any unexpected throw here (a DB hiccup, etc — emailService.send()
    // itself never throws) must still land the campaign in a terminal
    // status rather than leaving it stuck in SENDING forever with no
    // way for "Send now" to ever be tried again.
    try {
      for (let i = 0; i < pending.length; i += SEND_CHUNK_SIZE) {
        const chunk = pending.slice(i, i + SEND_CHUNK_SIZE);
        const results = await Promise.all(
          chunk.map(async (recipient) => {
            const recipientUnsubscribeUrl = unsubscribeUrl(recipient.subscriberId);
            const { html } = campaignEmail({
              title: campaign.title,
              contentHtml: campaign.content,
              ctaLabel: campaign.ctaLabel,
              ctaUrl: campaign.ctaUrl,
              secondaryContentHtml: campaign.secondaryContent,
              unsubscribeUrl: recipientUnsubscribeUrl,
              businessAddress: settings.businessAddress,
            });
            const text = campaignPlainText({
              title: campaign.title,
              plainTextContent: campaign.plainTextContent,
              ctaLabel: campaign.ctaLabel,
              ctaUrl: campaign.ctaUrl,
              unsubscribeUrl: recipientUnsubscribeUrl,
            });

            const result = await emailService.send({
              to: recipient.subscriber.email,
              from,
              subject: campaign.subject,
              html,
              text,
              ...(campaign.replyToEmail || settings.replyToEmail
                ? { replyTo: campaign.replyToEmail || settings.replyToEmail || undefined }
                : {}),
            });

            if (result.success) {
              await Promise.all([
                campaignRecipientRepository.markSent(recipient.id, result.id),
                newsletterService.recordEmailSuccess(recipient.subscriberId),
              ]);
            } else {
              await Promise.all([
                campaignRecipientRepository.markFailed(recipient.id, "Delivery failed"),
                newsletterService.recordEmailFailure(recipient.subscriberId, recipient.subscriber.emailFailureCount),
              ]);
            }
            return result.success;
          })
        );

        successCount += results.filter(Boolean).length;
        failureCount += results.filter((r) => !r).length;
      }
    } catch (error) {
      await campaignService.finalize(id, {
        status: "PARTIALLY_FAILED",
        recipientCount: pending.length,
        successCount,
        failureCount: pending.length - successCount,
      });
      throw error;
    }

    const campaignAfter = await campaignService.finalize(id, {
      status: failureCount === 0 ? "SENT" : "PARTIALLY_FAILED",
      recipientCount: pending.length,
      successCount,
      failureCount,
    });

    await auditLogService.record({
      userId: actor.id,
      action: "newsletter.campaign_sent",
      metadata: { campaignId: id, recipientCount: pending.length, successCount, failureCount },
    });

    revalidatePath(`${BASE_PATH}/${id}`);
    revalidatePath(BASE_PATH);
    return campaignAfter;
  }, "Campaign sent.");
}
