import { escapeHtml, emailBrand, renderEmailLayout } from "@/lib/email/layout";

const { NAVY, GOLD, DISPLAY_FONT, STONE, BORDER } = emailBrand;

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:${DISPLAY_FONT};font-weight:400;font-size:24px;line-height:1.3;color:${NAVY};">${escapeHtml(text)}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;">${text}</p>`;
}

function referenceBadge(referenceNumber: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="background-color:#f1e6cd;border-radius:6px;padding:10px 16px;font-family:monospace;font-size:14px;color:#7c5f2f;letter-spacing:0.02em;">Reference: <strong>${escapeHtml(referenceNumber)}</strong></td></tr></table>`;
}

function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;"><tr><td style="background-color:${GOLD};border-radius:8px;"><a href="${url}" style="display:inline-block;padding:12px 24px;font-family:${emailBrand.BODY_FONT};font-size:14px;font-weight:600;color:${NAVY};text-decoration:none;">${escapeHtml(label)}</a></td></tr></table>`;
}

function infoTable(rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      (row) =>
        `<tr><td style="padding:8px 0;font-size:13px;color:${STONE};width:120px;vertical-align:top;">${escapeHtml(row.label)}</td><td style="padding:8px 0;font-size:14px;color:${NAVY};vertical-align:top;">${escapeHtml(row.value)}</td></tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER};">${rowsHtml}</table>`;
}

function excerptBlock(text: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="background-color:#f4f0e7;border-radius:8px;padding:16px 18px;font-size:14px;line-height:1.6;color:${NAVY};">${escapeHtml(text)}</td></tr></table>`;
}

const CATEGORY_LABELS: Record<string, string> = {
  MARRIAGE: "Marriage",
  FAMILY: "Family",
  AQEEDAH: "Aqeedah",
  FIQH: "Fiqh",
  RUQYAH: "Ruqyah",
  MENTAL_HEALTH: "Mental Health",
  OTHER: "Other",
};

/** Sent to the visitor immediately after they submit Ask Ahmad. */
export function questionReceivedEmail(input: {
  name: string;
  referenceNumber: string;
  category: string;
  question: string;
}): { subject: string; html: string } {
  const subject = `We've received your question (Reference: ${input.referenceNumber})`;
  const body = [
    heading("Your question has been received"),
    paragraph(
      `Assalamu alaikum ${escapeHtml(input.name)},<br />Thank you for reaching out. Your question has been received and will be reviewed personally.`
    ),
    referenceBadge(input.referenceNumber),
    infoTable([{ label: "Category", value: CATEGORY_LABELS[input.category] ?? input.category }]),
    paragraph("For your records, here's what you submitted:"),
    excerptBlock(input.question),
    paragraph(
      "Not every question can receive a reply — some are answered privately, and the volume received means a response isn't guaranteed. Keep your reference number handy if you'd like to follow up."
    ),
  ].join("");
  return { subject, html: renderEmailLayout(body, { preheader: subject }) };
}

/** Sent to the visitor immediately after they submit the Contact form. */
export function contactReceivedEmail(input: { name: string; subject: string }): {
  subject: string;
  html: string;
} {
  const subject = "We've received your message";
  const body = [
    heading("Your message has been received"),
    paragraph(`Assalamu alaikum ${escapeHtml(input.name)},<br />Thank you for getting in touch — your message has been received and will be reviewed shortly.`),
    infoTable([{ label: "Subject", value: input.subject }]),
    paragraph("We aim to respond as soon as possible, though response times can vary with volume."),
  ].join("");
  return { subject, html: renderEmailLayout(body, { preheader: subject }) };
}

/** Internal alert — new Ask Ahmad submission. */
export function adminNewQuestionEmail(input: {
  referenceNumber: string;
  name: string;
  email: string;
  category: string;
  priority: string;
  question: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const subject = `New question (${CATEGORY_LABELS[input.category] ?? input.category}) from ${input.name}`;
  const body = [
    heading("New question submitted"),
    referenceBadge(input.referenceNumber),
    infoTable([
      { label: "From", value: `${input.name} <${input.email}>` },
      { label: "Category", value: CATEGORY_LABELS[input.category] ?? input.category },
      { label: "Priority", value: input.priority },
    ]),
    excerptBlock(input.question),
    button("Open in dashboard", input.dashboardUrl),
  ].join("");
  return { subject, html: renderEmailLayout(body, { preheader: subject }) };
}

/** Internal alert — new Contact form submission. */
export function adminNewContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  reason: string;
  message: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const subject = `New enquiry (${input.reason}) from ${input.name}`;
  const body = [
    heading("New contact message"),
    infoTable([
      { label: "From", value: `${input.name} <${input.email}>` },
      { label: "Subject", value: input.subject },
      { label: "Reason", value: input.reason },
    ]),
    excerptBlock(input.message),
    button("Open in dashboard", input.dashboardUrl),
  ].join("");
  return { subject, html: renderEmailLayout(body, { preheader: subject }) };
}

