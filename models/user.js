const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "number", // maps to DB column 'number' as Kotlin shows `varchar("number", 10)`
    },
    accountStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "account_status",
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_on",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
