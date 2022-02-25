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

module.exports = {
  fn_valid_check_email,
  fn_valid_check_pw
};