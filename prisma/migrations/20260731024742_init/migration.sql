-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMINISTRATOR', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('MARRIAGE', 'FAMILY', 'AQEEDAH', 'FIQH', 'RUQYAH', 'MENTAL_HEALTH', 'OTHER');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('PENDING', 'ANSWERED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContactReason" AS ENUM ('SPEAKING', 'SEMINARS', 'GENERAL', 'BOOKS', 'MEDIA');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaFolder" AS ENUM ('IMAGES', 'PDFS', 'BOOK_COVERS', 'VIDEOS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "avatarUrl" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "folder" "MediaFolder" NOT NULL DEFAULT 'IMAGES',
    "altText" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookGalleryId" TEXT,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo" (
    "id" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImageId" TEXT,
    "twitterCard" TEXT DEFAULT 'summary_large_image',
    "twitterImageId" TEXT,
    "canonicalUrl" TEXT,
    "structuredData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "excerpt" TEXT NOT NULL,
    "coverImageId" TEXT,
    "amazonUrl" TEXT,
    "directPurchaseUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "comingSoon" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "seoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_content" (
    "id" TEXT NOT NULL DEFAULT 'homepage',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Islamic Teacher · Author · Khateeb',
    "heroHeadline" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroPrimaryCtaLabel" TEXT NOT NULL DEFAULT 'Explore Books',
    "heroPrimaryCtaHref" TEXT NOT NULL DEFAULT '/books',
    "heroSecondaryCtaLabel" TEXT NOT NULL DEFAULT 'Browse Articles',
    "heroSecondaryCtaHref" TEXT NOT NULL DEFAULT '/articles',
    "heroImageId" TEXT,
    "aboutPreviewText" TEXT NOT NULL,
    "featuredBookId" TEXT,
    "newsletterHeadline" TEXT NOT NULL DEFAULT 'Stay connected, without the noise',
    "newsletterText" TEXT NOT NULL,
    "seoId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_content" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "introHeadline" TEXT NOT NULL DEFAULT 'Ahmad Mohamed Kassa',
    "introText" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "missionText" TEXT NOT NULL,
    "futureVisionText" TEXT NOT NULL,
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_items" (
    "id" TEXT NOT NULL,
    "aboutContentId" TEXT NOT NULL DEFAULT 'about',
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "timeline_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_items" (
    "id" TEXT NOT NULL,
    "aboutContentId" TEXT NOT NULL DEFAULT 'about',
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "education_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "question" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "status" "QuestionStatus" NOT NULL DEFAULT 'PENDING',
    "answer" TEXT,
    "answeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" "ContactReason" NOT NULL DEFAULT 'GENERAL',
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "subscribed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "websiteName" TEXT NOT NULL DEFAULT 'Ahmad Mohamed Kassa',
    "domain" TEXT NOT NULL DEFAULT 'https://ahmadkassa.com',
    "contactEmail" TEXT NOT NULL,
    "supportEmail" TEXT,
    "socialLinks" JSONB NOT NULL DEFAULT '{}',
    "footerText" TEXT,
    "navigation" JSONB NOT NULL DEFAULT '[]',
    "logoId" TEXT,
    "brandColors" JSONB NOT NULL DEFAULT '{}',
    "analyticsIds" JSONB NOT NULL DEFAULT '{}',
    "defaultSeoId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "media_folder_idx" ON "media"("folder");

-- CreateIndex
CREATE INDEX "media_uploadedById_idx" ON "media"("uploadedById");

-- CreateIndex
CREATE INDEX "media_bookGalleryId_idx" ON "media"("bookGalleryId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_ogImageId_key" ON "seo"("ogImageId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_twitterImageId_key" ON "seo"("twitterImageId");

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "books_coverImageId_key" ON "books"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "books_seoId_key" ON "books"("seoId");

-- CreateIndex
CREATE INDEX "books_published_idx" ON "books"("published");

-- CreateIndex
CREATE INDEX "books_featured_idx" ON "books"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_content_heroImageId_key" ON "homepage_content"("heroImageId");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_content_seoId_key" ON "homepage_content"("seoId");

-- CreateIndex
CREATE INDEX "homepage_content_featuredBookId_idx" ON "homepage_content"("featuredBookId");

-- CreateIndex
CREATE UNIQUE INDEX "about_content_seoId_key" ON "about_content"("seoId");

-- CreateIndex
CREATE INDEX "timeline_items_aboutContentId_order_idx" ON "timeline_items"("aboutContentId", "order");

-- CreateIndex
CREATE INDEX "education_items_aboutContentId_order_idx" ON "education_items"("aboutContentId", "order");

-- CreateIndex
CREATE INDEX "questions_status_idx" ON "questions"("status");

-- CreateIndex
CREATE INDEX "questions_category_idx" ON "questions"("category");

-- CreateIndex
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_subscribed_idx" ON "newsletter_subscribers"("subscribed");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_logoId_key" ON "site_settings"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_defaultSeoId_key" ON "site_settings"("defaultSeoId");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_bookGalleryId_fkey" FOREIGN KEY ("bookGalleryId") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo" ADD CONSTRAINT "seo_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo" ADD CONSTRAINT "seo_twitterImageId_fkey" FOREIGN KEY ("twitterImageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "seo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_content" ADD CONSTRAINT "homepage_content_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_content" ADD CONSTRAINT "homepage_content_featuredBookId_fkey" FOREIGN KEY ("featuredBookId") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_content" ADD CONSTRAINT "homepage_content_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "seo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_content" ADD CONSTRAINT "about_content_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES "seo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_items" ADD CONSTRAINT "timeline_items_aboutContentId_fkey" FOREIGN KEY ("aboutContentId") REFERENCES "about_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_items" ADD CONSTRAINT "education_items_aboutContentId_fkey" FOREIGN KEY ("aboutContentId") REFERENCES "about_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_defaultSeoId_fkey" FOREIGN KEY ("defaultSeoId") REFERENCES "seo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
