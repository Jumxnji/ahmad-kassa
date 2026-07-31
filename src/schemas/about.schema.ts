import { z } from "zod";

export const aboutContentSchema = z.object({
  introHeadline: z.string().min(2).max(120),
  introText: z.string().min(10).max(600),
  biography: z.string().min(10).max(8000),
  missionText: z.string().min(10).max(600),
  futureVisionText: z.string().min(10).max(600),
  badges: z.array(z.string().min(1).max(40)).max(8),
});

export const timelineItemSchema = z.object({
  label: z.string().min(1).max(40),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
  order: z.number().int().min(0),
});

export const educationItemSchema = z.object({
  title: z.string().min(1).max(160),
  detail: z.string().min(1).max(400),
  order: z.number().int().min(0),
});
