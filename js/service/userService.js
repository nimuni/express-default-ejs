const mongodb = require(process.cwd()+"/js/db/mongodb")

exports.selectAll = async function(search){
  try {
    const db = mongodb.getDb();
    return await db.collection("user").find(search).toArray();
  } catch (err) {
    throw err;
  }
}

exports.selectPage = async function(search, pageNumber=1, pageSize=10){
  try {
    const db = mongodb.getDb();
    // return await db.collection("user").find(search).toArray();
    let totalPage = Math.floor(await db.collection("user").countDocuments() / pageSize) + 1;
    let startPage = (Math.floor(pageNumber/pageSize) * pageSize) + 1;
    let tempEndPage = Math.ceil(pageNumber/pageSize) * pageSize;
    let endPage = tempEndPage > totalPage ? totalPage : tempEndPage;
    let skip = (pageNumber-1) * pageSize;
    let result = {
      data: await db.collection("user").find(search).sort({insertDate: -1}).skip(skip).limit(pageSize).toArray(),
      startPage: startPage,
      endPage: endPage,
      curruntPage: pageNumber,
      totalPage: totalPage
    }
    console.log("call select Page")
    console.log(result)
    return result;
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