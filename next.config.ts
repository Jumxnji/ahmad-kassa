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
    //
    // *.public.blob.vercel-storage.com — CMS uploads (book covers,
    // homepage hero, site logo, SEO images) now live in Vercel Blob
    // (see storage.ts). Wildcarded because the store's subdomain is a
    // per-store random hash, not a fixed hostname. Without this, Next's
    // Image Optimization API 400s on any Blob-hosted image (confirmed
    // directly: /_next/image?url=<blob-url> returned 400 until this
    // was added, even though the underlying Blob object itself was
    // already correctly public and retrievable).
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  // The above makes Turbopack load sharp as an external module at
  // runtime rather than bundling it, but that alone doesn't guarantee
  // Next.js's build-time file tracer (@vercel/nft) copies sharp's
  // native .so binaries into the deployed function — dlopen'd native
  // addons are a documented tracer blind spot (see Next.js's own
  // "output" config docs, which name exactly this pattern as a
  // required fix).
  //
  // `node_modules/sharp/**/*` alone had zero effect: verified locally
  // (via .next/server/app/admin/(app)/page.js.nft.json) that the
  // actual libvips shared library — @img/sharp-libvips-<platform>'s
  // lib/libvips-cpp.<version>.<ext> — sits in a sibling @img/* package,
  // not inside node_modules/sharp/ at all, so that glob could never
  // have matched it. The platform-specific @img/sharp-<platform>
  // native addon binding gets traced in automatically (confirmed
  // locally); only the deeper libvips .so/.dylib it dlopens is missed.
  // Only the linux-x64 runtime variant is included since that's what
  // Vercel's build/runtime actually targets.
  outputFileTracingIncludes: {
    "/*": [
      "node_modules/sharp/**/*",
      "node_modules/@img/sharp-linux-x64/**/*",
      "node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
  // Baseline security headers (Sprint 5) — cheap, broadly-recommended
  // hardening that sits alongside the app-level protections (Zod
  // validation everywhere, bcrypt password hashing, rate-limited auth
  // endpoints, sanitize-html on rich text). CSRF for Server Actions and
  // the Auth.js credentials flow is handled by the framework itself
  // (Origin-header verification / double-submit cookie) — see
  // docs/PROJECT_MEMORY.md rather than reimplementing it here.
  // Content-Security-Policy (pre-launch hardening) — derived from what
  // this app actually loads, not copied from a generic template:
  // - script-src/style-src need 'unsafe-inline' for the inline JSON-LD
  //   <script> tags (src/components/shared/json-ld.tsx, developer-
  //   controlled data, not user input) and React's inline style={{}}
  //   attributes — there's no middleware.ts/nonce plumbing to do this
  //   more strictly yet. The one place user content renders as raw
  //   HTML (book.description via dangerouslySetInnerHTML) is sanitized
  //   through sanitizeHtml() first with a tag allowlist that has zero
  //   allowed attributes (src/lib/sanitize-rich-text.ts) — it can't
  //   inject a <script> or event handler regardless of this policy.
  // - img-src covers next/image's own remotePatterns (i.ytimg.com,
  //   Vercel Blob) plus `data:` for blur-placeholder data URIs.
  // - connect-src/script-src 'self' alone covers @vercel/analytics —
  //   confirmed by reading the installed package: in production it
  //   loads /_vercel/insights/script.js and posts to /_vercel/insights,
  //   both same-origin relative paths Vercel proxies at the edge, not
  //   an external host.
  // - frame-src is YouTube only, for the lecture-embed iframes
  //   (src/components/cards/video-card.tsx, khutbah-entry.tsx).
  // - Resend has no browser-side involvement at all — not referenced.
  // No Strict-Transport-Security here deliberately — Vercel applies
  // HSTS automatically on verified custom domains; adding one here
  // would just duplicate (and risk drifting from) what the edge
  // already sends.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://i.ytimg.com https://*.public.blob.vercel-storage.com",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src https://www.youtube.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
