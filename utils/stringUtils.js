const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

class StringUtilHelper {
  /**
   * Generate MD5 hash of given string
   * @param {string} input
   * @returns {string} lowercase hex MD5 hash, 32 chars
   */
  toMD5(input) {
    return crypto
      .createHash("md5")
      .update(input, "utf8")
      .digest("hex")
      .padStart(32, "0");
  }

  /**
   * Base64 encode a string. Optionally URL-safe.
   * @param {string} input
   * @param {boolean} isUrlSafe
   * @returns {string}
   */
  toBase64Encoded(input, isUrlSafe) {
    const base64 = Buffer.from(input, "utf8").toString("base64");
    if (isUrlSafe) {
      // URL-safe base64: replace + with -, / with _, remove trailing =
      return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return base64;
  }

  /**
   * Base64 decode a string. Supports URL-safe option.
   * @param {string} input
   * @param {boolean} isUrlSafe
   * @returns {string} decoded string in UTF-8
   */
  toBase64Decoded(input, isUrlSafe) {
    let base64 = input;
    if (isUrlSafe) {
      // Convert URL-safe base64 back to standard base64
      base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
      // Pad with '=' characters to make length a multiple of 4
      while (base64.length % 4) {
        base64 += "=";
      }
    }
    return Buffer.from(base64, "base64").toString("utf8");
  }

  /**
   * Generate random UUID v4 string
   * @returns {string}
   */
  generateUUID() {
    return uuidv4();
  }
}

module.exports = StringUtilHelper;
