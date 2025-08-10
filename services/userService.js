const userRepository = require("../repositories/userRepository");
const cartRepository = require("../repositories/cartRepository");
const otpDriver = require("../utils/otpDriver"); // your OTP driver
const jwtUtils = require("../utils/jwtUtils");
const validator = require("../utils/validator"); // Joi or custom validator
const pagingUtils = require("../utils/pagingUtils");
const { generateUUID } = require("../utils/generateUUID");
const { JWTKeys, USER_LOGIN_TYPE } = require("../utils/config/constants");

class UserService {
  async getTotalUsers() {
    return userRepository.getActivatedUsersCount();
  }

  async getUsers(offset) {
    return userRepository.getActivatedUsers(offset);
  }

  async getAllUsers(page) {
    const count = await userRepository.getUsersCount();
    const offset = pagingUtils.toOffset(page);
    const items = await userRepository.getUsers(offset);
    return pagingUtils.create(count, items);
  }

  async toggleBlock(userID) {
    const user = await userRepository.getUserOrNull(userID);
    if (!user) {
      return { status: false };
    }
    const status =
      user.accountStatus === AccountStatus.BLOCKED
        ? AccountStatus.CREATED
        : AccountStatus.BLOCKED;

    const result = await userRepository.setUserAccount(userID, status);
    return { status: result > 0 };
  }

  async updateName(name, id) {
    const result = await userRepository.updateName(name, id);
    return { status: result > 0 };
  }

  // Internal helper: checking OTP eligibility logic similar to Kotlin code
  async isOTPEligible(mobile) {
    const otpTryRecords = await userRepository.getOTPTries(mobile);
    if (!otpTryRecords.length) {
      const insertedId = await userRepository.insertOTPTries(mobile);
      return insertedId > 0;
    }

    // Aggregate tries and check time window (10 minutes)
    const totalTries = otpTryRecords.reduce((sum, rec) => sum + rec.tries, 0);
    const lastTryDate = otpTryRecords[0].date; // assuming sorted desc

    const TEN_MINUTES = 10 * 60 * 1000;
    const now = Date.now();

    if (
      totalTries <= 5 ||
      now - new Date(lastTryDate).getTime() >= TEN_MINUTES
    ) {
      if (now - new Date(lastTryDate).getTime() >= TEN_MINUTES) {
        await userRepository.resetOTPTries(mobile);
      }
      await userRepository.updateOTPTries(mobile);
      return true;
    }
    return false;
  }

  async sendOtp(phoneNumber) {
    const response = await otpDriver.sendOtp(phoneNumber);
    return response ? response.Details : null;
  }

  // resendOtp implementation
  async resendOtp(userID) {
    const user = await this.getUser(userID);
    const eligible = await this.isOTPEligible(user.phoneNumber);
    if (!eligible) throw new Error("OTPSendFailed");

    await userRepository.deleteAllSessions(userID);
    const session = await this.sendOtp(user.phoneNumber);
    if (!session) throw new Error("OTPSendFailed");

    return { status: true };
  }

  async verifyOtp(otp, session, userID) {
    const verification = await otpDriver.verify(otp, session);
    const success = verification ? verification.isSuccess() : false;
    if (success) {
      await userRepository.setUserAccount(userID, AccountStatus.ACTIVATED);
    }
    return { status: success };
  }

  async authorizeRequest(uniqueToken, userID) {
    const user = await userRepository.getUserByTokenAndID(userID, uniqueToken);
    return user !== null;
  }

  async getUser(userID) {
    return userRepository.getUserById(userID);
  }

  async authorizeLoginRequest(userID, deviceID, token) {
    return userRepository.authorizeUser(userID, deviceID, token);
  }

  async loginWithOTP(request) {
    // Perform validation (assumes validator throws on invalid)
    await validator.validateOTPLoginRequest(request);

    const existingUser = await userRepository.getByPhone(request.number);

    const registerUser = async () => {
      const userID = await userRepository.registerByOTP(request.number);
      const eligible = await this.isOTPEligible(request.number);
      if (!eligible) throw new Error("OTPMaxTryLimit");

      await userRepository.deleteAllSessions(userID);
      const session = await this.sendOtp(request.number);
      if (session) {
        await userRepository.saveOtpSession(session, userID);
      }
      return { userID, status: AccountStatus.CREATED };
    };

    if (existingUser) {
      if (existingUser.accountStatus === AccountStatus.BLOCKED) {
        throw new Error("AccountBlocked");
      }
      const eligible = await this.isOTPEligible(request.number);
      if (!eligible) throw new Error("OTPMaxTryLimit");

      await userRepository.deleteAllSessions(existingUser.id);
      const session = await this.sendOtp(request.number);
      if (session) {
        await userRepository.saveOtpSession(session, existingUser.id);
      }
      return { userID: existingUser.id, status: existingUser.accountStatus };
    } else {
      return registerUser();
    }
  }

  async verifyOTPLogin(request) {
    await validator.validateOTPLoginVerificationRequest(request);

    const otpSessionHash = await userRepository.getOtpSession(request.dataID);
    if (!otpSessionHash) throw new Error("InvalidOTP");

    if (request.name) {
      await userRepository.updateName(request.name, request.dataID);
    }

    const verifyResult = await this.verifyOtp(
      request.otp,
      otpSessionHash,
      request.dataID
    );
    if (!verifyResult.status) throw new Error("InvalidOTP");

    const user = await this.getUser(request.dataID);
    const uniqueToken = generateUUID();

    await userRepository.createToken(uniqueToken, request.dataID);

    const jwtToken = jwtUtils.createJWTToken({
      [JWTKeys.userName]: user.name,
      [JWTKeys.userID]: user.id,
      [JWTKeys.token]: uniqueToken,
      [JWTKeys.loginType]: USER_LOGIN_TYPE,
    });

    await userRepository.deleteSession(otpSessionHash);

    // Transfer cart if deviceId present
    if (request.did) {
      await cartRepository.transferCart(request.did, request.dataID);
    }

    return { jwtToken, user };
  }
}

module.exports = new UserService();
