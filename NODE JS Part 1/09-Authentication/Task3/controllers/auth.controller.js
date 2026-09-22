import {User} from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const userRegisteration = async (req, res) => {
    const {name, email, password, role} = req.body;

    // name, email, password are required and role is default to student..so no need to validate that they exists or not, we have to validate only email that it must be unique

    const checker = await User.findOne({email});

    if(checker){
        return res.status(409).json({
            message : "Email already exists in the database"
        })
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    if(!passwordRegex.test(password)){
        return res.status(400).json({
            message : "Password is weak, it must contain minimum 8 characters, at least one uppercase letter, one lowercase letter and one number"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name, email, 
        password : hashedPassword,
        role : role || "student"
    })

    const newUser = await User.findOne({email});

    res.status(201).json({
        message : "New User created successfully",
        user : newUser
    })
}

export const userLogin = async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email});
    console.log(user)

    if(!user){
        return res.status(404).json({
            message : "User not found with this email"
        })
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched) {
        return res.status(401).json({
            message : "email or password was incorrect"
        })
    }
    
    res.json({
        message : "login successfull"
    })
    
}