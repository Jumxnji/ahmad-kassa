import { Hero } from "@/components/sections/hero";
import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { FeaturedBookSection } from "@/components/sections/featured-book-section";
import { FutureCoursesSection } from "@/components/sections/future-courses-section";
import { FeaturedArticlesSection } from "@/components/sections/featured-articles-section";
import { QuoteSection } from "@/components/sections/quote-section";
import { FeaturedLecturesSection } from "@/components/sections/featured-lectures-section";
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

export const metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildPersonJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebsiteJsonLd()} />
      <Hero />
      <AboutPreviewSection />
      <FeaturedBookSection />
      <FutureCoursesSection />
      <FeaturedArticlesSection />
      <QuoteSection />
      <FeaturedLecturesSection />
      <CtaSection />
      <NewsletterSection />
    </>
  );
}
