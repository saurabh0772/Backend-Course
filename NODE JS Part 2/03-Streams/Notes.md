# Node.js Streams — Detailed Notes

Streams are one of the most important concepts in Node.js, especially for files, HTTP, videos, uploads/downloads, and network communication.

---

## 1. What is a Stream?

A Stream is a way of handling data piece by piece (in chunks) instead of loading the entire data into memory at once.

### Without Streams

Suppose you have a 1 GB file:

```text
1 GB File
   ↓
Read entire file
   ↓
1 GB loaded into RAM
   ↓
Process it
```

This can consume a lot of memory.

### With Streams

```text
1 GB File
   ↓
Chunk 1 → process
Chunk 2 → process
Chunk 3 → process
Chunk 4 → process
...
```

Only a small portion of the file needs to be handled at a time.

### Simple Definition

> **Stream** = A continuous flow of data processed in small chunks.

---

## 2. Why Do We Need Streams?

Consider:

```javascript
fs.readFile("large-video.mp4", (err, data) => {
    // data contains the whole file
});
```

If the file is 2 GB, Node.js attempts to give you the entire file as one piece of data.

With a stream:

```javascript
const stream = fs.createReadStream("large-video.mp4");
```

Node.js reads the file progressively:

```text
File
 │
 ├── Chunk 1
 ├── Chunk 2
 ├── Chunk 3
 ├── Chunk 4
 └── ...
```

### Main Advantages

- Lower memory usage
- Can start processing before the entire file is available
- Useful for large files
- Useful for network communication
- Useful for video/audio streaming
- Useful for file uploads/downloads

---

## 3. What is a Chunk?

A chunk is a small piece of data received from a stream.

For example:

```text
Large File
──────────────────────────────
│ Chunk 1 │ Chunk 2 │ Chunk 3 │
──────────────────────────────
```

In Node.js, chunks are commonly represented as `Buffer` objects when dealing with binary data.

This connects directly to buffers:

```text
Buffer
  ↓
represents raw bytes

Stream
  ↓
delivers those bytes chunk by chunk
```

---

## 4. Types of Streams

Node.js mainly has four important stream types:

```text
Streams
   │
   ├── Readable
   ├── Writable
   ├── Duplex
   └── Transform
```

Let's understand each.

---

## 5. Readable Stream

A Readable Stream is used to read data from a source.

### Examples:
- Reading a file
- Receiving HTTP request data
- Reading data from a network connection

### Example:

```javascript
import fs from "fs";

const readStream = fs.createReadStream("input.txt");
```

Here:

```text
input.txt
    ↓
Readable Stream
    ↓
Chunks
```

### Reading Chunks

You can listen for the `data` event:

```javascript
import fs from "fs";

const readStream = fs.createReadStream("input.txt");

readStream.on("data", (chunk) => {
    console.log(chunk);
});
```

Each time Node.js has a chunk available, the callback runs.

For a text file, you might see:

```text
<Buffer 48 65 6c 6c 6f ...>
<Buffer 20 4e 6f 64 65 ...>
```

The exact chunk sizes depend on the stream and environment.

### Converting the Chunk to Text

Because the chunk may be a Buffer:

```javascript
readStream.on("data", (chunk) => {
    console.log(chunk.toString());
});
```

Now you can see the actual text.

---

## 6. The `data` Event

The `data` event is emitted whenever a chunk of data is available.

```javascript
readStream.on("data", (chunk) => {
    console.log("Received chunk:");
    console.log(chunk.toString());
});
```

**Flow:**

```text
File
 ↓
Readable Stream
 ↓
chunk
 ↓
"data" event
 ↓
your callback
```

---

## 7. The `end` Event

When the Readable Stream has finished reading all the data, the `end` event occurs.

```javascript
readStream.on("end", () => {
    console.log("Finished reading!");
});
```

### Complete Example:

```javascript
import fs from "fs";

const readStream = fs.createReadStream("input.txt");

readStream.on("data", (chunk) => {
    console.log("Chunk:", chunk.toString());
});

readStream.on("end", () => {
    console.log("Finished reading");
});
```

**Flow:**

```text
data
 ↓
chunk 1
 ↓
data
 ↓
chunk 2
 ↓
data
 ↓
chunk 3
 ↓
end
```

---

## 8. Writable Stream

A Writable Stream is used to write data somewhere.

### Examples:
- Writing to a file
- Sending data to another destination
- HTTP response

### Create a Writable Stream:

```javascript
import fs from "fs";

const writeStream = fs.createWriteStream("output.txt");
```

Now you can write data:

```javascript
writeStream.write("Hello");
writeStream.write(" Node.js");
```

The file will contain:

```text
Hello Node.js
```

---

## 9. `write()` Method

The basic method for sending data to a Writable Stream is:

```javascript
writeStream.write(data);
```

### Example:

```javascript
import fs from "fs";

const writeStream = fs.createWriteStream("output.txt");

writeStream.write("Hello\n");
writeStream.write("This is Node.js\n");
writeStream.write("Streams are useful\n");
```

---

## 10. `end()` Method

When you're finished writing:

```javascript
writeStream.end();
```

### Example:

```javascript
import fs from "fs";

const writeStream = fs.createWriteStream("output.txt");

writeStream.write("Hello\n");
writeStream.write("Node.js\n");

writeStream.end();
```

Think of it as:

```text
write()
write()
write()
  ↓
end()
  ↓
Finished
```

---

## 11. Readable + Writable Together

Now we can connect the two concepts.

Suppose you want to copy:

```text
input.txt → output.txt
```

You could read and write manually:

```javascript
import fs from "fs";

const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.on("data", (chunk) => {
    writeStream.write(chunk);
});

readStream.on("end", () => {
    writeStream.end();
});
```

**Flow:**

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

This works. But Node.js provides a much easier way.

---

## 12. `pipe()`

`pipe()` connects a Readable Stream to a Writable Stream.

Instead of:

```javascript
readStream.on("data", (chunk) => {
    writeStream.write(chunk);
});

readStream.on("end", () => {
    writeStream.end();
});
```

You can simply do:

```javascript
readStream.pipe(writeStream);
```

### Complete Example:

```javascript
import fs from "fs";

const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.pipe(writeStream);
```

That's one of the most important Stream patterns in Node.js.

---

## 13. How `pipe()` Works

Think:

```text
              pipe()
Readable ───────────────→ Writable
   │                         │
   ↓                         ↓
 chunks                    output
```

For example:

```text
input.txt
   ↓
Readable Stream
   ↓
Chunk 1 ──────────→ Writable
   ↓
Chunk 2 ──────────→ Writable
   ↓
Chunk 3 ──────────→ Writable
   ↓
...
   ↓
output.txt
```

`pipe()` handles the flow between them.

---

## 14. Backpressure

This is an important Stream concept.

Imagine:

```text
Readable
produces 100 chunks/sec
       ↓
       ↓
Writable
can process 20 chunks/sec
```

The source is producing data much faster than the destination can handle it.

That's where backpressure occurs:

```text
Producer
100/sec
   ↓
   ↓
Consumer
20/sec
```

If data keeps arriving faster than it can be consumed, data can build up in memory.

---

## 15. Why Backpressure Matters

Without proper flow control:

```text
Source
  ↓
Too much data
  ↓
Buffering
  ↓
Memory usage increases
  ↓
Potential performance problems
```

A stream system needs to regulate the flow.

When the destination cannot keep up, the source needs to slow down/pause until the destination is ready again.

### Simple Definition

> **Backpressure** is the mechanism used when a destination cannot consume data as quickly as the source produces it.

---

## 16. `pipe()` and Backpressure

One major benefit of:

```javascript
readStream.pipe(writeStream);
```

is that Node.js manages the flow between the streams, including backpressure.

Conceptually:

```text
Readable
   │
   │ chunks
   ↓
 pipe()
   │
   ↓
Writable
   │
   ├── Can keep up → continue
   │
   └── Too slow → flow is controlled
```

You therefore don't normally need to manually implement flow control for a basic file-copy operation.

---

## 17. Duplex Stream

A Duplex Stream can be both:

```text
Readable + Writable
```

That means you can:
- Write data into it
- Read data from it

Think about a network connection:

```text
        Network Socket
        ↙           ↘
   Receive         Send
   data            data
```

So:

> **Duplex** = Read + Write

### Example Concept:

```javascript
socket.write("Hello");
```

while you can also receive data from the socket.

