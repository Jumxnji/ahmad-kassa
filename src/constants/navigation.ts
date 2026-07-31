import type { NavItem } from "@/types/navigation";

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Courses", href: "/courses" },
  { label: "Articles", href: "/articles" },
  { label: "Ask Ahmad", href: "/ask" },
] as const;

export const FOOTER_EXPLORE: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Courses", href: "/courses" },
  { label: "Articles", href: "/articles" },
] as const;

export const FOOTER_CONNECT: readonly NavItem[] = [
  { label: "Ask Ahmad", href: "/ask" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LEGAL: readonly NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;
