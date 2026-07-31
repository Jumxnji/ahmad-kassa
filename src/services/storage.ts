import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Storage abstraction so the rest of the app never touches the
 * filesystem (or, later, a cloud bucket) directly. Swap
 * `localStorageService` for a Vercel Blob / S3 implementation of the
 * same interface when this moves off local dev — nothing calling
 * `storageService.upload()` needs to change.
 */
export interface UploadedFile {
  readonly url: string;
  readonly filename: string;
  readonly size: number;
}

export interface StorageService {
  upload(input: { buffer: Buffer; filename: string; mimeType: string }): Promise<UploadedFile>;
  remove(url: string): Promise<void>;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename);
  const base = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}${ext.toLowerCase()}`;
}

/**
 * Local filesystem implementation — files live under public/uploads
 * and are served by Next.js like any other static asset. Fine for
 * local development and single-instance deployments; a production
 * deploy on serverless infrastructure should swap this for Vercel
 * Blob (the filesystem isn't writable/persistent there).
 */
export const localStorageService: StorageService = {
  async upload({ buffer, filename, mimeType }) {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uniqueName = `${randomUUID()}-${sanitizeFilename(filename)}`;
    const destination = path.join(UPLOAD_DIR, uniqueName);
    await writeFile(destination, buffer);

    void mimeType; // reserved for future validation/processing

    return {
      url: `${PUBLIC_PREFIX}/${uniqueName}`,
      filename: uniqueName,
      size: buffer.byteLength,
    };
  },

  async remove(url) {
    if (!url.startsWith(PUBLIC_PREFIX)) return;
    const filename = url.slice(PUBLIC_PREFIX.length + 1);
    const target = path.join(UPLOAD_DIR, filename);
    await unlink(target).catch(() => {
      // Already gone — deleting a Media row shouldn't fail because
      // the underlying file was manually removed.
    });
  },
};

export const storageService: StorageService = localStorageService;
