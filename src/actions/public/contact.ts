"use server";

import { CONTACT_EMAIL } from "@/constants/site";
import { getResendClient } from "@/services/resend";
import { contactService } from "@/services/contact.service";
import { contactFormSchema } from "@/validators/public/contact-form.validator";
import type { ActionResult } from "@/types/actions";

export async function submitContactForm(values: unknown): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Please check the form and try again." };
  }

  try {
    await contactService.submit(parsed.data);
  } catch (error) {
    console.error("[submitContactForm] Failed to save message:", error);
    return {
      success: false,
      message: "Something went wrong on our end — please try again.",
    };
  }

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: "Ahmad Kassa <noreply@ahmadkassa.com>",
      to: CONTACT_EMAIL,
      replyTo: parsed.data.email,
      subject: `New enquiry (${parsed.data.reason}) from ${parsed.data.name}`,
      text: parsed.data.message,
    });
  } catch (error) {
    console.error("[submitContactForm] Resend is not configured yet:", error);
  }

  return {
    success: true,
    message: "Thank you — your message has been sent.",
  };
}
