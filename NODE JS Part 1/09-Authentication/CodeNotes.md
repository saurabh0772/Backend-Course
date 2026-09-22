# 🔐 Authentication — Register + Login

## 1. Overall Flow

First memorize this:
```text
REGISTER
────────────────────────────────────────────

Client
  │
  │ name + email + password
  ↓
POST /api/auth/register
  │
  ↓
Validate input
  │
  ↓
Check email already exists
  │
  ↓
Hash password
  │
  ↓
Create User
  │
  ↓
MongoDB
  │
  ↓
Response


LOGIN
────────────────────────────────────────────

Client
  │
  │ email + password
  ↓
POST /api/auth/login
  │
  ↓
Find user by email
  │
  ↓
Compare password with hash
  │
  ↓
Generate JWT
  │
  ↓
Send token
  ↓
Client
```
## 2. Project Structure

A clean beginner-friendly structure:

```text
src/
│
├── config/
│   └── database.js
│
├── models/
│   └── user.model.js
│
├── controllers/
│   └── auth.controller.js
│
├── routes/
│   └── auth.routes.js
│
├── middleware/
│   └── auth.middleware.js
│
└── app.js

.env
package.json
```
## 3. Install Packages
```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv
```

You already know Express and Mongoose.

New packages:

bcryptjs
   ↓
Password hashing

jsonwebtoken
   ↓
Create and verify JWT

dotenv
   ↓
Read environment variables
## 4. `.env`

Create:

```dotenv
PORT=3000

MONGO_URI=mongodb://127.0.0.1:27017/authPractice

JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=1d
```
Important

Don't commit .env to GitHub.

Add:

.env
## 5. Database Connection
`config/database.js`
```js
import mongoose from "mongoose";

export const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

    } catch (error) {

        console.log("MongoDB connection failed");
        console.log(error.message);

        process.exit(1);
    }
};
```
## 6. User Model
`models/user.model.js`
```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6,

            // IMPORTANT:
            // Never send the password hash by default
            select: false
        },

        role: {
            type: String,
            enum: ["student", "recruiter", "admin"],
            default: "student"
        },

        isActive: {
            type: Boolean,
            default: true
        }

    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);
```
Important fields
select: false

means when you do:

User.find()

the password field won't normally be returned.

But during login, we need the password hash, so we'll explicitly request it:

.select("+password")
## 7. Register Controller
`controllers/auth.controller.js`
```js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
```

Now registration:
```js
export const register = async (req, res) => {

    const { name, email, password, role } = req.body;


    // ---------------------------------------
    // 1. Validate required fields
    // ---------------------------------------

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Name, email and password are required"
        });

    }


    // ---------------------------------------
    // 2. Check if user already exists
    // ---------------------------------------

    const existingUser = await User.findOne({ email });

    if (existingUser) {

        return res.status(409).json({
            message: "User with this email already exists"
        });

    }


    // ---------------------------------------
    // 3. Hash password
    // ---------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);


    // ---------------------------------------
    // 4. Create user
    // ---------------------------------------

    const user = await User.create({

        name,

        email,

        password: hashedPassword,

        role: role || "student"

    });


    // ---------------------------------------
    // 5. Send response
    // ---------------------------------------

    return res.status(201).json({

        message: "User registered successfully",

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

    });
};
```
### 🧠 Understand Registration

The important part is:

const hashedPassword = await bcrypt.hash(password, 12);

Suppose user sends:

password = "Saurabh123"

You don't store:

"Saurabh123"

You store something like:

$2b$12$............

Then:

Plain password
      ↓
bcrypt.hash()
      ↓
Password hash
      ↓
MongoDB
## 8. Login Controller

Add:

