const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos} = require('./seed/seed');

beforeEach(populateTodos)

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
        Todo.find({text: text}).then((todos) => { // find() returns all the documents in the db.
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
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

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
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
        expect(res.body.todos.length).toBe(2) // expect the todos from the server.
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
        expect(res.body.todos.text).toBe(todos[0].text)
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
        expect(res.body.todos._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId).then((todos) => {
          expect(todos).toNotExist();
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
        expect(res.body.todos.completed).toBe(true);
        expect(res.body.todos.completedAt).toBeA('number');
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
        expect(res.body.todos.completed).toBe(false);
        expect(res.body.todos.completedAt).toNotExist();
      })
      .end(done);
  })
})
