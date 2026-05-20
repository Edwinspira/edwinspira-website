# Edwinspira

Portfolio site for [edwinspira.com](https://edwinspira.com) — software projects, art, video edits, and 3D sculpture.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript

- [Sanity](https://www.sanity.io/) CMS with embedded Studio at `/studio`

Work listing UI is planned in a later phase. See [docs/architecture.md](docs/architecture.md) and [docs/setup.md](docs/setup.md).

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Studio: [http://localhost:3000/studio](http://localhost:3000/studio) (requires Sanity env vars).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Project rules

- [PROJECT_RULES.md](PROJECT_RULES.md)
- [SECURITY_RULES.md](SECURITY_RULES.md)
- [docs/setup.md](docs/setup.md)
