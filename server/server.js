require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {Users} = require('./models/users');
let {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT;

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
  Todo.findById(id).then((result) => {
    if (!result){
      return res.status(404).send()
    }
    res.status(200).send({result})
  }).catch((e)  => {
    res.status(404).send(e)
  })
})

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(400).send('Id not valid')
  }
  Todo.findByIdAndRemove(id).then((result) => {
    if (!result) {
      return res.status(400).send('ID not in the database')
    }
    res.status(200).send({result})
  }).catch((e) => {
    return res.status(400).send(e)
  })
})

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  // to pick only the particular we want users to update.
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('ObjectID not valid')
  }
  // check if the completed property is a boolean. and set to true.
  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    // set the completed property to false and remove the completedAt property
    body.completed = false
    body.completedAt = null
  }
  // we specify the item we want to set and if we want the updated document back
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((result) => {
    if (!result) {
      return res.status(400).send('ID not in the database')
    }
    res.status(200).send({result})
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new Users(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate,(req, res) => {
  res.status(200).send(req.user)
})

app.post('/users/login', (req,res) => {
  let body = _.pick(req.body, ['email', 'password'])

  Users.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.delete('/users/me/token', authenticate ,(req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.listen(port, () => {
  console.log('App started at port ', port)
});

module.exports = {
  app
}
