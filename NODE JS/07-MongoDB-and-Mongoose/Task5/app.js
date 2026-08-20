import express from 'express'
import { connectDB } from "./config/database.js";
import { getAllJobs, createJob } from './controllers/job.controller.js';
import { Job } from './models/job.model.js';
import { connect } from 'mongoose';

const app = express();

app.use(express.json())

await connectDB();


app.get('/api/jobs', getAllJobs)
app.post('/api/jobs', createJob)

const insertTestJobs = async () => {
    try {
        await Job.insertMany([
            {
                title: "Backend Developer",
                company: "ABC Technologies",
                location: "Delhi",
                salary: 25000,
                skills: ["Node.js", "Express", "MongoDB"],
                experience: 2,
                isActive: true
            },
            {
                title: "Frontend Developer",
                company: "XYZ Solutions",
                location: "Delhi",
                salary: 18000,
                skills: ["React", "JavaScript", "CSS"],
                experience: 1,
                isActive: true
            },
            {
                title: "Full Stack Developer",
                company: "TechWorld",
                location: "Mumbai",
                salary: 30000,
                skills: ["Node.js", "React", "MongoDB"],
                experience: 3,
                isActive: true
            },
            {
                title: "Java Developer",
                company: "Infosys",
                location: "Pune",
                salary: 22000,
                skills: ["Java", "Spring Boot", "MySQL"],
                experience: 2,
                isActive: true
            },
            {
                title: "Python Developer",
                company: "DataWorks",
                location: "Bangalore",
                salary: 20000,
                skills: ["Python", "Django", "MongoDB"],
                experience: 1,
                isActive: true
            },
            {
                title: "DevOps Engineer",
                company: "CloudTech",
                location: "Hyderabad",
                salary: 28000,
                skills: ["Docker", "AWS", "Node.js"],
                experience: 3,
                isActive: true
            },
            {
                title: "MERN Intern",
                company: "StartupHub",
                location: "Delhi",
                salary: 15000,
                skills: ["MongoDB", "Express", "React"],
                experience: 0,
                isActive: true
            },
            {
                title: "QA Engineer",
                company: "QualitySoft",
                location: "Mumbai",
                salary: 17000,
                skills: ["Java", "Selenium", "Testing"],
                experience: 1,
                isActive: true
            },
            {
                title: "Backend Engineer",
                company: "CodeBase",
                location: "Delhi",
                salary: 27000,
                skills: ["Node.js", "Express", "PostgreSQL"],
                experience: 3,
                isActive: true
            },
            {
                title: "Data Analyst",
                company: "AnalyticsPro",
                location: "Bangalore",
                salary: 23000,
                skills: ["Python", "SQL", "Excel"],
                experience: 2,
                isActive: false
            },
            {
                title: "Node.js Developer",
                company: "WebWorks",
                location: "Pune",
                salary: 26000,
                skills: ["Node.js", "Express", "MongoDB"],
                experience: 2,
                isActive: true
            },
            {
                title: "React Developer",
                company: "AppCraft",
                location: "Hyderabad",
                salary: 19000,
                skills: ["React", "JavaScript", "Redux"],
                experience: 1,
                isActive: true
            }
        ]);

        console.log("Test jobs inserted successfully");
    } catch (error) {
        console.log("Error inserting test jobs:", error);
    }
};

// insertTestJobs();


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})






