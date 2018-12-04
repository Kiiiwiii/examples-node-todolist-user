import mongoose, { Schema } from 'mongoose';
import { TodoModule } from 'type';

const TodoSchema: Schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

const Todo = mongoose.model<TodoModule.TodoModel>('Todos', TodoSchema, 'Todos');
export default Todo;