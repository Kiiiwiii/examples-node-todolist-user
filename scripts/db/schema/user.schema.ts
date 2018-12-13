import mongoose, { Document, Schema } from 'mongoose';
import { UserModule } from 'type';
import validator from 'validator';

const UserSchema: Schema = new mongoose.Schema({
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

const User = mongoose.model<UserModule.UserModel>('Users', UserSchema, 'Users');
export default User;