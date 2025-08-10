const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
const sequelize = require("../utils/config/database");


const ProductSection = sequelize.define(
  "ProductSection",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    url: { type: DataTypes.STRING(100), allowNull: false },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_on",
    },
  },
  {
    tableName: "product_section",
    timestamps: false,
  }
);

module.exports = ProductSection;
