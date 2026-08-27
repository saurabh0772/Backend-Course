# 🔐 Authentication & Authorization — Complete Notes

## 0. Big Picture

The first thing to understand is:

                    SECURITY
                       │
          ┌────────────┴────────────┐
          ↓                         ↓
   AUTHENTICATION              AUTHORIZATION
       AuthN                      AuthZ
          │                         │
   "Who are you?"          "What can you do?"
          │                         │
   Login / Identity         Roles / Permissions
          │                         │
   Password / Token         RBAC / ABAC / Ownership

Authentication verifies identity.
Authorization determines whether that authenticated identity is allowed to perform an action.

## 🟢 Level 1 — Authentication Basics

### 1. What Is Authentication?

Authentication = verifying the identity of a user.

Example:

User:
email = saurabh@example.com
password = ********

             ↓

Server verifies credentials

             ↓

"You are Saurabh"

Common authentication factors:

Something you know
→ Password / PIN

Something you have
→ Phone / OTP / Security key

Something you are
→ Fingerprint / Face

MFA combines multiple factors.

### 2. What Is Authorization?

Authorization happens after authentication.

Authentication
     ↓
Who are you?
     ↓
Saurabh
     ↓
Authorization
     ↓
What are you allowed to do?

Example:

Saurabh → student

Can:
✓ View jobs
✓ Apply for jobs

Cannot:
✗ Create jobs
✗ Delete other users
✗ Access admin dashboard
### 3. Authentication vs. Authorization
| Authentication | Authorization |
| --- | --- |
| Who are you? | What can you do? |
| Identity | Permission |
| Happens first | Happens after authentication |
| Login | Access control |
| Password/token | Role/permission |
| AuthN | AuthZ |
Easy example
You enter a college:

Authentication:
→ Show your ID card.

Authorization:
→ Student can enter classroom.
→ Professor can enter faculty room.
→ Admin can enter server room.
## 🟢 Level 2 — User Registration

A typical registration flow:

POST /api/auth/register
          ↓
Validate input
          ↓
Check email already exists?
          ↓
Hash password
          ↓
Save user
          ↓
Return safe user data

Example request:
```json
{
  "name": "Saurabh",
  "email": "saurabh@example.com",
  "password": "MyPassword123"
}
```

Database should never contain:

password: "MyPassword123"

Instead:
```text
password:
"$argon2id$..."
```

Passwords should be stored using adaptive password-hashing algorithms such as Argon2id, bcrypt, scrypt, or PBKDF2, not plaintext or ordinary fast hashes such as SHA-256.

### 4. Hashing vs. Encryption

This is extremely important.

Hashing
password
   ↓
hash function
   ↓
hashed password

Normally one-way.

You don't decrypt a password hash.

Encryption
plaintext
   ↓
encryption + key
   ↓
ciphertext
   ↓
decryption + key
   ↓
plaintext

Encryption is reversible with the appropriate key.

Passwords → Hash
Passwords
   ↓
Hash

Not:

Passwords
   ↓
Encryption

OWASP specifically recommends password hashing rather than reversible encryption.

### 5. Salt

A salt is a unique random value added when hashing a password.

Conceptually:

password + random salt
           ↓
        hashing
           ↓
         hash

Two users can have the same password but different hashes:

User A:
password + saltA → hashA

User B:
password + saltB → hashB

The salt helps defend against precomputed/rainbow-table attacks.

### 6. Password Verification

During login:

User enters password
        ↓
Find user by email
        ↓
Retrieve stored password hash
        ↓
Compare entered password with hash
        ↓
      Match?
     /      \
   YES       NO
    ↓         ↓
 Login      Reject

You do not:

hash entered password
       ==
stored hash

unless the password hashing system is specifically designed that way.

Instead, use the password-hashing library's secure verification function.

## 🟢 Level 3 — Login

Typical login:

POST /api/auth/login
          ↓
email + password
          ↓
Find user
          ↓
Verify password
          ↓
Generate authentication state
          ↓
Send session/token

For example:
```json
{
  "email": "saurabh@example.com",
  "password": "********"
}
```

Successful response could contain:
```json
{
  "message": "Login successful",
  "token": "..."
}
```
### 7. Authentication Methods

There are several approaches.

