import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { TableSkeleton } from "@/dashboard/components/skeletons";
import { Button } from "@/components/ui/button";

export default function BooksLoading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Books"
        description="The catalog shown on the public Books page — supports any number of titles."
        actions={
          <Button asChild variant="gold">
            <Link href="/admin/books/new">
              <Plus data-icon="inline-start" />
              New book
            </Link>
          </Button>
        }
      />
      <TableSkeleton rows={5} cols={4} />
    </div>
  );
}
