import { Router } from "express";
import { createApplication, getAllApplications, getApplicationById, updateApplicationById } from "../controllers/application.controller.js";

export const applicationRouter = Router();

applicationRouter.post('/', createApplication);
applicationRouter.get('/', getAllApplications);
applicationRouter.get('/:id', getApplicationById);
applicationRouter.patch('/:id', updateApplicationById);