import mongoose from 'mongoose'

const applicationSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    status: {
        type: String,
        enum: ["pending", "rejected", "accepted"]
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema)