require('dotenv').config();
const cryptoJs = require("crypto-js");
const moment = require('moment-timezone');
const TIMEZONE = "Asia/Seoul";
/**
 * 참조시 const util = require(process.cwd()+ "/js/common.util.js")
 */

const fn_aes256_encrypt = function (data) {
  let str;
  if(typeof data === "string"){
    str = data;
  } else if(typeof data === "object"){
    str = JSON.stringify(data);
  } else {
    throw "data is not string or json object"
  }
  return cryptoJs.AES.encrypt(str, process.env.AES_KEY).toString()
}

const fn_aes256_decrypt = function (data) {
  let bytes = cryptoJs.AES.decrypt(data, process.env.AES_KEY);
  let result = JSON.parse(bytes.toString(cryptoJs.enc.Utf8))
  return result.toString();
}

const fn_valid_check_email = function(str){
  let reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  if(!reg_email.test(str)) { 
    return false;     
  } else {
    return true
  }
} 
const fn_valid_check_pw = function(str){
  let reg_pw = /^[a-zA-Z0-9]{1,14}$/ 
  return true;
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

module.exports = {
  fn_aes256_encrypt,
  fn_aes256_decrypt,
  fn_valid_check_email,
  fn_valid_check_pw,
  fn_get_date
};