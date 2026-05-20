# Decisions

## [2026-04-16] Use Sanity CMS

### Decision
Use Sanity instead of building custom CMS.

### Reason
- Faster development
- Schema-in-code flexibility
- Free tier sufficient
- Works well with Next.js

### Alternatives considered
- Strapi (more setup)
- Contentful (less flexible)

---

## [2026-04-16] Use Vercel for hosting

### Decision
Use Vercel for deployment.

### Reason
- Native Next.js support
- Easy GitHub integration
- Free tier sufficient

---

## [2026-05-20] Embedded Sanity Studio

### Decision
Mount Sanity Studio inside the Next.js app at `/studio` (not a separate Studio repo).

### Reason
- Single deployment on Vercel
- Schema and frontend stay in sync
- Simpler solo-developer workflow

---

## [2026-04-16] Use Cursor workflow

### Decision
Use Cursor + rules-based prompting system.

### Reason
- Faster development
- Consistent structure
- AI-assisted coding
