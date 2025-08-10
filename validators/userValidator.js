const Joi = require("joi");
const { InvalidRequest, InvalidOTP } = require("../errors"); // Define custom error classes as needed

const otpLoginVerificationSchema = Joi.object({
  otp: Joi.string().length(4).required(),
  did: Joi.string().required(), // device ID string required
  dataID: Joi.number().integer().positive().required(),
  name: Joi.string().optional().allow(null, ""),
});

const otpLoginRequestSchema = Joi.object({
  number: Joi.string().length(10).pattern(/^\d+$/).required(), // exactly 10 digits numeric string
});

function validateOTPLoginVerificationRequest(data) {
  const { error, value } = otpLoginVerificationSchema.validate(data);
  if (error) {
    if (error.details[0].context.key === "otp") {
      throw new InvalidOTP();
    }
    throw new InvalidRequest(error.message);
  }
  return value;
}

function validateOTPLoginRequest(data) {
  const { error, value } = otpLoginRequestSchema.validate(data);
  if (error) {
    throw new InvalidRequest("Invalid Mobile.");
  }
  return value;
}

module.exports = {
  validateOTPLoginVerificationRequest,
  validateOTPLoginRequest,
};
