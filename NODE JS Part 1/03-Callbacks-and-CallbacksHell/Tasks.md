# Callback Practice Tasks

## 🟢 Task 1 — Your Own Callback

Create a function:

```js
calculate(a, b, operation, callback)
```

It should perform an operation and then call the callback with the result.

For example:

```js
calculate(10, 5, "add", callback);
calculate(10, 5, "multiply", callback);
calculate(10, 5, "subtract", callback);
```

### Expected Output

```text
15
50
5
```

### Rules

Don't use:

- Promises
- `async`/`await`

Use a callback.

### Goal

Understand:

```text
Function
   ↓
Do some work
   ↓
Call callback
   ↓
Return result
```

## 🟢 Task 2 — Async File Reader

Use the asynchronous version of `fs.readFile()`.

Create:

```text
data/
├── user.txt
├── skills.txt
└── projects.txt
```

Read each file asynchronously and print its content. You should use callbacks.

### Expected Output

```text
User:
Saurabh

Skills:
C++
JavaScript
Node.js

Projects:
Job Portal
File Organizer
```

### Important

Do not use `fs.readFileSync()`.

Use `fs.readFile()`.

This task is important because you're now using a callback in a real Node.js asynchronous operation.

## 🟡 Task 3 — Sequential File Reading

Make the following process happen in this exact order:

```text
Read user.txt
     ↓
Read skills.txt
     ↓
Read projects.txt
     ↓
Print "All files processed"
```

The next file should start reading only after the previous file has finished.

Use callbacks.

Don't use:

- Promises
- `async`/`await`
- `fs.readFileSync()`

### Goal

Understand how callbacks can control the sequence of asynchronous operations.

## 🟡 Task 4 — Create Your First Callback Hell

Create three functions:

```js
getUser();
getOrders();
getOrderDetails();
```

Each function should simulate an asynchronous operation using `setTimeout()`.

For example:

```text
getUser()
   ↓ 1 second
getOrders()
   ↓ 1 second
getOrderDetails()
   ↓ 1 second
```

### Final Result

The functions should use callbacks. The final output should look something like:

```text
Getting user...
User found.

Getting orders...
Orders found.

Getting order details...
Order details found.

Process completed!
```

Your code should naturally become nested. Don't try to avoid the nesting.

The purpose of this task is to experience callback hell yourself.

## 🔴 Task 5 — Realistic Callback Hell Challenge

Build a fake backend flow:

```text
User ID
   ↓
Get User
   ↓
Get User's Orders
   ↓
Get First Order
   ↓
Get Product
   ↓
Get Product Reviews
   ↓
Final Result
```

Create these functions:

```js
getUser();
getOrders();
getOrder();
getProduct();
getReviews();
```

Each should be asynchronous using `setTimeout()` and callbacks.

For example:

```js
getUser(1, callback);
getOrders(userId, callback);
getOrder(orderId, callback);
getProduct(productId, callback);
getReviews(productId, callback);
```

### Final Result

```text
User: Saurabh

Order: #101

Product: Node.js Course

Reviews:
- Very useful course
- Good explanations
- Great for beginners
```

### Important

Do not use Promises or `async`/`await` for this task.

The goal is to create something that looks like:

```text
getUser(...)
    ↓
    getOrders(...)
        ↓
        getOrder(...)
            ↓
            getProduct(...)
                ↓
                getReviews(...)
```

After you build it, you'll understand exactly why callback hell becomes a problem.

## 🔥 Bonus — Escape Callback Hell

Only after completing Task 5, look at your own code and ask:

> How can I make this easier to read?

Don't solve it yet. This is where we'll later introduce:

```text
Callbacks
    ↓
Promises
    ↓
async/await
```

You'll be able to see why Promises were introduced instead of just memorizing their syntax.
