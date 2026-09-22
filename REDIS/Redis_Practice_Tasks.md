# Redis + Node.js Practice Tasks

These tasks are designed for **Redis + Node.js backend practice**.

The difficulty gradually increases from basic Redis operations to real backend/system-design problems.

---

# 🟢 Level 1 — Redis Basics

## Task 1 — User Cache

Build a small Express API:

```text
POST /users
GET  /users/:id
```

Use MongoDB or an in-memory array as the database.

### Requirements

- `GET /users/:id` should check Redis first.
- If found → return Redis data.
- If not found → fetch from DB → store in Redis → return.
- Cache should expire after **60 seconds**.
- Add:

```text
GET /users/:id/cache
```

to tell whether the user is currently cached.

### Redis Concepts

```text
GET
SET
EX
Caching
```

---

## Task 2 — OTP System

Build:

```text
POST /auth/send-otp
POST /auth/verify-otp
```

### Requirements

- Generate a 6-digit OTP.
- Store it in Redis.
- OTP expires after **2 minutes**.
- User can verify it only once.
- Delete the OTP after successful verification.
- Don't store OTP in MongoDB.

### Flow

```text
Send OTP
   ↓
Redis
   ↓
TTL = 120 seconds
```

### Redis Concepts

```text
Strings
SET
TTL
GET
DEL
```

---

## Task 3 — Page View Counter

Build:

```text
POST /posts/:id/view
GET  /posts/:id/views
```

Every request to `/view` should increment the counter.

### Example

```text
POST /posts/101/view
POST /posts/101/view
POST /posts/101/view

GET /posts/101/views

→ 3
```

Use Redis:

```js
await redis.incr("post:101:views");
```

instead of fetching and manually incrementing.

### Redis Concepts

```text
Counters
INCR
```

---

# 🟡 Level 2 — Redis Data Structures

## Task 4 — Recently Viewed Products

Build:

```text
POST /users/:id/products/:productId/view
GET  /users/:id/recent-products
```

### Requirements

- Store recently viewed products.
- Most recent product should appear first.
- Keep only the latest **10 products**.
- If the same product is viewed again, don't keep unnecessary duplicates.

### Example

```text
User 101

Product 50
Product 20
Product 90
Product 10
...
```

### Redis Concepts

```text
Lists
LPUSH
LRANGE
LTRIM
```

---

## Task 5 — Unique Visitors

Build:

```text
POST /posts/:id/view
GET  /posts/:id/unique-visitors
```

A user viewing the same post multiple times should count only once.

### Example

```text
user101 → view
user102 → view
user101 → view
user101 → view
```

Result:

```text
Unique visitors = 2
```

### Redis Concepts

```text
Sets
SADD
SCARD
SISMEMBER
```

---

## Task 6 — User Profile Cache Using Hash

Store:

```text
user:101
```

with:

```text
name
email
role
age
```

Create:

```text
GET   /users/:id
PATCH /users/:id
```

### Requirements

- Store user data using a Redis Hash.
- `GET` should read from Redis.
- `PATCH` should update the relevant Redis field.
- Don't replace the entire Hash when only one field changes.

### Redis Concepts

```text
Hashes
HSET
HGET
HGETALL
HDEL
```

---

# 🟠 Level 3 — Sorted Sets

## Task 7 — Gaming Leaderboard ⭐

Build:

```text
POST /players/:id/score
GET  /leaderboard
GET  /players/:id/rank
```

### Example

```text
Rahul   → 1200
Saurabh → 1100
Aman    → 950
```

`GET /leaderboard` should return:

```text
1. Rahul   1200
2. Saurabh 1100
3. Aman     950
```

### Requirements

- Add/update score.
- Get top 10 players.
- Get player's rank.
- Get player's score.

### Redis Concepts

```text
Sorted Sets
ZADD
ZINCRBY
ZREVRANGE
ZRANK
ZSCORE
```

---

## Task 8 — Trending Posts

Build:

```text
POST /posts/:id/like
GET  /trending
```

Every like should increase the post's score.

### Example

```text
Post 101 → 500 likes
Post 102 → 900 likes
Post 103 → 700 likes
```

Return the top 10 trending posts.

### Extension

Make the score decay/expire after a certain period so that old viral posts don't remain permanently at the top.

### Redis Concepts

```text
Sorted Sets
ZINCRBY
ZREVRANGE
```

---

# 🔴 Level 4 — Real Backend Problems

## Task 9 — API Rate Limiter ⭐⭐

This is especially important for backend and system-design practice.

Create middleware:

```text
rateLimiter()
```

Limit:

```text
100 requests / minute / IP
```

### Example

```text
IP: 192.168.1.10

Request 1   → allowed
Request 2   → allowed
...
Request 100 → allowed
Request 101 → 429 Too Many Requests
```

Response:

```json
{
  "message": "Too many requests"
}
```

### Requirements

- Identify the user by IP.
- Store request count in Redis.
- Automatically reset after 60 seconds.
- Return remaining requests in a response header.

### Redis Concepts

```text
INCR
TTL
EXPIRE
Middleware
```

### Bonus

Implement **Sliding Window Rate Limiting** instead of a simple fixed window.

