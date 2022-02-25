const mongodb = require(process.cwd()+"/js/db/mongodb")

exports.selectAll = async function(type){
  try {
    const db = mongodb.getDb();
    if(type == "required"){
      return await db.collection("tos").find({required: true, isUse: true}).toArray();
    } else if(type == "selection") {
      return await db.collection("tos").find({required: false, isUse: true}).toArray();
    } else {
      return await db.collection("tos").find().toArray();
    }
  } catch (err) {
    throw err;
  }
}

exports.selectOne = async function(tos) {
  try {
    const db = mongodb.getDb();
    return await db.collection("tos").findOne(tos);
  } catch (err) {
    throw err;
  }
}

exports.insertOne = async function(tos) {
  try {
    const db = mongodb.getDb();
    return await db.collection("tos").insertOne(tos);
  } catch (err) {
    throw err;
  }
}

exports.updateOne = async function(search, updateData) {
  try {
    const db = mongodb.getDb();
    return await db.collection("tos").updateOne(search, updateData);
  } catch (err) {
    throw err;
  }
}

exports.deleteOne = async function(tos) {
  try {
    const db = mongodb.getDb();
    return await db.collection("tos").remove(tos);
  } catch (err) {
    throw err;
  }
}