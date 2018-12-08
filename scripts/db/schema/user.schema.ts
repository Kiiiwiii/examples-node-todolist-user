import mongoose, { Document, Schema } from 'mongoose';
import { UserModule } from 'type';


const UserSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  age: {
    type: Number
  },
  location: {
    type: String
  }
});

const User = mongoose.model<UserModule.UserModel>('Users', UserSchema, 'Users');
export default User;