const mongodb = require(process.cwd()+"/js/db/mongodb")

exports.selectAll = async function(option){
  try {
    const db = mongodb.getDb();
    return await db.collection("user").find(option).toArray();
  } catch (err) {
    throw err;
  }
}

exports.selectOne = async function(user) {
  try {
    const db = mongodb.getDb();
    return await db.collection("user").findOne(user);
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