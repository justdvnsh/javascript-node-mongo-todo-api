const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');


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
    required: true,
    minlength: 6,
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
  }
})

// to set custom methods.
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

let Users = mongoose.model('Users', UserSchema);

module.exports = {
  Users
}
