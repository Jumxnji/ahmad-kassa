import { z } from "zod";

export const socialLinksSchema = z.object({
  youtube: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  tiktok: z.string().url().optional().or(z.literal("")),
});

export const navigationItemSchema = z.object({
  label: z.string().min(1).max(40),
  href: z.string().min(1).max(200),
});

export const brandColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  muted: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const analyticsIdsSchema = z.object({
  googleAnalyticsId: z.string().optional().or(z.literal("")),
  metaPixelId: z.string().optional().or(z.literal("")),
});

export const siteSettingsSchema = z.object({
  websiteName: z.string().min(2).max(120),
  domain: z.string().url(),
  contactEmail: z.email(),
  supportEmail: z.email().optional().or(z.literal("")).nullable(),
  socialLinks: socialLinksSchema,
  footerText: z.string().max(300).optional().nullable(),
  navigation: z.array(navigationItemSchema).max(12),
  logoId: z.string().uuid().optional().nullable(),
  brandColors: brandColorsSchema,
  analyticsIds: analyticsIdsSchema,
  defaultSeoId: z.string().uuid().optional().nullable(),
});
