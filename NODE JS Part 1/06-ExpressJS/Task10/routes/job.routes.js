import express from 'express'
import { getAllJobs, getJobById, createNewJob, updateJob, deleteJobById } from '../controllers/job.controller.js'

const jobRouter = express.Router()


jobRouter.get('/', getAllJobs)
jobRouter.post('/', createNewJob)
jobRouter.get('/:id', getJobById)
jobRouter.patch('/:id', updateJob)
jobRouter.delete('/:id', deleteJobById)

export default jobRouter