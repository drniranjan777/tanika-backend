const { Op } = require("sequelize");

class UserRepository {
  constructor(UserModel) {
    this.User = UserModel;
  }

  async createUser(userData) {
    return await this.User.create(userData);
  }

  async findByEmail(email) {
    return await this.User.findOne({ where: { gmail: email } });
  }

  async findById(id) {
    return await this.User.findByPk(id);
  }

  async setResetToken(email, token, expiry) {
    const [updated] = await this.User.update(
      { resetToken: token, resetTokenExpiry: expiry },
      { where: { gmail: email } }
    );
    return updated > 0;
  }

  async findByResetToken(token) {
    return await this.User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });
  }

  async updatePassword(id, newPassword) {
    const [updated] = await this.User.update(
      {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
      { where: { id } }
    );
    return updated > 0;
  }
}

module.exports = UserRepository;
