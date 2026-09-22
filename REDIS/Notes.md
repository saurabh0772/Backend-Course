# Redis + Node.js Backend Revision Notes

> **Revision pattern:** Definition → Important Commands → Node.js Example → Real-life Example

---

# 1. Redis Fundamentals

## Definition

Redis is an **in-memory data store** commonly used for:

- Caching
- Sessions
- Counters
- Rate limiting
- Pub/Sub
- Queues
- Event processing
- Real-time applications

Redis is designed for **very fast reads and writes**.

### Mental Model

```text
Client
   ↓
Node.js / Express
   ↓
Redis
   ↓
Primary Database
```

> **Important:** Redis should have a clear responsibility in your architecture. Do not add Redis simply because it is fast.

---

# 2. Strings

## Definition

Strings are the **simplest Redis data type**.

A Redis key stores a string or byte sequence. Strings can represent:

- Text
- Numbers
- Tokens
- OTPs
- Serialized JSON

## Important Commands

| Command | Purpose |
|---|---|
| `SET` | Store a value |
| `GET` | Get a value |
| `SETEX` / `EX` | Store a value with expiration |
| `EXPIRE` | Set expiration |
| `TTL` | Check remaining expiry |
| `DEL` | Delete a key |
| `INCR` | Increment a number |
| `DECR` | Decrement a number |
| `INCRBY` | Increment by a specific amount |
| `MGET` | Get multiple values |
| `MSET` | Set multiple values |
| `EXISTS` | Check whether a key exists |

## Node.js Example

```js
await redis.set("name", "Saurabh");

const name = await redis.get("name");

await redis.set("otp", "123456", "EX", 60);

await redis.incr("views");
```

## Real-Life Example

**OTP storage**

Store an OTP with a short TTL:

```text
otp:user123 → 123456
```

After the TTL expires, Redis automatically removes it.

---

# 3. Arrays

## Definition

Redis does **not have a native JavaScript-style Array data type**.

When we need array-like data, we normally use:

- **Lists** for Redis-native list operations
- **RedisJSON** for JSON arrays

## Node.js Example

```js
const skills = ["Node.js", "Redis", "MongoDB"];

await redis.set(
  "skills",
  JSON.stringify(skills)
);

const data = JSON.parse(
  await redis.get("skills")
);

console.log(data);
```

## Real-Life Example

**Recent searches**

```text
recentSearches:user123
→ ["redis", "nodejs", "mongodb"]
```

This is useful when the data should be treated as a JSON document.

---

# 4. Lists

## Definition

A Redis List is an **ordered collection of strings**.

Lists are useful when items need to be inserted or removed from the beginning or end.

## Important Commands

| Command | Purpose |
|---|---|
| `LPUSH` | Add item to the left |
| `RPUSH` | Add item to the right |
| `LPOP` | Remove item from the left |
| `RPOP` | Remove item from the right |
| `LRANGE` | Get elements in a range |
| `LLEN` | Get list length |
| `LREM` | Remove elements |

## Node.js Example

```js
await redis.rpush("tasks", "task1");
await redis.rpush("tasks", "task2");

const tasks = await redis.lrange(
  "tasks",
  0,
  -1
);

console.log(tasks);
```

### Queue Example

```js
await redis.lpush("queue", "job1");

const job = await redis.rpop("queue");

console.log(job);
```

## Real-Life Example

**Job queue**

```text
queue
 ↓
job1
job2
job3
```

Workers can take jobs from the queue one by one.

---

# 5. Geospatial

## Definition

Redis Geospatial allows you to store **longitude and latitude** and perform location-based searches.

## Important Commands

| Command | Purpose |
|---|---|
| `GEOADD` | Add a location |
| `GEOPOS` | Get coordinates |
| `GEODIST` | Calculate distance |
| `GEOSEARCH` | Search nearby locations |

## Node.js Example

```js
await redis.geoadd(
  "restaurants",
  77.5946,
  12.9716,
  "restaurant1"
);

const nearby = await redis.geosearch(
  "restaurants",
  "FROMLONLAT",
  77.59,
  12.97,
  "BYRADIUS",
  5,
  "km"
);

console.log(nearby);
```

## Real-Life Example

**Food delivery app**

A user wants restaurants within **5 km**.

```text
User Location
      ↓
Redis GEOSEARCH
      ↓
Nearby Restaurants
```

---

# 6. Hashes

## Definition

A Redis Hash stores **multiple field-value pairs under one key**.

It is similar to a JavaScript object.

```text
user:101

name → Saurabh
age  → 22
city → Delhi
```

## Important Commands

