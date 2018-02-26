let mongoose = require('mongoose');

let Users = mongoose.model('Users', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports = {
  Users
}
