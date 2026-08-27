# 🔥 Task 1 — Job Portal API v2

Build a proper Job Portal backend.

## Models

### User

- `name`
- `email`
- `skills`
- `role`
- `isActive`

`role`:

- `student`
- `recruiter`
- `admin`

### Job

- `title`
- `company`
- `location`
- `salary`
- `skills`
- `experience`
- `isActive`
- `postedBy`

`postedBy` should reference `User`.

### Application

- `student`
- `job`
- `status`
- `appliedAt`

- `student` → `User` reference
- `job` → `Job` reference

## APIs

### Users

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

### Jobs

- `POST /api/jobs`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `PATCH /api/jobs/:id`
- `DELETE /api/jobs/:id`

### Applications

- `POST /api/applications`
- `GET /api/applications`
- `GET /api/applications/:id`
- `PATCH /api/applications/:id`

### Job filtering

Your:

```text
GET /api/jobs
```

must support:

- `?location=Delhi`
- `?minSalary=30000`
- `?maxSalary=70000`
- `?skill=Node.js`
- `?experience=2`
- `?isActive=true`
- `?page=2`
- `?limit=10`
- `?sort=-salary`

Multiple filters should work together:

```text
/api/jobs?location=Delhi&minSalary=30000&skill=Node.js
```

### Application API

When getting applications, return populated data:

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
populate()
```

### Middleware

Your request flow should be:

```text
Logger
   ↓
API Key/Auth middleware
   ↓
Router
   ↓
Controller
   ↓
Error middleware
```

### Validation

Reject:

- missing title
- missing company
- invalid salary
- invalid status
- invalid role

Use Mongoose validation where appropriate.

### Error handling

Handle:

- `400`
- `401`
- `403`
- `404`
- `500`

with centralized error middleware.

### Indexing

Think about your actual query patterns.

Create appropriate indexes for things such as:

- `Job.location`
- `Job.salary`
- `Job.skills`
- `Job.company`

Don't blindly index everything.

Then test at least 2 queries with `explain("executionStats")`.

Compare:

- `COLLSCAN` vs `IXSCAN`

and observe:

- `totalDocsExamined`
- `totalKeysExamined`
- `executionTimeMillis`
- `winningPlan`

### Aggregation endpoint

Create:

```text
GET /api/jobs/stats
```

Return:

- total jobs
- average salary
- highest salary
- lowest salary
- jobs by location
- jobs by company
- jobs by skill

You already know how to do these.

### 🎯 What this task tests

- Express
- Routes
- Controllers
- Middleware
- Error handling
- Mongoose
- References
- `populate`
- CRUD
- Filtering
- Pagination
- Sorting
- Indexes
- Query optimization
- Aggregation

This is basically your previous learning combined into one backend.

---

# 🔥 Task 2 — E-Commerce API

Now build something different so you don't memorize the Job Portal structure.

## Models

### User

- `name`
- `email`
- `role`

### Product

- `name`
- `category`
- `price`
- `stock`
- `brand`
- `ratings`
- `isActive`

### Order

- `user`
- `items`
- `totalAmount`
- `status`
- `createdAt`

An order item should contain:

- `product`
- `quantity`
- `price`

Think carefully about which data should be embedded and which should be referenced.

## APIs

### Products

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

### Users

- `POST /api/users`
- `GET /api/users/:id`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

### Product filtering

Support:

- `?category=electronics`
- `?brand=Samsung`
- `?minPrice=10000`
- `?maxPrice=50000`
- `?isActive=true`
- `?page=1`
- `?limit=10`
- `?sort=-price`

Allow combinations:

```text
/api/products?category=electronics&minPrice=10000&maxPrice=50000&sort=-price
```

### Order API

When getting orders, populate the user and products.

Example:

```json
{
    "user": {
        "name": "Saurabh",
        "email": "saurabh@example.com"
    },
    "items": [
        {
            "product": {
                "name": "iPhone",
                "brand": "Apple"
            },
            "quantity": 2,
            "price": 60000
        }
    ],
    "totalAmount": 120000,
    "status": "pending"
}
```

### Aggregation

Create:

```text
GET /api/products/stats
```

Calculate:

- total products
- average price
- highest price
- lowest price
- products by category
- products by brand
- average price by category

Then create:

```text
GET /api/orders/stats
```

Calculate:

- total orders
- total revenue
- average order value
- orders by status
- revenue by status

### Indexing

Think about which fields are frequently queried:

- `category`
- `brand`
- `price`

Create indexes based on your query patterns.

Then use:

```js
.explain("executionStats")
```

to verify them.