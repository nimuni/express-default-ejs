const express = require('express');
const router = express.Router();

// another Router use
const fileRouter = require('./file/fileRouter');
router.use('/file', fileRouter);

const apiRouter = require('./API/apiRouter');
router.use('/API', apiRouter);

const viewsRouter = require('./views/viewsRouter');
router.use('/views', viewsRouter);

const authRouter = require('./API/authRouter');
router.use('/auth', authRouter);

router.get('/', function(req, res, next) {
  res.redirect('/views')
});

module.exports = router;
