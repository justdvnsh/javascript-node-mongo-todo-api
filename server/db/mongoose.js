let mongoose = require('mongoose');

// to tell the library we want to use the built in promise feature.
mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost:27017/TodoApp')
// mongodb automatically creates a database if not present.

module.exports = {
  mongoose
}
