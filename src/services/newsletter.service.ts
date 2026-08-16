import "server-only";
import { newsletterRepository } from "@/repositories/newsletter.repository";
import { generateToken, hashToken, isTokenExpired, verifyUnsubscribeToken } from "@/lib/newsletter-token";
import { normalizeEmail } from "@/lib/normalize-email";
import { newsletterSettingsService } from "@/services/newsletter-settings.service";
import { NEVER_AUTO_REACTIVATE_STATUSES } from "@/schemas/newsletter.schema";
import type { Prisma, $Enums, NewsletterSubscriber } from "@/generated/prisma/client";
import type { ParsedListQuery } from "@/lib/list-query";

const SORTABLE_FIELDS = new Set(["email", "firstName", "status", "source", "createdAt", "confirmedAt", "lastEmailSentAt"]);

async function issueConfirmationToken(): Promise<{ rawToken: string; hash: string; expiresAt: Date }> {
  const settings = await newsletterSettingsService.get();
  const rawToken = generateToken();
  const expiresAt = new Date(Date.now() + settings.confirmationTokenExpiryHours * 60 * 60 * 1000);
  return { rawToken, hash: hashToken(rawToken), expiresAt };
}

export interface StartSubscriptionInput {
  email: string;
  firstName?: string;
  preferredLanguage?: string;
  source: $Enums.SubscriberSource;
  consentTextVersion: string;
}

export type ConfirmOutcome =
  | { outcome: "confirmed"; subscriber: NewsletterSubscriber }
  | { outcome: "already-confirmed"; subscriber: NewsletterSubscriber }
  | { outcome: "expired"; subscriber: NewsletterSubscriber }
  | { outcome: "invalid" };

export type UnsubscribeOutcome =
  | { outcome: "unsubscribed"; subscriber: NewsletterSubscriber }
  | { outcome: "already-unsubscribed"; subscriber: NewsletterSubscriber }
  | { outcome: "invalid" };

export type ResubscribeOutcome =
  | { outcome: "started"; subscriber: NewsletterSubscriber; rawToken: string }
  | { outcome: "not-eligible"; subscriber: NewsletterSubscriber }
  | { outcome: "invalid" };

