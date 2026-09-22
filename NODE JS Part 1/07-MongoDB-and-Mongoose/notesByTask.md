# MongoDB + Mongoose

## Task 1 — MongoDB CRUD

### What the Task Required

Perform essential CRUD operations on a `users` collection within a MongoDB database (`codingDB`):
- Insert 1 single user document (`insertOne`) and 10 dummy user documents (`insertMany`).
- Query documents using `find()` and `findOne()`.
- Update single and multiple documents using `updateOne()` and `updateMany()`.
- Perform specialized update field manipulations using `$set`, `$inc`, `$push`, `$pull`, and `$unset`.
- Delete documents using `deleteOne()` and `deleteMany()`.

### Concepts Used

- `mongoose.connect()`
- `User.insertOne()` / `User.insertMany()`
- `User.find()` / `User.findOne()`
- `User.updateOne()` / `User.updateMany()`
- `User.deleteOne()` / `User.deleteMany()`
- Update operators: `$set`, `$inc`, `$push`, `$pull`, `$unset`

---

### 1. Database Connection & Basic CRUD Methods

**What it is:**  
Database operations in MongoDB are performed against a specific collection (e.g. `users`). In Mongoose, these operations are called via the Model (e.g. `User`).

**Why it was useful in this task:**  
Establishes core persistence mechanics for creating, reading, updating, and deleting documents.

**Code Structure:**
```javascript
// Insertion
await User.insertMany([
    { name: "Saurabh", email: "saurabh@example.com", age: 23, city: "Delhi", skills: ["Node.js", "MongoDB"], salary: 65000, isActive: true },
    { name: "Rahul", email: "rahul@example.com", age: 25, city: "Mumbai", skills: ["Java", "MySQL"], salary: 75000, isActive: true }
]);

// Retrieval
const allUsers = await User.find();
const singleUser = await User.findOne({ name: "Saurabh" });
```

---

### 2. Specialized Update Operators ($set, $inc, $push, $pull, $unset)

**How Update Operators Work:**  
Instead of replacing an entire document, update operators target specific fields:
- `$set`: Sets or replaces the value of a field.
- `$inc`: Increments a numeric field by a specified value.
- `$push`: Appends a value to an array field.
- `$pull`: Removes matching values from an array field.
- `$unset`: Deletes a specified field from a document.

**Example:**
```javascript
// Increment salary by 5000
await User.updateOne({ salary: 40000 }, { $inc: { salary: 5000 } });

// Add a skill to an array
await User.updateMany({ salary: 45000 }, { $push: { skills: "AI/ML" } });

// Remove a field completely
await User.updateMany({ salary: 45000 }, { $unset: { city: "" } });
```

---

### Important Things I Learned

- Update operations without operators like `$set` in MongoDB shell replace the entire document body.
- `$push` and `$pull` modify arrays without requiring full array overwrites.

---

## Task 2 — MongoDB Query Challenge

### What the Task Required

Write advanced query filters against the user dataset to practice MongoDB query operators:
- Range conditions: Age >= 21, Salary between 40k and 80k.
- Logical conditions: City is Delhi OR Mumbai, skills include Node.js AND MongoDB.
- Complex operators: `$in`, `$nin`, `$and`, `$or`, `$gte`, `$lte`, `$all`.

### Concepts Used

- Comparison operators (`$gte`, `$lte`, `$gt`, `$lt`)
- Array matching operators (`$in`, `$nin`, `$all`)
- Logical operators (`$and`, `$or`)

---

### 1. Comparison & Array Query Operators

**How they work:**  
Query operators refine criteria passed into `.find()` filter objects:
- `$gte` / `$lte`: Match values greater than/equal or less than/equal.
- `$in`: Matches documents where a field value equals ANY element in a specified array.
- `$nin`: Matches documents where a field value equals NONE of the elements in an array.
- `$all`: Matches documents where an array field contains ALL specified elements simultaneously.
- `$or` / `$and`: Combines multiple query condition expressions in an array.

**Code Structure:**
```javascript
// Match documents containing BOTH 'Python' and 'Django' in their skills array:
const pythonDevs = await User.find({
    skills: { $all: ["Python", "Django"] }
});

// Logical OR query:
const delhiOrCheap = await User.find({
    $or: [
        { city: "Delhi" },
        { salary: { $lt: 45000 } }
    ]
});
```

---

### $in vs $all Distinction

