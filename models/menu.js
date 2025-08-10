const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/config/database");

const MenuType = ["ITEM", "CATEGORY", "LINK"]; // Example enum, update as needed
const Location = ["HEADER", "FOOTER", "SIDEBAR"]; // Example enum

class Menu extends Model {}

Menu.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    display: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    payload: { type: DataTypes.TEXT },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "menu", key: "id" }, // lowercase
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_visible",
    },
    location: { type: DataTypes.INTEGER, allowNull: false },
    sectionHeader: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "sub_section_name",
    },
  },
  {
    sequelize,
    modelName: "Menu",
    tableName: "menu", // ✅ FIXED: match DB lowercase table name
    timestamps: false,
  }
);

module.exports = Menu;
