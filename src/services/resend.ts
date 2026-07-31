import "server-only";
import { Resend } from "resend";

/**
 * Lazily instantiated so the app can build and run locally without a
 * RESEND_API_KEY set. Server actions that send mail should call
 * getResendClient() at the point of use, not at module scope.
 */
let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}
