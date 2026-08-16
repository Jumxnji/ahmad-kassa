"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", href: "/admin/newsletter" },
  { label: "Subscribers", href: "/admin/newsletter/subscribers" },
  { label: "Campaigns", href: "/admin/newsletter/campaigns" },
  { label: "Email Templates", href: "/admin/newsletter/templates" },
  { label: "Settings", href: "/admin/newsletter/settings" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin/newsletter") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** In-page sub-navigation for the Newsletter section — Overview/Subscribers/Campaigns/Email Templates/Settings each being a real route with its own server-side data, not client tab panels. */
export function NewsletterTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border" aria-label="Newsletter sections">
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-navy-900 text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
