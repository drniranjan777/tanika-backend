const jwt = require("jsonwebtoken"); // or whatever token library you use
const { InvalidRequest } = require("../errors"); // your error class

module.exports = async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // adjust your config
      req.user = decoded; // or load user from DB if needed
    } catch (err) {
      // Ignore token errors, proceed without user for optional auth
    }
  }
  next();
};
