import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  CONTACT_FIELD_LIMITS,
  isValidContactEmail,
  validateContactInquiry,
} from "./contact";
import { buildContactEmail, sendContactEmail } from "./send-contact-email";

const validInquiry = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  service: "photography",
  otherService: "",
  project: "I need portraits for a small studio launch next month.",
  budget: "1000-2500",
  timeline: "1-month",
  specificDate: "",
  website: "",
};

describe("validateContactInquiry", () => {
  it("accepts a normal valid inquiry", () => {
    const result = validateContactInquiry(validInquiry);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.honeypotTriggered, false);
      assert.equal(result.data.email, "ada@example.com");
      assert.equal(result.data.service, "photography");
    }
  });

  it("rejects a missing name", () => {
    const result = validateContactInquiry({ ...validInquiry, name: "   " });
    assert.equal(result.ok, false);
    if (!result.ok) assert.ok(result.errors.name);
  });

  it("accepts Unicode letters in names", () => {
    const result = validateContactInquiry({ ...validInquiry, name: "李明" });
    assert.equal(result.ok, true);
  });

  it("accepts apostrophes, hyphens, periods, and accented names", () => {
    for (const name of ["O'Connor", "Anne-Marie", "José", "Jean-Luc", "A. Smith"]) {
      const result = validateContactInquiry({ ...validInquiry, name });
      assert.equal(result.ok, true, `expected ${name} to be accepted`);
    }
  });

  it("rejects names containing script markup", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      name: '<script>alert(1)</script>',
    });
    assert.equal(result.ok, false);
  });

  it("rejects names that are only punctuation or numbers", () => {
    for (const name of ["12345", "----", "...", "@@@"]) {
      const result = validateContactInquiry({ ...validInquiry, name });
      assert.equal(result.ok, false, `expected ${name} to be rejected`);
    }
  });

  it("rejects an invalid email", () => {
    const result = validateContactInquiry({ ...validInquiry, email: "not-an-email" });
    assert.equal(result.ok, false);
  });

  it("rejects CR/LF header injection in email", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      email: "ada@example.com\r\nBcc:attacker@example.com",
    });
    assert.equal(result.ok, false);
    assert.equal(isValidContactEmail("ada@example.com\r\nBcc:x@y.com"), false);
  });

  it("rejects multiple-address tricks", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      email: "ada@example.com,evil@example.com",
    });
    assert.equal(result.ok, false);
  });

  it("rejects a very long email", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      email: `${"a".repeat(250)}@example.com`,
    });
    assert.equal(result.ok, false);
  });

  it("rejects a very long name", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      name: "A".repeat(CONTACT_FIELD_LIMITS.name + 1),
    });
    assert.equal(result.ok, false);
  });

  it("rejects a very long project description", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      project: "a".repeat(CONTACT_FIELD_LIMITS.project + 1),
    });
    assert.equal(result.ok, false);
  });

  it("accepts project descriptions that contain HTML or code as plain text", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      project:
        'Please review <script>alert(1)</script> and this snippet: if (x < 10 && y > 1) { console.log("ok"); }',
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.match(result.data.project, /<script>/);
    }
  });

  it("rejects unexpected service, budget, and timeline values", () => {
    const service = validateContactInquiry({ ...validInquiry, service: "crypto-mining" });
    const budget = validateContactInquiry({ ...validInquiry, budget: "unlimited" });
    const timeline = validateContactInquiry({ ...validInquiry, timeline: "yesterday" });
    assert.equal(service.ok, false);
    assert.equal(budget.ok, false);
    assert.equal(timeline.ok, false);
  });

  it("treats a populated honeypot as a silent success without using the payload", () => {
    const result = validateContactInquiry({
      ...validInquiry,
      website: "https://spam.example",
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.honeypotTriggered, true);
      assert.equal(result.data.email, "honeypot@invalid.example");
    }
  });
});

describe("buildContactEmail", () => {
  it("uses a server-controlled subject and escapes HTML in the HTML body", () => {
    const email = buildContactEmail({
      name: 'Ada <script>alert(1)</script>',
      email: "ada@example.com",
      service: "photography",
      otherService: "",
      project: 'Need <b>portraits</b> & "headshots"',
      budget: "1000-2500",
      timeline: "1-month",
      specificDate: "",
    });

    assert.equal(email.subject, "New Edwinspira Inquiry: Photography");
    assert.doesNotMatch(email.html, /<script>/);
    assert.match(email.html, /&lt;script&gt;/);
    assert.match(email.html, /&amp;/);
    assert.match(email.text, /Ada <script>alert\(1\)<\/script>/);
  });
});

describe("sendContactEmail", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  afterEach(() => {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  });

  it("sends through Resend using CONTACT_EMAIL_FROM, CONTACT_EMAIL_TO, and a validated Reply-To", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_EMAIL_FROM = "Edwinspira Website <contact@contact.edwinspira.com>";
    process.env.CONTACT_EMAIL_TO = "edwin@edwinspira.com";
    delete process.env.CONTACT_FROM_EMAIL;
    delete process.env.CONTACT_TO_EMAIL;

    let payload: {
      from?: string;
      to?: string[];
      reply_to?: string;
      subject?: string;
    } = {};
    globalThis.fetch = async (_input, init) => {
      payload = JSON.parse(String(init?.body)) as typeof payload;
      return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
    };

    const result = await sendContactEmail({
      name: "Ada Lovelace",
      email: "ada@example.com",
      service: "visual-art",
      otherService: "",
      project: "I need artwork for a small studio launch next month.",
      budget: "1000-2500",
      timeline: "1-month",
      specificDate: "",
    });

    assert.equal(result.ok, true);
    assert.equal(payload.from, "Edwinspira Website <contact@contact.edwinspira.com>");
    assert.deepEqual(payload.to, ["edwin@edwinspira.com"]);
    assert.equal(payload.reply_to, "ada@example.com");
    assert.equal(payload.subject, "New Edwinspira Inquiry: Visual Art & Design");
  });

  it("does not send when the new Resend environment variables are missing", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_EMAIL_FROM;
    process.env.CONTACT_FROM_EMAIL = "legacy@example.com";
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
    };

    const result = await sendContactEmail({
      name: "Ada Lovelace",
      email: "ada@example.com",
      service: "photography",
      otherService: "",
      project: "I need portraits for a small studio launch next month.",
      budget: "",
      timeline: "",
      specificDate: "",
    });

    assert.equal(result.ok, false);
    assert.equal(called, false);
  });
});
