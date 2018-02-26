const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  text: 'First test todo'
}, {
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
