import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    age : {
        type : Number,
        required : true,
        min : 18
    },
    city : {
        type : String
    },
    skills : [
        {
            type : String,
        }
    ],
    salary : {
        type : Number,
        required : true,
        min : 10000,
        max : 30000
    },
    isActive : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})


export const User = mongoose.model('User', userSchema)