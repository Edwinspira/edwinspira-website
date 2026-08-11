# Architecture

## Overview
This project is a Next.js App Router application using:
- Next.js (frontend + API routes)
- Tailwind CSS (styling)
- Sanity CMS (content)
- Vercel (deployment)

## Folder Structure

/app
- pages and routes
- `(site)/` — public site pages (home, work, contact)
- `api/contact/` — project inquiry form endpoint
- `studio/[[...tool]]/` — embedded Sanity Studio at `/studio`

/sanity
- `schemaTypes/` — Sanity schema definitions

/sanity.config.ts, /sanity.cli.ts
- Studio and CLI configuration (project root)

/components
- reusable UI components

/lib
- utilities, helpers, CMS queries
- `lib/sanity/` — client, queries, image helper, types

/styles
- global styles (site globals live in `app/globals.css`)

## Data Flow

User → UI (components) → API route → external service / CMS → response → UI

## Patterns

### Components
- Reusable and small
- No business logic inside UI components

### API Routes
- Handle validation
- Call external services
- Return structured responses

### CMS (Sanity)
- All content fetched via lib/sanity queries
- No direct CMS logic inside components

## Environment Variables

Used for:
- Sanity config
- API tokens
- Contact form email delivery (Resend)
- Google Cloud reCAPTCHA Enterprise assessment (server-only API key + project ID)
- Optional Upstash Redis REST credentials for durable contact rate limiting

Never exposed in client unless prefixed with NEXT_PUBLIC_

## Deployment

- Hosted on Vercel
- Auto-deploy on Git push
