const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

let  UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// UserSchema.methods alows us to make custom methods for the instance of the function
// constructor.

// UserSchema.statics allows us to make custom methods for the the funciton constructor object
// itself.

// method which specifies the data to be returned.
UserSchema.methods.toJSON = function() {
  let userObject = this.toObject();
   return _.pick(userObject, ['email', 'password'])
}

// to set custom methods for the instance of the object model.
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth'; // just a string.
  let token = jwt.sign({
              _id: user._id.toHexString(),
              access
             }, '123456').toString();

  user.tokens.push({access, token})
  // this is the user model we defined above.
  // we return the save method, so that we could chain other promise callbacks .
  return user.save().then(() => {
    return token;
  })
}

// custom method for the object model.
UserSchema.statics.findByToken = function(token) {
  let Users = this;
  let decoded;

  try {
    decoded = jwt.verify(token, '123456')
  } catch (e) {
    return Promise.reject()
    // does the exact thing as
    /*
    return new Promise((resolve, reject) => {
      reject();
  })
    */
  }

// here we return the authenticated user.
  // this returns a promise, so we can chain then calls to it.
  return Users.findOne({
    '_id': decoded._id,
    'tokens.token': token, // we query using '' when we need to access a child property.i.e. when we use the dot operator.
    'tokens.access': 'auth'
   })
}

// we set an event listener. This pre event listener, runs the code in the block,
// before every databse execution.
UserSchema.pre('save', function(next) { // to run the code before every save event.
  let user = this;
  if (user.isModified('password')) { // 'password 'is the user property.
    bcrypt.genSalt(10, (err, salt) => { // 10 is trhe number of rounds to intentionally make the program slow to prevent brute force.
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next();
  }
})

let Users = mongoose.model('Users', UserSchema);

module.exports = {
  Users
}
