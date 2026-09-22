# Node.js — Promises & Async/Await

## Task 1 — Create Your Own Promise

### What the Task Required

The task required creating a function `checkNumber(number)` that returns a custom Promise.
- If `number >= 18`, it fulfills the Promise with the string `"Eligible"`.
- If `number < 18`, it rejects the Promise with the string `"Not Eligible"`.
- The Promise is consumed using `.then()` for success and `.catch()` for error handling.

### Concepts Used

- `new Promise()` constructor
- Executor function `(resolve, reject) => { ... }`
- `resolve(value)`
- `reject(reason)`
- Promise states (`Pending`, `Fulfilled`, `Rejected`)
- `.then()` fulfillment handler
- `.catch()` rejection handler

---

### 1. The Promise Constructor & Executor Function

**What it is:**  
A Promise is instantiated using the `new Promise()` constructor, which takes an **executor function** as its parameter: `(resolve, reject) => { ... }`.

**Important Behavior:**  
The executor function runs **synchronously** as soon as `new Promise()` is invoked.

**Why it was useful in this task:**  
Encapsulates conditional validation logic inside a Promise wrapper that emits either a fulfilled value (`resolve`) or a rejection error (`reject`).

**Syntax & Example:**
```javascript
function checkNumber(number) {
    return new Promise((resolve, reject) => {
        if (number >= 18) {
            resolve("Eligible");
        } else {
            reject("Not Eligible");
        }
    });
}
```

---

### 2. resolve() and reject()

**What `resolve(value)` does:**  
Transitions the Promise from `Pending` state to `Fulfilled` state and stores `value` as the fulfillment result. Triggers any downstream `.then()` callbacks.

**What `reject(reason)` does:**  
Transitions the Promise from `Pending` state to `Rejected` state and stores `reason` as the rejection cause. Triggers any downstream `.catch()` callbacks.

---

### 3. Consuming Promises with .then() and .catch()

**How `.then()` works:**  
Registers a fulfillment handler that executes when the Promise resolves. Receives the value passed into `resolve()`.

**How `.catch()` works:**  
Registers a rejection handler that executes when the Promise rejects or throws an error. Receives the reason passed into `reject()`.

**Example:**
```javascript
checkNumber(20)
    .then((result) => {
        console.log("Success:", result); // Output: Success: Eligible
    })
    .catch((err) => {
        console.log("Error:", err);
    });
```

---

### How the Concepts Work Together

1. `checkNumber(100)` is invoked, returning a `new Promise()`.
2. The executor function checks `100 >= 18` (true) and calls `resolve("Eligible")`.
3. The Promise transitions from `Pending` -> `Fulfilled`.
4. `.then((result) => console.log(result))` receives `"Eligible"` and prints it.
5. `.catch()` is skipped because no rejection occurred.

---

### Important Things I Learned

- A Promise represents an eventual value or error.
- `resolve()` delivers success data to `.then()`, while `reject()` delivers errors to `.catch()`.

---

## Task 2 — Promise-Based File Reader

### What the Task Required

Read three files (`data/user.txt`, `data/skills.txt`, `data/projects.txt`) sequentially using Node.js's built-in `fs.promises` module, replacing callback nesting with a flat Promise chain using `.then()`.

### Concepts Used

- Node.js `fs.promises.readFile()`
- Promise chaining (`.then().then()`)
- Returning Promises from `.then()` handlers
- Centralized error handling using `.catch()`
- `path.join()` for path construction

---

### 1. fs.promises Module

**What it is:**  
Node.js core module that provides Promise-returning versions of file system APIs instead of relying on traditional error-first callbacks.

**Why it was useful in this task:**  
Eliminates callback nesting by returning a Promise directly from `fs.promises.readFile()`, allowing seamless chaining via `.then()`.

**Example:**
```javascript
const fs = require('fs');
const path = require('path');

const userPromise = fs.promises.readFile(path.join("data", "user.txt"), "utf8");
```

---

### 2. Promise Chaining & Returning Promises from .then()

**How it works:**  
When a `.then()` handler returns a new Promise (such as `fs.promises.readFile(...)`), the outer Promise chain pauses and waits for that returned Promise to settle before invoking the next `.then()` in the chain.

