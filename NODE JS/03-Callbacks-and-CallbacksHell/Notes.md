# Callbacks and Callback Hell

## 1. What Is a Callback?

A callback is a function that you pass to another function so that it can be called later.

### Why Do We Need Callbacks?

Callbacks are especially useful when something takes time to complete, such as:

- Reading a file
- Making a database query
- Getting data from an API
- Waiting for a network operation
- Handling an event

Instead of stopping the whole program and waiting, Node.js can start the operation and continue doing other work.

When the operation finishes, the callback is executed.

The basic flow is:

```text
Start reading file
       ↓
Continue doing other work
       ↓
File finished reading
       ↓
Callback executes
       ↓
Get data
```

## 2. What Is Callback Hell?

Callback hell happens when you have many asynchronous operations that depend on each other, and you keep nesting callbacks inside callbacks.

```js
doSomething((err, result1) => {
  doSomethingElse(result1, (err, result2) => {
    doSomethingAgain(result2, (err, result3) => {
      doAnotherThing(result3, (err, result4) => {
        console.log(result4);
      });
    });
  });
});
```

### Why Is It Bad?

As the application becomes larger:

- Code becomes difficult to read.
- Error handling becomes messy.
- Debugging becomes harder.
- Maintaining the code becomes difficult.
- Logic becomes deeply nested.

## 3. Real-World Example

Imagine an e-commerce application. You need to:

```text
Get User
   ↓
Get User's Orders
   ↓
Get Order Details
   ↓
Get Product Details
   ↓
Get Product Reviews
```

With callbacks, you might end up with:

```js
getUser(userId, (err, user) => {
  getOrders(user.id, (err, orders) => {
    getOrder(orders[0].id, (err, order) => {
      getProduct(order.productId, (err, product) => {
        getReviews(product.id, (err, reviews) => {
          console.log(reviews);
        });
      });
    });
  });
});
```

That's callback hell.

Later, you'll learn Promises and `async`/`await`, which make this much cleaner.
