# MongoDB + Mongoose — Complete Notes
## Part 1 — MongoDB Fundamentals
## 1. MongoDB architecture
```text
MongoDB Server
│
├── Database
│   ├── Collection
│   │   ├── Document
│   │   ├── Document
│   │   └── Document
│   │
│   └── Collection
│
└── Database
```

Example:

```text
jobPortal
│
├── users
├── jobs
├── applications
└── messages
```

A document:

```js
{
    _id: ObjectId("..."),
    name: "Saurabh",
    email: "saurabh@example.com",
    skills: ["Node.js", "MongoDB"]
}
```

## 2. BSON

MongoDB stores documents as BSON.

BSON supports:

- String
- Number
- Boolean
- Array
- Object
- Date
- ObjectId
- Null
- Decimal128

For example:

```js
{
    name: "Saurabh",
    age: 23,
    active: true,
    createdAt: new Date()
}
```

## 3. _id and ObjectId

Every MongoDB document has an _id.

Normally MongoDB generates:

```js
_id: ObjectId("...")
```

You can search:

```js
db.users.findOne({
    _id: ObjectId("...")
})
```

In Node/Mongoose you'll frequently see:

```js
new mongoose.Types.ObjectId(id)
```

## 4. CRUD

MongoDB provides:

Create
Read
Update
Delete
Create
db.users.insertOne({...})
db.users.insertMany([...])
Read
db.users.find()
db.users.findOne({...})
Update
db.users.updateOne(...)
db.users.updateMany(...)
Delete
db.users.deleteOne(...)
db.users.deleteMany(...)

You should already be comfortable with these.

## Part 2 — MongoDB Querying
## 5. Comparison operators
```js
$eq
$ne
$gt
$gte
$lt
$lte
$in
$nin
```

Example:

```js
db.jobs.find({
    salary: {
        $gte: 50000
    }
})
```

## 6. Logical operators

- $and
- $or
- $not
- $nor

Example:

```js
db.jobs.find({
    $or: [
        { location: "Delhi" },
        { location: "Mumbai" }
    ]
})
```

## 7. Arrays

Suppose:

```js
{
    skills: ["Node.js", "Express", "MongoDB"]
}
```

Find jobs containing Node.js:

```js
db.jobs.find({
    skills: "Node.js"
})
```

Or:

```js
db.jobs.find({
    skills: {
        $in: ["Node.js", "Python"]
    }
})
```

For multiple required skills:

```js
db.jobs.find({
    skills: {
        $all: ["Node.js", "MongoDB"]
    }
})
```

## 8. Nested documents

```js
{
    company: {
        name: "ABC",
        location: "Delhi"
    }
}
```

Query:

```js
db.jobs.find({
    "company.location": "Delhi"
})
```

This is called dot notation.

## 9. Projection

Only return selected fields:

```js
db.users.find(
    {},
    {
        name: 1,
        email: 1
    }
)
```

Exclude:

```js
db.users.find(
    {},
    {
        password: 0
    }
)
```

This becomes particularly important when returning data through an API.

## 10. Sorting
```js
db.jobs.find().sort({
    salary: -1
})
1  → ascending
-1 → descending
```

## 11. Pagination

Basic pagination:

```js
db.jobs.find()
    .skip(10)
    .limit(10)
```

Formula:

```js
skip = (page - 1) × limit
```

For example:

```js
page = 3
limit = 10
```

```js
skip = (3 - 1) × 10
     = 20
Part 3 — Indexes
```

## 12. Why indexes?

Imagine:

10 million users

and:

```js
db.users.find({
    email: "saurabh@example.com"
})
```

Without an appropriate index, MongoDB may need to examine many documents.

Create:

```js
db.users.createIndex({
    email: 1
})
```

Now MongoDB can efficiently use the index.

## 13. Unique index

For email:

```js
db.users.createIndex(
    { email: 1 },
    { unique: true }
)
```

This prevents duplicate emails at the database level.

## 14. Compound index
```js
db.jobs.createIndex({
    location: 1,
    salary: -1
})
```