**Code Structure:**
```javascript
fs.promises.readFile(path.join("data", "user.txt"), "utf8")
    .then((userData) => {
        console.log(userData);
        // Returning a new Promise from .then()
        return fs.promises.readFile(path.join("data", "skills.txt"), "utf8");
    })
    .then((skillsData) => {
        console.log(skillsData);
        return fs.promises.readFile(path.join("data", "projects.txt"), "utf8");
    })
    .then((projectsData) => {
        console.log(projectsData);
        console.log("All files processed");
    })
    .catch((err) => {
        console.error("File Read Error:", err);
    });
```

---

### How the Concepts Work Together

1. `fs.promises.readFile("user.txt")` starts reading `user.txt` and returns Promise 1.
2. When Promise 1 fulfills, the first `.then()` prints `userData` and **returns** `fs.promises.readFile("skills.txt")` (Promise 2).
3. The chain automatically waits for Promise 2 to fulfill before passing `skillsData` to the second `.then()`.
4. If ANY file read fails, execution skips remaining `.then()` handlers and jumps directly to `.catch()`.

---

### Important Things I Learned

- Returning a Promise inside a `.then()` handler flattens the sequence and prevents callback hell.
- A single `.catch()` at the end of a Promise chain catches errors from any step in the entire chain.

---

### Improvement Note

In `Task2/app.js`:
```javascript
// Unused auto-imported module present in solution:
const { resolve } = require('dns');
```
*Clean-up recommendation:* Remove unused imports to keep code clean.

---

## Task 3 — Convert Your Callback Hell to Promises

### What the Task Required

Convert the fake e-commerce pipeline (`getUser` -> `getOrders` -> `getOrder` -> `getProduct` -> `getReviews`) from nested callbacks to Promise-returning functions using `new Promise((resolve, reject) => { ... })`.

### Concepts Used

- Wrapping async operations in `new Promise()`
- Promise-based data pipelines
- Returning data resolution values (`resolve(data["Order"])`)
- Handling invalid IDs with `reject()`

---

### 1. Creating Promise Wrappers for Custom Async Functions

**Pattern:**
```javascript
function getUser(id) {
    return new Promise((resolve, reject) => {
        if (id !== data["Id"]) {
            reject("id not found");
        } else {
            resolve(data["UserId"]);
        }
    });
}
```

---

### How the Concepts Work Together

Each function (`getUser`, `getOrders`, `getOrder`, etc.) returns a Promise instance immediately. The caller can then chain them together cleanly:

```javascript
getUser(1)
    .then((userId) => getOrders(userId))
    .then((orderId) => getOrder(orderId))
    .then((productId) => getProduct(productId))
    .then((reviews) => console.log("Reviews:", reviews))
    .catch((err) => console.error("Pipeline Error:", err));
```

---

### Common Mistakes & Improvement Note

In `Task3/app.js`:
```javascript
// Solution snippet:
getUser(1)
.then((userId) => {
    setTimeout(() => {
        return getOrders(userId);
    }, 1000)
})
.then((order) => { ... })
```

**Why this pattern fails in Promise chaining:**  
1. `setTimeout` executes asynchronously in a separate timer callback. Returning a Promise from inside `setTimeout` does NOT return it to the outer `.then()` handler.
2. The `.then()` handler finishes synchronously returning `undefined`, so the next `.then((order))` receives `undefined` instead of waiting for `getOrders(userId)`.

*Better approach:* Put `setTimeout` **inside** the Promise constructor definition:

```javascript
function getOrders(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId === undefined) reject("User id not found");
            else resolve(data["Order"]);
        }, 1000);
    });
}

// Clean chain consumption:
getUser(1)
    .then(userId => getOrders(userId))
    .then(orderId => getOrder(orderId))
    .then(productId => getProduct(productId))
    .then(reviews => console.log(reviews))
    .catch(err => console.error(err));
```

---

## Task 4 — Same Problem Using `async`/`await`

### What the Task Required

Convert the Promise-based pipeline from Task 3 into an `async`/`await` function with `try`/`catch` block.

*(Defined in `Tasks.md` & `Notes.md` to demonstrate modern asynchronous control flow).*

