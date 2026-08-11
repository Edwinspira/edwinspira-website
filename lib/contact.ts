export const CONTACT_EMAIL = "edwin@edwinspira.com";

export const CONTACT_SERVICE_IDS = [
  "software-development",
  "visual-art",
  "photography",
  "video-editing",
  "3d-sculpting",
  "general",
  "other",
] as const;

export type ContactServiceId = (typeof CONTACT_SERVICE_IDS)[number];

export const CONTACT_SERVICE_LABELS: Record<ContactServiceId, string> = {
  "software-development": "Software Development",
  "visual-art": "Visual Art & Design",
  photography: "Photography",
  "video-editing": "Video Editing",
  "3d-sculpting": "3D Sculpting",
  general: "General Question",
  other: "Other",
};

export const CONTACT_SERVICE_QUERY: Record<string, ContactServiceId> = {
  software: "software-development",
  art: "visual-art",
  photography: "photography",
  video: "video-editing",
  "3d": "3d-sculpting",
};

export const CONTACT_BUDGET_IDS = [
  "not-sure",
  "under-500",
  "500-1000",
  "1000-2500",
  "2500-5000",
  "5000-plus",
  "discuss",
] as const;

export type ContactBudgetId = (typeof CONTACT_BUDGET_IDS)[number];

export const CONTACT_BUDGET_LABELS: Record<ContactBudgetId, string> = {
  "not-sure": "Not sure yet",
  "under-500": "Under $500",
  "500-1000": "$500 to $1,000",
  "1000-2500": "$1,000 to $2,500",
  "2500-5000": "$2,500 to $5,000",
  "5000-plus": "$5,000+",
  discuss: "Let's discuss",
};

export const CONTACT_TIMELINE_IDS = [
  "no-deadline",
  "asap",
  "2-weeks",
  "1-month",
  "2-3-months",
  "3-plus-months",
  "specific-date",
] as const;

export type ContactTimelineId = (typeof CONTACT_TIMELINE_IDS)[number];

export const CONTACT_TIMELINE_LABELS: Record<ContactTimelineId, string> = {
  "no-deadline": "No specific deadline",
  asap: "As soon as possible",
  "2-weeks": "Within 2 weeks",
  "1-month": "Within 1 month",
  "2-3-months": "Within 2 to 3 months",
  "3-plus-months": "3+ months",
  "specific-date": "I have a specific date",
};

export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 254,
  project: 4000,
  otherService: 200,
  honeypot: 200,
  recaptchaToken: 4000,
} as const;

export const CONTACT_PROJECT_MIN_LENGTH = 10;
export const CONTACT_OTHER_SERVICE_MIN_LENGTH = 2;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/;
const MARKUP_CHARS = /[<>]/;
const EMAIL_LOCAL_PATTERN = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i;
const EMAIL_DOMAIN_PATTERN =
  /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

export type ContactInquiryInput = {
  name?: unknown;
  email?: unknown;
  service?: unknown;
  otherService?: unknown;
  project?: unknown;
  budget?: unknown;
  timeline?: unknown;
  specificDate?: unknown;
  website?: unknown;
  recaptchaToken?: unknown;
};

export type ContactInquiry = {
  name: string;
  email: string;
  service: ContactServiceId;
  otherService: string;
  project: string;
  budget: ContactBudgetId | "";
  timeline: ContactTimelineId | "";
  specificDate: string;
};

export type ContactFieldErrors = Partial<
  Record<
    "name" | "email" | "service" | "otherService" | "project" | "budget" | "timeline" | "specificDate",
    string
  >
>;

export type ContactValidationResult =
  | { ok: true; data: ContactInquiry; honeypotTriggered: boolean }
  | { ok: false; errors: ContactFieldErrors };

function isContactServiceId(value: string): value is ContactServiceId {
  return (CONTACT_SERVICE_IDS as readonly string[]).includes(value);
}

function isContactBudgetId(value: string): value is ContactBudgetId {
  return (CONTACT_BUDGET_IDS as readonly string[]).includes(value);
}

function isContactTimelineId(value: string): value is ContactTimelineId {
  return (CONTACT_TIMELINE_IDS as readonly string[]).includes(value);
}

function readOptionalString(value: unknown): string | null {
  if (value == null) return "";
  if (typeof value !== "string") return null;
  return value;
}

function collapseWhitespace(value: string): string {
  return value.trim().replace(/[ \t\f\v]+/g, " ");
}

function hasDisallowedControls(value: string, allowMultiline = false): boolean {
  if (CONTROL_CHARS.test(value)) return true;
  if (allowMultiline) return false;
  return /[\r\n]/.test(value);
}

function hasLetter(value: string): boolean {
  return /\p{L}/u.test(value);
}

function isValidCalendarDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function serviceFromQuery(value: string | undefined | null): ContactServiceId | "" {
  if (!value) return "";
  return CONTACT_SERVICE_QUERY[value] ?? "";
}

