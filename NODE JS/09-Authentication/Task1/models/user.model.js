import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String, 
        required : true, 
        unique : true,
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role : {
        type : String,
        enum : ["student", "recruiter", "admin"],
        default : "student"
    },
    isActive : {
        type : Boolean,
        default : false,
        select : false
    }
}, {
    timestamps : true
})

export const User = mongoose.model("User", userSchema)