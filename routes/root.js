const express = require('express');
const router = express.Router();

/** 파일 업로드 설정 */
const multer  = require('multer')
//파일을 저장할 디렉토리 설정 (현재 위치에 files라는 폴더가 생성되고 하위에 파일이 생성된다.)
//multer 미들웨어 파일 제한 값 (Doc 공격으로부터 서버를 보호하는데 도움이 된다.)
const limits = {
  // fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
  // filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
  // fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
  // fileSize : 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
  // files : 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
}
const fileFilter = (req, file, callback) =>{
  // const typeArray = file.mimetype.split('/');

  // const fileType = typeArray[1]; // 확장자 추출
  
  // //확장자 구분 검사
  // if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png'){
  //     callback(null, true)
  // } else {
  //     return callback({message: "*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다."}, false)
  // }
  callback(null, true)
}
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "files/")
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);  // TODO 파일명 그대로쓰면 중복파일명이 덮어지므로 추후 변경 필요
  }
})
const upload = multer({ 
  dest: process.cwd()+'/files/', // 업로드 경로
  limits: limits,
  fileFilter: fileFilter,
  storage: storage
}) 
/** 파일 업로드 설정 끝 */

// CRUD 기본. RESTapi 종류 하단 참고.
// POST	    POST를 통해 해당 URI를 요청하면 리소스를 생성합니다.
// GET	    GET를 통해 해당 리소스를 조회합니다. 리소스를 조회하고 해당 도큐먼트에 대한 자세한 정보를 가져온다.
// PUT	    PUT를 통해 해당 리소스를 수정합니다.
// DELETE   DELETE를 통해 리소스를 삭제합니다.
// req 요청 req 응답
// 응답 메소드는 send, sendFile, json, redirect 등이 있음
router.post('/', function(req, res, next) {
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
router.post('/single/upload', upload.single('file'), (req, res, next) => {
  const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file //전송 시 파일을 file이라는 필드에 전송
  const { name } = req.body;

  console.log("body 데이터 : ", name);
  console.log("폼에 정의된 필드명 : ", fieldname);
  console.log("사용자가 업로드한 파일 명 : ", originalname);
  console.log("파일의 인코딩 타입 : ", encoding);
  console.log("파일의 Mime 타입 : ", mimetype);
  console.log("파일이 저장된 폴더 : ", destination);
  console.log("destinatin에 저장된 파일 명 : ", filename);
  console.log("업로드된 파일의 전체 경로 ", path);
  console.log("파일의 바이트(byte 사이즈)", size);

  res.json({ok: true, data: "Single Upload Ok"})
})
router.post('/multipart/upload', upload.array('file'), (req, res, next) => {
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

  res.json({ok: true, data: "Multipart Upload Ok"})
})

module.exports = router;
