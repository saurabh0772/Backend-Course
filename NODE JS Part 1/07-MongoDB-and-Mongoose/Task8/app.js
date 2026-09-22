import express from 'express'
import { connectDB } from "./config/database.js";
import { getStats, stats, allJobs } from './controllers/job.controller.js';
import { Job } from './models/job.model.js';
import { connect } from 'mongoose';

const app = express();

app.use(express.json())

await connectDB();


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})






