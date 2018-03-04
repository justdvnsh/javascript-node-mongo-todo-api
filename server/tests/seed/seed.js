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

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'justdvnsh@example.com',
  password: '123abc',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, '123456').toString()
  }]
},
{
  _id: userTwoId,
  email: 'jea@example.com',
  password: '123bca'
}]
// this funciton is called before each test , because we assume that the
// databse is empty before each test.
//beforeEach((done) => {
  //Todo.remove({}).then(() => done())
//});
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  Users.remove({}).then(() => {
    let userOne = new Users(users[0]).save();
    let userTwo = new Users(users[1]).save();

    return Promise.all(['userOne', 'userTwo']) // this does not gets fired until all the promises resolve.
  }).then(() => done())
}
module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
