import express from "express";
import client from './client.js'

const app = express();

app.use(express.json());


// Add recently viewed product
app.post(
    "/users/:id/products/:productId/view",
    async (req, res) => {
        const { id, productId } = req.params;

        await client.lrem(`recent-products:user:${id}`, 0, productId)

        await client.lpush(`recent-products:user:${id}`, productId);
        await client.ltrim(`recent-products:user:${id}`, 0, 9);

        res.status(200).json({
            message: "Product view recorded",
            userId: id,
            productId,
        });
    }
);

// Get recently viewed products
app.get(
    "/users/:id/recent-products",
    async (req, res) => {
        const { id } = req.params;

        const products = await client.lrange(`recent-products:user:${id}`, 0, -1)

        res.status(200).json({
            userId: id,
            recentProducts: products,
        });
    }
);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});