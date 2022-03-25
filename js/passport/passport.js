const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const tokenService = require(process.cwd() + '/js/service/tokenService');
const userService = require(process.cwd()+ '/js/service/userService')
const { OAuth2Strategy } = require('passport-oauth')
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require('dotenv').config();

const localConfig = { usernameField: 'email', passwordField: 'password' };

const localVerify = async (email, password, done) => {
  try {
    const db = mongodb.getDb();
    console.log(`passport / local, email:${email}, pw: ${password}`)


		// 유저 아이디로 일치하는 유저 데이터 검색
    db.collection("user").findOne({email: email}, (err, user) => {
      if(err) { 
        console.error(err) 
        done(err);
      } else {
        // 검색된 유저 데이터가 없다면 에러 표시
        if (!user) {
          done(null, false, { reason: '존재하지 않는 사용자 입니다.' });
          return;
        }
        // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교 
        const compareResult = util.fn_aes256_decrypt(user.password) === password;

        // 해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
        if (compareResult) {
          done(null, user);
          return;
        }
        // 비밀번호가 다를경우 에러 표시
        done(null, false, { reason: '올바르지 않은 비밀번호 입니다.' });
      }
    })
  } catch (err) {
    console.error(err);
    done(err);
  }
};

const oauthGoogleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost/auth/google/callback",
  passReqToCallback: true,
}
const oauthGoogleVerify = async function (request, accessToken, refreshToken, profile, done) {
  try {
    console.log("profile in oauthGoogleVerify")
    console.log(profile);
    let search = { email:profile.email }
    let user = await userService.selectOne(search)
    delete user.password;
    console.log("call oauthGoogleVerify")
    console.log(request);
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log(user);
    
    return done(err, profile);
  } catch (err) {
    return done(err, profile);
  }
}

module.exports = () => {
  // login이 최초로 성공했을 때만 호출되는 함수
  // done(null, user.id)로 세션을 초기화 한다.
  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });

  // 사용자가 페이지를 방문할 때마다 호출되는 함수
  // done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
  passport.deserializeUser(async function (email, done) {
    try {
      let search = {email: email}
      let user = await userService.selectOne(search)
      delete user.password;
      done(null, user);
    } catch (err) {
      done(err, null)
    }
  });


  passport.use('local', new LocalStrategy(localConfig, localVerify));

  passport.use(new GoogleStrategy(oauthGoogleConfig, oauthGoogleVerify))
  
};

