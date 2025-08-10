const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Product = require("./product");

const ProductReview = sequelize.define(
  "ProductReview",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_id",
      references: { model: Product, key: "id" },
    },
    comment: { type: DataTypes.TEXT, allowNull: false, field: "comments" },
    rating: { type: DataTypes.DOUBLE, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: { model: User, key: "id" },
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product_reviews",
    timestamps: false,
  }
);

ProductReview.belongsTo(Product, { foreignKey: "productId" });
ProductReview.belongsTo(User, { foreignKey: "userId" });

module.exports = ProductReview;
