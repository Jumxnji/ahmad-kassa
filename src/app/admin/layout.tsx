import type { Metadata } from "next";
import { DashboardShell } from "@/dashboard/components/dashboard-shell";
import { getCurrentUser } from "@/permissions/current-user";

// The dashboard reads live, frequently-changing data (questions,
// messages, subscriber counts) and — once auth exists — is
// per-session. It should never be statically prerendered or cached.
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

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
