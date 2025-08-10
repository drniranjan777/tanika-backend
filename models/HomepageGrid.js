const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HomepageGrid = sequelize.define(
  "HomepageGrid",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    image1: {
      type: DataTypes.STRING,
      allowNull: false, // Change to false if required
    },

    image2: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    video: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "homepagegrid",
    timestamps: false, // Set to true if you need createdAt/updatedAt
  }
);

module.exports = HomepageGrid;
