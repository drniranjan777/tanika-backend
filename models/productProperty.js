const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");

const ProductProperty = sequelize.define(
  "ProductProperty",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    value: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "product_properties",
    timestamps: false,
  }
);

module.exports = ProductProperty;
