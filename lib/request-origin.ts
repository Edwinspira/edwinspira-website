import { siteConfig } from "@/lib/site";

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function allowedOrigins(): Set<string> {
  const origins = new Set<string>([siteConfig.domain, "https://www.edwinspira.com"]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    const origin = normalizeOrigin(siteUrl);
    if (origin) origins.add(origin);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    origins.add(`https://${vercelUrl}`);
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  return origins;
}

export function isAllowedRequestOrigin(request: Request): boolean {
  const allowed = allowedOrigins();
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    const origin = normalizeOrigin(originHeader);
    return Boolean(origin && allowed.has(origin));
  }

  const referer = request.headers.get("referer");
  if (!referer) return false;
  const origin = normalizeOrigin(referer);
  return Boolean(origin && allowed.has(origin));
}

function firstForwardedHop(value: string | null): string | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  if (!first) return null;

  const withoutBrackets = first.replace(/^\[([^\]]+)\](?::\d+)?$/, "$1");
  const withoutIpv4Port =
    withoutBrackets.includes(":") && withoutBrackets.includes(".")
      ? withoutBrackets.replace(/:\d+$/, "")
      : withoutBrackets;

  return withoutIpv4Port.trim().toLowerCase() || null;
}

/**
 * Client IP from platform-controlled headers only.
 * On Vercel, `x-vercel-forwarded-for` is set by the platform.
 * Arbitrary `x-forwarded-for` values are ignored off-platform.
 */
export function trustedClientIp(request: Request): string {
  const vercelForwarded = firstForwardedHop(request.headers.get("x-vercel-forwarded-for"));
  if (vercelForwarded) return vercelForwarded;

  if (process.env.VERCEL === "1") {
    const forwarded = firstForwardedHop(request.headers.get("x-forwarded-for"));
    if (forwarded) return forwarded;

    const realIp = firstForwardedHop(request.headers.get("x-real-ip"));
    if (realIp) return realIp;
  }

  return "unknown";
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function clientKey(request: Request): Promise<string> {
  const ip = trustedClientIp(request);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`contact:${ip}`),
  );
  return toHex(new Uint8Array(digest)).slice(0, 24);
}
