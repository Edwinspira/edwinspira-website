import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { POST } from "../app/api/contact/route";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key];
  }
  Object.assign(process.env, originalEnv);
});

function configureContactEnv() {
  process.env.NEXT_PUBLIC_SITE_URL = "https://edwinspira.com";
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "public-site-key";
  process.env.RECAPTCHA_API_KEY = "server-api-key";
  process.env.RECAPTCHA_PROJECT_ID = "demo-project";
  process.env.RECAPTCHA_MIN_SCORE = "0.5";
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_EMAIL_FROM = "Edwinspira Website <contact@contact.edwinspira.com>";
  process.env.CONTACT_EMAIL_TO = "edwin@edwinspira.com";
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
}

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  service: "photography",
  otherService: "",
  project: "I need portraits for a small studio launch next month.",
  budget: "1000-2500",
  timeline: "1-month",
  specificDate: "",
  website: "",
  recaptchaToken: "test-token",
};

function contactRequest(body: unknown, init?: { origin?: string }) {
  return new Request("https://edwinspira.com/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: init?.origin ?? "https://edwinspira.com",
      "x-vercel-forwarded-for": `203.0.113.${Math.floor(Math.random() * 200) + 1}`,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("sends email only for a valid verified inquiry", async () => {
    configureContactEnv();
    let emailSent = false;
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      if (url.includes("recaptchaenterprise.googleapis.com")) {
        return Response.json({
          tokenProperties: { valid: true, action: "contact_submit" },
          riskAnalysis: { score: 0.9 },
        });
      }
      if (url.includes("api.resend.com")) {
        emailSent = true;
        const payload = JSON.parse(String(init?.body));
        assert.equal(payload.subject, "New Edwinspira Inquiry: Photography");
        assert.equal(payload.reply_to, "ada@example.com");
        assert.equal(payload.from, "Edwinspira Website <contact@contact.edwinspira.com>");
        assert.deepEqual(payload.to, ["edwin@edwinspira.com"]);
        return Response.json({ id: "email_1" });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    };

    const response = await POST(contactRequest(validBody));
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.ok, true);
    assert.equal(emailSent, true);
  });

  it("does not send email when the honeypot is populated", async () => {
    configureContactEnv();
    let emailSent = false;
    globalThis.fetch = async (input) => {
      if (String(input).includes("api.resend.com")) emailSent = true;
      return Response.json({ ok: true });
    };

    const response = await POST(
      contactRequest({ ...validBody, website: "https://spam.example" }),
    );
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.ok, true);
    assert.equal(emailSent, false);
  });

  it("does not send email when reCAPTCHA is missing", async () => {
    configureContactEnv();
    let emailSent = false;
    globalThis.fetch = async (input) => {
      if (String(input).includes("api.resend.com")) emailSent = true;
      return Response.json({ ok: true });
    };

    const response = await POST(contactRequest({ ...validBody, recaptchaToken: "" }));
    const payload = await response.json();
    assert.equal(response.status, 403);
    assert.equal(payload.error, "We couldn't verify this request. Please try again.");
    assert.equal(emailSent, false);
  });

  it("does not send email for malformed JSON", async () => {
    configureContactEnv();
    let emailSent = false;
    globalThis.fetch = async (input) => {
      if (String(input).includes("api.resend.com")) emailSent = true;
      return Response.json({ ok: true });
    };

    const response = await POST(contactRequest("{", { origin: "https://edwinspira.com" }));
    assert.equal(response.status, 400);
    assert.equal(emailSent, false);
  });

  it("does not send email for a direct cross-origin POST", async () => {
    configureContactEnv();
    let emailSent = false;
    globalThis.fetch = async (input) => {
      if (String(input).includes("api.resend.com")) emailSent = true;
      return Response.json({ ok: true });
    };

    const response = await POST(contactRequest(validBody, { origin: "https://evil.example" }));
    assert.equal(response.status, 403);
    assert.equal(emailSent, false);
  });
});
