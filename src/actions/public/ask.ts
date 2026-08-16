"use server";

import { runAction, fieldErrorsFromZod } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { checkFormRateLimit, isHoneypotTriggered } from "@/lib/spam-protection";
import { questionService } from "@/services/question.service";
import { emailService } from "@/services/email.service";
import { questionReceivedEmail, adminNewQuestionEmail } from "@/lib/email/templates";
import { askFormSchema } from "@/validators/public/ask-form.validator";
import { siteConfig } from "@/config/site";
import type { ActionResultWithData } from "@/types/actions";

const GENERIC_SUCCESS_MESSAGE = "Your question has been sent — thank you.";

export async function submitQuestion(
  values: unknown
): Promise<ActionResultWithData<{ referenceNumber: string }>> {
  return runAction(async () => {
    const parsed = askFormSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    // Honeypot: a bot filled in a field real visitors never see. Pretend
    // to succeed — telling it "caught you" only teaches it to adapt.
    if (isHoneypotTriggered(parsed.data.company)) {
      return { referenceNumber: "" };
    }

    const rateLimit = await checkFormRateLimit("ask");
    if (!rateLimit.allowed) {
      throw new ValidationError("Too many submissions — please try again in a few minutes.");
    }

    const duplicate = await questionService.findRecentDuplicate(parsed.data.email, parsed.data.question);
    if (duplicate) {
      return { referenceNumber: duplicate.referenceNumber };
    }

    const question = await questionService.submit(parsed.data);

    const dashboardUrl = new URL(`/admin/ask-ahmad/${question.id}`, siteConfig.url).toString();

    const [confirmation] = await Promise.all([
      emailService.send({
        to: question.email,
        ...questionReceivedEmail({
          name: question.name,
          referenceNumber: question.referenceNumber,
          category: question.category,
          question: question.initialMessage,
        }),
      }),
      emailService.getAdminRecipient().then((to) =>
        emailService.send({
          to,
          replyTo: question.email,
          ...adminNewQuestionEmail({
            referenceNumber: question.referenceNumber,
            name: question.name,
            email: question.email,
            category: question.category,
            priority: question.priority,
            question: question.initialMessage,
            dashboardUrl,
          }),
        })
      ),
    ]);

    if (confirmation.success) {
      await questionService.markNotificationSent(question.id);
    }

    return { referenceNumber: question.referenceNumber };
  }, GENERIC_SUCCESS_MESSAGE);
}
