# Node.js + Express.js

## Task 1 — Express API

### What the Task Required

Create a basic Express.js web server with three endpoints:
- `GET /` -> Returns server status JSON object.
- `GET /about` -> Returns text string (`"This is about page"`).
- `GET /api/status` -> Returns JSON object with HTTP status code `200`.

### Concepts Used

- `express()` application initialization
- `app.get(path, handler)`
- `res.json(data)` vs `res.send(data)`
- `res.status(statusCode)`
- `app.listen(port, callback)`

---

### 1. Express Application Setup & Server Initialization

**What it is:**  
Calling `const app = express()` instantiates an Express application object. Calling `app.listen(port)` starts the underlying Node.js HTTP server.

**Why it was useful in this task:**  
Eliminates manual `http.createServer` conditional routing, providing clean HTTP verb methods (`app.get`, `app.post`).

**Example:**
```javascript
const express = require('express');
const app = express();

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: "running", message: "Server is working" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

### 2. res.json() vs res.send()

**How `res.json()` works:**  
Automatically sets `Content-Type: application/json` and formats JavaScript objects into JSON response strings.

**How `res.send()` works:**  
Dynamically sets `Content-Type` based on argument type (sets `text/html` for strings, `application/json` for objects/arrays).

---

### Important Things I Learned

- Express simplifies server creation compared to core `http.createServer()`.
- Method chaining like `res.status(200).json(data)` sets status code and response payload in a single expression.

---

## Task 2 — Books API

### What the Task Required

Rebuild the Books API using Express with dynamic route parameters:
- `GET /api/books`: Returns array of all book objects.
- `GET /api/books/:id`: Returns single book matching `:id` parameter (`200 OK`) or returns `404 Not Found` if missing.

### Concepts Used

- Route parameters (`req.params.id`)
- Type casting (`parseInt(req.params.id)`)
- `Array.prototype.find()`
- 404 response handling with `return res.status(404).json(...)`

---

### 1. Route Parameters (`req.params`)

**How it works:**  
Route path parameters defined with a colon (e.g. `:id`) are captured by Express and stored as strings in `req.params`.

**Code Structure:**
```javascript
app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id); // Convert string '2' to number 2
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    res.send(book);
});
```

---

### Important Things I Learned

- `req.params` keys match the exact name after the colon (`:id` -> `req.params.id`).
- Route parameter values are always strings and must be parsed (`parseInt` or `Number`) when comparing against numeric database IDs.
- Returning early (`return res.status(...)`) prevents subsequent code execution.

---

## Task 3 — Product API + Query Parameters

### What the Task Required

Build `GET /api/products` supporting multiple concurrent query parameters:
- Category filtering: `?category=electronics`
- Price filtering: `?minPrice=1000&maxPrice=5000`
- Combined multi-parameter filter: `?category=electronics&minPrice=1000&maxPrice=5000`

### Concepts Used

- `req.query` string dictionary
- Cascading `Array.prototype.filter()` operations
- Handling optional URL parameters

---

### 1. Query Parameters (`req.query`)

**How it works:**  
URL query string parameters (following `?` and separated by `&`) are automatically parsed by Express into a key-value object `req.query`.

**Code Structure:**
```javascript
app.get('/api/products', (req, res) => {
    const { category, minPrice, maxPrice } = req.query;
    let filteredData = products;

    if (category) {
        filteredData = filteredData.filter(p => p.category === category);
    }
    if (minPrice) {
        filteredData = filteredData.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
        filteredData = filteredData.filter(p => p.price <= Number(maxPrice));
    }

    res.send(filteredData);
});
```

---

### Difference Between Route Params and Query Params

| Feature | Route Parameters (`req.params`) | Query Parameters (`req.query`) |
|---|---|---|
| **Syntax** | `/api/products/:id` | `/api/products?category=electronics` |
| **Purpose** | Identify a specific required resource | Filter, sort, or paginate collections |
| **Optionality** | Required in path matching | Optional parameters |

---

## Task 4 — Middleware Logger

### What the Task Required

Create a custom application-level logger middleware using `app.use((req, res, next) => ...)` that prints HTTP method, requested URL path, and timestamp for every request before calling `next()`.

### Concepts Used

- Application-level middleware (`app.use()`)
- Middleware signature `(req, res, next)`
- Passing control with `next()`

---

### 1. Custom Application Middleware & next()

**How it works:**  
Middleware functions execute sequentially in the order registered via `app.use()`. Calling `next()` passes execution to the next middleware or route handler.

**Code Structure:**
```javascript
app.use((req, res, next) => {
    const date = new Date();
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Time:", date.toLocaleTimeString());

    next(); // Pass control to next middleware/route
});
```

---

### Important Things I Learned

- Middleware MUST call `next()` unless it finishes the request with a response (`res.send()` / `res.json()`). Omitting both causes requests to hang indefinitely.

---

## Task 5 — API Key Authentication Middleware

### What the Task Required

Protect `GET /api/profile` using path-specific authentication middleware that inspects the request header (`x-api-key`). If missing or invalid, reject with `401 Unauthorized`; if valid, invoke `next()`.

### Concepts Used

- Path-restricted middleware (`app.use('/api/profile', middleware)`)
- Inspecting headers via `req.headers`
- Short-circuiting unauthorized requests with status `401`

---

### 1. Authentication Middleware Flow

```javascript
app.use('/api/profile', (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== "12345") {
        return res.status(401).json({ error: "Unauthorized" }); // Short-circuit
    }

    next(); // Authorized -> proceed to route
});

