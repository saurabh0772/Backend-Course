# Node.js — Path & File System Module

## Task 1 — File Information Tool

### What the Task Required

The task required creating a Node.js CLI script that inspects a target file (`data/sample.txt`) and extracts both path metadata and file system statistics. Specifically:
- **Path metadata**: Extract the file name, file extension, parent directory name, and full absolute path using the built-in `path` module.
- **File System metadata**: Check if the file exists, get its exact size in bytes, and read its text content using the built-in `fs` module.

### Concepts Used

- `path.join()`
- `path.basename()`
- `path.extname()`
- `path.dirname()`
- `path.resolve()`
- `fs.existsSync()`
- `fs.statSync()`
- `fs.readFileSync()`

---

### 1. path.join()

**What it does:**  
Joins all given path segments together using the platform-specific separator (`/` on POSIX / Linux / macOS, `\` on Windows) and normalizes the resulting path.

**Why it was useful in this task:**  
Instead of manually concatenating folder names like `"data" + "/" + "sample.txt"`, `path.join("data", "sample.txt")` ensures cross-platform compatibility without hardcoding slash direction.

**What it returns:**  
A normalized relative or absolute path `string`.

**Syntax:**
```javascript
path.join([...paths])
```

**Example:**
```javascript
const path = require('path');
const filePath = path.join('data', 'sample.txt');
console.log(filePath); // Output on Linux: data/sample.txt
```

---

### 2. path.basename()

**What it does:**  
Extracts the last portion of a path (typically the filename with extension).

**Why it was useful in this task:**  
Used to retrieve the standalone filename (`sample.txt`) from the relative path string `data/sample.txt`.

**What it returns:**  
A `string` containing the filename.

**Example:**
```javascript
const path = require('path');
const filename = path.basename('data/sample.txt');
console.log(filename); // Output: sample.txt
```

---

### 3. path.extname()

**What it does:**  
Returns the extension of the path, from the last occurrence of the `.` (dot) character to the end of the string in the last path portion.

**Why it was useful in this task:**  
Used to determine the file type extension (`.txt`) of the target file.

**What it returns:**  
A `string` representing the file extension (including the leading dot `.`). If no dot exists, it returns an empty string `""`.

**Example:**
```javascript
const path = require('path');
const ext = path.extname('data/sample.txt');
console.log(ext); // Output: .txt
```

---

### 4. path.dirname()

**What it does:**  
Returns the directory name of a path, omitting the last segment (filename).

**Why it was useful in this task:**  
Used to extract the parent directory (`data`) of `data/sample.txt`.

**What it returns:**  
A `string` representing the parent directory path.

**Example:**
```javascript
const path = require('path');
const dir = path.dirname('data/sample.txt');
console.log(dir); // Output: data
```

---

### 5. path.resolve()

**What it does:**  
Resolves a sequence of paths or path segments into an absolute path by prepending the current working directory (`process.cwd()`).

**Why it was useful in this task:**  
Converted the relative path `"data/sample.txt"` into the complete system path (e.g., `/home/user/project/data/sample.txt`).

**What it returns:**  
An absolute path `string`.

**Example:**
```javascript
const path = require('path');
const absPath = path.resolve('data/sample.txt');
console.log(absPath); // Output: /home/.../01-Path-and-Fs-Module/fileInformationTool/data/sample.txt
```

---

### 6. fs.existsSync()

**What it does:**  
Synchronously checks whether a file or directory exists at the specified path.

**Why it was useful in this task:**  
Prevents runtime errors before attempting to fetch file statistics or read contents.

**What it returns:**  
`true` if the path exists, `false` otherwise.

**Example:**
```javascript
const fs = require('fs');
if (fs.existsSync('data/sample.txt')) {
    console.log('File exists!');
}
```

---

### 7. fs.statSync()

**What it does:**  
Synchronously retrieves status details (metadata) of a file or directory.

**Why it was useful in this task:**  
Used to obtain file size via `stats.size` (measured in bytes).

**What it returns:**  
An `fs.Stats` object containing file properties (size, creation time, permissions, isFile, isDirectory).

**Example:**
```javascript
const fs = require('fs');
const stats = fs.statSync('data/sample.txt');
console.log(stats.size); // Output: file size in bytes
```

---

### 8. fs.readFileSync()

**What it does:**  
Synchronously reads the entire content of a file into memory.

**Why it was useful in this task:**  
Used to read and output the text content of `sample.txt`.

**What it returns:**  
A `Buffer` by default, or a `string` if an encoding parameter (such as `'utf-8'`) is passed.

**Example:**
```javascript
const fs = require('fs');
const content = fs.readFileSync('data/sample.txt', 'utf-8');
console.log(content);
```

---

### How the Concepts Work Together

1. **Construct Path**: `path.join("data", "sample.txt")` creates the safe path string `data/sample.txt`.
2. **Inspect Path Properties**: `path.basename()`, `path.extname()`, `path.dirname()`, and `path.resolve()` dissect the path string without touching the disk.
3. **Verify Disk Existence**: `fs.existsSync()` verifies that the file exists at `data/sample.txt`.
4. **Fetch Metadata**: `fs.statSync()` retrieves file statistics (such as byte size).
5. **Read File Content**: `fs.readFileSync()` reads and returns the file string using `utf-8` encoding.

---

### Important Things I Learned

- Path manipulation functions (`join`, `basename`, `extname`, `dirname`, `resolve`) are string transformers and do not verify whether the file actually exists on disk.
- `fs.existsSync()` and `fs.statSync()` perform actual disk checks.
- Specifying `'utf-8'` as the second argument in `readFileSync()` directly returns a readable string rather than a raw binary `Buffer`.

---

### Common Mistakes / Things to Remember

- **Forgetting encoding in `readFileSync()`**: Omitting `'utf-8'` returns `<Buffer 48 65 6c 6c 6f...>` instead of human-readable text.
- **Difference between `path.join()` and `path.resolve()`**: `path.join()` simply concatenates segments relatively, while `path.resolve()` anchors the path to the root system directory starting from `process.cwd()`.

---

### Improvement Note

- **Unprotected File Read**: In the solution, `fs.readFileSync()` is called outside the `if (fs.existsSync(filePath))` check. If the file does not exist, `existsSync` will skip printing size, but `readFileSync` will throw an unhandled `ENOENT` exception and crash the process.
  
*Better approach:* Move `fs.readFileSync()` inside the `fs.existsSync()` conditional block or wrap it in a `try...catch` block.

```javascript
if (fs.existsSync(filePath)) {
    console.log("File exists: Yes");
    const stats = fs.statSync(filePath);
    console.log("File size : ", stats.size, " bytes");
    const readingData = fs.readFileSync(filePath, 'utf-8');
    console.log("Content : ", readingData);
} else {
    console.log("File does not exist.");
}
```

---

## Task 2 — Simple File Organizer

### What the Task Required

The task required creating an automated file organizer script that:
1. Reads all files inside a `downloads/` directory.
2. Identifies the extension of each file (`.png`, `.mp3`, `.pdf`, `.txt`, `.mp4`).
3. Creates corresponding subfolders (`Images`, `Music`, `Document`, `Text`, `Videos`) inside `downloads/` if they do not exist.
4. Moves each file into its matching extension folder.

### Concepts Used

- `fs.readdirSync()`
- `fs.mkdirSync()`
- `fs.renameSync()`
- `Array.prototype.forEach()`
- `path.extname()` *(explained in Task 1)*
- `path.join()` *(explained in Task 1)*
- `fs.existsSync()` *(explained in Task 1)*

---

### 1. fs.readdirSync()

**What it does:**  
Synchronously reads the contents of a directory.

**Why it was useful in this task:**  
Used to retrieve an array of all file names inside the `downloads` directory so they can be processed one by one.

**What it returns:**  
An array of filename/directory name strings (`string[]`).

**Example:**
```javascript
const fs = require('fs');
const files = fs.readdirSync('downloads');
console.log(files); // Output: ['song.mp3', 'photo.jpg', 'notes.txt']
```

---

### 2. fs.mkdirSync()

**What it does:**  
Synchronously creates a new directory at the specified path.

**Why it was useful in this task:**  
Used to create target folders like `downloads/Images` or `downloads/Music` when they don't already exist.

**What it returns:**  
`undefined` (or the path of the first created directory if `recursive: true` is set).

**Example:**
```javascript
const fs = require('fs');
fs.mkdirSync('downloads/Images');
```

---

### 3. fs.renameSync()

**What it does:**  
Synchronously renames or moves a file/directory from an old path to a new path.

**Why it was useful in this task:**  
Used to move a file from `downloads/photo.jpg` to its new location `downloads/Images/photo.jpg`.

**What it returns:**  
`undefined`.

**Example:**
```javascript
const fs = require('fs');
fs.renameSync('downloads/photo.jpg', 'downloads/Images/photo.jpg');
```

---

### 4. Array.prototype.forEach()

**What it does:**  
Iterates through each element in an array and executes a callback function for each item.

**Why it was useful in this task:**  
Used to iterate over the array of file names returned by `fs.readdirSync()`.

---

### How the Concepts Work Together

1. **Read Directory**: `fs.readdirSync("downloads")` lists all file names.
2. **Loop Over Files**: `forEach()` processes each file name (`ele`).
3. **Check Extension**: `path.extname(ele)` identifies the extension (e.g. `.png`).
4. **Check Target Folder Existence**: `fs.existsSync(path.join("downloads", "Images"))` verifies if the target directory exists.
5. **Create Folder if Missing**: `fs.mkdirSync()` creates the subfolder if `existsSync()` returned `false`.
6. **Move File**: `fs.renameSync(oldPath, newPath)` transfers the file into the subfolder.

---

### Important Things I Learned

- `fs.renameSync()` acts as both a **rename** tool and a **move** tool depending on whether the destination directory path changes.
- Combining `fs.existsSync()` with `fs.mkdirSync()` prevents crashes caused by trying to recreate existing directories (`EEXIST` error).

---

### Common Mistakes / Things to Remember

- **Re-reading moved files**: If `readdirSync` is called again or subfolders exist, subfolder names are also returned by `readdirSync`.
- **Moving folders accidentally**: Subdirectories inside `downloads/` will also be returned by `fs.readdirSync()`. Checking if an item is a file using `fs.statSync(itemPath).isFile()` prevents attempting to process directories as files.

---

### Improvement Note

- **Hardcoded `if` statements**: The original solution uses separate `if` blocks for `.png`, `.mp3`, `.pdf`, `.txt`, and `.mp4`. Adding a new file type requires writing another `if` block.
  
*Better approach:* Use a map object to pair extensions with directory names:

```javascript
const extensionMap = {
    '.png': 'Images',
    '.jpg': 'Images',
    '.jpeg': 'Images',
    '.mp3': 'Music',
    '.pdf': 'Document',
    '.txt': 'Text',
    '.mp4': 'Videos'
};

data.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const folderName = extensionMap[ext];

    if (folderName) {
        const folderPath = path.join(filePath, folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        fs.renameSync(path.join(filePath, file), path.join(folderPath, file));
    }
});
```

---

## Task 3 — CLI Notes Manager

### What the Task Required

The task specified creating a command-line interface (CLI) application to manage notes stored persistently in a JSON file (`notes.json`).
Supported operations:
- `node app.js add "Note text"`: Adds a new note with an auto-incremented ID.
- `node app.js list`: Displays all stored notes.
- `node app.js delete <id>`: Deletes the note matching the specified ID.

*(Note: Defined in `tasks.md` as the target project for CLI arguments and JSON state management).*

### Concepts Used

- `process.argv`
- `fs.writeFileSync()`
- `JSON.parse()`
- `JSON.stringify()`
- `fs.readFileSync()` *(explained in Task 1)*
- `fs.existsSync()` *(explained in Task 1)*
- `path.join()` *(explained in Task 1)*

---

### 1. process.argv

**What it does:**  
An array containing command-line arguments passed when launching the Node.js process.
- `process.argv[0]`: Absolute path to `node` executable.
- `process.argv[1]`: Absolute path to JavaScript file being executed (`app.js`).
- `process.argv[2]`: First user argument (e.g. `"add"`, `"list"`, or `"delete"`).
- `process.argv[3]`: Second user argument (e.g. note text or target ID).

**Why it is useful:**  
Allows building interactive command-line interfaces without external CLI dependencies.

**Example:**
```javascript
const command = process.argv[2];
const argument = process.argv[3];

