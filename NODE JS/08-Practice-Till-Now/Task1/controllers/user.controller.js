import { User } from "../models/user.model.js"

export const getAllUsers = async (req, res) => {
    const users = await User.find({});

    res.json({
        users
    })
};


export const createUser = async (req, res) => {
    const {name, email, skills, role, isActive} = req.body

    const newUser = await User.create({
        name,
        email,
        skills,
        role, 
        isActive
    })

    res.status(201).json({
        msg : "User created succesfully",
        newUser
    })
}


export const getUserById = async (req, res) => {
    const id = req.params.id
    
    const user = await User.findById(id);

    res.json({
        user
    })
}


export const updateUserById = async (req, res) => {
    const id = req.params.id
    const {name, email, skills, role, isActive} = req.body

    const updatedUser = await User.findByIdAndUpdate(id, {
        name, email, skills, role, isActive
    })

    res.json({
        updatedUser
    })
}

export const deleteUserById = async (req, res) => {
    const id = req.params.id

    const deletedUser = await User.findByIdAndDelete(id);

    res.json({
        deletedUser
    })
}
