const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { runTransaction } = require("../config/dbTransactionManager");
const {
  User,
  OTPSessions,
  OTPTries,
  UserAuthorizationData,
} = require("../models");

class UserRepository {
  // Check if token exists for a user
  async checkIfTokenExists(userID) {
    return runTransaction(sequelize, async (transaction) => {
      const record = await UserAuthorizationData.findOne({
        where: { userID },
        transaction,
      });

      if (!record) return null;
      return { authID: record.id, userID: record.userID };
    });
  }

  // Insert new token record for user
  async insertToUserAuthToken(token, userID) {
    return runTransaction(sequelize, async (transaction) => {
      const created = await UserAuthorizationData.create(
        { token, userID },
        { transaction }
      );
      return { authID: created.id, token };
    });
  }

  // Update user token by auth ID
  async updateUserAuthToken(token, authID) {
    return runTransaction(sequelize, async (transaction) => {
      const [updatedCount] = await UserAuthorizationData.update(
        { token },
        { where: { id: authID }, transaction }
      );
      return { authID, token };
    });
  }

  // Create or update token for user
  async createToken(token, userID) {
    return runTransaction(sequelize, async (transaction) => {
      const tokenExists = await UserAuthorizationData.findOne({
        where: { userID },
        transaction,
      });

      if (tokenExists) {
        return this.updateUserAuthToken(token, tokenExists.id);
      } else {
        return this.insertToUserAuthToken(token, userID);
      }
    });
  }

  // Delete OTP session by session ID
  async deleteSession(session) {
    return runTransaction(sequelize, async (transaction) => {
      const deletedCount = await OTPSessions.destroy({
        where: { sessionID: session },
        transaction,
      });
      return deletedCount;
    });
  }

  // Delete all OTP sessions for a user
  async deleteAllSessions(userID) {
    return runTransaction(sequelize, async (transaction) => {
      const deletedCount = await OTPSessions.destroy({
        where: { userID },
        transaction,
      });
      return deletedCount;
    });
  }

  // Get OTP tries records for a mobile number ordered by last updated desc
  async getOTPTries(mobile) {
    return runTransaction(sequelize, async (transaction) => {
      const triesRecords = await OTPTries.findAll({
        where: { mobileNumber: mobile },
        order: [["lastUpdated", "DESC"]],
        transaction,
      });
      return triesRecords; // You can map to plain JS objects if needed
    });
  }

  // Insert a new OTP tries record (starts with tries = 1)
  async insertOTPTries(mobile) {
    return runTransaction(sequelize, async (transaction) => {
      const created = await OTPTries.create(
        {
          mobileNumber: mobile,
          tries: 1,
          lastUpdated: new Date(),
        },
        { transaction }
      );
      return created.id;
    });
  }

  // Reset OTP tries record (set tries = 0, update timestamp)
  async resetOTPTries(mobile) {
    return runTransaction(sequelize, async (transaction) => {
      await OTPTries.update(
        {
          tries: 0,
          lastUpdated: new Date(),
        },
        { where: { mobileNumber: mobile }, transaction }
      );
    });
  }

  // Increment OTP tries record (tries += 1, update timestamp)
  async updateOTPTries(mobile) {
    return runTransaction(sequelize, async (transaction) => {
      // Use increment helper for atomic increment
      await OTPTries.increment("tries", {
        by: 1,
        where: { mobileNumber: mobile },
        transaction,
      });

      // Also update lastUpdated timestamp
      await OTPTries.update(
        { lastUpdated: new Date() },
        { where: { mobileNumber: mobile }, transaction }
      );
    });
  }

  // Get new users count within a specific date (considering whole day)
  async getNewUsersByDate(date) {
    return runTransaction(sequelize, async (transaction) => {
      // Create start and end of day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const count = await User.count({
        where: {
          addedOn: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
        transaction,
      });
      return count;
    });
  }
}

module.exports = new UserRepository();
