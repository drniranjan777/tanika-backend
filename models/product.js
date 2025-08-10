const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
const sequelize = require("../utils/config/database");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false, field: "desc" },
    thumbnail: { type: DataTypes.TEXT, allowNull: false, field: "preview_url" },
    visibility: { type: DataTypes.BOOLEAN, defaultValue: true },
    screens: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    discount: { type: DataTypes.DOUBLE, allowNull: false },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "is_featured",
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_on",
    },
    vanityUrl: { type: DataTypes.TEXT },
    orderedTimes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "order_times",
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Product;
