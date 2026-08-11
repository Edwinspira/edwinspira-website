# Security

## Secrets

- Never store secrets in code
- Use environment variables
- Never expose server secrets to client

## Input Validation

- All inputs are untrusted
- Validate on server side
- Use schema validation where possible

## Authentication & Authorization

- Use trusted libraries/framework features
- Do not rely on client-side checks

## Data Handling

- Minimize stored sensitive data
- Avoid logging sensitive info

## Logging

Never log:
- API keys
- tokens
- passwords
- full request bodies
- full client IP addresses

## Dependencies

- Avoid unnecessary packages
- Prefer well-maintained libraries

## Deployment

- Use HTTPS
- Use secure cookies for sessions

## Contact form

The public `/api/contact` route uses defense in depth:

- Origin / Referer allowlisting
- Server-side field validation and enum allowlists
- Honeypot field checked only on the server
- Google Cloud reCAPTCHA Enterprise assessment with action `contact_submit` and a configurable score threshold
- Rate limiting: 5 requests / 15 minutes and 20 requests / 24 hours per hashed client identity
- HTML-escaped user content in email output
- Server-controlled email subject and envelope fields

Client IP for rate limiting comes from Vercel-controlled headers (`x-vercel-forwarded-for` first). Arbitrary `x-forwarded-for` values are ignored unless the request is on Vercel.

Durable rate limiting requires Upstash Redis REST credentials. Without them, limits are in-memory only.

## File Uploads (if added later)

- Validate type and size
- Never trust file content blindly
