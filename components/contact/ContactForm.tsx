"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, type FormEvent } from "react";

import {
  CONTACT_BUDGET_IDS,
  CONTACT_BUDGET_LABELS,
  CONTACT_EMAIL,
  CONTACT_FIELD_LIMITS,
  CONTACT_SERVICE_IDS,
  CONTACT_SERVICE_LABELS,
  CONTACT_TIMELINE_IDS,
  CONTACT_TIMELINE_LABELS,
  validateContactInquiry,
  type ContactBudgetId,
  type ContactFieldErrors,
  type ContactServiceId,
  type ContactTimelineId,
} from "@/lib/contact";
import {
  CONTACT_RECAPTCHA_ACTION,
  CONTACT_VERIFY_ERROR,
} from "@/lib/recaptcha-shared";

type ContactFormProps = {
  initialService: ContactServiceId | "";
};

type FormState = {
  name: string;
  email: string;
  service: ContactServiceId | "";
  otherService: string;
  project: string;
  budget: ContactBudgetId;
  timeline: ContactTimelineId;
  specificDate: string;
  website: string;
};

const SUBMIT_ERROR =
  "Something went wrong while sending your request. Please try again or email me directly at edwin@edwinspira.com.";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

async function createContactRecaptchaToken(siteKey: string): Promise<string> {
  const started = Date.now();
  while (!window.grecaptcha?.enterprise && Date.now() - started < 8000) {
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }

  const api = window.grecaptcha?.enterprise;
  if (!api) {
    throw new Error("unavailable");
  }

  await new Promise<void>((resolve) => {
    api.ready(() => resolve());
  });

  const token = await api.execute(siteKey, { action: CONTACT_RECAPTCHA_ACTION });
  if (!token) {
    throw new Error("empty");
  }
  return token;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="contact-field__error" role="alert">
      {message}
    </p>
  );
}

