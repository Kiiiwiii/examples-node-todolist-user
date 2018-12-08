import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const DATABASEURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/Exercise-TodoApp';
mongoose.connect(DATABASEURL, { useNewUrlParser: true });

