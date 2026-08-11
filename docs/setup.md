# Setup

## Prerequisites

- Node.js 20+
- npm
- A [Sanity](https://www.sanity.io/) account

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Sanity project

1. Sign in at [sanity.io/manage](https://www.sanity.io/manage).
2. Create a new project (e.g. **Edwinspira**).
3. Note the **Project ID** and create or use a dataset (e.g. `production`).

## 3. Environment variables

Copy the example file and add your values locally (never commit `.env.local`):

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name (e.g. `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | API version date (default in `.env.example`) |
| `SANITY_API_READ_TOKEN` | No | Server-only read token for draft/preview (Phase 3+) |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL override |
| `RESEND_API_KEY` | Yes, for `/contact` | Server-only Resend API key |
| `CONTACT_EMAIL_FROM` | Yes, for `/contact` | Verified Resend from address, e.g. `Edwinspira Website <contact@contact.edwinspira.com>` |
| `CONTACT_EMAIL_TO` | No | Inbox that receives inquiries (defaults to `edwin@edwinspira.com`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes, for `/contact` | Public Google Cloud reCAPTCHA Enterprise site key |
| `RECAPTCHA_API_KEY` | Yes, for `/contact` | Server-only Google Cloud API key used to create assessments |
| `RECAPTCHA_PROJECT_ID` | Yes, for `/contact` | Google Cloud project ID that owns the reCAPTCHA key |
| `RECAPTCHA_MIN_SCORE` | No | Minimum accepted score from `0.0` to `1.0` (default `0.5`) |
| `UPSTASH_REDIS_REST_URL` | Recommended in production | Upstash Redis REST URL for durable contact rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended in production | Upstash Redis REST token (server-only) |

Create a read token under **Project → API → Tokens** if you need draft access later. Scope it to read-only.

### Contact form email

The Contact page sends inquiries through [Resend](https://resend.com) from a Next.js API route. Secrets stay server-side.

1. Create a Resend account and add an API key.
2. Verify the sending domain in Resend (for example `contact.edwinspira.com`, with SPF, DKIM, and optionally DMARC).
3. Use a from address on that verified domain, such as `Edwinspira Website <contact@contact.edwinspira.com>`.
4. Set `RESEND_API_KEY` and `CONTACT_EMAIL_FROM` in `.env.local` and in Vercel.
5. Keep `CONTACT_EMAIL_TO` as `edwin@edwinspira.com` unless you want a different inbox.

Reply-To is set to the visitor's validated email, so replies go back to them. No visitor confirmation email is sent in this version.

### Contact form reCAPTCHA

The Contact form uses Google Cloud reCAPTCHA Enterprise with a score-based key. The browser only collects a token. The server creates an assessment and rejects low-score or invalid results before any email is sent.

Use a separate testing key for `localhost` and a production key limited to `edwinspira.com`. See the Google Cloud setup steps in the latest Contact security report, or:

1. Create or select a Google Cloud project.
2. Enable the **reCAPTCHA Enterprise API**.
3. Create a **score-based** website key.
4. Create a server API key restricted to the reCAPTCHA Enterprise API.
5. Set the public site key in `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
6. Set `RECAPTCHA_API_KEY` and `RECAPTCHA_PROJECT_ID` as server-only values.

Production submissions fail closed if reCAPTCHA is not configured.

### Contact form rate limiting

`/api/contact` limits submissions to 5 requests per 15 minutes and 20 requests per 24 hours per hashed client identity.

For durable limits across Vercel serverless instances, create a free [Upstash Redis](https://upstash.com/) database and set `UPSTASH_REDIS_REST_URL` plus `UPSTASH_REDIS_REST_TOKEN`. Without those variables the limiter falls back to in-memory storage, which is fine locally and unreliable in production.

## 4. CORS origins

In [Sanity Manage](https://www.sanity.io/manage) → your project → **API** → **CORS origins**, add:

- `http://localhost:3000` (local dev)
- `https://edwinspira.com` (production)
- Your Vercel preview URL pattern if used

## 5. Run locally

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

Sign in to Studio with your Sanity account and create **Work** documents (software, art, video, 3D sculpture categories).

### Work ordering

Work appears in a drag-and-drop list in Studio. Reorder projects there; the site uses that order on the work page and featured section.

If you are migrating from the old manual **Sort order** number field, open the Work list menu (top right) and choose **Reset Order** once to generate ranks for existing documents.

## Validation

Before opening a PR:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` requires Sanity env vars in `.env.local` (or your CI environment) because the Studio route is part of the app.

## Deployment (Vercel)

1. Connect the GitHub repository.
2. Set the same environment variables as in `.env.example`, including the Resend contact-form secrets.
3. Add production and preview URLs to Sanity CORS origins.
4. Verify the Resend sending domain (`contact.edwinspira.com`) before expecting production inquiries to send.
5. Production domain: `edwinspira.com`.
