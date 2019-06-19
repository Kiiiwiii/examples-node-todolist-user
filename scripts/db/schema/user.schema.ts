import mongoose, { Schema, Model } from 'mongoose';
import { UserModule, DatabaseModule } from 'type';
import validator from 'validator';
import auth from '../../auth/auth';
import MongooseOperation from '../mongoose.operation';

const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // not strictly unique, can still add two same value at the same time
    unique: true,

    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// 1. TAKE AWAY - instance method， all document instance on this schema can use this method
userSchema.methods.generateAuthToken = function() {
  const access = 'auth';
  const user = this;
  const token = auth.generateToken({_id: user._id.toHexString()});

  // 这里用数据库额外管理了 token，实现了最多一个 token valid的踢人效果
  // if the token exists, update the token
  if (user.tokens.find((t: any) => t.access === 'auth')) {
    // * TAKE AWAY, muss pass a new reference here!
    user.tokens = user.tokens.map((t: any) => {
      return t.access === 'auth' ? {
        access,
        token,
      } : t;
    });
  } else {
    // add authToken to tokens array
    user.tokens = user.tokens.concat({
      access,
      token,
    });
  }
  return user.save().then(() => {
    return {
      token,
    };
  });
};

// 2. TAKE AWAY - Static method, method of the current model
userSchema.statics.findByToken = function(token: string) {
  return auth.verifyToken(token)
    .catch((_err: any) => {
      return Promise.reject({ error: 'token invalid'});
    }).then(id => {
    // 3. TAKE AWAY - Select relevant field only
    return this.findById(id, '_id email');
  });
};

// 4. TAKE AWAY - Mongoose built-in middleware function
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    // hash the password
    auth.hashPassword((this as any).password).then((hashedPassword: string) => {
      (this as any).password = hashedPassword;
      next();
    });
    // 不能使用 return; 否则 model instance 不会被更改
  } else {
    next();
  }
});

const User = mongoose.model<UserModule.UserModel>('Users', userSchema, 'Users');

class UserOperation extends MongooseOperation<UserModule.UserModel>
  implements DatabaseModule.UserOperation<UserModule.UserModel> {
  constructor(model: Model<UserModule.UserModel>) {
    super(model);
  }

  // overwrite inherited method
  addItem(item: UserModule.UserModel) {
    const user = this.model;
    const newItem = new user(item);
    return user.init().then(function() {
      // * TAKE AWAY wait until the index is built - atomic operation
      // https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
      return user.create(newItem);
    }).then(() => (newItem as any).generateAuthToken()).catch((err) => Promise.reject({error: err}));
  }
  login(email: string, password: string) {
    let u: UserModule.UserModel;
    return this.model.findOne({ email }, 'password tokens')
      .catch(() => Promise.reject({ error: 'user not found' }))
      .then((user: UserModule.UserModel) => {
        u = user;
        return auth.comparePassword(password, user.password);
      })
      .then(result =>
        // * TAKE AWAY, u here is a part of one user document, which can call instance method that we defined earlier
        result ? (u as any).generateAuthToken() : Promise.reject({error: 'password is not correct'}));
  }
}

export {
  UserOperation as Operation,
  User,
};