export const login = async (req, res) => {

    const { email, password } = req.body;


    // ---------------------------------------
    // 1. Validate input
    // ---------------------------------------

    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required"
        });

    }


    // ---------------------------------------
    // 2. Find user
    //
    // Password has select:false,
    // so explicitly include it.
    // ---------------------------------------

    const user = await User
        .findOne({ email })
        .select("+password");


    // ---------------------------------------
    // 3. User doesn't exist
    // ---------------------------------------

    if (!user) {

        return res.status(401).json({
            message: "Invalid email or password"
        });

    }


    // ---------------------------------------
    // 4. Compare password
    // ---------------------------------------

    const isPasswordCorrect =
        await bcrypt.compare(password, user.password);


    // ---------------------------------------
    // 5. Password incorrect
    // ---------------------------------------

    if (!isPasswordCorrect) {

        return res.status(401).json({
            message: "Invalid email or password"
        });

    }


    // ---------------------------------------
    // 6. Create JWT
    // ---------------------------------------

    const token = jwt.sign(

        {
            userId: user._id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

    );


    // ---------------------------------------
    // 7. Send token
    // ---------------------------------------

    return res.status(200).json({

        message: "Login successful",

        token,

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }

    });
};
### 🧠 Login Flow

This is the most important part:

email + password
       ↓
find user
       ↓
get stored password hash
       ↓
bcrypt.compare()
       ↓
     Match?
    /     \
  YES      NO
   ↓        ↓
Create     401
JWT
   ↓
Return JWT

bcrypt.compare() is specifically provided for checking a plaintext password against a stored bcrypt hash.

## 9. Why Do We Use `bcrypt.compare()`?

Suppose database contains:

password:
$2b$12$abcdefgh........

User enters:

Saurabh123

We don't decrypt the hash.

Instead:

bcrypt.compare(
    "Saurabh123",
    storedHash
);

returns:

true

or:

false
## 10. Auth Routes
routes/auth.routes.js
import express from "express";

import {
    register,
    login
} from "../controllers/auth.controller.js";

const router = express.Router();


// Register
router.post("/register", register);


// Login
router.post("/login", login);


export default router;
## 11. Main App
app.js
import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/database.js";

import authRoutes from "./routes/auth.routes.js";


dotenv.config();


const app = express();


// ---------------------------------------
// Middleware
// ---------------------------------------

app.use(express.json());


// ---------------------------------------
// Database
// ---------------------------------------

await connectDB();


// ---------------------------------------
// Routes
// ---------------------------------------

app.use("/api/auth", authRoutes);


// ---------------------------------------
// Server
// ---------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
## 12. Your APIs

You now have:

POST /api/auth/register

POST /api/auth/login
## 🧪 13. Test Register
Postman
POST http://localhost:3000/api/auth/register

Body → raw → JSON:

{
    "name": "Saurabh Kumar",
    "email": "saurabh@example.com",
    "password": "Saurabh123"
}

Expected:

{
    "message": "User registered successfully",
    "user": {
        "id": "...",
        "name": "Saurabh Kumar",
        "email": "saurabh@example.com",
        "role": "student"
    }
}

Notice:

Password isn't returned.

## 🧪 14. Check MongoDB

You should see something similar to:

{
    "_id": "...",
    "name": "Saurabh Kumar",
    "email": "saurabh@example.com",
    "password": "$2b$12$.....",
    "role": "student",
    "isActive": true
}

The important thing:

❌ password: "Saurabh123"

✅ password: "$2b$12$..."
## 🧪 15. Test Login
POST http://localhost:3000/api/auth/login

Body:

{
    "email": "saurabh@example.com",
    "password": "Saurabh123"
}

Response:

{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "...",
        "name": "Saurabh Kumar",
        "email": "saurabh@example.com",
        "role": "student"
    }
}
## 🔥 16. Now Protect a Route

This is where authentication middleware comes in.

Create:

middleware/
└── auth.middleware.js
auth.middleware.js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {

    // ---------------------------------------
    // 1. Get Authorization header
    // ---------------------------------------

    const authHeader = req.headers.authorization;


    // ---------------------------------------
    // 2. Check if header exists
    // ---------------------------------------

    if (!authHeader) {

        return res.status(401).json({
            message: "Authentication required"
        });

    }


    // ---------------------------------------
    // 3. Check Bearer format
    //
    // Authorization:
    // Bearer <token>
    // ---------------------------------------

    const [scheme, token] = authHeader.split(" ");


    if (scheme !== "Bearer" || !token) {

        return res.status(401).json({
            message: "Invalid authorization format"
        });

    }


    // ---------------------------------------
    // 4. Verify JWT
    // ---------------------------------------

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // -----------------------------------
        // 5. Store authenticated user
        // -----------------------------------

        req.user = decoded;


        // -----------------------------------
        // 6. Continue request
        // -----------------------------------

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};
## 17. What Is Happening Here?