### Concepts Used

- `async` function declaration
- `await` keyword for pausing async execution
- `try...catch` error handling
- Linear control flow for sequential operations

---

### 1. Converting Promise Chains to async/await

**Code Structure:**
```javascript
async function processOrderPipeline() {
    try {
        const userId = await getUser(1);
        const orderId = await getOrders(userId);
        const productId = await getOrder(orderId);
        const product = await getProduct(productId);
        const reviews = await getReviews(productId);

        console.log("User ID:", userId);
        console.log("Order ID:", orderId);
        console.log("Reviews:", reviews);
    } catch (err) {
        console.error("Pipeline failed:", err);
    }
}

processOrderPipeline();
```

---

### Important Things I Learned

- `async`/`await` is syntactic sugar built on top of Promises.
- `await` pauses execution inside the `async` function until the Promise fulfills or rejects.
- `try...catch` captures any rejected Promise value as a caught exception.

---

## Task 5 — Parallel Operations (`Promise.all`)

### What the Task Required

Execute three independent asynchronous operations (`getUser()`, `getProducts()`, `getReviews()`) concurrently in parallel using `Promise.all()`, and measure execution time.

*(Defined in `Tasks.md` to practice concurrent execution).*

### Concepts Used

- `Promise.all([promise1, promise2, promise3])`
- Parallel vs Sequential asynchronous execution
- Performance optimization for independent I/O tasks

---

### 1. Promise.all()

**What it does:**  
Takes an array of Promises and executes them concurrently. Resolves when **all** input Promises fulfill, returning an array of fulfillment values in the original order. If **any** Promise rejects, `Promise.all()` immediately rejects.

**Comparing Sequential vs Parallel Execution:**

```text
Sequential (await one after another): 2s + 2s + 2s = 6 seconds total
Parallel (Promise.all):              Max(2s, 2s, 2s) = ~2 seconds total
```

**Example:**
```javascript
async function fetchDashboardData() {
    console.time("ParallelExecution");

    try {
        // All three network/timer operations start at the same time
        const [user, products, reviews] = await Promise.all([
            getUser(),
            getProducts(),
            getReviews()
        ]);

        console.log("User:", user);
        console.log("Products:", products);
        console.log("Reviews:", reviews);
    } catch (err) {
        console.error("One of the operations failed:", err);
    }

    console.timeEnd("ParallelExecution"); // Prints ~2000ms
}
```

---

### Important Things I Learned

- Independent asynchronous operations should be run concurrently using `Promise.all()` to save total execution time.
- `Promise.all()` rejects immediately if any single Promise fails ("fail-fast" behavior).

---

## Task 6 — Error Handling Challenge

### What the Task Required

Build a 4-step sequence (`getUser` -> `getOrders` -> `getPayment` -> `getProduct`) where `getPayment` intentionally rejects, and handle it gracefully using `async`/`await` and `try`/`catch`.

*(Defined in `Tasks.md` to practice error propagation).*

### Concepts Used

- `reject()` in custom Promises
- `try...catch` error interception
- Short-circuiting sequential execution on rejection

---

### 1. Asynchronous Error Interception Flow

```javascript
async function executeCheckout() {
    try {
        console.log("Getting user...");
        const user = await getUser();
        console.log("User found.");

        console.log("Getting orders...");
        const orders = await getOrders(user.id);
        console.log("Orders found.");

        console.log("Getting payment...");
        const payment = await getPayment(); // Intentionally rejects!
        
        // Lines below are skipped when getPayment rejects
        console.log("Getting product...");
        await getProduct();
    } catch (err) {
        console.error("Error:", err); // Output: Error: Unable to process payment.
    }
}
```

---

# Promise Fundamentals

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation.

### The Promise Constructor Syntax

```javascript
const promise = new Promise((resolve, reject) => {
    // Synchronous executor body
    const success = true;

    if (success) {
        resolve("Fulfillment Result");
    } else {
        reject(new Error("Rejection Cause"));
    }
});
```

