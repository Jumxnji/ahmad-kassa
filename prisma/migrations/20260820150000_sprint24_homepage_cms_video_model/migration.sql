-- AlterTable
ALTER TABLE "homepage_content" ADD COLUMN     "aboutBody" TEXT NOT NULL DEFAULT 'Ahmad Mohamed Kassa studied Arabic and Islamic Studies in Kuwait before completing a degree in Computer Science and Telecommunications and a PGCE at the University of London. He has taught Ruqyah in the UK and abroad since 2009 and serves as Khateeb at Masjid Al-Noor in East London.',
ADD COLUMN     "aboutEyebrow" TEXT NOT NULL DEFAULT 'Who teaches here',
ADD COLUMN     "aboutLede" TEXT NOT NULL DEFAULT 'His work brings together Islamic teaching, community service, and more than fifteen years of experience in Ruqyah.',
ADD COLUMN     "aboutSubtitle" TEXT NOT NULL DEFAULT 'Author · Teacher · Khateeb',
ADD COLUMN     "primaryKhutbahId" TEXT,
ADD COLUMN     "supportingKhutbah1Id" TEXT,
ADD COLUMN     "supportingKhutbah2Id" TEXT;

-- CreateTable
CREATE TABLE "homepage_credentials" (
    "id" TEXT NOT NULL,
    "homepageContentId" TEXT NOT NULL DEFAULT 'homepage',
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "source" TEXT,
    "category" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "homepage_credentials_homepageContentId_order_idx" ON "homepage_credentials"("homepageContentId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "videos_slug_key" ON "videos"("slug");

-- CreateIndex
CREATE INDEX "videos_status_idx" ON "videos"("status");

-- CreateIndex
CREATE INDEX "videos_publishedAt_idx" ON "videos"("publishedAt");

-- CreateIndex
CREATE INDEX "homepage_content_primaryKhutbahId_idx" ON "homepage_content"("primaryKhutbahId");

-- CreateIndex
CREATE INDEX "homepage_content_supportingKhutbah1Id_idx" ON "homepage_content"("supportingKhutbah1Id");

-- CreateIndex
CREATE INDEX "homepage_content_supportingKhutbah2Id_idx" ON "homepage_content"("supportingKhutbah2Id");

-- AddForeignKey
ALTER TABLE "homepage_content" ADD CONSTRAINT "homepage_content_primaryKhutbahId_fkey" FOREIGN KEY ("primaryKhutbahId") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_content" ADD CONSTRAINT "homepage_content_supportingKhutbah1Id_fkey" FOREIGN KEY ("supportingKhutbah1Id") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_content" ADD CONSTRAINT "homepage_content_supportingKhutbah2Id_fkey" FOREIGN KEY ("supportingKhutbah2Id") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_credentials" ADD CONSTRAINT "homepage_credentials_homepageContentId_fkey" FOREIGN KEY ("homepageContentId") REFERENCES "homepage_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

