const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
const userService = require(process.cwd()+ '/js/service/userService')

exports.selectAll = async function(req, res, next) {
  try {
    let option;

    res.send(await userService.selectAll(option));
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.selectPage = async function(req, res, next) {
  try {
    let search, pageNumber, listCount;
    pageNumber = 1;
    listCount = 10;
    console.log("in controller")
    console.log(req.params.pageNumber)
    console.log(req.params.listCount)

    res.send(await userService.selectPage(search, pageNumber, listCount));
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.selectOne = async function(req, res, next) {
  try {
    let userSearch = { '_id': mongodb.objectId(req.params.id)} 

    res.send(await userService.selectOne(userSearch));
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.duplicateCheck = async function(req, res, next) {
  try {
    let userSearch = {};

    if(req.params.email) userSearch.email = req.params.email
    if(req.params.nickname) userSearch.nickname = req.params.nickname

    console.log("userSearch")
    console.log(userSearch)

    let result = await userService.selectOne(userSearch)
    console.log("result")
    console.log(result)
    console.log(!!result)
    if(!!result) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    res.status(400).json({err: err})
  }
}
exports.register = async function(req, res, next) {
  try{
    console.log("call register")
    console.log(req.body)
    const db = mongodb.getDb();

    let user = {
      insertDate: util.fn_get_date(),
      updateDate: util.fn_get_date(),
      email: req.body.email,
      nickname: req.body.nickname,
      password: util.fn_aes256_encrypt(req.body.password),
      auth: "user",
      agreeTOSId: req.body.TOSId,
      isUse: true,
      isStop: false,
      stopReason: ""
    }
    console.log("유저정보")
    console.log(user)

    const validCheck = function(user) {
      if(!util.fn_valid_check_email(user.email)) {
        res.status(400).json({err: [{msg: "email 형식이 맞지 않습니다."}]})
      }
      if(!user.agreeTOSId){
        res.status(400).json({err: [{msg: "이용약관 동의 형식이 맞지 않습니다."}]})
      }
    }
    validCheck(user);
    console.log("validcheck 클리어")

    let tempUser = await db.collection("user").findOne({email: user.email});
    if(tempUser) {
      console.log("user exist")
      res.status(400).json({err: [{msg: "email already exists"}]})
    } else {
      console.log("user not exist")
      db.collection("user").insertOne(user)
        .then(result => {
          console.log("insert result")
          console.log(result)
          // res.redirect('/views/login')
          res.send(result)
        }).catch(err => {
          console.log("insert err")
          console.error(err)
          res.status(400).json({err: err})
        })
    }

  } catch(err) {
    console.log(err)
    res.status(400).send(err)
  }
}

exports.updateOne = async function(req, res, next) {
  try {
    let tempData = {
      updateDate: util.fn_get_date()
    }
    if(req.body.email) tempData.email = req.body.email;
    if(req.body.password) tempData.password = util.fn_aes256_encrypt(req.body.password);
    if(req.body.auth) tempData.auth = req.body.auth;
    if(req.body.agreeTOSId) tempData.agreeTOSId = req.body.agreeTOSId;
    if(req.body.isUse) tempData.isUse = req.body.isUse;
    if(req.body.isStop) tempData.isStop = req.body.isStop;
    if(req.body.stopReason) tempData.stopReason = req.body.stopReason;

    let search = { '_id': mongodb.objectId(req.params.id) };
    let updateData = { $set: tempData };

    res.status(201).send(await userService.updateOne(search, updateData));
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}
exports.deleteOne = async function(req, res, next) {
  try {
    let user = {'_id': mongodb.objectId(req.params.id)}
    res.status(200).send(await userService.deleteOne(user))
  } catch (err) {
    res.status(400).json({err: err})
  }
}