export function normalizeContactEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidContactEmail(value: string): boolean {
  if (!value || value.length > CONTACT_FIELD_LIMITS.email) return false;
  if (hasDisallowedControls(value)) return false;
  if (/[\s,;:<>()]/.test(value)) return false;
  if (value.includes("\r") || value.includes("\n")) return false;

  const parts = value.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || local.length > 64) return false;
  if (!domain || domain.length > 253) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!EMAIL_LOCAL_PATTERN.test(local)) return false;
  if (!EMAIL_DOMAIN_PATTERN.test(domain)) return false;
  return true;
}

function normalizeName(value: string): string {
  return collapseWhitespace(value);
}

function normalizeSingleLine(value: string): string {
  return collapseWhitespace(value);
}

function normalizeProject(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

const HONEYPOT_PLACEHOLDER: ContactInquiry = {
  name: "honeypot",
  email: "honeypot@invalid.example",
  service: "general",
  otherService: "",
  project: "honeypot",
  budget: "",
  timeline: "",
  specificDate: "",
};

export function validateContactInquiry(input: ContactInquiryInput): ContactValidationResult {
  const honeypotRaw = readOptionalString(input.website);
  if (honeypotRaw?.trim()) {
    return {
      ok: true,
      honeypotTriggered: true,
      data: HONEYPOT_PLACEHOLDER,
    };
  }

  const errors: ContactFieldErrors = {};

  const nameRaw = readOptionalString(input.name);
  if (nameRaw === null || nameRaw.length > CONTACT_FIELD_LIMITS.name) {
    errors.name = "Please enter your name.";
  } else {
    const name = normalizeName(nameRaw);
    if (!name) {
      errors.name = "Please enter your name.";
    } else if (hasDisallowedControls(name) || MARKUP_CHARS.test(name)) {
      errors.name = "Please enter your name.";
    } else if (!hasLetter(name)) {
      errors.name = "Please enter your name.";
    }
  }

  const emailRaw = readOptionalString(input.email);
  if (emailRaw === null || emailRaw.length > CONTACT_FIELD_LIMITS.email) {
    errors.email = "Please enter a valid email address.";
  } else {
    const email = normalizeContactEmail(emailRaw);
    if (!email) {
      errors.email = "Please enter your email.";
    } else if (!isValidContactEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  const serviceRaw = readOptionalString(input.service);
  const serviceValue = serviceRaw === null ? "" : serviceRaw.trim();
  if (!serviceValue) {
    errors.service = "Please select what you are interested in.";
  } else if (!isContactServiceId(serviceValue)) {
    errors.service = "Please select a valid service.";
  }

  const otherRaw = readOptionalString(input.otherService);
  let otherService = "";
  if (otherRaw === null || otherRaw.length > CONTACT_FIELD_LIMITS.otherService) {
    if (serviceValue === "other") {
      errors.otherService = "Please briefly describe what you are looking for.";
    }
  } else {
    otherService = normalizeSingleLine(otherRaw);
    if (serviceValue === "other") {
      if (!otherService || otherService.length < CONTACT_OTHER_SERVICE_MIN_LENGTH) {
        errors.otherService = "Please briefly describe what you are looking for.";
      } else if (hasDisallowedControls(otherService)) {
        errors.otherService = "Please briefly describe what you are looking for.";
      }
    }
  }

  const projectRaw = readOptionalString(input.project);
  let project = "";
  if (projectRaw === null || projectRaw.length > CONTACT_FIELD_LIMITS.project) {
    errors.project = "Please tell me about your project.";
  } else {
    project = normalizeProject(projectRaw);
    if (!project) {
      errors.project = "Please tell me about your project.";
    } else if (hasDisallowedControls(project, true)) {
      errors.project = "Please tell me about your project.";
    } else if (project.length < CONTACT_PROJECT_MIN_LENGTH) {
      errors.project = "Please share a little more about what you have in mind.";
    }
  }

  const budgetRaw = readOptionalString(input.budget);
  const budgetValue = budgetRaw === null ? "" : budgetRaw.trim();
  if (budgetValue && !isContactBudgetId(budgetValue)) {
    errors.budget = "Please select a valid budget option.";
  }

  const timelineRaw = readOptionalString(input.timeline);
  const timelineValue = timelineRaw === null ? "" : timelineRaw.trim();
  if (timelineValue && !isContactTimelineId(timelineValue)) {
    errors.timeline = "Please select a valid timeline option.";
  }

  const dateRaw = readOptionalString(input.specificDate);
  const specificDate = dateRaw === null ? "" : dateRaw.trim();
  if (timelineValue === "specific-date") {
    if (!specificDate) {
      errors.specificDate = "Please choose a date.";
    } else if (hasDisallowedControls(specificDate) || !isValidCalendarDate(specificDate)) {
      errors.specificDate = "Please enter a valid date.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    honeypotTriggered: false,
    data: {
      name: normalizeName(nameRaw ?? ""),
      email: normalizeContactEmail(emailRaw ?? ""),
      service: serviceValue as ContactServiceId,
      otherService: serviceValue === "other" ? otherService : "",
      project,
      budget: budgetValue && isContactBudgetId(budgetValue) ? budgetValue : "",
      timeline: timelineValue && isContactTimelineId(timelineValue) ? timelineValue : "",
      specificDate: timelineValue === "specific-date" ? specificDate : "",
    },
  };
}
