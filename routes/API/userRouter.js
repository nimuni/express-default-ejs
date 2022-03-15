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

router.get('/', ppUtil.loginCheck("admin"), userController.selectAll);
router.get('/:id', ppUtil.loginCheckInUserPage, userController.selectAll);
router.get('/duplicate/email/:email', userController.duplicateCheck);
router.get('/duplicate/nickname/:nickname', userController.duplicateCheck);
router.post('/register', userController.register);
router.put('/:id', ppUtil.loginCheckInUserPage, userController.updateOne);
router.delete('/:id', ppUtil.loginCheckInUserPage, userController.deleteOne);

router.post('/login/local', async function(req, res, next) {
  try {
    passport.authenticate('local', {session: false}, (passportError, user, info) => {
      if (passportError || !user) {
        // res.status(400).json({ reason: info.reason });
        res.status(400);
        res.send({ reason: info.reason });
        return;
      }
      console.log("call in /login/local")
      console.log(user)
      tempUser = JSON.parse(JSON.stringify(user));
      delete tempUser.password;
  
      req.login(user, {session: false}, async (err) => {
        if (err) {
          console.log(err);
          res.send(err);
        }

        const refreshToken = jwt.sign(tempUser, process.env.SECRET_KEY, { expiresIn:'14d'});
        const accessToken = jwt.sign(tempUser, process.env.SECRET_KEY, { expiresIn:'30m'});

        // refreshToken 저장
        let search = {userID: user._id};
        let updateData = {userID: user._id, userEmail: user.email, userNickname: user.nickname, refreshToken: refreshToken};
        await tokenService.updateOne(search, updateData);

        res.cookie('refreshToken', refreshToken, {httpOnly:true, maxAge: 1000*60*60*24*14})
        res.cookie('accessToken', accessToken, {httpOnly:true, maxAge: 1000*60*30})
        res.json({ user: tempUser, token: accessToken });
      })
    })(req, res, next);
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.post('/auth', passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
	  try {
	    res.json({ result: true });
	  } catch (err) {
	    console.error(err);
	    next(err);
	  }
});



module.exports = router;