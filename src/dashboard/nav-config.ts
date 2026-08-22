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
  Video,
  type LucideIcon,
} from "lucide-react";
import type { Resource } from "@/permissions/permissions";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Hidden from the sidebar when set and the current role can't read this resource. Omit for items every authenticated role should see (e.g. Overview). */
  resource?: Resource;
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
      { label: "Homepage", href: "/admin/homepage", icon: Home, resource: "content" },
      { label: "About", href: "/admin/about", icon: BookOpen, resource: "content" },
      { label: "Books", href: "/admin/books", icon: BookOpen, resource: "content" },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Ask Ahmad", href: "/admin/ask-ahmad", icon: Inbox, resource: "questions" },
      { label: "Contact Messages", href: "/admin/contact", icon: Mail, resource: "contact" },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail, resource: "newsletter" },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Media Library", href: "/admin/media", icon: ImageIcon, resource: "media" },
      // Gated on "content" (not "media") — videos are CMS content that
      // feeds the homepage's Latest Khutbah section, not library assets.
      { label: "Videos", href: "/admin/videos", icon: Video, resource: "content" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/admin/users", icon: Users, resource: "users" },
      { label: "SEO", href: "/admin/seo", icon: Search, resource: "seo" },
      { label: "Site Settings", href: "/admin/settings", icon: Settings, resource: "settings" },
    ],
  },
] as const;
