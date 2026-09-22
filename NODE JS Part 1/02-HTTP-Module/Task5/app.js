const http = require('http')

const bookData = [
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin"
  },
  {
    "id": 2,
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt"
  },
  {
    "id": 3,
    "title": "You Don't Know JS",
    "author": "Kyle Simpson"
  }
];


const server = http.createServer((req, res) => {

    const url = req.url;
    const parts = url.split('/');
    // console.log(parts)
    if(parts[0] != "" || parts[1] != "api" || parts[2] != "books" || parts.length > 4){
        res.writeHead(404, {
                "content-type": 'application/json'
            })
        res.end(JSON.stringify({
            "error": "Invalid URL"
        }))
    }else if(parts[3] === undefined){
        res.writeHead(200, {
            "content-type": 'application/json'
        })
        res.end(JSON.stringify(bookData))
    }else{
        
        const book = bookData.find((ele) => ele.id === Number(parts[3]))

        if(book === undefined){
            res.writeHead(404, {
                "content-type": 'application/json'
            })
            res.end(JSON.stringify({
                "error": "Book not found"
            }))
        }else{
            res.writeHead(200, {
                    "content-type": 'application/json'
                })
            res.end(JSON.stringify(book))
        }        
    }
})


const port = 3000;

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
