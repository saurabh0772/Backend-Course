# Node.js — EventEmitter

## Task 1 — Basic Event System

### What the Task Required

The task required creating an instance of Node.js's built-in `EventEmitter` class and defining listeners for three basic application events:
- `login` -> Outputs `"User logged in"`
- `purchase` -> Outputs `"User made a purchase"`
- `logout` -> Outputs `"User logged out"`

Each event is triggered using `emitter.emit()`.

### Concepts Used

- `require('events')`
- `new EventEmitter()` instance creation
- `emitter.on(eventName, listener)` event registration
- `emitter.emit(eventName)` event dispatching

---

### 1. EventEmitter Instance Creation

**What it is:**  
The `events` core module exports the `EventEmitter` class. Instantiating it (`new EventEmitter()`) creates an event channel for registering and triggering custom named events.

**Why it was useful in this task:**  
Provides a central pub/sub mechanism inside a single Node.js process to decouple event producers from event consumers.

**Example:**
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();
```

---

### 2. Registering and Triggering Events (`.on()` and `.emit()`)

**How `.on()` works:**  
Registers a persistent listener function for a specific event name string (`"login"`, `"purchase"`, `"logout"`).

**How `.emit()` works:**  
Synchronously calls all listener functions registered for the specified event name.

**Example:**
```javascript
emitter.on("login", () => {
    console.log("User logged in");
});

emitter.emit("login"); // Output: User logged in
```

---

### How the Concepts Work Together

1. `emitter.on("login", callback)` adds the callback function to `emitter`'s internal listener array for `"login"`.
2. `emitter.emit("login")` looks up `"login"` in the listener table and synchronously executes all attached callbacks.

---

### Important Things I Learned

- Event names are simple strings (e.g. `"login"`).
- Calling `.emit()` triggers listeners synchronously on the main thread.

---

## Task 2 — Event Data

### What the Task Required

Pass a `user` data object as an argument when emitting the `"login"` event (`emitter.emit("login", user)`), and consume the user properties (`name`, `email`) inside the event listener callback.

### Concepts Used

- Passing event payloads via `emitter.emit(eventName, data)`
- Consuming event parameters in `emitter.on(eventName, (data) => { ... })`

---

### 1. Passing Arguments to Event Listeners

**How it works:**  
Any arguments passed to `emitter.emit()` after the event name are forwarded directly to all registered listener callbacks.

**Code Structure:**
```javascript
const user = {
    id: 1,
    name: "Saurabh",
    email: "saurabh@example.com"
};

emitter.on("login", (userData) => {
    console.log("User Logged In");
    console.log("Name:", userData.name);
    console.log("Email:", userData.email);
});

emitter.emit("login", user);
```

---

### How the Concepts Work Together

1. `emitter.emit("login", user)` passes the `user` object reference.
2. The listener callback receives `userData` as a parameter and extracts `userData.name` and `userData.email`.

---

### Important Things I Learned

- Data objects passed via `.emit()` are passed by reference to listener functions.
- Multiple parameters can be passed through `.emit("event", arg1, arg2, arg3)`.

---

## Task 3 — Multiple Listeners

### What the Task Required

Register three separate, independent listeners for a single event (`"userRegistered"`):
1. Send a welcome email.
2. Create an audit log entry.
3. Update analytics metrics.

All three listeners execute when `emitter.emit("userRegistered", user)` is invoked once.

### Concepts Used

- One-to-many event dispatching (single event -> multiple listeners)
- Synchronous listener execution order

---

### 1. Multiple Listeners for a Single Event

**Why it is useful:**  
This is the core strength of `EventEmitter`. A single action (user registration) can trigger multiple side effects without the emitting code having to know about or call each service manually.

**Code Structure:**
```javascript
emitter.on("userRegistered", (user) => {
    console.log("Sending welcome email to", user.name);
});

emitter.on("userRegistered", (user) => {
    console.log("Creating audit log for", user.name);
});

emitter.on("userRegistered", (user) => {
    console.log("Updating analytics for", user.name);
});

