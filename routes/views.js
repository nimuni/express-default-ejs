const express = require('express');
const router = express.Router();

// 페이지 렌더링. 이 경우에는 페이지를 리턴한다.
// res.render(페이지 원본 위치, { 변수명: 변수값 });
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
