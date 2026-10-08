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

type ReadJsonResult =
  | { ok: true; body: unknown }
  | { ok: false; message: string; status: number };

function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ ok: false, error: message, ...extra }, { status });
}

function concatChunks(chunks: Uint8Array[], byteLength: number): Uint8Array {
  if (chunks.length === 1) return chunks[0];

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function readLimitedJson(request: Request): Promise<ReadJsonResult> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { ok: false, message: "Your request is too large.", status: 413 };
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return { ok: false, message: "Unable to read that request.", status: 400 };
  }

  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      byteLength += value.byteLength;
      if (byteLength > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, message: "Your request is too large.", status: 413 };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, message: "Unable to read that request.", status: 400 };
  }

  try {
    const rawBody = new TextDecoder().decode(concatChunks(chunks, byteLength));
    return { ok: true, body: JSON.parse(rawBody) as unknown };
  } catch {
    return { ok: false, message: "Unable to read that request.", status: 400 };
  }
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

  const readResult = await readLimitedJson(request);
  if (!readResult.ok) {
    return jsonError(readResult.message, readResult.status);
  }

  const { body } = readResult;
  if (!body || typeof body !== "object") {
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
