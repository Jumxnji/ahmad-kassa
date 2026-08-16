"use server";

import { runAction, fieldErrorsFromZod } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { checkFormRateLimit, isHoneypotTriggered } from "@/lib/spam-protection";
import { newsletterService, type ConfirmOutcome, type UnsubscribeOutcome, type ResubscribeOutcome } from "@/services/newsletter.service";
import { newsletterSettingsService } from "@/services/newsletter-settings.service";
import { emailService } from "@/services/email.service";
import { subscriptionConfirmationEmail, welcomeEmail } from "@/lib/email/templates";
import { confirmUrl, unsubscribeUrl } from "@/lib/newsletter-urls";
import {
  newsletterSubscribeSchema,
  NEWSLETTER_CONSENT_VERSION,
} from "@/validators/public/newsletter-form.validator";
import type { ActionResult } from "@/types/actions";
import type { NewsletterSubscriber } from "@/generated/prisma/client";

const GENERIC_SUCCESS_MESSAGE = "Check your inbox to confirm your subscription.";

async function sendConfirmationEmail(subscriber: Pick<NewsletterSubscriber, "email" | "firstName">, rawToken: string) {
  const [settings, from] = await Promise.all([
    newsletterSettingsService.get(),
    newsletterSettingsService.resolveFromAddress(),
  ]);
  const template = subscriptionConfirmationEmail({
    firstName: subscriber.firstName,
    confirmUrl: confirmUrl(rawToken),
  });
  return emailService.send({
    to: subscriber.email,
    from,
    subject: settings.confirmationSubject || template.subject,
    html: template.html,
    ...(settings.replyToEmail ? { replyTo: settings.replyToEmail } : {}),
  });
}

async function sendWelcomeEmail(subscriber: Pick<NewsletterSubscriber, "id" | "email" | "firstName">) {
  const [settings, from] = await Promise.all([
    newsletterSettingsService.get(),
    newsletterSettingsService.resolveFromAddress(),
  ]);
  const template = welcomeEmail({
    firstName: subscriber.firstName,
    unsubscribeUrl: unsubscribeUrl(subscriber.id),
    businessAddress: settings.businessAddress,
  });
  return emailService.send({
    to: subscriber.email,
    from,
    subject: settings.welcomeSubject || template.subject,
    html: template.html,
    ...(settings.replyToEmail ? { replyTo: settings.replyToEmail } : {}),
  });
}

/** Called from the public Newsletter form (home, footer, book page, courses, dedicated newsletter page). */
export async function subscribeToNewsletter(values: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = newsletterSubscribeSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    // Honeypot: pretend to succeed — telling a bot "caught you" only teaches it to adapt.
    if (isHoneypotTriggered(parsed.data.company)) {
      return;
    }

    const rateLimit = await checkFormRateLimit("newsletter");
    if (!rateLimit.allowed) {
      throw new ValidationError("Too many submissions — please try again in a few minutes.");
    }

    const result = await newsletterService.startSubscription({
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      source: parsed.data.source,
      consentTextVersion: NEWSLETTER_CONSENT_VERSION,
    });

    if (result.rawToken) {
      await sendConfirmationEmail(result.subscriber, result.rawToken);
    }
  }, GENERIC_SUCCESS_MESSAGE);
}

export async function resendNewsletterConfirmation(email: string): Promise<ActionResult> {
  return runAction(async () => {
    const rateLimit = await checkFormRateLimit("newsletter-resend");
    if (!rateLimit.allowed) {
      throw new ValidationError("Too many requests — please try again in a few minutes.");
    }

    const result = await newsletterService.resendConfirmation(email);
    if (result) {
      await sendConfirmationEmail(result.subscriber, result.rawToken);
    }
  }, "If that address is pending confirmation, a new email is on its way.");
}

/** Called (idempotently) from the /newsletter/confirm page during render. */
export async function confirmNewsletterSubscription(token: string): Promise<ConfirmOutcome> {
  const rateLimit = await checkFormRateLimit("newsletter-token");
  if (!rateLimit.allowed) return { outcome: "invalid" };

  const result = await newsletterService.confirm(token);
  if (result.outcome === "confirmed") {
    await sendWelcomeEmail(result.subscriber);
  }
  return result;
}

/** Called from the /newsletter/unsubscribe page's "Confirm unsubscribe" button. */
export async function unsubscribeFromNewsletter(subscriberId: string, token: string): Promise<UnsubscribeOutcome> {
  const rateLimit = await checkFormRateLimit("newsletter-token");
  if (!rateLimit.allowed) return { outcome: "invalid" };

  return newsletterService.unsubscribe(subscriberId, token);
}

/** Called from the unsubscribe-success screen's "Resubscribe" button. */
export async function resubscribeToNewsletter(subscriberId: string, token: string): Promise<ResubscribeOutcome> {
  const rateLimit = await checkFormRateLimit("newsletter-token");
  if (!rateLimit.allowed) return { outcome: "invalid" };

  const result = await newsletterService.resubscribe(subscriberId, token);
  if (result.outcome === "started") {
    await sendConfirmationEmail(result.subscriber, result.rawToken);
  }
  return result;
}
