# Node.js — HTTP Module

## Mini Task — Response Types

### What the Task Required

The task required building an HTTP server that serves three different content types based on the requested URL path:
- `/text`: Returns plain text (`Hello, this is plain text`) with `Content-Type: text/plain`.
- `/html`: Returns HTML markup (`<h1>Hello from Node.js</h1>`) rendered by the browser with `Content-Type: text/html`.
- `/json`: Returns a JSON object containing profile details with `Content-Type: application/json`.
- Unknown routes (e.g., `/hello`): Returns a `404 Not Found` plain text response.

### Concepts Used

- `http.createServer()`
- `req.url`
- `res.writeHead()`
- `Content-Type` response header
- `JSON.stringify()`
- `res.end()`
- `server.listen()`

---

### 1. http.createServer()

**What it does:**  
Creates a new instance of `http.Server`. It takes a request listener callback function that Node.js automatically executes every time an HTTP request hits the server.

**Why it was useful in this task:**  
It serves as the foundation for handling incoming HTTP requests and building responses.

**Syntax & Callback Signature:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // req: http.IncomingMessage (Request object)
    // res: http.ServerResponse (Response object)
});
```

**Example:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.end("Server active");
});
```

---

### 2. req.url

**What it contains:**  
A string containing the URL path and query string of the incoming request (e.g., `"/text"`, `"/html"`, `"/json"`).

**Why it was useful in this task:**  
Allowed conditional inspection of the URL path to serve distinct content types based on the client's request.

**Example:**
```javascript
const url = req.url;
if (url === '/text') {
    // Handle plain text response
}
```

---

### 3. res.writeHead()

**What it does:**  
Sends an HTTP response status code and response headers to the client in a single atomic method call.

**Why it was useful in this task:**  
Used to set the appropriate `Content-Type` header (`text/plain`, `text/html`, or `application/json`) and HTTP status codes (`200 OK` or `404 Not Found`) before ending the response.

**Syntax:**
```javascript
res.writeHead(statusCode, [statusMessage], [headers]);
```

**Example:**
```javascript
res.writeHead(200, {
    'content-type': 'text/html'
});
```

---

### 4. Content-Type Header

**What it does:**  
Tells the HTTP client (browser, Postman, curl) how to interpret and render the bytes contained in the response body.

**Key Content Types Practiced:**
- `text/plain`: Instructs the browser to render raw text as-is without parsing tags.
- `text/html`: Instructs the browser to parse and render HTML elements (e.g. `<h1>`).
- `application/json`: Informs the client that the body contains structured JSON data.

---

### 5. res.end()

**What it does:**  
Signals to the server that all response headers and body content have been sent. It finishes the response cycle and closes the HTTP connection.

**Why it was useful in this task:**  
Transmits the final string payload (text, HTML, or JSON string) to the client and completes the request loop.

**Example:**
```javascript
res.end("<h1>Hello from Node.js</h1>");
```

---

### How the Concepts Work Together

1. **Start Server**: `http.createServer()` registers the request handler callback and `server.listen(3000)` binds to port 3000.
2. **Receive Request**: When a client requests `http://localhost:3000/html`, Node.js invokes the callback passing `req` and `res`.
3. **Inspect URL**: `const url = req.url` captures `"/html"`.
4. **Evaluate Condition**: The `if (url === '/html')` branch matches.
5. **Set Headers**: `res.writeHead(200, { 'content-type': 'text/html' })` writes the `200 OK` status and `text/html` header.
6. **Send & Complete Response**: `res.end("<h1>Hello from Node.js</h1>")` sends the payload and closes the HTTP connection.

---

### Important Things I Learned

- The `Content-Type` header directly dictates client behavior. Returning `<h1>` with `text/plain` renders raw tags, whereas `text/html` renders formatted headings.
- HTTP status codes inform clients about request outcomes (`200` for success, `404` for missing routes).
- `res.end()` must be called on every request path; otherwise, the browser request hangs indefinitely.