emitter.emit("userRegistered", { id: 1, name: "Saurabh" });
```

---

### How the Concepts Work Together

When `emitter.emit("userRegistered", user)` is called:
1. Listener 1 fires -> Logs email action.
2. Listener 2 fires -> Logs audit entry.
3. Listener 3 fires -> Logs analytics update.

All listeners execute synchronously in the order they were attached using `.on()`.

---

### Important Things I Learned

- Multiple handlers can subscribe to the same event string without overwriting each other.
- Listeners execute sequentially in registration order.

---

## Task 4 — Event-Based Order System

### What the Task Required

Design a multi-stage order processing pipeline driven by events:
- `orderCreated` -> `paymentCompleted` -> `orderShipped` -> `orderDelivered`

Pass an order data payload (`{ id: 101, product: "Node.js Course", price: 499 }`) through each stage.

*(Defined in `Tasks.md` to demonstrate event-driven application flow).*

### Concepts Used

- Sequential event pipeline architecture
- Event-driven state transitions

---

### 1. Event Pipeline Pattern

**Code Structure:**
```javascript
emitter.on("orderCreated", (order) => {
    console.log(`[Order #${order.id}] Created for ${order.product}`);
    emitter.emit("paymentCompleted", order);
});

emitter.on("paymentCompleted", (order) => {
    console.log(`[Order #${order.id}] Payment of $${order.price} received`);
    emitter.emit("orderShipped", order);
});

emitter.on("orderShipped", (order) => {
    console.log(`[Order #${order.id}] Shipped to customer`);
    emitter.emit("orderDelivered", order);
});

emitter.on("orderDelivered", (order) => {
    console.log(`[Order #${order.id}] Delivered successfully`);
});

emitter.emit("orderCreated", { id: 101, product: "Node.js Course", price: 499 });
```

---

## Task 5 — User Registration Event System

### What the Task Required

Build a user registration system where the main `registration()` function performs registration logic and **only** emits `userRegistered`. Standalone handler functions (`sendWelcomeEmail`, `createAuditLog`, `updateAnalytics`) are hooked to the event via listeners, enforcing **loose coupling**.

### Concepts Used

- Loose coupling between modules
- Decoupling event triggers from business logic

---

### 1. Achieving Loose Coupling with EventEmitter

**What Loose Coupling means:**  
The `registration()` function does not directly call `sendWelcomeEmail()`, `createAuditLog()`, or `updateAnalytics()`. It simply announces that a user registered. If a new requirement is added later (e.g. `sendSMSNotification`), a new listener can be added without modifying the original `registration()` function.

**Code Structure:**
```javascript
function sendWelcomeEmail() {
    console.log("Sending welcome email...\nWelcome email sent.\n");
}

function createAuditLog() {
    console.log("Creating audit log...\nAudit log created.\n");
}

function updateAnalytics() {
    console.log("Updating analytics...\nAnalytics updated.");
}

// Subscribing listeners
emitter.on("userRegistered", () => sendWelcomeEmail());
emitter.on("userRegistered", () => createAuditLog());
emitter.on("userRegistered", () => updateAnalytics());

// Registration function (Publisher)
function registration() {
    console.log("Registering user...\nUser Registered successfully.\n");
    emitter.emit("userRegistered", user); // Emits event without calling handlers directly
}

registration();
```

---

### Important Things I Learned

- Event-driven code keeps functions focused on a single responsibility.
- Publisher functions emit events; subscriber functions handle side effects.

---

## Task 6 — `once()` Challenge

### What the Task Required

Register a listener for a `serverStarted` event using `emitter.once("serverStarted", ...)`. Emit the event three times in a row and verify that the listener executes **only once**.

### Concepts Used

- `emitter.once(eventName, listener)`
- One-time event listeners vs persistent listeners (`.on()`)

---

### 1. Persistent (.on) vs One-Time (.once) Listeners

**How `.once()` works:**  
Registers a listener that executes at most once. Immediately after the listener is invoked for the first time, `EventEmitter` automatically unbinds and removes it.

**Code Structure:**
```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.once("serverStarted", () => {
    console.log("Server started!");
});

// Emitting three times:
emitter.emit("serverStarted"); // Output: Server started!
emitter.emit("serverStarted"); // No output (listener auto-removed)
emitter.emit("serverStarted"); // No output
```

---

### Important Things I Learned

- `.once()` is ideal for initialization events or one-off tasks (e.g. database connected, server ready).
- Subsequent emissions of the event are silently ignored by un-subscribed `.once()` listeners.

---

## Task 7 — Event Logger

### What the Task Required

Build an application logger using an `EventEmitter` that listens for three distinct log levels:
- `"info"` -> `[INFO] Server started`
- `"warning"` -> `[WARNING] Memory usage is high`
- `"error"` -> `[ERROR] Database connection failed`

Each log level has its own dedicated listener.

### Concepts Used

- Multi-channel event categorization
- Passing string messages and `Error` objects as event arguments

---

### 1. Log Level Event Handlers

**Code Structure:**
```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("info", (msg) => {
    console.log("[INFO]", msg);
});

