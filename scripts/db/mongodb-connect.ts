import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const DATABASEURL = process.env.MONGODB_URI;
mongoose.connect(DATABASEURL, { useNewUrlParser: true });
