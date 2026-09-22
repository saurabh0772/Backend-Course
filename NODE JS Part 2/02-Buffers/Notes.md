# Buffers — Notes

## What is a Buffer?

A **Buffer** is Node.js's built-in mechanism for handling and manipulating raw binary data directly in memory.

In standard JavaScript (in browsers), developers primarily work with high-level data types like strings and objects:
```javascript
const name = "Saurabh";
```

However, at the machine and system level, computers communicate and store data purely as **bytes** (sequences of bits):
```text
01001000 01100101 ...
```

Because JavaScript originally lacked built-in support for binary streams, Node.js introduced the global `Buffer` class (allocated outside the V8 heap in raw memory) to efficiently handle binary operations.

---

## Where Node.js Uses Buffers

Buffers are used whenever Node.js interacts with binary I/O, streams, or low-level data:
- 📁 **Files**: Reading and writing files using the `fs` module
- 🖼️ **Images & Videos**: Processing media assets and attachments
- 🌐 **Network Packets**: Working with TCP/UDP sockets and HTTP request/response payloads
- 🔄 **TCP Streams**: Handling incoming and outgoing chunked streams
- 📤 **File Uploads**: Parsing multipart form uploads (e.g., via Multer)
- 🔐 **Cryptography**: Managing encryption keys, hashes, and cipher streams

---

## Basic Usage

### Creating a Buffer from a String
```javascript
const buffer = Buffer.from("Hello");

console.log(buffer);
// Output: <Buffer 48 65 6c 6c 6f>
```

> **Note:** The output `<Buffer 48 65 6c 6c 6f>` represents the characters `'H'`, `'e'`, `'l'`, `'l'`, `'o'` encoded in hexadecimal format (e.g., `48` hex = `72` decimal = ASCII `'H'`).

### Converting a Buffer Back to a String
```javascript
console.log(buffer.toString());
// Output: Hello
```

---

## Important Buffer Concepts & Methods

| Method / Property | Description | Example |
| :--- | :--- | :--- |
| `Buffer.from(data)` | Creates a buffer from a string, array, or existing buffer. | `Buffer.from("Hello")` |
| `Buffer.alloc(size)` | Allocates a zero-filled buffer of `size` bytes. | `Buffer.alloc(10)` |
| `buffer.toString([encoding])` | Decodes the buffer into a string (default: `'utf-8'`). | `buffer.toString("utf-8")` |
| `buffer.length` | Returns the total allocated size of the buffer in bytes. | `buffer.length` |
| `buffer[index]` | Accesses or updates the byte value (0–255) at the given index. | `buffer[0]` |

---

## Inspecting Individual Bytes

When accessing a Buffer element by index, it returns the raw byte as an integer (0 to 255):

```javascript
const buffer = Buffer.from("ABC");

console.log(buffer[0]); // 65 (ASCII decimal code for 'A')
console.log(buffer[1]); // 66 (ASCII decimal code for 'B')
console.log(buffer[2]); // 67 (ASCII decimal code for 'C')
```

Each index represents one byte in memory.