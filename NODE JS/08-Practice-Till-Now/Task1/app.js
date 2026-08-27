import express, { application } from 'express'
import { userRouter } from './routes/user.routes.js';
import { jobRouter } from './routes/job.routes.js';
import { applicationRouter } from './routes/application.routes.js'
import { connectDB } from './database/db.js';
import { User } from './models/user.model.js'
import { Job } from './models/job.model.js'
import { Application } from './models/application.model.js';
import { logger } from './middlewares/logger.middleware.js'
import { auth } from '../../06-ExpressJS/Task8/middlewares/auth.middleware.js';
import { errorHandler } from '../../06-ExpressJS/Task8/middlewares/errorHandler.middleware.js';

const app = express();

app.use(express.json());
app.use(logger);
app.use(auth);

await connectDB();


const userDummyData = async () => {
    const users = [
    {
        name: "Saurabh Kumar",
        email: "saurabh@example.com",
        skills: ["Node.js", "Express", "MongoDB"],
        role: "student",
        isActive: true
    },
    {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        skills: ["Java", "Spring Boot", "MySQL"],
        role: "student",
        isActive: true
    },
    {
        name: "Ananya Verma",
        email: "ananya@example.com",
        skills: ["Python", "Django", "MongoDB"],
        role: "student",
        isActive: true
    },
    {
        name: "Rohit Singh",
        email: "rohit@example.com",
        skills: ["JavaScript", "React", "Node.js"],
        role: "student",
        isActive: true
    },
    {
        name: "Priya Mehta",
        email: "priya@example.com",
        skills: ["Python", "Flask", "PostgreSQL"],
        role: "student",
        isActive: false
    },
    {
        name: "Arjun Gupta",
        email: "arjun@example.com",
        skills: ["Node.js", "MongoDB", "Express"],
        role: "recruiter",
        isActive: true
    },
    {
        name: "Neha Kapoor",
        email: "neha@example.com",
        skills: ["React", "JavaScript", "CSS"],
        role: "student",
        isActive: true
    },
    {
        name: "Vikash Yadav",
        email: "vikash@example.com",
        skills: ["C++", "Python", "DSA"],
        role: "student",
        isActive: true
    },
    {
        name: "Pooja Sharma",
        email: "pooja@example.com",
        skills: ["Node.js", "Express", "React"],
        role: "recruiter",
        isActive: true
    },
    {
        name: "Aman Verma",
        email: "aman@example.com",
        skills: ["C++", "Java", "DSA"],
        role: "student",
        isActive: false
    },
    {
        name: "Karan Malhotra",
        email: "karan@example.com",
        skills: ["Node.js", "TypeScript", "MongoDB"],
        role: "recruiter",
        isActive: true
    },
    {
        name: "Simran Kaur",
        email: "simran@example.com",
        skills: ["Java", "Spring Boot", "PostgreSQL"],
        role: "student",
        isActive: true
    }
    ];

    const data = await User.insertMany(users)

    console.log("Data inserted successfully");
}
// userDummyData();

const jobDummyData = async () => {
    const jobs = [
        {
            title: "Backend Developer",
            company: "TechNova",
            location: "Delhi",
            salary: 65000,
            skills: ["Node.js", "Express", "MongoDB"],
            experience: 2,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b43"
        },
        {
            title: "Frontend Developer",
            company: "WebWorks",
            location: "Bangalore",
            salary: 55000,
            skills: ["React", "JavaScript", "CSS"],
            experience: 1,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b41"
        },
        {
            title: "Full Stack Developer",
            company: "TechNova",
            location: "Delhi",
            salary: 80000,
            skills: ["React", "Node.js", "MongoDB"],
            experience: 3,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b43"
        },
        {
            title: "Java Developer",
            company: "Infosphere",
            location: "Pune",
            salary: 70000,
            skills: ["Java", "Spring Boot", "MySQL"],
            experience: 2,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b44"
        },
        {
            title: "Python Developer",
            company: "DataCore",
            location: "Hyderabad",
            salary: 60000,
            skills: ["Python", "Django", "PostgreSQL"],
            experience: 2,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b43"
        },
        {
            title: "DevOps Engineer",
            company: "CloudWorks",
            location: "Bangalore",
            salary: 90000,
            skills: ["AWS", "Docker", "Kubernetes"],
            experience: 4,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b41"
        },
        {
            title: "Node.js Developer",
            company: "CodeCraft",
            location: "Delhi",
            salary: 75000,
            skills: ["Node.js", "Express", "MongoDB"],
            experience: 2,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b43"
        },
        {
            title: "React Developer",
            company: "WebWorks",
            location: "Mumbai",
            salary: 50000,
            skills: ["React", "JavaScript", "Redux"],
            experience: 1,
            isActive: false,
            postedBy: "6a8bce1e26d91f85b1581b41"
        },
        {
            title: "Software Engineer",
            company: "Infosphere",
            location: "Pune",
            salary: 85000,
            skills: ["Java", "DSA", "Spring Boot"],
            experience: 3,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b44"
        },
        {
            title: "MERN Stack Developer",
            company: "CodeCraft",
            location: "Delhi",
            salary: 70000,
            skills: ["MongoDB", "Express", "React", "Node.js"],
            experience: 2,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b43"
        },
        {
            title: "Data Engineer",
            company: "DataCore",
            location: "Hyderabad",
            salary: 95000,
            skills: ["Python", "SQL", "MongoDB"],
            experience: 4,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b43"
        },
        {
            title: "Junior Backend Developer",
            company: "StartUpHub",
            location: "Chandigarh",
            salary: 35000,
            skills: ["Node.js", "Express", "MongoDB"],
            experience: 0,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b41"
        },
        {
            title: "Software Developer",
            company: "TechNova",
            location: "Mumbai",
            salary: 72000,
            skills: ["JavaScript", "Node.js", "React"],
            experience: 2,
            isActive: false,
            postedBy: "6a8bce1e26d91f85b1581b43"
        },
        {
            title: "Backend Engineer",
            company: "CloudWorks",
            location: "Bangalore",
            salary: 100000,
            skills: ["Node.js", "AWS", "Docker"],
            experience: 5,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b41"
        },
        {
            title: "Python Backend Developer",
            company: "DataCore",
            location: "Delhi",
            salary: 68000,
            skills: ["Python", "Django", "REST API"],
            experience: 2,
            isActive: true,
            postedBy: "6a8bce1e26d91f85b1581b43"
        }
    ];

    const data = await Job.insertMany(jobs);

    console.log("Job data inserted successfully")
}
// jobDummyData();