Client sends:

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Then:

Request
  ↓
Authorization header
  ↓
Extract token
  ↓
jwt.verify()
  ↓
Valid?
 /   \
NO    YES
↓      ↓
401   req.user
       ↓
     next()
## 18. `req.user`

Suppose your JWT contains:

{
    "userId": "123",
    "role": "student"
}

After:

req.user = decoded;

your controller can access:

req.user.userId

and:

req.user.role

This is extremely important.

## 19. Protected Route

Suppose you create:

router.get(
    "/profile",
    authenticate,
    getProfile
);

Flow:

GET /api/auth/profile
         ↓
    authenticate
         ↓
    JWT verification
         ↓
      req.user
         ↓
     getProfile

Controller:

export const getProfile = async (req, res) => {

    const user = await User.findById(req.user.userId);

    if (!user) {

        return res.status(404).json({
            message: "User not found"
        });

    }

    res.json({
        user
    });
};
## 🔥 20. Authentication vs. Authorization in Code

This distinction becomes very clear now.

Authentication
authenticate

asks:

"Is this user authenticated?"

Authorization

For example:

authorize("admin")

asks:

"Is this authenticated user an admin?"

## 21. Authorization Middleware
export const authorize = (...allowedRoles) => {

    return (req, res, next) => {

        // User should already be authenticated
        if (!req.user) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        // Check role
        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                message: "You don't have permission"
            });

        }


        next();
    };
};
## 22. Use Both Together

For example:

router.post(
    "/jobs",
    authenticate,
    authorize("recruiter", "admin"),
    createJob
);

Flow:

POST /jobs
    ↓
authenticate
    ↓
Logged in?
    │
    ├── NO → 401
    │
    ↓
authorize
    ↓
recruiter/admin?
    │
    ├── NO → 403
    │
    ↓
createJob

This is the pattern you should remember for your Job Portal.

## 🔥 23. Complete Architecture
                         CLIENT
                            │
                            ↓
                    POST /register
                            │
                            ↓
                       Controller
                            │
                            ↓
                      bcrypt.hash()
                            │
                            ↓
                         User
                            │
                            ↓
                         MongoDB


                         CLIENT
                            │
                            ↓
                      POST /login
                            │
                            ↓
                       Controller
                            │
                            ↓
                     Find user
                            │
                            ↓
                  bcrypt.compare()
                            │
                            ↓
                       jwt.sign()
                            │
                            ↓
                         JWT
                            │
                            ↓
                         CLIENT

Then:

CLIENT
   │
   │ Authorization: Bearer TOKEN
   ↓
Express
   ↓
authenticate
   ↓
jwt.verify()
   ↓
req.user
   ↓
authorize()
   ↓
Controller
   ↓
MongoDB
   ↓
Response
## ⚠️ 24. One Important Mongoose Point

If you use:

userSchema.pre("save", ...)

to hash passwords, remember that Mongoose pre('save') middleware runs for document .save() operations, and create() triggers save hooks. But findOneAndUpdate() does not execute save() middleware.

So this:

await User.create({
    password: "hello"
});

can trigger your pre("save") hash hook.

But:

await User.findOneAndUpdate(
    { email },
    { password: "newPassword" }
);

doesn't automatically run your pre("save") hook.

This becomes important when you implement change-password functionality.

