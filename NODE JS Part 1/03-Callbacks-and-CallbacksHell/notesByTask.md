# Node.js — Callbacks & Callback Hell

## Task 1 — Your Own Callback

### What the Task Required

The task required building a custom `calculate(a, b, operation, callback)` function that accepts two numbers, an operation string (`"add"`, `"multiply"`, `"subtract"`), and a callback function. It performs the math operation synchronously and invokes the callback with the result.

### Concepts Used

- Custom higher-order functions (functions taking functions as arguments)
- Synchronous callback execution
- Passing calculation results to callbacks
- Input validation with early `return`

---

### 1. Callback Function

**What it is:**  
A function passed as an argument into another function, intended to be executed after or during the parent function's execution.

**Why it was useful in this task:**  
Decouples calculation logic (`calculate`) from output handling (`callback`). The calculation function doesn't care how the result is displayed or processed; it simply delegates the result to the provided callback function.

**Example:**
```javascript
function calculate(a, b, operation, callback) {
    let result;
    if (operation === "add") result = a + b;
    else if (operation === "multiply") result = a * b;
    else if (operation === "subtract") result = a - b;
    else return console.error("Operation not supported");

    callback(result); // Executing the callback with calculation result
}

function printResult(res) {
    console.log("Result:", res);
}

calculate(10, 5, "add", printResult); // Output: Result: 15
```

---

### 2. Synchronous Callback Execution

**What it is:**  
A callback that executes immediately during the execution of the higher-order function, before `calculate()` returns.

**Why it is important to distinguish:**  
Unlike `fs.readFile()` or `setTimeout()`, this callback does NOT wait for any I/O or timer event. It runs synchronously on the main thread stack frame.

---

### How the Concepts Work Together

1. `calculate(10, 5, "add", callback)` is called on the main call stack.
2. The function evaluates `operation === "add"` and computes `c = 15`.
3. `calculate` immediately invokes `callback(15)`.
4. `callback(15)` prints `Result : 15`.
5. Execution resumes and `calculate` finishes.

---

### Important Things I Learned

- Callbacks can be synchronous or asynchronous depending on whether the host function performs asynchronous I/O or scheduling.
- Callbacks allow functions to remain flexible by delegating post-processing logic to the caller.

---

### Common Mistakes / Things to Remember

- **Forgetting to call the callback**: If `callback(c)` is omitted, the caller never receives the output.
- **Missing `return` after error logging**: If invalid operation is passed without `return`, code continues executing and invokes `callback(undefined)`.

---

## Task 2 — Async File Reader

### What the Task Required

Read three text files (`data/user.txt`, `data/skills.txt`, `data/projects.txt`) asynchronously using Node's built-in `fs.readFile()` and print their contents using callback functions.

### Concepts Used

- `fs.readFile()` (asynchronous file system API)
- Node.js Error-First Callback Pattern `(err, data)`
- Non-blocking I/O execution
- Early exit on error using `return`
- `path.join()` for safe path resolution

---

### 1. fs.readFile() Asynchronous API

**What it does:**  
Reads the entire contents of a file asynchronously without blocking the Node.js event loop thread.

**Why it was useful in this task:**  
Allows reading disk files in the background while Node.js remains free to handle other operations. When reading completes, Node.js triggers the provided callback.

**Syntax:**
```javascript
fs.readFile(path, encoding, callback);
```

**Example:**
```javascript
const fs = require('fs');
const path = require('path');

fs.readFile(path.join("data", "user.txt"), 'utf8', (err, data) => {
    if (err) {
        console.log("Error reading file:", err);
        return;
    }
    console.log("User:\n", data);
});
```

---

### 2. Node.js Error-First Callback Pattern `(err, data)`

**What it is:**  
The standard callback convention used across Node.js core modules. The first argument is reserved for an error object (`err`), and the second argument contains the successful data payload (`data`).

**Why it is used:**  
Provides a predictable, uniform way to handle errors across all asynchronous Node.js operations.

- If the operation succeeds: `err` is `null` / `undefined`, and `data` contains the file string.
- If the operation fails (e.g. file missing): `err` contains an `Error` object, and `data` is `undefined`.

---

### 3. Early Exit Using `return`

**What it does:**  
`if (err) { console.log(err); return; }` immediately terminates execution of the callback if an error occurs.

**Why it was useful in this task:**  
Prevents subsequent code from trying to log or process `undefined` data when file reading fails.

---

### How the Concepts Work Together

