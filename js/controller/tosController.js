const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
const tosService = require(process.cwd()+ '/js/service/tosService')

exports.selectAll = async function(req, res, next) {
  try {
    res.send(await tosService.selectAll());
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.selectRequiredAll = async function(req, res, next) {
  try {
    res.send(await tosService.selectAll("required"));
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.selectSelectionAll = async function(req, res, next) {
  try {
    res.send(await tosService.selectAll("selection"));
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.selectOne = async function(req, res, next) {
  try {
    let tosSearch = { '_id': mongodb.objectId(req.params.id)} 

    res.send(await tosService.selectOne(tosSearch));
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.insertOne = async function(req, res, next) {
  try {
    let tos = {
      date: util.fn_get_date(),
      required: req.body.required,
      content: req.body.content,
      title: req.body.title,
      isUse: true,
      type: req.body.type
    }

    res.status(201).send(await tosService.insertOne(tos));
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.updateOne = async function(req, res, next) {
  try {
    let tempData = {
      date: util.fn_get_date()
    }
    if(req.body.required) tempData.required = req.body.required;
    if(req.body.content) tempData.content = req.body.content;
    if(req.body.title) tempData.title = req.body.title;
    if(req.body.isUse) tempData.isUse = req.body.isUse;
    if(req.body.type) tempData.type = req.body.type;
    let search = { '_id': mongodb.objectId(req.params.id) };
    let updateData = { $set: tempData };

    res.status(201).send(await tosService.updateOne(search, updateData));
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}
exports.deleteOne = async function(req, res, next) {
  try {
    let tos = {'_id':mongodb.objectId(req.params.id)}
    res.status(200).send(await tosService.deleteOne(tos))
  } catch (err) {
    res.status(400).json({err: err})
  }
}