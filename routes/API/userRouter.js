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

router.get('/all', userController.selectAll);
router.get('/page/:pageNumber/:listCount', userController.selectPage);
router.get('/id/:id', userController.selectOne);
router.put('/id/:id', userController.updateOne);
router.delete('/id/:id', userController.deleteOne);
router.get('/duplicate/email/:email', userController.duplicateCheck);
router.get('/duplicate/nickname/:nickname', userController.duplicateCheck);
router.post('/register', userController.register);

module.exports = router;