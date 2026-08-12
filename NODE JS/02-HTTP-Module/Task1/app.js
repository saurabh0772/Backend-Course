const http = require('http')

const server = http.createServer((req, res) => {
    const url = req.url;

    if(url === '/'){
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end("Welcome to my server")
    }else if(url === '/about'){
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end("This is the About Page")
    }else if(url === '/contact'){
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end("Contact us at example@email.com")
    }else{
        res.writeHead(404, {
            "content-type": 'text/plain' 
        })
        res.end("NOT FOUND")
    }
})

const port = 3000;

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})