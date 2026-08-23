import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // sharp (used by storage.ts for upload processing) ships a native
  // binary — Turbopack's file-tracing doesn't reliably include it in
  // the deployed function bundle, which crashed every route importing
  // it (e.g. /admin, via mediaService) with ERR_DLOPEN_FAILED on
  // Vercel's Linux runtime. Marking it external makes Next.js load it
  // as a real Node module from node_modules at runtime instead of
  // bundling it — Vercel's own documented fix for native-binary
  // packages like sharp/canvas.
  serverExternalPackages: ["sharp"],
  // AVIF/WebP negotiation for next/image (Sprint 9) — smaller payloads
  // on every browser that supports them, no source-image changes
  // needed since Next transcodes on request.
  images: {
    formats: ["image/avif", "image/webp"],
    // Sprint 18 — real khutbah thumbnails are hotlinked from YouTube's
    // own oEmbed-documented image host (the standard, expected way to
    // display a YouTube thumbnail), not downloaded into the repo.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  // The above makes Turbopack load sharp as an external module at
  // runtime rather than bundling it, but that alone doesn't guarantee
  // Next.js's build-time file tracer (@vercel/nft) copies sharp's
  // native .so binaries into the deployed function — dlopen'd native
  // addons are a documented tracer blind spot (see Next.js's own
  // "output" config docs, which name exactly this pattern as a
  // required fix). Confirmed via Vercel runtime logs: even after
  // serverExternalPackages + a clean no-cache rebuild, /admin still
  // threw ERR_DLOPEN_FAILED — this explicitly forces the binaries into
  // the trace.
  outputFileTracingIncludes: {
    "/*": ["node_modules/sharp/**/*"],
  },
  // Baseline security headers (Sprint 5) — cheap, broadly-recommended
  // hardening that sits alongside the app-level protections (Zod
  // validation everywhere, bcrypt password hashing, rate-limited auth
  // endpoints, sanitize-html on rich text). CSRF for Server Actions and
  // the Auth.js credentials flow is handled by the framework itself
  // (Origin-header verification / double-submit cookie) — see
  // docs/PROJECT_MEMORY.md rather than reimplementing it here.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
