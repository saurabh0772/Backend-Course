import { Job } from '../models/job.model.js'

export const getAllJobs = async (req, res) => {

    const { location, minSalary, maxSalary, skill, experience, isActive, page, limit, sort } = req.query
    let filters = {}
    
    if(location !== undefined) filters.location = location

    if(minSalary !== undefined) {
    filters.salary = {
        ...filters.salary,
        $gte: Number(minSalary)
    }
}

    if(maxSalary !== undefined) {
        filters.salary = {
            ...filters.salary,
            $lte: Number(maxSalary)
        }
    }
    if(skill !== undefined) filters.skills = skill
    if(experience !== undefined) filters.experience = experience
    if(isActive !== undefined) filters.isActive = isActive
    

    let query = Job.find(filters).populate("postedBy");


    // for sorting
    if(sort !== undefined){
        const sortOrder = (sort[0] === '-') ? -1 : 1;
        const sortData = (sort[0] === '-') ? sort.slice(1, sort.length) : sort;
        query = query.sort({
            [sortData] : sortOrder
        })
    }   

    // for page and limit -> use skip and limit
    const pageNum = (page !== undefined) ? page : 1;
    const limitPerPage = (limit !== undefined) ? limit : 20

    query = query.skip((pageNum - 1) * limitPerPage).limit(limitPerPage)

    
    const jobs = await query;

    res.json({
        jobs
    })
}

export const createJob = async (req, res) => {
    const {title, company, location, salary, skills, experience, isActive, postedBy} = req.body

    const newUser = await Job.create({
        title, company, location, salary, skills, experience, isActive, postedBy
    })

    res.status(201).json({
        newUser
    })
}


export const getJobByid = async (req, res) => {
    const id = req.params.id

    const job = await Job.findById(id).populate("postedBy")

    res.json({
        job
    })
}


export const updateJobById = async (req, res) => {
    const id = req.params.id
    const {title, company, location, salary, skills, experience, isActive} = req.body
    
    const updatedUser = await Job.findByIdAndUpdate(id, {
        title, company, location, salary, skills, experience, isActive
    }, { new: true })

    res.json({
        updatedUser
    })
}


export const deleteJobById = async (req, res) => {
    const id = req.params.id
    const deletedUser = await Job.findByIdAndDelete(id)

    res.json({
        deletedUser
    })
}