import mongoose from 'mongoose'

export const connectDB = async () => {
    try{
        await mongoose.connect('hihi')
        console.log("MongoDB connected successfully")
    }catch(e){
        throw new Error(e)
    }
}