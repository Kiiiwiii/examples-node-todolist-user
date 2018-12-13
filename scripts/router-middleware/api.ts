import express from 'express';
import todoRouter from './todo.router';
import userRouter from './user.router';

const router = express.Router();
router.use('/todos', todoRouter);
router.use('/user', userRouter);

export default router;
