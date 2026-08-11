import {
  CONTACT_RECAPTCHA_ACTION,
  DEFAULT_RECAPTCHA_MIN_SCORE,
  getRecaptchaSiteKey,
} from "@/lib/recaptcha-shared";

export {
  CONTACT_RECAPTCHA_ACTION,
  CONTACT_VERIFY_ERROR,
  DEFAULT_RECAPTCHA_MIN_SCORE,
  getRecaptchaSiteKey,
} from "@/lib/recaptcha-shared";

type RecaptchaAssessment = {
  tokenProperties?: {
    valid?: boolean;
    action?: string;
    invalidReason?: string;
  };
  riskAnalysis?: {
    score?: number;
  };
};

export type RecaptchaVerification =
  | { ok: true; score: number }
  | { ok: false; reason: "missing" | "invalid" | "action" | "score" | "config" | "provider" };

function parseMinScore(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_RECAPTCHA_MIN_SCORE;
  return Math.min(1, Math.max(0, parsed));
}

export function getRecaptchaMinScore(): number {
  return parseMinScore(process.env.RECAPTCHA_MIN_SCORE);
}

function getServerRecaptchaConfig() {
  return {
    siteKey: getRecaptchaSiteKey(),
    apiKey: process.env.RECAPTCHA_API_KEY?.trim() ?? "",
    projectId: process.env.RECAPTCHA_PROJECT_ID?.trim() ?? "",
    minScore: getRecaptchaMinScore(),
  };
}

export function isRecaptchaConfigured(): boolean {
  const config = getServerRecaptchaConfig();
  return Boolean(config.siteKey && config.apiKey && config.projectId);
}

export function readRecaptchaToken(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const token = value.trim();
  if (!token || token.length > 4000) return null;
  if (/[\r\n\u0000]/.test(token)) return null;
  return token;
}

function assessmentUrl(projectId: string, apiKey: string): string {
  return `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(
    projectId,
  )}/assessments?key=${encodeURIComponent(apiKey)}`;
}

export async function verifyContactRecaptcha(
  token: string | null,
  expectedAction = CONTACT_RECAPTCHA_ACTION,
): Promise<RecaptchaVerification> {
  if (!token) {
    return { ok: false, reason: "missing" };
  }

  const config = getServerRecaptchaConfig();
  if (!config.siteKey || !config.apiKey || !config.projectId) {
    console.error("Contact reCAPTCHA is not configured.");
    return { ok: false, reason: "config" };
  }

  let response: Response;
  try {
    response = await fetch(assessmentUrl(config.projectId, config.apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey: config.siteKey,
          expectedAction,
        },
      }),
      cache: "no-store",
    });
  } catch {
    console.error("Contact reCAPTCHA assessment request failed.");
    return { ok: false, reason: "provider" };
  }

  if (!response.ok) {
    console.error("Contact reCAPTCHA assessment was rejected by Google.");
    return { ok: false, reason: "provider" };
  }

  let assessment: RecaptchaAssessment;
  try {
    assessment = (await response.json()) as RecaptchaAssessment;
  } catch {
    console.error("Contact reCAPTCHA assessment response was unreadable.");
    return { ok: false, reason: "provider" };
  }

  if (!assessment.tokenProperties?.valid) {
    console.warn("Contact reCAPTCHA token was invalid.");
    return { ok: false, reason: "invalid" };
  }

  if (assessment.tokenProperties.action !== expectedAction) {
    console.warn("Contact reCAPTCHA action did not match.");
    return { ok: false, reason: "action" };
  }

  const score = assessment.riskAnalysis?.score;
  if (typeof score !== "number" || !Number.isFinite(score) || score < config.minScore) {
    console.warn("Contact reCAPTCHA score was below the configured threshold.");
    return { ok: false, reason: "score" };
  }

  return { ok: true, score };
}
