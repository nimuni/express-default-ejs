const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
const ppUtil = require(process.cwd()+ "/js/passport/passportUtil.js")
const userController = require(process.cwd()+ '/js/controller/userController');
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
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        // res.status(400).json({ reason: info.reason });
        res.status(400);
        res.send({ reason: info.reason });
        return;
      }
  
      req.login(user, {session: false}, (err) => {
        if (err) {
          res.send(err);
          return;
        }
      })
  
      // 클라이언트에게 JWT생성 후 반환
      const token = jwt.sign(
        { email: user.email, name: user.name, auth: user.auth },
        process.env.SECRET_KEY
      );
  
      res.json({ token });
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