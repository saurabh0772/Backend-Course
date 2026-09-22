// import express from 'express'
import mongoose, { model, Schema } from 'mongoose'

// const app = express()

// mongodb connection

const connectDB = async () => {
    try{
        const connection = await mongoose.connect('hehe-url-dedo')
        console.log("MongoDB connected successfully")
    }catch(e){
        console.log("MongoDB error : ", e)
    }
}


connectDB();


// schema creations

const userSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        unique : true
    },
    age : {
        type : Number
    },
    city : {
        type : String
    },
    skills : [
        {type : String}
    ],
    salary : {
        type : Number
    },
    isActive : {
        type : Boolean,
        default : false
    }
});

//creating model from the schema
const User = model("User", userSchema);

//insertOne
const addOneData = async () => {
    try{
        const data = await User.insertOne({
            name : "Sadik",
            email : "sadik@gmail.com",
            age : 22,
            city : "Faridabad",
            skills : ["Html", "Css"],
            salary : 15000,
            isActive : true
        })

        console.log("Data inserted successfully : ", data)
    }catch(e) {console.log(e)}
}
// addOneData();


// inserting 10 dummy data :
// insertMany
const dummyDataAdd = async () => {
    try{
        await User.insertMany([
            {
                name: "Saurabh Kumar",
                email: "saurabh@example.com",
                age: 23,
                city: "Delhi",
                skills: ["Node.js", "Express", "MongoDB"],
                salary: 65000,
                isActive: true
            },
            {
                name: "Rahul Sharma",
                email: "rahul@example.com",
                age: 25,
                city: "Mumbai",
                skills: ["Java", "Spring Boot", "MySQL"],
                salary: 75000,
                isActive: true
            },
            {
                name: "Ananya Verma",
                email: "ananya@example.com",
                age: 21,
                city: "Delhi",
                skills: ["Python", "Django", "MongoDB"],
                salary: 50000,
                isActive: true
            },
            {
                name: "Rohit Singh",
                email: "rohit@example.com",
                age: 28,
                city: "Bangalore",
                skills: ["JavaScript", "React", "Node.js"],
                salary: 90000,
                isActive: true
            },
            {
                name: "Priya Mehta",
                email: "priya@example.com",
                age: 24,
                city: "Pune",
                skills: ["Python", "Flask", "PostgreSQL"],
                salary: 55000,
                isActive: false
            },
            {
                name: "Arjun Gupta",
                email: "arjun@example.com",
                age: 30,
                city: "Mumbai",
                skills: ["Node.js", "MongoDB", "Express"],
                salary: 100000,
                isActive: true
            },
            {
                name: "Neha Kapoor",
                email: "neha@example.com",
                age: 22,
                city: "Delhi",
                skills: ["React", "JavaScript", "CSS"],
                salary: 45000,
                isActive: false
            },
            {
                name: "Vikash Yadav",
                email: "vikash@example.com",
                age: 27,
                city: "Hyderabad",
                skills: ["C++", "Python", "DSA"],
                salary: 70000,
                isActive: true
            },
            {
                name: "Pooja Sharma",
                email: "pooja@example.com",
                age: 26,
                city: "Bangalore",
                skills: ["Node.js", "Express", "React"],
                salary: 85000,
                isActive: true
            },
            {
                name: "Aman Verma",
                email: "aman@example.com",
                age: 20,
                city: "Chandigarh",
                skills: ["C++", "Java", "DSA"],
                salary: 40000,
                isActive: false
            }
        ])

        console.log("Dummy Data inserted successfully")
    }catch(e){
        console.log(e)
    }
}
// dummyDataAdd();


//fetching all the data from the dataBase
//find
const getData = async () => {
    try{
        const data = await User.find()
        console.log(data)
    }catch(e) {console.log(e)}
}
// getData();


//find One
// const getOneData = async () => {
//     try{
//         const data = await User.findOne({
//             name : "Neha Srivastav"
//         })
//         // console.log(data)
//         if(data === null) {
//             console.log("Data not found")
//             return
//         }
//         console.log("Data found : ", data);
//     }catch(e) {console.log(e)}
// }

// getOneData();


//update One
const updateOneData = async () => {
    try{
        await User.updateOne({
            name : "Neha Kapoor"
        }, {
            name : "Neha Gupta",
            email : "testing@gmail.com"
        })

        console.log("Data updated")
    }catch(e) {console.log(e)}
}
// updateOneData();


//update Many
const updateManyData = async () => {
    await User.updateMany({
        isActive : true
    }, {
        age : 25
    })
    console.log("All active users age is set to 25")
}
// updateManyData();


//delete One
const deleteOneData = async () => {
    const deleted = await User.deleteOne({
        name : "Neha Gupta"
    })
    console.log("User deleted", deleted)
}
// deleteOneData();



//delete many data
const deteleManyData = async () => {
    await User.deleteMany()

    console.log("All user having age 25 are deleted")
}
// deteleManyData();








// always use $set , $unset , $inc , $push, $pull

// these all are used in updation

const update = async () => {
    // await User.updateMany({
    //     isActive : true
    // }, {
    //     $set : {
    //         age : 25
    //     }
    // })

    // await User.updateOne({
    //     salary : 40000
    // }, {
    //     $inc : {
    //         salary : 5000
    //     }
    // })

    // await User.updateMany({
    //     salary : 45000
    // }, {
    //     $push : {
    //         skills : "AI/ML"
    //     }
    // })

    // await User.updateMany({
    //     salary : 45000
    // }, {
    //     $pull : {
    //         skills : "AI/ML"
    //     }
    // })
    await User.updateMany({
        salary : 45000
    }, {
        $unset : {
            city : ""
        }
    })
}
update();
getData();