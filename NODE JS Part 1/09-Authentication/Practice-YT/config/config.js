import dotenv from 'dotenv'
dotenv.config();


if(!process.env.MONGO_URI){
    throw new Error("MongoDB uri not found")
}


if(!process.env.JWT_SECRET){
    throw new Error("Jwt secret not found")
}


export const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET
}