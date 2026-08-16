"use server";

import { runAction, fieldErrorsFromZod } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { checkFormRateLimit, isHoneypotTriggered } from "@/lib/spam-protection";
import { contactService } from "@/services/contact.service";
import { emailService } from "@/services/email.service";
import { contactReceivedEmail, adminNewContactEmail } from "@/lib/email/templates";
import { contactFormSchema } from "@/validators/public/contact-form.validator";
import { siteConfig } from "@/config/site";
import type { ActionResult } from "@/types/actions";

export async function submitContactForm(values: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    if (isHoneypotTriggered(parsed.data.company)) {
      return;
    }

    const rateLimit = await checkFormRateLimit("contact");
    if (!rateLimit.allowed) {
      throw new ValidationError("Too many submissions — please try again in a few minutes.");
    }

    const duplicate = await contactService.findRecentDuplicate(parsed.data.email, parsed.data.message);
    if (duplicate) {
      return;
    }

    const message = await contactService.submit(parsed.data);

    const dashboardUrl = new URL("/admin/contact", siteConfig.url).toString();

    await Promise.all([
      emailService.send({
        to: message.email,
        ...contactReceivedEmail({ name: message.name, subject: message.subject }),
      }),
      emailService.getAdminRecipient().then((to) =>
        emailService.send({
          to,
          replyTo: message.email,
          ...adminNewContactEmail({
            name: message.name,
            email: message.email,
            subject: message.subject,
            reason: message.reason,
            message: message.message,
            dashboardUrl,
          }),
        })
      ),
    ]);
  }, "Thank you — your message has been sent.");
}
