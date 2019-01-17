import mongoose, { Schema, Model } from 'mongoose';
import { TodoModule, DatabaseModule } from 'type';
import MongooseOperation from '../mongoose.operation';

const TodoSchema: Schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Todo = mongoose.model<TodoModule.TodoModel>('Todos', TodoSchema, 'Todos');

class TodoOperation extends MongooseOperation<TodoModule.TodoModel> {
  constructor(model: Model<TodoModule.TodoModel>) {
    super(model);
  }
}

export {
  Todo,
  TodoOperation as Operation,
};
