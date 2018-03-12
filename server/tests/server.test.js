const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/users');
const {todos, populateTodos,users, populateUsers} = require('./seed/seed');

// this funciton is called before each test , because we assume that the
// databse is empty before each test.
//beforeEach((done) => {
  //Todo.remove({}).then(() => done())
//});

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test ....!'
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => { // now we test that, response is equal to the text set.
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        // here we check the databse, that it is performing as we expected or not.
        Todo.find({text: text}).then((result) => { // find() returns all the documents in the db.
          expect(result.length).toBe(1)
          expect(result[0].text).toBe(text)
          done();
        }).catch((e) => done(e))
      })
  })

  it('should not create a new todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find().then((result) => {
          expect(result.length).toBe(2);
          done();
        }).catch((e) => done(e))
      })
  })
});

describe('GET /todos', () => {
  it('should get all the todos in the db', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.result.length).toBe(2) // expect the result from the server.
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should get the todo with the given id in the db', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // to convert the id to a string to pass it in the url
      .expect(200)
      .expect((res) => {
        expect(res.body.result.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 if todos not found.', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-valid object id', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete the document of the given id', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.result._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId).then((result) => {
          expect(result).toNotExist();
          done();
        }).catch(e => done(e))
      })
  })

  it('should return 404 if todos not found.', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(400)
      .end(done)
  })

  it('should return 404 for non-valid object id', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(400)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.result.completed).toBe(true);
        expect(res.body.result.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should update the todo if completed is true', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.result.completed).toBe(false);
        expect(res.body.result.completedAt).toNotExist();
      })
      .end(done);
  })
})

describe('GET /users/me', () => {
  it('should get the user if authenticated.', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token) // to set the header
      .expect(200)
      .expect((res) => {
        //expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 if the user is not authenticated.', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
    it('should save a user', (done) => {
      let email = 'andrew@abc.com'
      let password = '123abc'

      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist()
          expect(res.body.email).toBe(email)
          //expect(res.body._id).toExist();
        })
        .end((err) => {
          if(err) {
            return done(err)
          }
          Users.findOne({email}).then((result) => {
            expect(result.password).toNotBe(password)
            expect(result).toExist()
            done();
          }).catch((e) => done(e))
        })
    })

    it('should return validation error if request invalid', (done) => {
      let email = 'asdasd'
      let password = '123456'

      request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done)
    })

    it('should not create user if email in use.', (done) => {
      let email = 'justdvnsh@example.com'
      let password = '123abc'

      request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done)
    })
})

describe('POST /users/login', () => {
  it('should loginuser and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return err
        }

        Users.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          })
          done();
        }).catch((e) => done(e))
      })
  })

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: '12365489465'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return err
        }

        Users.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toEqual(0)
          done()
        }).catch((e) => done(e))
      })
  })
})
