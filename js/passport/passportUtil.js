module.exports = {
  loginCheckInUserPage: function(req, res, next) {
    if (typeof req.user == "undefined" || req.user == "") {
      res.redirect('/views/login')
    } else {
      console.log(`user name = ${JSON.stringify(req.user)}`)
      if(req.user.auth){
        if(req.user.auth === 'user' && (req.params.id === req.user.id)){
          next()
        } else if(req.user.auth === 'admin'){
          next()
        } else {
          res.redirect('/views/login');
        }
      } else {
        if(req.params.id === req.user.id){
          next();
        } else {
          res.redirect('/views/login');
        }
      }
    }
  },
  loginCheck: function(auth) {
    return function(req, res, next) {
      if (typeof req.user == "undefined" || req.user == "") {
        res.redirect('/views/login')
      } else {
        console.log(`user name = ${JSON.stringify(req.user)}`)
        if(auth){
          if(auth === req.user.auth){
            next()
          } else {
            res.status(400).json({err: "권한이 없습니다."});
          }
        } else {
          next()
        }
      }
    }
  }
} 