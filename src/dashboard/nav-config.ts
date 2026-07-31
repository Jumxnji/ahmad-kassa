import {
  BookOpen,
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Mail,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: readonly NavItem[];
}

/**
 * The exact V1 nav — deliberately doesn't include Courses, Articles,
 * Events, Student Portal, Payments, or Analytics. Those stay hidden
 * behind feature flags (see src/features/flags.ts); adding a nav
 * entry for one is the last step once its flag flips on, not the
 * first.
 */
export const DASHBOARD_NAV: readonly NavSection[] = [
  {
    label: "Dashboard",
    items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "About", href: "/admin/about", icon: BookOpen },
      { label: "Books", href: "/admin/books", icon: BookOpen },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Ask Ahmad", href: "/admin/ask-ahmad", icon: Inbox },
      { label: "Contact Messages", href: "/admin/contact", icon: Mail },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    label: "Media",
    items: [{ label: "Media Library", href: "/admin/media", icon: ImageIcon }],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
    ],
  },
] as const;