if (command === 'add') {
    console.log(`Adding note: ${argument}`);
}
```

---

### 2. fs.writeFileSync()

**What it does:**  
Synchronously writes data to a file, replacing the file if it already exists or creating it if it doesn't.

**Why it is useful:**  
Used to save updated notes arrays back to `notes.json` on disk.

**Syntax:**
```javascript
fs.writeFileSync(file, data, options)
```

**Example:**
```javascript
const fs = require('fs');
const notes = [{ id: 1, text: 'Learn Node.js' }];
fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
```

---

### 3. JSON.parse() & JSON.stringify()

**What they do:**  
- `JSON.parse(string)`: Converts a JSON-formatted string into a JavaScript Object or Array.
- `JSON.stringify(object, replacer, space)`: Converts a JavaScript Object or Array into a JSON string.

**Why they are useful:**  
Files store text strings, whereas Node.js manipulates JavaScript objects/arrays in memory. These methods bridge disk storage and memory execution.

**Example:**
```javascript
// Reading from disk: String -> Object/Array
const jsonString = fs.readFileSync('notes.json', 'utf-8');
const notesArray = JSON.parse(jsonString);

// Modifying data in memory
notesArray.push({ id: 2, text: 'Practice FS Module' });

// Writing to disk: Object/Array -> Formatted String
fs.writeFileSync('notes.json', JSON.stringify(notesArray, null, 2));
```

---

### How the Concepts Work Together

1. **Parse CLI Input**: Read command action from `process.argv[2]` and payload from `process.argv[3]`.
2. **Load Existing State**: Check if `notes.json` exists using `fs.existsSync()`. If true, read text via `fs.readFileSync()` and parse into JavaScript array via `JSON.parse()`.
3. **Execute Logic**:
   - **`add`**: Push `{ id: Date.now(), text: input }` into array.
   - **`list`**: Iterate array and print notes to standard output.
   - **`delete`**: Filter out item matching requested ID.
4. **Persist State**: Convert modified array to formatted string via `JSON.stringify(notes, null, 2)` and write back to file via `fs.writeFileSync()`.

---

### Important Things I Learned

- Filesystem storage is string-based. Data structures like JavaScript arrays must be serialized (`JSON.stringify`) before writing and deserialized (`JSON.parse`) after reading.
- Command-line arguments in `process.argv` start at index `2`.

---

### Common Mistakes / Things to Remember

- **`JSON.parse()` on empty file**: Attempting to run `JSON.parse()` on an empty string or non-existent file causes a `SyntaxError`. Always check file existence and handle initial empty file states (e.g. fallback to `[]`).

---

# Overall Concepts Learned

## Path Module

- `path.join(...paths)`: Safe cross-platform path segment concatenation.
- `path.resolve(...paths)`: Resolves path segments into an absolute path relative to `process.cwd()`.
- `path.basename(path)`: Retrieves the filename portion of a path.
- `path.dirname(path)`: Retrieves the directory component of a path.
- `path.extname(path)`: Extracts the file extension starting from the last dot `.`.

---

## File System Module

- `fs.existsSync(path)`: Synchronously checks for file/directory existence.
- `fs.statSync(path)`: Synchronously inspects status/metadata (file size, type).
- `fs.readFileSync(path, encoding)`: Synchronously reads file content as Buffer or String.
- `fs.writeFileSync(path, data)`: Synchronously writes data to disk.
- `fs.readdirSync(path)`: Synchronously lists all entries inside a directory.
- `fs.mkdirSync(path)`: Synchronously creates a directory.
- `fs.renameSync(oldPath, newPath)`: Synchronously renames or moves a file/directory.

---

## Process & Data Persistence

- `process.argv`: Inspects command-line arguments passed to the script.
- `JSON.parse()` & `JSON.stringify()`: Serializes and deserializes JavaScript memory structures to string data stored in `.json` files.

---

## Synchronous vs Asynchronous APIs

- **Synchronous (`*Sync`)**: Blocks the main Node.js event loop until disk operation completes. Simple and suitable for one-off CLI utilities or initial app startup.
- **Asynchronous (Callbacks / Promises / async-await)**: Non-blocking execution allowing Node.js to process other tasks concurrently while waiting for I/O operations. Ideal for HTTP servers and scalable background tasks.

---

# Quick Revision

### Important APIs

| API | Module | Purpose | Example |
|---|---|---|---|
| `path.join()` | `path` | Join path segments with platform slashes | `path.join("data", "file.txt")` |
| `path.resolve()` | `path` | Get full absolute path from relative path | `path.resolve("file.txt")` |
| `path.basename()` | `path` | Extract filename with extension | `path.basename("dir/file.txt")` -> `"file.txt"` |
| `path.dirname()` | `path` | Get parent directory path | `path.dirname("dir/file.txt")` -> `"dir"` |
| `path.extname()` | `path` | Extract file extension | `path.extname("file.txt")` -> `".txt"` |
| `fs.existsSync()` | `fs` | Check if path exists on disk | `fs.existsSync("file.txt")` -> `true/false` |
| `fs.statSync()` | `fs` | Get file statistics (e.g. byte size) | `fs.statSync("file.txt").size` |
| `fs.readFileSync()` | `fs` | Read file content synchronously | `fs.readFileSync("file.txt", "utf-8")` |
| `fs.writeFileSync()` | `fs` | Write/overwrite content to file | `fs.writeFileSync("file.txt", "hello")` |
| `fs.readdirSync()` | `fs` | List all files/folders in directory | `fs.readdirSync("downloads")` |
| `fs.mkdirSync()` | `fs` | Create a new directory | `fs.mkdirSync("downloads/Images")` |
| `fs.renameSync()` | `fs` | Rename or move a file | `fs.renameSync("old.txt", "new.txt")` |

---

### Important Patterns

#### Safe File Reading Pattern
```javascript
const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'data', 'sample.txt');

if (fs.existsSync(targetPath)) {
    const content = fs.readFileSync(targetPath, 'utf-8');
    console.log(content);
} else {
    console.log('File does not exist.');
}
```

#### Directory Categorization & File Moving Pattern
```javascript
const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'downloads');
const files = fs.readdirSync(dirPath);

files.forEach(file => {
    const ext = path.extname(file);
    if (ext === '.png') {
        const destDir = path.join(dirPath, 'Images');
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir);
        }
        fs.renameSync(path.join(dirPath, file), path.join(destDir, file));
    }
});
```

#### JSON Persistence Pattern
```javascript
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

// Read & Parse
let data = [];
if (fs.existsSync(dbPath)) {
    const rawText = fs.readFileSync(dbPath, 'utf-8');
    data = JSON.parse(rawText);
}

// Modify & Stringify & Save
data.push({ id: 1, item: 'New Entry' });
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
```
