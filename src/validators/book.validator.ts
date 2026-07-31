import { z } from "zod";
import { bookSchema } from "@/schemas/book.schema";

export const createBookSchema = bookSchema.omit({ id: true }).extend({
  slug: z.string().min(2).max(200).optional(),
});
export type CreateBookInput = z.infer<typeof createBookSchema>;

export const updateBookSchema = createBookSchema.partial();
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