// ---------------------------------------------------------------------
// Newsletter (Sprint 8)
// ---------------------------------------------------------------------

function newsletterFooterNote(input: { unsubscribeUrl: string; businessAddress?: string | null }): string {
  return [
    `<a href="${input.unsubscribeUrl}" style="color:${STONE};text-decoration:underline;">Unsubscribe</a> from these announcements at any time. Granular email preferences are coming soon.`,
    input.businessAddress ? escapeHtml(input.businessAddress) : "",
  ]
    .filter(Boolean)
    .join("<br />");
}

/** Sent immediately after a public newsletter signup (or resubscribe) — the one email a PENDING subscriber ever receives. */
export function subscriptionConfirmationEmail(input: { firstName?: string | null; confirmUrl: string }): {
  subject: string;
  html: string;
} {
  const subject = "Confirm your subscription";
  const greeting = input.firstName ? `Assalamu alaikum ${escapeHtml(input.firstName)},` : "Assalamu alaikum,";
  const body = [
    heading("Confirm your subscription"),
    paragraph(
      `${greeting}<br />One more step — confirm your email address to start receiving occasional announcements: new books, courses, seminars, lectures, and articles.`
    ),
    button("Confirm subscription", input.confirmUrl),
    paragraph(
      `<span style="font-size:13px;color:${STONE};">If you didn't request this, you can safely ignore this email — you won't be subscribed unless you confirm.</span>`
    ),
  ].join("");
  return { subject, html: renderEmailLayout(body, { preheader: subject }) };
}

/** Sent right after a subscriber confirms — short, on purpose. */
export function welcomeEmail(input: {
  firstName?: string | null;
  unsubscribeUrl: string;
  businessAddress?: string | null;
}): { subject: string; html: string } {
  const subject = "Welcome — you're subscribed";
  const greeting = input.firstName ? `Assalamu alaikum ${escapeHtml(input.firstName)},` : "Assalamu alaikum,";
  const body = [
    heading("You're subscribed"),
    paragraph(
      `${greeting}<br />Thank you for confirming — you'll now hear about new books, courses, seminars, lectures, and articles as they happen. Nothing more frequent than that.`
    ),
  ].join("");
  return {
    subject,
    html: renderEmailLayout(body, {
      preheader: subject,
      footerNote: newsletterFooterNote(input),
    }),
  };
}

/**
 * The one shared shell every sent Campaign renders through. `contentHtml`
 * is trusted here — it's sanitized once, at save time, by
 * sanitizeRichText() (see src/lib/sanitize-rich-text.ts), the same
 * write-time-only pattern already used for Book descriptions and the
 * About biography.
 */
export function campaignEmail(input: {
  title: string;
  contentHtml: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  secondaryContentHtml?: string | null;
  unsubscribeUrl: string;
  businessAddress?: string | null;
}): { html: string } {
  const body = [
    heading(input.title),
    `<div>${input.contentHtml}</div>`,
    input.ctaLabel && input.ctaUrl ? button(input.ctaLabel, input.ctaUrl) : "",
    input.secondaryContentHtml ? `<div style="margin-top:20px;">${input.secondaryContentHtml}</div>` : "",
  ].join("");
  return {
    html: renderEmailLayout(body, {
      footerNote: newsletterFooterNote(input),
    }),
  };
}

/**
 * Plain-text fallback for a sent campaign — a minimal, readable
 * rendering (not a full HTML-to-text conversion) used as the `text`
 * part of the outgoing email and shown in the campaign editor's
 * plain-text preview.
 */
export function campaignPlainText(input: {
  title: string;
  plainTextContent: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  unsubscribeUrl: string;
}): string {
  const lines = [input.title, "", input.plainTextContent];
  if (input.ctaLabel && input.ctaUrl) {
    lines.push("", `${input.ctaLabel}: ${input.ctaUrl}`);
  }
  lines.push("", "---", `Unsubscribe: ${input.unsubscribeUrl}`);
  return lines.join("\n");
}
