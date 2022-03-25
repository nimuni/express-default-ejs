const mongodb = require(process.cwd()+"/js/db/mongodb")

exports.selectAll = async function(search){
  try {
    const db = mongodb.getDb();
    return await db.collection("user").find(search).toArray();
  } catch (err) {
    throw err;
  }
}

exports.selectOne = async function(search) {
  try {
    const db = mongodb.getDb();
    return await db.collection("user").findOne(search);
  } catch (err) {
    throw err;
  }
}

exports.insertOne = async function(user) {
  try {
    const db = mongodb.getDb();
    return await db.collection("user").insertOne(user);
  } catch (err) {
    throw err;
  }
}

exports.updateOne = async function(search, updateData) {
  try {
    const db = mongodb.getDb();
    return await db.collection("user").updateOne(search, updateData);
  } catch (err) {
    throw err;
  }
}

exports.deleteOne = async function(user) {
  try {
    const db = mongodb.getDb();
    return await db.collection("user").remove(user);
  } catch (err) {
    throw err;
  }
}