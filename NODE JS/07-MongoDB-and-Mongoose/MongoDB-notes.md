# MongoDB — Complete Notes

One clarification: MongoDB is the database system. MongoDB Shell (mongosh) is the command-line tool used to interact with it. Later, Mongoose will be the Node.js ODM you'll use with MongoDB.

## 1. What is MongoDB?

MongoDB is a NoSQL document-oriented database.

Unlike relational databases such as MySQL/PostgreSQL:

```text
SQL
Database
   ↓
Table
   ↓
Rows
   ↓
Columns
MongoDB
Database
   ↓
Collection
   ↓
Documents
   ↓
Fields
```

A MongoDB document looks like:

```js
{
    _id: ObjectId("..."),
    name: "Saurabh",
    age: 23,
    role: "Backend Developer"
}
```

It looks similar to JSON, but MongoDB actually stores data in BSON.

## 2. MongoDB vs SQL
| SQL | MongoDB |
| --- | --- |
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | _id |
| JOIN | $lookup / embedding / application logic |
| SQL query | MongoDB query |
| Schema | Flexible schema |

Example:

**SQL**

```sql
SELECT * FROM users;
```

**MongoDB**

```js
db.users.find()
```

A MongoDB server can contain multiple databases.

Example:

```text
MongoDB Server
│
├── collegeDB
├── jobPortalDB
└── ecommerceDB
```

Switch database:

```js
use collegeDB
```

Check current database:

db

List databases:

```js
show dbs
```

## 4. Collection

A collection is roughly equivalent to a SQL table.

Create/use:

```js
db.users
```

Insert a document:

```js
db.users.insertOne({
    name: "Saurabh",
    age: 23
})
```

MongoDB can create the collection automatically.

List collections:

```js
show collections
```

## 5. Document

Example:

```js
{
    name: "Saurabh",
    age: 23,
    skills: ["Node.js", "Express", "MongoDB"]
}
```

Documents can contain nested objects:

```js
{
    name: "Saurabh",
```

    address: {
        city: "Delhi",
        country: "India"
    }
}

This flexibility is one of MongoDB's major strengths.

## 6. _id

Every MongoDB document normally has a unique _id.

Example:

```js
{
    _id: ObjectId("68a..."),
    name: "Saurabh"
}
```

If you don't provide _id, MongoDB generates an ObjectId.

```js
db.users.insertOne({
    name: "Saurabh"
})
```

MongoDB automatically creates:

_id

You can query using it:

```js
db.users.findOne({
    _id: ObjectId("...")
})
```

## 7. BSON

MongoDB stores documents as BSON — Binary JSON.

BSON supports types such as:

- String
- Number
- Boolean
- Array
- Object
- Date
- ObjectId
- Null
- Decimal128
- Binary

Example:

```js
{
    name: "Saurabh",
    age: 23,
    active: true,
    createdAt: new Date()
}
```

## 8. CRUD

The four fundamental operations:

Create
Read
Update
Delete

## 9. Create

insertOne()
db.users.insertOne({
    name: "Saurabh",
    age: 23
})
insertMany()
db.users.insertMany([
    {
        name: "Saurabh",
        age: 23
    },
    {
        name: "Rahul",
        age: 24
    }
])

## 10. Read

Find everything
db.users.find()
Find one
db.users.findOne({
    name: "Saurabh"
})
Find by condition
db.users.find({
    age: 23
})

## 11. Comparison Operators

