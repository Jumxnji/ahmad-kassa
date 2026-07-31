import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db/client";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/schemas/auth.schema";

/**
 * Session lifetime. The Credentials provider only supports JWT
 * sessions (Auth.js has no database-session flow for it), so
 * "remember me" is implemented by setting a shorter or longer `exp`
 * claim on the token itself at sign-in — see the `jwt` callback below.
 * The Prisma adapter is still attached so Account/Session/
 * VerificationToken are ready the moment an OAuth provider is added;
 * it does not participate in Credentials sign-in.
 */
const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const DEFAULT_MAX_AGE = 60 * 60 * 8; // 8 hours — logged out at the end of a workday if not remembered

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: REMEMBER_ME_MAX_AGE },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        if (!user || !user.passwordHash) return null;
        if (user.status !== "ACTIVE") return null;

        const valid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          remember: parsed.data.remember,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
        const maxAge = user.remember ? REMEMBER_ME_MAX_AGE : DEFAULT_MAX_AGE;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
      }
      return token;
    },
    async session({ session, token }) {
      const jwt = token as unknown as JWT;
      session.user.id = jwt.id;
      session.user.role = jwt.role;
      return session;
    },
  },
  trustHost: process.env.AUTH_TRUST_HOST === "true",
});
