import { NextRequest, NextResponse } from "next/server";
import { verifyResendWebhookSignature } from "@/lib/webhook-signature";
import { campaignRecipientRepository } from "@/repositories/campaign-recipient.repository";
import { newsletterService } from "@/services/newsletter.service";

export const runtime = "nodejs";

interface ResendWebhookEvent {
  type: string;
  data: { email_id?: string };
}

/**
 * Delivery events from Resend — bounces/complaints suppress the matching
 * subscriber. Processing is naturally idempotent: setting an
 * already-SUPPRESSED subscriber to BOUNCED/COMPLAINED again (or marking
 * an already-FAILED recipient FAILED again) is a no-op end state, so no
 * separate processed-event-id table is needed. Open/click events are
 * intentionally not processed — see features.newsletterAnalytics.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook:resend] RESEND_WEBHOOK_SECRET is not set — rejecting.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing signature headers" }, { status: 401 });
  }

  const payload = await request.text();
  const valid = verifyResendWebhookSignature(
    payload,
    { id: svixId, timestamp: svixTimestamp, signature: svixSignature },
    secret
  );
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: ResendWebhookEvent;
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const emailId = event.data?.email_id;
  if (emailId && (event.type === "email.bounced" || event.type === "email.complained")) {
    const recipient = await campaignRecipientRepository.findByProviderMessageId(emailId);
    if (recipient) {
      await Promise.all([
        recipient.status === "SENT" ? campaignRecipientRepository.markFailed(recipient.id, event.type) : Promise.resolve(),
        newsletterService.suppressForDeliveryEvent(
          recipient.subscriberId,
          event.type === "email.bounced" ? "BOUNCED" : "COMPLAINED",
          event.type === "email.bounced" ? "Resend reported a bounce." : "Resend reported a spam complaint."
        ),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
