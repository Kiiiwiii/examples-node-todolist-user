import mongoose, { Schema, Model } from 'mongoose';
import { UserModule, DatabaseModule } from 'type';
import validator from 'validator';
import auth from '../../auth/auth';
import MongooseOperation from '../mongoose.operation';

const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // TODO: more strict unique check
    // not strictly unique, can still add two same value at the same time
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


// 1. TAKE AWAY - instance method
userSchema.methods.generateToken = function() {
  const access = 'auth';
  const token = auth.generateToken({_id: this._id.toHexString()});
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

// 2. TAKE AWAY - Static method, method of the current model
userSchema.statics.findByToken = function(token: string) {
  return auth.verifyToken(token)
    .catch((_err: any) => {
      return Promise.reject({ error: 'token invalid'});
    }).then(id => {
    // 3. TAKE AWAY - Select relevant field only
    return this.findById(id, '_id email');
  });
}

// 4. TAKE AWAY - Mongoose built-in middleware function
userSchema.pre('save', function(next) {
  console.log(this);
  if(this.isModified('password')) {
    // hash the password
    auth.hashPassword((this as any).password).then((hashedPassword: string) => {
      (this as any).password = hashedPassword;
      next();
    })
  } else {
    next()
  }
})

const User = mongoose.model<UserModule.UserModel>('Users', userSchema, 'Users');

class UserOperation extends MongooseOperation<UserModule.UserModel> implements DatabaseModule.UserOperation<UserModule.UserModel> {
  constructor(model: Model<UserModule.UserModel>) {
    super(model);
  }

  // overwrite inherited method
  addItem(item: UserModule.UserModel) {
    const user = this.model;
    const newItem = new user(item);

    return newItem.save().then(() => (newItem as any).generateToken()).catch((err) => Promise.reject({ error: err }))


    // return user.init().then(function () {
    //   // * TAKE AWAY wait until the index is built
    //   // https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
    //   return user.create(newItem);
    // }).then(() => (newItem as any).generateToken()).catch((err) => Promise.reject({error: err}))
  }
  login(email: string, password: string) {
    let u: UserModule.UserModel;
    return this.model.findOne({ email }, 'password tokens')
      .then((user) => {
        u = user;
        return auth.comparePassword(password, user.password);
      })
      .catch(() =>  Promise.reject({ error: 'user not found' }))
      .then(result => result ? Promise.resolve(u.tokens.find(t => t.access === 'auth').token) : Promise.reject({error: 'password is not correct'}))

  }
}

export {
  UserOperation as Operation,
  User
};