---

### Common Mistakes / Things to Remember

- **Empty `JSON.stringify()`**: Calling `JSON.stringify()` without passing an object returns `undefined`, which can cause response errors. Always pass an object, e.g., `JSON.stringify({ name: "Saurabh", role: "Backend Developer" })`.
- **Header Case Sensitivity**: Node.js normalizes response header keys, but standard camel-casing (`Content-Type`) is recommended for code clarity.

---

### Improvement Note

In the solution's `/json` route:
```javascript
// Solution code:
res.end(JSON.stringify())
```

*Better approach:* Pass the structured JavaScript object to `JSON.stringify()`:
```javascript
res.end(JSON.stringify({
    name: "Saurabh",
    role: "Backend Developer"
}));
```

---

## Task 1 — Basic Multi-Page Server

### What the Task Required

The task required creating an HTTP server that implements manual route matching for multiple pages:
- `/` -> `Welcome to my server`
- `/about` -> `This is the About Page`
- `/contact` -> `Contact us at example@email.com`
- Fallback for unknown routes -> `404 NOT FOUND`

All valid routes return status `200` with `Content-Type: text/plain`.

### Concepts Used

- `http.createServer()` *(see Mini Task)*
- `req.url` *(see Mini Task)*
- `res.writeHead()` *(see Mini Task)*
- `res.end()` *(see Mini Task)*
- Basic conditional routing (`if / else if / else`)
- HTTP `404` fallback routing

---

### 1. Basic Conditional Routing

**What it is:**  
Manually evaluating `req.url` using conditional logic (`if / else if / else`) to direct execution flow based on the requested endpoint path.

**Why it was useful in this task:**  
Node's core `http` module does not include built-in routing frameworks. Conditional statements allow serving different text responses per route.

**Example:**
```javascript
if (req.url === '/') {
    res.end("Welcome to my server");
} else if (req.url === '/about') {
    res.end("This is the About Page");
} else {
    res.writeHead(404);
    res.end("NOT FOUND");
}
```

---

### How the Concepts Work Together

1. Client sends a request to `http://localhost:3000/about`.
2. `http.createServer` triggers the callback function.
3. `req.url` extracts `"/about"`.
4. Conditional checks evaluate: `url === '/'` is `false`, `url === '/about'` is `true`.
5. `res.writeHead(200, { "content-type": "text/plain" })` sets status code 200 and plain text header.
6. `res.end("This is the About Page")` finishes the response.

---

### Important Things I Learned

- Core Node.js HTTP servers handle all routing inside a single callback function.
- Every unhandled route must fall through to an `else` block returning a `404` status code.

---

### Common Mistakes / Things to Remember

- **Missing trailing slashes or path mismatches**: `/about` and `/about/` are treated as different strings by `req.url`.

---

### Improvement Note

- **Repeated Header Declarations**: `res.writeHead(200, { "content-type": "text/plain" })` is repeated across every valid route.
  
*Better approach:* Extract repetitive headers or use defaults:
```javascript
const server = http.createServer((req, res) => {
    const routes = {
        '/': 'Welcome to my server',
        '/about': 'This is the About Page',
        '/contact': 'Contact us at example@email.com',
        '/projects': 'My Projects',
        '/skills': 'JavaScript, Node.js, C++, React'
    };

    if (routes[req.url]) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(routes[req.url]);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('NOT FOUND');
    }
});
```

---

## Task 2 — Student Profile Server

### What the Task Required

Build a server serving nested student profile endpoints under `/student`:
- `/student` -> `Student Profile`
- `/student/name` -> `Your Name`
- `/student/skills` -> `Skills: C++, JavaScript, Node.js, React`
- `/student/projects` -> `Job Portal, File Organizer, etc.`
- `/student/education` -> `B.Tech Computer Science`
- Unknown `/student/*` routes -> `404 Student page not found`

