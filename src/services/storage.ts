import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

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
  readonly width?: number;
  readonly height?: number;
  readonly thumbnailUrl?: string;
}

export interface StorageService {
  upload(input: { buffer: Buffer; filename: string; mimeType: string }): Promise<UploadedFile>;
  remove(input: { url: string; thumbnailUrl?: string | null }): Promise<void>;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

// Longest side a stored "full" image is allowed to be — large enough for
// any use on the site (hero, book cover, gallery lightbox), small enough
// that a visitor's phone camera photo doesn't ship at full resolution.
const MAX_DIMENSION = 2400;
const THUMBNAIL_WIDTH = 480;
const RASTER_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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

async function writePublicFile(uniqueName: string, buffer: Buffer): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, uniqueName), buffer);
  return `${PUBLIC_PREFIX}/${uniqueName}`;
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
    const cleanName = sanitizeFilename(filename);
    const stem = `${randomUUID()}-${cleanName.replace(path.extname(cleanName), "")}`;

    // SVGs are vector and everything else (PDFs, etc.) isn't an image
    // sharp can rasterize meaningfully — stored as-is, no processing.
    if (!RASTER_TYPES.has(mimeType)) {
      const url = await writePublicFile(`${stem}${path.extname(cleanName)}`, buffer);
      return { url, filename: `${stem}${path.extname(cleanName)}`, size: buffer.byteLength };
    }

    const ext = mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".jpg";
    const pipeline = sharp(buffer).rotate(); // `.rotate()` with no args auto-orients from EXIF

    const optimized = await pipeline
      .clone()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });

    const thumbnail = await pipeline
      .clone()
      .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
      .toBuffer();

    const mainName = `${stem}${ext}`;
    const thumbName = `${stem}-thumb${ext}`;

    const [url, thumbnailUrl] = await Promise.all([
      writePublicFile(mainName, optimized.data),
      writePublicFile(thumbName, thumbnail),
    ]);

    return {
      url,
      thumbnailUrl,
      filename: mainName,
      size: optimized.data.byteLength,
      width: optimized.info.width,
      height: optimized.info.height,
    };
  },

  async remove({ url, thumbnailUrl }) {
    for (const target of [url, thumbnailUrl]) {
      if (!target || !target.startsWith(PUBLIC_PREFIX)) continue;
      const filename = target.slice(PUBLIC_PREFIX.length + 1);
      await unlink(path.join(UPLOAD_DIR, filename)).catch(() => {
        // Already gone — deleting a Media row shouldn't fail because
        // the underlying file was manually removed.
      });
    }
  },
};

export const storageService: StorageService = localStorageService;