*(You don't need to implement custom Duplex streams yet.)*

---

## 18. Transform Stream

A Transform Stream is a special type of Duplex Stream that changes the data as it passes through.

```text
Input
  ↓
Transform
  ↓
Modified Output
```

Example:

```text
"hello"
   ↓
Transform
   ↓
"HELLO"
```

Another real-world example:

```text
Large data
    ↓
Gzip compression
    ↓
Compressed data
```

Node.js provides Transform streams for things like compression, encryption, data processing, etc.

---

## 19. Duplex vs Transform

This distinction is important:

### Duplex
```text
Read ↔ Write
```
It can independently read and write.

### Transform
```text
Input
  ↓
Process/modify
  ↓
Output
```
It specifically transforms the data passing through it.

So:
- **Duplex** = Read + Write
- **Transform** = Read + Modify + Write

---

## 20. Complete Stream Architecture

Now put everything together:

```text
                    STREAMS
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Readable        Writable        Duplex
        │              │              │
    Read data       Write data    Read + Write
                                       │
                                       ↓
                                  Transform
                                       │
                                  Modify data
```

---

## 21. Real-World Example — File Copy

Suppose `video.mp4` is a 2 GB file.

### Using `readFile()`:

```text
2 GB file
   ↓
readFile()
   ↓
2 GB Buffer
   ↓
RAM
```

### Using Streams:

```text
video.mp4
   ↓
Readable Stream
   ↓
Chunk
   ↓
Writable Stream
   ↓
output.mp4
```

Only chunks are processed progressively.

---

## 22. Real-World Example — HTTP

Streams are also heavily used in HTTP.

An HTTP request/response can contain data that arrives progressively.

Conceptually:

```text
Client
  ↓
HTTP Request
  ↓
Readable Stream
  ↓
Server
```

And:

```text
Server
  ↓
HTTP Response
  ↓
Writable Stream
  ↓
Client
```

This is one reason Streams are so important in Node.js backend development.

---

## 23. `fs.readFile()` vs `createReadStream()`

This is an important comparison.

### `fs.readFile()`

```javascript
fs.readFile("large.txt", (err, data) => {
    console.log(data);
});
```

**Conceptually:**

```text
File
 ↓
Entire file
 ↓
Buffer
```

### `createReadStream()`

```javascript
const stream = fs.createReadStream("large.txt");

stream.on("data", (chunk) => {
    console.log(chunk);
});
```

**Conceptually:**

```text
File
 ↓
Chunk
 ↓
Chunk
 ↓
Chunk
 ↓
Chunk
```

### Quick Comparison

| Feature / Scenario | `readFile()` | Stream (`createReadStream()`) |
| :--- | :--- | :--- |
| **Data Reading** | Reads entire data at once | Reads data in chunks |
| **Memory Usage** | High memory usage for large files | Efficient memory usage |
| **Complexity** | Simple API | Better suited for large / continuous data |
| **Best For** | Small files | Large files, network transfers, real-time data |

---

## 24. Important Stream Events

For your current level, remember these:

### Readable Events

- `readStream.on("data", callback);` — Data chunk available.
- `readStream.on("end", callback);` — No more data.
- `readStream.on("error", callback);` — Something went wrong.

### Example:

```javascript
readStream.on("data", (chunk) => {
    console.log(chunk);
});

readStream.on("end", () => {
    console.log("Done");
});

readStream.on("error", (err) => {
    console.log(err);
});
```

---

## 25. Important Stream Methods

### Readable
```javascript
readStream.on("data", ...);
readStream.pipe(...);
```

### Writable
```javascript
writeStream.write(...);
writeStream.end(...);
```

> [!NOTE]
> Don't try to memorize every Stream API method yet.

---

## 26. One Complete Example

Let's copy a file using a stream:

```javascript
import fs from "fs";

const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.on("error", (err) => {
    console.log("Read error:", err);
});

writeStream.on("error", (err) => {
    console.log("Write error:", err);
});

readStream.pipe(writeStream);

writeStream.on("finish", () => {
    console.log("File copied successfully!");
});
```

**Flow:**

```text
input.txt
    ↓
createReadStream()
    ↓
Readable Stream
    ↓
   pipe()
    ↓
Writable Stream
    ↓
output.txt
    ↓
  finish
```

---

## 🧠 Final Mental Model

If you remember nothing else, remember this:

```text
                 STREAM
                   │
       Data is handled in CHUNKS
                   │
       ┌───────────┴───────────┐
       ↓                       ↓
   READABLE                 WRITABLE
   Read data                Write data
       │                       │
       └──────────┬────────────┘
                  ↓
                pipe()
                  ↓
           Connect streams
                  │
                  ↓
            Backpressure
       Controls data flow when
       destination is slower
```

And:

- **Readable** = Read
- **Writable** = Write
- **Duplex** = Read + Write
- **Transform** = Read + Modify + Write
- **pipe()** = Connect
- **Backpressure** = Control the flow when consumer is slower
- **Chunk** = Small piece of data