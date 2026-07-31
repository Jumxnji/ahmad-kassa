import "server-only";
import { seoRepository } from "@/repositories/seo.repository";
import type { SeoInput } from "@/schemas/seo.schema";

export const seoService = {
  get: (id: string) => seoRepository.findById(id),

  /** Creates a new Seo row if `id` is missing, otherwise updates in place. */
  save: (id: string | null | undefined, input: SeoInput) => seoRepository.upsert(id, input),
};
