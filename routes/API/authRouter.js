const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
const ppUtil = require(process.cwd()+ "/js/passport/passportUtil.js")
const userController = require(process.cwd() + '/js/controller/userController');
const tokenService = require(process.cwd() + '/js/service/tokenService');
require('dotenv').config();

// test oauth
router.post('/login/local', async function(req, res, next) {
  try {
    passport.authenticate('local', {session: true}, (passportError, user, info) => {
      if (passportError || !user) {
        // res.status(400).json({ reason: info.reason });
        res.status(400);
        res.send({ reason: info.reason });
        return;
      }
      console.log("call in /auth/login/local")
      console.log(user)
      tempUser = JSON.parse(JSON.stringify(user));
      delete tempUser.password;
  
      req.login(user, {session: true}, async (err) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        res.json({ user: tempUser });
      })
    })(req, res, next);
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/views/login' }),
  (req, res) => {
    console.log("/auth/google/callback ")
    res.redirect("/views");
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/views/login");
})

module.exports = router;