1. `fs.readFile` issues a non-blocking disk read request to the operating system thread pool.
2. Node.js continues executing any remaining main-line code without stopping.
3. When the OS finishes reading `user.txt`, the completion event is pushed to the Event Loop queue.
4. Node.js picks up the event and executes `(err, data) => { ... }`.
5. The callback checks `if (err)`. If clean, it prints `User:\n Saurabh`.

---

### Important Things I Learned

- Node.js core callbacks always put `err` first (`(err, data)`).
- Asynchronous callbacks run *after* the current call stack clears.

---

## Task 3 — Sequential File Reading

### What the Task Required

Ensure that three asynchronous file reads (`user.txt` -> `skills.txt` -> `projects.txt`) execute in **strict sequential order**, where each file starts reading only after the previous file read finishes.

### Concepts Used

- Nested asynchronous callbacks
- Sequential control flow using callback dependency
- Preserving asynchronous execution order

---

### 1. Sequential Asynchronous Execution via Nesting

**Why Nesting is Required:**  
Because `fs.readFile()` is non-blocking, calling three `fs.readFile()` functions sequentially outside callbacks would fire all three operations concurrently, making execution order unpredictable.

To guarantee that `skills.txt` is read **only after** `user.txt` finishes, `fs.readFile('skills.txt')` MUST be placed inside the completion callback of `fs.readFile('user.txt')`.

**Code Structure:**
```javascript
fs.readFile(path.join("data", "user.txt"), 'utf8', (err, userData) => {
    if (err) return console.log(err);
    console.log("User:\n", userData);

    // Second operation starts inside first callback
    fs.readFile(path.join("data", "skills.txt"), 'utf8', (err, skillsData) => {
        if (err) return console.log(err);
        console.log("Skills:\n", skillsData);

        // Third operation starts inside second callback
        fs.readFile(path.join("data", "projects.txt"), 'utf8', (err, projectData) => {
            if (err) return console.log(err);
            console.log("Projects:\n", projectData);
        });
    });
});
```

---

### Data & Execution Flow

```
Start user.txt read
        ↓ (asynchronous wait)
user.txt Callback executes -> Print User Data
        ↓
Start skills.txt read
        ↓ (asynchronous wait)
skills.txt Callback executes -> Print Skills Data
        ↓
Start projects.txt read
        ↓ (asynchronous wait)
projects.txt Callback executes -> Print Projects Data
```

---

### Important Things I Learned

- In callback-based asynchronous Node.js, dependency and sequence are enforced through **nesting**.
- Independent async calls run concurrently; nested async calls run sequentially.

---

## Task 4 — Create Your First Callback Hell

### What the Task Required

Create three functions (`getUser`, `getOrders`, `getOrderDetails`) simulating asynchronous delays using `setTimeout(..., 1000)`. Chain them sequentially using nested callbacks to experience the "Pyramid of Doom" / Callback Hell structure.

### Concepts Used

- Asynchronous delay simulation using `setTimeout()`
- Event Loop timer scheduling
- 3-level Callback Nesting (Pyramid of Doom)
- Sequential asynchronous workflow chaining

---

### 1. Simulating Async Operations with setTimeout()

**What it does:**  
`setTimeout(fn, delay)` schedules a callback function to run after at least `delay` milliseconds.

**Why it was useful in this task:**  
Simulates network requests or database queries that take 1 second to respond, demonstrating how asynchronous callbacks handle delayed operations.

---

### 2. The 3-Level Callback Pyramid

**Solution Code:**
```javascript
getUser(() => {
    getOrders(() => {
        getOrderDetails(() => {
            console.log("Process completed!");
        });
    });
});
```

**Why the Code Forms a Pyramid:**  
Each step depends on the completion of the previous step. To ensure Step 2 runs after Step 1, Step 2 is nested inside Step 1's callback. As steps increase, the code shifts progressively to the right.

---

### Important Things I Learned

- Nesting asynchronous callbacks creates indentation growth ("rightward drift").
- Each nested callback adds another level of closure scope to manage.

---

## Task 5 — Realistic Callback Hell Challenge

### What the Task Required

Build a fake e-commerce backend pipeline simulating a multi-step data dependency chain:
1. `getUser(id, callback)` (Find user by ID)
2. `getOrders(userId, callback)` (Find orders by User ID)
3. `getOrder(orderId, callback)` (Find specific order details)
4. `getProduct(productId, callback)` (Find product details)
5. `getReviews(productId)` (Fetch product reviews)

Each operation simulates a 1-second delay using `setTimeout()`, validating parameters at each step.

### Concepts Used

- 5-level deep callback nesting (Full Callback Hell)
- Data validation inside async callbacks
- Inter-callback state and parameter passing
- Handling nested error/validation exits

---

