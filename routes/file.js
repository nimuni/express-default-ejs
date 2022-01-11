const express = require('express');
const { ObjectId } = require('mongodb');
const path = require('path');
const router = express.Router();
const mongodb = require(process.cwd()+"/js/db/mongodb")
const multer = require(process.cwd()+"/js/multer/multer")

router.post('/upload', multer.getMulter().array('file'), (req, res, next) => {
  const db = mongodb.getDb();

  if(req.files) {
    //배열 형태이기 때문에 반복문을 통해 파일 정보를 알아낸다.
    let files = [];
    req.files.map((data, index) => {
      files.push({ file: data })
      // console.log("폼에 정의된 필드명 : ", data.fieldname);
      // console.log("사용자가 업로드한 파일 명 : ", data.originalname);
      // console.log("파일의 인코딩 타입 : ", data.encoding);
      // console.log("파일의 Mime 타입 : ", data.mimetype);
      // console.log("파일이 저장된 폴더 : ", data.destination);
      // console.log("destinatin에 저장된 파일 명 : ", data.filename);
      // console.log("업로드된 파일의 전체 경로 ", data.path);
      // console.log("파일의 바이트(byte 사이즈)", data.size);
    })
    db.collection("files").insertMany(files, 
      function(err, data) {
        if (err) throw err;

        let result = []
        req.files.map((file, index) => {
          let obj = {
            id: data.insertedIds[index], 
            filename: file.originalname
          }
          result.push(obj)
        })
        
        res.json({ok: true, data: "Multipart Single File Upload Ok", result:result })
        console.log(result)
      }
    )
  } else {
    res.status(500).send("500 Internal Server Error")
  }
})
router.get('/download/:id', function(req, res, next) {
  const db = mongodb.getDb();

  db.collection("files").findOne({_id:new ObjectId(req.params.id)}, function(err, items) {
    console.log(items)
    if(err) {
      res.status(500).send("500 Internal Server Error")
    } else if(!items){
      res.status(404).send("404 Not Found");
    } else {
      const ORDER = 0
      let filePath = path.join(process.cwd(), "files", items.file[ORDER].filename);
      let realName = items.file[ORDER].originalname;
  
      res.download(filePath, realName, function(err){
        if(err) console.log(err);
      })
    }
  })
});

module.exports = router;