- `$in: ["Node.js", "Django"]`: Matches documents that have **either** `"Node.js"` **or** `"Django"`.
- `$all: ["Node.js", "MongoDB"]`: Matches documents that contain **both** `"Node.js"` **and** `"MongoDB"` in their array.

---

## Task 3 — Build a Mongoose User Model

### What the Task Required

Structure a clean, modular Mongoose architecture:
- `config/database.js`: Connects to MongoDB via `mongoose.connect()`.
- `models/user.model.js`: Defines `userSchema` with field types, rules (`required`, `unique`, `min`, `max`, `default`), and exports the `User` model.
- `app.js`: Performs Mongoose model CRUD queries (`User.create`, `User.find`, `User.findById`, `User.findByIdAndUpdate`, `User.findByIdAndDelete`).

### Concepts Used

- `mongoose.Schema()`
- Field Type casting (`String`, `Number`, `Boolean`, `Array`)
- Schema constraints (`required`, `unique`, `min`, `default`)
- `mongoose.model()`
- Mongoose query methods (`findById`, `findByIdAndUpdate`, `findByIdAndDelete`)

---

### 1. Mongoose Schema and Model Definition

**Code Structure (`models/user.model.js`):**
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 0 },
    city: { type: String },
    skills: [{ type: String }],
    salary: { type: Number },
    isActive: { type: Boolean, default: false }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
```

---

### 2. Mongoose Helper Query Methods

```javascript
// Create
const newUser = await User.create({ name: "Saurabh", email: "saurabh@example.com" });

// Find By ID
const user = await User.findById("64b8f1...");

// Find By ID and Update ({ new: true } returns updated document)
const updatedUser = await User.findByIdAndUpdate(id, { salary: 70000 }, { new: true });

// Find By ID and Delete
const deletedUser = await User.findByIdAndDelete(id);
```

---

### Important Things I Learned

- Passing `{ new: true }` into `findByIdAndUpdate` instructs Mongoose to return the updated document rather than the old pre-update document.
- `timestamps: true` automatically adds `createdAt` and `updatedAt` Date fields.

---

## Task 4 — Convert Your Job API to MongoDB + Mongoose

### What the Task Required

Replace the temporary in-memory array (`const jobs = []`) from the Express Job API with a persistent MongoDB database using Mongoose models:
- `models/job.model.js`: Defines `jobSchema`.
- `controllers/job.controller.js`: Replaces array methods (`push`, `splice`) with Mongoose model calls (`Job.create`, `Job.find`, `Job.findById`, `Job.findByIdAndUpdate`, `Job.findByIdAndDelete`).

### Concepts Used

- Persistent database-backed REST controllers
- Mapping HTTP endpoints to Mongoose CRUD methods

---

### 1. Controller Refactoring (Array -> Database)

```javascript
// CREATE JOB
export const createNewJob = async (req, res, next) => {
    try {
        const newJob = await Job.create(req.body);
        res.status(201).json({ msg: "Job created", newJob });
    } catch (err) {
        next(err);
    }
};

