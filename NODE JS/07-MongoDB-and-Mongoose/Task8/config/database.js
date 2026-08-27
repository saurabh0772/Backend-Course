import mongoose from 'mongoose'


export const connectDB = async () => {
    try{
        await mongoose.connect('hehe')
        console.log("MongoDB connected")
    }catch(e){
        console.log("MongoDb coneection error  : ", e)
    }
}

