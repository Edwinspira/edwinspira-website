import {
  CONTACT_BUDGET_LABELS,
  CONTACT_EMAIL,
  CONTACT_SERVICE_LABELS,
  CONTACT_TIMELINE_LABELS,
  isValidContactEmail,
  type ContactInquiry,
} from "@/lib/contact";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMultiline(value: string): string {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

export function buildContactEmail(inquiry: ContactInquiry): {
  subject: string;
  text: string;
  html: string;
} {
  const serviceLabel = CONTACT_SERVICE_LABELS[inquiry.service];
  const budgetLabel = inquiry.budget
    ? CONTACT_BUDGET_LABELS[inquiry.budget]
    : "Not provided";
  const timelineLabel = inquiry.timeline
    ? CONTACT_TIMELINE_LABELS[inquiry.timeline]
    : "Not provided";

  const lines = [
    "NEW PROJECT INQUIRY",
    "",
    "Name:",
    inquiry.name,
    "",
    "Email:",
    inquiry.email,
    "",
    "Service:",
    serviceLabel,
  ];

  if (inquiry.otherService) {
    lines.push("", "Other Service:", inquiry.otherService);
  }

  lines.push("", "Budget:", budgetLabel, "", "Timeline:", timelineLabel);

  if (inquiry.specificDate) {
    lines.push("", "Specific Date:", inquiry.specificDate);
  }

  lines.push("", "Project:", inquiry.project, "", "Submitted:", new Date().toISOString());

  const text = lines.join("\n");

  const extraRows = [
    inquiry.otherService
      ? `<p><strong>Other Service:</strong><br />${escapeHtml(inquiry.otherService)}</p>`
      : "",
    inquiry.specificDate
      ? `<p><strong>Specific Date:</strong><br />${escapeHtml(inquiry.specificDate)}</p>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const html = `
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; line-height: 1.5; color: #111;">
      <p style="letter-spacing: 0.12em; text-transform: uppercase;">NEW PROJECT INQUIRY</p>
      <p><strong>Name:</strong><br />${escapeHtml(inquiry.name)}</p>
      <p><strong>Email:</strong><br />${escapeHtml(inquiry.email)}</p>
      <p><strong>Service:</strong><br />${escapeHtml(serviceLabel)}</p>
      ${extraRows}
      <p><strong>Budget:</strong><br />${escapeHtml(budgetLabel)}</p>
      <p><strong>Timeline:</strong><br />${escapeHtml(timelineLabel)}</p>
      <p><strong>Project:</strong><br />${formatMultiline(inquiry.project)}</p>
      <p><strong>Submitted:</strong><br />${escapeHtml(new Date().toISOString())}</p>
    </div>
  `.trim();

  return {
    subject: `New Edwinspira Inquiry: ${serviceLabel}`,
    text,
    html,
  };
}

function hasHeaderInjection(value: string): boolean {
  return /[\r\n\u0000]/.test(value);
}

export async function sendContactEmail(inquiry: ContactInquiry): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_EMAIL_FROM?.trim();
  const to = process.env.CONTACT_EMAIL_TO?.trim() || CONTACT_EMAIL;

  if (!apiKey || !from) {
    console.error(
      "Contact email is not configured. Set RESEND_API_KEY and CONTACT_EMAIL_FROM.",
    );
    return { ok: false };
  }

  if (hasHeaderInjection(from) || hasHeaderInjection(to) || !isValidContactEmail(to)) {
    console.error("Contact email envelope failed validation.");
    return { ok: false };
  }

  if (!isValidContactEmail(inquiry.email)) {
    console.error("Contact email reply-to failed validation.");
    return { ok: false };
  }

  const email = buildContactEmail(inquiry);

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  if (!response.ok) {
    console.error("Contact email provider rejected the request.");
    return { ok: false };
  }

  return { ok: true };
}