Very important.

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
db.users.find({
    age: {
        $gte: 20
    }
})
```

Meaning:

Find users whose age is greater than or equal to 20.

```js
$gt
db.products.find({
    price: {
        $gt: 1000
    }
})
$lt
db.products.find({
    price: {
        $lt: 1000
    }
})
$in
db.users.find({
    city: {
        $in: ["Delhi", "Mumbai"]
    }
})
```

## 12. Logical Operators

Important ones:

```js
$and
$or
$not
$nor
```

Example:

```js
db.users.find({
    $or: [
        { age: 20 },
        { age: 25 }
    ]
})
```

Another:

```js
db.products.find({
    $and: [
        { price: { $gte: 500 } },
        { price: { $lte: 2000 } }
    ]
})
```

## 13. Update

```js
updateOne()
db.users.updateOne(
    { name: "Saurabh" },
    {
        $set: {
            age: 24
        }
    }
)
updateMany()
db.users.updateMany(
    { city: "Delhi" },
    {
        $set: {
            country: "India"
        }
    }
)
```

## 14. Important Update Operators

- $set
- $set

Changes/creates a field.

```js
$unset
$unset
```

Removes a field.

```js
$inc
$inc
```

Increments a number.

Example:

```js
db.products.updateOne(
    { name: "Laptop" },
    {
        $inc: {
            stock: 5
        }
    }
)
$push
```

Adds an item to an array:

```js
$push
$pull
```

Removes matching values from an array:

- $pull

## 15. Delete

```js
deleteOne()
db.users.deleteOne({
    name: "Saurabh"
})
deleteMany()
db.users.deleteMany({
    active: false
})
```

Be careful with:

```js
db.users.deleteMany({})
```

That can delete all documents.

## 16. Query Projection

Sometimes you don't want every field.

Example:

```js
db.users.find(
    {},
    {
        name: 1,
        email: 1
    }
)
```

This is called projection.

You can exclude:

```js
db.users.find(
    {},
    {
        password: 0
    }
)
```

This is extremely useful when working with sensitive fields.

## 17. Sorting
```js
db.users.find().sort({
    age: 1
})
```

Ascending:

1

Descending:

-1

Example:

```js
db.products.find().sort({
    price: -1
})
```

Highest price first.

## 18. Limit
```js
db.users.find().limit(10)
```

Returns at most 10 documents.

## 19. Skip
```js
db.users.find()
    .skip(10)
    .limit(10)
```

This is the basic idea behind pagination.

For example:

- Page 1 → skip 0
- Page 2 → skip 10
- Page 3 → skip 20

Later you'll learn why cursor-based pagination can be better for large datasets.

## 20. Array Queries

Suppose:

```js
{
    name: "Saurabh",
    skills: ["Node.js", "MongoDB", "Express"]
}
```

Find users with Node.js:

```js
db.users.find({
    skills: "Node.js"
})
```

You can also use:

```js
$in
```

or:

```js
$all
```

Example:

```js
db.users.find({
    skills: {
        $all: ["Node.js", "MongoDB"]
    }
})
```

## 21. Nested Fields

Suppose:

```js
{
    name: "Saurabh",
    address: {
        city: "Delhi",
        pincode: 110044
    }
}
```

Query:

```js
db.users.find({
    "address.city": "Delhi"
})
```

Notice the dot notation.

## 22. Upsert

upsert means:

Update if found, otherwise create.

Example:

```js
db.users.updateOne(
    { email: "saurabh@example.com" },
    {
        $set: {
            name: "Saurabh"
        }
    },
    {
        upsert: true
    }
)
```

This is useful in many real-world situations.

## 23. Counting
```js
db.users.countDocuments()
```

With condition:

```js
db.users.countDocuments({
    age: {
        $gte: 18
    }
})
```

## 24. Indexes

This becomes very important as your database grows.

Suppose you have:

10 million users

and frequently search:

```js
db.users.find({
    email: "saurabh@example.com"
})
```

Without an appropriate index, MongoDB may need to scan many documents.

Create an index:

```js
db.users.createIndex({
    email: 1
})
```

Now MongoDB can use that index for efficient lookups.

## 25. Unique Index

For things like email:

```js
db.users.createIndex(
    {
        email: 1
    },
    {
        unique: true
    }
)
```

Now MongoDB prevents duplicate emails.

This is much stronger than checking only in your Express controller.

## 26. Compound Index

You can index multiple fields:

```js
db.jobs.createIndex({
    location: 1,
    salary: -1
})
```

This can help queries involving those fields.

Index design matters because indexes improve reads but have costs:

```text
More indexes
    ↓
Faster certain reads
    +
More storage
    +
Slower writes
```

So don't blindly index every field.

## 27. Explain

One of the most important tools for understanding query performance:

```js
db.users.find({
    email: "saurabh@example.com"
}).explain("executionStats")
```

It helps you understand things like:

- How many documents were examined?
- How many were returned?
- Was an index used?

You'll eventually use this when optimizing APIs.

## 28. Aggregation

Aggregation is one of the most important advanced MongoDB concepts.

Instead of simply finding documents, you can process data through a pipeline.

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

Think:

```text
Documents
    ↓
Stage 1
    ↓
Stage 2
    ↓
Stage 3
    ↓
