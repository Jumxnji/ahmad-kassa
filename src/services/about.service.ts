import "server-only";
import { aboutRepository } from "@/repositories/about.repository";
import { seoService } from "@/services/seo.service";
import { sanitizeRichText } from "@/lib/sanitize-rich-text";
import type {
  EducationItemFormInput,
  TimelineItemFormInput,
  UpdateAboutInput,
} from "@/validators/about.validator";

export const aboutService = {
  get: () => aboutRepository.get(),

  async update(input: UpdateAboutInput) {
    const { seo, ...rest } = input;
    const data: typeof rest & { seoId?: string | null } = {
      ...rest,
      biography: sanitizeRichText(rest.biography),
    };

    if (seo && Object.keys(seo).length > 0) {
      const existing = await aboutRepository.get();
      const seoRow = await seoService.save(existing?.seoId ?? null, seo);
      data.seoId = seoRow.id;
    }

    return aboutRepository.update(data);
  },

  addTimelineItem: (input: TimelineItemFormInput) => aboutRepository.createTimelineItem(input),
  updateTimelineItem: (id: string, input: Partial<TimelineItemFormInput>) =>
    aboutRepository.updateTimelineItem(id, input),
  removeTimelineItem: (id: string) => aboutRepository.deleteTimelineItem(id),

  addEducationItem: (input: EducationItemFormInput) => aboutRepository.createEducationItem(input),
  updateEducationItem: (id: string, input: Partial<EducationItemFormInput>) =>
    aboutRepository.updateEducationItem(id, input),
  removeEducationItem: (id: string) => aboutRepository.deleteEducationItem(id),
};
