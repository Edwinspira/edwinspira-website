import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { consumeContactRateLimit, consumeMemoryRateLimit } from "./rate-limit";
import { readRecaptchaToken, verifyContactRecaptcha } from "./recaptcha";
import { isAllowedRequestOrigin, trustedClientIp } from "./request-origin";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("reCAPTCHA assessment", () => {
  it("rejects a missing token", async () => {
    const result = await verifyContactRecaptcha(readRecaptchaToken(undefined));
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "missing");
  });

  it("rejects an invalid assessment", async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "public-site-key";
    process.env.RECAPTCHA_API_KEY = "server-api-key";
    process.env.RECAPTCHA_PROJECT_ID = "demo-project";
    globalThis.fetch = async () =>
      jsonResponse({
        tokenProperties: { valid: false, invalidReason: "MALFORMED" },
        riskAnalysis: { score: 0.9 },
      }) as unknown as Promise<Response>;

    const result = await verifyContactRecaptcha("token");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "invalid");
  });

  it("rejects a mismatched action", async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "public-site-key";
    process.env.RECAPTCHA_API_KEY = "server-api-key";
    process.env.RECAPTCHA_PROJECT_ID = "demo-project";
    globalThis.fetch = async () =>
      jsonResponse({
        tokenProperties: { valid: true, action: "login" },
        riskAnalysis: { score: 0.9 },
      }) as unknown as Promise<Response>;

    const result = await verifyContactRecaptcha("token");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "action");
  });

  it("rejects a low risk score", async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "public-site-key";
    process.env.RECAPTCHA_API_KEY = "server-api-key";
    process.env.RECAPTCHA_PROJECT_ID = "demo-project";
    process.env.RECAPTCHA_MIN_SCORE = "0.5";
    globalThis.fetch = async () =>
      jsonResponse({
        tokenProperties: { valid: true, action: "contact_submit" },
        riskAnalysis: { score: 0.1 },
      }) as unknown as Promise<Response>;

    const result = await verifyContactRecaptcha("token");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "score");
  });

  it("accepts a valid assessment above the configured threshold", async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "public-site-key";
    process.env.RECAPTCHA_API_KEY = "server-api-key";
    process.env.RECAPTCHA_PROJECT_ID = "demo-project";
    process.env.RECAPTCHA_MIN_SCORE = "0.5";
    globalThis.fetch = async () =>
      jsonResponse({
        tokenProperties: { valid: true, action: "contact_submit" },
        riskAnalysis: { score: 0.9 },
      }) as unknown as Promise<Response>;

    const result = await verifyContactRecaptcha("token");
    assert.equal(result.ok, true);
  });
});

describe("origin and IP handling", () => {
  it("rejects a cross-origin POST", () => {
    const request = new Request("https://edwinspira.com/api/contact", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    });
    assert.equal(isAllowedRequestOrigin(request), false);
  });

  it("accepts the production origin", () => {
    const request = new Request("https://edwinspira.com/api/contact", {
      method: "POST",
      headers: { origin: "https://edwinspira.com" },
    });
    assert.equal(isAllowedRequestOrigin(request), true);
  });

  it("ignores spoofed X-Forwarded-For off Vercel", () => {
    delete process.env.VERCEL;
    const request = new Request("http://localhost:3000/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.9" },
    });
    assert.equal(trustedClientIp(request), "unknown");
  });

  it("uses the Vercel-controlled forwarded IP", () => {
    const request = new Request("https://edwinspira.com/api/contact", {
      headers: {
        "x-vercel-forwarded-for": "203.0.113.10",
        "x-forwarded-for": "198.51.100.1",
      },
    });
    assert.equal(trustedClientIp(request), "203.0.113.10");
  });
});

describe("rate limiting", () => {
  it("limits repeated rapid submissions in the short window", async () => {
    const key = `test-short-${Date.now()}-${Math.random()}`;
    let limited = false;
    for (let i = 0; i < 6; i += 1) {
      const result = consumeMemoryRateLimit(key, 5, 15 * 60 * 1000);
      if (result.limited) limited = true;
    }
    assert.equal(limited, true);
  });

  it("allows a later identity after a previous identity is limited", async () => {
    const first = await consumeContactRateLimit(`later-a-${Date.now()}`);
    const second = await consumeContactRateLimit(`later-b-${Date.now()}`);
    assert.equal(first.limited, false);
    assert.equal(second.limited, false);
  });
});