Useful when your application frequently queries/sorts based on those fields.

Don't create indexes everywhere.

Indexes:

Improve some reads
       +
Consume storage
       +
Can slow writes
15. explain()

Use:

```js
db.jobs.find({
    location: "Delhi"
}).explain("executionStats")
```

Important information includes:

- totalDocsExamined
- totalKeysExamined
- executionTimeMillis

This helps you understand query performance.

## Part 4 — Aggregation
## 16. Aggregation pipeline

Think:

```text
Documents
   ↓
$match
   ↓
$group
   ↓
$sort
   ↓
$project
   ↓
Result
```

Example:

```js
db.orders.aggregate([
    {
        $match: {
            status: "completed"
        }
    }
])
```

## 17. $match

Filters documents.

```js
{
    $match: {
        status: "completed"
    }
}
```

## 18. $group

For example, total revenue:

```js
{
    $group: {
        _id: null,
        totalRevenue: {
            $sum: "$amount"
        }
    }
}
```

## 19. $project

Controls output:

```js
{
    $project: {
        name: 1,
        salary: 1
    }
}
```

## 20. $sort

```js
{
    $sort: {
        salary: -1
    }
}
```

## 21. $unwind

Suppose:

```js
{
    name: "Saurabh",
    skills: ["Node.js", "MongoDB", "Express"]
}
```

```js
$unwind turns the array into separate pipeline entries.
```

Conceptually:

["Node.js", "MongoDB", "Express"]

```text
        ↓ $unwind
```

Node.js
MongoDB
Express

Very useful for analytics.

## 22. $lookup

MongoDB's way of performing a join-like operation.

Conceptually:

```text
users
   +
applications
   ↓
$lookup
   ↓
combined result
```

Don't use $lookup simply because you can. Good MongoDB schema design often avoids unnecessary joins.

## Part 5 — MongoDB Data Modeling

This is very important.

MongoDB gives you two major approaches.

Embedding
{
    name: "Saurabh",
    address: {
        city: "Delhi",
        pincode: 110044
    }
}

Use when related data:

belongs strongly together
is usually read together
is reasonably bounded
Referencing
{
    name: "Saurabh",
    addressId: ObjectId("...")
}

Use when:

- data is shared
- data grows independently
- relationships are large
- duplication would be problematic
- Part 6 — Mongoose

Now we get to the part you should focus on heavily for Node.js backend development.

## 23. What is Mongoose?

Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.

It gives you:

- Schema
- Models
- Validation
- Middleware/hooks
- Type casting
- Query helpers
- Population
- Indexes

Instead of directly doing:

```js
db.users.insertOne(...)
```

you can work with:

User.create(...)

## 24. Install Mongoose

npm install mongoose

## 25. Connecting MongoDB

import mongoose from "mongoose";

```js
await mongoose.connect(process.env.MONGO_URI);
```

console.log("MongoDB connected");

Typically put the connection logic in something like:

```text
config/
└── database.js
```

For example:

```js
import mongoose from "mongoose";
```

```js
export const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
```

    console.log("MongoDB connected");
};

Then:

import { connectDB } from "./config/database.js";

```js
await connectDB();
```

## 26. Schema

A Mongoose schema defines the expected structure of documents.

```js
import mongoose from "mongoose";
```

```js
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});
```

Unlike MongoDB's flexible document model, your application can now enforce a predictable structure.

## 27. Schema validation

You can define:

```js
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
```

    email: {
        type: String,
        required: true,
        unique: true
    },

    age: {
        type: Number,
        min: 18
    }
});

Important validators include:

- required
- unique
- min
- max
- minLength
- maxLength
- enum
- match

Important: unique: true is primarily used to create a MongoDB unique index; it is not a normal Mongoose validator that guarantees uniqueness by itself in every situation.

## 28. Model

A model is created from a schema:

```js
const User = mongoose.model("User", userSchema);
```

Now:

User

is what you'll use to interact with the MongoDB collection.

## 29. Model → Collection

If you create:

```js
mongoose.model("User", userSchema)
```

