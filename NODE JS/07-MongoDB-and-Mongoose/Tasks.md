# 🟢 Task 1 — MongoDB CRUD

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
    isActive
}
```

Practice:

- insertOne
- insertMany
- find
- findOne
- updateOne
- updateMany
- deleteOne
- deleteMany

Don't move forward until you can comfortably write these without looking them up.

## 🟢 Task 2 — MongoDB Query Challenge

Using your users:

Implement queries for:

age >= 21
salary between 40k and 80k
Delhi OR Mumbai
Node.js users
Node.js AND MongoDB users
active users earning > 50k
projection
sorting
limit
skip

Also practice:

- $in
- $nin
- $and
- $or
- $gte
- $lte
- $all

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

Create a Mongoose User schema:

- name
- email
- age
- city
- skills
- salary
- isActive

Add appropriate:

- required
- type
- min/max
- unique
- timestamps

Then connect it to MongoDB.

## Goal

You should be able to:

```js
await User.create(...)
await User.find(...)
await User.findById(...)
await User.findByIdAndUpdate(...)
await User.findByIdAndDelete(...)

```
## 🟡 Task 4 — Convert Your Job API to MongoDB + Mongoose
This is the most important task.

Take your previous Job API:

POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
PATCH  /api/jobs/:id
DELETE /api/jobs/:id

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

Your schema:

- title
- company
- location
- salary
- skills
- experience
- isActive
- createdAt
- updatedAt

Now you're building an actual persistent backend.

## 🟡 Task 5 — Job API Filtering + Pagination

Implement:

GET /api/jobs?location=Delhi
GET /api/jobs?minSalary=50000
GET /api/jobs?skill=Node.js
GET /api/jobs?page=2&limit=10
GET /api/jobs?sort=salary

Combine them:

GET /api/jobs?location=Delhi&minSalary=50000&skill=Node.js&page=2&limit=5

Use Mongoose query chaining:

Job.find(...)
    .sort(...)
    .skip(...)
    .limit(...)

Return:

```js
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

Add indexes to your Job model.

Think about which fields are frequently queried:

- location
- salary
- skills
- company

Don't automatically index all of them.

Create an appropriate index strategy.

Then inspect queries with MongoDB:

```js
.explain("executionStats")
```

Compare before and after indexes.

## Goal

Understand:

- COLLSCAN
- vs
- IXSCAN

and:

- totalDocsExamined
- totalKeysExamined
## 🟠 Task 7 — Aggregation Analytics API

Now use your Job collection to build analytics.

Create:

GET /api/jobs/stats

It should return things like:

- total jobs
- average salary
- highest salary
- lowest salary
- jobs by location
- jobs by company
- jobs by skill

Use MongoDB:

```js
$match
$group
$project
$sort
$unwind
```

This is your first proper aggregation-based API.

## 🟠 Task 8 — User + Job + Application Models

Create:

User
Job
Application
User
name
email
skills
Job
title
company
salary
skills
Application
student
job
status
appliedAt

Use references:

```js
student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
```

and:

```js
job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
}
## 🔴 Task 9 — populate()
```

Create:

GET /api/applications

Return something like:

```js
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

Add a User schema.

Use:

```js
pre("save")
```

to perform some useful operation before saving.

A classic example is password hashing, but if you haven't learned authentication/password hashing yet, use a harmless logging/transformation exercise first.

Also experiment with a post("save") hook.

Understand:

```text
Express middleware
        ≠
Mongoose middleware
## 🔴 Task 11 — Data Modeling Challenge
```

Design the MongoDB structure for your College Alumni Platform.

Entities:

User
AlumniProfile
Job
Application
Message

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

Don't code this immediately. Design it first.

## 🔴 Task 12 — Transactions

Build a small wallet system:

User
Wallet
Transaction

Implement:

POST /api/transfer

Transfer:

₹2000

from one user to another.

The operation must:

1. Deduct money
2. Add money
3. Create transaction record
4. Commit

If anything fails:

ROLLBACK

This will teach you MongoDB transactions and atomicity.

## 🔥 Final Project — Real Backend

After completing the tasks, take your Job API and turn it into:

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

With:

Authentication
Validation
Centralized Error Handling
CRUD
Filtering
Searching
Sorting
Pagination
Indexes
Aggregation
Relationships
populate()

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
The progression I want you to follow
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

Task 4 is the turning point. Up to Task 3 you're learning MongoDB/Mongoose in isolation. From Task 4 onward, you're using them to build the kind of persistent backend you've been preparing for.
