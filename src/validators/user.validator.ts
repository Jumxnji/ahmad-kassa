import { z } from "zod";
import { userSchema } from "@/schemas/user.schema";

export const createUserSchema = userSchema;
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema.partial();
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
