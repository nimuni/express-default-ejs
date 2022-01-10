const express = require('express');
const { ObjectId } = require('mongodb');
const path = require('path');
const router = express.Router();
const mongodb = require(process.cwd()+"/bin/db/mongodb")
const multer = require(process.cwd()+"/bin/multer/multer")

// CRUD 기본. RESTapi 종류 하단 참고.
// POST	    POST를 통해 해당 URI를 요청하면 리소스를 생성합니다.
// GET	    GET를 통해 해당 리소스를 조회합니다. 리소스를 조회하고 해당 도큐먼트에 대한 자세한 정보를 가져온다.
// PUT	    PUT를 통해 해당 리소스를 수정합니다.
// DELETE   DELETE를 통해 리소스를 삭제합니다.
// req 요청 req 응답
// 응답 메소드는 send, sendFile, json, redirect 등이 있음
router.post('/', function(req, res, next) {
  const db = mongodb.getDb();
  db.collection("test").insert(
    {
      name: "abc",
      pass: "sdfdsf"
    }
  )
  res.send('respond post with a resource');
});
router.get('/', function(req, res, next) {
  res.send('respond get with a resource');
});
router.put('/', function(req, res, next) {
  res.send('respond put with a resource');
});
router.delete('/', function(req, res, next) {
  res.send('respond delete with a resource');
});
router.post('/single/upload', multer.getMulter().single('file'), (req, res, next) => {
  const db = mongodb.getDb();

  console.log("body 데이터 : ", req.body.name);
  console.log("폼에 정의된 필드명 : ", req.file.fieldname);
  console.log("사용자가 업로드한 파일 명 : ", req.file.originalname);
  console.log("파일의 인코딩 타입 : ", req.file.encoding);
  console.log("파일의 Mime 타입 : ", req.file.mimetype);
  console.log("파일이 저장된 폴더 : ", req.file.destination);
  console.log("destinatin에 저장된 파일 명 : ", req.file.filename);
  console.log("업로드된 파일의 전체 경로 ", req.file.path);
  console.log("파일의 바이트(byte 사이즈)", req.file.size);

  db.collection("files").insertOne(
    { file: [req.file]}, 
    function(err, result) {
      if (err) throw err;
      
      res.json({ok: true, data: "Multipart Single File Upload Ok", fileId:result.insertedId})
    }
  )
})
router.get('/single/download/:id/:order', function(req, res, next) {
  const db = mongodb.getDb();

  db.collection("files").findOne({_id:new ObjectId(req.params.id)}, function(err, items) {
    let fileLength = items.file.length;
    let order = req.params.order ? req.params.order : 0
    if(fileLength <= order) res.status(404).send("404 File not found");

    let filePath = path.join(process.cwd(), "files", items.file[order].filename);
    let realName = items.file[order].originalname;

    res.download(filePath, realName, function(err){
      if(err) console.log(err);
    })
  })
});
router.post('/multipart/upload', multer.getMulter().array('file'), (req, res, next) => {
  const db = mongodb.getDb();
  console.log(req.files);

  const { name } = req.body;
  console.log("body 데이터 : ", name);

  //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
  req.files.map(data => {
    console.log("폼에 정의된 필드명 : ", data.fieldname);
    console.log("사용자가 업로드한 파일 명 : ", data.originalname);
    console.log("파일의 인코딩 타입 : ", data.encoding);
    console.log("파일의 Mime 타입 : ", data.mimetype);
    console.log("파일이 저장된 폴더 : ", data.destination);
    console.log("destinatin에 저장된 파일 명 : ", data.filename);
    console.log("업로드된 파일의 전체 경로 ", data.path);
    console.log("파일의 바이트(byte 사이즈)", data.size);
  })

  db.collection("files").insertOne(
    { file: req.files },
    function(err, result) {
      if (err) throw err;
      
      res.json({ok: true, data: "Multipart Multiple File Upload Ok", fileId:result.insertedId})
    }
  )
})

module.exports = router;
