Admin Authentication Separation - Implementation Plan
Overview
Separate admin and passenger authentication systems with dedicated admin login page accessible via /admin-login, using secure HTTP-only cookies and route protection middleware.

User Review Required
IMPORTANT

Security Enhancement: This will completely separate admin access from passenger login. Admins will access via http://localhost:3000/admin-login and passengers via the normal login.

WARNING

Breaking Change: Current admin users must use the new admin login page. The regular login will only work for passengers.

Proposed Changes
Frontend Components
[NEW] AdminLogin.jsx
New dedicated admin login page with:

Email and password fields
Admin-specific branding
Cookie-based authentication
Validation and error handling
Auto-redirect to admin dashboard on success
[MODIFY] App.js
Add route detection for /admin-login path
Render AdminLogin component for admin route
Add admin session validation on mount
Redirect unauthorized admin access to passenger login
Remove admin logic from passenger login
[MODIFY] Login Component (Passenger)
Remove admin role handling
Only authenticate passengers
Simplified user flow
Backend Security
[MODIFY] authController.js
Enhance 
adminLogin
 function security
Set HTTP-only secure cookies
Add proper error responses
Validate admin credentials
[NEW] adminAuth middleware
Protect admin routes by:

Checking for admin_token cookie
Verifying JWT token
Validating admin role
Returning 401 if unauthorized
[MODIFY] adminRoutes.js
Apply adminAuth middleware to ALL admin routes
Ensure no route is unprotected
Route Structure
Passenger Access:

http://localhost:3000/ - Home page
http://localhost:3000/ (click login) - Passenger login modal
Admin Access:

http://localhost:3000/admin-login - Admin login page (separate URL)
After login → Admin dashboard
Verification Plan
Manual Testing
Access /admin-login URL
Login with admin credentials
Verify cookie is set in browser
Test admin dashboard access
Clear cookies and verify redirect
Test passenger login still works
Verify passengers cannot access admin routes
Security Checks
Cookies are HTTP-only
Tokens expire after 2 hours
Unauthorized access redirects properly
No admin access from passenger login