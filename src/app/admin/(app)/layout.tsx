import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/dashboard/components/dashboard-shell";
import { getCurrentUser } from "@/permissions/current-user";
import { notificationService } from "@/services/notification.service";

// The dashboard reads live, frequently-changing data (questions,
// messages, subscriber counts) and is per-session. It should never be
// statically prerendered or cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s — Dashboard",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // No middleware.ts exists in this project — this layout-level check
  // is the sole, authoritative auth gate for every route under
  // admin/(app)/*, since a layout wraps all nested pages in the App
  // Router. If middleware is ever added later, keep this check too
  // (defense in depth) rather than relying on middleware alone.
  if (!user) {
    redirect("/admin/login");
  }

  const notifications = await notificationService.getSummary();

  return (
    <DashboardShell user={user} notifications={notifications}>
      {children}
    </DashboardShell>
  );
}
