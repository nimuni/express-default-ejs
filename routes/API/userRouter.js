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

router.get('/', userController.selectAll);
router.get('/:id', userController.selectAll);
router.get('/duplicate/email/:email', userController.duplicateCheck);
router.get('/duplicate/nickname/:nickname', userController.duplicateCheck);
router.post('/register', userController.register);
router.put('/:id', userController.updateOne);
router.delete('/:id', userController.deleteOne);

module.exports = router;