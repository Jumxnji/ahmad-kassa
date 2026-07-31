import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";

// No `server-only` guard here — prisma/seed.ts imports this directly
// via tsx (a plain Node script, outside the Next.js bundler), and
// `server-only` throws unconditionally outside that bundling context.
// bcryptjs itself can't run in a browser bundle anyway, so accidental
// client usage would fail loudly at build time regardless.

const SALT_ROUNDS = 12;

// Excludes visually ambiguous characters (0/O, 1/l/I) so a generated
// password can be read aloud or copy-pasted without confusion.
const PASSWORD_CHARSET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Cryptographically random password — used for seeding and admin-triggered resets. */
export function generateSecurePassword(length = 16): string {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += PASSWORD_CHARSET[randomInt(PASSWORD_CHARSET.length)];
  }
  return password;
}
