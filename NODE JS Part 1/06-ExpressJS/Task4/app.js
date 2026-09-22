const express = require('express');
const app = express();

const books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
  },
  {
    id: 3,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
  },
];


app.use((req, res, next) => {
   
    const date = new Date()
    console.log("Method: ", req.method)
    console.log("URL: ", req.url)
    console.log("Time: ", date.toLocaleTimeString())

    next()
})


app.get('/api/books', (req, res) => {
    res.send(books)
})


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})