export const newsletterService = {
  async listPaged(
    query: ParsedListQuery,
    filters: { status?: $Enums.SubscriberStatus; source?: $Enums.SubscriberSource; language?: string }
  ) {
    const where: Prisma.NewsletterSubscriberWhereInput = {
      ...(query.q
        ? {
            OR: [
              { email: { contains: query.q, mode: "insensitive" } },
              { firstName: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.source ? { source: filters.source } : {}),
      ...(filters.language ? { preferredLanguage: filters.language } : {}),
    };
    const orderBy: Prisma.NewsletterSubscriberOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      newsletterRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      newsletterRepository.count(where),
    ]);

    return { rows, total };
  },

  /** Unpaginated — used for CSV export so it isn't limited to one page. */
  listAll(filters: { q?: string; status?: $Enums.SubscriberStatus; source?: $Enums.SubscriberSource }) {
    const where: Prisma.NewsletterSubscriberWhereInput = {
      ...(filters.q
        ? { email: { contains: filters.q, mode: "insensitive" } }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.source ? { source: filters.source } : {}),
    };
    return newsletterRepository.findMany({ where });
  },

  get: (id: string) => newsletterRepository.findById(id),

  async countByStatus(): Promise<Record<$Enums.SubscriberStatus, number>> {
    const statuses: $Enums.SubscriberStatus[] = ["PENDING", "ACTIVE", "UNSUBSCRIBED", "SUPPRESSED", "BOUNCED", "COMPLAINED"];
    const counts = await Promise.all(statuses.map((status) => newsletterRepository.count({ status })));
    return Object.fromEntries(statuses.map((status, i) => [status, counts[i]])) as Record<$Enums.SubscriberStatus, number>;
  },

  countActive: () => newsletterRepository.count({ status: "ACTIVE" }),

  /** The only audience a campaign may ever send to — confirmed, active subscribers. */
  listActiveForCampaign: () => newsletterRepository.findActiveForCampaign(),

  countSignedUpInLastDays: (days: number) =>
    newsletterRepository.count({ createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } }),

  recentActivity: (limit: number) =>
    newsletterRepository.findMany({ orderBy: { updatedAt: "desc" }, take: limit }),

  recentFailures: (limit: number) =>
    newsletterRepository.findMany({
      where: { emailFailureCount: { gt: 0 } },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),

  /**
   * Entry point for every public signup submission. Callers (the
   * Server Action) have already run the honeypot/rate-limit checks —
   * this only handles the state machine. Returns the row plus a raw
   * confirmation token to email, or null when no email should be sent
   * (already active, or a suppressed address that must never reveal
   * its status).
   */
  async startSubscription(
    input: StartSubscriptionInput
  ): Promise<{ subscriber: NewsletterSubscriber; rawToken: string } | { subscriber: NewsletterSubscriber; rawToken: null }> {
    const normalizedEmail = normalizeEmail(input.email);
    const existing = await newsletterRepository.findByNormalizedEmail(normalizedEmail);
    const { rawToken, hash, expiresAt } = await issueConfirmationToken();

    if (!existing) {
      const subscriber = await newsletterRepository.create({
        email: input.email,
        normalizedEmail,
        firstName: input.firstName || null,
        preferredLanguage: input.preferredLanguage || "en",
        source: input.source,
        consentTextVersion: input.consentTextVersion,
        consentedAt: new Date(),
        status: "PENDING",
        confirmationTokenHash: hash,
        confirmationTokenExpiresAt: expiresAt,
      });
      return { subscriber, rawToken };
    }

    if (existing.status === "ACTIVE") {
      return { subscriber: existing, rawToken: null };
    }

    if (NEVER_AUTO_REACTIVATE_STATUSES.includes(existing.status as (typeof NEVER_AUTO_REACTIVATE_STATUSES)[number])) {
      return { subscriber: existing, rawToken: null };
    }

    // PENDING (resend) or UNSUBSCRIBED (resubscribe) — both restart a
    // fresh confirmation cycle without touching the long-lived
    // unsubscribe token.
    const subscriber = await newsletterRepository.update(existing.id, {
      firstName: input.firstName || existing.firstName,
      source: existing.status === "UNSUBSCRIBED" ? input.source : existing.source,
      preferredLanguage: input.preferredLanguage || existing.preferredLanguage,
      consentTextVersion: input.consentTextVersion,
      consentedAt: new Date(),
      status: "PENDING",
      confirmationTokenHash: hash,
      confirmationTokenExpiresAt: expiresAt,
    });
    return { subscriber, rawToken };
  },

  async confirm(rawToken: string): Promise<ConfirmOutcome> {
    const hash = hashToken(rawToken);
    const subscriber = await newsletterRepository.findByConfirmationTokenHash(hash);
    if (!subscriber) return { outcome: "invalid" };

    if (subscriber.status === "ACTIVE") {
      return { outcome: "already-confirmed", subscriber };
    }

    if (isTokenExpired(subscriber.confirmationTokenExpiresAt)) {
      return { outcome: "expired", subscriber };
    }

    const confirmed = await newsletterRepository.update(subscriber.id, {
      status: "ACTIVE",
      confirmedAt: new Date(),
      confirmationTokenHash: null,
      confirmationTokenExpiresAt: null,
    });
    return { outcome: "confirmed", subscriber: confirmed };
  },

  async resendConfirmation(email: string): Promise<{ subscriber: NewsletterSubscriber; rawToken: string } | null> {
    const subscriber = await newsletterRepository.findByNormalizedEmail(normalizeEmail(email));
    if (!subscriber || subscriber.status !== "PENDING") return null;
    const { rawToken, hash, expiresAt } = await issueConfirmationToken();
    const updated = await newsletterRepository.update(subscriber.id, {
      confirmationTokenHash: hash,
      confirmationTokenExpiresAt: expiresAt,
    });
    return { subscriber: updated, rawToken };
  },

  /** Read-only token check for the unsubscribe confirm screen — never mutates status. */
  async lookupByUnsubscribeToken(subscriberId: string, token: string): Promise<NewsletterSubscriber | null> {
    const subscriber = await newsletterRepository.findById(subscriberId);
    if (!subscriber || !verifyUnsubscribeToken(subscriberId, token)) return null;
    return subscriber;
  },

  async unsubscribe(subscriberId: string, token: string): Promise<UnsubscribeOutcome> {
    const subscriber = await newsletterRepository.findById(subscriberId);
    if (!subscriber || !verifyUnsubscribeToken(subscriberId, token)) return { outcome: "invalid" };
    if (subscriber.status === "UNSUBSCRIBED") return { outcome: "already-unsubscribed", subscriber };

    const updated = await newsletterRepository.update(subscriber.id, {
      status: "UNSUBSCRIBED",
      unsubscribedAt: new Date(),
    });
    return { outcome: "unsubscribed", subscriber: updated };
  },

  /** Starts a fresh confirmation cycle from the unsubscribe-success screen — never flips straight back to ACTIVE. */
  async resubscribe(subscriberId: string, token: string): Promise<ResubscribeOutcome> {
    const subscriber = await newsletterRepository.findById(subscriberId);
    if (!subscriber || !verifyUnsubscribeToken(subscriberId, token)) return { outcome: "invalid" };
    if (subscriber.status !== "UNSUBSCRIBED") return { outcome: "not-eligible", subscriber };

    const { rawToken: confirmToken, hash, expiresAt } = await issueConfirmationToken();
    const updated = await newsletterRepository.update(subscriber.id, {
      status: "PENDING",
      consentedAt: new Date(),
      confirmationTokenHash: hash,
      confirmationTokenExpiresAt: expiresAt,
    });
    return { outcome: "started", subscriber: updated, rawToken: confirmToken };
  },

  /** Admin-triggered transition — staff discretion, bypasses the public consent cycle. */
  setStatus: (id: string, status: $Enums.SubscriberStatus, suppressionReason?: string) =>
    newsletterRepository.update(id, {
      status,
      ...(status === "UNSUBSCRIBED" ? { unsubscribedAt: new Date() } : {}),
      ...(status === "ACTIVE" ? { confirmedAt: new Date(), suppressionReason: null } : {}),
      ...(NEVER_AUTO_REACTIVATE_STATUSES.includes(status as (typeof NEVER_AUTO_REACTIVATE_STATUSES)[number])
        ? { suppressionReason: suppressionReason ?? null }
        : {}),
    }),

  /** Applied from a verified Resend webhook event — naturally idempotent. */
  suppressForDeliveryEvent: (id: string, status: "BOUNCED" | "COMPLAINED", reason: string) =>
    newsletterRepository.update(id, { status, suppressionReason: reason }),

  recordEmailSuccess: (id: string) =>
    newsletterRepository.update(id, { lastEmailSentAt: new Date(), emailFailureCount: 0 }),

  recordEmailFailure: (id: string, currentCount: number) =>
    newsletterRepository.update(id, { emailFailureCount: currentCount + 1 }),

  remove: (id: string) => newsletterRepository.delete(id),
};
