const jobs = []


export const getAllJobs = (req, res, next) => {

    const {location, minSalary, skills} = req.query
    let filteredJob = jobs

    if(location !== undefined){
        filteredJob = filteredJob.filter(ele => ele.location === location)
    }

    if(minSalary !== undefined){
        filteredJob = filteredJob.filter(ele => ele.salary >= Number(minSalary))
    }

    if(skills !== undefined){
        filteredJob = filteredJob.filter(ele => ele.skills.includes(skills))
    }
    
    if(jobs.length === 0){
        const error = new Error("No jobs")
        error.statusCode = 404
        return next(error)
    }

    if(filteredJob.length === 0){
        const error = new Error("No jobs found with the given querry")
        error.statusCode = 404
        return next(error)
    }

    res.json({
        filteredJob
    })
}


export const createNewJob = (req, res, next) => {
    const {id, title, company, location, salary, skills} = req.body;

    if(!title || !company || Number(salary) === 0 || !skills){
        const error = new Error("something is missing")
        error.statusCode = 400

        return next(error);
    }

    const newJob = {
        "id" : Number(id) || 100 * Math.random(), 
        "title" : title,
        "company" : company,
        "location" : location,
        "salary" : salary,
        "skills" : skills
    }

    jobs.push(newJob)

    res.status(201).json({
        "msg" : "New job created",
        newJob
    })
}


export const getJobById = (req, res, next) => {
    const id = Number(req.params.id)
    const job = jobs.find(ele => ele.id === id)
    if(!job){
        const error = new Error("Job with the particular id not found")
        error.statusCode = 404
        return next(error)
    }

    res.json({
        "msg" : "Job found",
        job
    })
}


export const updateJob = (req, res, next) => {
    const id = Number(req.params.id)
    const {title, company, location, salary, skills} = req.body

    if(!jobs.find(ele => ele.id === id)){
        const error = new Error("Job with the particular id not found")
        error.statusCode = 404
        return next(error)
    }


    jobs.forEach((ele) => {
        if(ele.id === id){
            if(title !== undefined) ele.title = title
            if(company !== undefined) ele.company = company
            if(location !== undefined) ele.location = location
            if(salary !== undefined) ele.salary = salary
            if(skills !== undefined) ele.skills = skills
        }
    })

    res.json({
        "msg" : "Job updated successfully",
        jobs
    })
}


export const deleteJobById = (req, res, next) => {
    const id = Number(req.params.id)

    const index = jobs.findIndex(ele => ele.id === id)

    const deleted = jobs.splice(index, 1)[0]

    res.json({
        "msg" : "Job deleted successfully",
        deleted
    })
}