*(Defined in `Tasks.md` to practice nested manual routing).*

### Concepts Used

- Nested path routing using `req.url`
- Standardized text response formatting
- Specialized 404 status handling for domain sub-paths

---

### 1. Nested Path Routing

**What it is:**  
Matching multi-segment path strings (e.g., `/student/skills`) using `req.url` equality checks or prefix checks.

**Why it is useful:**  
Allows structuring API resources logically into namespaces/sub-paths without requiring third-party routers.

---

### Important Things I Learned

- Sub-resource routing in core Node.js requires explicit string comparisons for each nested endpoint path.

---

## Task 3 — HTTP Status Code Practice

### What the Task Required

Build an HTTP server that maps specific routes to distinct HTTP status codes to practice HTTP status semantics:
- `/` -> `200 OK` (`Welcome`)
- `/about` -> `200 OK` (`About Page`)
- `/login` -> `401 Unauthorized` (`Unauthorized`)
- `/admin` -> `403 Forbidden` (`Forbidden`)
- `/notfound` -> `404 Not Found` (`Page Not Found`)
- `/server` -> `500 Internal Server Error` (`Internal Server Error`)

*(Defined in `Tasks.md` to practice HTTP response status codes).*

### Concepts Used

- `res.writeHead(statusCode, headers)`
- HTTP Status Code categories (2xx, 4xx, 5xx)

---

### 1. HTTP Status Codes Practice

**Status Code Categories:**
- **`200 OK`**: Standard response for successful HTTP requests.
- **`401 Unauthorized`**: Authentication is required and has failed or has not yet been provided.
- **`403 Forbidden`**: The server understands the request but refuses to authorize it (insufficient permissions).
- **`404 Not Found`**: The requested resource could not be found on the server.
- **`500 Internal Server Error`**: A generic error message given when an unexpected condition was encountered on the server.

---

### Important Things I Learned

- HTTP status codes are metadata that communicate request processing state to clients independently of the response body.

---

## Task 4 — Simple JSON API

### What the Task Required

Create a REST-style JSON API serving data endpoints:
- `/api/user` -> Returns user profile JSON object (`200 OK`)
- `/api/products` -> Returns product list JSON array (`200 OK`)
- `/api/about` -> Returns message JSON object (`200 OK`)
- Unknown `/api/*` -> Returns error JSON `{ "error": "API route not found" }` (`404 Not Found`)

*(Defined in `Tasks.md` to practice building structured JSON endpoints).*

### Concepts Used

- `Content-Type: application/json`
- `JSON.stringify()`
- Object and array serialization for HTTP response bodies

---

### 1. Sending JSON Responses

**Why `Content-Type: application/json` is required:**  
Tells programmatic clients (frontend fetch calls, mobile apps, Postman) to automatically parse the raw response string as a JSON data structure.

**Example:**
```javascript
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({
    name: "Saurabh",
    age: 21,
    role: "Student"
}));
```

---

### Important Things I Learned

- HTTP response bodies are transmitted over the network as strings or byte buffers. JavaScript objects must be serialized into JSON strings using `JSON.stringify()` before calling `res.end()`.

---

## Task 5 — Books API

### What the Task Required

Build a JSON API serving a collection of books with dynamic URL parameter extraction (`/api/books/:id`):
- `GET /api/books`: Returns an array of all book objects (`200 OK`).
- `GET /api/books/1`: Returns the book matching ID `1` (`200 OK`).
- `GET /api/books/2`: Returns the book matching ID `2` (`200 OK`).
- `GET /api/books/999`: Returns `{ "error": "Book not found" }` (`404 Not Found`) if ID doesn't exist.
- Invalid URLs (e.g. invalid base path or extra segments): Returns `{ "error": "Invalid URL" }` (`404 Not Found`).

### Concepts Used

- URL path splitting via `url.split('/')`
- Dynamic path parameter extraction
- Type conversion (`Number(parts[3])`)
- Array searching (`Array.prototype.find()`)
- JSON response formatting
- Granular 404 validation