Authentication
│
├── Session-based
│
├── Token-based
│     └── JWT
│
├── OAuth / OIDC
│     └── Google / GitHub etc.
│
├── API Keys
│
└── Passkeys / WebAuthn

For your Node.js backend learning, focus first on:

Session
   ↓
JWT
   ↓
OAuth/OIDC
   ↓
MFA
## 🟡 Level 4 — Sessions

A session-based system keeps authentication state server-side.

Flow:

Login
 ↓
Server verifies credentials
 ↓
Create session
 ↓
Session stored server-side
 ↓
Send session ID to browser
 ↓
Browser sends session ID on future requests

Example:

Browser
   │
   │ session_id=abc123
   ↓
Server
   │
   └── Session Store
          │
          └── abc123 → User 42

The session identifier should be unpredictable and unique.

### 8. Cookies

A cookie is a mechanism through which the browser stores and sends data with requests.

For authentication, an important pattern is:

HTTP-only cookie
        ↓
contains session/token
        ↓
browser automatically sends it

Important cookie properties:

HttpOnly
Secure
SameSite
Max-Age / Expires
HttpOnly

JavaScript cannot normally access the cookie.

Useful for reducing token exposure through some XSS scenarios.

Secure

Cookie is sent only over HTTPS.

SameSite

Controls cross-site cookie behavior and helps mitigate CSRF.

## 🟡 Level 5 — JWT

JWT = JSON Web Token.

A JWT commonly looks like:

xxxxx.yyyyy.zzzzz

Three parts:

HEADER.PAYLOAD.SIGNATURE
### 9. JWT Structure
Header

Contains metadata such as algorithm/type.
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
Payload

Contains claims.
```json
{
  "sub": "123",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234567890
}
```
Signature

Used to verify that the token was signed by a trusted party and wasn't altered.

Conceptually:

header + payload
       ↓
    secret/key
       ↓
   signature

JWTs are signed tokens carrying claims; the JWT specification itself does not automatically mean the contents are encrypted.

### 10. JWT Claims

Important claims:

| Claim | Meaning |
| --- | --- |
| `sub` | Subject/user identifier |
| `iss` | Issuer |
| `aud` | Audience |
| `exp` | Expiration |
| `iat` | Issued at |
| `nbf` | Not valid before |
| `jti` | Token identifier |

Example:

{
    "sub": "6a8bce1e...",
    "role": "student",
    "iat": 1787000000,
    "exp": 1787086400
}
### 11. JWT Login Flow
                  LOGIN
                    ↓
             email + password
                    ↓
             Verify password
                    ↓
              Generate JWT
                    ↓
       ┌────────────┴────────────┐
       ↓                         ↓
   Cookie                    Response
       │                         │
       └────────────┬────────────┘
                    ↓
              Future request
                    ↓
              Send token
                    ↓
             Auth middleware
                    ↓
             Verify JWT
                    ↓
              req.user
                    ↓
               Controller
### 12. JWT Verification

Suppose:

GET /api/profile
Authorization: Bearer <token>

Middleware:

Extract token
     ↓
Is token present?
     ↓
Verify signature
     ↓
Check expiration
     ↓
Check issuer/audience if applicable
     ↓
Extract identity
     ↓
req.user = decoded identity
     ↓
next()
### 13. Never Trust the Client

This is one of the most important concepts.

Client sends:

{
    "role": "admin"
}

You should NOT assume:

User is admin

A malicious user can modify their request.

Instead:

Authenticated identity
        ↓
Server-side trusted user record/claims
        ↓
Authorization decision

Authorization must be enforced server-side on each relevant request; hiding UI elements is not authorization. OWASP also recommends denying by default and checking permissions on every request.

## 🔴 Level 6 — Authorization

Now comes the second half.

### 14. Role-Based Access Control — RBAC

Example roles:

student
recruiter
admin

Permissions:

student
├── view jobs
└── apply

recruiter
├── view jobs
├── create jobs
└── manage own jobs

admin
├── everything
└── manage users
### 15. Role Middleware

Conceptually:

Request
   ↓
authenticate
   ↓
req.user
   ↓
authorize("admin")
   ↓
Controller

Example:

DELETE /api/users/:id

authenticate
     ↓
Is user logged in?
     ↓
YES
     ↓
