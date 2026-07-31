-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "homepage_content" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "flagged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "seo" ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "noindex" BOOLEAN NOT NULL DEFAULT false;