- **Executor Function**: `(resolve, reject) => { ... }` executes **synchronously** immediately upon creation.
- **`resolve(val)`**: Changes state to `Fulfilled`, setting fulfillment value.
- **`reject(err)`**: Changes state to `Rejected`, setting rejection reason.

---

# Promise States

A Promise always exists in one of three mutually exclusive states:

```
                  +-------------------+
                  |      PENDING      |
                  | (Initial State)   |
                  +-------------------+
                            |
           +----------------+----------------+
           |                                 |
           v                                 v
+-------------------+               +-------------------+
|     FULFILLED     |               |     REJECTED      |
|   (Resolved/OK)   |               |     (Failed)      |
+-------------------+               +-------------------+
           |                                 |
           +----------------+----------------+
                            |
                            v
                  +-------------------+
                  |      SETTLED      |
                  | (Final Condition) |
                  +-------------------+
```

1. **`Pending`**: Initial state. Asynchronous operation is still in progress.
2. **`Fulfilled`**: Operation completed successfully (`resolve()` called).
3. **`Rejected`**: Operation failed (`reject()` called or exception thrown).
4. **`Settled`**: Term describing a Promise that is either `Fulfilled` or `Rejected`. Once settled, a Promise's state and value are immutable and cannot change again.

---

# Promise Consumption

### `.then()`
Executes when a Promise fulfills:
```javascript
promise.then(value => console.log(value));
```

### `.catch()`
Executes when a Promise rejects or throws an error:
```javascript
promise.catch(err => console.error(err));
```

### `.finally()`
Executes when a Promise settles (whether fulfilled or rejected). Ideal for cleanup operations like closing database connections or hiding loading spinners:
```javascript
promise.finally(() => console.log("Operation finished. Cleanup complete."));
```

---

# Promise Chaining

Promise chaining allows running multiple asynchronous operations in sequence where each step passes data to the next step.

```javascript
getData()
    .then(value => {
        console.log("Step 1:", value);
        return value * 2; // Returning a primitive value wraps it in a resolved Promise
    })
    .then(doubledValue => {
        console.log("Step 2:", doubledValue);
        return fetchDetails(doubledValue); // Returning a Promise waits for it to resolve
    })
    .then(finalDetails => {
        console.log("Step 3 Complete:", finalDetails);
    })
    .catch(err => {
        console.error("Error at any step caught here:", err);
    });
```

---

# Error Propagation

When an error is thrown or a Promise rejects anywhere inside a Promise chain, JavaScript skips all subsequent `.then()` fulfillment handlers until it finds the nearest `.catch()` rejection handler.

```javascript
Promise.resolve("Start")
    .then(() => {
        throw new Error("Failure in Step 1");
    })
    .then(() => {
        console.log("This step is SKIPPED");
    })
    .catch(err => {
        console.log("Caught Error:", err.message); // Output: Caught Error: Failure in Step 1
    });
```

---

# async Functions

An `async` function is a function declared with the `async` keyword.

### Essential Rules of `async` Functions:
1. **Always Returns a Promise**: If you return a primitive value (e.g. `return "Hello"`), JavaScript automatically wraps it in `Promise.resolve("Hello")`.
2. **Enables `await`**: Allows using the `await` keyword inside its body.
3. **Implicit Rejection on Errors**: Throwing an exception inside an `async` function returns a rejected Promise.

```javascript
async function getUserName() {
    return "Saurabh";
}

getUserName().then(name => console.log(name)); // Output: Saurabh
```

---

# await

The `await` operator is used inside `async` functions to pause execution until a Promise settles.

```javascript
async function displayUser() {
    const user = await fs.promises.readFile("user.txt", "utf8");
    console.log(user);
}
```

### Key Behaviors of `await`:
- **Unwraps Fulfillment Value**: If the Promise fulfills, `await` returns the raw fulfillment value directly.
- **Throws Rejections**: If the Promise rejects, `await` throws the rejection reason as a JavaScript exception.
- **Non-blocking Process**: `await` pauses execution of the *local async function*, but does NOT block the main Node.js event loop thread.

---

# Async/Await Error Handling

Errors from `await` expressions are handled using standard `try...catch` blocks.

