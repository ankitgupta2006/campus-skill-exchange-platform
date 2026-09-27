# Testing Checklist

| Test | Expected result |
|---|---|
| Register with all valid fields | Account is created and dashboard opens |
| Register with duplicate email | Clear duplicate-account error |
| Invalid WhatsApp number | Registration/profile update is rejected |
| Login with valid credentials | JWT is issued and dashboard opens |
| Login with wrong password | Generic authentication error |
| Show/Hide password | Password field toggles visibility |
| Forgot password | Generic response is shown; configured SMTP sends a reset link |
| Expired/invalid reset token | Reset is rejected |
| Valid reset token | Password changes and token becomes unusable |
| Edit profile | Updated information is displayed |
| Change password from profile | New password is bcrypt-hashed and usable for login |
| Send exchange request | Recipient sees a pending request |
| Accept request | WhatsApp contact becomes available to the connected user |
| Decline request | Request is marked declined and contact remains hidden |
| Delete account with wrong password | Deletion is refused |
| Delete account with correct password | User and exchange requests are removed |
| Unauthorized API request | API returns an authentication error |
| Unknown page | Custom 404 page is displayed |
| Mobile dashboard | Cards, forms and navigation remain usable without horizontal layout breakage |

Run these cases against a local MongoDB instance before submission and record screenshots/results in the final report.
