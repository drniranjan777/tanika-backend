const axios = require("axios");

/**
 * OTPDriver: interacts with the 2Factor.in OTP API
 *
 * @param {string} apiKey - Your 2Factor API key
 * @param {string} template - The SMS template code/name to use
 */
class OTPDriver {
  /**
   * @param {string} apiKey
   * @param {string} template
   */
  constructor(apiKey, template) {
    this.apiKey = apiKey;
    this.template = template;
  }

  /**
   * Sends OTP to the specified phone number.
   * @param {string} phoneNumber
   * @returns {Promise<OtpResponse|null>}
   */
  async sendOtp(phoneNumber) {
    const url = `https://2factor.in/API/V1/${this.apiKey}/SMS/${phoneNumber}/AUTOGEN3/${this.template}`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data; // You can map to OtpResponse if needed
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Verifies the OTP for the provided session.
   * @param {string} otp
   * @param {string} session
   * @returns {Promise<OtpResponse|null>}
   */
  async verify(otp, session) {
    const url = `https://2factor.in/API/V1/${this.apiKey}/SMS/VERIFY/${session}/${otp}`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

module.exports = OTPDriver;
