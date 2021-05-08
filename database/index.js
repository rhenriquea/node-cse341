const { MongoClient } = require('mongodb');
const { MONGODB_USER, MONGODB_PASS, DB_NAME } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.pjqyl.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

exports.connectDb = (callback) => {
  MongoClient.connect(uri).then(client => {
    console.log('Database connected.');
    _db = client.db();
    callback();
  }).catch(err => {
    console.log(err);
  })
}

exports.getDb = () => {
  if(_db) return _db;
  throw 'No Database connection';
}