### 1. The 5-Level Callback Pyramid (Used in Solution)

```javascript
getUser(1, () => {
    getOrders(2, () => {
        getOrder(101, () => {
            getProduct(1, () => {
                getReviews(1);
            });
        });
    });
});
```

---

### Data Dependency Chain

```
getUser(1)
   ↓ (1 second) -> Validates User ID
getOrders(2)
   ↓ (1 second) -> Validates User ID & Prints User Name
getOrder(101)
   ↓ (1 second) -> Validates Order ID & Prints Order Number
getProduct(1)
   ↓ (1 second) -> Validates Product ID & Prints Product Name
getReviews(1)
   ↓ (1 second) -> Prints Product Reviews Object
```

---

### Why This Structure Demonstrates Callback Hell

1. **Deep Indentation**: Code drifts far to the right, reducing readability.
2. **Brace Noise**: Closing brackets `})` pile up at the end (`}) }) }) })`).
3. **Repetitive Error Handling**: Each level requires its own error/validation check (`if (data["Id"] !== id)`).
4. **Fragile Scope**: Variables from inner callbacks cannot be easily accessed outside without passing parameters through multiple levels.
5. **Coupling**: Functions become tightly coupled with their execution environment, making unit testing and refactoring difficult.

---

### Common Mistakes / Things to Remember

- **Missing parameters**: Forgetting to pass IDs down the chain causes lookup failures in subsequent steps.
- **Forgetting `return` on failure**: If validation fails (`data["Id"] !== id`), failing to `return` lets the callback execute anyway, producing erroneous output.

---

### Improvement Note

*Possible Improvement (Not present in original solution, but recommended for production):*  
Using **Promises** or **async/await** flattens the pyramid into a readable linear sequence:

```javascript
// Example using async/await alternative:
async function runPipeline() {
    try {
        await getUser(1);
        await getOrders(2);
        await getOrder(101);
        await getProduct(1);
        await getReviews(1);
        console.log("Process completed!");
    } catch (err) {
        console.error("Pipeline failed:", err);
    }
}
```

---

## Bonus — Escape Callback Hell

### What the Task Required

Reflect on the 5-level nested callback structure from Task 5 and understand why Node.js introduced **Promises** and **async/await**.

### Key Concept: Evolution of Asynchronous Patterns

```
Callbacks (Nested / Pyramid of Doom)
    ↓
Promises (.then() chaining / flat flow)
    ↓
async / await (Synchronous-looking linear code)
```

---

# Node.js Error-First Callback Pattern

In Node.js, asynchronous callbacks follow a strict standard known as the **Error-First Callback Pattern**:

```javascript
function callbackName(err, data) {
    if (err) {
        // 1. Handle error
        return;
    }
    // 2. Process data
}
```

### Rules of Error-First Callbacks

1. **First Argument is `err`**: If an error occurred during execution, `err` will be an `Error` object. If successful, `err` is `null` or `undefined`.
2. **Second (and later) Arguments are Results**: Payload data (`data`, `result`) is passed starting from the second parameter.
3. **Check `err` First**: Always check `if (err)` before attempting to access `data`.
4. **Use Early `return`**: Terminate callback execution immediately after handling an error to prevent executing success logic with corrupted or missing data.

---

# Asynchronous Callback Execution

```
+-----------------------------------------------------------------------+
|                             CALL STACK                                |
|                                                                       |
| 1. fs.readFile('file.txt', callback) -> Handed off to OS/Worker Thread |
| 2. Main script finishes executing. Call stack becomes EMPTY.          |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                            EVENT LOOP                                 |
|                                                                       |
| Checks if Call Stack is empty and I/O tasks are finished.             |
| Picks callback from Task Queue and pushes to Call Stack.              |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                     CALLBACK EXECUTION STACK                          |
|                                                                       |
| (err, data) => { console.log(data); } runs here.                       |
+-----------------------------------------------------------------------+
```

### Key Asynchronous Execution Behaviors

- **Non-blocking**: Initiating an asynchronous operation (`fs.readFile`, `setTimeout`) returns control immediately.
- **Event Loop Scheduling**: Asynchronous callbacks do NOT run immediately. They wait in the Event Loop queue until the current call stack is completely empty.

---

# Sequential Asynchronous Operations

When asynchronous tasks have dependencies (Task B depends on the output of Task A), they must run **sequentially**.

### Sequential vs Concurrent Asynchronous Flow

#### Concurrent (Independent):
```javascript
// Both operations start simultaneously
fs.readFile('fileA.txt', callbackA);
fs.readFile('fileB.txt', callbackB);
```