Mongoose typically maps it to:

users

So:

```text
User model
    ↓
users collection
```

## 30. Create with Mongoose

```js
const user = await User.create({
    name: "Saurabh",
    email: "saurabh@example.com",
    age: 23
});
```

## 31. Read

All:

```js
const users = await User.find();
```

One:

```js
const user = await User.findOne({
    email: "saurabh@example.com"
});
```

By ID:

```js
const user = await User.findById(id);
```

## 32. Update

```js
const user = await User.findByIdAndUpdate(
    id,
    {
        salary: 60000
    },
    {
        new: true
    }
);
```

new: true means:

Return the updated document.

Without it, you may receive the old document.

## 33. Delete
```js
await User.findByIdAndDelete(id);
```

Or:

```js
await User.deleteOne({
    email: "..."
});
```

## 34. Mongoose Query Building

You can chain operations:

```js
const jobs = await Job.find({
    location: "Delhi"
})
.sort({
    salary: -1
})
.skip(10)
.limit(10);
```

This is extremely useful for your REST APIs.

## 35. populate()

This is one of the most important Mongoose concepts.

Suppose:

```js
const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
```

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }
});

Then:

```js
const applications = await Application.find()
    .populate("student")
    .populate("job");
```

Mongoose fetches the referenced documents for you.

Conceptually:

```text
Application
   ↓
student ObjectId
   ↓
User document
```

and:

```text
Application
   ↓
job ObjectId
   ↓
Job document
```

This is something you'll use heavily in real MERN backends.

## 36. Mongoose Schema Methods

You can define instance methods:

userSchema.methods.getProfile = function () {
    return `${this.name} - ${this.email}`;
};

Then:

user.getProfile();

## 37. Static Methods

You can define model-level methods:

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

Then:

User.findByEmail("saurabh@example.com");

## 38. Mongoose Middleware / Hooks

Mongoose has middleware such as:

- pre
- post

Example:

userSchema.pre("save", function (next) {
    console.log("Before saving user");
    next();
});

This is different from Express middleware.

Don't confuse:

Express middleware

with:

Mongoose middleware

Express middleware operates around HTTP requests.

Mongoose middleware operates around database/model operations.

## 39. Timestamps

Very useful:

```js
const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String
    },
    {
        timestamps: true
    }
);
```

Mongoose automatically adds:

createdAt
updatedAt

## 40. Schema options

You will frequently see:

```js
{
    timestamps: true
}
```

You may also use:

```js
{
    versionKey: false
}
```

depending on project requirements.

Don't blindly remove Mongoose's __v; understand why you're changing schema options.

## 41. Select

You can control fields returned by queries.

For example:

```js
const users = await User.find()
    .select("name email");
```

Or exclude a password field from your schema:

```js
password: {
    type: String,
    select: false
}
```

Then it isn't returned by default.

This is particularly useful for authentication systems.

## 42. lean()

For read-only queries:

```js
const users = await User.find().lean();
```

Mongoose normally returns Mongoose documents with methods and other behavior.

lean() gives you plain JavaScript objects.

It can be useful for read-heavy endpoints where you don't need Mongoose document features.

## 43. Mongoose vs MongoDB

This distinction should be crystal clear.

MongoDB

The actual database:

```text
MongoDB
   ↓
stores documents
Mongoose
```

Node.js library:

```text
Node.js
   ↓
Mongoose
   ↓
MongoDB
```

So:

```text
Express
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

## 44. Error handling with Mongoose

Database operations are asynchronous:

try {
    const user = await User.findById(id);
} catch (error) {
    next(error);
}

This fits directly into the centralized error handling architecture you just learned.

So your backend is becoming:

```text
Request
   ↓
Router
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

and:

```text
Error
   ↓
next(error)
   ↓
Global error middleware
```

## 45. Production concepts

Once you're comfortable with Mongoose, eventually learn:

Connection pooling
Transactions
Indexes
Aggregation
populate()
Schema design
Query optimization
MongoDB Atlas
Replica sets
Change streams
TTL indexes
Caching