```javascript
async function loadConfig() {
    try {
        const config = await fs.promises.readFile("config.json", "utf8");
        return JSON.parse(config);
    } catch (err) {
        console.error("Failed to load config:", err.message);
        return null; // Graceful fallback
    }
}
```

---

# Sequential vs Concurrent Operations

```
SEQUENTIAL (Dependent Operations):
Task A ---> [await A] ---> Task B ---> [await B] ---> Task C

CONCURRENT / PARALLEL (Independent Operations):
Task A -------\
Task B -------+---> Promise.all() ---> Continue
Task C -------/
```

- **Sequential**: Use `await` sequentially when Task B requires output from Task A.
- **Concurrent**: Use `Promise.all([Task A, Task B])` when tasks are independent to maximize throughput.

---

# Callback vs Promise vs Async/Await

| Feature | Callbacks | Promises | Async / Await |
|---|---|---|---|
| **Syntax** | Nested callbacks | `.then()` chaining | `async` / `await` |
| **Readability** | Poor (Pyramid of Doom) | Moderate (Linear chain) | Excellent (Looks synchronous) |
| **Error Handling** | `if (err)` per callback | `.catch()` block | `try...catch` block |
| **Execution Control** | Manual nesting | `.then()` return values | Pause via `await` |
| **Composition** | Difficult | `Promise.all()` | `await Promise.all()` |

---

# Overall Concepts Learned

## Promise Fundamentals

- `new Promise((resolve, reject) => { ... })`
- Synchronous execution of executor function.
- `resolve(val)` -> `Fulfilled` state.
- `reject(err)` -> `Rejected` state.
- Immutability of settled Promise states.

## Promise Consumption & Chaining

- `.then(fulfillmentHandler)`
- `.catch(rejectionHandler)`
- `.finally(cleanupHandler)`
- Value and Promise propagation through `.then()` chains.
- Centralized error bubbling to `.catch()`.

## Async / Await

- `async` function declaration returning implicit Promises.
- `await` unwrapping fulfillment values and pausing local execution.
- `try...catch` exception handling for rejected Promises.
- Sequential vs Parallel execution strategies (`Promise.all`).
- `fs.promises` core Node.js file system API.

---

# Quick Revision

### Important Code Patterns

#### 1. Creating a Promise Wrapper
```javascript
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
```

#### 2. Promise Chaining Pattern
```javascript
fetchUser()
    .then(user => fetchPosts(user.id))
    .then(posts => console.log(posts))
    .catch(err => console.error(err));
```

#### 3. Standard Async/Await Pattern with Error Handling
```javascript
async function run() {
    try {
        const data = await fs.promises.readFile("file.txt", "utf8");
        console.log(data);
    } catch (err) {
        console.error("Read failed:", err);
    }
}
```

#### 4. Parallel Operations with Promise.all
```javascript
async function fetchAll() {
    const [user, products] = await Promise.all([
        getUser(),
        getProducts()
    ]);
    console.log(user, products);
}
```

---

# What I Can Do After These Tasks

Based on the completed tasks and implementations:

1. **Create Custom Promises**: Instantiate `new Promise()` using `resolve()` and `reject()`.
2. **Consume Promises with `.then()` / `.catch()`**: Read results and handle errors in Promise chains.
3. **Use Node.js Promise APIs**: Consume `fs.promises.readFile()` for clean file operations.
4. **Refactor Callbacks to Promises**: Convert callback-based workflows into flat Promise chains.
5. **Write `async`/`await` Code**: Declare `async` functions and pause execution using `await`.
6. **Handle Async Errors with `try...catch`**: Catch rejected Promises using standard exception blocks.
7. **Optimize Performance with `Promise.all()`**: Execute independent asynchronous operations concurrently.

---

# Connection to Previous and Later Node.js Concepts

```
Callbacks & Error-First Pattern (Module 03)
       ↓
Promises & .then() Chaining (Module 04)
       ↓
async / await Syntax (Module 04)
       ↓
EventEmitter & Custom Events (Module 05)
       ↓
Express.js Middleware & Async Handlers (Module 06)
```

Understanding Promises and `async`/`await` is critical because modern Node.js frameworks (Express, Mongoose, Prisma, Axios, Fastify) rely entirely on Promises for non-blocking I/O operations.
