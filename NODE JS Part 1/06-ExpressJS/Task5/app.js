const express = require('express')
const app = express()


app.use('/api/profile', (req, res, next) => {
    const header = req.headers

    // console.log(header)
    const key = "x-api-key"
    // console.log(header[key])
    // console.log(typeof(header[key]))
    if(header[key] !== "12345"){
        return res.status(401).json({
            "error" : "Unauthorized"
        })
    }

    next();
})

app.get('/api/profile', (req, res) => {
    
    res.send("Authorized")
})


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})