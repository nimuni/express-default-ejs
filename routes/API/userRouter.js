const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
require('dotenv').config();

router.post('/register', async function(req, res, next) { 
  try{
    const db = mongodb.getDb();
    console.log("req.body:")
    console.log(req.body)

    let user = {
      email: req.body.email,
      password: util.fn_aes256_encrypt(req.body.password),
      auth: "user",
      agreeTOSId: req.body.TOSId
    }

    console.log("user info:")
    console.log(user)

    const validCheck = function(user) {
      if(util.fn_valid_check_email(user.email)) 
        res.status(400).json({err: [{msg: "email 형식이 맞지 않습니다."}]})
      if(!user.agreeTOSId)
        res.status(400).json({err: [{msg: "이용약관 동의 형식이 맞지 않습니다."}]})
    }
    validCheck(user);

    let tempUser = await db.collection("user").findOne({email: user.email});
    if(tempUser) {
      console.log("user exist")
      res.status(400).json({err: [{msg: "email already exists"}]})
    } else {
      console.log("user didnt exist")
      db.collection("user").insertOne(user)
        .then(result => {
          console.log("insert result")
          console.log(result)
          res.redirect('/views')
        }).catch(err => {
          console.log("insert err")
          console.error(err)
          res.status(400).json({err: err})
        })
    }

  } catch(err) {
    res.status(400).send(err)
  }
})

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