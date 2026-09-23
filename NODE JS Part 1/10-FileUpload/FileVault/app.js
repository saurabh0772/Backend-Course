import express from "express";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import File from "./models/file.model.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


// ================================
// EJS
// ================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.resolve("./views")
);


// ================================
// Middleware
// ================================

app.use(express.json());


// ================================
// MongoDB
// ================================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });


// ================================
// Cloudinary
// ================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET
});


// ================================
// Multer
// ================================

const storage = multer.memoryStorage();

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "video/mp4"
];

const upload = multer({

    storage,

    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },

    fileFilter: (req, file, cb) => {

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(new Error("File type is not allowed"));

        }

    }

});


// ================================
// Cloudinary Upload Helper
// ================================

const uploadToCloudinary = (buffer, resourceType) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "filevault",

                resource_type: resourceType
            },

            (error, result) => {

                if (error) {

                    reject(error);

                } else {

                    resolve(result);

                }

            }
        );

        stream.end(buffer);

    });

};


// ================================
// Homepage
// ================================

app.get("/", async (req, res) => {

    const files = await File.find()
        .sort({ createdAt: -1 });

    return res.render("homepage", {
        files
    });

});


// ================================
// Upload File
// ================================

app.post(
    "/files",

    upload.single("file"),

    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    message: "No file uploaded"
                });

            }


            // Determine Cloudinary resource type

            let resourceType = "raw";

            if (req.file.mimetype.startsWith("image/")) {

                resourceType = "image";

            } else if (req.file.mimetype.startsWith("video/")) {

                resourceType = "video";

            }


            // Upload to Cloudinary

            const result = await uploadToCloudinary(
                req.file.buffer,
                resourceType
            );


            // Save metadata in MongoDB

            const file = await File.create({

                originalName: req.file.originalname,

                url: result.secure_url,

                publicId: result.public_id,

                resourceType: result.resource_type,

                mimeType: req.file.mimetype,

                size: req.file.size

            });


            return res.status(201).json({

                message: "File uploaded successfully",

                file

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                message: "File upload failed",

                error: error.message

            });

        }

    }
);


// ================================
// Get All Files
// ================================

app.get("/files", async (req, res) => {

    try {

        const files = await File.find()
            .sort({ createdAt: -1 });

        return res.json(files);

    } catch (error) {

        return res.status(500).json({

            message: "Failed to fetch files",

            error: error.message

        });

    }

});


// ================================
// Get Single File
// ================================

app.get("/files/:id", async (req, res) => {

    try {

        const file = await File.findById(req.params.id);

        if (!file) {

            return res.status(404).json({
                message: "File not found"
            });

        }

        return res.json(file);

    } catch (error) {

        return res.status(500).json({

            message: "Failed to fetch file",

            error: error.message

        });

    }

});


// ================================
// Delete File
// ================================

app.delete("/files/:id", async (req, res) => {

    try {

        const file = await File.findById(req.params.id);

        if (!file) {

            return res.status(404).json({
                message: "File not found"
            });

        }


        // Delete from Cloudinary

        await cloudinary.uploader.destroy(
            file.publicId,
            {
                resource_type: file.resourceType
            }
        );


        // Delete from MongoDB

        await File.findByIdAndDelete(req.params.id);


        return res.json({

            message: "File deleted successfully"

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Failed to delete file",

            error: error.message

        });

    }

});


// ================================
// Multer / General Error Handler
// ================================

app.use((error, req, res, next) => {

    if (error instanceof multer.MulterError) {

        if (error.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({

                message: "File size cannot exceed 10 MB"

            });

        }

        return res.status(400).json({

            message: error.message

        });

    }


    if (error) {

        return res.status(400).json({

            message: error.message

        });

    }


    next();

});


// ================================
// Server
// ================================

app.listen(PORT, () => {

    console.log(
        `Server is running at http://localhost:${PORT}`
    );

});