const jwt = require("jsonwebtoken");

/**
 * Decodes base64 secret string if needed
 * @param {string} secretBase64
 * @param {boolean} isBase64Encoded - whether the secret is base64 encoded
 * @returns {Buffer|string}
 */
function decodeSecret(secretBase64, isBase64Encoded = true) {
  if (isBase64Encoded) {
    return Buffer.from(secretBase64, "base64");
  }
  return secretBase64;
}

class JWTHelper {
  /**
   *
   * @param {string} secret base64-encoded secret string
   * @param {string} issuer
   * @param {string} audience
   * @param {number} jwtExpiryHrs - expiration time in hours
   */
  constructor(secret, issuer, audience, jwtExpiryHrs) {
    // Store decoded key buffer for signing
    this.secretKey = decodeSecret(secret, true);
    this.issuer = issuer;
    this.audience = audience;
    this.jwtExpiryHrs = jwtExpiryHrs;
  }

  /**
   * Creates a signed JWT token
   * @param {object} claims - custom claims to add
   * @returns {string}
   */
  createJWTToken(claims) {
    const options = {
      algorithm: "HS512",
      issuer: this.issuer,
      audience: this.audience,
      expiresIn: `${this.jwtExpiryHrs}h`,
    };

    return jwt.sign(claims, this.secretKey, options);
  }
}

module.exports = JWTHelper;