## 🧠 25. The Entire Thing in One Mindmap
AUTHENTICATION
│
├── REGISTER
│   │
│   ├── Receive name/email/password
│   │
│   ├── Validate
│   │
│   ├── Check existing email
│   │
│   ├── bcrypt.hash(password)
│   │
│   ├── Create User
│   │
│   └── Return safe user
│
├── LOGIN
│   │
│   ├── Receive email/password
│   │
│   ├── Find User
│   │
│   ├── Get password hash
│   │
│   ├── bcrypt.compare()
│   │
│   ├── jwt.sign()
│   │
│   └── Return token
│
├── PROTECTED ROUTE
│   │
│   ├── Authorization header
│   │
│   ├── Extract Bearer token
│   │
│   ├── jwt.verify()
│   │
│   ├── req.user
│   │
│   └── next()
│
└── AUTHORIZATION
    │
    ├── Check role
    │
    ├── Check permission
    │
    ├── Check ownership
    │
    ├── 401 → Not authenticated
    │
    └── 403 → Not authorized
## ⭐ What You Should Implement Yourself Next

Don't just copy the above. Build these in order:

1. POST /register
        ↓
2. Hash password with bcrypt
        ↓
3. POST /login
        ↓
4. Generate JWT
        ↓
5. authenticate middleware
        ↓
6. GET /profile
        ↓
7. authorize middleware
        ↓
8. recruiter-only route
        ↓
9. admin-only route
        ↓
10. ownership check
        ↓
11. change password
        ↓
12. forgot password
        ↓
13. refresh token

Once you can build 1–10 without looking at notes, you'll have a very solid practical understanding of authentication/authorization for your current Node.js backend level.












# 🔐 Authentication Storage & Token Architecture

There are four concepts you should keep separate:

Authentication
│
├── Session-based authentication
│
├── Token-based authentication
│      │
│      └── JWT
│
├── Cookies
│
└── Access Token + Refresh Token

The biggest confusion is:

Session, cookie, access token and refresh token are not four competing things.

They can be combined.

For example:

Session-based
    +
Cookie

is very common.

And:

JWT access token
    +
JWT/opaque refresh token
    +
HttpOnly cookie

is another architecture.

## 1. Session-Based Authentication

In session-based authentication, the server maintains the login state.

Flow
             LOGIN
               │
               ↓
       email + password
               │
               ↓
        Verify password
               │
               ↓
       Create session
               │
               ↓
      Session stored on server
               │
               ↓
       sessionId generated
               │
               ↓
      Send sessionId to client

Suppose:

sessionId = abc123xyz

Server stores:

abc123xyz → User ID 101

Then browser sends:

sessionId=abc123xyz

on future requests.

Server does:

sessionId
    ↓
find session
    ↓
User ID 101
    ↓
authenticated
## 2. Session Architecture
Browser
   │
   │ sessionId
   ↓
Express Server
   │
   ↓
Session Store
   │
   ├── abc123 → User 101
   ├── xyz456 → User 205
   └── pqr789 → User 302

The session store might be:

Memory
Redis
Database
MongoDB

For production, you generally don't want authentication sessions stored only in a single server's process memory because restarting/scaling the server becomes problematic.

## 3. Session-Based Login Example

Conceptually:

app.post("/login", async (req, res) => {

    // 1. Find user
    const user = await User.findOne({
        email: req.body.email
    });

    // 2. Verify password
    const valid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!valid) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    // 3. Create session
    const sessionId = createSession(user._id);

    // 4. Send session ID
    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });

    res.json({
        message: "Login successful"
    });
});

The important point:

The cookie doesn't necessarily contain the user's information.

It can simply contain:

sessionId = abc123

while the actual authentication state lives on the server.

## 4. Session Authentication Request

After login:

GET /profile
Cookie: sessionId=abc123

Server:

Cookie
  ↓
sessionId
  ↓
Session Store
  ↓
User ID
  ↓
Find User
  ↓
req.user
  ↓
Controller
## 5. Session Logout

Logout is straightforward:

Logout
  ↓
Delete session from server
  ↓
Clear cookie

For example:

await sessionStore.delete(sessionId);

res.clearCookie("sessionId");

res.json({
    message: "Logged out"
});

Now:

sessionId = abc123

no longer maps to a valid session.

## 🟢 6. What Is a Cookie?

A cookie is a mechanism for storing small pieces of data in the browser and sending them with requests.

