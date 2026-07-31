import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { BookForm } from "@/dashboard/components/book-form";
import { bookService } from "@/services/book.service";

export const metadata = { title: "Edit book" };

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const book = await bookService.get(id);

  if (!book) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader title={book.title} description="Editing this book." />
      <BookForm book={book} />
    </div>
  );
}