Is user admin?
    / \
  YES  NO
   ↓    ↓
 next   403
### 16. 401 vs. 403

Remember this forever:

401
↓
"I don't know who you are."

403
↓
"I know who you are,
but you're not allowed."

Example:

No JWT
→ 401

Valid JWT + student tries admin operation
→ 403
## 🔴 Level 7 — Resource Ownership

This is where authorization becomes more interesting.

Suppose:

GET /api/users/123

User 456 is logged in.

Simply checking:

Is user authenticated?

isn't enough.

You need:

Does user 456 have permission
to access user 123?
### 17. Horizontal Privilege Escalation

Example:

Saurabh → user ID 101
Rahul   → user ID 102

Saurabh requests:

GET /api/users/102

If your API returns Rahul's private information just because Saurabh guessed the ID:

authorization vulnerability.

Random IDs alone do not solve this; authorization must be checked against the actual resource.

### 18. Vertical Privilege Escalation

A lower-privileged user accesses a higher-privileged function.

student
   ↓
POST /api/admin/delete-user

If allowed:

student → admin capability

That's vertical privilege escalation.

### 19. Horizontal vs. Vertical
Authorization attacks
│
├── Horizontal
│      ↓
│   User A accesses User B's resources
│
└── Vertical
       ↓
    Student accesses Admin functionality
## 🔴 Level 8 — RBAC vs. ABAC
RBAC

Authorization based primarily on role.

role = recruiter
       ↓
can create job

Simple:

student → permissions A
recruiter → permissions B
admin → permissions C
ABAC

Attribute-Based Access Control considers attributes.

For example:

user.role
user.department
resource.owner
resource.status
request.method

Example:

Can this recruiter edit this job?

user.role == "recruiter"
AND
job.postedBy == user.id

This is more fine-grained.

OWASP recommends considering attribute/relationship-based controls for many applications instead of relying only on coarse RBAC.

## 🟣 Level 9 — Your Job Portal Authorization

For your current project, imagine:

                    USER
                     │
              authenticate
                     │
                  req.user
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       student    recruiter    admin
          │          │          │
          ↓          ↓          ↓
        Apply     Create Job   Manage Users
                   │
                   ↓
              postedBy check

For example:

POST /api/jobs

requires:

authenticated?
      ↓
     YES
      ↓
role == recruiter?
      ↓
     YES
      ↓
create job

For:

PATCH /api/jobs/:id

you might require:

authenticated
AND
(
    role == admin
    OR
    job.postedBy == req.user._id
)

That's a much more realistic authorization rule.

## 🟣 Level 10 — Password Security
Never store:
password: "Saurabh123"

Instead:

passwordHash: "$argon2id$..."

Modern password hashing should be deliberately expensive and salted. OWASP currently recommends Argon2id as the preferred choice, with scrypt as an alternative; bcrypt is mainly a legacy-compatible choice.

Node.js also provides crypto.scrypt() as an asynchronous password-based key derivation function designed to make brute-force attacks more expensive.

### 20. Password Change

Don't simply allow:

PATCH /users/:id
{
    password: "newPassword"
}

without authentication/authorization.

A better flow:

Authenticated user
       ↓
Current password
       ↓
Verify current password
       ↓
Validate new password
       ↓
Hash new password
       ↓
Save
       ↓
Invalidate/review existing sessions if appropriate

OWASP recommends verifying the current password for authenticated password-change operations.

## 🟣 Level 11 — Forgot Password

Typical flow:

POST /forgot-password
          ↓
User enters email
          ↓
Generate secure random reset token
          ↓
Store token reference/hash + expiry
          ↓
Send reset link
          ↓
User opens link
          ↓
Verify token + expiry
          ↓
Set new password
          ↓
Invalidate token

Important:

Token must:
✓ be cryptographically random
✓ have limited lifetime
✓ be tied to the user
✓ be single-use

OWASP recommends cryptographically secure reset identifiers with sufficient length, expiry, and user association.

## 🟣 Level 12 — Email Verification

Registration:

Register
   ↓
Create user
   ↓
emailVerified = false
   ↓
Generate verification token
   ↓
Send email

User clicks:

GET /verify-email?token=...
          ↓
Verify token
          ↓
emailVerified = true

Then certain features can require:

