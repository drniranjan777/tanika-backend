const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
const Product = require("./product");
const ProductSection = require("./productSection");
const sequelize = require("../utils/config/database");

const ProductsAndSections = sequelize.define(
  "ProductsAndSections",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "product_id",
      references: { model: Product, key: "id" },
    },
    sectionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "section_id",
      references: { model: ProductSection, key: "id" },
    },
  },
  {
    tableName: "product_sections_relation",
    timestamps: false,
  }
);

module.exports = ProductsAndSections;
