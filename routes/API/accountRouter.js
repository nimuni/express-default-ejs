const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");

router.post('/login/local', async function(req, res, next) {
  try {
    passport.authenticate('local', (passportError, user, info) => {
      if (passportError || !user) {
        res.status(400).json({ message: info.reason });
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
	  } catch (error) {
	    console.error(error);
	    next(error);
	  }
});

module.exports = router;