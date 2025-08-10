const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const UserAuthorizationData = sequelize.define(
  "UserAuthorizationData",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    generatedOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "generated_on",
    },
    lastRefreshed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "last_refresh",
    },
  },
  {
    tableName: "user_auth_table",
    timestamps: false,
  }
);

UserAuthorizationData.belongsTo(User, { foreignKey: "userID" });

module.exports = UserAuthorizationData;
