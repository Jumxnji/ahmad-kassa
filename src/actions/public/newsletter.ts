"use server";

import { newsletterService } from "@/services/newsletter.service";
import { newsletterFormSchema } from "@/validators/public/newsletter-form.validator";
import type { ActionResult } from "@/types/actions";

export async function subscribeToNewsletter(values: unknown): Promise<ActionResult> {
  const parsed = newsletterFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Enter a valid email address." };
  }

  try {
    await newsletterService.subscribe(parsed.data);
  } catch (error) {
    console.error("[subscribeToNewsletter] Failed to save subscriber:", error);
    return {
      success: false,
      message: "Something went wrong on our end — please try again.",
    };
  }

  return {
    success: true,
    message: "You're subscribed. Welcome aboard.",
  };
}
