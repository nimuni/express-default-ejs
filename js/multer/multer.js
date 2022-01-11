const path = require("path")
const fs = require("fs")
require('dotenv').config();

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
    callback(null, "files")
  }
})
const upload = multer({ 
  dest: process.cwd()+'/files/', // 업로드 경로
  limits: limits,
  fileFilter: fileFilter,
  storage: storage
}) 
/** 파일 업로드 설정 끝 */

module.exports = {
  init: function (callback) {
    // folder 생성
    const folderPath = path.join(process.cwd().toString(), "files");
    console.log(`folderPath:${folderPath}`)
    fs.mkdirSync(folderPath, { recursive: true });

    return callback();
  },

  getMulter: function () {
    return upload;
  },
};