const express = require('express');
const router = express.Router();
require('dotenv').config();

// 페이지 렌더링. 이 경우에는 페이지를 리턴한다.
// res.render(페이지 원본 위치, { 변수명: 변수값 });
router.get('/', (req, res, next) => {
  res.render('index', { title: process.env.TITLE, user: req.user });
});

router.get("/file", (req, res, next) => {
  res.render('./file/upload', { title: process.env.TITLE });
});

router.get("/login", (req, res) => {
  // 로그인이 되어있으면
  if (req.user) {
    res.redirect("/");
    return;
  }
  // 로그인이 되어있지 않으면
  res.render("./page/login", {title: process.env.TITLE, user: req.user});
})

router.get("/register", (req, res) => {
  res.render("./page/register", {title: process.env.TITLE, user: req.user});
})
module.exports = router;
