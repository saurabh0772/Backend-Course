import mongoose from 'mongoose'
import {config} from '../config/config.js'

export const connectDB = async () => {
    try{

        await mongoose.connect(config.MONGO_URI)
        console.log("MongoDB connected successfully")

    }catch(e){
        throw new Error("MongoDB connection error : ", e)
    }
}