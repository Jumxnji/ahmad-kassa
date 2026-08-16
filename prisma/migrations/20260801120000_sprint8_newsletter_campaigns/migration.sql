-- Sprint 8: Newsletter subscriber-management + announcement campaigns.
--
-- The newsletter_subscribers ALTER is hand-ordered (unlike the raw
-- `prisma migrate diff` output) so the new NOT NULL/UNIQUE columns can
-- be backfilled against the one pre-existing seed row before the
-- constraints are enforced. See docs/sprints/SPRINT-08.md for the
-- "grandfathered subscriber" caveat this backfill documents.

-- CreateEnum
CREATE TYPE "SubscriberStatus" AS ENUM ('PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'SUPPRESSED', 'BOUNCED', 'COMPLAINED');

-- CreateEnum
CREATE TYPE "SubscriberSource" AS ENUM ('HOMEPAGE', 'FOOTER', 'NEWSLETTER_PAGE', 'BOOK_PAGE', 'COURSES_COMING_SOON', 'ADMIN_IMPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'READY', 'SCHEDULED', 'SENDING', 'SENT', 'PARTIALLY_FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignAudienceType" AS ENUM ('ALL_ACTIVE');

-- CreateEnum
CREATE TYPE "CampaignRecipientStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- DropIndex
DROP INDEX "newsletter_subscribers_subscribed_idx";

-- AlterTable: add every new column nullable (or with a default) first —
-- nothing here can fail against the existing row.
ALTER TABLE "newsletter_subscribers"
  ADD COLUMN     "normalizedEmail" TEXT,
  ADD COLUMN     "firstName" TEXT,
  ADD COLUMN     "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN     "status" "SubscriberStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN     "source" "SubscriberSource" NOT NULL DEFAULT 'OTHER',
  ADD COLUMN     "consentTextVersion" TEXT,
  ADD COLUMN     "consentedAt" TIMESTAMP(3),
  ADD COLUMN     "confirmedAt" TIMESTAMP(3),
  ADD COLUMN     "unsubscribedAt" TIMESTAMP(3),
  ADD COLUMN     "updatedAt" TIMESTAMP(3),
  ADD COLUMN     "lastEmailSentAt" TIMESTAMP(3),
  ADD COLUMN     "emailFailureCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN     "suppressionReason" TEXT,
  ADD COLUMN     "confirmationTokenHash" TEXT,
  ADD COLUMN     "confirmationTokenExpiresAt" TIMESTAMP(3),
  ADD COLUMN     "metadata" JSONB;

-- Backfill existing rows: grandfather them in as already-confirmed
-- (they opted in under the old single-step form) and map the old
-- `subscribed` boolean onto the new status enum. Unsubscribe links no
-- longer need a stored token at all (see
-- src/lib/newsletter-token.ts's unsubscribeToken()), so there's
-- nothing to mint here.
UPDATE "newsletter_subscribers"
SET
  "normalizedEmail" = lower(trim("email")),
  "status" = CASE WHEN "subscribed" THEN 'ACTIVE'::"SubscriberStatus" ELSE 'UNSUBSCRIBED'::"SubscriberStatus" END,
  "source" = 'OTHER',
  "confirmedAt" = "createdAt",
  "unsubscribedAt" = CASE WHEN "subscribed" THEN NULL ELSE "createdAt" END,
  "updatedAt" = "createdAt";

-- Now that every row has a value, enforce the real constraints.
ALTER TABLE "newsletter_subscribers"
  ALTER COLUMN "normalizedEmail" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL,
  DROP COLUMN "language",
  DROP COLUMN "subscribed";

-- AlterTable (unrelated drift fix — @updatedAt is managed client-side,
-- it should never have carried a DB-level DEFAULT)
ALTER TABLE "questions" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "internalName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "previewText" TEXT,
    "content" TEXT NOT NULL,
    "plainTextContent" TEXT NOT NULL,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "secondaryContent" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "audienceType" "CampaignAudienceType" NOT NULL DEFAULT 'ALL_ACTIVE',
    "language" TEXT NOT NULL DEFAULT 'en',
    "senderName" TEXT,
    "replyToEmail" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "providerBatchId" TEXT,
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_recipients" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "status" "CampaignRecipientStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "providerMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_settings" (
    "id" TEXT NOT NULL DEFAULT 'newsletter',
    "senderName" TEXT NOT NULL DEFAULT 'Ahmad Kassa',
    "senderEmail" TEXT NOT NULL DEFAULT 'newsletter@ahmadkassa.com',
    "replyToEmail" TEXT,
    "confirmationSubject" TEXT NOT NULL DEFAULT 'Confirm your subscription',
    "welcomeSubject" TEXT NOT NULL DEFAULT 'Welcome — you''re subscribed',
    "defaultFooterText" TEXT,
    "businessAddress" TEXT,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "confirmationTokenExpiryHours" INTEGER NOT NULL DEFAULT 48,
    "testEmailAllowlist" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "campaign_recipients_campaignId_idx" ON "campaign_recipients"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_recipients_subscriberId_idx" ON "campaign_recipients"("subscriberId");

-- CreateIndex
CREATE INDEX "campaign_recipients_providerMessageId_idx" ON "campaign_recipients"("providerMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_recipients_campaignId_subscriberId_key" ON "campaign_recipients"("campaignId", "subscriberId");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_normalizedEmail_key" ON "newsletter_subscribers"("normalizedEmail");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_status_idx" ON "newsletter_subscribers"("status");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_source_idx" ON "newsletter_subscribers"("source");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_confirmationTokenHash_idx" ON "newsletter_subscribers"("confirmationTokenHash");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_recipients" ADD CONSTRAINT "campaign_recipients_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
