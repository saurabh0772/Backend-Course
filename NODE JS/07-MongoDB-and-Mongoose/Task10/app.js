import express from 'express'
import { connectDB } from "./config/database.js";
import { getApplications } from './controllers/application.controller.js';
import { User } from "./models/user.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";

const app = express();

app.use(express.json())

await connectDB();

app.get('/api/applications', getApplications)


// const insertUsers = async () => {
//     const users = await User.insertMany([
//         {
//             name: "Saurabh Kumar",
//             email: "saurabh@example.com",
//             skills: ["Node.js", "MongoDB", "Express"]
//         },
//         {
//             name: "Rahul Sharma",
//             email: "rahul@example.com",
//             skills: ["Java", "Spring Boot", "MySQL"]
//         },
//         {
//             name: "Ananya Verma",
//             email: "ananya@example.com",
//             skills: ["Python", "Django", "MongoDB"]
//         }
//     ]);

//     console.log("Users inserted:", users);
//     return users;
// };


// const insertJobs = async () => {
//     const jobs = await Job.insertMany([
//         {
//             title: "Backend Developer",
//             company: "ABC Technologies",
//             salary: 60000,
//             skills: ["Node.js", "MongoDB", "Express"]
//         },
//         {
//             title: "Java Developer",
//             company: "Tech Solutions",
//             salary: 70000,
//             skills: ["Java", "Spring Boot", "MySQL"]
//         },
//         {
//             title: "Python Developer",
//             company: "Innovate Labs",
//             salary: 55000,
//             skills: ["Python", "Django", "MongoDB"]
//         }
//     ]);

//     console.log("Jobs inserted:", jobs);
//     return jobs;
// };

// const insertApplications = async (users, jobs) => {
//     const applications = await Application.insertMany([
//         {
//             student: users[0]._id,
//             job: jobs[0]._id,
//             status: "pending"
//         },
//         {
//             student: users[1]._id,
//             job: jobs[0]._id,
//             status: "accepted"
//         },
//         {
//             student: users[2]._id,
//             job: jobs[1]._id,
//             status: "rejected"
//         },
//         {
//             student: users[0]._id,
//             job: jobs[2]._id,
//             status: "pending"
//         }
//     ]);

//     console.log("Applications inserted:", applications);
// };

// const seedDatabase = async () => {
//     const users = await insertUsers();
//     const jobs = await insertJobs();

//     await insertApplications(users, jobs);

//     console.log("Database seeded successfully");
// };

// seedDatabase();


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})






