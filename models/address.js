const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // Assuming User model exists in models/user.js

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "pinCode", // preserve camelCase mapping if you want
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Maps to CurrentDateTime default
    },
  },
  {
    tableName: "addresses",
    timestamps: false, // since 'created' is managed manually, no Sequelize `createdAt`
  }
);

Address.belongsTo(User, { foreignKey: "userId" });

module.exports = Address;
