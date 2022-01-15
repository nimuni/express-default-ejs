require('dotenv').config();
const cryptojs = require("crypto-js");
const AES_256_KEY = process.env.AES_256_KEY;

module.exports = {
  fn_aes256_encrypt: function (data) {
    let str;
    console.log(`typeof data = ${typeof data}`)
    if(typeof data === "string"){
      str = data;
    } else if(typeof data === "object"){
      str = JSON.stringify(data);
    } else {
      throw "data is not string or json object"
    }
    console.log(cryptojs.AES.encrypt(str, AES_256_KEY).toString())
    return cryptojs.AES.encrypt(str, AES_256_KEY)
  },

  fn_aes256_decrypt: function (data) {
    let bytes = cryptojs.AES.decrypt(data, AES_256_KEY);
    return JSON.parse(bytes.toString(cryptojs.enc.Utf8));
  },
};