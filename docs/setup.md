# Setup

## Prerequisites

- Node.js 20+
- npm

## Local development

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables (names only; add values locally):

   ```bash
   cp .env.example .env.local
   ```

   Sanity variables are reserved for a later phase. No values are required to run the site in Phase 1.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Validation

Before opening a PR, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

The site targets [Vercel](https://vercel.com/) with the production domain `edwinspira.com`. Connect the GitHub repository and set environment variables from `.env.example` when Sanity is integrated.
