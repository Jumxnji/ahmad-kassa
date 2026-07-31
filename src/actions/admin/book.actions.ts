"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { bookService } from "@/services/book.service";
import { createBookSchema, updateBookSchema } from "@/validators/book.validator";

export async function createBookAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "create");

    const parsed = createBookSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError(
        "Please check the form and try again.",
        fieldErrorsFromZod(parsed.error)
      );
    }

    const book = await bookService.create(parsed.data);
    revalidatePath("/admin/books");
    revalidatePath("/books");
    return book;
  }, "Book created.");
}

export async function updateBookAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = updateBookSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError(
        "Please check the form and try again.",
        fieldErrorsFromZod(parsed.error)
      );
    }

    const existing = await bookService.get(id);
    if (!existing) throw new NotFoundError("Book");

    const book = await bookService.update(id, parsed.data);
    revalidatePath("/admin/books");
    revalidatePath(`/admin/books/${id}`);
    revalidatePath("/books");
    revalidatePath(`/books/${book.slug}`);
    return book;
  }, "Book updated.");
}

export async function deleteBookAction(id: string) {
  return runAction(async () => {
    await requirePermission("content", "delete");

    const existing = await bookService.get(id);
    if (!existing) throw new NotFoundError("Book");

    await bookService.remove(id);
    revalidatePath("/admin/books");
    revalidatePath("/books");
    return { id };
  }, "Book deleted.");
}

export async function duplicateBookAction(id: string) {
  return runAction(async () => {
    await requirePermission("content", "create");

    const copy = await bookService.duplicate(id);
    if (!copy) throw new NotFoundError("Book");

    revalidatePath("/admin/books");
    return copy;
  }, "Book duplicated as a draft.");
}
