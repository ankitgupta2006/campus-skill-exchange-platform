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
2. Copy .env.example to .env.
3. Set MONGO_URI to mongodb://127.0.0.1:27017/campus_skill_exchange.
4. Set a private JWT_SECRET.
5. Run npm install.
6. Start MongoDB with net start MongoDB.
7. Run npm start.
8. Open http://localhost:5000.

Never commit .env or real secrets to GitHub.

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
