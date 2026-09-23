import path from 'path'
import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = 3000

app.set("view engine", 'ejs')
app.set('views', path.resolve("./views"))

app.use(express.json());

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}` + file.originalname)
//     }
// })

// const upload = multer({ storage: storage })

const storage = multer.memoryStorage();
const upload = multer({
    storage,

    // limits: {
    //     fileSize: 10 * 1024 * 1024
    // },

    // fileFilter: (req, file, cb) => {

    //     if (file.mimetype.startsWith("image/")) {
    //         cb(null, true);
    //     } else {
    //         cb(new Error("Only images are allowed"));
    //     }

    // }
});


const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "file-upload"
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

app.get('/', (req, res) => {

    return res.render("homepage")
})

app.post('/upload', upload.single('profileImage'), async (req, res) => {

    const result = await uploadToCloudinary(req.file.buffer);

    console.log(result);

    return res.redirect("/")
})

app.listen(PORT, () => {
    console.log("Server is running at port ", PORT);
})