authenticated
+
emailVerified
## 🔵 Level 13 — MFA

MFA = Multi-Factor Authentication.

Example:

Password
   +
OTP

or:

Password
   +
Authenticator App

or modern authentication:

Passkey

Conceptually:

Login
 ↓
Password correct?
 ↓
YES
 ↓
MFA required?
 ↓
YES
 ↓
Verify second factor
 ↓
Authenticated

MFA significantly strengthens authentication because compromising one factor isn't enough.

## 🔵 Level 14 — OAuth / OpenID Connect

When you see:

Continue with Google
Continue with GitHub
Login with Microsoft

you're entering the world of delegated/federated authentication.

Simplified:

Your App
   ↓
Google
   ↓
User authenticates
   ↓
Google gives authorization response
   ↓
Your backend verifies/exchanges it
   ↓
Your application identifies the user

Important distinction:

OAuth 2.0
→ Authorization framework

OpenID Connect
→ Authentication/identity layer built on OAuth 2.0
## 🔵 Level 15 — Access Token vs. Refresh Token

Common token architecture:

             LOGIN
               ↓
       ┌───────┴────────┐
       ↓                ↓
 Access Token       Refresh Token
       │                │
 short-lived       longer-lived
       │                │
 API requests       obtain new
       │             access token
       ↓                │
   expires             ↓
                  new access token

Example:

Access token
→ 15 minutes

Refresh token
→ days/weeks depending on architecture

The exact lifetime depends on your security requirements.

### 16. Refresh Token Rotation

A more advanced strategy:

Refresh Token A
       ↓
used
       ↓
Refresh Token B
       ↓
old token invalidated

If an old refresh token appears again:

Possible token theft/reuse
         ↓
Revoke token family/session

This is useful for reducing the impact of stolen refresh tokens.

## 🔴 Level 16 — JWT Security

JWT has several important security concerns.

Never put secrets in payload

Don't put:

{
    "password": "..."
}

or:

{
    "creditCard": "..."
}

A normal signed JWT payload is not inherently confidential/encrypted.

Remember:

JWT signed ≠ JWT encrypted
### 17. JWT Verification

Don't merely decode:

decode(token)

and trust the result.

You need to verify the token's authenticity and relevant claims.

Conceptually:

token
 ↓
verify signature
 ↓
verify expiration
 ↓
verify issuer/audience where applicable
 ↓
accept identity

JWT security guidance specifically calls out risks such as algorithm/key confusion and trusting unsafe key material.

### 18. Token Storage

For browser applications, be careful about storing sensitive authentication material in JavaScript-accessible storage.

OWASP warns against storing sensitive authentication information in localStorage, because XSS can allow malicious JavaScript to access it.

Common browser architecture:

Sensitive session/token
        ↓
HttpOnly + Secure cookie

But cookie-based authentication introduces another concern:

CSRF

So you need appropriate CSRF defenses depending on your architecture.

## 🔴 Level 17 — CSRF

CSRF = Cross-Site Request Forgery.

Imagine:

User logged into bank
        ↓
Browser has authentication cookie
        ↓
User visits malicious website
        ↓
Malicious site causes request to bank
        ↓
Browser automatically sends cookie

The server might think:

"That's the logged-in user!"

Defenses depend on architecture and include:

SameSite cookies
CSRF tokens
Origin/Referer validation
Appropriate cookie configuration
## 🔴 Level 18 — XSS

XSS = Cross-Site Scripting.

Attacker manages to inject JavaScript into a page.

Potential impact:

XSS
 ↓
malicious JS
 ↓
steal data/tokens accessible to JS

This is one reason HttpOnly cookies can be useful for session credentials: JavaScript can't directly read the cookie.

But remember:

HttpOnly does not magically prevent XSS.

It mainly prevents JavaScript from directly reading that cookie.

## 🔴 Level 19 — Rate Limiting

Authentication endpoints are attractive targets for brute-force attacks.

Especially:

POST /login
POST /forgot-password
POST /verify-otp

Without protection:

Attacker
 ↓
1,000 login attempts
 ↓
10,000
 ↓
1,000,000

Use:

Rate limiting
+
Account protections
+
Monitoring

Example conceptual rule:

5 failed attempts
      ↓
temporary delay/block