| Command | Purpose |
|---|---|
| `HSET` | Set field(s) |
| `HGET` | Get a field |
| `HGETALL` | Get all fields |
| `HDEL` | Delete a field |
| `HEXISTS` | Check whether a field exists |
| `HINCRBY` | Increment a numeric field |

## Node.js Example

```js
await redis.hset("user:101", {
  name: "Saurabh",
  age: 22,
  city: "Delhi"
});

const user = await redis.hgetall(
  "user:101"
);

console.log(user);
```

## Real-Life Example

**Session data**

```text
session:abc123

userId → 101
name   → Saurabh
role   → user
```

Related session information can be stored together.

---

# 7. Sets

## Definition

A Redis Set is an **unordered collection of unique values**.

If the same value is added multiple times, Redis stores it only once.

## Important Commands

| Command | Purpose |
|---|---|
| `SADD` | Add member |
| `SMEMBERS` | Get all members |
| `SREM` | Remove member |
| `SISMEMBER` | Check membership |
| `SCARD` | Get number of members |
| `SINTER` | Find intersection |
| `SUNION` | Find union |

## Node.js Example

```js
await redis.sadd("skills", "Node.js");
await redis.sadd("skills", "Redis");
await redis.sadd("skills", "Node.js");

const skills = await redis.smembers(
  "skills"
);

console.log(skills);
```

`Node.js` will exist only once.

## Real-Life Example

**Unique visitors**

```text
visitedUsers

user101
user102
user103
```

If `user101` visits again, no duplicate is created.

---

# 8. Sorted Sets

## Definition

A Sorted Set stores **unique members with a score**.

Redis automatically keeps members ordered according to their score.

```text
100 → Rahul
90  → Saurabh
80  → Aman
```

## Important Commands

| Command | Purpose |
|---|---|
| `ZADD` | Add member with score |
| `ZRANGE` | Get members in ascending order |
| `ZREVRANGE` | Get members in reverse order |
| `ZSCORE` | Get a member's score |
| `ZREM` | Remove member |
| `ZRANK` | Get member rank |
| `ZINCRBY` | Increase score |

## Node.js Example

```js
await redis.zadd(
  "leaderboard",
  100,
  "Rahul"
);

await redis.zadd(
  "leaderboard",
  90,
  "Saurabh"
);

await redis.zadd(
  "leaderboard",
  80,
  "Aman"
);

const top = await redis.zrevrange(
  "leaderboard",
  0,
  2,
  "WITHSCORES"
);

console.log(top);
```

## Real-Life Example

**Gaming leaderboard**

```text
1000 → Player A
950  → Player B
900  → Player C
```

When a player's score changes, Redis automatically updates their ordering.

---

# 9. Streams

## Definition

Redis Streams are an **append-only data structure for storing and processing events**.

They are useful for:

- Event-driven systems
- Message processing
- Consumer groups
- Background workers

## Important Commands

| Command | Purpose |
|---|---|
| `XADD` | Add an event |
| `XRANGE` | Read events |
| `XREAD` | Read stream |
| `XGROUP` | Create consumer group |
| `XREADGROUP` | Read using a consumer group |

## Node.js Example

```js
await redis.xadd(
  "orders",
  "*",
  "orderId",
  "101",
  "userId",
  "50"
);

const events = await redis.xrange(
  "orders",
  "-",
  "+"
);

console.log(events);
```

## Real-Life Example

**Order processing**

```text
Order Created
      ↓
Redis Stream
      ↓
Payment Service
      ↓
Inventory Service
      ↓
Notification Service
```

The event can be processed by different consumers.

---

# 10. JSON

## Definition

RedisJSON allows Redis to **store and manipulate JSON documents directly**.

Example:

```json
{
  "name": "Saurabh",
  "age": 22,
  "skills": ["Node.js", "Redis"]
}
```

## Important Commands

| Command | Purpose |
|---|---|
| `JSON.SET` | Store JSON |
| `JSON.GET` | Get JSON |
| JSON Paths | Access parts of a JSON document |

## Node.js Example

```js
await redis.json.set(
  "user:101",
  "$",
  {
    name: "Saurabh",
    age: 22,
    skills: ["Node.js", "Redis"]
  }
);

const user = await redis.json.get(
  "user:101"
);

console.log(user);
```

## Real-Life Example

**Product cache**

```text
product:101

{
  "name": "Laptop",
  "price": 60000,
  "category": "Electronics"
}
```

Useful when the application frequently needs a complete JSON document.

---

# 11. Vector Sets

## Definition

Vector Sets are designed for **storing vectors/embeddings and finding similar vectors**.

They are useful in modern AI applications such as:

- Semantic search
- Recommendation systems
- Retrieval systems
- AI applications

Example embedding:

```text
[0.21, 0.72, 0.13, ...]
```

