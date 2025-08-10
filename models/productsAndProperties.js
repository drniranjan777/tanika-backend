const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const ProductProperty = require("./productProperty");

const ProductsAndProperties = sequelize.define(
  "ProductsAndProperties",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "product_id",
      references: { model: Product, key: "id" },
    },
    propertyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "property_id",
      references: { model: ProductProperty, key: "id" },
    },
  },
  {
    tableName: "product_properties_relation",
    timestamps: false,
  }
);

module.exports = ProductsAndProperties;
