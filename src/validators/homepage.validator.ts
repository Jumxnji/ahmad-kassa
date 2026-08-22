import type { z } from "zod";
import { homepageContentSchema, homepageCredentialSchema } from "@/schemas/homepage.schema";

export const updateHomepageSchema = homepageContentSchema;
export type UpdateHomepageInput = z.infer<typeof updateHomepageSchema>;

export const homepageCredentialFormSchema = homepageCredentialSchema;
export type HomepageCredentialFormInput = z.infer<typeof homepageCredentialFormSchema>;
