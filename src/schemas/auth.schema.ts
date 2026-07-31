import { z } from "zod";

// Accepts a real boolean (client form submission) or a "true"/"false"
// string (NextAuth's Credentials provider always serializes its fields
// as strings, since the same shape can come from a raw HTML form post).
const booleanish = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .optional()
  .transform((v) => v === true || v === "true");

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Enter your password."),
  remember: booleanish,
});
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginFormValues = { email: string; password: string; remember: boolean };

export const forgotPasswordSchema = z.object({
  email: z.email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/** Shared password policy — used by reset-password and admin-triggered resets. */
export const passwordPolicy = z
  .string()
  .min(8, "At least 8 characters.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordPolicy,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