---

### 1. URL Path Splitting (`url.split('/')`)

**What it does:**  
Splits the `req.url` string into an array of path segments using `/` as the delimiter.

**Why it was useful in this task:**  
For a URL like `/api/books/1`, `url.split('/')` produces:
```javascript
["", "api", "books", "1"]
// parts[0] -> ""
// parts[1] -> "api"
// parts[2] -> "books"
// parts[3] -> "1"
```
This enables accessing the dynamic route parameter `1` at index `3`.

**Example:**
```javascript
const url = '/api/books/1';
const parts = url.split('/');
console.log(parts[3]); // Output: "1"
```

---

### 2. Array.prototype.find() & Type Casting

**What it does:**  
Searches the `bookData` array for an object whose `id` property equals the numeric ID extracted from the URL.

**Why type conversion was necessary:**  
URL parameters extracted from `req.url` are strings (`"1"`). The `bookData` IDs are numbers (`1`). `Number(parts[3])` casts the string to a number so strict equality (`===`) works inside `.find()`.

**Example:**
```javascript
const bookId = Number(parts[3]);
const book = bookData.find(b => b.id === bookId);
```

---

### How the Concepts Work Together

1. **Receive Request**: Client requests `http://localhost:3000/api/books/2`.
2. **Split URL**: `const parts = req.url.split('/')` produces `["", "api", "books", "2"]`.
3. **Validate Route Structure**: Checks `parts[1] === "api"` and `parts[2] === "books"`.
4. **Evaluate Segment 3**:
   - If `parts[3] === undefined`, return entire `bookData` array (`GET /api/books`).
   - If `parts[3]` is present (`"2"`), cast to number `2` and search array using `bookData.find()`.
5. **Handle Search Result**:
   - If book exists: Return `200 OK` with JSON book object.
   - If book is `undefined`: Return `404 Not Found` with `{ "error": "Book not found" }`.

---

### Important Things I Learned

- Dynamic routing parameters (like `:id`) can be implemented manually in core Node.js by splitting the URL string into path segments.
- String URL segments must be explicitly converted to numbers before performing numerical comparisons or database/array lookups.

---

### Common Mistakes / Things to Remember

- **Comparing string ID with number ID**: `"1" === 1` evaluates to `false`. Always cast using `Number()` or `parseInt()`.
- **Leading slash splitting behavior**: `"/api/books".split('/')` yields `["", "api", "books"]` where index `0` is an empty string `""`.

---

### Improvement Note

- **Missing HTTP Method Check**: The current code processes any HTTP method (`GET`, `POST`, `DELETE`) identically.
- **Handling NaN**: Requesting `/api/books/abc` results in `Number("abc") -> NaN`.

*Better approach:* Add method verification and `isNaN` parameter validation:
```javascript
if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
}

if (parts[3] !== undefined) {
    const id = Number(parts[3]);
    if (isNaN(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid Book ID' }));
    }
}
```

---

## Bonus Task — URL + HTTP Method

### What the Task Required

Build a server that evaluates both `req.url` AND `req.method` to direct execution:
- `GET /api/books` -> Returns `All books`
- `POST /api/books` -> Returns `POST request received`

*(Defined in `Tasks.md` to introduce HTTP method-based routing).*

### Concepts Used

- `req.method`
- Combined Method + URL routing (`req.method === 'GET' && req.url === '/api/books'`)

---

### 1. req.method

**What it contains:**  
A string representing the HTTP method of the incoming request in uppercase (e.g., `'GET'`, `'POST'`, `'PUT'`, `'DELETE'`).

**Why it is useful:**  
Allows building RESTful endpoints where the same URL path (e.g., `/api/books`) performs different operations depending on the HTTP method:
- `GET /api/books`: Retrieve books
- `POST /api/books`: Create a new book

