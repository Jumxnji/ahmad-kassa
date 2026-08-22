import "server-only";
import { homepageRepository } from "@/repositories/homepage.repository";
import { seoService } from "@/services/seo.service";
import { videoService } from "@/services/video.service";
import { resolveFeaturedKhutbahs } from "@/lib/featured-khutbahs";
import { canAddHomepageCredential } from "@/lib/homepage-credentials";
import { ConflictError } from "@/lib/errors";
import { MAX_HOMEPAGE_CREDENTIALS } from "@/schemas/homepage.schema";
import type { HomepageCredentialFormInput, UpdateHomepageInput } from "@/validators/homepage.validator";
import type { Video } from "@/generated/prisma/client";

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

  /**
   * The three featured-khutbah slots, each resolved to a real
   * published video (or `null` if unset/deleted/unpublished), then run
   * through `resolveFeaturedKhutbahs()` to compress gaps and promote
   * the next available slot forward — never invents a video, never
   * shows a broken card.
   */
  async resolveFeaturedKhutbahs() {
    const homepage = await homepageRepository.get();
    const ids = [homepage?.primaryKhutbahId, homepage?.supportingKhutbah1Id, homepage?.supportingKhutbah2Id].filter(
      (id): id is string => Boolean(id)
    );
    const videos = ids.length > 0 ? await videoService.getManyByIds(ids) : [];
    const byId = new Map(videos.filter((video) => video.status === "PUBLISHED").map((video) => [video.id, video]));

    const primary = homepage?.primaryKhutbahId ? (byId.get(homepage.primaryKhutbahId) ?? null) : null;
    const supporting1 = homepage?.supportingKhutbah1Id ? (byId.get(homepage.supportingKhutbah1Id) ?? null) : null;
    const supporting2 = homepage?.supportingKhutbah2Id ? (byId.get(homepage.supportingKhutbah2Id) ?? null) : null;

    return resolveFeaturedKhutbahs<Video>(primary, supporting1, supporting2);
  },

  // ---- Credentials ----
  async addCredential(input: HomepageCredentialFormInput) {
    const count = await homepageRepository.countCredentials();
    if (!canAddHomepageCredential(count)) {
      throw new ConflictError(`You can only have up to ${MAX_HOMEPAGE_CREDENTIALS} credentials.`);
    }
    return homepageRepository.createCredential(input);
  },

  updateCredential: (id: string, input: Partial<HomepageCredentialFormInput>) =>
    homepageRepository.updateCredential(id, input),

  removeCredential: (id: string) => homepageRepository.deleteCredential(id),

  /** Swaps the given credential's `order` with its immediate neighbor — the only reorder primitive this list needs (a small, fixed-size, capped-at-4 list). */
  async moveCredential(id: string, direction: "up" | "down") {
    const items = await homepageRepository.listCredentials();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;

    const neighborIndex = direction === "up" ? index - 1 : index + 1;
    if (neighborIndex < 0 || neighborIndex >= items.length) return;

    const current = items[index];
    const neighbor = items[neighborIndex];

    await Promise.all([
      homepageRepository.updateCredential(current.id, { order: neighbor.order }),
      homepageRepository.updateCredential(neighbor.id, { order: current.order }),
    ]);
  },
};