app.get('/api/profile', (req, res) => {
    res.send("Authorized Profile Data");
});
```

---

### How the Concepts Work Together

1. Request hits `/api/profile`.
2. Path middleware executes and checks `req.headers['x-api-key']`.
3. If key is missing/incorrect: Sends `401 Unauthorized` and `return` halts flow.
4. If key is valid: `next()` passes control to `app.get('/api/profile')`.

---

## Task 6 — POST Users API

### What the Task Required

Build `POST /api/users` to handle incoming JSON payloads:
1. Configure `app.use(express.json())` middleware.
2. Validate required body properties (`name`, `email`, `age`).
3. Return `400 Bad Request` if invalid or if email exists.
4. Return `201 Created` with newly created user object.

### Concepts Used

- Built-in body parser `express.json()`
- Request body access via `req.body`
- Payload validation & duplicate email checks
- `201 Created` HTTP status code

---

### 1. Built-in Body Parsing (`express.json()`)

**Why it is required:**  
By default, Express does not parse raw JSON request bodies. `app.use(express.json())` parses incoming JSON payloads and attaches the resulting object to `req.body`.

**Code Structure:**
```javascript
app.use(express.json());

app.post('/api/users', (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || age === undefined) {
        return res.status(400).json({ error: "Name, email and age are required" });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "User with this email already exists" });
    }

    const newUser = { name, email, age };
    users.push(newUser);

    res.status(201).json({ message: "User created successfully", user: newUser });
});
```

---

## Task 7 — Complete CRUD API

### What the Task Required

Build a full in-memory Users REST API implementing all primary HTTP verbs:
- `GET /api/users` (Read All)
- `POST /api/users` (Create)
- `GET /api/users/:id` (Read One)
- `PATCH /api/users/:id` (Update Partial)
- `DELETE /api/users/:id` (Delete)

### Concepts Used

- REST API design principles
- `app.get()`, `app.post()`, `app.patch()`, `app.delete()`
- Array operations (`find`, `findIndex`, `splice`, `forEach`)
- HTTP Status Codes (`200`, `201`, `400`, `404`)

---

### 1. REST Operations Implementation Summary

```javascript
// GET ALL
app.get('/api/users', (req, res) => {
    if (users.length === 0) return res.status(404).json({ error: "No user found" });
    res.json({ users });
});

// GET ONE
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
});

// PATCH (Update)
app.patch('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const user = users.find(u => u.id === id);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;

    res.json({ message: "User updated successfully", user });
});

