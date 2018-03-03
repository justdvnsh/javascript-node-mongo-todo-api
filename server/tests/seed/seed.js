const {Todo} = require('./../../models/todo');
const {Users} = require('./../../models/users');
const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 33333333
}]

// this funciton is called before each test , because we assume that the
// databse is empty before each test.
//beforeEach((done) => {
  //Todo.remove({}).then(() => done())
//});

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); // we insert some dummy tests to the databse
  }).then(() => done())
};

module.exports = {todos, populateTodos}
