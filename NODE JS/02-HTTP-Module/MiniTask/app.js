const http = require('http')



const server = http.createServer((req, res) => {

    const url = req.url;

    if(url === '/text'){
        res.writeHead(200, {
            'content-type': 'text/plain'
        })
        res.end("Hello, this is plain text");
    }else if(url === '/html'){
        res.writeHead(200, {
            'content-type': 'text/html'
        })
        res.end("<h1>Hello from Node.js</h1>")
    }else if(url === "/json"){
        res.writeHead(200, {
            "content-type": "application/json"
        })
        res.end(JSON.stringify())
    }else{
        res.writeHead(404, {
            "content-type": 'text/plain'
        })
        res.end("Page not found !")
    }

})


const port = 3000;

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