**Example:**
```javascript
if (req.method === 'GET' && req.url === '/api/books') {
    res.end('All books');
} else if (req.method === 'POST' && req.url === '/api/books') {
    res.end('POST request received');
}
```

---

# HTTP Request-Response Cycle

```
+--------+                 +---------------------+                 +-----------------------+
|        |  HTTP Request   |                     |  Invoke Callback|                       |
| Client | --------------> | Node.js HTTP Server | --------------> | (req, res) => { ... } |
|        |                 | (listening on port) |                 |                       |
+--------+                 +---------------------+                 +-----------------------+
    ^                                                                          |
    |                                                                          | Inspect req.method
    |                                                                          | Inspect req.url
    |                                                                          v
    |                      +---------------------+                 +-----------------------+
    |    HTTP Response     |                     | res.end(payload)|                       |
    +--------------------- |  Response Transmit  | <-------------- | Set Status & Headers  |
                           |                     |                 | res.writeHead()       |
                           +---------------------+                 +-----------------------+
```

### Request-Response Cycle Breakdown

1. **Client Action**: Client (Browser/Postman/curl) initiates a TCP connection and sends an HTTP request to `http://localhost:3000/api/books`.
2. **Server Listener**: The `http.Server` created by `http.createServer()` receives the HTTP raw text stream on port 3000.
3. **Request Object Creation (`req`)**: Node.js parses the incoming HTTP request stream into an `http.IncomingMessage` object (`req`), populating headers, method, and URL.
4. **Response Object Creation (`res`)**: Node.js creates an `http.ServerResponse` object (`res`) associated with the active socket connection.
5. **Execution of Handler**: Node.js executes your `(req, res)` callback function asynchronously on the event loop.
6. **Route Selection & Business Logic**: Your code inspects `req.url` / `req.method` and computes the response payload.
7. **Writing Response Headers**: `res.writeHead(200, { 'Content-Type': 'application/json' })` formats HTTP response header frames.
8. **Ending Response**: `res.end(data)` transmits the response body payload over the socket and closes/flushes the HTTP stream.
9. **Client Completion**: The client receives response bytes, reads status `200 OK`, parses headers, and displays or processes the body payload.

---

# Request Object

The `req` parameter passed to the `http.createServer` callback is an instance of `http.IncomingMessage`. It is a Readable Stream that contains metadata about the client's request.

### Primary Request Properties Practiced

| Property | Type | Description | Example Usage in Tasks |
|---|---|---|---|
| `req.url` | `string` | Contains the path and query string of the request | `if (req.url === '/about')` |
| `req.method` | `string` | Contains the HTTP verb used (`GET`, `POST`, etc.) | `if (req.method === 'POST')` |
| `req.headers` | `object` | Key-value dictionary of incoming request headers | `console.log(req.headers['user-agent'])` |
| `req.httpVersion` | `string` | The HTTP protocol version sent by client | `'1.1'` |

### Request Events (Readable Stream)

When clients send data payloads (such as in `POST` or `PUT` requests), `req` acts as an asynchronous readable stream emitting data in chunks:

- `req.on('data', chunk => ...)`: Fires when a new buffer chunk of request body arrives.
- `req.on('end', () => ...)`: Fires when the client finishes transmitting the request body.

---

# Response Object

The `res` parameter is an instance of `http.ServerResponse`. It is a Writable Stream used to construct and send data back to the HTTP client.

### Primary Response Methods Practiced

| Method / Property | Description | Syntax |
|---|---|---|
| `res.writeHead()` | Writes HTTP status code and header object to the response stream | `res.writeHead(200, { 'Content-Type': 'text/plain' })` |
| `res.statusCode` | Sets or gets the HTTP status code (alternative to writeHead) | `res.statusCode = 404;` |
| `res.setHeader()` | Sets a single header value | `res.setHeader('Content-Type', 'application/json');` |
| `res.write()` | Writes a chunk of data to the response stream without ending it | `res.write("Chunk 1");` |
| `res.end()` | Writes optional final data and closes the response stream | `res.end(JSON.stringify(data));` |

