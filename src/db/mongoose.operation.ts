import { Db, ObjectID } from "mongodb";
import { DatabaseModule } from "type";
import { Model, Document } from "mongoose";

class MongooseOperation<T extends Document> implements DatabaseModule.MongooseOperation<T> {
  private model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  addItem(item :T) {
    const newItem = new this.model(item);
    return newItem.save();
  }
}

export default MongooseOperation;