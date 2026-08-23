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

  // src/proxy.ts (Next.js 16's renamed middleware.ts convention — see
  // its own comment) already redirects unauthenticated requests before
  // they reach here; this is a second, authoritative check (defense in
  // depth) in case a page is ever rendered outside the normal request
  // flow, e.g. during static analysis or a future caching layer.
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
