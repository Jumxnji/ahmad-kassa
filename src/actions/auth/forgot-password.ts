"use server";

import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/schemas/auth.schema";
import { passwordResetService } from "@/services/password-reset.service";
import { getResendClient } from "@/services/resend";
import { siteConfig } from "@/config/site";

const GENERIC_MESSAGE = "If an account exists for that email, we've sent a reset link.";

export async function requestPasswordResetAction(values: unknown) {
  return runAction(async () => {
    const parsed = forgotPasswordSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Enter a valid email address.", fieldErrorsFromZod(parsed.error));
    }

    const rateLimit = checkRateLimit(`forgot-password:${parsed.data.email.toLowerCase()}`);
    if (!rateLimit.allowed) {
      throw new ValidationError(`Too many attempts. Try again in ${rateLimit.retryAfterSeconds}s.`);
    }

    // Never reveal whether the email is registered — same message and
    // response shape either way.
    const result = await passwordResetService.requestReset(parsed.data.email);

    if (result) {
      const resetUrl = `${siteConfig.url}/admin/reset-password?token=${result.token}`;
      try {
        const resend = getResendClient();
        await resend.emails.send({
          from: "Ahmad Kassa <noreply@ahmadkassa.com>",
          to: parsed.data.email,
          subject: "Reset your dashboard password",
          text: `Hi ${result.name},\n\nSomeone requested a password reset for your Ahmad Kassa dashboard account. If this was you, set a new password here (valid for 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email — your password won't change.`,
        });
      } catch (error) {
        console.error("[requestPasswordResetAction] Resend not configured or failed:", error);
      }
    }

    return null;
  }, GENERIC_MESSAGE);
}
