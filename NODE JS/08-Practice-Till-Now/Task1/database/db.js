import mongoose from 'mongoose'

export const connectDB = async (req, res) => {
    try{
        await mongoose.connect('hihi')
        console.log("MongoDb connected successfully")
    }catch(e){
        console.log("MongoDB error ", e)
    }
}