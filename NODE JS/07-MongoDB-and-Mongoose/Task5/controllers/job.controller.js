import { Job } from "../models/job.model.js"

export const getAllJobs = async (req, res) => {
    let {location, minSalary, maxSalary, skill, page, limit, sort} = req.query

    const filters = {}

    if(location){
        filters.location = location
    }

    if(minSalary !== undefined){
        filters.salary = {
            $gte : Number(minSalary)
        }
    }

    if(maxSalary !== undefined){
        filters.salary = {
            ...filters.salary,
            $lte : Number(maxSalary)
        }
    }
   
    if(skill){
        filters.skills = skill
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;  

    let query = Job.find(filters)
    
    if(sort){
        const sortOrder = (sort.startsWith('-')) ? -1 : 1;
        const sortData = sort.startsWith('-') ? sort.slice(1) : sort;

        query = query.sort({
            [sortData] : sortOrder
        })
    }

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    const jobs = await query;

  
    const total = await Job.countDocuments(filters)
    const totalPages = Math.ceil(total / limit)

    res.json({
        success: true,

        data: jobs,

        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    });
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


