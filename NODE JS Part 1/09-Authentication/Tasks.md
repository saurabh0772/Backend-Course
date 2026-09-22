# 🔐 Authentication & Authorization Practice Roadmap

## 🟢 Level 1 — Authentication Basics

### 🟢 Task 1 — User Registration

Create:

- `POST /api/auth/register`
- User model:
  - `name`
  - `email`
  - `password`
  - `role`
  - `isActive`

#### Requirements

- Validate `name`, `email`, and `password`
- Email should be unique
- Hash password using `bcrypt`
- Never store plaintext password
- Default role should be `student`
- Return user information without password

#### Expected Response

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "Saurabh",
    "email": "saurabh@example.com",
    "role": "student"
  }
}
```

#### Learn

- `bcrypt.hash()`
- Mongoose validation
- `unique`
- `select: false`
- HTTP `201 Created`
- HTTP `409 Conflict`

---

### 🟢 Task 2 — Login

Create:

`POST /api/auth/login`

#### Request

```json
{
  "email": "saurabh@example.com",
  "password": "Saurabh123"
}
```

#### Requirements

- Find user by email
- Compare password using `bcrypt.compare()`
- Reject invalid credentials
- Don't reveal whether email or password was incorrect
- Return a successful login response

#### Learn

- `bcrypt.compare()`
- `401 Unauthorized`
- Credential validation

---

### 🟢 Task 3 — Password Validation

Improve registration.

Password must:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### Reject Weak Passwords

```text
abc
password
12345678
```

#### Accept

```text
Saurabh123
Backend@2026
```

#### Learn

- Validation
- Regex
- Mongoose validation
- `400 Bad Request`

---

### 🟢 Task 4 — Authentication Middleware

Create:

```js
authenticate()
```

Create:

`GET /api/auth/profile`

The route should only work for authenticated users.

#### Flow

```text
Request
   ↓
Authorization Header
   ↓
Extract Token
   ↓
Verify Token
   ↓
req.user
   ↓
Controller
```

Unauthenticated:

```text
401 Unauthorized
```

#### Learn

- Express middleware
- Authorization header
- Bearer token
- `req.user`
- `next()`

---

### 🟢 Task 5 — JWT Access Token

Modify login so that successful login generates a JWT.

JWT should contain:

```text
userId
role
```

Add:

```text
iat
exp
```

automatically through JWT configuration.

Then protect:

`GET /api/auth/profile`

#### Learn

- `jwt.sign()`
- `jwt.verify()`
- JWT payload
- JWT expiration
- Access token

---

### 🟢 Task 6 — Logout

Create:

`POST /api/auth/logout`

For your initial JWT implementation:

- Remove the token from the client
- Return a successful logout response

Then think about:

> Why doesn't simply deleting a JWT on the client immediately invalidate a token that has already been issued?

This is an important transition toward **token revocation**.

---

# 🟡 Level 2 — Authorization

### 🟡 Task 7 — Role-Based Authorization

Create:

```js
authorize()
```

Roles:

- `student`
- `recruiter`
- `admin`

Create:

```text
GET /api/student
GET /api/recruiter
GET /api/admin
```

#### Rules

```text
student   → /student
recruiter → /recruiter
admin     → /admin
```

Wrong role:

```text
403 Forbidden
```

Unauthenticated:

```text
401 Unauthorized
```

---

### 🟡 Task 8 — Job Portal Authorization

Now apply authorization to your existing Job Portal.

#### Rules

```text
Student
 ├── View jobs
 └── Apply

Recruiter
 ├── View jobs
 ├── Create jobs
 └── Manage own jobs

Admin
 ├── Manage users
 ├── Manage jobs
 └── Manage applications
```

Implement:

`POST /api/jobs`

Only:

- `recruiter`
- `admin`

can create jobs.

---

### 🟡 Task 9 — Ownership Authorization

This is more important than simple roles.

Suppose:

```text
Job A
postedBy = Saurabh
```

Saurabh should be able to:

```text
PATCH /api/jobs/A
DELETE /api/jobs/A
```

But Rahul should not.

Implement:

```text
PATCH /api/jobs/:id
DELETE /api/jobs/:id
```

#### Rules

```text
Admin
   ↓
