import { Router } from 'express'
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/', createUser)
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.patch('/:id', updateUserById);
userRouter.delete('/:id', deleteUserById);

export { userRouter }
