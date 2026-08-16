-- CreateEnum
CREATE TYPE "QuestionPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'ADMIN');

-- AlterEnum: QuestionStatus — PENDING becomes NEW, three new workflow
-- states added. No existing row uses a removed value, so this is a
-- straight rename + additive set, no data-fixup needed.
ALTER TYPE "QuestionStatus" RENAME VALUE 'PENDING' TO 'NEW';
ALTER TYPE "QuestionStatus" ADD VALUE 'IN_REVIEW' AFTER 'NEW';
ALTER TYPE "QuestionStatus" ADD VALUE 'WAITING' AFTER 'IN_REVIEW';
ALTER TYPE "QuestionStatus" ADD VALUE 'CLOSED' AFTER 'ANSWERED';

-- AlterTable: questions — rename `question` to `initialMessage`, add
-- the new conversation/reference/workflow columns, drop the old
-- inline answer fields (superseded by Conversation/Message).
ALTER TABLE "questions" RENAME COLUMN "question" TO "initialMessage";

ALTER TABLE "questions"
  ADD COLUMN "referenceNumber" TEXT,
  ADD COLUMN "subject" TEXT,
  ADD COLUMN "priority" "QuestionPriority" NOT NULL DEFAULT 'NORMAL',
  ADD COLUMN "readAt" TIMESTAMP(3),
  ADD COLUMN "assignedToId" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "senderUserId" TEXT,
    "message" TEXT NOT NULL,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_notes" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "authorId" TEXT,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internal_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "lastReminder" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_counters" (
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "reference_counters_pkey" PRIMARY KEY ("key")
);

-- AlterTable: contact_messages — add subject
ALTER TABLE "contact_messages" ADD COLUMN "subject" TEXT NOT NULL DEFAULT '';

-- DataMigration: backfill a reference number for any pre-existing
-- question (only the seed row today) and seed this year's counter so
-- the next real submission continues from the right number. The
-- window function has to live in a plain SELECT (Postgres rejects one
-- directly inside an UPDATE ... SET), so it's computed in a CTE first.
WITH numbered AS (
  SELECT "id",
         ROW_NUMBER() OVER (PARTITION BY EXTRACT(YEAR FROM "createdAt") ORDER BY "createdAt") AS rn
  FROM "questions"
)
UPDATE "questions"
SET "referenceNumber" = 'AMK-' || EXTRACT(YEAR FROM "questions"."createdAt")::text || '-' || LPAD(numbered."rn"::text, 6, '0')
FROM numbered
WHERE "questions"."id" = numbered."id";

INSERT INTO "reference_counters" ("key", "value")
SELECT 'question-' || EXTRACT(YEAR FROM "createdAt")::text, COUNT(*)::int
FROM "questions"
GROUP BY EXTRACT(YEAR FROM "createdAt")
ON CONFLICT ("key") DO UPDATE SET "value" = GREATEST("reference_counters"."value", EXCLUDED."value");

-- DataMigration: give every existing question its Conversation +
-- initial USER message, so no row is left without one under the new
-- architecture.
INSERT INTO "conversations" ("id", "questionId", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", "createdAt", "createdAt"
FROM "questions";

INSERT INTO "messages" ("id", "conversationId", "senderType", "message", "createdAt")
SELECT gen_random_uuid()::text, c."id", 'USER', q."initialMessage", q."createdAt"
FROM "conversations" c
JOIN "questions" q ON q."id" = c."questionId";

-- AlterTable: make referenceNumber required now that every row has one
ALTER TABLE "questions" ALTER COLUMN "referenceNumber" SET NOT NULL;

-- AlterTable: drop the old inline-answer columns, now superseded by
-- Conversation/Message
ALTER TABLE "questions" DROP COLUMN "answer",
                        DROP COLUMN "answeredAt";

-- CreateIndex
CREATE UNIQUE INDEX "questions_referenceNumber_key" ON "questions"("referenceNumber");

-- CreateIndex
CREATE INDEX "questions_assignedToId_idx" ON "questions"("assignedToId");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_questionId_key" ON "conversations"("questionId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "internal_notes_questionId_idx" ON "internal_notes"("questionId");

-- CreateIndex
CREATE INDEX "user_notifications_questionId_idx" ON "user_notifications"("questionId");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