---

# Routing

### Manual Core HTTP Routing

In Node.js core `http` module, routing must be constructed manually because no built-in path matching syntax exists:

```javascript
// Method + URL Routing Pattern
const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Home Page');
    } else if (method === 'GET' && url === '/api/user') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ name: 'Saurabh' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});
```

### Dynamic Parameter Extraction Pattern

For dynamic paths like `/api/books/:id`:

```javascript
const parts = req.url.split('/'); // "/api/books/1" -> ["", "api", "books", "1"]

if (parts[1] === 'api' && parts[2] === 'books') {
    const id = parts[3];
    if (id === undefined) {
        // GET /api/books (Collection)
    } else {
        // GET /api/books/:id (Single Item)
    }
}
```

---

# Request Body & Streams

### Reading POST / PUT Body Data

Because the HTTP `req` object is a readable stream, request bodies do not arrive all at once. They arrive in chunks via events.

```javascript
// Pattern for receiving incoming JSON payload:
let body = '';

req.on('data', chunk => {
    body += chunk.toString(); // Append incoming data buffer chunk
});

req.on('end', () => {
    try {
        const parsedData = JSON.parse(body); // Convert string to object
        console.log('Received payload:', parsedData);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Data received', data: parsedData }));
    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    }
});
```

---

# HTTP Client Requests

Node.js `http` module can also act as an **HTTP Client** to send requests to external servers using `http.request()` or `http.get()`.

### Making a GET Request (`http.get`)

```javascript
const http = require('http');

http.get('http://localhost:3000/api/books', (res) => {
    let data = '';

    // Listen for data chunks
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Response complete
    res.on('end', () => {
        console.log('Response from server:', JSON.parse(data));
    });
}).on('error', (err) => {
    console.error('Client Request Error:', err.message);
});
```

### Making a POST Request (`http.request`)

```javascript
const http = require('http');

const postData = JSON.stringify({ title: 'New Book', author: 'Jane Doe' });

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/books',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Server Response:', responseData);
    });
});

req.on('error', (err) => {
    console.error('Request failed:', err);
});

// Write data to request body and finish request
req.write(postData);
req.end();
```

---

# Overall Concepts Learned

## Node.js HTTP Module

- `require('http')`: Loads Node.js built-in HTTP module.
- `http.createServer()`: Instantiates HTTP server with request listener callback.
- `server.listen(port, callback)`: Binds server to specified port and starts accepting requests.
- `http.get()` & `http.request()`: Creates HTTP client requests to fetch remote data.

## Server & Request Handling

- Request-Response Lifecycle (`Client -> Req -> Server -> Res -> Client`).
- `req.url`: Extracting request endpoint paths.
- `req.method`: Identifying HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- Manual conditional routing using `if/else` and string splitting (`url.split('/')`).

## Responses & Headers

