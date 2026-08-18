const express = require('express')
const app = express()

app.use(express.json())

const users = [
    {
        "name" : "Saurabh",
        "email" : "saurabh@example.com", 
        "age" : 23
    }
]

app.post('/api/users', (req, res) => {
    const {name, email, age} = req.body

    if(!name || !email || age === undefined){
        return res.status(404).json({
            "error" : "Name, email and age are required"
        })
    }

    // console.log(name, " ", email, " ", age)
    // i am not checking name and age becuase these two constraint can be same for two uses
    if(users.find((ele) => ele.email === email)){
        return res.status(400).json({
            "error" : "User with this email already exists"
        })
    }

    const user = {
        "name" : name,
        "email" : email,
        "age" : age
    }
    users.push(user)

    res.status(201).json({
        "message" : "User created successfully",
        user
    })
})


app.listen(3000, ()  => {
    console.log("Server is running")
})