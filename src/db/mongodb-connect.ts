import mongoose from 'mongoose';
import Todo from '../schema/todo.schema';

mongoose.Promise = global.Promise;
const DATABASEURL = 'mongodb://localhost:27017/Exercise-TodoApp';
mongoose.connect(DATABASEURL, { useNewUrlParser: true });

const newTodo = new Todo();
newTodo.text = 'walk my dog';
newTodo.isCompleted = false;

newTodo.save().then(r => console.log(r));