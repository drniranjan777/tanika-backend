const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");
const Product = require("./product");
const SizeOption = require("./sizeOption");

const ProductsAndSizes = sequelize.define(
  "ProductsAndSizes",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "product_id",
      references: { model: Product, key: "id" },
    },
    sizeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "size_id",
      references: { model: SizeOption, key: "id" },
    },
  },
  {
    tableName: "product_sizes",
    timestamps: false,
  }
);

module.exports = ProductsAndSizes;