---

# 🔴 Level 5 — Pub/Sub

## Task 10 — Real-Time Notification System ⭐⭐

Create two Node.js processes:

```text
notification-publisher.js
notification-subscriber.js
```

### Publisher

Create:

```text
POST /notifications
```

Example request:

```json
{
  "userId": "101",
  "message": "Your order has been shipped"
}
```

The publisher sends the notification through Redis Pub/Sub.

### Subscriber

The subscriber receives the message and prints:

```text
New Notification
User: 101
Message: Your order has been shipped
```

### Extension

Create user-specific channels:

```text
notification:user:101
```

### Redis Concepts

```text
Pub/Sub
Publisher
Subscriber
Channels
```

---

# 🔴 Level 6 — Redis Streams

## Task 11 — Order Event System ⭐⭐⭐

Build:

```text
POST /orders
```

When an order is created:

```text
Node.js
   ↓
Redis Stream
   ↓
Order Worker
```

Example event:

```json
{
  "orderId": "ORD101",
  "userId": "USER50",
  "amount": 1500
}
```

Create:

```text
order-worker.js
```

The worker reads the stream and processes orders.

### Extension

Create separate workers:

```text
Payment Worker
Inventory Worker
Notification Worker
```

### Architecture

```text
                 Redis Stream
                      ↓
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Payment    Inventory   Notification
       Worker       Worker       Worker
```

### Redis Concepts

```text
Streams
XADD
XREAD
XGROUP
XREADGROUP
Consumer Groups
```

---

# 🟣 Level 7 — Geospatial

## Task 12 — Nearby Drivers

Build a simplified Uber/Ola-style backend.

### APIs

```text
POST /drivers/location
GET  /drivers/nearby
```

Store:

```text
driverId
latitude
longitude
```

Example:

```json
{
  "driverId": "D101",
  "latitude": 28.5355,
  "longitude": 77.3910
}
```

Then:

```text
GET /drivers/nearby?lat=28.53&lng=77.39&radius=5
```

Return drivers within 5 km.

### Redis Concepts

```text
GEOADD
GEOSEARCH
GEOPOS
GEODIST
```

---

# 🟣 Level 8 — Combine Everything

## Task 13 — Mini E-Commerce Backend ⭐⭐⭐

Build a small backend containing:

```text
User
Product
Cart
Orders
```

Use Redis for multiple responsibilities.

---

## Product Cache

Use:

```text
product:101
```

Store frequently requested product data in Redis.

---

## Cart

Use a Redis Hash:

```text
cart:user101

product101 → 2
product102 → 1
```

---

## Product Views

Use:

```text
INCR
```

Example:

```text
product:101:views
```

---

## Unique Visitors

Use:

```text
SET
```

Example:

```text
product:101:visitors
```

---

## Trending Products

Use:

```text
SORTED SET
```

Example:

```text
trending:products
```

---

## Order Events

Use:

```text
STREAM
```

Example:

```text
orders:events
```

---

## Notifications

Use:

```text
PUB/SUB
```

Example:

```text
notification:user:101
```

---

## Complete Architecture

```text
                    Node.js
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      Cache           Cart          Counters
     String          Hash            INCR
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                     Redis
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       Streams       Pub/Sub    Sorted Sets
          ↓            ↓            ↓
       Workers     Notifications  Trending
```

---

# 🚀 Recommended Practice Order

Don't try all 13 tasks immediately.

Follow this order:

```text
1. User Cache
       ↓
2. OTP System
       ↓
3. Page View Counter
       ↓
4. Recently Viewed Products
       ↓
5. Unique Visitors
       ↓
6. User Profile Hash
       ↓
7. Gaming Leaderboard
       ↓
8. Trending Posts
       ↓
9. Rate Limiter
       ↓
10. Pub/Sub Notification System
       ↓
11. Redis Streams Order System
       ↓
12. Nearby Drivers
       ↓
13. Mini E-Commerce Backend
```

---

# 🧠 How to Practice Each Task

For every task, **don't look at the solution first**.

Before writing code, answer these four questions:

```text
1. Which Redis data type should I use?

2. What should the Redis key look like?

3. What Redis commands do I need?

4. What happens when Redis doesn't contain the data?
```

---

# Redis Practice Checklist

Use this checklist while completing the tasks:

```text
[ ] Strings
[ ] TTL / EXPIRE
[ ] Counters
[ ] Lists
[ ] Sets
[ ] Hashes
[ ] Sorted Sets
[ ] Caching
[ ] Rate Limiting
[ ] Pub/Sub
[ ] Streams
[ ] Geospatial
[ ] Docker + Redis
[ ] Redis + Node.js
[ ] Combining multiple Redis features
```

---

# Final Goal

After completing these tasks, you should be able to look at a backend problem and think:

```text
Problem
   ↓
What kind of data?
   ↓
What access pattern?
   ↓
What Redis data structure?
   ↓
What Redis commands?
   ↓
What key design?
   ↓
What TTL / lifecycle?
   ↓
What happens if Redis is unavailable?
```

> **The goal is not to memorize Redis commands.**
>
> **The goal is to recognize when Redis is useful and choose the correct Redis data structure for the problem.**
