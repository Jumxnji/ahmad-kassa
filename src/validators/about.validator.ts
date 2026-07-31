import type { z } from "zod";
import {
  aboutContentSchema,
  educationItemSchema,
  timelineItemSchema,
} from "@/schemas/about.schema";

export const updateAboutSchema = aboutContentSchema;
export type UpdateAboutInput = z.infer<typeof updateAboutSchema>;

export const timelineItemFormSchema = timelineItemSchema;
export type TimelineItemFormInput = z.infer<typeof timelineItemFormSchema>;

export const educationItemFormSchema = educationItemSchema;
export type EducationItemFormInput = z.infer<typeof educationItemFormSchema>;
