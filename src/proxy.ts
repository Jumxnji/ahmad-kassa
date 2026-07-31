import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Role } from "@/permissions/roles";

// Next.js 16 renamed the `middleware` file convention to `proxy` — see
// node_modules/next/dist/docs/.../file-conventions/proxy.md. This is
// that file; it plays the same role Middleware used to.

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

/**
 * Coarse, JWT-only role gate — fast, no DB round trip, but only as
 * fresh as the session token (updated at sign-in). This is a UX
 * convenience so a blocked user doesn't even see a page flash before
 * being redirected; it is NOT the authoritative security boundary.
 * The real check is requirePageAccess()/requirePermission(), both of
 * which re-read the user's current role from the database on every
 * call — see docs/PROJECT_MEMORY.md.
 */
const ROLE_RESTRICTED_PREFIXES: { prefix: string; allow: readonly Role[] }[] = [
  { prefix: "/admin/users", allow: ["OWNER", "ADMINISTRATOR", "VIEWER"] },
  { prefix: "/admin/settings", allow: ["OWNER", "ADMINISTRATOR", "VIEWER"] },
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((path) => pathname === path);
  const isLoggedIn = Boolean(req.auth?.user);

  if (isPublicAdminPath) {
    if (isLoggedIn && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    url.searchParams.set("reason", "unauthenticated");
    return NextResponse.redirect(url);
  }

  const role = req.auth!.user.role;
  const restricted = ROLE_RESTRICTED_PREFIXES.find((r) => pathname.startsWith(r.prefix));
  if (restricted && !restricted.allow.includes(role)) {
    return NextResponse.redirect(new URL("/admin/unauthorized", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
