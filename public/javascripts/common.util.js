const fn_valid_check_email = function(str){
  let reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  if(!reg_email.test(str)) { 
    return false;     
  } else {
    return true
  }
} 
const fn_valid_check_pw = function(str){
  /* let reg_pw = /^[a-zA-Z0-9]{1,14}$/ 
  if(!reg_pw.test(str)) { 
    return false;     
  } else {
    return true
  } */
  console.log(`str.length:${str.length}`)
  if(str.length > 4 && str.length <= 14){
    return true;
  } else {
    return false;
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