// GET ALL JOBS
export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find();
        res.json({ jobs });
    } catch (err) {
        next(err);
    }
};
```

---

## Task 5 — Job API Filtering + Pagination

### What the Task Required

Implement advanced REST API query filtering, sorting, and pagination for `GET /api/jobs`:
- Query filters: `?location=Delhi`, `?minSalary=50000`, `?skill=Node.js`
- Sorting: `?sort=salary` (or `-salary`)
- Pagination: `?page=2&limit=5`
- Response object returning items along with pagination metadata (`page`, `limit`, `total`, `totalPages`).

### Concepts Used

- Mongoose query chaining (`.find()`, `.sort()`, `.skip()`, `.limit()`)
- `Job.countDocuments()` for calculating total pages
- Pagination math: `skip = (page - 1) * limit`

---

### 1. Mongoose Query Chaining & Pagination Math

**Code Structure:**
```javascript
export const getAllJobs = async (req, res, next) => {
    try {
        const { location, minSalary, skill, page = 1, limit = 5, sort } = req.query;
        let queryFilter = {};

        if (location) queryFilter.location = location;
        if (minSalary) queryFilter.salary = { $gte: Number(minSalary) };
        if (skill) queryFilter.skills = skill;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        // Query chaining
        let jobQuery = Job.find(queryFilter).skip(skip).limit(limitNum);

        if (sort) {
            jobQuery = jobQuery.sort(sort); // e.g. 'salary' or '-salary'
        }

        const jobs = await jobQuery;
        const total = await Job.countDocuments(queryFilter);

        res.json({
            success: true,
            data: jobs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        next(err);
    }
};
```

---

### Important Things I Learned

- Pagination formula: `skip = (page - 1) * limit`. Page 1 skips 0 items; Page 2 skips `1 * 5 = 5` items.
- `.sort('-salary')` sorts descending (highest salary first); `.sort('salary')` sorts ascending.

---

## Task 6 — Indexing + Query Optimization

### What the Task Required

Analyze query execution performance using `.explain("executionStats")` and evaluate single-field, compound, and multikey indexes on frequent search fields (`location`, `salary`, `skills`).

### Concepts Used

- `.explain("executionStats")`
- `COLLSCAN` (Collection Scan) vs `IXSCAN` (Index Scan) vs `FETCH`
- Performance metrics: `totalDocsExamined`, `totalKeysExamined`, `nReturned`
- Single field, compound, and multikey (array) indexes

---

### 1. Execution Plan Analysis (COLLSCAN vs IXSCAN)

**What `.explain("executionStats")` does:**  
Returns detailed statistics on how MongoDB evaluates a query.

**Key Metrics Practiced:**
- **`COLLSCAN`**: MongoDB scanned every single document in the collection sequentially (slow on large datasets). `totalDocsExamined` equals total collection documents.
- **`IXSCAN`**: MongoDB searched B-Tree index keys directly.
- **`FETCH`**: MongoDB fetched document details for matching index keys. `totalDocsExamined` equals `nReturned`.

**Code Example (`experiments.js`):**
```javascript
// ExecutionStats test before vs after index on 'location'
const result = await Job.find({ location: "Delhi" }).explain("executionStats");
console.log(result.executionStats);
```

**Experimental Results:**
- Without Index on `location`: Stage = `COLLSCAN`, `totalDocsExamined` = 12, `nReturned` = 4.
- With Index on `location`: Stage = `FETCH` (over `IXSCAN`), `totalDocsExamined` = 4, `nReturned` = 4.

---

### Index Types Practiced

1. **Single-Field Index**: `jobSchema.index({ location: 1 })`
2. **Compound Index**: `jobSchema.index({ location: 1, salary: -1 })` (optimizes queries filtering on location AND sorting by salary).
3. **Multikey Index**: Index created on an array field (`skills`). Index keys are automatically generated for every array element.

---

### Trade-offs of Indexing

- **Pros**: Speeds up read queries (`find`, `sort`) drastically by reducing examined documents.
- **Cons**: Consumes additional RAM/disk storage and slows down write operations (`insert`, `update`, `delete`) because indexes must be updated on every write.

---

## Task 7 — Aggregation Analytics API

### What the Task Required

Build an aggregation-based analytics endpoint `GET /api/jobs/stats` returning aggregated metrics:
- Overall job count, average salary, highest salary, lowest salary.
- Jobs grouped by location, company, and skill.
- Multi-stage pipeline using `$match`, `$group`, `$project`, `$sort`, `$unwind`, `$push`, `$addToSet`.

### Concepts Used

- `Job.aggregate([])`
- Pipeline stages: `$match`, `$group`, `$project`, `$sort`, `$unwind`
- Accumulators: `$sum`, `$avg`, `$max`, `$min`, `$push`, `$addToSet`, `$first`

---

### 1. Aggregation Pipeline Stages

```
Raw Documents ---> $match (Filter) ---> $unwind (Deconstruct Arrays) ---> $group (Aggregate) ---> $sort ---> $project (Reshape)
```

**Code Structure (`controllers/job.controller.js`):**
```javascript
export const getStats = async (req, res) => {
    // 1. Overall Salary Statistics
    const overall = await Job.aggregate([
        {
            $group: {
                _id: null,
                totalJobs: { $sum: 1 },
                averageSalary: { $avg: "$salary" },
                highestSalary: { $max: "$salary" },
                lowestSalary: { $min: "$salary" }
            }
        },
        {
            $project: {
                _id: 0,
                totalJobs: 1,
                averageSalary: 1,
                highestSalary: 1,
                lowestSalary: 1
            }
        }
    ]);

    // 2. Jobs Grouped by Skill (using $unwind)
    const bySkill = await Job.aggregate([
        { $unwind: "$skills" }, // Deconstructs array field
        {
            $group: {
                _id: "$skills",
                totalJobs: { $sum: 1 },
                averageSalary: { $avg: "$salary" }
            }
        },
        { $project: { _id: 0, skill: "$_id", totalJobs: 1, averageSalary: 1 } },
        { $sort: { totalJobs: -1 } }
    ]);

    res.json({ overall, bySkill });
};
```

---

### Important Things I Learned

- `$unwind` explodes a document containing an array of 3 elements into 3 separate documents, enabling grouping by individual array values (e.g. per skill).
- `$group` with `_id: null` calculates aggregates across the entire collection.
- `$addToSet` collects unique values into an array (unlike `$push` which allows duplicates).

---

## Task 8 — User + Job + Application Models

### What the Task Required

Model relational references across 3 Mongoose collections (`User`, `Job`, `Application`):
- `User`: `name`, `email`, `skills`
- `Job`: `title`, `company`, `salary`, `skills`
- `Application`: `student` (ObjectId ref to `User`), `job` (ObjectId ref to `Job`), `status`, `appliedAt`

### Concepts Used

- Schema reference types (`mongoose.Schema.Types.ObjectId`)
- Model referencing (`ref: 'User'`, `ref: 'Job'`)

---

### 1. Schema Relationships via ObjectId References

**Code Structure (`models/application.model.js`):**
```javascript
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Points to User model
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', // Points to Job model
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

export const Application = mongoose.model('Application', applicationSchema);
```

---

## Task 9 — `populate()`

### What the Task Required

Implement `GET /api/applications` using Mongoose `.populate()` to automatically replace stored `ObjectId` references with populated document fields from the referenced `User` and `Job` collections.

### Concepts Used

- `.populate("path", "selectFields")`
- Field exclusion (`-_id`) in populate selections

---

### 1. Populating Referenced Documents

**Code Structure (`controllers/application.controller.js`):**
```javascript
export const getApplications = async (req, res) => {
    const applications = await Application.find()
        .populate("student", "name email -_id") // Include name, email; exclude _id
        .populate("job", "title company -_id"); // Include title, company; exclude _id

    res.json({ applications });
};
```

---

### How populate() Works Under the Hood

1. Mongoose executes `Application.find()` and retrieves application documents containing raw `ObjectId` strings.
2. Mongoose collects all unique `student` ObjectIds and issues a secondary `User.find({ _id: { $in: studentIds } })` query.
3. Mongoose replaces the `student` ObjectId fields in memory with the retrieved `User` document objects before returning results.

---

## Task 10 — Mongoose Middleware Hooks

### What the Task Required

Implement Mongoose `pre("save")` and `post("save")` lifecycle middleware hooks on a Schema to inspect database hooks.

### Concepts Used

- Mongoose Document Middleware (`pre("save")`, `post("save")`)
- Lifecycle execution timing

---

### 1. Schema Pre and Post Hooks

**Code Structure:**
```javascript
const userSchema = new mongoose.Schema({ name: String, email: String });

// Pre-save hook (runs BEFORE document is saved to MongoDB)
userSchema.pre("save", function(next) {
    console.log("[PRE SAVE HOOK] Preparing to save user:", this.name);
    // e.g. Password hashing or data sanitization happens here
    next();
});

// Post-save hook (runs AFTER document is successfully saved to MongoDB)
userSchema.post("save", function(doc, next) {
    console.log("[POST SAVE HOOK] User successfully saved with ID:", doc._id);
    next();
});
```

---

### Express Middleware vs Mongoose Middleware

| Feature | Express Middleware | Mongoose Middleware |
|---|---|---|
| **Scope** | HTTP Requests (`(req, res, next)`) | Database operations (`save`, `validate`, `remove`, `find`) |
| **Trigger** | Incoming HTTP client requests | Mongoose document/query execution |
| **Common Use** | Authentication, logging, 404 handling | Password hashing, auto-updated timestamps, cleanup |

---

## Task 11 — Data Modeling Challenge

### What the Task Required

Design a schema architecture for an Alumni Platform evaluating **Embedding vs Referencing**:
- `User` <-> `AlumniProfile`: 1-to-1 relationship -> Embed or 1-to-1 reference.
- `User` <-> `Application` <-> `Job`: 1-to-Many / Many-to-Many -> Reference via `ObjectId`.
- `User` <-> `Message`: 1-to-Many -> Reference.

### Core Data Modeling Principles

1. **Embed when**:
   - Data is tightly coupled and read together (e.g. `address` inside `User`).
   - The embedded array size is bounded and small.
2. **Reference when**:
   - Data is accessed independently or updated frequently.
   - The array can grow indefinitely (unbounded 1-to-Many, e.g. millions of user posts).
   - Data is shared across multiple documents (e.g. `Job` referenced by many `Applications`).

---

## Task 12 — Transactions

### What the Task Required

Implement multi-document transactions using Mongoose sessions to perform atomic money transfers:
- Operation 1: Deduct amount from Sender wallet.
- Operation 2: Add amount to Receiver wallet.
- Operation 3: Record transaction record.
- Commit all operations if successful; rollback (abort) if any step fails.

### Concepts Used

- `mongoose.startSession()`
- `session.startTransaction()`
- `session.commitTransaction()`
- `session.abortTransaction()`
- `session.endSession()`

---

### 1. Atomic Transaction Flow

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
    // 1. Deduct sender
    await Wallet.updateOne({ userId: senderId }, { $inc: { balance: -amount } }, { session });

    // 2. Credit receiver
    await Wallet.updateOne({ userId: receiverId }, { $inc: { balance: amount } }, { session });

    // 3. Log transaction record
    await Transaction.create([{ from: senderId, to: receiverId, amount }], { session });

    // Commit all changes atomically to disk
    await session.commitTransaction();
    console.log("Transaction committed successfully");
} catch (err) {
    // Rollback all changes if any operation failed
    await session.abortTransaction();
    console.error("Transaction aborted. Rollback performed:", err.message);
} finally {
    session.endSession();
}
```

---

## Task 13 — N+1 Problem + `$lookup`

### What the Task Required

Compare three approaches for fetching relational data (`Jobs` referencing `Companies`):
1. **Naive N+1 Loop**: 1 query to fetch $N$ jobs + $N$ individual `Company.findById()` queries inside a loop ($1 + N$ queries).
2. **Mongoose `populate()`**: Mongoose automatically optimizes reference retrieval into 2 queries (`Job.find()` + `Company.find({ _id: { $in: ids } })`).
3. **MongoDB Aggregation `$lookup`**: Performs a database-level join in a single aggregation pipeline query.

### Concepts Used

- The N+1 Query Problem
- `.populate()` optimization
- Aggregation `$lookup`, `$unwind`, `$project`

---

### 1. Solving N+1 with `$lookup` Aggregation

**Code Structure:**
```javascript
// Aggregation Join ($lookup)
const jobsWithCompany = await Job.aggregate([
    {
        $lookup: {
            from: "companies",       // Target collection name in MongoDB
            localField: "companyId", // Field in Job document
            foreignField: "_id",     // Field in Company document
            as: "companyDetails"     // Output array field name
        }
    },
    { $unwind: "$companyDetails" }, // Converts 1-element array into object
    {
        $project: {
            title: 1,
            salary: 1,
            company: "$companyDetails.name",
            location: "$companyDetails.location"
        }
    }
]);
```

---

# MongoDB Fundamentals

```
MongoDB Database (codingDB)
   │
   ├── Collection: users
   │      ├── Document: { _id: ObjectId("64b..."), name: "Saurabh", age: 23 }
   │      └── Document: { _id: ObjectId("64c..."), name: "Rahul", age: 25 }
   │
   └── Collection: jobs
          └── Document: { _id: ObjectId("64d..."), title: "Backend Dev", salary: 60000 }
```

- **BSON (Binary JSON)**: MongoDB stores documents internally in BSON format, supporting data types like `ObjectId`, `Date`, `Int32`, `Double`, and `BinData`.
- **`_id` & ObjectId**: 12-byte unique identifier generated automatically by MongoDB if omitted.

---

# Mongoose ODM

Mongoose is an Object Data Modeling (ODM) library for Node.js that manages data relationships, schema validation, and translation between code objects and MongoDB BSON documents.

```
Node.js Express App  --->  Mongoose Model (User)  --->  MongoDB Driver  --->  MongoDB Database
```

### Schema vs Model vs Document
- **Schema**: Defines structural fields, data types, validators, and default values.
- **Model**: Constructor compiled from a Schema (`mongoose.model("User", userSchema)`). Provides interface for database queries.
- **Document**: An individual instance of a Model (`const user = new User(...)`).

---

# Mongoose Validation & Indexing

### Validation Constraints
- `required: true`: Ensures field is present.
- `min` / `max`: Sets numeric boundaries.
- `enum: ['pending', 'accepted']`: Enforces allowed string lists.
- `match: /regex/`: Enforces pattern matching.

*Note:* `unique: true` is an index constraint helper that creates a unique B-Tree index in MongoDB, NOT a standard Mongoose validator.

### Mongoose Query Helpers (`.lean()`)
```javascript
// .lean() returns raw plain JS objects instead of heavy Mongoose Documents, boosting read performance
const jobs = await Job.find().lean();
```

---

# Common Mistakes

1. **Missing `{ new: true }` in Updates**: Calling `findByIdAndUpdate(id, update)` without `{ new: true }` returns the old document prior to update.
2. **N+1 Query Loop**: Issuing database queries inside a `forEach` or `for...of` loop instead of using `.populate()` or `$lookup`.
3. **Misunderstanding `unique: true`**: Expecting `unique: true` to trigger validation without building database unique indexes.
4. **Incorrect `$unwind` usage**: Running `$unwind` on an empty or missing array field drops the document from the pipeline (use `preserveNullAndEmptyArrays: true` if needed).
5. **Forgetting `session` in Transactions**: Executing CRUD queries inside a transaction without passing `{ session }` executes them outside the transaction scope.

---

# Overall Concepts Learned

- Connecting Node.js to MongoDB using `mongoose.connect()`.
- Performing native BSON CRUD and Mongoose Model operations.
- Writing complex queries using `$in`, `$all`, `$and`, `$or`, `$gte`, `$lte`.
- Designing Schemas with field types, rules, and `timestamps`.
- Building REST APIs with pagination (`skip`, `limit`), sorting (`sort`), and query filtering.
- Optimizing query performance using indexes and evaluating execution plans (`.explain("executionStats")`).
- Constructing aggregation pipelines using `$match`, `$group`, `$project`, `$sort`, `$unwind`, and `$lookup`.
- Modeling relationships with `ObjectId` references and populating referenced documents using `.populate()`.
- Managing multi-document atomic operations using `session.startTransaction()`.

---

# Quick Revision

### Key MongoDB & Mongoose Snippets

#### 1. Mongoose Connection Setup
```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
};
```

#### 2. Mongoose Schema & Model
```javascript
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    salary: { type: Number, min: 0 },
    skills: [{ type: String }]
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
```

#### 3. Paginated & Sorted Query Pattern
```javascript
const jobs = await Job.find({ location: "Delhi" })
    .sort({ salary: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
```

#### 4. Aggregation Pipeline Pattern
```javascript
const stats = await Job.aggregate([
    { $match: { salary: { $gte: 30000 } } },
    { $group: { _id: "$location", avgSalary: { $avg: "$salary" }, count: { $sum: 1 } } },
    { $sort: { avgSalary: -1 } }
]);
```

#### 5. Population Pattern
```javascript
const applications = await Application.find()
    .populate("student", "name email")
    .populate("job", "title company");
```

---

# What I Can Do After These Tasks

1. **Connect Node.js to MongoDB**: Establish robust database connections using Mongoose.
2. **Execute Advanced Queries**: Perform multi-operator filtering, sorting, projection, and pagination.
3. **Optimize Query Performance**: Create indexes and analyze query plans with `.explain()`.
4. **Build Aggregation Analytics**: Construct multi-stage analytics pipelines (`$match`, `$group`, `$unwind`, `$lookup`).
5. **Model Relational Data**: Model 1-to-1, 1-to-Many, and Many-to-Many relationships using `ObjectId` references and `.populate()`.
6. **Execute Atomic Transactions**: Manage multi-document bank/wallet transfers using sessions and transactions.

---

# Real-World Connection

- **E-Commerce & Job Portals**: Product catalogs, job filtering, application tracking.
- **Analytics Dashboards**: Aggregating revenue, user growth, and performance metrics via aggregation pipelines.
- **Financial Systems**: Processing atomic balance transfers using MongoDB transactions.

---

# Connection to Previous Node.js + Express Concepts

```
Node.js HTTP Module (Module 02)
       ↓
Express.js Framework & Middleware (Module 06)
       ↓
MongoDB & Mongoose Data Persistence (Module 07)
       ↓
JWT Authentication & File Uploads (Modules 09 & 10)
```
