import { validateContactInquiry, type ContactInquiry } from "@/lib/contact";
import { consumeContactRateLimit } from "@/lib/rate-limit";
import { CONTACT_VERIFY_ERROR } from "@/lib/recaptcha-shared";
import { readRecaptchaToken, verifyContactRecaptcha } from "@/lib/recaptcha";
import { clientKey, isAllowedRequestOrigin } from "@/lib/request-origin";
import { sendContactEmail } from "@/lib/send-contact-email";

const MAX_BODY_BYTES = 16_384;

const FORM_ERROR = "Please check the highlighted fields and try again.";
const RATE_LIMIT_ERROR =
  "Too many requests have been sent. Please wait a few minutes and try again.";
const SEND_ERROR =
  "Something went wrong while sending your request. Please try again or email me directly at edwin@edwinspira.com.";

function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ ok: false, error: message, ...extra }, { status });
}

function hasPopulatedHoneypot(body: Record<string, unknown>): boolean {
  const value = body.website;
  return typeof value === "string" && value.trim().length > 0;
}

async function sendValidatedContactInquiry(data: ContactInquiry) {
  try {
    const sent = await sendContactEmail(data);
    if (!sent.ok) {
      return jsonError(SEND_ERROR, 502);
    }
  } catch {
    return jsonError(SEND_ERROR, 502);
  }

  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  if (!isAllowedRequestOrigin(request)) {
    return jsonError(CONTACT_VERIFY_ERROR, 403);
  }

  let limited = false;
  let retryAfterSeconds = 60;
  try {
    const limit = await consumeContactRateLimit(await clientKey(request));
    limited = limit.limited;
    retryAfterSeconds = limit.retryAfterSeconds;
  } catch {
    console.error("Contact rate limiter failed.");
    return jsonError(RATE_LIMIT_ERROR, 429);
  }

  if (limited) {
    return new Response(JSON.stringify({ ok: false, error: RATE_LIMIT_ERROR }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonError("Your request is too large.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Unable to read that request.", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Unable to read that request.", 400);
  }
  const input = body as Record<string, unknown>;

  try {
    if (JSON.stringify(body).length > MAX_BODY_BYTES) {
      return jsonError("Your request is too large.", 413);
    }
  } catch {
    return jsonError("Unable to read that request.", 400);
  }

  if (hasPopulatedHoneypot(input)) {
    const recaptcha = await verifyContactRecaptcha(readRecaptchaToken(input.recaptchaToken));
    if (!recaptcha.ok) {
      return Response.json({ ok: true });
    }

    const verifiedResult = validateContactInquiry({ ...input, website: "" });
    if (!verifiedResult.ok) {
      return Response.json(
        { ok: false, error: FORM_ERROR, errors: verifiedResult.errors },
        { status: 422 },
      );
    }

    return sendValidatedContactInquiry(verifiedResult.data);
  }

  const result = validateContactInquiry(input);
  if (!result.ok) {
    return Response.json({ ok: false, error: FORM_ERROR, errors: result.errors }, { status: 422 });
  }

  if (result.honeypotTriggered) {
    return Response.json({ ok: true });
  }

  const recaptcha = await verifyContactRecaptcha(
    readRecaptchaToken("recaptchaToken" in body ? body.recaptchaToken : null),
  );
  if (!recaptcha.ok) {
    return jsonError(CONTACT_VERIFY_ERROR, 403);
  }

  return sendValidatedContactInquiry(result.data);
}
