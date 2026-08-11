export const CONTACT_RATE_LIMIT = {
  short: { max: 5, windowMs: 15 * 60 * 1000 },
  long: { max: 20, windowMs: 24 * 60 * 60 * 1000 },
} as const;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

const memoryHits = new Map<string, RateLimitEntry>();
let warnedMissingStore = false;

function pruneExpired(now: number) {
  for (const [key, entry] of memoryHits) {
    if (entry.resetAt <= now) {
      memoryHits.delete(key);
    }
  }
}

export function consumeMemoryRateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  if (memoryHits.size > 500) {
    pruneExpired(now);
  }

  const existing = memoryHits.get(key);
  if (!existing || existing.resetAt <= now) {
    memoryHits.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  if (existing.count > max) {
    return { limited: true, retryAfterSeconds };
  }

  return { limited: false, retryAfterSeconds };
}

function upstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

async function consumeUpstashRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const config = upstashConfig();
  if (!config) {
    throw new Error("Upstash is not configured.");
  }

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, windowMs, "NX"],
      ["PTTL", key],
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Upstash rate limit request failed.");
  }

  const payload = (await response.json()) as Array<{ result?: unknown }>;
  const count = Number(payload[0]?.result);
  const ttlMs = Number(payload[2]?.result);
  const retryAfterSeconds = Math.max(1, Math.ceil((Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : windowMs) / 1000));

  if (!Number.isFinite(count) || count > max) {
    return { limited: true, retryAfterSeconds };
  }

  return { limited: false, retryAfterSeconds };
}

function worseLimit(a: RateLimitResult, b: RateLimitResult): RateLimitResult {
  if (a.limited && b.limited) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(a.retryAfterSeconds, b.retryAfterSeconds),
    };
  }
  return a.limited ? a : b;
}

export async function consumeContactRateLimit(identity: string): Promise<RateLimitResult> {
  const shortKey = `contact:short:${identity}`;
  const longKey = `contact:long:${identity}`;
  const store = upstashConfig();

  if (store) {
    const short = await consumeUpstashRateLimit(
      shortKey,
      CONTACT_RATE_LIMIT.short.max,
      CONTACT_RATE_LIMIT.short.windowMs,
    );
    const long = await consumeUpstashRateLimit(
      longKey,
      CONTACT_RATE_LIMIT.long.max,
      CONTACT_RATE_LIMIT.long.windowMs,
    );
    return worseLimit(short, long);
  }

  if (process.env.NODE_ENV === "production" && process.env.VERCEL === "1" && !warnedMissingStore) {
    warnedMissingStore = true;
    console.warn(
      "Contact rate limiting is using in-memory storage. Configure Upstash Redis for durable limits across Vercel instances.",
    );
  }

  return worseLimit(
    consumeMemoryRateLimit(shortKey, CONTACT_RATE_LIMIT.short.max, CONTACT_RATE_LIMIT.short.windowMs),
    consumeMemoryRateLimit(longKey, CONTACT_RATE_LIMIT.long.max, CONTACT_RATE_LIMIT.long.windowMs),
  );
}
