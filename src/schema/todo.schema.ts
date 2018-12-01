import mongoose, { Document, Schema } from 'mongoose';

export interface TodoModel extends Document {
  text: string
  isCompleted: boolean
  completedAt: number
}

const TodoSchema: Schema = new mongoose.Schema({
  text: String,
  isCompleted: Boolean,
  completedAt: Number
});

const Todo = mongoose.model<TodoModel>('Todos', TodoSchema, 'Todos');
export default Todo;