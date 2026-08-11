import { validateContactInquiry } from "@/lib/contact";
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

  try {
    if (JSON.stringify(body).length > MAX_BODY_BYTES) {
      return jsonError("Your request is too large.", 413);
    }
  } catch {
    return jsonError("Unable to read that request.", 400);
  }

  const result = validateContactInquiry(body);
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

  try {
    const sent = await sendContactEmail(result.data);
    if (!sent.ok) {
      return jsonError(SEND_ERROR, 502);
    }
  } catch {
    return jsonError(SEND_ERROR, 502);
  }

  return Response.json({ ok: true });
}
