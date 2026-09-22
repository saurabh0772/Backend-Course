import express from 'express'
import { Router } from 'express'
import { userRegisteration } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', userRegisteration);