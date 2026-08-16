import "server-only";
import { headers } from "next/headers";

/** Best-effort caller IP for rate limiting / audit trails — not authoritative behind untrusted proxies. */
export async function getRequestIp(): Promise<string | undefined> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? undefined;
}
