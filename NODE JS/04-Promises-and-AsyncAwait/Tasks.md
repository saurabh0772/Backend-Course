# Promises and Async/Await Practice Tasks

## 🟢 Task 1 — Create Your Own Promise

Create a function:

```js
checkNumber(number)
```

It should return a Promise.

### Rules

- If the number is greater than or equal to `18`, resolve with `"Eligible"`.
- Otherwise, reject with `"Not eligible"`.

Then consume the Promise using:

```js
.then()
.catch()
```

Test it with:

```js
checkNumber(20);
checkNumber(15);
```

### Goal

Understand:

```js
new Promise()
resolve()
reject()
.then()
.catch()
```

## 🟢 Task 2 — Promise-Based File Reader

You already used `fs.readFile()` with callbacks. Now create the same functionality using `fs.promises`.

Read:

```text
data/user.txt
data/skills.txt
data/projects.txt
```

Your goal:

```text
Read user.txt
    ↓
Read skills.txt
    ↓
Read projects.txt
    ↓
Print "All files processed"
```

Use:

```js
.then()
.catch()
```

Don't use callbacks.

### Goal

See the difference between:

```text
fs.readFile()          callback style
fs.promises.readFile() Promise style
```

## 🟡 Task 3 — Convert Your Callback Hell to Promises

Take your previous flow:

```text
getUser()
  ↓
getOrders()
  ↓
getOrder()
  ↓
getProduct()
  ↓
getReviews()
```

Convert all five functions to return Promises instead of accepting callbacks.

Instead of:

```js
getUser(1, (userId) => {
  // ...
});
```

You should eventually have something like:

```js
getUser(1)
  .then(...)
```

### Requirements

Each function should:

- Use `setTimeout()` to simulate asynchronous work.
- Use `resolve()` and `reject()` inside its Promise.
- Handle errors using `.catch()`.

### Goal

Take your callback hell code and remove the callback hell.

## 🟡 Task 4 — Same Problem Using `async`/`await`

Take your Task 3 solution and rewrite it using:

```js
async
await
try
catch
```

The flow should become approximately:

```text
getUser()
   ↓
await
getOrders()
   ↓
await
getOrder()
   ↓
await
getProduct()
   ↓
await
getReviews()
```

Your code should look much more like normal sequential code.

### Goal

Understand why developers prefer `async`/`await` for complex asynchronous flows.

## 🔴 Task 5 — Parallel Operations

Suppose you need:

- User data
- Product data
- Reviews

None of them depends on the others.

Don't do:

```js
await getUser();
await getProduct();
await getReviews();
```

That makes them run sequentially.

Instead, learn and use:

```js
Promise.all()
```

Create three Promise-based functions:

```js
getUser();
getProducts();
getReviews();
```

Each should take two seconds using `setTimeout()`.

Run them together and measure approximately how long the complete operation takes.

### Goal

Understand the difference between:

```text
Sequential:
A → wait → B → wait → C
```

```text
Parallel:
A ────────┐
B ────────┼──→ All complete
C ────────┘
```

This is very important in real backend applications.

## 🔥 Task 6 — Error Handling Challenge

Create these functions:

```js
getUser();
getOrders();
getPayment();
getProduct();
```

Each returns a Promise. Make one of them intentionally reject.

Then create an `async` function that:

- Calls them in sequence.
- Uses `try`/`catch`.
- Stops the process when one operation fails.
- Prints a useful error message.

### Example

```text
Getting user...
User found.

Getting orders...
Orders found.

Getting payment...
Payment failed!

Error: Unable to process payment.
```

### Goal

Practice real-world asynchronous error handling.
