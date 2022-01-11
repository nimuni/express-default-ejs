const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const mongodb = require(process.cwd()+"/js/db/mongodb")
const path = require('path');
const multer = require(process.cwd()+"/js/multer/multer")

// another Router use
const fileRouter = require('./file.js');
router.use('/file', fileRouter);

// CRUD 기본. RESTapi 종류 하단 참고.
// POST	    POST를 통해 해당 URI를 요청하면 리소스를 생성합니다.
// GET	    GET를 통해 해당 리소스를 조회합니다. 리소스를 조회하고 해당 도큐먼트에 대한 자세한 정보를 가져온다.
// PUT	    PUT를 통해 해당 리소스를 수정합니다.
// DELETE   DELETE를 통해 리소스를 삭제합니다.
// req 요청 req 응답
// 응답 메소드는 send, sendFile, json, redirect 등이 있음

router.post('/', function(req, res, next) {
  const db = mongodb.getDb();

  console.log("post method")

  db.collection("test").insert(req.body, (err, data) => {
    if(err) { 
      console.log(err) 
      res.status(500)
    } else {
      console.log(data)
      res.status(201).send({_id: data.insertedIds[0]});
    }
  })
});

router.get('/', function(req, res, next) {
  const db = mongodb.getDb();

  console.log("get method")

  let query = {}
  let option = { projection: {}}
  db.collection("test").find(query, option).toArray((err, data) => {
    if(err) { 
      console.log(err) 
      res.status(500)
    } else {
      res.send(data)
    }
  })
  
});

router.get('/:id', async function(req, res, next) {
  const db = mongodb.getDb();

  let query = { _id: ObjectId(req.params.id) }
  let option = { projection: {}}
  db.collection("test").find(query, option).toArray((err, data) => {
    if(err) { 
      console.log(err) 
      res.status(500)
    } else {
      res.send(data)
    }
  })
  
});

router.put('/:id', function(req, res, next) {
  const db = mongodb.getDb();

  if (!req.body) { return res.status(400).send({ message: 'Data is empty' }); }

  let find = {_id: ObjectId(req.params.id)}
  let changeData = { $set: req.body};
  let option = { }

  db.collection("test").findOneAndUpdate(find, changeData, option, function(err, data) {
    if(err) { 
      console.log(err);
      res.status(500)
    } else if(!data.value){
      res.status(404).send()
    } else {
      console.log(data)
      res.status(204).send()
    }
    console.log(data)
  })
});

router.delete('/:id', function(req, res, next) {
  const db = mongodb.getDb();

  if (!req.body) { return res.status(400).send({ message: 'Data is empty' }); }

  let find = {_id: ObjectId(req.params.id)}

  db.collection("test").deleteOne(find, function(err, data) {
      if (err) {
        res.status(500)
      } else {
        res.status(204).send()
      }
  });
});

module.exports = router;
