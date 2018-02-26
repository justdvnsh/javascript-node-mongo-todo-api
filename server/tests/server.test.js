const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// this funciton is called before each test , because we assume that the
// databse is empty before each test.
beforeEach((done) => {
  Todo.remove({}).then(() => done())
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
        Todo.find().then((result) => { // find() returns all the documents in the db.
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
          expect(result.length).toBe(0);
          done();
        }).catch((e) => done(e))
      })
  })
});
