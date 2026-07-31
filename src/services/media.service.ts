import "server-only";
import { mediaRepository } from "@/repositories/media.repository";
import { storageService } from "@/services/storage";
import type { UpdateMediaDetailsInput } from "@/validators/media.validator";
import type { $Enums } from "@/generated/prisma/client";

export const mediaService = {
  list: (opts?: { folder?: $Enums.MediaFolder; search?: string }) =>
    mediaRepository.findMany({
      where: {
        ...(opts?.folder ? { folder: opts.folder } : {}),
        ...(opts?.search
          ? { filename: { contains: opts.search, mode: "insensitive" as const } }
          : {}),
      },
    }),

  get: (id: string) => mediaRepository.findById(id),
  count: () => mediaRepository.count(),
  listRecent: (limit: number = 5) => mediaRepository.findMany({ take: limit }),
  countUsages: (id: string) => mediaRepository.countUsages(id),

  async upload(input: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    folder: $Enums.MediaFolder;
    altText?: string;
    uploadedById?: string;
  }) {
    const uploaded = await storageService.upload(input);
    return mediaRepository.create({
      filename: input.filename,
      url: uploaded.url,
      thumbnailUrl: uploaded.thumbnailUrl,
      mimeType: input.mimeType,
      size: uploaded.size,
      width: uploaded.width,
      height: uploaded.height,
      folder: input.folder,
      altText: input.altText,
      uploadedById: input.uploadedById,
    });
  },

  async remove(id: string) {
    const media = await mediaRepository.findById(id);
    if (!media) return;
    await storageService.remove({ url: media.url, thumbnailUrl: media.thumbnailUrl });
    await mediaRepository.delete(id);
  },

  rename: (id: string, filename: string) => mediaRepository.update(id, { filename }),

  updateDetails: (id: string, input: UpdateMediaDetailsInput) =>
    mediaRepository.update(id, { filename: input.filename, altText: input.altText || null }),
};
