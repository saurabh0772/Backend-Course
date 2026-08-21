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

Create these models:

| Model | Fields |
| --- | --- |
| User | `name`, `email`, `skills` |
| Job | `title`, `company`, `salary`, `skills` |
| Application | `student`, `job`, `status`, `appliedAt` |

Use references:

```js
student: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
}
```

and:

```js
job: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Job",
}
```

## 🔴 Task 9 — `populate()`

Create `GET /api/applications`.

Return something like:

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

Use:

```js
.populate("student")
.populate("job")
```

This is a very important Mongoose skill.

## 🔴 Task 10 — Mongoose Middleware

Add a User schema. Use:

```js
pre("save");
```

to perform a useful operation before saving.

A classic example is password hashing, but if you have not learned authentication or password hashing yet, use a harmless logging or transformation exercise first.

Also experiment with a `post("save")` hook.

Understand:

```text
Express middleware
        ≠
Mongoose middleware
```

## 🔴 Task 11 — Data Modeling Challenge

Design the MongoDB structure for your College Alumni Platform.

Entities:

- User
- AlumniProfile
- Job
- Application
- Message

Decide:

- What should be embedded?
- What should be referenced?
- Which fields should have indexes?
- Which fields should be unique?
- What relationships exist?

For example:

```text
User
 ↓
AlumniProfile
User
 ↓
Application
 ↓
Job
Student
 ↕
Message
 ↕
Alumni
```

Do not code this immediately. Design it first.

## 🔴 Task 12 — Transactions

Build a small wallet system with:

- User
- Wallet
- Transaction

Implement `POST /api/transfer`.

Transfer `₹2000` from one user to another. The operation must:

1. Deduct money.
2. Add money.
3. Create a transaction record.
4. Commit.

If anything fails, roll back the transaction.

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