// DELETE
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return res.status(404).json({ error: "User not found" });
    const [deletedUser] = users.splice(index, 1);

    res.json({ message: "User deleted successfully", deletedUser });
});
```

---

## Task 8 — Router Architecture

### What the Task Required

Refactor monolith single-file routes into a modular project structure using `express.Router()`:
- `routes/user.routes.js` & `routes/product.routes.js`
- `controllers/users.controllers.js` & `controllers/product.controller.js`
- `middlewares/logger.middleware.js`

### Concepts Used

- `express.Router()`
- Router mounting via `app.use('/api/users', userRouter)`
- Controller-Service-Route separation pattern
- ES Module / CommonJS exports

---

### 1. Modular Express Router Setup

**`routes/user.routes.js`**:
```javascript
import express from 'express';
import { getAllUsers, getUserById } from '../controllers/users.controllers.js';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;
```

**`app.js` (Mounting Routers)**:
```javascript
import express from 'express';
import userRouter from './routes/user.routes.js';

const app = express();
app.use(express.json());

// Router mounting combines base path '/api/users' with router paths ('/' -> '/api/users')
app.use('/api/users', userRouter);
```

---

## Task 9 — Error Handling & 404 Handling

### What the Task Required

Implement centralized error handling and Not Found route handling using middleware:
- Global 404 handler for unmatched endpoints
- Centralized Error Handler middleware accepting 4 parameters `(err, req, res, next)`

### Concepts Used

- `next(error)` error forwarding
- 4-argument error-handling middleware `(err, req, res, next)`
- Unmatched route 404 middleware

---

### 1. Centralized Error Middleware Signature

**Crucial Signature Rule:**  
Express error-handling middleware MUST accept **four parameters**: `(err, req, res, next)`. Omitting `next` makes Express treat it as standard middleware instead of an error handler.

**Code Structure:**
```javascript
// Error-handling middleware (Registered AFTER all routes):
export const errorHandler = (err, req, res, next) => {
    console.error("Centralized Error:", err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};
```

---

## Task 10 — Mini Backend (Job API)

### What the Task Required

Build a production-grade Job API combining all core Express concepts:
- **Modular Structure**: `app.js`, `routes/job.routes.js`, `controllers/job.controller.js`, `middlewares/`
- **CRUD Endpoints**: `POST /api/jobs`, `GET /api/jobs`, `GET /api/jobs/:id`, `PATCH /api/jobs/:id`, `DELETE /api/jobs/:id`
- **Advanced Query Filtering**: `GET /api/jobs?location=Delhi&minSalary=40000&skills=Node.js`
- **Middleware Chain**: `express.json()` -> `auth` -> `logger` -> `jobRouter` -> `404 Handler` -> `errorHandler`
- **Validation & Error Delegation**: Instantiating `new Error()`, setting `error.statusCode`, and delegating via `next(error)`.

### Concepts Used

- Enterprise Express Architecture
- Custom `Error` instantiation & status code assignment
- `next(error)` error propagation
- Multi-query filter operations
- Catch-all 404 & Centralized Error Middleware pipeline

---

### 1. Job Controller Implementation Analysis

```javascript
export const getAllJobs = (req, res, next) => {
    const { location, minSalary, skills } = req.query;
    let filteredJob = jobs;

    if (location !== undefined) {
        filteredJob = filteredJob.filter(j => j.location === location);
    }
    if (minSalary !== undefined) {
        filteredJob = filteredJob.filter(j => j.salary >= Number(minSalary));
    }
    if (skills !== undefined) {
        filteredJob = filteredJob.filter(j => j.skills.includes(skills));
    }

    if (jobs.length === 0) {
        const error = new Error("No jobs available");
        error.statusCode = 404;
        return next(error); // Passes error to Centralized Error Middleware
    }

    res.json({ filteredJob });
};
```

---

### 2. Complete Application Middleware Order (`Task10/app.js`)

```javascript
import express from 'express';
import jobRouter from './routes/job.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { auth } from './middlewares/auth.middleware.js';
import { logger } from './middlewares/logger.middleware.js';

const app = express();

// 1. Built-in body parser
app.use(express.json());

// 2. Application-level custom middlewares
app.use(auth);
app.use(logger);

// 3. Router mounting
app.use('/api/jobs', jobRouter);

// 4. Catch-all 404 Handler (for unmatched routes)
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
});

// 5. Centralized Error Handler (MUST BE LAST)
app.use(errorHandler);

