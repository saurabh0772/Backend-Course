# Express.js Notes

## 1. What Is Express?

Express.js is a lightweight web framework for Node.js used to build web servers and APIs.

With the native `http` module, you were doing things like:

```js
if (req.url === "/api/books") {
  // ...
}
```

Express gives you cleaner routing:

```js
app.get("/api/books", (req, res) => {
  res.json(books);
});
```

```text
Node.js HTTP                    Express
     ↓                            ↓
Manual routing                  Routing
Manual request handling         Middleware
Manual response handling        Request handling
                                 Response helpers
                                 Error handling
```

## 2. Basic Express Server

Install Express:

```bash
npm install express
```

Basic server:

```js
const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

Here, `const app = express()` creates your Express application.

## 3. Routes

The basic route methods are:

- `app.get()`
- `app.post()`
- `app.put()`
- `app.patch()`
- `app.delete()`

Example:

```js
app.get("/", (req, res) => {
  res.send("Home Page");
});
```

The structure is:

```js
app.METHOD(PATH, HANDLER);
```

For example, `app.get("/users", handler)` means: when a `GET` request comes to `/users`, execute this handler.

## 4. `req` and `res`

You already know these from the HTTP module.

### Request: `req`

`req` contains information about the incoming request.

Common properties:

- `req.method`
- `req.url`
- `req.params`
- `req.query`
- `req.body`
- `req.headers`

### Response: `res`

`res` is used to send the response.

Common methods:

- `res.send()`
- `res.json()`
- `res.status()`
- `res.end()`
- `res.redirect()`

## 5. `res.send()`

Send text:

```js
res.send("Hello World");
```

Send HTML:

```js
res.send("<h1>Hello</h1>");
```

Express automatically handles many response details for you.

## 6. `res.json()`

For APIs, you will frequently use:

```js
res.json({
  name: "Saurabh",
  role: "Backend Developer",
});
```

Instead of manually doing:

```js
res.end(JSON.stringify(data));
```

Express handles JSON conversion and the appropriate response headers.

## 7. Status Codes

Set a status code using:

```js
res.status(200).send("Success");
```

or:

```js
res.status(404).json({
  error: "User not found",
});
```

Common codes:

- `200` — OK
- `201` — Created
- `400` — Bad Request
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found
- `500` — Internal Server Error

A common API pattern is:

```js
res.status(201).json(newUser);
```

## 8. Route Parameters

Suppose the request is `GET /users/25`.

You can define:

```js
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);
});
```

For `/users/25`, `req.params.id` is `"25"`.

### Multiple Parameters

```js
app.get("/users/:userId/orders/:orderId", (req, res) => {
  console.log(req.params.userId);
  console.log(req.params.orderId);
});
```

The request `/users/10/orders/500` gives:

```text
userId → 10
orderId → 500
```

## 9. Query Parameters

For `/products?category=books&sort=price`, use `req.query`.

```js
app.get("/products", (req, res) => {
  console.log(req.query.category);
  console.log(req.query.sort);
});
```

You get:

```text
category → books
sort → price
```

### Difference

| Type | Example | Access |
| --- | --- | --- |
| Route parameter | `/products/10` | `req.params.id` |
| Query parameter | `/products?id=10` | `req.query.id` |

## 10. Middleware

This is one of the most important Express concepts. Middleware is a function that runs during the request-response cycle.

Basic structure:

```js
app.use((req, res, next) => {
  console.log("Middleware executed");
  next();
});
```

```text
Request
   ↓
Middleware
   ↓
next()
   ↓
Route
   ↓
Response
```

## 11. Why `next()`?

```js
app.use((req, res, next) => {
  console.log("Request received");
  next();
});
```

`next()` tells Express: “I'm finished. Continue to the next middleware or route.”

If you do not call `next()` and do not send a response, the request can remain hanging:

```js
app.use((req, res, next) => {
  console.log("Hello");
});
```

## 12. Multiple Middleware

You can have:

```text
Request
   ↓
Logger
   ↓
Authentication
   ↓
Validation
   ↓
Controller
   ↓
Response
```

Example:

```js
app.use(logger);
app.use(auth);
app.get("/profile", getProfile);
```

This is one reason Express is useful for backend development.

## 13. Built-In JSON Middleware

```js
app.use(express.json());
```

This allows Express to parse incoming JSON request bodies. Suppose the client sends:

```json
{
  "name": "Saurabh",
  "age": 21
}
```

Then:

```js
app.post("/users", (req, res) => {
  console.log(req.body);
});
```

Without `app.use(express.json())`, `req.body` may not contain the parsed JSON object you expect.

## 14. Request Body

For `POST /users` with:

```json
{
  "name": "Saurabh",
  "email": "saurabh@example.com"
}
```

you access `req.body.name` and `req.body.email`.

```text
/users/10              → params
/users?id=10           → query
POST body               → body
```

## 15. Router

As your application grows, you do not want everything in `server.js`.

```text
routes/
    userRoutes.js
    productRoutes.js
    orderRoutes.js
```

Create a router:

```js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "All users",
  });
});

router.get("/:id", (req, res) => {
  res.json({
    id: req.params.id,
  });
});

module.exports = router;
```

Then use it in your app:

```js
const userRoutes = require("./routes/userRoutes");

app.use("/users", userRoutes);
```
