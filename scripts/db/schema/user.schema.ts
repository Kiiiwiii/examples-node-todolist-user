import mongoose, { Schema, Model } from 'mongoose';
import { UserModule, DatabaseModule } from 'type';
import validator from 'validator';
import jwt from '../../auth/auth';
import MongooseOperation from '../mongoose.operation';

const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // not strictly unique, can still add tow same value at the same time
    unique: true,

    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.generateToken = function() {
  const access = 'auth';
  const token = jwt.generateToken({_id: this._id.toHexString()});
  this.tokens = this.tokens.concat({
    access,
    token
  });
  return this.save().then(() => {
    return {
      token,
      email: this.email
    }
  });
}
const User = mongoose.model<UserModule.UserModel>('Users', userSchema, 'Users');

class UserOperation extends MongooseOperation<UserModule.UserModel> implements DatabaseModule.UserOperation<UserModule.UserModel> {
  constructor(model: Model<UserModule.UserModel>) {
    super(model);
  }

  // overwrite inherited method
  addItem(item: UserModule.UserModel) {
    const newItem = new this.model(item);
    return newItem.save().then(() => (newItem as any).generateToken());
  }
  login(email: string, password: string) {

  }
}

export {
  UserOperation as Operation,
  User
};