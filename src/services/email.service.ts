import "server-only";
import { getResendClient } from "@/services/resend";
import { siteSettingsService } from "@/services/site-settings.service";
import { CONTACT_EMAIL } from "@/constants/site";

const FROM_ADDRESS = "Ahmad Kassa <noreply@ahmadkassa.com>";
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 600;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  /** Set to the submitter's address so a reply from the inbox goes straight to them. */
  replyTo?: string;
  /** Overrides the default sender — used by newsletter mail, whose sender identity is admin-configurable via NewsletterSettings. */
  from?: string;
  /** Plain-text part, alongside the HTML — every newsletter/campaign send sets this. */
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  /** Resend's message id — used to correlate a later delivery webhook event (bounce/complaint) back to this send. */
  id?: string;
}

export const emailService = {
  /**
   * The address internal notifications go to — read from the
   * admin-configurable Site Settings row, falling back to the static
   * constant only if settings haven't been saved yet. Always resolved
   * server-side; never pass this value into a client component or a
   * public page.
   */
  async getAdminRecipient(): Promise<string> {
    const settings = await siteSettingsService.get();
    return settings?.contactEmail || CONTACT_EMAIL;
  },

  /**
   * Best-effort send with a short retry — Resend is called at most
   * twice, a short delay apart, before giving up. Never throws: mail
   * delivery failing should never surface as a user-facing error once
   * the underlying record (question/message) is already saved.
   */
  async send(input: SendEmailInput): Promise<SendEmailResult> {
    let client;
    try {
      client = getResendClient();
    } catch (error) {
      console.error("[email] Resend is not configured:", error);
      if (process.env.NODE_ENV !== "production") {
        const firstLink = input.html.match(/href="([^"]+)"/)?.[1];
        console.log(`[email:dev-preview] to=${input.to} subject="${input.subject}"${firstLink ? ` link=${firstLink}` : ""}`);
      }
      return { success: false };
    }

    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const result = await client.emails.send({
          from: input.from ?? FROM_ADDRESS,
          to: input.to,
          subject: input.subject,
          html: input.html,
          ...(input.replyTo ? { replyTo: input.replyTo } : {}),
          ...(input.text ? { text: input.text } : {}),
        });
        if (result.error) throw new Error(result.error.message);
        return { success: true, id: result.data?.id };
      } catch (error) {
        lastError = error;
        if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
      }
    }

    console.error(`[email] Failed to send "${input.subject}" to ${input.to} after ${MAX_ATTEMPTS} attempts:`, lastError);
    return { success: false };
  },
};
