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


const getData = async () => {
    try{
        const data = await User.find()
        console.log(data)
    }catch(e) {console.log(e)}
}
// getData();


// in - return from list (either any one present then return)
// nin - return from list that neither anyone of them is present

//and and or - contains array

//all - must match all things inside the array, but IN - gives all result that satisfy even single value

const inSkills = async () => {
    // const data = await User.find({
    //     skills : {
    //         $in : ['Express', 'Django']
    //     }
    // })

    // const data = await User.find({
    //     skills : {
    //         $nin : ['Express', 'Django']
    //     }
    // })

    // const data = await User.find({
    //     $and : [
    //         {city : "Delhi"},
    //         {salary : {$gt : 45000}}
    //     ]
    // })

    // const data = await User.find({
    //     $or : [
    //         {city : "Delhi"},
    //         {salary : {$lt : 45000}}
    //     ]
    // })

    const data = await User.find({
        skills : {
            $all : ["Python", "Django", "mongodb"]
        }
    })

    console.log(data)
}

inSkills();




