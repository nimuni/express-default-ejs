const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongodb = require(process.cwd()+"/js/db/mongodb")
const util = require(process.cwd()+ "/js/common.util.js")
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const tokenService = require(process.cwd() + '/js/service/tokenService');
const userService = require(process.cwd()+ '/js/service/userService')

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

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

const jwtVerify = async (jwtPayload, done) => {
  try{
    console.log("call jwtVerify")
    console.log(jwtPayload)
    const db = mongodb.getDb();

    db.collection("user").findOne({email: jwtPayload.email}, (err, user) => {
      if (user) {
        done(null, user);
        return;
      }
      // 유저 데이터가 없을 경우 에러 표시
      done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
    })
  } catch(err) {
    console.error(err)
    done(err);
  }
}

const JWTConfig2 = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      console.log(1)
      console.log(req.cookies.accessToken)
      console.log(req.cookies.refreshToken)
      return { accessToken: req.cookies.accessToken, refreshToken: req.cookies.refreshToken };
    }
  ]),
  secretOrKey: process.env.SECRET_KEY,
};
const jwtVerify2 = async (jwtPayloadObject, done) => {
  try{
    console.log("call jwtVerify2")
    console.log(jwtPayload)
    const db = mongodb.getDb();
    const { accessToken, refreshToken } = jwtPayloadObject
    console.log("accessToken")
    console.log(accessToken)
    console.log("refreshToken")
    console.log(refreshToken)

    db.collection("user").findOne({email: jwtPayload.email}, (err, user) => {
      if (user) {
        done(null, user);
        return;
      } else {
        // 유저 데이터가 없을 경우 에러 표시
        done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
      }
    })
  } catch(err) {
    console.error(err)
    done(err);
  }
}

module.exports = () => {
  passport.use('local', new LocalStrategy(localConfig, localVerify));
  passport.use('jwt', new JWTStrategy(JWTConfig, jwtVerify));
  passport.use('jwt2', new JWTStrategy(JWTConfig2, jwtVerify2));
};

