const express = require('express')
const app = express();

const data = {
    "status" : "running",
    "message" : "Server is working"
}

app.get('/', (req, res) => {
    res.json(data);
    // res.send(data); //both works same why?
})

app.get('/about', (req, res) => {
    res.send("This is about page")
})

app.get('/api/status', (req, res) => {
    res.status(200).json(data);
})

app.listen(3000, () => {
    console.log("Server is running at port 3000.");
})