- `res.writeHead(statusCode, headers)`: Setting status code and header dictionary atomically.
- `Content-Type`: Controlling client parsing behavior (`text/plain`, `text/html`, `application/json`).
- `res.end()`: Terminating response stream and transmitting body payload.
- HTTP Status Codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Error`).

## Data Serialization & Streams

- `JSON.stringify()`: Serializing JavaScript memory objects into JSON strings for network transmission.
- `JSON.parse()`: Parsing raw incoming JSON text bodies into JavaScript objects.
- Stream events (`req.on('data')`, `req.on('end')`): Processing request payloads in streaming chunks.

---

# Quick Revision

### Important APIs

| API | Purpose | Example |
|---|---|---|
| `http.createServer()` | Creates an HTTP server instance | `http.createServer((req, res) => {})` |
| `server.listen()` | Starts listening for incoming connections on a port | `server.listen(3000)` |
| `res.writeHead()` | Writes HTTP status code and response headers | `res.writeHead(200, { 'Content-Type': 'text/plain' })` |
| `res.setHeader()` | Sets a single header key-value pair | `res.setHeader('Content-Type', 'text/html')` |
| `res.end()` | Completes response transmission | `res.end('Done')` |
| `http.get()` | Utility method for HTTP GET client requests | `http.get(url, callback)` |
| `http.request()` | General method for HTTP client requests (GET, POST, etc.) | `http.request(options, callback)` |

### Request Object Quick Reference

| Property / Method | Purpose | Example Output |
|---|---|---|
| `req.url` | Requested path string | `"/api/books/1"` |
| `req.method` | HTTP verb | `"GET"` or `"POST"` |
| `req.headers` | Key-value object of request headers | `{ "user-agent": "Mozilla...", ... }` |
| `req.on('data')` | Event listener for incoming body data chunk | `req.on('data', chunk => body += chunk)` |
| `req.on('end')` | Event listener for completed body transmission | `req.on('end', () => console.log(body))` |

### Response Object Quick Reference

| Method / Property | Purpose | Example |
|---|---|---|
| `res.statusCode` | Property to set HTTP status code | `res.statusCode = 404;` |
| `res.writeHead()` | Writes status and headers in one step | `res.writeHead(200, { 'Content-Type': 'application/json' });` |
| `res.write()` | Writes data chunk to response stream | `res.write("Chunk");` |
| `res.end()` | Ends response and flushes data | `res.end(JSON.stringify(data));` |

### Common HTTP Status Codes

| Status Code | Meaning | Common Usage |
|---|---|---|
| `200` | OK | Successful GET / general request |
| `201` | Created | Successful POST / resource creation |
| `400` | Bad Request | Client sent malformed data or invalid parameter |
| `401` | Unauthorized | Missing or invalid authentication credentials |
| `403` | Forbidden | Authenticated client lacks permission |
| `404` | Not Found | Route or requested resource does not exist |
| `500` | Internal Server Error | Server-side unhandled exception |

### Important Code Patterns

#### 1. Basic Server Setup Pattern
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server operational');
});

server.listen(3000, () => console.log('Listening on port 3000'));
```

#### 2. Manual JSON API Routing Pattern
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', data: [1, 2, 3] }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(3000);
```

#### 3. Dynamic URL Parameter Extraction Pattern
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    const parts = req.url.split('/'); // e.g. "/api/items/5" -> ["", "api", "items", "5"]

    if (parts[1] === 'api' && parts[2] === 'items' && parts[3] !== undefined) {
        const id = Number(parts[3]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ itemId: id }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid route' }));
    }
});

server.listen(3000);
```

---

# What I Can Build After These Tasks

Based on the tasks and implementations practiced:

1. **Build Raw Node.js HTTP Servers**: Initialize and run HTTP servers using core `http.createServer()` and `server.listen()`.
2. **Implement Manual Multi-Route Handling**: Route incoming requests based on `req.url` and `req.method` without external libraries.
3. **Serve Diverse Content Types**: Configure HTTP response headers to return `text/plain`, `text/html`, and `application/json`.
4. **Build RESTful JSON APIs**: Return formatted JSON data objects/arrays using `JSON.stringify()` and set appropriate status codes (`200`, `404`).
5. **Parse Dynamic Route Parameters**: Extract dynamic URL parameters (e.g. `/api/books/:id`) using string splitting (`url.split('/')`) and cast them for data lookup.
6. **Apply HTTP Status Semantics**: Utilize HTTP status codes (`200`, `201`, `401`, `403`, `404`, `500`) to communicate server state clearly to clients.
7. **Handle Stream-Based Body Payloads**: Collect incoming `POST`/`PUT` data chunks via `req.on('data')` and process complete payloads on `req.on('end')`.
8. **Perform Client HTTP Requests**: Issue outgoing HTTP GET and POST requests from Node.js using `http.get()` and `http.request()`.
