import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { brand } from "@/config/brand";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
  }),
  manifest: "/brand/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.ico", sizes: "any" },
    ],
    shortcut: "/brand/favicon.ico",
    apple: [{ url: "/brand/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/brand/safari-pinned-tab.svg",
        color: brand.colors.primary,
      },
    ],
  },
  other: {
    "msapplication-TileColor": brand.colors.primary,
    "msapplication-TileImage": "/brand/mstile-150x150.png",
  },
};

export const viewport: Viewport = {
  themeColor: brand.colors.primary,
};

/**
 * True root layout — html/body, fonts, and the handful of things
 * every route needs (metadata, toaster, skip link). The public site
 * chrome (SiteHeader/SiteFooter) lives in `(site)/layout.tsx`; the
 * admin dashboard chrome lives in `admin/layout.tsx`. Neither should
 * leak into the other.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${manrope.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TooltipProvider delayDuration={150}>
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-navy-900 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-paper-50 focus-visible:shadow-lg"
          >
            Skip to content
          </a>
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
