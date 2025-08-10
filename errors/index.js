class ServerAppError extends Error {
  /**
   * @param {number} status - HTTP status code
   * @param {string} errorMessage - User friendly message
   * @param {number} errorCode - Application specific error code
   * @param {string} errorKey - Unique error identifier key
   */
  constructor(status, errorMessage, errorCode, errorKey) {
    super(errorMessage); // message property
    this.name = this.constructor.name;
    this.status = status;
    this.errorCode = errorCode;
    this.errorKey = errorKey;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error subclass that does NOT populate stack trace for performance
 * (If you want no stack, override stack with empty string)
 */
class ServerAppErrorNoStack extends ServerAppError {
  constructor(status, errorMessage, errorCode, errorKey) {
    super(status, errorMessage, errorCode, errorKey);
    this.stack = ""; // suppress stack trace
  }
}

// Specific error classes follow (with defaults matching Kotlin):

class OTPMaxTryLimit extends ServerAppErrorNoStack {
  constructor(
    message = "You've requested too many OTP requests, please retry later."
  ) {
    super(400, message, 1032, "too_many_otp");
  }
}

class OTPSendFailed extends ServerAppErrorNoStack {
  constructor(message = "Unable to send an otp, please retry later.") {
    super(400, message, 0, "otp_failure");
  }
}

class UnAuthorizedAccess extends ServerAppErrorNoStack {
  constructor(message = "UnAuthorized Request.") {
    super(401, message, 0, "unauthorized_request");
  }
}

class InvalidUserOrder extends ServerAppErrorNoStack {
  constructor(
    message = "Please check your credentials, unable to place order from your account."
  ) {
    super(400, message, 6565, "invalid_order_credentials");
  }
}

class InvalidRequest extends ServerAppErrorNoStack {
  constructor(message = "Invalid Request.") {
    super(400, message, 0, "invalid_credentials");
  }
}

class InvalidDevice extends ServerAppErrorNoStack {
  constructor(message = "Login not allowed on this device.") {
    super(500, message, 1, "invalid_device");
  }
}

class InvalidEmail extends ServerAppErrorNoStack {
  constructor(message = "Invalid Email.") {
    super(500, message, 2, "invalid_email");
  }
}

class AccountBlocked extends ServerAppErrorNoStack {
  constructor(message = "Unable to login, you are account is inaccessible.") {
    super(500, message, 26859, "account_blocked");
  }
}

class InvalidOTP extends ServerAppErrorNoStack {
  constructor(message = "Invalid OTP.") {
    super(500, message, 2, "invalid_otp");
  }
}

class DataNotFound extends ServerAppErrorNoStack {
  constructor(
    status = 500,
    message = "The data you are requesting is unavailable."
  ) {
    super(status, message, 5, "no_data");
  }
}

class ResNotFound extends ServerAppErrorNoStack {
  constructor(
    status = 404,
    message = "The resource you are requesting is unavailable."
  ) {
    super(status, message, 998, "no_res");
  }
}

class InvalidPassword extends ServerAppErrorNoStack {
  constructor(message = "Password must be minimum of 8 characters.") {
    super(500, message, 9, "invalid_password");
  }
}

class LoginFailed extends ServerAppErrorNoStack {
  constructor(message = "Invalid Credentials.") {
    super(500, message, 3, "invalid_credentials");
  }
}

class UserNameEmailNotUnique extends ServerAppErrorNoStack {
  constructor(message = "Username/Email already associated with an account.") {
    super(500, message, 10, "username_not_unique");
  }
}

class RegisterFailed extends ServerAppErrorNoStack {
  constructor(
    message = "User registration failed. Please retry later, if problem persists contact admin"
  ) {
    super(500, message, 11, "register_failed");
  }
}

class InvalidUsername extends ServerAppErrorNoStack {
  constructor(message = "This account is either inactive or doesn't exist.") {
    super(500, message, 12, "invalid_email");
  }
}

class UploadFailure extends ServerAppErrorNoStack {
  constructor(
    message = "Something went wrong while trying to upload image, retry later."
  ) {
    super(500, message, 13, "upload_fail");
  }
}

class StaffCreateFailed extends ServerAppErrorNoStack {
  constructor(
    message = "Something went wrong while trying to verify staff create, please retry later."
  ) {
    super(500, message, 14, "staff_create_fail");
  }
}

class GenericFailure extends ServerAppErrorNoStack {
  constructor(
    status = 500,
    message = "Something went wrong, please retry later.",
    errorKey = "_unknown_failure_occured.",
    errorCode = 999
  ) {
    super(status, message, errorCode, errorKey);
  }
}

module.exports = {
  ServerAppError,
  ServerAppErrorNoStack,
  OTPMaxTryLimit,
  OTPSendFailed,
  UnAuthorizedAccess,
  InvalidUserOrder,
  InvalidRequest,
  InvalidDevice,
  InvalidEmail,
  AccountBlocked,
  InvalidOTP,
  DataNotFound,
  ResNotFound,
  InvalidPassword,
  LoginFailed,
  UserNameEmailNotUnique,
  RegisterFailed,
  InvalidUsername,
  UploadFailure,
  StaffCreateFailed,
  GenericFailure,
};
