const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const Category = require("./category");

const ProductCategories = sequelize.define(
  "ProductCategories",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "product_id",
      references: { model: Product, key: "id" },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "category_id",
      references: { model: Category, key: "id" },
    },
  },
  {
    tableName: "product_categories",
    timestamps: false,
  }
);

module.exports = ProductCategories;