Can modify any job

Recruiter
   ↓
Can modify only own job

Student
   ↓
403 Forbidden
```

#### Core Check

Conceptually:

```js
job.postedBy === req.user.userId
```

#### Learn

```text
Authentication
+
RBAC
+
Ownership
```

---

### 🟡 Task 10 — Protect User Data

Create:

```text
GET /api/users/:id
PATCH /api/users/:id
DELETE /api/users/:id
```

#### Rules

```text
User
 ↓
Can view/edit own profile

Admin
 ↓
Can manage any user

Other user
 ↓
403 Forbidden
```

This will teach you **horizontal privilege escalation**.

---

### 🟡 Task 11 — Disabled Users

Add:

```js
isActive
```

If:

```json
{
  "isActive": false
}
```

the user should not be able to authenticate.

Login should return an appropriate authentication/authorization response.

Also decide:

> What should happen to an already-authenticated user who gets disabled?

This is an important real-world design question.

---

# 🟠 Level 3 — Cookies

### 🟠 Task 12 — JWT Using HttpOnly Cookie

Modify login.

Instead of returning the access token directly:

```json
{
  "token": "..."
}
```

store the token in an:

- `HttpOnly`
- `Secure`
- `SameSite`

cookie.

#### Example Flow

```text
Login
 ↓
JWT
 ↓
Set-Cookie
 ↓
Browser
```

Then authentication middleware should read the token from:

```js
req.cookies
```

instead of:

```text
Authorization
```

You'll need:

```text
cookie-parser
```

#### Learn

- Cookies
- `HttpOnly`
- `Secure`
- `SameSite`
- `Set-Cookie`
- `req.cookies`

---

### 🟠 Task 13 — Cookie Logout

Create:

`POST /api/auth/logout`

Logout should:

- Clear authentication cookie

#### Test

```text
Login
 ↓
Profile works
 ↓
Logout
 ↓
Profile fails
```

---

# 🟠 Level 4 — Session Authentication

### 🟠 Task 14 — Session-Based Login

Now temporarily don't use JWT.

Implement authentication using sessions.

Create:

```text
POST /api/session/login
GET  /api/session/profile
POST /api/session/logout
```

#### Flow

```text
Login
 ↓
Verify Password
 ↓
Create Session
 ↓
Store Session Server-Side
 ↓
