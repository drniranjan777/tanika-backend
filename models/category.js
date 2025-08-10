const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");

const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(40), allowNull: false },
    url: { type: DataTypes.STRING(100), allowNull: false },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_on",
    },
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);

module.exports = Category;
