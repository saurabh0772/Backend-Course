import { Application } from '../models/application.model.js'

export const createApplication = async (req, res) => {
    const id = req.params.id;
    const {student, job, status, appliedAt} = req.body

    const newApplication = await Application.create({
        student, job, status, appliedAt
    })

    res.status(201).json({
        newApplication
    })
}


export const getAllApplications = async (req, res) => {
    const applications = await Application.find().populate("student").populate("job")

    res.json({
        applications
    })
}

export const getApplicationById = async (req, res) => {
    const id = req.params.id
    const application = await Application.findById(id).populate("student").populate("job");

    res.json({
        application
    })
}

export const updateApplicationById = async (req, res) => {
    const id = req.params.id
    const {status, appliedAt} = req.body

    const updatedApplication = await Application.findByIdAndUpdate(id, {
        status, appliedAt
    }, {new : true})

    res.json({
        updatedApplication
    })
}