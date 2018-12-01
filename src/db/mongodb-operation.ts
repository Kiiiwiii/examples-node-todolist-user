import { Db, ObjectID } from "mongodb";
import { DatabaseModule, TodoModule, UserModule } from "type";

class Operation<T> implements DatabaseModule.Operation<T> {
  private collectionName = '';
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }
  public addItem = (db: Db, item: T) => {
    return db.collection<T>(this.collectionName).insertOne(item);
  }

  public getItems = (db: Db, options: Partial<T> | string) => {
    // return all records
    if (!options) {
      return db.collection(this.collectionName).find().toArray();
    }
    // get item by id
    if (typeof options === 'string') {
      return db.collection(this.collectionName).find({ _id: new ObjectID(options) }).toArray();
    }
    // get item by non-primary keys
    return db.collection<T>(this.collectionName).find(options).toArray();
  }

  public deleteItems = (db: Db, options: Partial<T> | string, deleteOne = false) => {
    const deleteOptions = typeof options === 'string' ? new ObjectID(options) : options;
    if (deleteOne) {
      return db.collection(this.collectionName).findOneAndDelete(deleteOptions);
    }
    return db.collection(this.collectionName).deleteMany(deleteOptions);
  }

  public updateItem = (db: Db, filter: Partial<T> | string, update: Partial<T>) => {
    const properFilters = typeof filter === 'string' ? new ObjectID(filter) : filter;
    return db.collection<Partial<T> | ObjectID>(this.collectionName).findOneAndUpdate(properFilters, {
      $set: update
    }, {
      returnOriginal: false
    })
  }
}

class Todo extends Operation<TodoModule.TodoItem>{
  constructor() {
    super('Todos');
  }
}
class User extends Operation<UserModule.User>{
  constructor() {
    super('Users');
  }
}


export const USER = new User();
export const TODO = new Todo();
