# 🧪 Node.js Streams — Complete Practice Set

## Level 1 — Understand Readable Streams

### Task 1 — Read a File as a Stream

Create `sample.txt` with around 5–10 lines.

Use:

```javascript
fs.createReadStream()
```

Print every chunk using the `data` event.

Also print:

```text
Finished reading
```

when the `end` event occurs.

#### Goal

Understand:

```text
File
 ↓
Readable Stream
 ↓
data → chunk
 ↓
data → chunk
 ↓
end
```

---

### Task 2 — Inspect the Chunks

Modify Task 1.

For every chunk, print:

```text
Chunk:
<actual chunk>

Is Buffer:
true

Chunk size:
<number>
```

Use:

```javascript
Buffer.isBuffer(chunk)
```

and:

```javascript
chunk.length
```

#### Goal

Connect what you learned about Buffers with Streams.

You should understand:
> A Readable Stream commonly gives you data in chunks, and those chunks are often Buffers.

---

## Level 2 — Writable Streams

### Task 3 — Write Using a Writable Stream

Create:
- `output.txt`

Use:

```javascript
fs.createWriteStream()
```

Write several pieces of text:
- `Hello Node.js`
- `Streams are interesting`
- `I am learning backend development`

Use:

```javascript
writeStream.write()
```

and finish with:

```javascript
writeStream.end()
```

Listen for the `finish` event and print:

```text
Writing completed
```

#### Goal

Understand:

```text
Your program
    ↓
Writable Stream
    ↓
output.txt
```

---

## Level 3 — Read + Write

### Task 4 — Copy a File Manually

Now combine Readable + Writable.

```text
input.txt
    ↓
Readable Stream
    ↓
chunk
    ↓
Writable Stream
    ↓
output.txt
```

Use:

```javascript
readStream.on("data", ...)
```

and:

```javascript
writeStream.write(chunk)
```

When reading finishes:

```javascript
writeStream.end()
```

> [!IMPORTANT]
> Do not use `pipe()` yet.  
> The purpose is to understand what `pipe()` is doing internally at a basic level.

---

## Level 4 — pipe()

### Task 5 — Copy a File Using `pipe()`

Now replace your manual implementation from Task 4 with:

```javascript
readStream.pipe(writeStream);
```

That's it.

Add an appropriate completion event so you know when writing is finished.

#### Compare

**Task 4:**

```text
Readable
   ↓
data event
   ↓
write()
   ↓
end()
```

**Task 5:**

```text
Readable
   ↓
 pipe()
   ↓
Writable
```

#### Goal

Understand why `pipe()` is useful.

---

## Level 5 — Transform Streams

### Task 6 — Uppercase Transform

Create `input.txt` containing:

```text
hello node.js
streams are powerful
i am learning backend development
```

Create a Transform Stream that converts everything to uppercase.

**Flow:**

```text
input.txt
    ↓
Readable
    ↓
Transform
    ↓
uppercase
    ↓
Writable
    ↓
output.txt
```

Expected `output.txt`:

```text
HELLO NODE.JS
STREAMS ARE POWERFUL
I AM LEARNING BACKEND DEVELOPMENT
```

Use:

```javascript
import { Transform } from "stream";
```

#### Goal

Understand:
> Transform streams receive data, modify it, and produce new data.

---

### Task 7 — Transform Data Yourself

Make a Transform Stream that adds a prefix to every chunk.

For example:

**Input:**
```text
Hello
Node.js
Streams
```

**Output:**
```text
[DATA] Hello
[DATA] Node.js
[DATA] Streams
```

Connect it:

```text
Readable
   ↓
Transform
   ↓
Writable
```

#### Goal

Don't just copy the previous task. Understand the `transform()` method and what chunk represents.

---

## Level 6 — Error Handling + Real Understanding

### Task 8 — Handle Stream Errors

Create a Readable Stream for a file that doesn't exist:

```javascript
fs.createReadStream("does-not-exist.txt");
```

Listen for `"error"` and print a friendly message:

```text
Failed to read file
```

Then add error handling to your previous file-copy program.

#### Goal

Understand that Streams are asynchronous and can emit errors.

---

## ⭐ Optional Challenge — Backpressure

> Don't worry if this one feels difficult.

### Task 9 — Understand `write()` Return Value

Create a Writable Stream and repeatedly write a large amount of data.

Check:

```javascript
const canContinue = writeStream.write(data);
console.log(canContinue);
```

Understand that `write()` can return:
- `true`
- or `false`

Research/learn why `false` matters and how the `drain` event is involved.

You don't need to implement a perfect backpressure system yet.

The important concept is:

```text
Producer
   ↓
produces faster
   ↓
Writable
   ↓
buffer becoming full
   ↓
write() → false
   ↓
wait
   ↓
"drain"
   ↓
continue
```

---

## 🏆 Final Challenge

After completing Tasks 1–9, build this:

### Task 10 — Mini File Processing Pipeline

Create `input.txt` with several lines.

Build:

```text
input.txt
    ↓
Readable Stream
    ↓
Transform Stream
    ↓
Convert text to uppercase
    ↓
Transform Stream
    ↓
Add "[PROCESSED]" to each line
    ↓
Writable Stream
    ↓
output.txt
```

Expected:

```text
[PROCESSED] HELLO NODE.JS
[PROCESSED] STREAMS ARE POWERFUL
[PROCESSED] I AM LEARNING BACKEND DEVELOPMENT
```

Use multiple `.pipe()` calls.

Conceptually:

```javascript
readStream
    .pipe(transform1)
    .pipe(transform2)
    .pipe(writeStream);
```

---

## 🧠 What You'll Know After These Tasks

```text
                    NODE.JS STREAMS
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
         Readable       Writable       Duplex
             │             │
          read data     write data
             │             │
             └──────┬──────┘
                    ↓
                  pipe()
                    ↓
             Connect streams
                    │
                    ↓
               Transform
                    │
              Modify data
                    │
                    ↓
              Backpressure
                    │
          Control data flow
```

And you'll have practiced:

| Task | Concept |
| :---: | :--- |
| 1 | Readable Stream |
| 2 | Chunks + Buffer |
| 3 | Writable Stream |
| 4 | Manual Read → Write |
| 5 | `pipe()` |
| 6 | Transform Stream |
| 7 | Custom Transform |
| 8 | Error handling |
| 9 | Backpressure |
| 10 | Complete pipeline |