Cookie ≠ authentication.

Cookies can be used for authentication, but aren't authentication by themselves.

For example:

Cookie:
theme=dark

isn't authentication.

But:

Cookie:
sessionId=abc123

can participate in authentication.

## 7. Important Cookie Options

You'll frequently see:

res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax"
});

Understand each one.

httpOnly
JavaScript
   ↓
Cannot normally access cookie

So:

document.cookie

won't expose an HttpOnly authentication cookie.

This reduces the ability of injected JavaScript to directly steal that cookie.

secure
secure: true

means the browser should send the cookie over HTTPS.

During local development you may commonly use:

secure: false

when running plain HTTP locally.

Production:

secure: true
sameSite

Controls when the browser sends cookies in cross-site situations.

Common values:

Strict
Lax
None

For example:

sameSite: "lax"

is a common starting configuration.

If you use:

sameSite: "none"

browsers require:

secure: true
## 🔥 8. Cookie-Based Authentication

Cookie-based authentication usually means:

Browser
   │
   │ Cookie
   ↓
Server

The cookie could contain:

session ID

or:

access token

or:

refresh token

Therefore:

Cookie-based authentication and JWT authentication are not opposites.

You can have:

JWT + Cookie
## 🟡 9. Token-Based Authentication

Instead of maintaining the authentication state in a server-side session, the client presents a token.

Flow:

Login
 ↓
Verify credentials
 ↓
Generate token
 ↓
Client stores/sends token
 ↓
Future request
 ↓
Server verifies token
 ↓
Authenticated

Example:

Authorization: Bearer eyJhbGciOi...
## 10. JWT Authentication

JWT is one type of token.

JWT
│
├── Header
├── Payload
└── Signature

Example:

xxxxx.yyyyy.zzzzz

The server verifies its signature and claims.

## 🔥 11. Access Token

An access token is the credential used to access protected resources/APIs.

Example:

Access Token
     ↓
GET /api/jobs
     ↓
Authorization: Bearer <access_token>

Access tokens are usually short-lived.

For example, conceptually:

Access Token
     ↓
15 minutes

The exact lifetime depends on your application.

## 12. Why Short-Lived Access Tokens?

Imagine an attacker steals:

access_token

If it remains valid for:

30 days

that's a large window of abuse.

If it expires relatively quickly:

15 minutes

the damage window is smaller.

But then we have a problem:

What happens when the access token expires?

That's where the refresh token comes in.

## 🔥 13. Refresh Token

A refresh token is a credential used to obtain a new access token.

It generally isn't used for every API request.

Think:

Access Token
→ "Let me access the API."

Refresh Token
→ "Let me get a new access token."
## 14. Access + Refresh Token Flow
                    LOGIN
                      │
                      ↓
               Verify password
                      │
                      ↓
            ┌─────────┴─────────┐
            ↓                   ↓
      Access Token         Refresh Token
       short-lived          long-lived
            │                   │
            ↓                   ↓
       API requests        Get new access
                              token

For example:

Access Token
   ↓
15 minutes

Refresh Token
   ↓
days/weeks

These are example lifetimes, not universal rules.

## 15. Normal API Request

Suppose:

Access token = AT123

Client requests:

GET /api/profile
Authorization: Bearer AT123

Server:

AT123
 ↓
verify
 ↓
valid?
 ↓
YES
 ↓
return data
## 16. Access Token Expires

Eventually:

AT123
 ↓
expired

Client makes:

GET /api/profile
Authorization: Bearer AT123

Server:

Token expired
    ↓
401

Now the client uses the refresh token.

## 🔥 17. Refresh Flow
Access Token expired
         ↓
POST /api/auth/refresh
         ↓
Send Refresh Token
         ↓
Server verifies refresh token
         ↓
Generate NEW access token
         ↓
Return new access token

Then:

Client
  ↓
New Access Token
  ↓
