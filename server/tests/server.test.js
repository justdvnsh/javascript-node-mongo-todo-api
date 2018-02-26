const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}]
// this funciton is called before each test , because we assume that the
// databse is empty before each test.
//beforeEach((done) => {
  //Todo.remove({}).then(() => done())
//});

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); // we insert some dummy tests to the databse
  }).then(() => done())
});


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