#### Sequential (Dependent):
```javascript
// fileB read starts ONLY when fileA callback fires
fs.readFile('fileA.txt', (err, dataA) => {
    fs.readFile('fileB.txt', (err, dataB) => {
        // Sequential completion
    });
});
```

---

# Callback Hell

### What is Callback Hell?

Callback Hell (also known as the **Pyramid of Doom**) occurs when multiple dependent asynchronous operations are chained via deeply nested callbacks, producing heavily indented, hard-to-read, and brittle code.

### Summary of Problems Caused by Callback Hell

| Problem | Cause | Impact |
|---|---|---|
| **Deep Indentation** | Every sequential operation adds a new level of nesting | Code drifts off the screen horizontally |
| **Scattered Error Handling** | Every nested level requires its own `if (err)` check | Missed errors or repetitive logging code |
| **Variable Shadowing** | Reusing parameter names like `(err, data)` in nested scopes | Accidental references to outer variables |
| **Coupling & Maintenance** | Reordering or adding steps requires restructuring all levels | Fragile code that is difficult to refactor |

---

# Callback vs Promises vs Async/Await

| Feature | Callbacks | Promises | Async / Await |
|---|---|---|---|
| **Syntax Style** | Nested functions | Method chaining (`.then()`) | Synchronous-like try/catch |
| **Error Handling** | Repetitive `if (err)` per callback | Single `.catch()` block | Standard `try { ... } catch(err)` |
| **Control Flow** | Deeply nested (Pyramid) | Flat linear chain | Clean vertical code |
| **Readability** | Poor for multi-step pipelines | Good | Excellent |
| **Node.js History** | Original asynchronous pattern | Introduced in ES6 (2015) | Introduced in ES8 / Node 8+ |

---

# Overall Concepts Learned

## Callback Fundamentals

- Callback functions (functions passed as arguments to other functions).
- Higher-order functions executing callbacks.
- Synchronous callbacks (executed immediately on main stack).
- Asynchronous callbacks (scheduled via Event Loop after I/O or timers).

## Node.js Callback Patterns

- Node.js Error-First Callback convention `(err, data)`.
- Checking `if (err)` before processing results.
- Terminating callbacks early using `return`.
- Passing data through callback parameters.

## Control Flow & Callback Hell

- Concurrent vs Sequential asynchronous execution.
- Nested callbacks for dependent operations.
- Recognizing Callback Hell (Pyramid of Doom).
- Understanding code readability and maintenance limitations of deeply nested callbacks.

---

# Quick Revision

### Important Callback Patterns

#### 1. Custom Synchronous Callback Pattern
```javascript
function processData(input, callback) {
    const result = input * 2;
    callback(result);
}

processData(5, res => console.log(res)); // Output: 10
```

#### 2. Node.js Error-First Asynchronous Callback Pattern
```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Operation failed:', err);
        return;
    }
    console.log('File Content:', data);
});
```

#### 3. Sequential Callback Chain Pattern (Callback Hell)
```javascript
asyncTask1((err, result1) => {
    if (err) return handleError(err);
    
    asyncTask2(result1, (err, result2) => {
        if (err) return handleError(err);
        
        asyncTask3(result2, (err, result3) => {
            if (err) return handleError(err);
            console.log('Final Result:', result3);
        });
    });
});
```

---

# What I Can Do After These Tasks

Based on the completed tasks and implementations:

1. **Write Custom Callback Functions**: Implement higher-order functions that accept and execute callback functions.
2. **Use Callback-Based Node.js APIs**: Consume core Node.js callback APIs like `fs.readFile()`.
3. **Apply Error-First Conventions**: Handle errors predictably using `(err, data)` signatures and early `return` statements.
4. **Implement Sequential Async Flows**: Chain dependent asynchronous steps using nested callbacks.
5. **Simulate Async Delays**: Model asynchronous asynchronous workflows using `setTimeout()`.
6. **Identify Callback Hell**: Recognize the architectural drawbacks, indentation drift, and maintenance issues of the Pyramid of Doom.
7. **Understand the Need for Modern Alternatives**: Articulate why Promises and `async`/`await` were created to replace deeply nested callbacks.

---

# Connection to Later Node.js Concepts

```
Callbacks & Error-First Pattern (Current Module)
       ↓
Promises & .then() Chaining (Module 04)
       ↓
async / await Syntax (Module 04)
       ↓
EventEmitter & Event-Driven Architecture (Module 05)
```

Understanding raw callbacks is essential because:
- Core Node.js low-level APIs and legacy packages use callbacks under the hood.
- Promises and `async`/`await` are abstractions built directly on top of Node.js's callback-based Event Loop architecture.