emitter.on("warning", (msg) => {
    console.log("[WARNING]", msg);
});

emitter.on("error", (msg) => {
    console.log("[ERROR]", msg);
});

emitter.emit("info", "Server started");
emitter.emit("warning", "Memory usage is high");
emitter.emit("error", new Error("Database connection failed"));
```

---

### Important Things I Learned

- Application services can emit custom log levels (`info`, `warning`, `error`), delegating output formatting to dedicated logger listeners.

---

# EventEmitter Fundamentals

The `EventEmitter` class facilitates in-process communication between objects in Node.js.

```
+-------------------------------------------------------------------+
|                        EventEmitter Instance                       |
|                                                                   |
|  Event Registry Table:                                            |
|  "userRegistered" -> [ fn1 (email), fn2 (audit), fn3 (analytics) ]|
|  "serverStarted"  -> [ fn4 (once) ]                               |
+-------------------------------------------------------------------+
       ^                                                 |
       | .on() / .once()                                 | .emit()
       | Register                                        | Dispatch
+-------------------+                           +-------------------+
| Listener Functions|                           |  Publisher Action |
+-------------------+                           +-------------------+
```

---

# Event Registration

### `.on(eventName, listener)` / `.addListener()`
Adds a persistent listener function for `eventName`. Executes every time `eventName` is emitted.

### `.once(eventName, listener)`
Adds a one-time listener function for `eventName`. Automatically unbinds after its first execution.

---

# Event Emission

### `.emit(eventName, [...args])`
Synchronously calls each listener registered for `eventName` in registration order, passing optional arguments `...args`.

**Return Value:**  
Returns `true` if the event had registered listeners; `false` otherwise.

---

# Passing Data Through Events

`EventEmitter` supports passing primitive values, objects, functions, or `Error` instances across the event boundary:

```javascript
// Single parameter object:
emitter.emit("order", { id: 101, total: 50 });

// Multiple individual parameters:
emitter.emit("login", "saurabh", "192.168.1.1", new Date());
emitter.on("login", (username, ipAddress, timestamp) => { ... });
```

---

# Listener Management

### `.off(eventName, listener)` / `.removeListener(eventName, listener)`
Removes a specific listener from `eventName`.

**Crucial Function Reference Requirement:**  
To remove a listener, you MUST pass a reference to the **exact same function instance** used during registration.

```javascript
// CORRECT - Shared function reference:
function onLog() { console.log("Logging..."); }

emitter.on("log", onLog);
emitter.off("log", onLog); // Listener successfully removed

// INCORRECT - Anonymous function mismatch:
emitter.on("log", () => console.log("Logging..."));
emitter.off("log", () => console.log("Logging...")); // FAILS! Different function object in memory
```

### `.removeAllListeners([eventName])`
Removes all listeners, or all listeners for a specified `eventName`.

### `.listenerCount(eventName)`
Returns the current number of listeners attached to `eventName`.

### `.eventNames()`
Returns an array of active event name strings/symbols registered on the emitter.

---

# Special Events

### The Special `'error'` Event

In Node.js, the `'error'` event has unique, built-in behavior:
- If an `EventEmitter` emits `'error'` and **no listener is registered for `'error'`**, Node.js prints a stack trace and **crashes the entire process**.

```javascript
// Safe pattern: Always register an error listener!
emitter.on("error", (err) => {
    console.error("Uncaught Event Error Handled:", err.message);
});

emitter.emit("error", new Error("Database offline")); // Process will NOT crash
```

### Built-in Meta Events
- `'newListener'`: Emitted *before* a new listener is added to the internal registry.
- `'removeListener'`: Emitted *after* a listener is removed.

---

# Event Execution Order

1. **Synchronous Invocation**: By default, `emitter.emit()` invokes all listeners **synchronously** on the current call stack before returning.
2. **Registration Order**: Listeners execute in the exact order they were registered using `.on()`.

```javascript
emitter.on("start", () => console.log("First"));
emitter.on("start", () => console.log("Second"));

