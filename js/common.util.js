require('dotenv').config();
const cryptoJs = require("crypto-js");
const moment = require('moment-timezone');
const TIMEZONE = "Asia/Seoul";
/**
 * 참조시 const util = require(process.cwd()+ "/js/common.util.js")
 */

const fn_aes256_encrypt = function (data) {
  let result;
  console.log("call fn_aes256_encrypt")
  if(typeof data === 'string' || data instanceof String){
    result = cryptoJs.AES.encrypt(data, process.env.SECRET_KEY).toString()
  } else if(typeof data === "object"){
    result = JSON.stringify(data);
    cryptoJs.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString()
  } else {
    throw "data is not string or json object"
  }
  return result;
}

const fn_aes256_decrypt = function (data) {
  let bytes = cryptoJs.AES.decrypt(data, process.env.SECRET_KEY);
  let result = JSON.parse(bytes.toString(cryptoJs.enc.Utf8))
  return result.toString();
}

const fn_valid_check_email = function(str){
  let reg_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return reg_email.test(str);
} 
const fn_valid_check_pw = function(str){
  /* let reg_pw = /^[a-zA-Z0-9]{1,14}$/ 
  return true; */
  console.log(`fn_valid_check_pw str.length:${str.length}`)
  if(str.length >= 6 && str.length <= 14){
    return true;
  } else {
    return false;
  }
}
const fn_get_date = function(timeStr, form=moment.defaultFormat){
  if(!moment(timeStr).isValid()){
    throw `timeString is invalid: ${timeStr}`;
  }

  if(timeStr){
    return moment(timeStr).tz(TIMEZONE).format(form);
  } else {
    return moment().tz(TIMEZONE).format(form);
  }
}
const fn_valid_nickname = function(str){
  let reg_nickname = /^([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+){2,10}$/;
  console.log(`str.length:${str.length}`)
  if(!reg_nickname.test(str)) { 
    return false;     
  } else {
    return true
  }
}

module.exports = {
  fn_aes256_encrypt,
  fn_aes256_decrypt,
  fn_valid_check_email,
  fn_valid_check_pw,
  fn_get_date,
  fn_valid_nickname
};