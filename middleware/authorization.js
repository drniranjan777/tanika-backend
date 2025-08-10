const jwt = require("jsonwebtoken");
const { JWTKeys } = require("../config/constants");

// Secret key (set this securely via environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * Express middleware to authorize users by JWT Bearer token in Authorization header.
 * If valid, attaches { id, ... } to req.user
 */
function authorize(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // map JWT payload keys to user info on req.user
    req.user = {
      id: decoded[JWTKeys.userID],
      name: decoded[JWTKeys.userName],
      loginType: decoded[JWTKeys.loginType],
      // optionally include full token or other claims if needed
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorizeOrNull(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null; // unauthenticated
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded[JWTKeys.userID],
      name: decoded[JWTKeys.userName],
      loginType: decoded[JWTKeys.loginType],
    };
    next();
  } catch (err) {
    req.user = null; // invalid token
    next();
  }
}

function authorizedAdmin(req, res, next) {
  if (!req.user || req.user.loginType !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }
  next();
}

module.exports = { authorize, authorizeOrNull, authorizedAdmin };
