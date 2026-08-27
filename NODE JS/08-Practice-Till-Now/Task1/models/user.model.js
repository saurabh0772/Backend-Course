import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    skills: [
        {
            type: String,
            required: true
        }
    ],
    role: {
        type: String,
        enum: ["student", "recruiter", "admin"],
        default: "student"
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


export const User = mongoose.model("User", userSchema)