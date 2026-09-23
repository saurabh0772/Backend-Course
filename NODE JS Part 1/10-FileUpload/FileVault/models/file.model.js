import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        },

        publicId: {
            type: String,
            required: true
        },

        resourceType: {
            type: String,
            required: true
        },

        mimeType: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const File = mongoose.model("File", fileSchema);

export default File;