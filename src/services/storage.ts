import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { del, put } from "@vercel/blob";

/**
 * Storage abstraction so the rest of the app never touches the
 * filesystem (or a cloud bucket) directly. `localStorageService` and
 * `vercelBlobStorageService` both implement this same interface —
 * nothing calling `storageService.upload()` needs to change based on
 * which one is active.
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

interface ProcessedUpload {
  /** Non-raster files (SVG, PDF) are stored as-is — this is the only buffer. */
  main: { buffer: Buffer; filename: string };
  thumbnail?: { buffer: Buffer; filename: string };
  width?: number;
  height?: number;
}

/**
 * Shared prep step for both storage backends: sanitizes the filename,
 * and — for raster images — auto-orients, downsizes, and generates a
 * thumbnail via sharp. SVGs, PDFs, and anything else sharp can't
 * meaningfully rasterize are stored unprocessed.
 */
async function processUpload(input: { buffer: Buffer; filename: string; mimeType: string }): Promise<ProcessedUpload> {
  const cleanName = sanitizeFilename(input.filename);
  const stem = `${randomUUID()}-${cleanName.replace(path.extname(cleanName), "")}`;

  if (!RASTER_TYPES.has(input.mimeType)) {
    return { main: { buffer: input.buffer, filename: `${stem}${path.extname(cleanName)}` } };
  }

  const ext = input.mimeType === "image/png" ? ".png" : input.mimeType === "image/webp" ? ".webp" : ".jpg";
  const pipeline = sharp(input.buffer).rotate(); // `.rotate()` with no args auto-orients from EXIF

  const optimized = await pipeline
    .clone()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });

  const thumbnail = await pipeline
    .clone()
    .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
    .toBuffer();

  return {
    main: { buffer: optimized.data, filename: `${stem}${ext}` },
    thumbnail: { buffer: thumbnail, filename: `${stem}-thumb${ext}` },
    width: optimized.info.width,
    height: optimized.info.height,
  };
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

async function writePublicFile(uniqueName: string, buffer: Buffer): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, uniqueName), buffer);
  return `${PUBLIC_PREFIX}/${uniqueName}`;
}

/**
 * Local filesystem implementation — files live under public/uploads
 * and are served by Next.js like any other static asset. Fine for
 * local development and single-instance deployments; a production
 * deploy on serverless infrastructure (Vercel) needs
 * `vercelBlobStorageService` instead — the filesystem isn't
 * writable/persistent there.
 */
export const localStorageService: StorageService = {
  async upload(input) {
    const processed = await processUpload(input);

    if (!processed.thumbnail) {
      const url = await writePublicFile(processed.main.filename, processed.main.buffer);
      return { url, filename: processed.main.filename, size: processed.main.buffer.byteLength };
    }

    const [url, thumbnailUrl] = await Promise.all([
      writePublicFile(processed.main.filename, processed.main.buffer),
      writePublicFile(processed.thumbnail.filename, processed.thumbnail.buffer),
    ]);

    return {
      url,
      thumbnailUrl,
      filename: processed.main.filename,
      size: processed.main.buffer.byteLength,
      width: processed.width,
      height: processed.height,
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

/**
 * Vercel Blob implementation — used in every Vercel environment
 * (Production, Preview; see the `storageService` export below), where
 * `public/` is read-only/ephemeral and can't hold CMS uploads. Blob
 * objects are public (this app has no private-media use case) and get
 * a random suffix per Vercel's own collision-avoidance recommendation
 * — the uuid-prefixed filename already avoids collisions in practice,
 * this is a second, cheap guarantee. Auth/validation (file type, 15MB
 * cap, permission checks) all happen upstream of this service, in
 * uploadMediaAction — unchanged by this swap.
 */
export const vercelBlobStorageService: StorageService = {
  async upload(input) {
    const processed = await processUpload(input);
    const contentType = input.mimeType;

    if (!processed.thumbnail) {
      const blob = await put(`uploads/${processed.main.filename}`, processed.main.buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType,
      });
      return { url: blob.url, filename: processed.main.filename, size: processed.main.buffer.byteLength };
    }

    const [mainBlob, thumbBlob] = await Promise.all([
      put(`uploads/${processed.main.filename}`, processed.main.buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType,
      }),
      put(`uploads/${processed.thumbnail.filename}`, processed.thumbnail.buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType,
      }),
    ]);

    return {
      url: mainBlob.url,
      thumbnailUrl: thumbBlob.url,
      filename: processed.main.filename,
      size: processed.main.buffer.byteLength,
      width: processed.width,
      height: processed.height,
    };
  },

  async remove({ url, thumbnailUrl }) {
    const targets = [url, thumbnailUrl].filter((target): target is string => Boolean(target));
    if (targets.length === 0) return;
    // del() never throws for a URL that doesn't exist — safe to call
    // unconditionally, same "already gone is fine" contract as local.
    await del(targets);
  },
};

/**
 * `VERCEL` is set automatically in every Vercel environment
 * (Production, Preview, and `vercel dev`) — not something this
 * project sets itself. Local `next dev`/`next build` never has it, so
 * local development keeps writing to `public/uploads` unchanged.
 */
export const storageService: StorageService = process.env.VERCEL ? vercelBlobStorageService : localStorageService;