Exact policies should be designed carefully to avoid enabling account enumeration or denial-of-service.

## 🔴 Level 20 — Account Enumeration

Bad:

POST /login

"Email doesn't exist"

versus:

"Password incorrect"

This can reveal whether an account exists.

Similarly:

"Email is registered"

on registration/reset flows can leak account existence.

A more uniform response may be:

"Invalid email or password"

depending on the endpoint and threat model.

## 🔴 Level 21 — Least Privilege

Give users only the permissions they need.

Example:

Student
→ apply to jobs

Recruiter
→ manage own job postings

Admin
→ manage platform

Don't give:

student → admin permissions

just because it is easier.

OWASP recommends least privilege and deny-by-default authorization.

## 🔴 Level 22 — Deny by Default

Bad approach:

if user.role === "student"
    allow some things
else
    allow

Better mental model:

DEFAULT
  ↓
DENY
  ↓
Explicitly grant permission

For example:

Can user perform DELETE /jobs/:id?
          ↓
Check permission
          ↓
YES → continue
NO  → 403
## 🔴 Level 23 — Authentication Middleware

Typical Express architecture:

Request
   ↓
Logger
   ↓
Authentication middleware
   ↓
Authorization middleware
   ↓
Router
   ↓
Controller
   ↓
Database

Authentication middleware:

Request
 ↓
Extract credentials
 ↓
Verify
 ↓
req.user
 ↓
next()

Authorization middleware:

req.user
 ↓
Check role/permission/ownership
 ↓
next()
## 🔥 Level 24 — Complete Request Flow

For your Job Portal:

POST /api/jobs
        │
        ↓
   Logger Middleware
        │
        ↓
   Authentication
        │
        ├── No credentials
        │       ↓
        │      401
        │
        ↓
     req.user
        │
        ↓
 Authorization
        │
        ├── Not recruiter/admin
        │       ↓
        │      403
        │
        ↓
      Validation
        │
        ↓
     Controller
        │
        ↓
      Mongoose
        │
        ↓
     MongoDB
        │
        ↓
     Response
## 🔥 Level 25 — Your Job Portal Security Model

You can design it like this:

                    USER
                     │
                     ↓
               AUTHENTICATION
                     │
              ┌──────┴──────┐
              ↓             ↓
           Session         JWT
              │             │
              └──────┬──────┘
                     ↓
                  req.user
                     │
                     ↓
               AUTHORIZATION
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
    student       recruiter       admin
       │             │             │
       ↓             ↓             ↓
     Apply       Create Job    Manage Users
                   │
                   ↓
              OWNERSHIP CHECK
                   │
                   ↓
             postedBy === user
## 🔥 Level 26 — Authentication vs. Authorization vs. Ownership

This distinction is very important for backend interviews.

Authentication
Is Saurabh logged in?
Authorization
Is Saurabh a recruiter?
Ownership
Does this job belong to Saurabh?

Example:

PATCH /api/jobs/123

You might check:

1. Is user authenticated?
       ↓
2. Is user recruiter/admin?
       ↓
3. If recruiter:
       Does job.postedBy === user._id?
       ↓
4. Allow update
## 🔥 Level 27 — Advanced Authorization Models

As applications grow:

Authorization
│
├── RBAC
│   └── Role-based
│
├── ABAC
│   └── Attribute-based
│
├── ReBAC
│   └── Relationship-based
│
└── Policy-based authorization
ReBAC example
User
 ↓
member of
 ↓
Organization
 ↓
owns
 ↓
Project

Permission can depend on the relationship.

## 🔥 Level 28 — Session Revocation

JWTs are often described as stateless, but real systems sometimes need revocation.

Problem:

JWT expires in 7 days

User logs out.

What happens to an already-issued token?

It may remain cryptographically valid until expiry unless you add a revocation mechanism.

Possible approaches:

Short-lived access tokens
+
Refresh token revocation

or

Token denylist

or

Session/token versioning

or

Centralized session management

JWT guidance discusses revocation and denylist approaches.

## 🔥 Level 29 — Security Headers & HTTPS

Authentication isn't only about passwords and JWT.

Production security also involves:

HTTPS/TLS
Security headers
CORS configuration
CSRF protection where applicable
Rate limiting
Input validation
Secure cookies
Secret management
Logging/monitoring

