import express from "express";
import client from './client.js'

const app = express();

app.use(express.json());

// Increment post views
app.post("/posts/:id/view", async (req, res) => {
    const { id } = req.params;

    const newViews = await client.incr(`post:${id}:views`);

    res.status(200).json({
        message: "View counted successfully",
        postId: id,
        views: newViews,
    });
});

// Get post views
app.get("/posts/:id/views", async (req, res) => {
    const { id } = req.params;

    const views = await client.get(`post:${id}:views`)

    res.status(200).json({
        postId: id,
        views,
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});