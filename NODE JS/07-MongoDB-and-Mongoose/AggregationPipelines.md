# MongoDB Aggregation Pipeline

## 1. Basic Syntax

```js
db.collection.aggregate([
  // Stage 1
  {},
  // Stage 2
  {},
  // Stage 3
  {}
])
```

For example:

```js
db.jobs.aggregate([
  { $match: { location: "Delhi" } },
  {
    $group: {
      _id: "$company",
      totalJobs: { $sum: 1 }
    }
  }
])
```

```text
Documents -> $match -> $group -> Output
```

## 2. What Is a Pipeline?

A pipeline is an array of stages through which MongoDB passes documents.

```js
[
  { $match: { /* condition */ } },
  { $group: { /* grouping */ } },
  { $sort: { /* order */ } }
]
```

Each stage receives the output of the previous stage.

```text
100 documents -> $match -> 30 documents -> $group -> 5 documents -> $sort -> 5 sorted documents
```

> The order of stages matters. A pipeline that matches before grouping is not necessarily equivalent to one that groups before matching.

## 3. Aggregation Options

The basic syntax is:

```js
db.collection.aggregate(pipeline, options)
```

For example:

```js
db.jobs.aggregate(
  [{ $match: { location: "Delhi" } }],
  { allowDiskUse: true }
)
```

Options are not pipeline stages; they configure how MongoDB executes the aggregation. The `allowDiskUse: true` option permits temporary disk use for certain operations that exceed the memory limit. Beginner queries can usually omit options.

## 4. `$match`

`$match` filters documents based on a condition. It is conceptually similar to `find()`.

```js
db.jobs.aggregate([
  { $match: { location: "Delhi" } }
])
```

Given this input:

```js
[
  { title: "Backend Developer", location: "Delhi" },
  { title: "Frontend Developer", location: "Mumbai" },
  { title: "Node Developer", location: "Delhi" }
]
```

the output contains only the two Delhi documents.

> Prefer placing `$match` early when possible, so later stages process fewer documents.

## 5. `$group`

`$group` groups documents by a field or expression and performs calculations such as `$sum`, `$avg`, `$min`, `$max`, and `$addToSet`.

The `_id` inside `$group` determines which documents belong to the same group.

```js
db.users.aggregate([
  {
    $group: {
      _id: "$city"
    }
  }
])
```

For documents from Delhi and Mumbai, this produces:

```js
[
  { _id: "Delhi" },
  { _id: "Mumbai" }
]
```

The `$` prefix means “use the value of this field,” so `_id: "$city"` groups by city value.

## 6. `$sum`

`$sum` calculates a sum.

```js
db.users.aggregate([
  {
    $group: {
      _id: null,
      totalSalary: { $sum: "$salary" }
    }
  }
])
```

For salaries `20000`, `30000`, `40000`, and `50000`, the result is:

```js
{ _id: null, totalSalary: 140000 }
```

Using `_id: null` puts all documents into one group.

## 7. `$sum: 1` — Counting Documents

```js
db.jobs.aggregate([
  {
    $group: {
      _id: "$location",
      totalJobs: { $sum: 1 }
    }
  }
])
```

Each document contributes `1` to its group, so this counts documents per location.

```js
[
  { _id: "Delhi", totalJobs: 4 },
  { _id: "Mumbai", totalJobs: 2 },
  { _id: "Pune", totalJobs: 3 }
]
```

## 8. `$avg`

`$avg` calculates the average.

```js
db.jobs.aggregate([
  {
    $group: {
      _id: "$location",
      averageSalary: { $avg: "$salary" }
    }
  }
])
```

For Delhi salaries of `20000`, `30000`, and `40000`, the average is `30000`.

## 9. `$min` and `$max`

`$min` finds the smallest value and `$max` finds the largest value within each group.

```js
db.jobs.aggregate([
  {
    $group: {
      _id: "$location",
      minimumSalary: { $min: "$salary" },
      maximumSalary: { $max: "$salary" }
    }
  }
])
```

For salaries of `20000`, `30000`, and `40000`, the minimum is `20000` and the maximum is `40000`.

## 10. `$addToSet`

`$addToSet` collects unique values into an array.

```js
db.jobs.aggregate([
  {
    $group: {
      _id: "$company",
      skills: { $addToSet: "$skill" }
    }
  }
])
```

If a company has skill values `Node.js`, `MongoDB`, and `Node.js`, the result is:

```js
{
  _id: "ABC",
  skills: ["Node.js", "MongoDB"]
}
```

## 11. `$sort`

`$sort` orders documents from the previous stage. A value of `1` is ascending; `-1` is descending.

```js
db.jobs.aggregate([
  { $sort: { salary: -1 } }
])
```

Aggregation becomes especially useful when sorting computed group values:

```js
db.jobs.aggregate([
  {
    $group: {
      _id: "$location",
      averageSalary: { $avg: "$salary" }
    }
  },
  { $sort: { averageSalary: -1 } }
])
```

## 12. `$count`

`$count` counts documents passing through the pipeline.

```js
db.jobs.aggregate([
  { $match: { location: "Delhi" } },
  { $count: "totalJobs" }
])
```

If there are four Delhi jobs:

```js
[{ totalJobs: 4 }]
```

