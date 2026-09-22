import express from 'express'
import { connectDB } from "./config/database.js";
import { getAllJobs, createJob, getJobById, updateJobById, deleteJobById } from './controllers/job.controller.js';

const app = express();

app.use(express.json())

connectDB();


app.get('/api/jobs', getAllJobs)
app.post('/api/jobs', createJob)
app.get('/api/jobs/:id', getJobById)
app.patch('/api/jobs/:id', updateJobById)
app.delete('/api/jobs/:id', deleteJobById)


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})






