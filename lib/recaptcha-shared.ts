export const CONTACT_RECAPTCHA_ACTION = "contact_submit";
export const DEFAULT_RECAPTCHA_MIN_SCORE = 0.5;

export const CONTACT_VERIFY_ERROR =
  "We couldn't verify this request. Please try again.";

export function getRecaptchaSiteKey(): string {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
}
