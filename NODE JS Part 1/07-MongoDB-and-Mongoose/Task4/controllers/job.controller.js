import { Job } from "../models/job.model.js"

export const getAllJobs = async (req, res) => {
    const allJobs = await Job.find()
    
    if(allJobs === null){
        return res.status(404).json({
            "msg" : "No jobs found"
        })
    }

    res.json({
        "Jobs" : allJobs
    })
}


export const createJob = async (req, res) => {
    const {title, company, location, salary, skills, experience, isActive} = req.body;

    // validators are already in the schema, so here we dont have to define custom validators

    const newJob = await Job.create({
        title, company, location, salary, skills, experience, isActive
    })

    res.status(201).json({
        "msg" : "Job created successfully",
        newJob
    })
}


export const getJobById = async (req, res) => {
    const id = req.params.id;

    const job = await Job.findById(id)

    if(job === null){
        return res.status(404).json({
            msg : "No job found with this id"
        })
    }

    res.json({
        msg : "Job found",
        job
    })
}

export const updateJobById = async (req, res) => {
    const id = req.params.id
    const {title, company, location, salary, skills, experience, isActive} = req.body;

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (company !== undefined) updates.company = company;
    if (location !== undefined) updates.location = location;
    if (salary !== undefined) updates.salary = salary;
    if (skills !== undefined) updates.skills = skills;
    if (experience !== undefined) updates.experience = experience;
    if (isActive !== undefined) updates.isActive = isActive;

    const updatedJob = await Job.findByIdAndUpdate(
        id,
        {
            $set : updates
        }, 
        {
            new : true,
            runValidators: true
        }
    )

    if (!updatedJob) {
    return res.status(404).json({
        msg: "Job not found"
    });
}

    res.json({
        msg : "Updated successfully",
        updatedJob
    })
}


export const deleteJobById = async (req, res) => {
    const id = req.params.id

    const deletedJob = await Job.findByIdAndDelete(id)
    
    if (!deletedJob) {
        return res.status(404).json({
            msg: "Job not found"
        });
    }

    res.json({
        msg : "Job deleted with id successfully"
    })
}