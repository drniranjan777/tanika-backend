const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config/database");

const HomepageGrid = sequelize.define(
  "FrontendUser",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gmail:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
  },
  {
    tableName: "frontend_users",
    timestamps: false, // Set to true if you need createdAt/updatedAt
  }
);

module.exports = HomepageGrid;
