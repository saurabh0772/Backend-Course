import mongoose, { Schema } from 'mongoose'

const userSchema = mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true
    }, 
    skills : [
        {
            type : String
        }
    ]
})



export const User = mongoose.model("User", userSchema)