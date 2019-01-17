import express from 'express';
import todoRouter from './todo.router';
import userRouter from './user.router';
import auth from '../middleware/auth';

const router = express.Router();
router.use('/todos', auth.authenticateUser, todoRouter);
router.use('/user', userRouter);

export default router;
