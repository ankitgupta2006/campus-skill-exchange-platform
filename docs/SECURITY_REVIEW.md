# Security Review

## Review scope
This review covers authentication, password handling, account deletion, API protection, secrets, and personal contact data in the September 2026 project state.

## Controls implemented
- Passwords are hashed with bcrypt before storage.
- JWT is used for authenticated API access; server-side sessions are not used.
- Password reset tokens are random, hashed before storage, expire after 30 minutes, and are cleared after successful use.
- Password reset requests use a generic response so an unknown email does not reveal whether an account exists.
- Authentication endpoints are rate-limited.
- Helmet security headers are enabled.
- JSON request bodies have a 100 KB size limit.
- CORS can be restricted with CORS_ORIGIN.
- .env is ignored and secrets belong in environment variables.
- Account deletion requires the current password and removes the user's exchange requests.
- WhatsApp contact information is only returned for accepted connections.
- External WhatsApp links use rel="noopener noreferrer".

## Production checklist
Before public deployment, configure a strong random JWT_SECRET, a managed MongoDB connection with restricted credentials, HTTPS, a real SMTP provider, APP_URL, CORS_ORIGIN, and appropriate database backups. Do not commit .env or SMTP credentials.

## Remaining hardening options
For a larger production deployment, consider CSRF protection for cookie-based authentication, an email-verification flow, centralized audit logging, stricter password policies, and automated dependency scanning.
