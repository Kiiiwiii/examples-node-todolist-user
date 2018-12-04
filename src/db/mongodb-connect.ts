import mongoose from 'mongoose';
import Todo from './schema/todo.schema';
import User from './schema/user.schema';

mongoose.Promise = global.Promise;
const DATABASEURL = 'mongodb://localhost:27017/Exercise-TodoApp';
mongoose.connect(DATABASEURL, { useNewUrlParser: true });