emitter.emit("start");
// Output:
// First
// Second
```

---

# Event-Driven Programming

Event-driven programming is an architectural pattern where application flow is determined by events (user actions, sensor outputs, system signals).

### Benefits:
- **Decoupling**: Modules broadcast actions (`emit`) without depending on specific consumer implementations.
- **Extensibility**: Adding new feature reactions requires adding a new `.on()` listener without modifying existing logic.

---

# EventEmitter and Node.js

Many core Node.js APIs extend or utilize `EventEmitter`:
- **Streams**: Emit `'data'`, `'end'`, `'error'`, `'finish'`.
- **HTTP Server**: `http.createServer()` emits `'request'`, `'connection'`, `'close'`.
- **Process**: `process` emits `'exit'`, `'uncaughtException'`, `'unhandledRejection'`.

---

# EventEmitter vs Callbacks vs Promises

| Feature | Callbacks | Promises | EventEmitter |
|---|---|---|---|
| **Purpose** | One-off async result | One-off eventual result | Repeated event notifications |
| **Listener Count** | 1 callback per function | 1 `.then()` / `.catch()` chain | 0, 1, or multiple listeners |
| **Execution Count** | Exactly once | Exactly once | 0 to infinite emissions |
| **Decoupling** | High coupling (passed in) | Moderate | Very High (Pub/Sub pattern) |

---

# Common Mistakes

1. **Anonymous Function Removal**: Trying to remove an anonymous inline arrow function with `.off()` (fails because function references differ).
2. **Unhandled Error Event**: Emitting `'error'` without an `'error'` listener, causing process crash.
3. **Assuming Asynchronous Execution**: Forgetting that `.emit()` calls listeners synchronously.
4. **Memory Leaks**: Adding listeners inside recurring requests or loops without removing them (triggers `MaxListenersExceededWarning`).

---

# Overall Concepts Learned

## Fundamentals & APIs

- `require('events')` & `new EventEmitter()`.
- `emitter.on()`, `emitter.once()`, `emitter.off()`, `emitter.emit()`.
- `emitter.listenerCount()`, `emitter.eventNames()`.

## Event Architecture

- Single event -> Multiple listeners pattern.
- Passing data objects and primitive arguments via `emit`.
- Loose coupling: Publisher (`emit`) vs Subscriber (`on`).
- Special `'error'` event handling.

---

# Quick Revision

### Important EventEmitter Patterns

#### 1. Basic Setup & Data Emission
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('userLogin', (user) => {
    console.log(`Welcome, ${user.name}`);
});

emitter.emit('userLogin', { name: 'Saurabh' });
```

#### 2. One-Time Listener Pattern
```javascript
emitter.once('init', () => {
    console.log('App initialized');
});
```

#### 3. Proper Listener Removal Pattern
```javascript
function handleData(data) {
    console.log('Data:', data);
}

emitter.on('data', handleData);
emitter.off('data', handleData); // Correct reference pass
```

#### 4. Safe Error Event Pattern
```javascript
emitter.on('error', (err) => {
    console.error('Handled Error:', err.message);
});

emitter.emit('error', new Error('Connection failed'));
```

---

# What I Can Do After These Tasks

Based on the completed tasks:

1. **Instantiate EventEmitter**: Create custom event emitter instances.
2. **Register & Trigger Custom Events**: Use `.on()` and `.emit()` for application events.
3. **Pass Event Payloads**: Send data objects and parameters to listeners.
4. **Use One-Time Listeners**: Utilize `.once()` for single-execution events.
5. **Implement Loose Coupling**: Separate trigger logic from side-effect handlers.
6. **Handle Log & Error Events**: Structure application-wide logger systems and handle `'error'` events safely.

---

# Real-World Connection

- **Logging & Monitoring**: Emitting `info`, `warn`, `error` events throughout an application.
- **User Lifecycles**: Triggering email, audit log, and analytics listeners upon registration/login.
- **Core Node.js APIs**: Understanding stream events (`'data'`, `'end'`) and HTTP server events (`'request'`).

---

# Connection to Previous and Later Node.js Concepts

```
Callbacks & Promises (Modules 03 & 04)
       ↓
EventEmitter (Module 05)
       ↓
Node.js Streams & Buffers (Module 06)
       ↓
Express.js & Custom Middleware Events (Module 07)
```
