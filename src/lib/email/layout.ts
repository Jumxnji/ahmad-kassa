import { siteConfig } from "@/config/site";

/**
 * Shared branded shell for every transactional email — logo, brand
 * colours/typography, and a consistent footer. Every template in
 * `templates.ts` renders its own content and passes it through this,
 * so a future template (newsletter, course receipt) never has to
 * rebuild the header/footer chrome.
 *
 * Styles are inlined throughout (not a <style> block) because most
 * email clients — Outlook desktop especially — strip <style> tags or
 * apply them unreliably. Web fonts aren't loaded for the same reason;
 * the stacks below are the closest email-safe approximation of the
 * site's Newsreader/Manrope pairing.
 */

const NAVY = "#0f1e33";
const GOLD = "#b8924a";
const PAPER = "#faf8f3";
const INK = "#17181c";
const STONE = "#706c63";
const BORDER = "#e2dccb";

const DISPLAY_FONT = "Georgia, 'Times New Roman', serif";
const BODY_FONT = "-apple-system, Helvetica, Arial, sans-serif";

interface EmailLayoutOptions {
  /** Short preview text shown next to the subject line in inbox lists — hidden in the body. */
  preheader?: string;
  /**
   * Replaces the default "This is a transactional message…" footer
   * line — used by newsletter/campaign emails to show the unsubscribe
   * link, business address, and preference-management placeholder
   * instead, since a subscribed broadcast isn't really "an action you
   * took." Pre-escaped/trusted HTML, not user input.
   */
  footerNote?: string;
}

export function renderEmailLayout(bodyHtml: string, options: EmailLayoutOptions = {}): string {
  // Digital lockup (mark + live text), not a flattened logo-with-text
  // image — matches how the site header composes the identity, and
  // avoids depending on a hand-shaped-text asset this project has no
  // reliable pipeline to regenerate. See public/brand/README.md.
  const markUrl = new URL("/brand/exports/logo-mark-256.png", siteConfig.url).toString();
  const siteUrl = siteConfig.url;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${siteConfig.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};font-family:${BODY_FONT};">
${
  options.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(options.preheader)}</div>`
    : ""
}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAPER};padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid ${BORDER};">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:10px;vertical-align:middle;">
                  <img src="${markUrl}" alt="" width="28" style="display:block;height:auto;max-width:28px;" />
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-family:${DISPLAY_FONT};font-size:20px;color:${NAVY};letter-spacing:0.01em;">${siteConfig.name}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;font-family:${BODY_FONT};color:${INK};font-size:15px;line-height:1.6;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;border-top:1px solid ${BORDER};">
            <p style="margin:0 0 6px;font-family:${DISPLAY_FONT};font-size:15px;color:${NAVY};">${siteConfig.name}</p>
            <p style="margin:0 0 12px;font-size:13px;color:${STONE};">${siteConfig.tagline}</p>
            <p style="margin:0;font-size:12px;color:${STONE};">
              <a href="${siteUrl}" style="color:${STONE};text-decoration:underline;">${siteUrl.replace(/^https?:\/\//, "")}</a>
              &nbsp;·&nbsp;
              <a href="${new URL("/contact", siteUrl).toString()}" style="color:${STONE};text-decoration:underline;">Contact</a>
            </p>
            <p style="margin:12px 0 0;font-size:11px;line-height:1.6;color:${STONE};">
              ${
                options.footerNote ??
                `This is a transactional message sent because of an action you took on ${siteConfig.name}.`
              }
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const emailBrand = { NAVY, GOLD, PAPER, INK, STONE, BORDER, DISPLAY_FONT, BODY_FONT };