Result
```

## 29. $match

Filters documents.

```js
{
    $match: {
        status: "completed"
    }
}
```

Similar to:

find()

## 30. $group

Groups documents.

Suppose:

```js
{
    product: "Laptop",
    amount: 50000
}
```

You could calculate total sales:

```js
{
    $group: {
        _id: "$product",
        total: {
            $sum: "$amount"
        }
    }
}
```

## 31. $sort

Inside aggregation:

```js
{
    $sort: {
        total: -1
    }
}
```

## 32. $project

Controls output fields:

```js
{
    $project: {
        name: 1,
        salary: 1
    }
}
```

It can also create calculated fields.

## 33. $lookup

This is one of the most important MongoDB concepts for backend developers.

It is roughly comparable to a SQL JOIN.

Suppose:

- users
- jobs
- applications

You can connect related documents with:

```js
$lookup
```

Conceptually:

```text
users
   +
applications
   ↓
combined result
```

But before using $lookup everywhere, you should understand MongoDB data modeling.

## 34. Embedding vs Referencing

This is a major design decision.

Embedded
{
    name: "Saurabh",

    address: {
        city: "Delhi",
        pincode: 110044
    }
}

Everything is inside one document.

Referenced
{
    name: "Saurabh",
    addressId: ObjectId("...")
}

Address exists elsewhere.

When to embed?

Good when:

- data belongs strongly together
- data is usually read together
- embedded data is bounded in size
- When to reference?

Good when:

- data is shared
- data grows independently
- relationships are large/many-to-many
- duplication would become expensive

This is one of the areas where MongoDB design differs significantly from simply designing SQL tables.

## 35. Transactions

MongoDB supports transactions for operations that need atomicity across multiple documents/collections.

Conceptually:

```text
Start transaction
      ↓
Operation 1
      ↓
Operation 2
      ↓
Operation 3
      ↓
Commit
```

If something fails:

Rollback

Transactions are important when several changes must succeed or fail together.

## 36. Atomic Operations

MongoDB provides atomicity at the single-document level.

For example:

```js
$inc
```

can safely update a field as part of an atomic document update.

This matters for things like:

stock
counters
balances

## 37. MongoDB Schema Design

MongoDB is often called "schema flexible."

That does not mean:

"Put random structures into the database."

You should still maintain a predictable document structure.

For example, don't have:

```js
{
    name: "Saurabh",
    age: 23
}
```

and another user:

```js
{
    username: "Rahul",
    randomField: true,
    somethingElse: "hello"
}
```

unless there's a deliberate reason.

```text
Flexible schema ≠ no schema discipline.
```

## 38. Validation

MongoDB can perform schema validation at the database level.

This is useful because validation shouldn't exist only in your Express code.

You can enforce things such as:

- required fields
- field types
- allowed values

Later, with Mongoose, you'll usually define much of this in schemas.

## 39. MongoDB Security

Never expose MongoDB directly to the public internet unnecessarily.

Your architecture should normally look like:

```text
Client
   ↓
Express API
   ↓
MongoDB
```

Not:

```text
Client
   ↓
MongoDB directly ❌
```

Also:

Do not hardcode credentials
Do not commit .env
Use authentication
Use least-privilege database users

## 40. Production concepts you should eventually know

For advanced backend development, eventually learn:

- Indexes
- Query optimization
- Aggregation
- Transactions
- Replication
- Replica sets
- Read/write concerns
- Sharding
- Connection pooling
- MongoDB Atlas
- Backups
- Monitoring
- TTL indexes
- Change streams

You don't need to master all of these immediately.

## Your MongoDB Practice Roadmap

Now I would practice in this order:

```text
LEVEL 1 — Basic
│
├── Database/collection
├── insertOne / insertMany
├── find / findOne
├── updateOne / updateMany
└── deleteOne / deleteMany
│
LEVEL 2 — Querying
│
├── Comparison operators
├── Logical operators
├── Arrays
├── Nested objects
├── Projection
├── Sorting
├── Limit / Skip
└── Upsert
│
LEVEL 3 — Real Backend Queries
│
├── Pagination
├── Filtering
├── Searching
├── Multiple conditions
└── Unique constraints
│
LEVEL 4 — Performance
│
├── Indexes
├── Compound indexes
├── Unique indexes
└── explain()
│
LEVEL 5 — Aggregation
│
├── $match
├── $group
├── $project
├── $sort
├── $unwind
└── $lookup
│
LEVEL 6 — Data Modeling
│
├── Embedding
├── Referencing
├── One-to-one
├── One-to-many
└── Many-to-many
│
LEVEL 7 — Advanced
│
├── Transactions
├── Atomic operations
├── Validation
├── Replica sets
├── Change streams
└── Production optimization
```
