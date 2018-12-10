import { Db, InsertOneWriteOpResult, ObjectID } from "mongodb";
import {Document, DocumentQuery, Query} from 'mongoose';
declare namespace TodoModule {
  interface TodoItem {
    text: string
    isCompleted: boolean
    completedAt: number
  }

  interface TodoModel extends Document {
    text: string
    isCompleted: boolean
    completedAt: number
  }
}

declare namespace UserModule {
  interface User {
    name: string
    age: number
    location: string
  }
  interface UserModel extends Document {
    email: string,
    name: string,
    age: number,
    location: string
  }
}

declare namespace DatabaseModule {
  interface Operation<T> {
    addItem: (db: Db, item: T) => Promise<InsertOneWriteOpResult>;
    getItems: (db: Db, options: Partial<T> | string) => Promise<any[]>;
    deleteItems: (db: Db, options: Partial<T> | string, deleteOne: boolean) => Promise<any>;
    updateItem: (db: Db, filter: Partial<T> | string, update: Partial<T>) => Promise<any>;
  }

  interface MongooseOperation<T extends Document> {
    addItem: (item: T) => Promise<T>;
    lists: (options?: Partial<T>) => DocumentQuery<T[], T, {}>;
    findItem: (id: string) => DocumentQuery<T, T, {}>;
    deleteItem: (id: string) => DocumentQuery<T, T, {}>;
    updateItem: (id: string, update: Partial<T>) => DocumentQuery<T, T, {}>;
  }
}