Passwords and authenticated traffic should be transmitted over TLS.

## 🔥 Level 30 — Secrets Management

Never:

const SECRET = "my-super-secret";

inside production source code.

Use environment/configuration secret management:

JWT_SECRET
DATABASE_URL
COOKIE_SECRET
API_KEYS

and don't commit them to Git.

.env
 ↓
environment variables
 ↓
application

For larger systems:

Secret Manager
Vault
Cloud secret management
## 🔥 Level 31 — Logging & Monitoring

Authentication systems should log useful security events.

For example:

Login success
Login failure
Password reset requested
Password changed
MFA enabled
MFA failure
Account locked
Suspicious access
Authorization failure

But don't log passwords, tokens, or other sensitive credentials.

Authorization guidance also recommends appropriate logging and testing of authorization logic.

## 🔥 Level 32 — Testing Authentication

Don't only test:

Correct password → 200

Test:

Wrong password
Missing password
Unknown email
Expired token
Malformed token
Missing token
Wrong role
Wrong owner
Disabled user
Expired reset token
Reused reset token
Unauthorized resource ID

For your Job Portal:

Student creates job
        ↓
403

Recruiter creates job
        ↓
201

Student modifies another user's job
        ↓
403

Unauthenticated user creates job
        ↓
401
## 🧠 Complete Authentication Mindmap
AUTHENTICATION & AUTHORIZATION
│
├── Authentication
│   │
│   ├── Identity
│   ├── Password
│   ├── Hashing
│   │   ├── Argon2id
│   │   ├── bcrypt
│   │   ├── scrypt
│   │   └── PBKDF2
│   ├── Salt
│   ├── Login
│   ├── Sessions
│   ├── Cookies
│   ├── JWT
│   │   ├── Header
│   │   ├── Payload
│   │   ├── Signature
│   │   └── Claims
│   ├── Access Token
│   ├── Refresh Token
│   ├── OAuth
│   ├── OIDC
│   ├── MFA
│   ├── Email Verification
│   └── Password Reset
│
├── Authorization
│   │
│   ├── RBAC
│   ├── ABAC
│   ├── ReBAC
│   ├── Permissions
│   ├── Roles
│   ├── Ownership
│   ├── Least Privilege
│   └── Deny by Default
│
├── Express
│   │
│   ├── Auth Middleware
│   ├── Authorization Middleware
│   ├── req.user
│   ├── Protected Routes
│   └── Error Handling
│
├── Security
│   │
│   ├── HTTPS
│   ├── CORS
│   ├── CSRF
│   ├── XSS
│   ├── Rate Limiting
│   ├── Account Enumeration
│   ├── Secure Cookies
│   ├── Secret Management
│   └── Security Headers
│
└── Advanced
    │
    ├── Token Revocation
    ├── Refresh Token Rotation
    ├── Session Management
    ├── Token Theft
    ├── Replay Protection
    ├── Audit Logging
    ├── Security Monitoring
    └── Authorization Testing
## ⭐ What You Should Know at Your Current Stage

Since you're learning Node.js + Express + MongoDB/Mongoose, don't try to master every advanced security topic immediately.

Your priority should be:

1. Authentication vs Authorization
        ↓
2. Registration
        ↓
3. Password hashing
        ↓
4. Login
        ↓
5. JWT / Sessions
        ↓
6. Authentication middleware
        ↓
7. req.user
        ↓
8. RBAC
        ↓
9. Ownership checks
        ↓
10. 401 vs 403
        ↓
11. Cookies / HTTPS
        ↓
12. Refresh tokens
        ↓
13. Password reset
        ↓
14. Email verification
        ↓
15. MFA
        ↓
16. OAuth/OIDC
        ↓
17. Advanced authorization
        ↓
18. Security testing

For your Job Portal, the most important practical architecture is:

Register
   ↓
Hash password
   ↓
MongoDB

Login
   ↓
Verify password
   ↓
Issue session/JWT
   ↓
Client

Protected Request
   ↓
Authentication middleware
   ↓
req.user
   ↓
Authorization middleware
   ↓
Role/ownership check
   ↓
Controller
   ↓
MongoDB

That is the core pattern you should be able to explain in an interview and implement in Express.
