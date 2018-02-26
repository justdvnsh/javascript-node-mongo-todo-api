const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {Users} = require('./models/users');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });
  todo.save().then((result) => {
    res.send(result);
  }, (e) => {
    res.status(400).send(e);
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((result) => {
    res.status(200).send({result})
  }, (e) => {
    res.status(400).send(e)
  })
})

// using the url parameter.
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)){ // to check if the id is valid
    return res.status(404).send('ID not valid.')
  }
  Todo.findById(id).then((todo) => {
    if (!todo){
      return res.status(404).send()
    }
    res.status(200).send({todo})
  }).catch((e)  => {
    res.status(404).send(e)
  })
})

app.listen(3000, () => {
  console.log('App started at port 3000')
});

module.exports = {
  app
}
