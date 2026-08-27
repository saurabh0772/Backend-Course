import mongoose, { model } from 'mongoose'

const applicationSchema = mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }, 
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job"
    },
    status : {
        type : String,
        enum: ["pending", "accepted", "rejected"]
    },
    appliedAt : {
        type : Date,
        default : Date.now
    }
})


export const Application = mongoose.model("Application", applicationSchema) 