## Important Operations

- `VADD`
- `VSIM`
- Vector similarity search

## Node.js Example

```js
await redis.vadd(
  "documents",
  [0.21, 0.72, 0.13],
  "doc:101"
);

const results = await redis.vsim(
  "documents",
  [0.20, 0.70, 0.15],
  5
);

console.log(results);
```

> **Note:** Exact Vector Set commands/API syntax can vary depending on the Redis version and Node.js client being used.

## Real-Life Example

**AI semantic search**

```text
User Query
    ↓
Embedding
    ↓
Redis Vector Set
    ↓
Similar Documents
```

---

# 12. Time Series

## Definition

Redis Time Series is designed to store **time-stamped numerical data**.

Example:

```text
Time      CPU
10:00     30
10:01     35
10:02     42
```

## Important Commands

| Command | Purpose |
|---|---|
| `TS.ADD` | Add a time-series value |
| `TS.RANGE` | Read a range of values |

## Node.js Example

```js
await redis.ts.add(
  "server:cpu",
  "*",
  42
);

const data = await redis.ts.range(
  "server:cpu",
  "-",
  "+"
);

console.log(data);
```

## Real-Life Example

**Server monitoring**

```text
Server
  ↓
CPU Usage
  ↓
Redis Time Series
  ↓
Monitoring Dashboard
```

You can store:

- CPU usage
- Memory usage
- Temperature
- Request rate

---

# 13. Pub/Sub in Redis

## Definition

Redis Pub/Sub allows one application to **publish messages to a channel** while other applications **subscribe to that channel**.

### Flow

```text
Publisher
    ↓
Redis Channel
    ↓
Subscriber
```

## Publisher

```js
import Redis from "ioredis";

const redis = new Redis();

await redis.publish(
  "notifications",
  "New order received"
);
```

## Subscriber

A subscriber should use a separate Redis connection.

```js
import Redis from "ioredis";

const subscriber = new Redis();

await subscriber.subscribe(
  "notifications"
);

subscriber.on(
  "message",
  (channel, message) => {
    console.log(channel);
    console.log(message);
  }
);
```

## Real-Life Example

**Chat application**

```text
User A
  ↓
Publisher
  ↓
Redis Channel
  ↓
Subscribers
  ↓
User B
User C
User D
```

When User A sends a message, connected subscribers receive it.

> **Important:** Redis Pub/Sub is generally **not a durable message queue**. If a subscriber is disconnected when a message is published, it will not receive that old message.

For durable event processing, consider **Redis Streams**.

---

# 14. How to Really Implement Redis in Node.js

## Definition

A Node.js backend connects to Redis through a Redis client such as `ioredis`.

Redis can then be used for:

- Caching
- Sessions
- Counters
- Rate limiting
- Pub/Sub
- Queues
- Other fast temporary data

---

## Step 1 — Install Redis Client

```bash
npm install ioredis
```

---

## Step 2 — Create Redis Connection

```js
import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_URL ||
  "redis://localhost:6379"
);

redis.on("connect", () => {
  console.log("Redis connected");
});
```

---

## Step 3 — Use Redis

### Example: API Caching

```js
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  // Check Redis first
  const cachedUser = await redis.get(
    `user:${id}`
  );

  if (cachedUser) {
    return res.json(
      JSON.parse(cachedUser)
    );
  }

  // Get from database
  const user = await User.findById(id);

  // Store in Redis
  await redis.set(
    `user:${id}`,
    JSON.stringify(user),
    "EX",
    300
  );

  res.json(user);
});
```

## Flow

```text
Request
   ↓
Check Redis
   ↓
Cache Hit?
 ┌───────┐
 Yes     No
 ↓        ↓
Return  Database
          ↓
        Redis
          ↓
        Return
```

## Real-Life Example

Suppose:

```text
GET /products
```

is requested thousands of times.

Without Redis:

```text
10000 requests
      ↓
  MongoDB
```

With Redis:

```text
10000 requests
      ↓
    Redis
      ↓
Most requests served from cache
      ↓
MongoDB receives fewer queries
```

---

# 15. Where to Use Redis?

## Definition

The most important Redis skill is not memorizing commands.

It is knowing:

> **What problem should Redis solve in my backend?**

## Common Use Cases

| Requirement | Redis Feature |
|---|---|
| Repeated API/database reads | Cache / Strings |
| Temporary data | Strings + TTL |
| Sessions | Strings / Hashes |
| OTP / verification code | Strings + TTL |
| Counters | `INCR` / `INCRBY` |
| Unique values | Sets |
| Ranking | Sorted Sets |
| Real-time fan-out | Pub/Sub |
| Reliable event processing | Streams |
| Nearby locations | Geospatial |
| AI similarity search | Vector Sets |
| Time-based metrics | Time Series |