Send Session ID Cookie
```

For production-like practice, use a **persistent session store** rather than relying on process memory.

#### Learn

- Session
- Session ID
- Session Store
- Cookie
- Session destruction

---

### 🟠 Task 15 — Session vs JWT Experiment

Implement both:

```text
/api/session/*
/api/jwt/*
```

Compare:

```text
Session
vs
JWT
```

Write down:

- Where authentication state lives
- How logout works
- How revocation works
- How scaling works
- What the client stores

This is mainly a **design/understanding task**, not just coding.

---

# 🔴 Level 5 — Access + Refresh Tokens

### 🔴 Task 16 — Access Token + Refresh Token

Modify login.

Successful login should produce:

```text
Access Token
+
Refresh Token
```

#### Architecture

```text
Login
 ↓
Verify Credentials
 ↓
Generate Access Token
 ↓
Generate Refresh Token
 ↓
Return/Store Both
```

Use different expiration times.

For example:

```text
Access Token
→ 15 minutes

Refresh Token
→ Longer lifetime
```

The exact values are yours to choose.

---

### 🔴 Task 17 — Refresh Endpoint

Create:

`POST /api/auth/refresh`

#### Flow

```text
Access Token Expired
        ↓
POST /refresh
        ↓
Refresh Token
        ↓
Verify Refresh Token
        ↓
Generate New Access Token
        ↓
Return New Access Token
```

#### Test

```text
Access token valid
→ API works

Access token expired
→ API returns 401

Refresh token valid
→ Get new access token

New access token
→ API works again
```

---

### 🔴 Task 18 — Refresh Token in HttpOnly Cookie

Improve Task 17.

Store the refresh token in:

- `HttpOnly`
- `Secure`
- `SameSite`

#### Architecture

```text
                 LOGIN
                   │
          ┌────────┴────────┐
          ↓                 ↓
    Access Token       Refresh Token
    short-lived        HttpOnly Cookie
          │                 │
          ↓                 ↓
       API Calls
```

Now the browser doesn't need JavaScript to directly access the refresh token.

---

### 🔴 Task 19 — Refresh Token Rotation

Now make refresh tokens rotating.

#### Flow

```text
Refresh Token A
      ↓
POST /refresh
      ↓
Invalidate A
      ↓
Generate B
      ↓
Return New Access Token
+
New Refresh Token
```

Therefore:

```text
A → ❌
B → ✅
```

Store enough server-side information to determine whether a refresh token/session is still valid.

---

### 🔴 Task 20 — Refresh Token Reuse Detection

This is an advanced task.

#### Scenario

```text
Refresh Token A
       ↓
Used legitimately
       ↓
A becomes invalid
       ↓
Refresh Token B issued
```

Later:

```text
Attacker sends A
       ↓
Server detects reused token
       ↓
Treat as suspicious
       ↓
Revoke relevant refresh-token/session family
```

You don't need to build a perfect enterprise implementation yet.

The goal is to understand:

> Why rotation + reuse detection exists.

---

# 🔴 Level 6 — Password Management

### 🔴 Task 21 — Change Password

Create:

`PATCH /api/auth/password`

#### Request

```json
{
  "currentPassword": "OldPassword",
  "newPassword": "NewPassword123"
}
```

#### Flow

```text
Authenticated User
       ↓
Verify Current Password
       ↓
Validate New Password
       ↓
Hash New Password
       ↓
Save
```

Important:

> Don't store the new password directly.

---

### 🔴 Task 22 — Forgot Password

Create:

`POST /api/auth/forgot-password`

#### Request

```json
{
  "email": "saurabh@example.com"
}
```

#### Flow

```text
Email
 ↓
Find User
 ↓
Generate Secure Random Reset Token
 ↓
Store Token + Expiry
 ↓
Send Reset Link
```

For this practice task, you can simply log the reset URL instead of actually sending email.

---

### 🔴 Task 23 — Reset Password

Create:

`POST /api/auth/reset-password/:token`

#### Request

```json
{
  "password": "NewPassword123"
}
```

#### Validate

- Token exists
- Token belongs to user
- Token hasn't expired
- Token hasn't already been used

Then:

```text
Hash New Password
 ↓
Update Password
 ↓
Invalidate Reset Token
```

---

# 🔴 Level 7 — Email Verification

### 🔴 Task 24 — Email Verification

During registration:

```js
emailVerified = false
```

Generate a verification token.

Create:

`POST /api/auth/verify-email`

#### Flow

```text
Register
 ↓
Generate Verification Token
 ↓
"Send" Email
 ↓
User Clicks Link
 ↓
Verify Token
 ↓
emailVerified = true
```

For practice:

```js
console.log(verificationLink)
```

is enough.

---

### 🔴 Task 25 — Require Verified Email

Now introduce authorization based on account state.

#### Example

```text
Student
+
Authenticated
+
Email Verified
        ↓
Apply for Job
```

Unverified:

```text
403 Forbidden
```

Or another response you deliberately choose based on your API design.

---

# 🔥 Level 8 — Advanced Authorization

### 🔥 Task 26 — Permission-Based Authorization

Instead of only:

```text
role = admin
```

create permissions:

```text
create:job
update:job
delete:job
read:user
delete:user
manage:application
```

#### Example

```text
recruiter
 ├── create:job
 ├── update:own_job
 └── delete:own_job

admin
 ├── create:job
 ├── update:any_job
 ├── delete:any_job
 ├── read:user
 └── delete:user
```

Create middleware such as:

```js
authorizePermission("delete:job")
```

---

### 🔥 Task 27 — Role + Permission + Ownership

Create a single protected endpoint:

`PATCH /api/jobs/:id`

#### Rules

```text
Admin
    ↓
Can modify any job

Recruiter
    ↓
Must have update:job
    ↓
Must own the job

Student
    ↓
403 Forbidden
```

Your authorization now becomes:

```text
Authentication
      ↓
Role
      ↓
Permission
      ↓
Ownership
      ↓
Allow/Deny
```

This is a very good backend exercise.

---

# 🔥 Level 9 — Security

### 🔥 Task 28 — Rate Limit Login

Protect:

`POST /api/auth/login`

against excessive attempts.

#### Test

```text
Wrong password
Wrong password
Wrong password
...
```

After your configured threshold:

```text
Temporarily reject/throttle
```

Also consider how you would avoid creating an easy **account-enumeration** or **denial-of-service** mechanism.

---

### 🔥 Task 29 — Account Enumeration

Review your authentication responses.

#### Bad

```text
"Email doesn't exist"
```

versus:

```text
"Password incorrect"
```

Improve login/reset responses so attackers can't easily determine whether an account exists.

---

### 🔥 Task 30 — Security Testing

Create a checklist and deliberately test:

- ❌ No token
- ❌ Invalid token
- ❌ Expired token
- ❌ Modified token
- ❌ Wrong role
- ❌ Wrong user
- ❌ Wrong owner
- ❌ Disabled user
- ❌ Unverified email
- ❌ Expired reset token
- ❌ Reused reset token
- ❌ Reused refresh token
- ❌ Missing password
- ❌ Weak password
- ❌ Duplicate email

Record expected results:

```text
401
403
400
404
409
```

---

# 🔥 Level 10 — Final Project

### 🔥 Task 31 — Complete Authentication System

Now build a complete authentication system from scratch.

## Models

### User

```text
User
├── name
├── email
├── password
├── role
├── permissions
├── isActive
├── emailVerified
└── timestamps
```

### RefreshSession

```text
RefreshSession
├── user
├── tokenHash
├── expiresAt
├── revokedAt
├── replacedBy
└── createdAt
```

### PasswordResetToken

```text
PasswordResetToken
├── user
├── tokenHash
├── expiresAt
└── usedAt
```

---

## APIs

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/profile
```

### Password

```text
PATCH /api/auth/password
POST  /api/auth/forgot-password
POST  /api/auth/reset-password/:token
```

### Email

```text
POST /api/auth/verify-email
POST /api/auth/resend-verification
```

### Authorization

Implement:

```text
student
recruiter
admin
```

And:

```text
RBAC
+
Permissions
+
Ownership
```

---

# 🧠 Final Architecture

Your final project should look approximately like:

```text
                         CLIENT
                           │
                           ↓
                       LOGIN
                           │
                           ↓
                    Verify Password
                           │
                ┌──────────┴──────────┐
                ↓                     ↓
          ACCESS TOKEN          REFRESH TOKEN
          short-lived           long-lived
                │                     │
                │                HttpOnly Cookie
                ↓                     │
            API Request               │
                │                     │
                ↓                     │
        Authentication Middleware     │
                │                     │
                ↓                     │
             req.user                 │
                │                     │
                ↓                     │
       Authorization Middleware       │
                │                     │
        ┌───────┼────────┐            │
        ↓       ↓        ↓            │
      Role   Permission Ownership     │
        │       │        │            │
        └───────┼────────┘            │
                ↓                     │
             Controller               │
                ↓                     │
             MongoDB                  │
                                      │
                         Access Token expires
                                      │
                                      ↓
                              POST /refresh
                                      │
                                      ↓
                              Verify refresh
                                      │
                                      ↓
                              Rotate refresh
                                      │
                                      ↓
                              New access token
```

---

# 🎯 Your Learning Order

Don't do all 31 at once. Follow:

```text
1–6
   ↓
Authentication Fundamentals
   ↓
7–11
   ↓
Authorization
   ↓
12–15
   ↓
Cookies + Sessions
   ↓
16–20
   ↓
Access + Refresh Tokens
   ↓
21–25
   ↓
Password + Email Security
   ↓
26–27
   ↓
Advanced Authorization
   ↓
28–30
   ↓
Security
   ↓
31
   ↓
Complete Project
```

---

# 🚀 Final Goal

By completing all 31 tasks, you should be comfortable with:

```text
Authentication
       +
JWT
       +
Cookies
       +
Sessions
       +
Access Tokens
       +
Refresh Tokens
       +
Token Rotation
       +
Password Management
       +
Email Verification
       +
RBAC
       +
Permissions
       +
Ownership
       +
Rate Limiting
       +
Security Testing
```

This takes you from **basic login/register implementation → production-style authentication and authorization architecture**.