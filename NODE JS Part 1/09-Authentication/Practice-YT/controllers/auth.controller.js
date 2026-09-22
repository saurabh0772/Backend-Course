import {User} from '../models/user.model.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import  {config}  from '../config/config.js';

export const registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            success : false,
            message : "Something is missing"
        })
    }

    const isAlreadyRegistered = await User.findOne({
        $or : [
            {email},
            {username}
        ]
    })

    if(isAlreadyRegistered){
        return res.status(409).json({
            success : false,
            message : "username or email already exists"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest('hex')

    const newUser = await User.create({
        username, 
        email, 
        password : hashedPassword
    })

    const accessToken = jwt.sign({
            id : newUser._id
        }, 
        config.JWT_SECRET,
        {
            expiresIn : "15m"
        }    
    )

    const refreshToken = jwt.sign({
            id : newUser._id
        }, 
        config.JWT_SECRET,
        {
            expiresIn : "7d"
        }    
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        success : true,
        message : "User created successfully",
        user : {
            username : newUser.username,
            email : newUser.email
        },
        token : accessToken
    })
}


export const getMe = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Token not found"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log(decoded)

    if(!decoded){
        return res.status(401).json({
            success : false,
            message : "token expired"
        })
    }

    const user = await User.findById(decoded.id)


    res.json({
        user
    })
}


export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            success : false,
            message : "unauthorized - no refresh token found. Please login again"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
    
    const accessToken = jwt.sign({
        id : decoded.id
            },
        config.JWT_SECRET,{
            expiresIn : "15m"
        }
    )

    const newRefreshToken = jwt.sign({
        id : decoded.id
    } ,
    config.JWT_SECRET, {
        expiresIn : "7d"
    })

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    })

    res.json({
        success : true,
        message : "Token refreshed successfully",
        accessToken
    })
}