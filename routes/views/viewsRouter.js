const express = require('express');
const router = express.Router();
require('dotenv').config();
const tosService = require(process.cwd()+ '/js/service/tosService')
const userService = require(process.cwd()+ '/js/service/userService')
const passport = require('passport');

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
router.get("/logout", (req, res) => {
  // 로그인이 되어있으면
  if (req.user) {
    req.logout();
    // res.clearCookie("remember_me");
    // res.locals.login = { loginyn: false };
  }
  res.render("./page/login", {title: process.env.TITLE, user: req.user});
})

router.get("/myPage", (req, res) => {
  if (req.user) {
    res.render("./page/myPage", {title: process.env.TITLE, user: req.user});
  } else {
    res.redirect("/views/login");
  }
})

router.get("/register", async (req, res) => {
  let requiredTos = await tosService.selectAll("required");
  let selectionTos = await tosService.selectAll("selection");
  
  res.render("./page/register", {title: process.env.TITLE, user: req.user, requiredTos:requiredTos, selectionTos:selectionTos});
})

router.get("/userInfo/:id", async (req, res) => {
  console.log("call /userInfo")
  console.log(req.params.id)
  res.send(req.params.id);
})

router.get("/userList", async (req, res) => {
  try {
    res.redirect("/views/userList/1")
  } catch (err) {
    console.error(err)
    res.status(400).send(err);
  }
})
router.get("/userList/:pageNumber", async (req, res) => {
  try {
    let search, pageNumber, pageSize;
    let result = await userService.selectPage(search, 1, 10)
    console.log("call userList")
    console.log(result)
    res.render("./page/userList", {
      title: process.env.TITLE, 
      user: req.user, 
      data: result.data,
      startPage: result.startPage,
      endPage: result.endPage,
      curruntPage: result.curruntPage,
      totalPage: result.totalPage,
    });
  } catch (err) {
    console.error(err)
    res.status(400).send(err);
  }
})

router.get("/settings", async (req, res, next) => {
  res.render("./page/settings", {title: process.env.TITLE, user: req.user})
})
module.exports = router;
