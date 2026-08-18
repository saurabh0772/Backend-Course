const users = [
    {
        "id" : 1,
        "name" : "Saurabh"
    },
    {
        "id" : 2,
        "name" : "Sadik"
    }
]

const getUsers = (req, res) => {
    res.json({
        users
    })
}

const getUserById = (req, res) => {
    const id = req.params.id;
    const user = users.find((ele) => ele.id === parseInt(id));
    if(user === undefined){
        return res.status(404).json({
            "error" : "User not found"
        })
    }

    res.json({
        user
    })
}


export {
    getUsers,
    getUserById
}