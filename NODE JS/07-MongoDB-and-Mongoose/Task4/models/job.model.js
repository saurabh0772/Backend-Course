import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    company : {
        type : String,
        required : true
    },
    location : {
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
    experience : {
        type : Number
    },
    isActive : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})


export const Job = mongoose.model('Job', jobSchema)