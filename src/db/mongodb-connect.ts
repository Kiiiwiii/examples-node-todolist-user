import Mongo from 'mongodb';
import {TODO, USER} from './mongodb-operation';

const { MongoClient } = Mongo;
MongoClient.connect('mongodb://localhost:27017/Exercise-TodoApp', { useNewUrlParser: true })
  .then(client => {
    const db = client.db('Exercise-TodoApp');
    client.close();
  });
