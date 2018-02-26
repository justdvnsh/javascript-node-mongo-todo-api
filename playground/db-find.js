//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // line means same as above.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Databsase server.');
  }
  console.log('Connected to Database.');

  db.collection('Users').find({name: 'Divyansh'}).toArray().then((docs) => {
    console.log(`results are`, docs);
  }, (err) => {
    console.log('Error', err)
  })

  db.close(); // to close the connection.
});
