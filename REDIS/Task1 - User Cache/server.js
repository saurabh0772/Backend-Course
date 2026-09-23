import express from "express";
import client from "./client.js";

const app = express();

app.use(express.json());

// Fake database
const users = [
    {
        id: "1",
        name: "Saurabh",
        email: "saurabh@example.com",
        age: 22,
    },
    {
        id: "2",
        name: "Rahul",
        email: "rahul@example.com",
        age: 23,
    },
];

// Create user
app.post("/users", (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        return res.status(400).json({
            message: "Name, email and age are required",
        });
    }

    const newUser = {
        id: String(users.length + 1),
        name,
        email,
        age,
    };

    users.push(newUser);

    res.status(201).json({
        message: "User created successfully",
        user: newUser,
    });
});

// Get user
app.get("/users/:id", async (req, res) => {
    const { id } = req.params;

    const data = await client.get(`user:${id}`);

    if (data) {
        return res.json(JSON.parse(data));
    }

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    await client.set(`user:${id}`, JSON.stringify(user));
    await client.expire(`user:${id}`, 60);

    res.json({
        source: "database",
        user,
    });
});

// Check cache
app.get("/users/:id/cache", async (req, res) => {
    const id = req.params.id;
    const data = await client.get(`user:${id}`);
    // console.log(data);


    if (data) {
        return res.json({
            cached: true
        })
    }

    res.json({
        cached: false,
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});