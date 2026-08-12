# 🟢 Mini Task — Response Types

## Goal

Practice:

- `http.createServer()`
- `req.url`
- `res.writeHead()`
- HTTP status codes
- `Content-Type`
- `res.end()`

## Routes

Your server should have these routes:

### 1. `/text`

Return:

```text
Hello, this is plain text.
```

Response:

- Status: `200`
- Content-Type: `text/plain`

### 2. `/html`

Return:

```html
<h1>Hello from Node.js</h1>
```

Response:

- Status: `200`
- Content-Type: `text/html`

The browser should render the heading, not display the `<h1>` tags.

### 3. `/json`

Return:

```json
{
  "name": "Saurabh",
  "role": "Backend Developer"
}
```

Response:

- Status: `200`
- Content-Type: `application/json`

Remember that the response body must be valid JSON.

### 4. Unknown routes

For example:

```text
/hello
/random
/test
```

Return:

```text
Page Not Found
```

Response:

- Status: `404`
- Content-Type: `text/plain`

# 🟢 Task 1 — Basic Multi-Page Server

## Goal

Create a server with multiple routes.

## Routes

| Route | Response |
| --- | --- |
| `/` | Welcome to My Server |
| `/about` | This is the About Page |
| `/contact` | Contact us at example@email.com |
| `/projects` | My Projects |
| `/skills` | JavaScript, Node.js, C++, React |

For every valid route:

- Status: `200`
- Content-Type: `text/plain`

For every unknown route:

- Status: `404`
- Content-Type: `text/plain`

## Example

Request:

```http
GET http://localhost:3000/about
```

Response:

```text
This is the About Page
```

## Concepts to practice

- `http.createServer()`
- `req.url`
- `res.writeHead()`
- `res.end()`
- `200`
- `404`
- `Content-Type`

# 🟢 Task 2 — Student Profile Server

## Goal

Create a server that provides different student information based on the URL.

## Routes

```text
/student
/student/name
/student/skills
/student/projects
/student/education
```

## Expected responses

| Route | Response |
| --- | --- |
| `/student` | Student Profile |
| `/student/name` | Your Name |
| `/student/skills` | C++, JavaScript, Node.js, React |
| `/student/projects` | Job Portal, File Organizer, etc. |
| `/student/education` | B.Tech Computer Science |

For example, `GET /student/skills` should return:

```text
Skills:
C++
JavaScript
Node.js
React
```

## Unknown route

`/student/hello` should return:

```text
404
Student page not found
```

## Goal

Become comfortable with `req.url` and manual routing.

# 🟡 Task 3 — HTTP Status Code Practice

## Goal

Practice different HTTP status codes.

Create these routes:

| Route | Status code |
| --- | --- |
| `/` | `200` |
| `/about` | `200` |
| `/login` | `401` |
| `/admin` | `403` |
| `/notfound` | `404` |
| `/server` | `500` |

## Expected responses

| Route | Status | Response |
| --- | --- | --- |
| `/` | `200` | Welcome |
| `/about` | `200` | About Page |
| `/login` | `401` | Unauthorized |
| `/admin` | `403` | Forbidden |
| `/notfound` | `404` | Page Not Found |
| `/server` | `500` | Internal Server Error |

Every response should have `Content-Type: text/plain`.

## Goal

Understand that an HTTP response contains:

- Status code
- Headers
- Body

# 🟡 Task 4 — Simple JSON API

## Goal

Create your first basic API using the Node.js HTTP module.

## Routes

```text
/api/user
/api/products
/api/about
```

### `/api/user`

Return:

```json
{
  "name": "Saurabh",
  "age": 21,
  "role": "Student"
}
```

Response headers:

- Status: `200`
- Content-Type: `application/json`

### `/api/products`

Return:

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 50000
  },
  {
    "id": 2,
    "name": "Headphone",
    "price": 2000
  }
]
```

Response headers:

- Status: `200`
- Content-Type: `application/json`

### `/api/about`

Return:

```json
{
  "message": "This is my first Node.js API"
}
```

## Unknown API route

For example, `/api/hello` should return:

```json
{
  "error": "API route not found"
}
```

With:

- Status: `404`
- Content-Type: `application/json`

## Important

Understand why `text/plain` differs from `application/json`.

Also practice `JSON.stringify()`.

# 🔴 Task 5 — Books API

## Goal

Build a small API where the URL contains a book ID.

Use this data:

```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin"
  },
  {
    "id": 2,
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt"
  },
  {
    "id": 3,
    "title": "You Don't Know JS",
    "author": "Kyle Simpson"
  }
]
```

## Routes

```text
/api/books
/api/books/1
/api/books/2
/api/books/3
```

### `GET /api/books`

Return all books.

- Status: `200`
- Content-Type: `application/json`

### `GET /api/books/1`

Return:

```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin"
}
```

### `GET /api/books/2`

Return only book 2.

### `GET /api/books/3`

Return only book 3.

## Invalid book

Request:

```http
GET /api/books/999
```

Return:

```json
{
  "error": "Book not found"
}
```

- Status: `404`

## Challenge

Figure out how to extract `1` from `/api/books/1`.

Don't use a routing library. Use JavaScript string methods and the concepts you already know.

# 🔥 Bonus Task — URL + HTTP Method

Only do this if you have learned `req.method`.

Create a server that checks both the URL and HTTP method.

For example:

```http
GET /api/books
```

should return:

```text
All books
```

while:

```http
POST /api/books
```

should return:

```text
POST request received
```

You don't need to implement actual POST data yet.
