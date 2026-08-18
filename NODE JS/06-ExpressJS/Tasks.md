# Express Practice Tasks

These tasks skip extremely basic exercises because you have already built HTTP servers manually.

## 🟢 Task 1 — Express API

Build a simple API with:

- `GET /`
- `GET /about`
- `GET /api/status`

Return JSON from the API routes. Example:

```json
{
  "status": "running",
  "message": "Server is working"
}
```

### Practice

- `express()`
- `app.get()`
- `res.json()`
- `res.status()`
- `app.listen()`

## 🟢 Task 2 — Books API

Rebuild your previous Node.js HTTP Books API using Express.

Use:

```js
const books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
  },
  {
    id: 3,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
  },
];
```

Create:

- `GET /api/books`
- `GET /api/books/:id`

### Requirements

- `GET /api/books` returns all books.
- `GET /api/books/2` returns book 2.
- `GET /api/books/999` returns the following with status `404`:

```json
{
  "error": "Book not found"
}
```

### Goal

Notice how much simpler this is compared with your Node `http` version.

## 🟡 Task 3 — Product API + Query Parameters

Create `GET /api/products`.

Support:

```text
/api/products?category=electronics
/api/products?category=books
/api/products?minPrice=1000&maxPrice=5000
```

### Challenge

Support multiple query parameters together:

```text
/api/products?category=electronics&minPrice=1000&maxPrice=5000
```

### Practice

- `req.query`

## 🟡 Task 4 — Middleware Logger

Create a custom logger middleware. For every request, print:

```text
Method: GET
URL: /api/books
Time: 12:30:10
```

The middleware must run before your routes. Test it with several endpoints.

### Challenge

Create another middleware that adds a custom header:

```text
X-Powered-By: My-Express-App
```

Hint: `res.setHeader()`.

## 🟡 Task 5 — API Key Authentication Middleware

Create `GET /api/profile`.

The request must contain:

```text
x-api-key: 12345
```

Create middleware with this flow:

```text
Request
   ↓
API Key Middleware
   ↓
Correct?
 ┌──────┴──────┐
Yes            No
 ↓              ↓
Route          401
```

Correct key: `12345`.

For a wrong or missing key, return:

```json
{
  "error": "Unauthorized"
}
```

with status `401`.

### Goal

Understand middleware deeply.

## 🔥 Task 6 — POST Users API

Create `POST /api/users`.

The client sends:

```json
{
  "name": "Saurabh",
  "email": "saurabh@example.com",
  "age": 21
}
```

Use:

```js
app.use(express.json());
```

Validate that `name`, `email`, and `age` exist.

- If valid, return `201 Created` and the newly created user.
- If invalid, return `400 Bad Request` and an appropriate error.

Store users temporarily in an array.

## 🔥 Task 7 — Complete CRUD API

Build a complete in-memory Users API:

```text
POST   /api/users
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Implement:

| Operation | Endpoint |
| --- | --- |
| Create | `POST /api/users` |
| Read all | `GET /api/users` |
| Read one | `GET /api/users/:id` |
| Update | `PATCH /api/users/:id` |
| Delete | `DELETE /api/users/:id` |

Handle status codes `200`, `201`, `400`, and `404` appropriately.

This is an important task.

## 🔴 Task 8 — Router Architecture

Stop putting everything in one file. Create this structure:

```text
project/
│
├── server.js
│
├── routes/
│   ├── userRoutes.js
│   └── productRoutes.js
│
├── controllers/
│   ├── userController.js
│   └── productController.js
│
└── middleware/
    └── logger.js
```

Your flow should be:

```text
Request
   ↓
server.js
   ↓
Router
   ↓
Controller
   ↓
Response
```

Implement:

- `/api/users`
- `/api/users/:id`
- `/api/products`
- `/api/products/:id`

### Goal

Learn how real Express projects are structured.

## 🔴 Task 9 — Error Handling

Add centralized error handling.

Your routes should be able to do:

```js
next(new Error("Something went wrong"));
```

One global middleware should handle it:

```js
app.use((err, req, res, next) => {
  // ...
});
```

Return:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

with status `500`.

Also create a proper `404` handler for routes that do not exist.

## 🔥 Final Task — Mini Backend

Build a Job API that combines everything you have learned.

### Endpoints

```text
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
```

A job:

```json
{
  "title": "Backend Developer",
  "company": "ABC Technologies",
  "location": "Delhi",
  "salary": 60000,
  "skills": ["Node.js", "Express", "MongoDB"]
}
```

### Add Query Filtering

```text
GET /api/jobs?location=Delhi
GET /api/jobs?minSalary=40000
GET /api/jobs?skill=Node.js
```

### Add Middleware

```text
Logger
   ↓
API Key Authentication
   ↓
Router
   ↓
Controller
```

### Add Validation

Reject a job if:

- `title` is missing.
- `company` is missing.
- `salary` is invalid.
- `skills` is missing.

### Add Proper Error Handling

Handle `400`, `401`, `404`, and `500`.

### Organize the Project

```text
job-api/
│
├── server.js
│
├── routes/
│   └── jobRoutes.js
│
├── controllers/
│   └── jobController.js
│
└── middleware/
    ├── logger.js
    ├── auth.js
    └── errorHandler.js
```
