import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
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
