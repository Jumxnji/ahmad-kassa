import "server-only";
import { homepageRepository } from "@/repositories/homepage.repository";
import { seoService } from "@/services/seo.service";
import type { UpdateHomepageInput } from "@/validators/homepage.validator";

export const homepageService = {
  get: () => homepageRepository.get(),

  async update(input: UpdateHomepageInput) {
    const { seo, ...rest } = input;
    const data: typeof rest & { seoId?: string | null } = { ...rest };

    if (seo && Object.keys(seo).length > 0) {
      const existing = await homepageRepository.get();
      const seoRow = await seoService.save(existing?.seoId ?? null, seo);
      data.seoId = seoRow.id;
    }

    return homepageRepository.update(data);
  },
};
