import { Router } from "express";
import { createJob, getAllJobs, getJobByid, updateJobById, deleteJobById } from '../controllers/job.controller.js'

const jobRouter = Router();

jobRouter.post('/', createJob);
jobRouter.get('/', getAllJobs);
jobRouter.get('/:id', getJobByid);
jobRouter.patch('/:id', updateJobById);
jobRouter.delete('/:id', deleteJobById);

export { jobRouter }