export function ContactForm({ initialService }: ContactFormProps) {
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    service: initialService,
    otherService: "",
    project: "",
    budget: "not-sure",
    timeline: "no-deadline",
    specificDate: "",
    website: "",
  });
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const showOther = values.service === "other";
  const showDate = values.timeline === "specific-date";

  const update =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) => {
      setValues((current) => ({ ...current, [key]: value }));
      const errorKey = key === "website" ? undefined : (key as keyof ContactFieldErrors);
      if (errorKey && fieldErrors[errorKey]) {
        setFieldErrors((current) => {
          const next = { ...current };
          delete next[errorKey];
          return next;
        });
      }
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitError("");
    const result = validateContactInquiry(values);
    if (!result.ok) {
      setFieldErrors(result.errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      if (!recaptchaSiteKey) {
        setSubmitError(CONTACT_VERIFY_ERROR);
        return;
      }

      let recaptchaToken = "";
      try {
        recaptchaToken = await createContactRecaptchaToken(recaptchaSiteKey);
      } catch {
        setSubmitError(CONTACT_VERIFY_ERROR);
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          service: values.service,
          otherService: values.otherService,
          project: values.project,
          budget: values.budget,
          timeline: values.timeline,
          specificDate: values.specificDate,
          website: values.website,
          recaptchaToken,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; errors?: ContactFieldErrors }
        | null;

      if (response.ok && payload?.ok) {
        setSubmitted(true);
        return;
      }

      if (payload?.errors) {
        setFieldErrors(payload.errors);
      }
      setSubmitError(payload?.error || SUBMIT_ERROR);
    } catch {
      setSubmitError(SUBMIT_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-success" role="status">
        <p className="contact-success__kicker font-mono">{"// CONFIRMED"}</p>
        <h2 className="contact-success__title">REQUEST RECEIVED</h2>
        <p className="contact-success__jp font-mono">受信 / RECEIVED</p>
        <p className="contact-success__copy">
          Thanks for reaching out. Your message has been sent successfully. I&apos;ll review
          the details and get back to you at the email you provided.
        </p>
        <div className="contact-success__actions">
          <Link href="/" className="contact-success__link font-mono">
            RETURN HOME →
          </Link>
          <Link href="/work" className="contact-success__link font-mono">
            VIEW MY WORK →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate aria-busy={submitting}>
      {recaptchaSiteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(recaptchaSiteKey)}`}
          strategy="afterInteractive"
        />
      ) : null}
      <div className="contact-field">
        <label htmlFor="contact-name" className="contact-field__label">
          <span className="contact-field__index" aria-hidden>
            01
          </span>
          <span className="contact-field__name">
            NAME <span className="contact-field__required">*</span>
          </span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_FIELD_LIMITS.name}
          placeholder="Your name"
          value={values.name}
          onChange={(event) => update("name")(event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          className="contact-field__control"
        />
        <FieldError id="contact-name-error" message={fieldErrors.name} />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email" className="contact-field__label">
          <span className="contact-field__index" aria-hidden>
            02
          </span>
          <span className="contact-field__name">
            EMAIL <span className="contact-field__required">*</span>
          </span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={CONTACT_FIELD_LIMITS.email}
          placeholder="you@example.com"
          value={values.email}
          onChange={(event) => update("email")(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          className="contact-field__control"
        />
        <FieldError id="contact-email-error" message={fieldErrors.email} />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-service" className="contact-field__label">
          <span className="contact-field__index" aria-hidden>
            03
          </span>
          <span className="contact-field__name">
            I&apos;M INTERESTED IN <span className="contact-field__required">*</span>
          </span>
        </label>
        <select
          id="contact-service"
          name="service"
          required
          value={values.service}
          onChange={(event) => update("service")(event.target.value as ContactServiceId | "")}
          aria-invalid={Boolean(fieldErrors.service)}
          aria-describedby={fieldErrors.service ? "contact-service-error" : undefined}
          className="contact-field__control contact-field__control--select"
        >
          <option value="">Select a service</option>
          {CONTACT_SERVICE_IDS.map((id) => (
            <option key={id} value={id}>
              {CONTACT_SERVICE_LABELS[id]}
            </option>
          ))}
        </select>
        <FieldError id="contact-service-error" message={fieldErrors.service} />
      </div>

      {showOther ? (
        <div className="contact-field contact-field--nested">
          <label htmlFor="contact-other" className="contact-field__label">
            <span className="contact-field__index" aria-hidden>
              +
            </span>
            <span className="contact-field__name">WHAT ARE YOU LOOKING FOR?</span>
          </label>
          <input
            id="contact-other"
            name="otherService"
            type="text"
            maxLength={CONTACT_FIELD_LIMITS.otherService}
            placeholder="Briefly describe the type of service you need"
            value={values.otherService}
            onChange={(event) => update("otherService")(event.target.value)}
            aria-invalid={Boolean(fieldErrors.otherService)}
            aria-describedby={fieldErrors.otherService ? "contact-other-error" : undefined}
            className="contact-field__control"
          />
          <FieldError id="contact-other-error" message={fieldErrors.otherService} />
        </div>
      ) : null}

      <div className="contact-field">
        <label htmlFor="contact-project" className="contact-field__label">
          <span className="contact-field__index" aria-hidden>
            04
          </span>
          <span className="contact-field__name">
            TELL ME ABOUT YOUR PROJECT <span className="contact-field__required">*</span>
          </span>
        </label>
        <textarea
          id="contact-project"
          name="project"
          required
          rows={8}
          maxLength={CONTACT_FIELD_LIMITS.project}
          placeholder="Tell me what you're looking to create, what you're hoping to accomplish, and anything else you think would be helpful."
          value={values.project}
          onChange={(event) => update("project")(event.target.value)}
          aria-invalid={Boolean(fieldErrors.project)}
          aria-describedby={fieldErrors.project ? "contact-project-error" : undefined}
          className="contact-field__control contact-field__control--area"
        />
        <FieldError id="contact-project-error" message={fieldErrors.project} />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-budget" className="contact-field__label">
          <span className="contact-field__index" aria-hidden>
            05
          </span>
          <span className="contact-field__name">BUDGET (OPTIONAL)</span>
        </label>
        <select
          id="contact-budget"
          name="budget"
          value={values.budget}
          onChange={(event) => update("budget")(event.target.value as ContactBudgetId)}
          aria-invalid={Boolean(fieldErrors.budget)}
          aria-describedby={fieldErrors.budget ? "contact-budget-error" : undefined}
          className="contact-field__control contact-field__control--select"
        >
          {CONTACT_BUDGET_IDS.map((id) => (
            <option key={id} value={id}>
              {CONTACT_BUDGET_LABELS[id]}
            </option>
          ))}
        </select>
        <FieldError id="contact-budget-error" message={fieldErrors.budget} />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-timeline" className="contact-field__label">
          <span className="contact-field__index" aria-hidden>
            06
          </span>
          <span className="contact-field__name">TIMELINE (OPTIONAL)</span>
        </label>
        <select
          id="contact-timeline"
          name="timeline"
          value={values.timeline}
          onChange={(event) => update("timeline")(event.target.value as ContactTimelineId)}
          aria-invalid={Boolean(fieldErrors.timeline)}
          aria-describedby={
            fieldErrors.timeline
              ? "contact-timeline-error"
              : showDate
                ? "contact-date"
                : undefined
          }
          className="contact-field__control contact-field__control--select"
        >
          {CONTACT_TIMELINE_IDS.map((id) => (
            <option key={id} value={id}>
              {CONTACT_TIMELINE_LABELS[id]}
            </option>
          ))}
        </select>
        <FieldError id="contact-timeline-error" message={fieldErrors.timeline} />
      </div>

      {showDate ? (
        <div className="contact-field contact-field--nested">
          <label htmlFor="contact-date" className="contact-field__label">
            <span className="contact-field__index" aria-hidden>
              +
            </span>
            <span className="contact-field__name">SPECIFIC DATE</span>
          </label>
          <input
            id="contact-date"
            name="specificDate"
            type="date"
            value={values.specificDate}
            onChange={(event) => update("specificDate")(event.target.value)}
            aria-invalid={Boolean(fieldErrors.specificDate)}
            aria-describedby={fieldErrors.specificDate ? "contact-date-error" : undefined}
            className="contact-field__control contact-field__control--date"
          />
          <FieldError id="contact-date-error" message={fieldErrors.specificDate} />
        </div>
      ) : null}

      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
          value={values.website}
          onChange={(event) => update("website")(event.target.value)}
        />
      </div>

      {submitError ? (
        <p className="contact-form__submit-error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="contact-form__submit">
        <button type="submit" className="contact-submit" disabled={submitting}>
          {submitting ? "SENDING..." : "SEND REQUEST ↗"}
        </button>
        <p className="contact-form__reassurance">
          No commitment. This just starts the conversation.
        </p>
        <p className="contact-form__recaptcha">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{" "}
          apply.
        </p>
        <p className="sr-only">
          Submitting this form does not create an account, charge you, or schedule anything.
          You can also email {CONTACT_EMAIL} directly.
        </p>
      </div>
    </form>
  );
}
