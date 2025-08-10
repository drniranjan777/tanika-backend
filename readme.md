Token generation with constants

const jwt = require('jsonwebtoken');
const { JWTKeys, USER_LOGIN_TYPE, ADMIN_LOGIN_TYPE } = require('../config/constants');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function generateToken(user, isAdmin = false) {
  const payload = {
    [JWTKeys.userID]: user.id,
    [JWTKeys.userName]: user.name,
    [JWTKeys.loginType]: isAdmin ? ADMIN_LOGIN_TYPE : USER_LOGIN_TYPE,
    // you can optionally include other entries like [JWTKeys.token] etc.
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

module.exports = { generateToken };
