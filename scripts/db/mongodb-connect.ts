import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const DATABASEURL = 'mongodb://localhost:27017/Exercise-TodoApp';
mongoose.connect(DATABASEURL, { useNewUrlParser: true });

