# Promises and Async/Await

## 1. What Is a Promise?

A Promise is an object that represents the eventual result of an asynchronous operation.

Think of it as:

> I don't have the result right now, but I promise I'll give you either the result or an error later.

A Promise has three states:

```text
Pending
   ↓
 ┌───────────────┐
 ↓               ↓
Fulfilled      Rejected
```

### Pending

The operation is still running.

```text
Getting data...
```

### Fulfilled

The operation completed successfully.

```text
Data received
```

### Rejected

The operation failed.

```text
Something went wrong
```

## 2. Creating a Promise

A simple Promise looks like:

```js
const promise = new Promise((resolve, reject) => {
  // Do something.
  resolve("Success");
});
```

There are two important functions:

- `resolve()`
- `reject()`

### `resolve()`

Means the operation succeeded.

```js
resolve("Data received");
```

### `reject()`

Means the operation failed.

```js
reject("Something went wrong");
```

## 3. How Do We Get the Result?

We use:

- `.then()`
- `.catch()`

```js
const promise = new Promise((resolve, reject) => {
  resolve("Success");
});

promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
```

### Output

```text
Success
```

The flow is:

```text
Promise
   ↓
resolve()
   ↓
.then()
```

Or:

```text
Promise
   ↓
reject()
   ↓
.catch()
```

## 4. Why Are Promises Better Than Callback Hell?

Remember callback hell:

```js
getUser(1, (userId) => {
  getOrders(userId, (orderId) => {
    getOrder(orderId, (productId) => {
      getProduct(productId, (productId) => {
        getReviews(productId);
      });
    });
  });
});
```

It's deeply nested.

With Promises:

```js
getUser(1)
  .then((userId) => getOrders(userId))
  .then((orderId) => getOrder(orderId))
  .then((productId) => getProduct(productId))
  .then((productId) => getReviews(productId))
  .catch((error) => console.log(error));
```

The nesting is greatly reduced.

## 5. What Is `async`/`await`?

`async`/`await` is a cleaner way to work with Promises.

Instead of:

```js
getUser(1)
  .then((userId) => getOrders(userId))
  .then((orderId) => getOrder(orderId))
  .then((productId) => getProduct(productId));
```

You can write:

```js
async function main() {
  const userId = await getUser(1);
  const orderId = await getOrders(userId);
  const productId = await getOrder(orderId);
}
```

This looks much more like normal synchronous code.

## 6. What Does `async` Mean?

When you write:

```js
async function main() {}
```

You're saying:

> This function works with asynchronous operations and always returns a Promise.

For example:

```js
async function hello() {
  return "Hello";
}
```

Even though you return a string, the function actually returns a Promise.

## 7. What Does `await` Mean?

`await` means: wait for this Promise to settle before continuing this `async` function.

```js
async function main() {
  const result = await getData();
  console.log(result);
}
```

The flow is:

```text
getData()
   ↓
Promise
   ↓
await
   ↓
Wait for result
   ↓
Continue
```

### Important

`await` can normally be used inside an `async` function.

```js
async function main() {
  const result = await somePromise();
}
```

## 8. Handling Errors With `async`/`await`

With `.then()`:

```js
getData()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
```

With `async`/`await`:

```js
async function main() {
  try {
    const data = await getData();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
```

```text
Promise chaining  → .then() / .catch()
async/await       → try / catch
```

## 9. Promise vs. `async`/`await`

They are not two completely different asynchronous systems.

Think of it like this:

```text
Promises
   ↓
.then()
.catch()
```

And:

```text
Promises
   ↓
async/await
```

`async`/`await` is a cleaner syntax for working with Promises. You still need to understand Promises.

## 10. Where Are They Used in Backend Development?

You will use them constantly:

### Database Operations

```js
const user = await User.findById(id);
```

### API Requests

```js
const response = await fetch(url);
```

### File Operations

```js
const data = await fs.promises.readFile("data.txt", "utf8");
```

### Authentication

```js
const user = await User.findOne({ email });
```

### Hashing Passwords

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

### Multiple Asynchronous Operations

```js
const users = await getUsers();
const products = await getProducts();
```

This is why understanding Promises and `async`/`await` is extremely important for backend development.

## 11. Promise Chaining

Suppose:

```js
function getUser() {
  return Promise.resolve(10);
}
```

Then:

```js
getUser()
  .then((userId) => {
    return userId + 5;
  })
  .then((result) => {
    console.log(result);
  });
```

The important part is:

```js
return userId + 5;
```

The result of one `.then()` becomes the value received by the next `.then()`.

```text
Promise 1
   ↓
Result
   ↓
Promise 2
   ↓
Result
   ↓
Promise 3
```

## 🧠 One Important Difference

Don't confuse `resolve()` with `return`.

Inside a Promise:

```js
resolve(data);
```

This settles the Promise successfully.

Inside `.then()`:

```js
return data;
```

This passes the value to the next `.then()`.

You'll use this constantly.
