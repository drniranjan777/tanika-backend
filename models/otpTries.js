const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");

const OTPTries = sequelize.define(
  "OTPTries",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mobileNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "mobile",
    },
    tries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "last_updated",
    },
  },
  {
    tableName: "otp_tries",
    timestamps: false,
  }
);

module.exports = OTPTries;
