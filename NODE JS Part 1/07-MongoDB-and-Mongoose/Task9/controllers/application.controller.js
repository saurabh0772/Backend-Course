import { Application } from "../models/application.model.js"

export const getApplications = async (req, res) => {
    const applications = await Application.find()
        .populate("student", "name email -_id")
        .populate("job", "title company -_id");

    res.json({
        applications
    })
}