const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/config/database");
const User = require("./user");
const Product = require("./product");

class Wishlist extends Model {}

Wishlist.init(
  {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      field: "user_id",
    },
    deviceID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "device_id",
    },
    productID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      field: "product_id",
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_on",
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "wishlist",
    timestamps: false, // You can enable timestamps if you have createdAt/updatedAt
  }
);

// Define associations (optional, if not defined elsewhere)
Wishlist.belongsTo(User, { foreignKey: "userID", as: "user" });
Wishlist.belongsTo(Product, { foreignKey: "productID", as: "product" });

module.exports = Wishlist;
