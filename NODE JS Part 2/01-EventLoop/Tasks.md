# Event Loop — Practice Tasks

## Task 1: Sync vs Async

### Objective
Understand the execution difference between synchronous operations and asynchronous timer callbacks.

### Instructions
1. Create a script with synchronous `console.log()` statements and a `setTimeout(..., 0)`.
2. Predict the exact output before running the file.
3. Run the script and explain why the output occurred in that order.

### Code:
```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

### Questions to Answer:
- What is the printed output?
- Why does `"B"` print after `"C"`, even though the timer delay is `0` milliseconds?

---

## Task 2: Microtasks vs Timers

### Objective
Learn how the **Microtask Queue** (Promises) has higher execution priority over the **Timer Macrotask Queue** (`setTimeout`).

### Instructions
1. Create a script combining:
   - `console.log()` (Synchronous)
   - `setTimeout(..., 0)` (Timer Macrotask)
   - `Promise.resolve().then(...)` (Microtask)
2. Predict the output order before executing.
3. Run the script and verify your prediction.

### Code:
```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

### Questions to Answer:
- What is the output order?
- Why does `Promise.then()` run before `setTimeout()`, even when both callbacks are ready?

---

## Task 3: Final Challenge — Complete Priority Order

### Objective
Master the full execution hierarchy of Node.js asynchronous primitives:
- Synchronous code
- `process.nextTick()`
- `Promise` microtasks
- `setTimeout()` (Timer phase)
- `setImmediate()` (Check phase)

### Execution Hierarchy:
```text
Synchronous Code
       ↓
process.nextTick()
       ↓
Promise (.then / .catch)
       ↓
Timer / Immediate
```

### Instructions
1. Write a program that uses all four asynchronous primitives together:
   - `process.nextTick()`
   - `Promise.resolve().then()`
   - `setTimeout()`
   - `setImmediate()`
2. Predict the execution order, run the code, and explain why.

### Starter Template:
```javascript
console.log("Start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

setImmediate(() => {
  console.log("setImmediate");
});

Promise.resolve().then(() => {
  console.log("Promise.then");
});

process.nextTick(() => {
  console.log("process.nextTick");
});

console.log("End");
```

### Challenge Checklist:
- [ ] Predict the output order
- [ ] Run with `node filename.js`
- [ ] Explain why `process.nextTick` executes before `Promise.then`
- [ ] Explain how `setTimeout` vs `setImmediate` behaves in the main module vs within an I/O cycle

---

> [!TIP]
> Once you can accurately explain these three scenarios, your foundation for the Node.js Event Loop is complete!