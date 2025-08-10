const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");
const User = require("./user"); // user model
const Product = require("./product"); // products model
const SizeOption = require("./sizeOption"); // size option model

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "ID",
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    deviceID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "device_id",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_id",
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "size_id",
      references: {
        model: SizeOption,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "added_on",
    },
  },
  {
    tableName: "cart",
    timestamps: false, // your table manages timestamps manually
  }
);

// Setup associations if needed:
Cart.belongsTo(User, { foreignKey: "userID" });
Cart.belongsTo(Product, { foreignKey: "productId" });
Cart.belongsTo(SizeOption, { foreignKey: "sizeId" });

module.exports = Cart;
