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

  public deleteItems = (db: Db, options: Partial<T>, deleteOne = false) => {
    const deleteOptions = typeof options === 'string' ? new ObjectID(options) : options;
    if (deleteOne) {
      return db.collection(this.collectionName).findOneAndDelete(deleteOptions);
    }
    return db.collection(this.collectionName).deleteMany(deleteOptions);
  }
}

class Todo {
  private COLLECTIONNAME = 'Todos';
  operation: DatabaseModule.Operation<TodoModule.TodoItem>;
  constructor(){
    this.operation = new Operation(this.COLLECTIONNAME);
  }
  public addItem(db: Db, item: TodoModule.TodoItem) {
    return this.operation.addItem(db, item);
  }
  public getItems(db: Db, options?: Partial<TodoModule.TodoItem> | string) {
    return this.operation.getItems(db, options);
  }

  public deleteItems(db: Db, options: Partial<TodoModule.TodoItem>, deleteOne = false) {
    return this.operation.deleteItems(db, options, deleteOne);
  }
}


class User {
  private COLLECTIONNAME = 'Users';
  operation: DatabaseModule.Operation<UserModule.User>;
  constructor() {
    this.operation = new Operation(this.COLLECTIONNAME);
  }
  public addItem(db: Db, item: UserModule.User) {
    return this.operation.addItem(db, item);
  }
  public getItems(db: Db, options?: Partial<UserModule.User> | string) {
    return this.operation.getItems(db, options);
  }

  public deleteItems(db: Db, options: Partial<UserModule.User>, deleteOne = false) {
    return this.operation.deleteItems(db, options, deleteOne);
  }
}


export const USER = new User();
export const TODO = new Todo();
