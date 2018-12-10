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

  deleteItem(id: string) {
    return this.model.findByIdAndRemove(id);
  }

  updateItem(_id: string, update: Partial<T>) {
    return this.model.findOneAndUpdate({_id}, update, {new: true});
  }
}

export default MongooseOperation;