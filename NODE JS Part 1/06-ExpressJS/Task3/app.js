const express = require('express')
const app = express()

const products = [
    {
        id: 1,
        name: "Laptop",
        category: "electronics",
        price: 50000
    },
    {
        id: 2,
        name: "Book",
        category: "books",
        price: 500
    },
    {
        id: 3,
        name: "Headphones",
        category: "electronics",
        price: 2000
    }
];

app.get('/api/products', (req, res) => {
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    let filteredData = products;

    if(category){
        filteredData = filteredData.filter((ele) => ele.category === category)
    }
    if(minPrice){
        filteredData = filteredData.filter((ele) => ele.price >= minPrice);
    }
    if(maxPrice){
        filteredData = filteredData.filter((ele) => ele.price <= maxPrice)
    }

    res.send(filteredData)
})



app.listen(3000);