import "server-only";
import { aboutRepository } from "@/repositories/about.repository";
import { sanitizeRichText } from "@/lib/sanitize-rich-text";
import type {
  EducationItemFormInput,
  TimelineItemFormInput,
  UpdateAboutInput,
} from "@/validators/about.validator";

export const aboutService = {
  get: () => aboutRepository.get(),
  update: (input: UpdateAboutInput) =>
    aboutRepository.update({ ...input, biography: sanitizeRichText(input.biography) }),

  addTimelineItem: (input: TimelineItemFormInput) => aboutRepository.createTimelineItem(input),
  updateTimelineItem: (id: string, input: Partial<TimelineItemFormInput>) =>
    aboutRepository.updateTimelineItem(id, input),
  removeTimelineItem: (id: string) => aboutRepository.deleteTimelineItem(id),

  addEducationItem: (input: EducationItemFormInput) => aboutRepository.createEducationItem(input),
  updateEducationItem: (id: string, input: Partial<EducationItemFormInput>) =>
    aboutRepository.updateEducationItem(id, input),
  removeEducationItem: (id: string) => aboutRepository.deleteEducationItem(id),
};
