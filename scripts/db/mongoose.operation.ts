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

  lists(options: Partial<T> = {}) {
    return this.model.find(options);
  }

  findItem(id: string) {
    return this.model.findById(id);
  }
}

export default MongooseOperation;