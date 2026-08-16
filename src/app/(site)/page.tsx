import { Hero } from "@/components/sections/hero";
import { FeaturedBookSection } from "@/components/sections/featured-book-section";
import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { TeachingAreasSection } from "@/components/sections/teaching-areas-section";
import { QuoteSection } from "@/components/sections/quote-section";
import { LatestKhutbahSection } from "@/components/sections/featured-lectures-section";
import { FutureCoursesSection } from "@/components/sections/future-courses-section";
import { CtaSection } from "@/components/sections/cta-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { JsonLd } from "@/components/shared/json-ld";
import {
  buildMetadata,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { homepageService } from "@/services/homepage.service";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await homepageService.get();

  return buildMetadata({
    title: homepage?.seo?.metaTitle || `${siteConfig.name} — ${siteConfig.tagline}`,
    description: homepage?.seo?.metaDescription || siteConfig.description,
    path: "/",
    noIndex: homepage?.seo?.noindex ?? false,
    useRouteOgImage: true,
  });
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildPersonJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebsiteJsonLd()} />
      <Hero />
      <FeaturedBookSection />
      <AboutPreviewSection />
      <TeachingAreasSection />
      <QuoteSection />
      <LatestKhutbahSection />
      <FutureCoursesSection />
      <CtaSection />
      <NewsletterSection source="HOMEPAGE" />
    </>
  );
}
