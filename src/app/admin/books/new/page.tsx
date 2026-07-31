import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { BookForm } from "@/dashboard/components/book-form";

export const metadata = { title: "New book" };

export default function NewBookPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader title="New book" description="Add a title to the catalog." />
      <BookForm />
    </div>
  );
}
