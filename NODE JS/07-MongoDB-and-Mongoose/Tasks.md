# MongoDB and Mongoose Practice Tasks

## 🟢 Task 1 — MongoDB CRUD

Create:

```text
codingDB
└── users
```

Insert at least 10 users containing:

```js
{
  name,
  email,
  age,
  city,
  skills,
  salary,
  isActive,
}
```

### Practice

- `insertOne`
- `insertMany`
- `find`
- `findOne`
- `updateOne`
- `updateMany`
- `deleteOne`
- `deleteMany`

Do not move forward until you can comfortably write these without looking them up.

## 🟢 Task 2 — MongoDB Query Challenge

Using your users, implement queries for:

- Age greater than or equal to 21
- Salary between 40k and 80k
- Delhi **or** Mumbai
- Node.js users
- Node.js **and** MongoDB users
- Active users earning more than 50k
- Projection
- Sorting
- `limit`
- `skip`

Also practice:

- `$in`
- `$nin`
- `$and`
- `$or`
- `$gte`
- `$lte`
- `$all`

## 🟡 Task 3 — Build a Mongoose User Model

Create:

```text
Task/
├── app.js
├── models/
│   └── user.model.js
└── config/
    └── database.js
```

Create a Mongoose User schema with:

- `name`
- `email`
- `age`
- `city`
- `skills`
- `salary`
- `isActive`

Add appropriate:

- `required`
- `type`
- `min` / `max`
- `unique`
- `timestamps`

Then connect it to MongoDB.

### Goal

You should be able to use:

```js
await User.create(...);
await User.find(...);
await User.findById(...);
await User.findByIdAndUpdate(...);
await User.findByIdAndDelete(...);
```

## 🟡 Task 4 — Convert Your Job API to MongoDB + Mongoose

This is the most important task.

Take your previous Job API:

```text
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
```

Remove:

```js
const jobs = [];
```

Replace it with:

```text
Job Controller
      ↓
Job Model
      ↓
MongoDB
```

Create:

```text
models/
└── job.model.js
```

Your schema should include:

- `title`
- `company`
- `location`
- `salary`
- `skills`
- `experience`
- `isActive`
- `createdAt`
- `updatedAt`

Now you are building an actual persistent backend.

## 🟡 Task 5 — Job API Filtering + Pagination

Implement:

```text
GET /api/jobs?location=Delhi
GET /api/jobs?minSalary=50000
GET /api/jobs?skill=Node.js
GET /api/jobs?page=2&limit=10
GET /api/jobs?sort=salary
```

Combine them:

```text
GET /api/jobs?location=Delhi&minSalary=50000&skill=Node.js&page=2&limit=5
```

Use Mongoose query chaining:

```js
Job.find(...)
  .sort(...)
  .skip(...)
  .limit(...);
```

Return:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 42,
    "totalPages": 9
  }
}
```

This is a real REST API pattern.

## 🟠 Task 6 — Indexing + Query Optimization

Add indexes to your Job model. Think about which fields are frequently queried:

- `location`
- `salary`
- `skills`
- `company`

Do not automatically index all of them. Create an appropriate index strategy.

Then inspect queries with MongoDB:

```js
.explain("executionStats");
```

Compare queries before and after adding indexes.

### Goal

Understand:

- `COLLSCAN` vs. `IXSCAN`
- `totalDocsExamined`
- `totalKeysExamined`

## 🟠 Task 7 — Aggregation Analytics API

Use your Job collection to build analytics.

Create `GET /api/jobs/stats`. It should return things such as:

- Total jobs
- Average salary
- Highest salary
- Lowest salary
- Jobs by location
- Jobs by company
- Jobs by skill

Use MongoDB aggregation operators:

```js
$match
$group
$project
$sort
$unwind
```

This is your first proper aggregation-based API.

## 🟠 Task 8 — User + Job + Application Models

### What You Have to Do

Create 3 Mongoose models:

1. **User**
   - Fields: `name`, `email`, `skills`
   - Example:
     ```js
     {
       name: "Saurabh",
       email: "saurabh@example.com",
       skills: ["Node.js", "MongoDB"]
     }
     ```

2. **Job**
   - Fields: `title`, `company`, `salary`, `skills`
   - Example:
     ```js
     {
       title: "Backend Developer",
       company: "ABC Technologies",
       salary: 60000,
       skills: ["Node.js", "MongoDB"]
     }
     ```

3. **Application**
   - Fields: `student`, `job`, `status`, `appliedAt`

The important part is:

```text
student → User
job     → Job
```

So an `Application` connects a `student` with a `job`.

Think:

```text
Saurabh
   ↓
Application
   ↓
Backend Developer
```

Use MongoDB references for `student` and `job`.

### Goal

Learn how to create relationships between MongoDB collections using `ObjectId` references.

## 🔴 Task 9 — `populate()`

Now use the models from Task 8.

Create:

```text
GET /api/applications
```

When you fetch applications, don't return only:

```js
student: ObjectId
job: ObjectId
```

Instead, return the related information.

For example:

```json
{
  "student": {
    "name": "Saurabh",
    "email": "saurabh@example.com"
  },
  "job": {
    "title": "Backend Developer",
    "company": "ABC Technologies"
  },
  "status": "pending"
}
```

You need to use:

```js
populate("student")
populate("job")
```

### Goal

Understand how Mongoose fetches referenced documents and puts them into the result.

## 🔴 Task 10 — Mongoose Middleware

Create a User schema and experiment with:

- `pre("save")`
- `post("save")`

### What You Need to Understand

When a User is saved:

```text
Before saving
      ↓
pre("save")
      ↓
MongoDB save
      ↓
