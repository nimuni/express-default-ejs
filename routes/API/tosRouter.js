const express = require('express');
const router = express.Router();
const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
require('dotenv').config();

router.get('/', async function(req, res, next) {
  const db = mongodb.getDb();
  try {
    let data = await db.collection("tos").find().toArray();
    res.send(data);
  } catch (err) {
    res.status(400).json({err: err})
  }
})

router.get('/:id', async function(req, res, next) {
  const db = mongodb.getDb();
  
  try {
    let data = await db.collection("tos").findOne({ '_id': mongodb.objectId(req.params.id)});
    res.send(data);
  } catch (err) {
    res.status(400).json({err: err})
  }
})

router.post('/', async function(req, res, next) {
  const db = mongodb.getDb();

  let data = {
    date: util.fn_get_date(),
    required: req.body.required,
    content: req.body.content,
    title: req.body.title,
    isUse: true,
    type: req.body.type
  }
  try {
    let result = await db.collection("tos").insertOne(data);
    res.status(201).send({result: result});
  } catch (err) {
    res.status(400).json({err: err})
  }
})

router.put('/:id', async function(req, res, next) {
  const db = mongodb.getDb();
  let tempData = {
    date: util.fn_get_date()
  }
  if(req.body.required) tempData.required = req.body.required;
  if(req.body.content) tempData.content = req.body.content;
  if(req.body.title) tempData.title = req.body.title;
  if(req.body.isUse) tempData.isUse = req.body.isUse;
  if(req.body.type) tempData.type = req.body.type;

  console.log("tempdata=")
  console.log(tempData)

  try {
    let search = { '_id': mongodb.objectId(req.params.id) };
    let updateData = { $set: tempData };
    let result = await db.collection("tos").updateOne(search, updateData);
    res.status(201).send({result: result});
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

router.delete('/:id', async function(req, res, next) {
  const db = mongodb.getDb();

  try {
    let result = await db.collection("tos").remove({'_id':mongodb.objectId(req.params.id)})
    res.status(200).send({result: result})
  } catch (err) {
    res.status(400).json({err: err})
  }
})

module.exports = router;