API request
## 18. Complete Access + Refresh Architecture
                         LOGIN
                           │
                           ↓
                    Verify credentials
                           │
                           ↓
              ┌────────────┴────────────┐
              ↓                         ↓
       ACCESS TOKEN               REFRESH TOKEN
       short-lived                 long-lived
              │                         │
              ↓                         │
        API requests                    │
              │                         │
              ↓                         │
           expires                      │
              │                         │
              ↓                         ↓
             401 ─────────────→ /refresh
                                      │
                                      ↓
                              Verify refresh token
                                      │
                                      ↓
                              New access token
                                      │
                                      ↓
                              Continue API usage
## 🔥 19. Where Should Tokens Be Stored?

This is where people often get confused.

There are several possibilities:

Access/Refresh Token
│
├── Memory
├── localStorage
├── sessionStorage
└── HttpOnly Cookie

For browser-based applications, storing sensitive authentication tokens in JavaScript-accessible storage such as localStorage has security tradeoffs, particularly around XSS. OWASP specifically advises against storing sensitive information there. (cheatsheetseries.owasp.org)

A common architecture is:

Access Token
   ↓
memory / carefully managed client state

Refresh Token
   ↓
HttpOnly + Secure cookie

But the correct architecture depends on your frontend/backend setup and threat model.

## 🔥 20. JWT + Cookie

You can put a JWT inside a cookie.

For example:

res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax"
});

Then browser automatically sends:

Cookie: accessToken=eyJ...

Your backend reads:

req.cookies.accessToken

instead of:

Authorization: Bearer ...

So:

JWT
 +
Cookie

is completely valid.

🟣 21. Session vs JWT

This is the comparison you should know for interviews.

Session	JWT
Server maintains session state	Token carries claims
Client usually holds session ID	Client presents token
Session store required	No session lookup necessarily
Easy server-side revocation	Revocation needs additional design
Often uses cookies	Can use headers or cookies
Good for traditional web apps	Common for APIs/distributed systems
Server can invalidate session immediately	Self-contained token can remain valid until expiry

Important:

JWT doesn't automatically mean "better".

Both are valid architectures.

🟣 22. Session vs JWT Architecture
Session
Browser
   │
   │ sessionId
   ↓
Server
   │
   ↓
Session Store
   │
   ↓
User
JWT
Browser
   │
   │ JWT
   ↓
Server
   │
   ↓
Verify signature
   │
   ↓
Claims / identity
## 🔥 23. Session + Cookie

Very common architecture:

Browser
   │
   │ Cookie: sessionId
   ↓
Express
   │
   ↓
Session Store
   │
   ↓
User

The cookie only needs to identify the session.

## 🔥 24. JWT + Authorization Header

Another common API architecture:

Client
   │
   │ Authorization: Bearer <access-token>
   ↓
Express
   │
   ↓
jwt.verify()
   │
   ↓
req.user
## 🔥 25. JWT + Refresh Token + Cookie

A common modern architecture can look like:

                   LOGIN
                     │
                     ↓
              Verify credentials
                     │
             ┌───────┴───────┐
             ↓               ↓
       Access Token      Refresh Token
             │               │
             │               ↓
             │          HttpOnly Cookie
             │
             ↓
       API requests
             │
             ↓
         expires
             │
             ↓
      /auth/refresh
             │
             ↓
       Refresh Cookie
             │
             ↓
       New Access Token

This is a very important architecture to understand.

## 🔴 26. Refresh Token Rotation

Suppose:

Refresh Token A

is used.

Instead of allowing it forever:

Refresh A
   ↓
Invalidate A
   ↓
Generate Refresh B

Now:

A → invalid
B → valid

Conceptually:

RT-A
 ↓
/refresh
 ↓
RT-B

RT-A ❌
RT-B ✅

This can help detect/reduce refresh-token replay.

## 🔴 27. Refresh Token Theft

Suppose attacker steals:

Refresh Token A

The attacker attempts:

POST /refresh
Refresh Token A

If your system detects reuse of an already-rotated refresh token, it can treat that as suspicious and revoke the relevant token/session family.

This is one reason refresh token management is an advanced authentication topic.

## 🔴 28. Logout — Session vs. JWT
Session

Very easy:

Logout
 ↓
Delete session
 ↓