post("save")
      ↓
After saving
```

For this task, don't worry about authentication or password hashing yet.

Just perform something simple, such as:

- Before save → log something
- After save → log something

### Goal

Understand the difference between **Express middleware** and **Mongoose middleware**:

- **Express middleware** works around HTTP requests.
- **Mongoose middleware** works around database/model operations.

## 🔴 Task 11 — Data Modeling Challenge

Don't code this task initially.

You need to design the database for your College Alumni Platform.

You have:

- `User`
- `AlumniProfile`
- `Job`
- `Application`
- `Message`

Your job is to decide:

1. **Which data should be embedded?**
   ```text
   User
    └── small related data
   ```

2. **Which data should be referenced?**
   ```text
   Application
    ├── student → User
    └── job → Job
   ```

3. **What relationships exist?**
   ```text
   User → AlumniProfile
   User → Application
   Application → Job
   User → Message
   ```

4. **Which fields should be unique?**
   - For example, think about `email`.

5. **Which fields should have indexes?**
   - Think about fields users will frequently search/filter by.

### Goal

Learn MongoDB database design before writing code.

The important question is: *Should I embed this data or store it in another collection and reference it?*

## 🔴 Task 12 — Transactions

Create a small wallet system with:

- `User`
- `Wallet`
- `Transaction`

Build:

```text
POST /api/transfer
```

The API should transfer money from one user to another.

For example:

```text
Saurabh → ₹5000
Rahul   → ₹1000
```

Transfer: `₹2000`

After successful transfer:

```text
Saurabh → ₹3000
Rahul   → ₹3000
```

And create a transaction record.

### Important Requirement

These operations must be treated as one unit:

1. Deduct ₹2000
2. Add ₹2000
3. Create transaction record

If all succeed: `COMMIT`

If anything fails: `ROLLBACK`

So you should never end up with:

- Money deducted ✅
- Money not credited ❌
- Transaction not recorded ❌

### Goal

Understand MongoDB transactions and atomicity.

The main idea is: *Either all related database changes happen, or none of them happen.*

This will teach you MongoDB transactions and atomicity.


## 🟠 Task 13 — N+1 Problem + `$lookup`

Create two collections:

```js
// companies
{
  name: "ABC Technologies",
  location: "Delhi",
}

// jobs
{
  title: "Backend Developer",
  salary: 30000,
  companyId: ObjectId("..."),
}
```

Your Job should reference a company using `companyId`.

### Part 1 — Create the N+1 Problem

Create `GET /api/jobs`.

First fetch all jobs:

```text
Jobs → 1 query
```

Then, for every job, fetch its company separately:

```text
Job 1 → Company query
Job 2 → Company query
Job 3 → Company query
...
```

If you have 10 jobs, your API effectively performs:

```text
1 + 10 = 11 queries
```

Use logging to verify how many database queries are being made.

### Part 2 — Solve It with Mongoose `populate()`

Modify your models so `companyId` has a Mongoose reference:

```text
Job
 └── companyId → Company
```

Then create `GET /api/jobs/populated`.

Return:

```json
[
  {
    "title": "Backend Developer",
    "salary": 30000,
    "company": {
      "name": "ABC Technologies",
      "location": "Delhi"
    }
  }
]
```

The goal is to understand how `populate()` avoids manually doing:

```js
for (...) {
  await Company.findById(...);
}
```

### Part 3 — Solve It with MongoDB `$lookup`

Create `GET /api/jobs/lookup`.

Use an aggregation pipeline with:

```text
$lookup
→ $unwind
→ $project
```

Return the same kind of result:

```json
[
  {
    "title": "Backend Developer",
    "salary": 30000,
    "company": {
      "name": "ABC Technologies",
      "location": "Delhi"
    }
  }
]
```

### 🎯 What You Should Understand After Task 13

```text
Naive approach
    ↓
1 Job query
    ↓
N Company queries
    ↓
N + 1 problem ❌

populate()
    ↓
Mongoose handles the relationship

$lookup
    ↓
MongoDB joins related documents
```

#### Important Distinction

Do not think: “`populate()` always means exactly one database query.” That is not necessarily true internally. The important thing is that you are not manually issuing one query per job; `populate()` manages fetching the referenced documents for you.

`$lookup` is MongoDB's aggregation-based way of combining related documents.

## 🔥 Final Project — Real Backend

After completing the tasks, turn your Job API into:

```text
Express
    ↓
Routes
    ↓
Controllers
    ↓
Services
    ↓
Mongoose Models
    ↓
MongoDB
```

Include:

- Authentication
- Validation
- Centralized error handling
- CRUD
- Filtering
- Searching
- Sorting
- Pagination
- Indexes
- Aggregation
- Relationships
- `populate()`

A good final structure:

```text
backend/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   └── application.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   └── application.model.js
│   │
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── job.routes.js
│   │   └── application.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── services/
│   │   ├── user.service.js
│   │   ├── job.service.js
│   │   └── application.service.js
│   │
│   └── app.js
│
├── server.js
├── .env
├── .gitignore
└── package.json
```

### Recommended Progression

```text
MongoDB Shell
     ↓
Queries
     ↓
Indexes
     ↓
Aggregation
     ↓
Mongoose
     ↓
Schemas + Models
     ↓
Mongoose CRUD
     ↓
Express + Mongoose
     ↓
Relationships + populate
     ↓
Aggregation APIs
     ↓
Transactions
     ↓
Production-oriented backend
```

Task 4 is the turning point. Up to Task 3, you are learning MongoDB and Mongoose in isolation. From Task 4 onward, you are using them to build the kind of persistent backend you have been preparing for.
