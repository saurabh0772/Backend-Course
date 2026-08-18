const express = require('express')
const app = express()

app.use(express.json())

const users = []


app.get('/api/users', (req, res) => {
    if(users.length === 0) {
        return res.status(404).json({
            "error" : "No user found"
        })
    }

    res.json({
        users
    })
})


app.post('/api/users', (req, res) => {
    const {id, name, email} = req.body

    if(id === undefined || !name || !email){
        return res.status(400).json({
            "error" : "id, name and email are required"
        })
    }
    if(users.find((ele) => ele.email === email) || users.find((ele) => ele.id === parseInt(id))){
        return res.status(400).json({
            "error" : "Id or Email already exists"
        })
    }

    const user = {
        "id" : id,
        "name" : name,
        "email" : email
    }
    users.push(user);

    res.status(201).json({
        "msg" : "User created successfully",
        user
    })
})

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find((ele) => ele.id === parseInt(id))
    if(!user){
        return res.status(404).json({
            "error" : "User with this id not found"
        })
    }

    res.json({
        "msg" : "User found",
        user
    })
})

app.patch('/api/users/:id', (req, res) => {
    const id = req.params.id
    const {name, email} = req.body
    

    if(!users.find((ele) => ele.id === parseInt(id))){
        return res.status(404).json({
            "error" : "User not found with this id"
        })
    }

    if(name === undefined && email === undefined){
        return res.status(400).json({
            "msg" : "Provide name and email id"
        })
    }

    users.forEach(ele => {
        if(ele.id === parseInt(id)){
            if(name) ele.name = name
            if(email) ele.email = email
        }
    });

    res.json({
        "msg" : "name or email update successfully",
        users
    })

})

app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id

    if(!users.find((ele) => ele.id === parseInt(id))){
        return res.status(404).json({
            "error" : "User not found"
        })
    }
    const index = users.findIndex((ele) => ele.id === parseInt(id));
    const deletedUser = users.splice(index, 1)

    res.json({
        "msg" : "User deleted successfully",
        deletedUser
    })
})


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})