const { Op } = require("sequelize");
const sequelize = require("../config/database"); // Your Sequelize instance
const { Admin, AdminAuthorizationData, AdminForgot } = require("../models");

class AdminRepository {
  constructor() {}

  async updateUserDetails(id, email, isActive) {
    const [updated] = await Admin.update(
      { email, isActive },
      { where: { id } }
    );
    return updated > 0;
  }

  async createForgotPasswordToken(userID) {
    const created = await AdminForgot.create({ adminID: userID });
    return created.id;
  }

  async getUserByForgotPasswordToken(fgpID) {
    const record = await AdminForgot.findOne({
      where: { id: fgpID },
      include: [{ model: Admin }],
    });
    if (!record) return null;
    return { created: record.created, admin: record.Admin }; // adjust fields as needed
  }

  async clearExpiredForgotTokens() {
    const expiryTime = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    await AdminForgot.destroy({
      where: { created: { [Op.lt]: expiryTime } },
    });
  }

  async clearExpiredForgotTokensForUser(userID) {
    await AdminForgot.destroy({
      where: { adminID: userID },
    });
  }

  async removeUsedForgotRecord(fgpID) {
    const deleted = await AdminForgot.destroy({ where: { id: fgpID } });
    return deleted > 0;
  }

  async clearExpiredTokens() {
    const now = new Date();
    await AdminAuthorizationData.destroy({
      where: { expiry: { [Op.lt]: now } },
    });
  }

  async clearTokenForUserID(id) {
    const deleted = await AdminAuthorizationData.destroy({
      where: { adminID: id },
    });
    return deleted > 0;
  }

  async insertUserAuthToken(id, token) {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 60); // 60 hours from now
    const created = await AdminAuthorizationData.create({
      adminID: id,
      token,
      expiry: expiryDate,
    });
    return created.id;
  }

  async getUserByID(id) {
    return Admin.findByPk(id);
  }

  async getUserByUsernameAndPassword(username, password) {
    return Admin.findOne({
      where: { userName: username, password },
    });
  }

  async getUserByUserIDAndPassword(userID, password) {
    return Admin.findOne({
      where: { id: userID, password },
    });
  }

  async getUserByTokenAndID(id, token) {
    return Admin.findOne({
      where: { id },
      include: [
        {
          model: AdminAuthorizationData,
          where: { token },
          required: true,
        },
      ],
    });
  }

  async insertUser({ userName, password, email, isActive }) {
    const created = await Admin.create({
      userName,
      password,
      email,
      isActive,
    });
    return created.id;
  }

  async isUsernameUnique(username, email) {
    const user = await Admin.findOne({
      where: {
        [Op.or]: [{ userName: username }, { email }],
      },
      attributes: ["id"],
    });
    return user ? user.id : null;
  }

  async updatePassword(password, userID) {
    const [updated] = await Admin.update(
      { password },
      { where: { id: userID } }
    );
    return updated > 0;
  }

  async getUserAndPasswordByID(id) {
    return Admin.findOne({ where: { id } });
  }

  async getUserAndPasswordByUserName(username) {
    return Admin.findOne({ where: { userName: username } });
  }

  async getUserByUserName(username) {
    return Admin.findOne({ where: { userName: username } });
  }

  async getUserBySearch(username) {
    return Admin.findAll({
      where: { userName: { [Op.like]: `%${username}%` } },
    });
  }
}

module.exports = AdminRepository;
