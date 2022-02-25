const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();
// const mongodb = require(process.cwd()+"/js/db/mongodb")

const getConnectionString = function(){
  if(process.env.MONGO_URI){
    return process.env.MONGO_URI
  } else {
    let resultUri = "mongodb://";

    if(process.env.DB_USER && process.env.DB_PW){
      resultUri += process.env.DB_USER+":"+process.env.DB_PW
      resultUri = encodeURI(resultUri)+"@";
    }
    resultUri+=process.env.DB_ADR;

    if(process.env.DB_PORT){
      resultUri+=":"+process.env.DB_PORT;
    }
    return resultUri
  }
}

const connectionString = getConnectionString();

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        console.log("connectToServer Err")
        console.log(err);
        return callback(err);
      }

      dbConnection = db.db(process.env.DB_NAME);
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },
  getDb: function () {
    return dbConnection;
  },
  objectId: ObjectId
};