app.listen(3000, () => console.log("Job API Server running on port 3000"));
```

---

# Express Fundamentals

Express.js is a minimalist, flexible Node.js web application framework providing robust routing and middleware infrastructure.

```
+-------------------------------------------------------------------+
|                        Express Application (app)                  |
|                                                                   |
|  Middleware Stack (Execution Order):                              |
|  1. express.json()          (Parses JSON body)                    |
|  2. logger                  (Logs request method & URL)           |
|  3. auth                    (Validates API Key header)            |
|  4. Router (/api/jobs)      (Executes route controller logic)     |
|  5. 404 Handler             (Catches unmatched routes)            |
|  6. Error Handler           (Processes next(err) exceptions)      |
+-------------------------------------------------------------------+
```

---

# Routing

Express routes map incoming HTTP method verbs and URL paths to specific controller handler functions:

```javascript
app.METHOD(PATH, HANDLER);
```

- **`app.get()`**: Retrieve resource data.
- **`app.post()`**: Create a new resource.
- **`app.patch()`**: Update partial fields of an existing resource.
- **`app.put()`**: Replace an entire existing resource.
- **`app.delete()`**: Remove a resource.

---

# Request Object

The `req` object represents the incoming HTTP request:

| Property | Description | Example Usage |
|---|---|---|
| `req.params` | Object containing route path parameters | `req.params.id` from `/api/jobs/:id` |
| `req.query` | Object containing URL query string parameters | `req.query.minSalary` from `?minSalary=40000` |
| `req.body` | Object containing parsed request body payload | `req.body.title` from JSON `POST` payload |
| `req.headers` | Dictionary of incoming request HTTP headers | `req.headers['x-api-key']` |
| `req.method` | String containing HTTP verb (`GET`, `POST`) | `'GET'` |
| `req.url` | String containing requested URL path | `'/api/jobs'` |

---

# Response Object

The `res` object constructs and sends the outgoing HTTP response:

| Method | Purpose | Example |
|---|---|---|
| `res.status(code)` | Sets the HTTP response status code | `res.status(404)` |
| `res.json(body)` | Sends a JSON response with correct `Content-Type` | `res.json({ success: true })` |
| `res.send(body)` | Sends text, HTML, or JSON response | `res.send("Hello")` |
| `res.setHeader(name, val)`| Sets a single response header | `res.setHeader("X-App", "Express")` |

---

# HTTP Status Codes

| Code | Status | Usage |
|---|---|---|
| **200** | OK | Standard successful response for `GET`, `PATCH`, `DELETE` |
| **201** | Created | Resource successfully created via `POST` |
| **400** | Bad Request | Client payload validation error (missing/invalid fields) |
| **401** | Unauthorized | Missing or invalid API Key / Authentication credentials |
| **403** | Forbidden | Client authenticated but lacks required permission |
| **404** | Not Found | Requested endpoint route or resource ID does not exist |
| **500** | Internal Error | Unhandled server exception caught by error middleware |

---

# Middleware & next()

Middleware functions sit in the request-response cycle and receive `(req, res, next)`.

### Middleware Execution Rules:
1. Middleware executes in **exact registration order** (`app.use()`).
2. Middleware MUST either:
   - Call `next()` to pass control to the next middleware/route handler, OR
   - Complete the request by sending a response (`res.json()`, `res.send()`).
3. Calling `next(error)` bypasses all remaining normal middleware/routes and jumps directly to the nearest **Error-Handling Middleware**.

---

# Express Router

`express.Router()` creates isolated, modular route handlers that can be mounted into the main application.

```javascript
// routes/job.routes.js
import express from 'express';
const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);

export default router;

// app.js
app.use('/api/jobs', router); // Final route: GET /api/jobs/:id
```

---

# Error Handling & 404 Handling

```
Incoming Request
       │
       ▼
+---------------------+
|  Normal Middleware  |
+---------------------+
       │
       ├─────────────────────────────────┐
       │ (Success)                       │ (Error occurred: next(err))
       ▼                                 ▼
+---------------------+        +--------------------+
|    Route Handler    |        |   Error Handler    |
+---------------------+        | (err,req,res,next) |
       │                       +--------------------+
       ├─────────────────────────────────^
       │ (No Route Matched)              │
       ▼                                 │
