const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();


// another Router use
const fileRouter = require('./file/fileRouter');
router.use('/file', fileRouter);
const apiRouter = require('./API/apiRouter');
router.use('/API', apiRouter);
const viewsRouter = require('./views/viewsRouter');
router.use('/views', viewsRouter);

router.get('/', function(req, res, next) {
  res.redirect('/views')
});

module.exports = router;
