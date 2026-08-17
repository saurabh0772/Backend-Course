# EventEmitter Practice Tasks

## 🟢 Task 1 — Basic Event System

Create an `EventEmitter` and create these events:

- `login`
- `logout`
- `purchase`

Add listeners for each event.

When you emit:

```js
emitter.emit("login");
```

the output should be:

```text
User logged in
```

When you emit:

```js
emitter.emit("purchase");
```

the output should be:

```text
User made a purchase
```

### Practice

Use:

- `EventEmitter`
- `.on()`
- `.emit()`

## 🟢 Task 2 — Event Data

Now pass data with an event.

Create:

```js
emitter.emit("login", user);
```

where:

```js
const user = {
  id: 1,
  name: "Saurabh",
  email: "saurabh@example.com",
};
```

Your listener should print:

```text
User Logged In
Name: Saurabh
Email: saurabh@example.com
```

### Goal

Understand that:

```js
emit("event", data);
```

passes data to:

```js
on("event", (data) => {});
```

## 🟡 Task 3 — Multiple Listeners

Create a `userRegistered` event.

When this happens:

```js
emitter.emit("userRegistered", user);
```

three different listeners should react:

1. Send a welcome email.
2. Create an audit log.
3. Update analytics.

Expected output:

```text
Sending welcome email to Saurabh
Creating audit log for Saurabh
Updating analytics for Saurabh
```

### Goal

Understand the biggest advantage of `EventEmitter`: one event can have multiple listeners.

## 🟡 Task 4 — Event-Based Order System

Build a small order system.

Create these events:

- `orderCreated`
- `paymentCompleted`
- `orderShipped`
- `orderDelivered`

The flow should be:

```text
Create Order
     ↓
orderCreated
     ↓
Payment Completed
     ↓
paymentCompleted
     ↓
Order Shipped
     ↓
orderShipped
     ↓
Order Delivered
     ↓
orderDelivered
```

Pass the order object through the events:

```js
{
  id: 101,
  product: "Node.js Course",
  price: 499,
}
```

### Goal

Understand event-driven application flow.

## 🔴 Task 5 — User Registration Event System

Build a small user-registration system.

When a user registers:

```text
User registers
      ↓
userRegistered event
      ├── Send welcome email
      ├── Create audit log
      └── Update analytics
```

Create separate functions:

- `sendWelcomeEmail()`
- `createAuditLog()`
- `updateAnalytics()`

Connect each function using an `EventEmitter` listener.

Expected output:

```text
Registering user...

User registered successfully.

Sending welcome email...
Welcome email sent.

Creating audit log...
Audit log created.

Updating analytics...
Analytics updated.
```

### Challenge

Do not directly call the following from your registration function:

```js
sendWelcomeEmail();
createAuditLog();
updateAnalytics();
```

The registration function should only emit:

```js
emitter.emit("userRegistered", user);
```

The listeners should handle the rest. This is where you will start understanding loose coupling.

## 🔥 Task 6 — `once()` Challenge

Create a `serverStarted` event.

You need:

```js
emitter.once("serverStarted", ...);
```

The listener should run only once. Test it by doing:

```js
emitter.emit("serverStarted");
emitter.emit("serverStarted");
emitter.emit("serverStarted");
```

Expected output:

```text
Server started!
```

It should appear only once.

Then create another listener using `.on()` and compare the behavior.

## 🔥 Task 7 — Event Logger

Create a simple application-wide logger.

Your application can emit:

- `info`
- `warning`
- `error`

For example:

```js
emitter.emit("info", "Server started");
emitter.emit("warning", "Memory usage is high");
emitter.emit("error", "Database connection failed");
```

Your listeners should print:

```text
[INFO] Server started
[WARNING] Memory usage is high
[ERROR] Database connection failed
```

### Challenge

Create a separate listener for each event type.

This is a small example of how event-driven systems can be used for application logging.
