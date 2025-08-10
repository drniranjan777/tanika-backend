const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");

const SizeOption = sequelize.define(
  "SizeOption",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(40), allowNull: false },
    displayName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "display_name",
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_on",
    },
    activated: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "size_options",
    timestamps: false,
  }
);

module.exports = SizeOption;
