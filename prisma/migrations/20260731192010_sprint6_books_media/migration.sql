-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMING_SOON', 'ARCHIVED');

-- AlterEnum: MediaFolder — rename PDFS -> DOCUMENTS, add GALLERY / DOWNLOADS.
-- No existing rows use PDFS today (verified before writing this migration),
-- so a plain rename is safe with no data-fixup required.
ALTER TYPE "MediaFolder" RENAME VALUE 'PDFS' TO 'DOCUMENTS';
ALTER TYPE "MediaFolder" ADD VALUE 'GALLERY';
ALTER TYPE "MediaFolder" ADD VALUE 'DOWNLOADS';

-- AlterTable: Media — thumbnail support
ALTER TABLE "media" ADD COLUMN "thumbnailUrl" TEXT;

-- AlterTable: Book — new catalog fields + purchase options
ALTER TABLE "books"
  ADD COLUMN "authorName" TEXT NOT NULL DEFAULT 'Ahmad Mohamed Kassa',
  ADD COLUMN "publicationDate" TIMESTAMP(3),
  ADD COLUMN "isbn" TEXT,
  ADD COLUMN "language" TEXT NOT NULL DEFAULT 'English',
  ADD COLUMN "category" TEXT,
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "status" "BookStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "signedCopyAvailable" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "ebookUrl" TEXT,
  ADD COLUMN "audiobookUrl" TEXT;

-- DataMigration: fold the old published/comingSoon booleans into the
-- new status enum before dropping them, so existing rows (the seeded
-- "The Great Debate", published=true/featured=true) keep their state.
UPDATE "books"
SET "status" = CASE
  WHEN "published" = true THEN 'PUBLISHED'::"BookStatus"
  WHEN "comingSoon" = true THEN 'COMING_SOON'::"BookStatus"
  ELSE 'DRAFT'::"BookStatus"
END;

-- DropIndex
DROP INDEX IF EXISTS "books_published_idx";

-- AlterTable: drop the now-superseded booleans
ALTER TABLE "books"
  DROP COLUMN "published",
  DROP COLUMN "comingSoon";

-- CreateIndex
CREATE INDEX "books_status_idx" ON "books"("status");
