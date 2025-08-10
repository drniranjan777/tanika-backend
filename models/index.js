// models/index.js

const User = require("./user");
const Address = require("./address");
const OTPSessions = require("./otpSession");
const OTPTries = require("./otpTries");
const UserAuthorizationData = require("./userAuthorizationData");
const Cart = require("./cart");
const Product = require("./product");
const ProductSection = require("./productSection");
const ProductsAndSections = require("./productsAndSections");
const SizeOption = require("./sizeOption");
const ProductsAndSizes = require("./productsAndSizes");
const Category = require("./category");
const ProductCategories = require("./productCategories");
const ProductProperty = require("./productProperty");
const ProductsAndProperties = require("./productsAndProperties");
const ProductReview = require("./productReview");
const ProductReviewImage = require("./productReviewImages");

// Setup any associations between models here

User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

OTPSessions.belongsTo(User, { foreignKey: "userID" });
UserAuthorizationData.belongsTo(User, { foreignKey: "userID" });

Product.belongsToMany(ProductSection, {
  through: ProductsAndSections,
  foreignKey: "productId",
});
ProductSection.belongsToMany(Product, {
  through: ProductsAndSections,
  foreignKey: "sectionId",
});

Product.belongsToMany(SizeOption, {
  through: ProductsAndSizes,
  foreignKey: "productId",
});
SizeOption.belongsToMany(Product, {
  through: ProductsAndSizes,
  foreignKey: "sizeId",
});

Product.belongsToMany(Category, {
  through: ProductCategories,
  foreignKey: "productId",
});
Category.belongsToMany(Product, {
  through: ProductCategories,
  foreignKey: "categoryId",
});

Product.belongsToMany(ProductProperty, {
  through: ProductsAndProperties,
  foreignKey: "productId",
});
ProductProperty.belongsToMany(Product, {
  through: ProductsAndProperties,
  foreignKey: "propertyId",
});

ProductReview.hasMany(ProductReviewImage, { foreignKey: "productReviewId" });
ProductReviewImage.belongsTo(ProductReview, { foreignKey: "productReviewId" });

module.exports = {
  User,
  Address,
  OTPSessions,
  OTPTries,
  UserAuthorizationData,
  Cart,
  Product,
  ProductSection,
  ProductsAndSections,
  SizeOption,
  ProductsAndSizes,
  Category,
  ProductCategories,
  ProductProperty,
  ProductsAndProperties,
  ProductReview,
  ProductReviewImage,
};
