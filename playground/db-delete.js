//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // line means same as above.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Databsase server.');
  }
  console.log('Connected to Database.');

  // deleteMany // to delete many documents.
  //db.collection('Users').deleteMany({name: 'Andrew'}).then((result) => {
    //console.log(result)
  //})

  // deleteOne // to delete one documents.
  //db.collection('Users').deleteOne({name: 'Andrew'}).then((result) => {
    //console.log(result)
  //})

  // findOneAndDelete // to find one and delete a documents.
  //db.collection('Users').findOneAndDelete({name: 'Andrew'}).then((result) => {
    //console.log(result)
  //})

  // findOneAndDelete is useful when we want something like an undo feature.
  // because it returns the deleted value.
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5a93bdcf5e2ab75221d00123')})
  .then((result) => {
    console.log(result)
  })


  db.close(); // to close the connection.
});
