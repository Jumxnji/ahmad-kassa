import "server-only";
import { siteSettingsRepository } from "@/repositories/site-settings.repository";
import type { UpdateSiteSettingsInput } from "@/validators/site-settings.validator";

export const siteSettingsService = {
  get: () => siteSettingsRepository.get(),
  update: (input: Partial<UpdateSiteSettingsInput>) => siteSettingsRepository.update(input),
};
