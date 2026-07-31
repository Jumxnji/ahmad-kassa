"use server";

import { CONTACT_EMAIL } from "@/constants/site";
import { getResendClient } from "@/services/resend";
import { questionService } from "@/services/question.service";
import { askFormSchema } from "@/validators/public/ask-form.validator";
import type { ActionResult } from "@/types/actions";

export async function submitQuestion(values: unknown): Promise<ActionResult> {
  const parsed = askFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: "Please check the form and try again." };
  }

  try {
    await questionService.submit(parsed.data);
  } catch (error) {
    console.error("[submitQuestion] Failed to save question:", error);
    return {
      success: false,
      message: "Something went wrong on our end — please try again.",
    };
  }

  // Notify by email, best-effort — the question is already saved, so a
  // failed/unconfigured mail send shouldn't surface as an error to the user.
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: "Ahmad Kassa <noreply@ahmadkassa.com>",
      to: CONTACT_EMAIL,
      replyTo: parsed.data.email,
      subject: `New question (${parsed.data.topic}) from ${parsed.data.name}`,
      text: parsed.data.question,
    });
  } catch (error) {
    console.error("[submitQuestion] Resend is not configured yet:", error);
  }

  return {
    success: true,
    message: "Your question has been sent — thank you.",
  };
}
