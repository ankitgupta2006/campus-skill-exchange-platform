# Campus Skill Exchange Platform

A full-stack student skill-sharing platform built with HTML, CSS, JavaScript, Node.js, Express and MongoDB.

## Features
- Student registration and login
- bcrypt password hashing
- JWT authentication
- MongoDB Community Server support for local development
- Student profile and skill search
- Exchange requests with pending, accepted and declined status
- WhatsApp number collected during registration
- WhatsApp contact remains hidden until an exchange request is accepted
- Direct WhatsApp chat link after acceptance
- Responsive Campus Skill Exchange UI
- No session APIs, session model, or browser session feature

## Local setup
1. Install Node.js and MongoDB Community Server.
2. Copy `.env.example` to `.env`.
3. Configure `MONGO_URI` with your local MongoDB database.
4. Configure `JWT_SECRET` with your own private secret.
5. Run `npm install`.
6. Start MongoDB.
7. Run `npm start`.
8. Open `http://localhost:5000`.

**Security:** Never commit `.env`, database credentials, JWT secrets, passwords, API keys, or other private configuration to GitHub. Use `.env.example` only as a template.

## API
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/auth/profile
GET /api/users/peers
GET /api/requests
POST /api/requests
PATCH /api/requests/:id

JWT is token-based authentication; the application does not implement server-side sessions.

Repository: https://github.com/ankitgupta2006/campus-skill-exchange-platform

## Privacy Policy
A dedicated privacy policy page is available at `pages/privacy-policy.html`. It documents collected account/profile data, password hashing, JWT authentication, MongoDB storage, WhatsApp contact visibility after accepted exchanges, third-party WhatsApp communication, and basic security responsibilities.

## Guides
- Full run and deployment guide: docs/RUN_GUIDE.md
- Testing checklist: docs/TESTING.md
- Security review: docs/SECURITY_REVIEW.md
- Documentation screenshot checklist: docs/SCREENSHOTS.md
