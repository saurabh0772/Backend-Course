# MongoDB Indexing: Complete Notes

## 1. What Is an Index?

Suppose your `users` collection contains 10 million users:

```js
{
  name: "Saurabh",
  email: "saurabh@example.com",
  age: 23,
  city: "Delhi",
  salary: 65000
}
```

You frequently run:

```js
db.users.find({ email: "saurabh@example.com" })
```

Without an index, MongoDB may have to check documents one by one. That is a **COLLSCAN** (collection scan).

```text
Document 1          -> email?
Document 2          -> email?
...
Document 10,000,000 -> email?
```

Create an index instead:

```js
db.users.createIndex({ email: 1 })
```

MongoDB can use the index to find the relevant key much more efficiently.

```text
Without an index:              With an index:
Collection                     Index
    |                             |
COLLSCAN                    Find matching key
    |                             |
Check many documents        Fetch matching document(s)
```

## 2. COLLSCAN

**COLLSCAN** means MongoDB scans documents in a collection to find matches.

```js
db.users.find({ age: 23 })
```

If no useful index exists on `age`, the query planner may choose a `COLLSCAN`.

```text
User 1 -> age 25  x
User 2 -> age 21  x
User 3 -> age 23  ✓
User 4 -> age 30  x
User 5 -> age 23  ✓
```

This can be fine for small collections, but it can become expensive with millions of documents.

## 3. IXSCAN

**IXSCAN** means index scan.

```js
db.users.createIndex({ age: 1 })
db.users.find({ age: 23 })
```

MongoDB navigates the index to relevant entries rather than scanning every document.

```text
Index on age
18  19  20  21  22  23 <- matching entries  24  25  26
```

Do not think `IXSCAN` means *binary search*. Think of it as traversing/searching an index structure optimized for lookups and range scans.

## 4. Why Is the Index Sorted?

```js
db.users.createIndex({ salary: 1 })
```

The index maintains keys in an ordered structure:

```text
10000  15000  18000  20000  25000  30000  40000  50000  65000  90000
```

This makes range queries efficient because MongoDB can locate and scan the relevant portion of the index.

```js
db.users.find({ salary: { $gte: 50000 } })
```

This is useful for equality, comparison, range, and sorting operations, depending on the index and query shape.

## 5. How Indexes Are Stored

The important model is:

```text
Index
  |
B-tree-family structure
  |
Ordered keys
  |
References to documents
```

```text
             50
           /    \
         20      80
        /  \    /  \
      10   30  60   90
```

The structure lets MongoDB navigate to relevant ranges without scanning every document.

## 6. Index Trade-off

Indexes improve **read performance**, but use disk space, memory/cache, and write time.

```js
db.users.createIndex({ email: 1 })
```

When inserting a document, MongoDB must insert the document and update every applicable index. With ten indexes, one insert requires ten index updates.

> Indexes improve reads but add storage and write/update/delete overhead.

## 7. Simple (Single-field) Index

A single-field index indexes one field.

```js
db.users.createIndex({ email: 1 })
db.users.find({ email: "saurabh@example.com" })

db.users.createIndex({ salary: 1 })
db.users.find({ salary: { $gte: 50000 } })
```

## 8. Compound Index

A compound index contains multiple fields.

```js
db.users.createIndex({ city: 1, salary: -1 })
```

It is ordered first by `city`, then by `salary`.

```text
Delhi   -> 70000, 65000, 50000
Mumbai  -> 90000, 75000, 40000
Pune    -> 60000, 45000
```

It can support queries such as:

```js
db.users.find({ city: "Delhi" }).sort({ salary: -1 })
```

### Field Order Matters

For `{ city: 1, salary: -1 }`, the index is primarily organized by `city`, then `salary`.

This relates to the **ESR** principle:

- **E**: Equality
- **S**: Sort
- **R**: Range

For example, `{ city: "Delhi", salary: { $gte: 50000 } }` and a salary sort can influence compound-index design. Do not memorize ESR blindly; use it when designing real indexes.

## 9. Partial Index (Partial Filter)

A partial index includes only documents satisfying a condition.

```js
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { isActive: true } }
)
```

For a query such as:

```js
db.users.find({ isActive: true, email: "saurabh@example.com" })
```

The index only stores active users. This makes it smaller, uses less storage, may require less maintenance, and is efficient for queries that match the filter.

> A query must satisfy the partial-index condition for MongoDB to safely use the partial index.

## 10. Covered Query

Normally, an index lookup may still fetch the full document:

```text
Index -> find matching key -> FETCH document -> return document
```

If the index contains every field needed by the query, MongoDB may answer directly from the index:

```js
db.users.createIndex({ email: 1, name: 1 })

db.users.find(
  { email: "saurabh@example.com" },
  { _id: 0, email: 1, name: 1 }
)
```

This is a **covered query**. It avoids fetching the full document from the collection.

## 11. Winning Plan

MongoDB's query planner considers possible ways to execute a query, such as a `COLLSCAN`, a city `IXSCAN`, or a compound-index `IXSCAN`. The selected plan is the **winning plan**.

```js
db.users.find({ city: "Delhi" }).explain()
```

## 12. `executionStats`

Use execution stats to analyze query performance:

```js
db.users.find({ city: "Delhi" }).explain("executionStats")
```

Important fields include:

- `executionTimeMillis`: how long execution took.
- `nReturned`: number of documents returned.
- `totalDocsExamined`: number of documents MongoDB examined.
- `totalKeysExamined`: number of index entries MongoDB examined.

For example, `nReturned: 10` with `totalDocsExamined: 1000000` is suspicious. A query returning ten documents after examining ten documents is much healthier.

Do not judge a query only by `executionTimeMillis` on a tiny development database: caching, hardware, data size, and environment affect timing. Inspect the plan and examined-versus-returned counts too.

## 13. `allPlansExecution`

The MongoDB explain verbosity is:

```js
.explain("allPlansExecution")
```

It provides information about candidate plans considered by the query planner and helps show why it selected the winning plan.

```text
Query
  |
Candidate plan A -> COLLSCAN
Candidate plan B -> IXSCAN
Candidate plan C -> another IXSCAN
  |
Winning plan
```

For everyday performance testing, use `.explain("executionStats")` more often.

## 14. Multikey Index

For an array field such as:

```js
{ skills: ["Node.js", "Express", "MongoDB"] }
```

an index becomes a **multikey index**:

```js
db.jobs.createIndex({ skills: 1 })
db.jobs.find({ skills: "Node.js" })
```

MongoDB automatically creates index entries for the array elements. You do not need to manually request a multikey index.

```text
Normal field: one document -> one index key
Array field:  one document -> potentially multiple index keys
```

## 15. Text Index

Text indexes support text search.

```js
db.jobs.createIndex({ title: "text", description: "text" })

db.jobs.find({
  $text: { $search: "Node.js MongoDB" }
})
```

### Tokenization

Text search processes a string into searchable terms rather than comparing the entire string literally. For example, `"Node.js developer with MongoDB experience"` becomes terms such as `Node.js`, `developer`, `MongoDB`, and `experience`.

### Stemming

Stemming can associate related forms such as `connect`, `connected`, and `connecting`, depending on the language's stemming rules.

### Relevance Score

MongoDB can calculate a text-search relevance score and sort by it:

```js
db.jobs.find(
  { $text: { $search: "Node.js developer" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

Higher scores indicate results that are more relevant to the search terms.

### One Text Index per Collection

A collection can have at most one traditional `$text` index, although that index can cover multiple fields.

```js
db.jobs.createIndex({
  title: "text",
  description: "text",
  company: "text"
})
```

You cannot create separate traditional text indexes for `title` and `description` on the same collection.

## 16. Foreground vs. Background Index Creation

Foreground/background index builds are historical MongoDB concepts. Modern MongoDB index-building behavior has changed significantly, and the old `background` option has been removed or deprecated depending on the version.

Do not write production code like the following without checking your MongoDB version and documentation:

```js
createIndex({ email: 1 }, { background: true })
```

## 17. Complete Indexing Mental Model

```text
Query
  |
Query planner
  |
  +-- COLLSCAN -> scan documents -> check documents
  |
  +-- IXSCAN -> scan index -> find relevant keys -> FETCH -> documents
```

- `COLLSCAN`: scan collection documents.
- `IXSCAN`: scan or use index entries.
- `FETCH`: retrieve actual documents after an index lookup.
- `winningPlan`: plan selected by the query planner.
- `executionStats`: actual query execution statistics.
- `allPlansExecution`: information about candidate plans.

## 18. Important Index Types for a Job API

### Single-field Index

```js
db.jobs.createIndex({ location: 1 })
```

Useful for `{ location: "Delhi" }`.

### Compound Index

```js
db.jobs.createIndex({ location: 1, salary: -1 })
```

Potentially useful for queries involving `location` and `salary`.

### Multikey Index

```js
db.jobs.createIndex({ skills: 1 })
```

Useful because `skills` is an array, for example `skills: ["Node.js", "MongoDB"]`.

### Text Index

```js
db.jobs.createIndex({ title: "text", description: "text" })
```

Useful for text searching.

### Partial Index

```js
db.jobs.createIndex(
  { salary: 1 },
  { partialFilterExpression: { isActive: true } }
)
```

Useful for indexing only active jobs.

## Final Cheat Sheet

| Concept | Meaning |
| --- | --- |
| Index | Extra data structure that makes certain queries faster. |
| `COLLSCAN` | Scan collection documents. |
| `IXSCAN` | Scan an index. |
| B-tree family | Ordered structure for efficient index traversal. |
| Single-field index | Index on one field. |
| Compound index | Index on multiple fields. |
| Partial index | Index only documents satisfying a condition. |
| Covered query | Query answered entirely from the index. |
| Winning plan | Query plan chosen by the optimizer. |
| `executionStats` | Actual query execution statistics. |
| `allPlansExecution` | Candidate-plan execution information. |
| Multikey index | Index on an array field. |
| Text index | Supports `$text` search. |
| Tokenization | Break text into searchable terms. |
| Stemming | Relate different forms of words. |
| Text score | Relevance score for text search. |
| Foreground/background | Historical index-build concepts. |

> An index trades extra storage and write/update overhead for faster reads by giving MongoDB an ordered structure it can search instead of repeatedly scanning the whole collection.
