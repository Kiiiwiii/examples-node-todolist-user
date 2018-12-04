import express from 'express';
import Todo from '../db/schema/todo.schema';
import mongooseOperation from './db.mongoose-operation.router';

const router = express.Router();
router.use('/todos', mongooseOperation(Todo));
export default router;