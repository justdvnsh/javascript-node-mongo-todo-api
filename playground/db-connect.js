//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // line means same as above.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Databsase server.');
  }
  console.log('Connected to Database.');

  // a table in sql is a collection in nosql.
  // a record/ row in sql is a document in nosql.
  // a column in nosql is a field in nosql.

  db.collection('Users').insertOne({
    name: 'Divyansh',
    age: 17,
    location: 'Kanpur'
  }, (err, result) => {
    if (err) {
      console.log('Could not proceed the request.', err)
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  })


  db.close(); // to close the connection.
});
