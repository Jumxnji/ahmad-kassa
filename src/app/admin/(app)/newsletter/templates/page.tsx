import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { NewsletterTabs } from "@/dashboard/components/newsletter-tabs";
import { subscriptionConfirmationEmail, welcomeEmail, campaignEmail } from "@/lib/email/templates";
import { newsletterSettingsService } from "@/services/newsletter-settings.service";

export const metadata = { title: "Newsletter — Email Templates" };

const SAMPLE_UNSUBSCRIBE_URL = "https://ahmadkassa.com/newsletter/unsubscribe?sid=sample&token=sample";

function TemplateCard({ title, description, html }: { title: string; description: string; html: string }) {
  return (
    <div>
      <h2 className="font-display text-lg text-foreground">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      <iframe
        title={title}
        srcDoc={html}
        className="mx-auto mt-4 rounded-lg border border-border bg-white"
        style={{ width: "600px", maxWidth: "100%", height: "600px" }}
      />
    </div>
  );
}

export default async function AdminNewsletterTemplatesPage() {
  const settings = await newsletterSettingsService.get();

  const confirmation = subscriptionConfirmationEmail({ firstName: "Fatima", confirmUrl: "https://ahmadkassa.com/newsletter/confirm?token=sample" });
  const welcome = welcomeEmail({ firstName: "Fatima", unsubscribeUrl: SAMPLE_UNSUBSCRIBE_URL, businessAddress: settings.businessAddress });
  const campaign = campaignEmail({
    title: "A new book from Ahmad",
    contentHtml:
      "<p>Assalamu alaikum, I'm delighted to share that a new book is now available. It covers a topic close to my heart, and I hope it benefits you and your family.</p>",
    ctaLabel: "Get the book",
    ctaUrl: "https://ahmadkassa.com/books",
    secondaryContentHtml: null,
    unsubscribeUrl: SAMPLE_UNSUBSCRIBE_URL,
    businessAddress: settings.businessAddress,
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Newsletter"
        description="Read-only reference — exactly what subscribers receive, rendered with sample data. Branding, footer, and unsubscribe links are shared across every template; edit sender identity and footer copy from Settings."
      />
      <NewsletterTabs />

      <div className="space-y-12">
        <TemplateCard
          title="Subscription confirmation"
          description="Sent immediately after a public signup or resubscribe — the one email a pending subscriber ever receives."
          html={confirmation.html}
        />
        <TemplateCard
          title="Welcome"
          description="Sent right after a subscriber confirms their email — short, on purpose."
          html={welcome.html}
        />
        <TemplateCard
          title="Campaign"
          description="The shared shell every sent campaign renders through — heading, content, optional CTA, and the compliance footer."
          html={campaign.html}
        />
      </div>
    </div>
  );
}
