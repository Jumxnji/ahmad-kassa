"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { signIn } from "@/auth";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { loginSchema } from "@/schemas/auth.schema";
import { auditLogService } from "@/services/audit-log.service";
import { userService } from "@/services/user.service";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export async function loginAction(values: unknown) {
  return runAction(async () => {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const headerList = await headers();
    const ipAddress = headerList.get("x-forwarded-for") ?? headerList.get("x-real-ip") ?? undefined;

    const rateLimit = checkRateLimit(`login:${parsed.data.email.toLowerCase()}`);
    if (!rateLimit.allowed) {
      throw new ValidationError(
        `Too many attempts. Try again in ${rateLimit.retryAfterSeconds}s.`
      );
    }

    try {
      await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        remember: parsed.data.remember ? "true" : "false",
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        const user = await userService.getByEmail(parsed.data.email);
        await auditLogService.record({
          userId: user?.id ?? null,
          action: "login.failed",
          metadata: { email: parsed.data.email },
          ipAddress,
        });
        throw new ValidationError("Incorrect email or password.");
      }
      throw error;
    }

    resetRateLimit(`login:${parsed.data.email.toLowerCase()}`);

    const user = await userService.getByEmail(parsed.data.email);
    if (user) {
      await userService.recordLogin(user.id);
      await auditLogService.record({ userId: user.id, action: "login.success", ipAddress });
    }

    return { redirectTo: "/admin" };
  }, "Signed in.");
}