const applicationDummyData = async () => {
    const applications = [
        {
            student: "6a8bce1e26d91f85b1581b39", // Saurabh
            job: "6a8bd475601ef24f54c372eb",     // Backend Developer
            status: "pending",
            appliedAt: new Date("2026-08-20")
        },

        {
            student: "6a8bce1e26d91f85b1581b3a", // Rahul
            job: "6a8bd475601ef24f54c372ec",     // Frontend Developer
            status: "accepted",
            appliedAt: new Date("2026-08-19")
        },

        {
            student: "6a8bce1e26d91f85b1581b3b", // Ananya
            job: "6a8bd475601ef24f54c372ed",     // Full Stack Developer
            status: "pending",
            appliedAt: new Date("2026-08-21")
        },

        {
            student: "6a8bce1e26d91f85b1581b3c", // Rohit
            job: "6a8bd475601ef24f54c372ee",     // Java Developer
            status: "rejected",
            appliedAt: new Date("2026-08-18")
        },

        {
            student: "6a8bce1e26d91f85b1581b3d", // Priya
            job: "6a8bd475601ef24f54c372ef",     // Python Developer
            status: "accepted",
            appliedAt: new Date("2026-08-17")
        },

        {
            student: "6a8bce1e26d91f85b1581b3f", // Neha
            job: "6a8bd475601ef24f54c372f0",     // DevOps Engineer
            status: "pending",
            appliedAt: new Date("2026-08-22")
        },

        {
            student: "6a8bce1e26d91f85b1581b40", // Vikash
            job: "6a8bd475601ef24f54c372f1",     // Node.js Developer
            status: "accepted",
            appliedAt: new Date("2026-08-16")
        },

        {
            student: "6a8bce1e26d91f85b1581b42", // Aman
            job: "6a8bd475601ef24f54c372f2",     // React Developer
            status: "rejected",
            appliedAt: new Date("2026-08-15")
        },

        {
            student: "6a8bce1e26d91f85b1581b44", // Simran
            job: "6a8bd475601ef24f54c372f3",     // Software Engineer
            status: "pending",
            appliedAt: new Date("2026-08-23")
        },

        {
            student: "6a8bce1e26d91f85b1581b39", // Saurabh
            job: "6a8bd475601ef24f54c372f4",     // MERN Stack Developer
            status: "accepted",
            appliedAt: new Date("2026-08-21")
        },

        {
            student: "6a8bce1e26d91f85b1581b3c", // Rohit
            job: "6a8bd475601ef24f54c372f5",     // Data Engineer
            status: "pending",
            appliedAt: new Date("2026-08-22")
        },

        {
            student: "6a8bce1e26d91f85b1581b3b", // Ananya
            job: "6a8bd475601ef24f54c372f6",     // Junior Backend Developer
            status: "accepted",
            appliedAt: new Date("2026-08-14")
        },

        {
            student: "6a8bce1e26d91f85b1581b3a", // Rahul
            job: "6a8bd475601ef24f54c372f7",     // Software Developer
            status: "pending",
            appliedAt: new Date("2026-08-20")
        },

        {
            student: "6a8bce1e26d91f85b1581b40", // Vikash
            job: "6a8bd475601ef24f54c372f8",     // Backend Engineer
            status: "accepted",
            appliedAt: new Date("2026-08-19")
        },

        {
            student: "6a8bce1e26d91f85b1581b3f", // Neha
            job: "6a8bd475601ef24f54c372f9",     // Python Backend Developer
            status: "rejected",
            appliedAt: new Date("2026-08-18")
        },

        // Multiple applications for the same job
        {
            student: "6a8bce1e26d91f85b1581b39", // Saurabh
            job: "6a8bd475601ef24f54c372f1",     // Node.js Developer
            status: "pending",
            appliedAt: new Date("2026-08-23")
        },

        {
            student: "6a8bce1e26d91f85b1581b3e", // Arjun
            job: "6a8bd475601ef24f54c372eb",     // Backend Developer
            status: "accepted",
            appliedAt: new Date("2026-08-20")
        }
    ];

    await Application.insertMany(applications)
    console.log("Application Dummy Data inserted")
}
// applicationDummyData();

app.use('/api/users', userRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/applications', applicationRouter);



app.use(errorHandler)
app.listen(3000, () => {
    console.log("Server is running at Port 3000")
})
