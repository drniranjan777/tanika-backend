const JWTKeys = {
  userName: "u", // corresponds to "u" in Kotlin JWTKeys.userName
  userID: "i", // corresponds to "i" in Kotlin JWTKeys.userID
  token: "t", // corresponds to "t" in Kotlin JWTKeys.token
  loginType: "a", // corresponds to "a" in Kotlin JWTKeys.loginType
};

const ADMIN_LOGIN_TYPE = "_ad"; // Kotlin ADMIN_LOGIN_TYPE
const USER_LOGIN_TYPE = "_u"; // Kotlin USER_LOGIN_TYPE

module.exports = {
  JWTKeys,
  ADMIN_LOGIN_TYPE,
  USER_LOGIN_TYPE,
};
