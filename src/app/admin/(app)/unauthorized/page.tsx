import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/permissions/roles";
import { getCurrentUser } from "@/permissions/current-user";

export const metadata = { title: "Permission denied" };

export default async function UnauthorizedPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={ShieldAlert}
        title="You don't have permission to view this page"
        description={
          user
            ? `Signed in as ${user.name} (${ROLE_LABELS[user.role]}). Ask an Owner or Administrator if you need access.`
            : "Ask an Owner or Administrator if you need access."
        }
        action={
          <Button asChild variant="gold">
            <Link href="/admin">Back to Overview</Link>
          </Button>
        }
      />
    </div>
  );
}
