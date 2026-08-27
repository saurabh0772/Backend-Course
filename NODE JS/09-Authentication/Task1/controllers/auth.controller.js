import {User} from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const userRegisteration = async (req, res) => {
    const {name, email, password, role, isActive} = req.body;

    // name, email, password are required and role is default to student..so no need to validate that they exists or not, we have to validate only email that it must be unique

    const checker = await User.findOne({email});

    if(checker){
        return res.status(409).json({
            message : "Email already exists in the database"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name, email, 
        password : hashedPassword,
        role : role || "student",
        isActive : isActive || "false"
    })

    const newUser = await User.findOne({email});

    res.status(201).json({
        message : "New User created successfully",
        user : newUser
    })
}