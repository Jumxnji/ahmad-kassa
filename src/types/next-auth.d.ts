import type { DefaultSession } from "next-auth";
import type { Role } from "@/permissions/roles";

// Augments Auth.js's built-in types with the fields our Credentials
// provider actually returns/stores — id and role on both the session
// and the JWT, so `auth()`/`getCurrentUser()` callers get real types
// instead of `any`.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    /** Only present on the object `authorize()` returns at sign-in — read once in the `jwt` callback. */
    remember?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
