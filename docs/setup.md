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

Create a read token under **Project → API → Tokens** if you need draft access later. Scope it to read-only.

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

## Validation

Before opening a PR:

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run build` requires Sanity env vars in `.env.local` (or your CI environment) because the Studio route is part of the app.

## Deployment (Vercel)

1. Connect the GitHub repository.
2. Set the same environment variables as in `.env.example`.
3. Add production and preview URLs to Sanity CORS origins.
4. Production domain: `edwinspira.com`.
