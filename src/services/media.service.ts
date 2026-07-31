import "server-only";
import { mediaRepository } from "@/repositories/media.repository";
import { storageService } from "@/services/storage";
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
      mimeType: input.mimeType,
      size: uploaded.size,
      folder: input.folder,
      altText: input.altText,
      uploadedById: input.uploadedById,
    });
  },

  async remove(id: string) {
    const media = await mediaRepository.findById(id);
    if (!media) return;
    await storageService.remove(media.url);
    await mediaRepository.delete(id);
  },

  rename: (id: string, filename: string) => mediaRepository.update(id, { filename }),
};
