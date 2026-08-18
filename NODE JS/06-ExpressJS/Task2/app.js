const express = require('express')
const app = express()

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



app.get('/api/books', (req, res) => {
    res.send(books);
})

app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    const book = books.find((ele) => ele.id === bookId);

    if(!book){
      return res.status(404).json({
        "error" : "Book not found"
      })
    }

    res.send(book)
})



app.listen(3000, () => {
  console.log("Server is running at port 3000")
})