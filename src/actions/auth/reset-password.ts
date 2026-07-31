"use server";

import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import { passwordResetService } from "@/services/password-reset.service";
import { auditLogService } from "@/services/audit-log.service";

export async function resetPasswordAction(values: unknown) {
  return runAction(async () => {
    const parsed = resetPasswordSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const result = await passwordResetService.consumeReset(parsed.data.token, parsed.data.password);
    if (!result.success) {
      throw new ValidationError(result.message);
    }

    await auditLogService.record({ userId: result.userId, action: "password.reset" });

    return null;
  }, "Password updated — you can now sign in.");
}
