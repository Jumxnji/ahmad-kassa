import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="mt-6 flex flex-col items-center">
      <ErrorState
        title="We couldn't find that"
        description="This record may have been deleted, or the link is out of date."
      />
      <Button asChild variant="outline" className="mt-6">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
