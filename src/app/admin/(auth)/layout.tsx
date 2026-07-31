import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s — Dashboard",
  },
  robots: { index: false, follow: false },
};

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-50 px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <ManuscriptDivider className="mt-6 max-w-[120px] bg-gold-300/60" />
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