### `$count` vs. `$sum: 1`

- `$count` counts every document that reached that stage.
- `$sum: 1` counts documents within each `$group`.

## 13. `$unwind`

`$unwind` expands an array into separate documents—one document per array element.

```js
db.users.aggregate([
  { $unwind: "$skills" }
])
```

This document:

```js
{
  name: "Saurabh",
  skills: ["Node.js", "MongoDB", "Express"]
}
```

becomes three documents, each containing one `skills` value.

> Think of `$unwind` as: one document with an array -> multiple documents, one for each array element.

## 14. Why `$unwind` Is Useful

To find how many jobs require each skill, unwind the skills and then group them:

```js
db.jobs.aggregate([
  { $unwind: "$skills" },
  {
    $group: {
      _id: "$skills",
      totalJobs: { $sum: 1 }
    }
  },
  { $sort: { totalJobs: -1 } }
])
```

Possible result:

```js
[
  { _id: "Node.js", totalJobs: 7 },
  { _id: "MongoDB", totalJobs: 5 },
  { _id: "React", totalJobs: 4 }
]
```

## 15. `$$ROOT`

`$$ROOT` is an aggregation system variable representing the complete document currently being processed.

- `"$field"` means the value of one field.
- `"$$ROOT"` means the entire current document.

```js
db.users.aggregate([
  {
    $group: {
      _id: "$city",
      users: { $push: "$$ROOT" }
    }
  }
])
```

This puts the full original documents into the `users` array for each city.

## 16. `$push` vs. `$addToSet`

- `$push` collects every value, including duplicates.
- `$addToSet` collects only unique values.

```js
// Input skill values: Node.js, Node.js, MongoDB
{ $push: "$skills" }     // ["Node.js", "Node.js", "MongoDB"]
{ $addToSet: "$skills" } // ["Node.js", "MongoDB"]
```

## 17. Complete Real-world Example

For each location, find the number of jobs, salary statistics, and unique skills:

```js
db.jobs.aggregate([
  { $unwind: "$skills" },
  {
    $group: {
      _id: "$location",
      totalJobs: { $sum: 1 },
      averageSalary: { $avg: "$salary" },
      minimumSalary: { $min: "$salary" },
      maximumSalary: { $max: "$salary" },
      skills: { $addToSet: "$skills" }
    }
  },
  { $sort: { averageSalary: -1 } }
])
```

```text
jobs -> $unwind -> one skill per document -> $group -> calculate values -> $sort
```

> Because the pipeline unwinds `skills` before grouping, `totalJobs` counts skill entries, not necessarily distinct jobs. Use a separate grouping strategy if you need unique job counts.

## 18. Aggregation vs. `find()`

Use `find()` when you mainly need matching documents:

```js
db.jobs.find({ location: "Delhi" })
```

Use `aggregate()` to transform or group documents, calculate statistics and totals, find minimum/maximum values, manipulate arrays, create reports, or perform multi-stage processing.

```js
db.jobs.aggregate([
  { $match: { location: "Delhi" } },
  {
    $group: {
      _id: "$company",
      averageSalary: { $avg: "$salary" }
    }
  },
  { $sort: { averageSalary: -1 } }
])
```

## 19. Project
Definition

$project is an aggregation stage used to select, remove, rename, or create fields in the output documents.

Syntax
{
    $project: {
        field1: 1,
        field2: 1,
        field3: 0
    }
}
1 → include field
0 → exclude field
_id is included by default unless explicitly set to 0
Example
db.users.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            city: 1
        }
    }
])

Input:

{
    name: "Saurabh",
    email: "saurabh@example.com",
    age: 23,
    city: "Delhi"
}

Output:

{
    name: "Saurabh",
    city: "Delhi"
}
Rename field
{
    $project: {
        _id: 0,
        userName: "$name",
        userCity: "$city"
    }
}

Output:

{
    userName: "Saurabh",
    userCity: "Delhi"
}
Create calculated field
{
    $project: {
        name: 1,
        monthlySalary: {
            $divide: ["$salary", 12]
        }
    }
}
Easy way to remember
$match
→ Which documents?


$project
→ Which fields?

Main use: reshape the documents before returning the final aggregation result.

## 20. Quick Cheat Sheet

| Stage / operator | Purpose |
| --- | --- |
| `$match` | Filter documents. |
| `$group` | Group documents. |
| `$sum` | Calculate a total or count. |
| `$avg` | Calculate an average. |
| `$min` | Find a minimum. |
| `$max` | Find a maximum. |
| `$addToSet` | Collect unique values. |
| `$sort` | Sort documents. |
| `$count` | Count documents. |
| `$unwind` | Expand an array into separate documents. |
| `$$ROOT` | Represent the complete current document. |
| `$push` | Collect values, including duplicates. |

## The Most Important Mental Model

```text
$match  -> filter
$unwind -> expand arrays
$group  -> group and calculate
$sort   -> order results
$count  -> count results

$field  -> value of a field
$$ROOT  -> entire current document
```

> A `$group` stage does not preserve the original document shape. Its output contains only the fields you explicitly construct (such as `_id`, `totalJobs`, and `averageSalary`). Use `$$ROOT` with `$push` when entire documents must be carried forward.
