# Campus Skill Exchange Platform — Final Run & Setup Guide

## 1. Requirements
- Node.js LTS
- MongoDB Community Server
- VS Code (recommended)
- A browser
- Optional: SMTP account for Forgot Password email recovery
- Optional: Postman for API testing

## 2. Download the project
Download the final ZIP, extract it, and open the extracted project folder in VS Code.

Do not create or commit a real .env file in GitHub. The project includes .env.example as a template.

## 3. Install dependencies
Open the VS Code terminal in the project folder:

```bash
npm install
```

## 4. Configure MongoDB
Install MongoDB Community Server and make sure the MongoDB service is running.

On Windows, if MongoDB was installed as a service:

```cmd
net start MongoDB
```

The default local database used by this project is:

```
mongodb://127.0.0.1:27017/campus_skill_exchange
```

## 5. Create .env
Copy:

```
.env.example
```

to:

```
.env
```

For local development, use:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_skill_exchange
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
APP_URL=http://localhost:5000
CORS_ORIGIN=
```

### Forgot Password email
The application requires SMTP configuration to actually send reset emails:

```
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=Campus Skill Exchange <your_verified_sender@example.com>
```

Never put real SMTP credentials, JWT secrets, database passwords, or API keys into GitHub.

## 6. Start the application

```bash
npm start
```

You should see messages similar to:

```
MongoDB connected successfully.
Campus Skill Exchange running at http://localhost:5000
```

Open:

```
http://localhost:5000
```

Do not open the HTML files directly with file:// because the application needs the Node/Express API.

## 7. Main pages

- Home: `http://localhost:5000/`
- Register: `http://localhost:5000/pages/register.html`
- Login: `http://localhost:5000/pages/login.html`
- Dashboard: `http://localhost:5000/pages/dashboard.html`
- Find Students: `http://localhost:5000/pages/profiles.html`
- Forgot Password: `http://localhost:5000/pages/forgot-password.html`
- Privacy Policy: `http://localhost:5000/pages/privacy-policy.html`
- 404 test: open a non-existing URL such as `http://localhost:5000/pages/not-found-test.html`

## 8. First test account
Register a test student through the Register page. Use a real email only if you want to test password recovery.

For testing exchange requests, create two separate student accounts.

## 9. Test the exchange flow
1. Register Student A.
2. Register Student B.
3. Log in as Student A.
4. Open Find Students.
5. Send an exchange request to Student B.
6. Log in as Student B.
7. Open Dashboard.
8. Accept the request.
9. Check Accepted Connections.
10. The WhatsApp action should now be available to the connected user.

The WhatsApp number should remain hidden before the request is accepted.

## 10. Password features
### Show password
Login and reset forms include Show/Hide controls.

### Change password
Dashboard → Edit Profile → New Password → Save changes.

### Forgot password
1. Open Login.
2. Select Forgot password.
3. Enter the account email.
4. Configure SMTP first.
5. Open the reset link received by email.
6. Create a new password.

Reset tokens are designed to expire after 30 minutes and are invalidated after successful use.

## 11. Delete account
Dashboard → Edit Profile → Delete my account.

The user must enter the current password in the confirmation dialog. Successful deletion removes the user account and associated exchange requests.

## 12. MongoDB verification
Use MongoDB Compass or mongosh.

With mongosh:

```bash
mongosh
```

Then:

```text
use campus_skill_exchange
show collections
db.users.find().pretty()
db.requests.find().pretty()
```

Passwords should appear as bcrypt hashes, not plain-text passwords.

## 13. Health check
Open:

```
http://localhost:5000/api/health
```

Expected response:

```json
{"ok":true,"message":"Campus Skill Exchange API is running."}
```

## 14. Postman API testing
Important endpoints:

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
PUT  /api/auth/profile
DELETE /api/auth/account
GET  /api/users/peers
GET  /api/requests
POST /api/requests
PATCH /api/requests/:id
GET  /api/health
```

For protected endpoints, send:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 15. Common problems

### 'mongod' is not recognized
MongoDB Server is either not installed or its executable is not in PATH. Start the MongoDB service from Windows Services or reinstall MongoDB Community Server.

### MongoDB connection failed
Check:
- MongoDB service is running.
- MONGO_URI is correct.
- .env is in the project root.

### MONGO_URI and JWT_SECRET are required
The .env file is missing or those variables are empty.

### Port 5000 already in use
Change PORT in .env, for example:

```
PORT=5001
APP_URL=http://localhost:5001
```

Then restart the server.

### Forgot Password says email service is not configured
Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM and restart the server.

### bcrypt install warning
Run:

```bash
npm install
```

If npm specifically asks for approval of the bcrypt install script, review and approve that package with npm's suggested command, then run npm install/start again.

## 16. Production deployment
For Render or another Node hosting service:
- Use `npm install` as the build/install command.
- Use `npm start` as the start command.
- Use a cloud MongoDB connection instead of localhost.
- Set MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, APP_URL, CORS_ORIGIN and SMTP variables in the hosting dashboard.
- Use HTTPS.
- Never upload .env.

A local MongoDB address such as 127.0.0.1 will not work as the production database for a remote server.

## 17. Security checklist
Before public deployment:
- Use a strong random JWT_SECRET.
- Use a managed MongoDB database with restricted credentials.
- Configure HTTPS.
- Configure a trusted CORS origin.
- Configure a real SMTP provider.
- Keep .env out of GitHub.
- Keep database backups.
- Do not share JWT tokens or passwords.
- Review dependency vulnerabilities with npm audit.

## 18. Documentation
See:
- `docs/SECURITY_REVIEW.md`
- `docs/TESTING.md`
- `docs/SCREENSHOTS.md`

Use real screenshots from the running application for your university report.
