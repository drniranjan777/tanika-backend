const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

const sequelize = require("../utils/config/database");
const ProductReview = require("./productReview");

const ProductReviewImage = sequelize.define(
  "ProductReviewImage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productReviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_review_id",
      references: { model: ProductReview, key: "id" },
    },
    image: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM("type1", "type2", "type3"), // replace 'type1', etc. with your AttachmentType values
      allowNull: false,
    },
  },
  {
    tableName: "product_review_images",
    timestamps: false,
  }
);

ProductReviewImage.belongsTo(ProductReview, { foreignKey: "productReviewId" });

module.exports = ProductReviewImage;
