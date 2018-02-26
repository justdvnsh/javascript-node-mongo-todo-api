//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // line means same as above.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Databsase server.');
  }
  console.log('Connected to Database.');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a93bddb5e2ab75221d00127')
  }, {
    $set: {
      name: 'Suraj'
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a93bddb5e2ab75221d00127')
  }, {
    $inc: {
      age: 1
    }
  }, {
    multi: false
  }).then((result) => {
    console.log(result)
  })

  db.close(); // to close the connection.
});
