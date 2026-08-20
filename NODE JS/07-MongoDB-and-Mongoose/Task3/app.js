import { connectDB } from "./config/database.js";
import { User } from "./models/user.model.js";


connectDB();


const getUsers = async () => {
    const user = await User.find()

    console.log(user);
}
getUsers();


const testing = async () => {
    //creating user
    // const newUser = await User.create({
    //     name : "Sadik",
    //     email : "sadik@gmail.com",
    //     age : 19,
    //     city : "fbd",
    //     skills : ["DSA", "CP", "Backend"],
    //     salary : 25000,
    //     isActive : true
    // })

    // console.log("User created : ", newUser)

    // const data = await User.findById("6a86acb651949475eb716985")
    // console.log(data)

    // await User.findByIdAndUpdate({
    //     _id : "6a86acb651949475eb716985"
    // }, {
    //     $set : {
    //         name : "Aman",
    //         email : "aman@gmail.com"
    //     }
    // }, {new : true})

    await User.findByIdAndDelete('6a86acb651949475eb716985')
}
testing();

