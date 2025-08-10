const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");
const User = require("./user");

const OTPSessions = sequelize.define(
  "OTPSessions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sessionID: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: "session_id",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_date",
    },
  },
  {
    tableName: "otp_sessions",
    timestamps: false,
  }
);

OTPSessions.belongsTo(User, { foreignKey: "userID" });

module.exports = OTPSessions;