---

## How to Identify a Redis Use Case?

### Question 1 — Is the data frequently accessed?

If the same data is requested repeatedly, Redis can be used as a cache.

```text
Node.js
   ↓
Redis
   ↓
Database
```

---

### Question 2 — Is the data temporary?

Examples:

- OTP
- Session
- Verification token
- Cache

Redis is a strong candidate.

---

### Question 3 — Do I need a fast counter?

Examples:

- Views
- Likes
- Downloads
- API requests

```js
await redis.incr("video:101:views");
```

---

### Question 4 — Do I need ranking?

Use **Sorted Sets**.

Examples:

- Gaming leaderboard
- Trending posts
- Top creators
- Top products

---

### Question 5 — Do I need unique values?

Use **Sets**.

Examples:

- Unique visitors
- Unique participants
- User skills

---

### Question 6 — Do I need real-time messaging?

Consider:

```text
Redis Pub/Sub
```

---

### Question 7 — Do I need reliable event processing?

Consider:

```text
Redis Streams
```

---

## Golden Rule

> **Don't use Redis just because Redis is fast. First identify the problem, access pattern, data lifetime, and consistency requirement.**

---

# 16. How to Run Redis?

There are several ways to run Redis.

---

## Method 1 — Docker

Docker is one of the easiest ways to run Redis during development.

### Start Redis

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:latest
```

### Check Container

```bash
docker ps
```

### Node.js Connection

```js
const redis = new Redis(
  "redis://localhost:6379"
);
```

### Architecture

```text
Node.js
   ↓
localhost:6379
   ↓
Docker Redis
```

---

# Method 2 — Docker Compose

Create:

```text
docker-compose.yml
```

```yaml
services:

  redis:
    image: redis:latest
    container_name: redis
    ports:
      - "6379:6379"
```

Start Redis:

```bash
docker compose up -d
```

Stop Redis:

```bash
docker compose down
```

---

## Important Docker Networking Rule

If **Node.js is also running inside Docker**, don't use:

```text
redis://localhost:6379
```

Instead use:

```text
redis://redis:6379
```

Because `redis` is the Docker Compose service name.

### Architecture

```text
Node.js Container
       ↓
   redis:6379
       ↓
Redis Container
```

---

# Method 3 — Local Installation

Redis can also be installed directly on your machine.

Then Node.js can connect using:

```text
redis://localhost:6379
```

Architecture:

```text
Node.js
   ↓
localhost:6379
   ↓
Redis
```

---

# Method 4 — Managed / Cloud Redis

For production, you can use a managed Redis service.

Architecture:

```text
Node.js Server
      ↓
Internet / Private Network
      ↓
Managed Redis
```

Depending on the provider, infrastructure management, availability, backups, scaling, and persistence features may be handled for you.

---

# 17. Redis Quick Revision Cheat Sheet

| Need | Think of |
|---|---|
| Simple value / cache | String |
| Temporary value | String + TTL |
| Object-like fields | Hash |
| Ordered list / queue | List |
| Unique values | Set |
| Ranking / leaderboard | Sorted Set |
| Location search | Geospatial |
| Event processing | Streams |
| Real-time messaging | Pub/Sub |
| JSON document | RedisJSON |
| AI similarity search | Vector Sets |
| Metrics over time | Time Series |

---

# Backend Learning Order

```text
Redis Fundamentals
        ↓
Strings
        ↓
TTL / EXPIRE
        ↓
Hashes
        ↓
Lists
        ↓
Sets
        ↓
Sorted Sets
        ↓
Pub/Sub
        ↓
Caching
        ↓
Rate Limiting
        ↓
Sessions
        ↓
Streams
        ↓
Docker + Redis
        ↓
Node.js + Redis
        ↓
Redis in System Design
```

---

# Final Revision Questions

Before using Redis in a backend, ask:

1. **What data am I storing?**
2. **How long should it live?**
3. **How frequently is it accessed?**
4. **Is the data temporary?**
5. **Do I need very low latency?**
6. **Do I need uniqueness?**
7. **Do I need ordering or ranking?**
8. **Do I need real-time messaging?**
9. **Do I need event processing?**
10. **Which Redis data structure best matches the access pattern?**

---

# One-Line Memory Trick

```text
String      → Simple value
Hash        → Object
List        → Ordered items
Set         → Unique items
Sorted Set  → Ranking
Geo         → Location
Stream      → Events
Pub/Sub     → Real-time messages
JSON        → JSON document
Vector Set  → Similarity search
TimeSeries  → Time-based metrics
```

> **Redis = Choose the right data structure for the backend problem.**
