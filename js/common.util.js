require('dotenv').config();
const cryptoJs = require("crypto-js");

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
  return JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
}

module.exports = {
  fn_aes256_encrypt,
  fn_aes256_decrypt
};