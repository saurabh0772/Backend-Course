import mongoose from 'mongoose'

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: String,
    salary: Number,
    skills: [
        { type: String }
    ],
    experience: Number,
    isActive: {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema)