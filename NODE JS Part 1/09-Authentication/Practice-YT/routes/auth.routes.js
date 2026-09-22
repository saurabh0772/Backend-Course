import express from 'express'
import * as authController from '../controllers/auth.controller.js'

const authRouter = express.Router();

authRouter.post('/register', authController.registerUser);
authRouter.get('/get-me', authController.getMe)
authRouter.get('/refresh', authController.refresh)

export default authRouter;