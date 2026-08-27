import mongoose from 'mongoose'


export const connectDB = async () => {
    try{
        await mongoose.connect('hihi')
        console.log("MongoDB connected")
    }catch(e){
        console.log("MongoDb coneection error  : ", e)
    }
}