Clear cookie

Token:

JWT
 ↓
Logout
 ↓
?

A self-contained access token doesn't automatically become invalid just because the client deleted it.

You typically use:

short access-token lifetime
+
refresh-token revocation

and/or other server-side mechanisms depending on requirements.

## 🧠 29. Don't Mix These Concepts

This table is extremely important:

Concept	What it actually is
Session	Server-side authentication state
Cookie	Browser storage/transmission mechanism
JWT	Token format
Access Token	Credential used to access APIs
Refresh Token	Credential used to obtain new access tokens
JWT Access Token	Access token whose format is JWT
JWT Refresh Token	Refresh token whose format is JWT
HttpOnly Cookie	Cookie inaccessible to normal JS

For example:

JWT
 ↓
can be an access token

and:

JWT
 ↓
can potentially be stored in a cookie

Therefore:

JWT ≠ Cookie
JWT ≠ Session
## 🔥 30. Complete Authentication Mindmap
AUTHENTICATION
│
├── SESSION-BASED
│   │
│   ├── Login
│   ├── Create Session
│   ├── Session Store
│   │     ├── Redis
│   │     ├── Database
│   │     └── MongoDB
│   │
│   ├── Session ID
│   │
│   └── Logout
│         ├── Delete Session
│         └── Clear Cookie
│
├── TOKEN-BASED
│   │
│   ├── JWT
│   │   ├── Header
│   │   ├── Payload
│   │   └── Signature
│   │
│   ├── ACCESS TOKEN
│   │   ├── Short-lived
│   │   └── API requests
│   │
│   └── REFRESH TOKEN
│       ├── Long-lived
│       ├── Get new access token
│       ├── Rotation
│       └── Revocation
│
├── COOKIES
│   │
│   ├── HttpOnly
│   ├── Secure
│   ├── SameSite
│   ├── Max-Age
│   └── Domain/Path
│
└── SECURITY
    │
    ├── Password Hashing
    ├── HTTPS
    ├── CSRF
    ├── XSS
    ├── Rate Limiting
    ├── Token Theft
    ├── Token Revocation
    └── Session Management
## ⭐ What I Recommend You Implement Next

Since you've already learned authentication/authorization and you're building a Node + Express backend, don't jump directly into OAuth/MFA.

Implement these in this exact order:

STEP 1
Register
    ↓
bcrypt password hashing

STEP 2
Login
    ↓
JWT access token

STEP 3
Authentication middleware
    ↓
jwt.verify()
    ↓
req.user

STEP 4
Protected routes

STEP 5
RBAC
    ↓
student / recruiter / admin

STEP 6
Ownership authorization
    ↓
job.postedBy === req.user.userId

STEP 7
Cookie-based authentication
    ↓
HttpOnly
    ↓
Secure
    ↓
SameSite

STEP 8
Session-based authentication
    ↓
Understand + implement once

STEP 9
Access + Refresh tokens
    ↓
/login
    ↓
accessToken + refreshToken

STEP 10
Refresh endpoint
    ↓
POST /api/auth/refresh

STEP 11
Refresh token rotation

STEP 12
Logout + token/session revocation

STEP 13
Forgot password

STEP 14
Email verification

STEP 15
MFA

STEP 16
OAuth / OpenID Connect

The key mental model to keep in your head is:

                 HOW DO I KNOW WHO YOU ARE?
                            │
             ┌──────────────┴──────────────┐
             ↓                             ↓
          SESSION                         TOKEN
             │                             │
       Server stores                 JWT / opaque token
       authentication                      │
             │                     ┌────────┴────────┐
             ↓                     ↓                 ↓
          Cookie              Access Token      Refresh Token
                                   │                 │
                              API requests       Get new access
                                   │               token
                                   │                 │
                                   └───────┬─────────┘
                                           ↓
                                    Authorization
                                           ↓
                                  "What can you do?"
                                           ↓
                                Role + Permission
                                           ↓
                                      Ownership

Once this architecture is clear, sessions, cookies, JWT, access tokens and refresh tokens stop feeling like separate confusing topics.