+---------------------+                  │
|     404 Handler     | ─────────────────┘
| (res.status(404))   |
+---------------------+
```

- **404 Not Found Handler**: Registered after all valid routes to capture unmatched paths.
- **Centralized Error Handler**: Four-argument middleware `(err, req, res, next)` registered at the very end of `app.js`.

---

# Project Structure

A clean, production-ready Express architecture separates concerns into logical layers:

```text
project/
├── controllers/            # Request processing & business logic
│   └── job.controller.js
├── middlewares/            # Auth, logging, error handling
│   ├── auth.middleware.js
│   ├── logger.middleware.js
│   └── errorHandler.middleware.js
├── routes/                 # Route definitions & router mounting
│   └── job.routes.js
├── app.js                  # App configuration & middleware chain
└── package.json
```

---

# Common Mistakes

1. **Forgetting `express.json()`**: Trying to access `req.body` without registering `app.use(express.json())` yields `undefined`.
2. **Missing `return` on Early Exit**: Calling `res.status(400).json(...)` without `return` allows handler code below to execute, leading to `"Headers already sent"` errors.
3. **Wrong Error Handler Signature**: Declaring error middleware with 3 parameters `(err, req, res)` instead of 4 `(err, req, res, next)` causes Express to ignore it as an error handler.
4. **Incorrect Middleware Registration Order**: Registering body parsers or auth middleware AFTER routes prevents them from running on incoming requests.
5. **Route Parameter Type Mismatch**: Comparing string `req.params.id` directly with numeric IDs (`"1" === 1`) without using `Number()` or `parseInt()`.

---

# Overall Concepts Learned

- Setting up Express applications and starting servers via `app.listen()`.
- Building REST APIs with `GET`, `POST`, `PATCH`, `DELETE` methods.
- Extracting input from `req.params`, `req.query`, and `req.body`.
- Using `express.json()` for payload parsing.
- Creating custom application-level and route-level middleware using `next()`.
- Modularizing code with `express.Router()` and Controller files.
- Implementing catch-all 404 handlers and 4-parameter `(err, req, res, next)` centralized error handlers.

---

# Quick Revision

### Key Express Snippets

#### 1. Basic Server & Body Parser Setup
```javascript
import express from 'express';
const app = express();

app.use(express.json());
app.listen(3000);
```

#### 2. Query & Route Parameter Extraction
```javascript
app.get('/api/items/:id', (req, res) => {
    const id = Number(req.params.id);
    const { category } = req.query;
    res.json({ id, category });
});
```

#### 3. Custom Middleware Pattern
```javascript
const auth = (req, res, next) => {
    if (req.headers['x-api-key'] !== '12345') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
```

#### 4. Modular Router Pattern
```javascript
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json([]));
export default router;
```

#### 5. Centralized Error Middleware Signature
```javascript
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});
```

---

# What I Can Do After These Tasks

1. **Create Express Web Servers**: Initialize Express apps and start server listeners.
2. **Build RESTful APIs**: Implement complete CRUD operations (`GET`, `POST`, `PATCH`, `DELETE`).
3. **Parse & Validate Request Data**: Extract data from `req.params`, `req.query`, and `req.body`.
4. **Develop Custom Middleware**: Write logging, authentication, and validation middleware.
5. **Architect Modular Applications**: Separate projects into `routes/`, `controllers/`, and `middlewares/`.
6. **Implement Robust Error Handling**: Handle 404 unmatched routes and build centralized 4-parameter error handlers.

---

# Real-World Connection

- **Production REST APIs**: Building backend microservices for mobile and web clients.
- **Middleware Pipelines**: Enforcing JWT authentication, rate limiting, and request logging.
- **Enterprise MVC/Modular Architecture**: Maintaining clean code separation across large developer teams.

---

# Connection to Previous Node.js Concepts

```
Raw Node.js HTTP Module (Module 02)
       ↓
Express.js Framework & Middleware (Module 06)
       ↓
Database Integration (MongoDB / Mongoose - Module 07)
       ↓
Authentication & File Uploads (Modules 09 & 10)
```
