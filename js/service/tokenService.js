const mongodb = require(process.cwd()+"/js/db/mongodb")

exports.selectAll = async function(option){
  try {
    const db = mongodb.getDb();
    return await db.collection("token").find(option).toArray();
  } catch (err) {
    throw err;
  }
}

exports.selectOne = async function(search) {
  try {
    const db = mongodb.getDb();
    return await db.collection("token").findOne(search);
  } catch (err) {
    throw err;
  }
}

exports.updateOne = async function(search, updateData) {
  try {
    const db = mongodb.getDb();
    return await db.collection("token").updateOne(search, {$set: updateData}, {upsert: true});
  } catch (err) {
    throw err;
  }
}

exports.deleteOne = async function(user) {
  try {
    const db = mongodb.getDb();
    return await db.collection("token").remove(user);
  } catch (err) {
    throw err;
  }
}